# AI Integration for GitHub Projects

This folder contains utilities for automatically generating images and descriptions for your GitHub repositories using AI.

## How It Works

1. The system periodically checks your GitHub account for new repositories
2. When a new repository is found, it uses AI to generate:
   - A professional description based on the repository name, language, and topics
   - A custom image that visually represents the project

## Setup Instructions

### 1. API Keys

To use the AI generation features, you'll need to set up API keys:

1. Create a `.env` file in the root of your project
2. Add the following environment variables:

```
REACT_APP_OPENAI_KEY=your_openai_api_key
REACT_APP_GITHUB_TOKEN=your_github_personal_access_token
```

You can get these keys from:
- OpenAI API key: https://platform.openai.com/account/api-keys
- GitHub personal access token: https://github.com/settings/tokens

### 2. Configuration

You can customize the AI generation in the `src/config.js` file:

```javascript
ai: {
  // Enable or disable automatic AI generation
  enabled: true,
  
  // How often to check for new repositories (in minutes)
  checkInterval: 120,
  
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
    maxLength: 150,
    tone: "professional", // Options: "professional", "casual", "technical"
  }
}
```

### 3. Image Storage

By default, generated images are stored as URLs in localStorage. For a production environment, you might want to:

1. Save the images to a cloud storage service (like AWS S3 or Firebase Storage)
2. Implement a server-side component to handle image generation and storage

## Manual Generation

You can also manually trigger AI generation for any repository by clicking the "Enhance" button on the project card.

## Customization

### Changing the AI Model

The default implementation uses OpenAI's text-davinci-003 model for descriptions. You can change this in `aiGeneration.js`:

```javascript
const response = await axios.post(
  'https://api.openai.com/v1/completions',
  {
    model: 'text-davinci-003', // Change to your preferred model
    prompt,
    max_tokens: 150,
    temperature: 0.7,
  },
  // ...
);
```

### Using Different Image Generation Services

The current implementation uses placeholder images. To use a real AI image generation service:

1. Uncomment the example implementation in `generateRepoImage()` function
2. Replace with your preferred service (DALL-E, Stable Diffusion, etc.)

## Troubleshooting

- **Rate Limiting**: Be aware of API rate limits for both GitHub and OpenAI
- **Storage Limits**: localStorage has a size limit (~5MB); consider alternative storage for many repositories
- **API Costs**: AI image generation can incur costs; monitor your usage

## Further Enhancements

- Implement a queue system for processing repositories
- Add more customization options for image generation
- Create a UI for managing generated content
- Implement server-side processing for better performance and reliability