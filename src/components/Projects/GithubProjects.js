import React, { useState, useEffect } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import EnhancedProjectCard from "./EnhancedProjectCard";
import { getRepoImage } from "./repoImageUtils"; // Custom utility for repo images
import "./GithubProjects.css";
import config from "../../config";
import { startRepoMonitor, stopRepoMonitor } from "../../utils/repoMonitor";

function GithubProjects({ username = config.github.username, hideTitle = false }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const { reposToShow, excludeForks, sortBy, excludeRepos, featuredRepos, refreshInterval } = config.github;

  const fetchRepos = async () => {
    try {
      setLoading(true);
      // Fetch repositories from GitHub API
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=${sortBy}&per_page=100`
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Debug: Log all repository names to help with troubleshooting
      console.log("All repositories:", data.map(repo => repo.name));
      
      // First filter repositories based on configuration
      let filteredRepos = data
        .filter(repo => !(excludeForks && repo.fork)) // Filter out forks if configured
        .filter(repo => {
          // Case-insensitive check for excluded repos
          const isExcluded = excludeRepos.some(excluded => 
            excluded.toLowerCase() === repo.name.toLowerCase()
          );
          
          // Special check for Clear Pixel AI (any variation)
          const isClearPixelAI = repo.name.toLowerCase().includes('clear') && 
                                repo.name.toLowerCase().includes('pixel');
          
          if (isClearPixelAI) {
            console.log(`Excluding Clear Pixel AI repository: ${repo.name}`);
            return false;
          }
          
          return !isExcluded;
        });
      
      // Handle featured repositories - prioritize them
      if (featuredRepos && featuredRepos.length > 0) {
        // Separate featured repos from the rest
        const featured = [];
        const rest = [];
        
        filteredRepos.forEach(repo => {
          // Case-insensitive check for featured repos
          if (featuredRepos.some(featured => 
            featured.toLowerCase() === repo.name.toLowerCase()
          )) {
            featured.push(repo);
          } else {
            rest.push(repo);
          }
        });
        
        // Sort featured repos according to their order in the featuredRepos array
        featured.sort((a, b) => {
          // Find the index of each repo in the featuredRepos array (case-insensitive)
          const indexA = featuredRepos.findIndex(
            name => name.toLowerCase() === a.name.toLowerCase()
          );
          const indexB = featuredRepos.findIndex(
            name => name.toLowerCase() === b.name.toLowerCase()
          );
          return indexA - indexB;
        });
        
        // Sort the rest based on the configured sort method
        rest.sort((a, b) => {
          if (sortBy === "updated") {
            return new Date(b.updated_at) - new Date(a.updated_at);
          } else if (sortBy === "created") {
            return new Date(b.created_at) - new Date(a.created_at);
          } else if (sortBy === "pushed") {
            return new Date(b.pushed_at) - new Date(a.pushed_at);
          } else {
            // Default to name sorting
            return a.name.localeCompare(b.name);
          }
        });
        
        // Combine featured repos with the rest
        filteredRepos = [...featured, ...rest].slice(0, reposToShow);
      } else {
        // No featured repos, just sort normally
        filteredRepos = filteredRepos
          .sort((a, b) => {
            if (sortBy === "updated") {
              return new Date(b.updated_at) - new Date(a.updated_at);
            } else if (sortBy === "created") {
              return new Date(b.created_at) - new Date(a.created_at);
            } else if (sortBy === "pushed") {
              return new Date(b.pushed_at) - new Date(a.pushed_at);
            } else {
              // Default to name sorting
              return a.name.localeCompare(b.name);
            }
          })
          .slice(0, reposToShow); // Limit to configured number of repos
      }
      
      // Debug: Log filtered repositories
      console.log("Filtered repositories:", filteredRepos.map(repo => repo.name));
      
      // Final check: Remove any duplicates by name (case-insensitive)
      const uniqueRepos = [];
      const repoNames = new Set();
      
      filteredRepos.forEach(repo => {
        const lowerName = repo.name.toLowerCase();
        if (!repoNames.has(lowerName)) {
          repoNames.add(lowerName);
          uniqueRepos.push(repo);
        } else {
          console.log(`Removed duplicate repository: ${repo.name}`);
        }
      });
      
      setRepos(uniqueRepos);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching GitHub repositories:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchRepos();
      
      // Set up auto-refresh if enabled
      let refreshTimer;
      if (refreshInterval > 0) {
        // Convert minutes to milliseconds
        const refreshMs = refreshInterval * 60 * 1000;
        refreshTimer = setInterval(fetchRepos, refreshMs);
      }
      
      // Start the repository monitor if AI is enabled
      let monitorId;
      if (config.ai.enabled) {
        monitorId = startRepoMonitor(config.ai.checkInterval);
      }
      
      // Clean up timers on component unmount
      return () => {
        if (refreshTimer) {
          clearInterval(refreshTimer);
        }
        if (monitorId) {
          stopRepoMonitor(monitorId);
        }
      };
    }
  }, [username, reposToShow, excludeForks, sortBy, excludeRepos, featuredRepos, refreshInterval]);

  if (loading) {
    return (
      <Col md={8} className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2" style={{ color: "white" }}>Loading GitHub projects...</p>
      </Col>
    );
  }

  if (error) {
    return (
      <Col md={8} className="text-center">
        <p style={{ color: "white" }}>Error loading GitHub projects: {error}</p>
      </Col>
    );
  }

  // Function to format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to create a description with additional repo info
  const createEnhancedDescription = (repo) => {
    const description = repo.description || "No description available";
    const updatedAt = `Last updated: ${formatDate(repo.updated_at)}`;
    const language = repo.language ? `Main language: ${repo.language}` : "";
    
    return (
      <>
        {description}
        <div className="repo-stats">
          {language && <span className="repo-language">{language}</span>}
          <span>⭐ {repo.stargazers_count}</span>
          <span>🍴 {repo.forks_count}</span>
        </div>
        <div className="repo-updated">{updatedAt}</div>
      </>
    );
  };

  // We're now using the imported getRepoImage utility

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return "";
    
    const options = { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    };
    
    return `Last updated: ${lastUpdated.toLocaleDateString(undefined, options)}`;
  };

  return (
    <>
      {!hideTitle && (
        <>
          <h2 className="project-heading mt-5">
            My GitHub <strong className="purple">Repositories</strong>
          </h2>
          <p style={{ color: "white" }}>
            These are my latest GitHub repositories (automatically updated)
           {lastUpdated && (
              <span className="last-updated-time">
                {formatLastUpdated()}
              </span>
            )}
          </p>
        </>
      )}
      
       {repos.map((repo) => (
        <Col md={4} className="project-card github-repo-card" key={repo.id}>
          {config.ai.enabled ? (
            <EnhancedProjectCard
              imgPath={getRepoImage(repo)}
              isBlog={false}
              title={repo.name}
              description={createEnhancedDescription(repo)}
              ghLink={repo.html_url}
              demoLink={repo.homepage || ""}
              repo={repo}
              useAi={config.ai.enabled}
            />
          ) : (
            <ProjectCard
              imgPath={getRepoImage(repo)}
              isBlog={false}
              title={repo.name}
              description={createEnhancedDescription(repo)}
              ghLink={repo.html_url}
              demoLink={repo.homepage || ""}
            />
          )}
        </Col>
      ))}
      
      {/* Small indicator at the bottom showing when data was last fetched */}
      {lastUpdated && hideTitle && (
        <Col xs={12} className="text-center mt-3">
          <small style={{ color: "#aaa", fontSize: "0.8rem" }}>
            {formatLastUpdated()}
            {refreshInterval > 0 && ` · Auto-refreshes every ${refreshInterval} minutes`}
          </small>
        </Col>
      )}
    </>
  );
}

export default GithubProjects;