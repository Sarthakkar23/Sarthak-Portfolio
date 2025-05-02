// Configuration file for portfolio settings

const config = {
  // GitHub integration settings
  github: {
    username: "Sarthakkar23", // Your GitHub username
    reposToShow: 5, // Number of repositories to display (5 is good for a 2x3 grid with the featured project)
    excludeForks: true, // Whether to exclude forked repositories
    sortBy: "updated", // Sort repositories by: "updated", "created", "pushed", "full_name"
    
    // Add specific repositories you want to exclude from display
    // For example, you might want to exclude your portfolio repo since it's already featured
    excludeRepos: [
      "Sarthak-Portfolio", 
      "Clear-Pixel-AI",
      "ClearPixelAI",
      "clear-pixel-ai"
    ],
    
    // Featured repositories that will always be shown first (if they exist)
    // These will be shown in the order listed here
    featuredRepos: [
      // Add repo names here that you want to prioritize
      // Example: "awesome-project", "cool-app"
    ],
    
    // Auto-refresh interval in minutes (0 to disable)
    // This will refresh the GitHub data when a user stays on the page
    refreshInterval: 60,
    
    // Optional: GitHub personal access token for higher API rate limits
    // ⚠️ IMPORTANT: Set this in your .env file as REACT_APP_GITHUB_TOKEN
    // Create one at https://github.com/settings/tokens
    // See .env.example for instructions
    accessToken: process.env.REACT_APP_GITHUB_TOKEN || "",
  },
  
  // Social media links
  socialMedia: {
    github: "https://github.com/Sarthakkar23",
    linkedin: "https://www.linkedin.com/in/sarthak-kar-2283692a7/",
    instagram: "https://www.instagram.com/sarxthak_23/",
    // Add more social media links as needed
  },
  
  // Project section customization
  projects: {
    // The catchy tagline shown under the Projects heading
    tagline: "Turning coffee into code and ideas into reality, one commit at a time."
  },
  
  // AI generation settings
  ai: {
    // Enable or disable automatic AI generation for new repositories
    enabled: true,
    
    // How often to check for new repositories (in minutes)
    checkInterval: 120, // 2 hours
    
    // OpenAI API key for generating descriptions and images
    // ⚠️ IMPORTANT: Set this in your .env file as REACT_APP_OPENAI_KEY
    // See .env.example for instructions
    openAiKey: process.env.REACT_APP_OPENAI_KEY || "",
    
    // Image generation settings
    images: {
      enabled: true,
      width: 800,
      height: 600,
      style: "modern", // Options: "modern", "minimalist", "colorful", "tech"
    },
    
    // Description generation settings
    descriptions: {
      enabled: true,
      maxLength: 150, // Maximum length in characters
      tone: "professional", // Options: "professional", "casual", "technical"
    },
    
    // Storage settings
    storage: {
      // Where to store generated content
      type: "localStorage", // Options: "localStorage", "firebase", "api"
      
      // How long to cache generated content before regenerating (in days)
      cacheDuration: 30,
    }
  }
};

export default config;