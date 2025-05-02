// Import default project images
import defaultImage from "../../assets/projects/ai-project.png";
// We'll use the placeholder component instead of trying to import a file that doesn't exist yet
// import clearPixelAIImage from "../../assets/projects/clear-pixel-ai.png";

// Map of programming languages to appropriate images
// You can replace these with actual images for different languages/frameworks
const languageImageMap = {
  // Default image used for all repositories
  default: defaultImage,
  
  // Special project images
  // We'll handle Clear Pixel AI with a custom component instead
  // "Clear-Pixel-AI": clearPixelAIImage,
  
  // You can add more mappings as you create images for different languages
  // For example:
  // JavaScript: jsImage,
  // Python: pythonImage,
  // React: reactImage,
  // etc.
};

/**
 * Get an appropriate image for a repository based on its language or name
 * @param {Object} repo - The repository object from GitHub API
 * @returns {string} - Path to the image
 */
export const getRepoImage = (repo) => {
  if (!repo) return languageImageMap.default;
  
  // Check if we have a specific image for this repository
  if (languageImageMap[repo.name]) {
    return languageImageMap[repo.name];
  }
  
  // Check if we have an image for this language
  if (repo.language && languageImageMap[repo.language]) {
    return languageImageMap[repo.language];
  }
  
  // Check for keywords in repository name to assign appropriate images
  const repoNameLower = repo.name.toLowerCase();
  
  // You can add more keyword-based image assignments here
  // For example:
  // if (repoNameLower.includes('web') || repoNameLower.includes('site')) {
  //   return webImage;
  // }
  
  // Fall back to default image
  return languageImageMap.default;
};

export default getRepoImage;