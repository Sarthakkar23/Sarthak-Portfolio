/**
 * AI Generation Utilities
 * 
 * This module provides functions to automatically generate images and descriptions
 * for GitHub repositories using AI services.
 */

import axios from 'axios';
import config from '../config';

/**
 * Generate a description for a repository using OpenAI's API
 * 
 * @param {Object} repo - The repository object from GitHub API
 * @returns {Promise<string>} - AI-generated description
 */
export const generateRepoDescription = async (repo) => {
  try {
    // Skip if the repo already has a good description
    if (repo.description && repo.description.length > 50) {
      console.log(`Repository ${repo.name} already has a good description.`);
      return repo.description;
    }

    // Check if OpenAI API key is configured
    if (!config.ai.openAiKey) {
      console.warn("OpenAI API key not configured. Using default description.");
      return repo.description || `A ${repo.language || 'software'} project by ${repo.owner.login}.`;
    }

    // Prepare the prompt for the AI
    const prompt = `
      Generate a professional and engaging description for a GitHub repository named "${repo.name}".
      
      Repository information:
      - Name: ${repo.name}
      - Owner: ${repo.owner.login}
      - Language: ${repo.language || 'Not specified'}
      - Topics: ${repo.topics ? repo.topics.join(', ') : 'None'}
      - Original description: ${repo.description || 'None'}
      
      The description should be 2-3 sentences long, highlight the purpose of the project,
      the technologies used, and the problem it solves. Make it sound professional and engaging.
      Do not use phrases like "This repository contains" or "This is a project".
      
      Description:
    `;

    // Make API call to OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.openAiKey}`,
        },
      }
    );

    // Extract and clean the generated description
    let generatedDescription = response.data.choices[0].text.trim();
    
    console.log(`Generated description for ${repo.name}: ${generatedDescription}`);
    return generatedDescription;
  } catch (error) {
    console.error(`Error generating description for ${repo.name}:`, error);
    // Fall back to the original description or a default one
    return repo.description || `A ${repo.language || 'software'} project by ${repo.owner.login}.`;
  }
};

/**
 * Generate an image for a repository using an AI image generation service
 * 
 * @param {Object} repo - The repository object from GitHub API
 * @returns {Promise<string>} - URL to the generated image
 */
export const generateRepoImage = async (repo) => {
  try {
    // Prepare the prompt for the AI image generation
    const prompt = `
      Create a professional, modern thumbnail image for a software project called "${repo.name}".
      ${repo.language ? `The project is written in ${repo.language}.` : ''}
      ${repo.description ? `The project is about: ${repo.description}` : ''}
      Style: Minimalist, tech-focused, with subtle gradients and clean typography.
      Include visual elements related to coding and software development.
      No text needed in the image.
    `;

    // For demonstration purposes, we'll use a placeholder image service
    // In a real implementation, you would call an AI image generation API like DALL-E or Stable Diffusion
    const imageUrl = `https://via.placeholder.com/800x600/6e8efb/ffffff?text=${encodeURIComponent(repo.name)}`;
    
    console.log(`Generated image for ${repo.name}: ${imageUrl}`);
    return imageUrl;
    
    /* 
    // Example implementation with an actual AI image generation API
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.openAiKey}`,
        },
      }
    );
    
    return response.data.data[0].url;
    */
  } catch (error) {
    console.error(`Error generating image for ${repo.name}:`, error);
    // Fall back to a default image
    return null;
  }
};

/**
 * Save generated content to local storage for persistence
 * 
 * @param {string} repoName - Name of the repository
 * @param {Object} content - Generated content (description and image URL)
 */
// In-memory fallback storage when localStorage is not available
const memoryStorage = {
  generatedContent: {}
};

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const saveGeneratedContent = (repoName, content) => {
  try {
    // Create the content object with timestamp
    const contentWithTimestamp = {
      ...content,
      timestamp: new Date().toISOString(),
    };
    
    // Try to use localStorage first
    if (isLocalStorageAvailable()) {
      // Get existing content from local storage
      const storedContent = localStorage.getItem('generatedRepoContent');
      const contentMap = storedContent ? JSON.parse(storedContent) : {};
      
      // Add or update the content for this repository
      contentMap[repoName] = contentWithTimestamp;
      
      // Save back to local storage
      localStorage.setItem('generatedRepoContent', JSON.stringify(contentMap));
    } else {
      // Fallback to memory storage
      memoryStorage.generatedContent[repoName] = contentWithTimestamp;
    }
    
    console.log(`Saved generated content for ${repoName}`);
  } catch (error) {
    console.error(`Error saving generated content for ${repoName}:`, error);
    // Last resort fallback
    memoryStorage.generatedContent[repoName] = {
      ...content,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get previously generated content for a repository
 * 
 * @param {string} repoName - Name of the repository
 * @returns {Object|null} - The generated content or null if not found
 */
export const getGeneratedContent = (repoName) => {
  try {
    // Try localStorage first
    if (isLocalStorageAvailable()) {
      const storedContent = localStorage.getItem('generatedRepoContent');
      if (storedContent) {
        const contentMap = JSON.parse(storedContent);
        return contentMap[repoName] || null;
      }
    }
    
    // Fallback to memory storage
    return memoryStorage.generatedContent[repoName] || null;
  } catch (error) {
    console.error(`Error retrieving generated content for ${repoName}:`, error);
    // Try memory storage as last resort
    return memoryStorage.generatedContent[repoName] || null;
  }
};

/**
 * Main function to process a repository and generate content if needed
 * 
 * @param {Object} repo - The repository object from GitHub API
 * @returns {Promise<Object>} - Repository with enhanced content
 */
export const processRepository = async (repo) => {
  // Check if we already have generated content for this repo
  const existingContent = getGeneratedContent(repo.name);
  
  if (existingContent) {
    console.log(`Using existing generated content for ${repo.name}`);
    return {
      ...repo,
      enhancedDescription: existingContent.description,
      imageUrl: existingContent.imageUrl,
    };
  }
  
  // Generate new content
  const [description, imageUrl] = await Promise.all([
    generateRepoDescription(repo),
    generateRepoImage(repo),
  ]);
  
  // Save the generated content
  saveGeneratedContent(repo.name, {
    description,
    imageUrl,
  });
  
  return {
    ...repo,
    enhancedDescription: description,
    imageUrl,
  };
};

export default {
  generateRepoDescription,
  generateRepoImage,
  processRepository,
  saveGeneratedContent,
  getGeneratedContent,
};