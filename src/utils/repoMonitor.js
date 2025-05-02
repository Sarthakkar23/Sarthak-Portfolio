/**
 * Repository Monitor Service
 * 
 * This module provides a background service that periodically checks for new GitHub repositories
 * and generates AI content for them.
 */

import axios from 'axios';
import config from '../config';
import { processRepository } from './aiGeneration';

// Keep track of repositories we've already processed
let processedRepos = new Set();

/**
 * Fetch all repositories for a user from GitHub API
 * 
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} - Array of repository objects
 */
export const fetchAllRepositories = async (username) => {
  try {
    // Validate username
    if (!username) {
      console.error('GitHub username not provided');
      return [];
    }
    
    // Set up headers with or without token
    const headers = {
      Accept: 'application/vnd.github.v3+json',
    };
    
    // Add authorization header if token is available
    if (config.github.accessToken) {
      headers.Authorization = `token ${config.github.accessToken}`;
    }
    
    // Make the API request
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
};

/**
 * Find repositories that need AI content generation
 * 
 * @param {Array} repos - Array of repository objects
 * @returns {Array} - Repositories that need processing
 */
export const findReposNeedingProcessing = (repos) => {
  return repos.filter(repo => {
    // Skip repositories we've already processed
    if (processedRepos.has(repo.id)) {
      return false;
    }
    
    // Skip repositories in the exclude list
    if (config.github.excludeRepos.some(
      excluded => excluded.toLowerCase() === repo.name.toLowerCase()
    )) {
      return false;
    }
    
    // Skip forks if configured to do so
    if (config.github.excludeForks && repo.fork) {
      return false;
    }
    
    return true;
  });
};

/**
 * Process new repositories and generate AI content
 * 
 * @returns {Promise<Array>} - Processed repositories
 */
export const processNewRepositories = async () => {
  try {
    console.log('Checking for new repositories...');
    
    // Fetch all repositories
    const repos = await fetchAllRepositories(config.github.username);
    
    // Find repositories that need processing
    const reposToProcess = findReposNeedingProcessing(repos);
    
    if (reposToProcess.length === 0) {
      console.log('No new repositories to process.');
      return [];
    }
    
    console.log(`Found ${reposToProcess.length} new repositories to process.`);
    
    // Process each repository
    const processedRepoPromises = reposToProcess.map(async repo => {
      console.log(`Processing repository: ${repo.name}`);
      const processedRepo = await processRepository(repo);
      
      // Mark as processed
      processedRepos.add(repo.id);
      
      return processedRepo;
    });
    
    const processedRepos = await Promise.all(processedRepoPromises);
    console.log(`Successfully processed ${processedRepos.length} repositories.`);
    
    return processedRepos;
  } catch (error) {
    console.error('Error processing new repositories:', error);
    return [];
  }
};

/**
 * Start the repository monitor service
 * 
 * @param {number} intervalMinutes - How often to check for new repositories (in minutes)
 * @returns {number} - Interval ID for stopping the service
 */
export const startRepoMonitor = (intervalMinutes = 60) => {
  console.log(`Starting repository monitor service. Checking every ${intervalMinutes} minutes.`);
  
  // Validate interval
  const validInterval = Math.max(5, intervalMinutes); // Minimum 5 minutes
  
  // Create a wrapper function to catch any errors
  const safeProcessRepositories = async () => {
    try {
      await processNewRepositories();
    } catch (error) {
      console.error('Error in repository monitor:', error);
      // Continue running despite errors
    }
  };
  
  // Run immediately on start (but don't block)
  setTimeout(safeProcessRepositories, 5000); // Wait 5 seconds after page load
  
  // Then set up interval
  const intervalMs = validInterval * 60 * 1000;
  return setInterval(safeProcessRepositories, intervalMs);
};

/**
 * Stop the repository monitor service
 * 
 * @param {number} intervalId - Interval ID from startRepoMonitor
 */
export const stopRepoMonitor = (intervalId) => {
  clearInterval(intervalId);
  console.log('Repository monitor service stopped.');
};

export default {
  startRepoMonitor,
  stopRepoMonitor,
  processNewRepositories,
  fetchAllRepositories,
};