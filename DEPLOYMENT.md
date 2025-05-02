# Deploying Your Portfolio to Vercel

This guide will walk you through deploying your portfolio website to Vercel.

## Prerequisites

- A Vercel account (you can sign up at [vercel.com](https://vercel.com))
- Git installed on your computer (optional, but recommended)

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   - Create a GitHub repository for your portfolio
   - Push your code to the repository

2. **Import your project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will automatically detect that it's a React application

3. **Configure your project**
   - Project Name: Choose a name for your project (e.g., "sarthak-portfolio")
   - Framework Preset: Make sure "Create React App" is selected
   - Build and Output Settings: Leave as default (Vercel will use the settings from vercel.json)
   - Environment Variables: No need to add any for this project

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll get a URL where your site is live (e.g., https://sarthak-portfolio.vercel.app)

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy your project**
   ```bash
   cd "/Users/sarthakkar/Documents/Sarthak Portfolio"
   vercel --prod
   ```

4. **Follow the prompts**
   - Set up and deploy: Yes
   - Link to existing project: No (if this is your first deployment)
   - Project name: sarthak-portfolio (or your preferred name)
   - Directory: ./ (current directory)

## Troubleshooting

If you encounter the error "Command 'npm run build' exited with 1", it's likely due to ESLint warnings being treated as errors in the CI environment. We've already fixed this by:

1. Modifying the build script in package.json to include `CI=false`
2. Creating a .env file with `CI=false`
3. Updating vercel.json to include the buildCommand with `CI=false`
4. Fixing absolute file paths in imports

## Custom Domain (Optional)

To add a custom domain to your Vercel deployment:

1. Go to your project dashboard in Vercel
2. Click on "Settings" > "Domains"
3. Add your domain and follow the instructions to set up DNS records

## Automatic Deployments

When you connect your GitHub repository to Vercel, any changes you push to your repository will automatically trigger a new deployment. This makes it easy to keep your portfolio up-to-date.

## Vercel Analytics (Optional)

Vercel offers built-in analytics for your website:

1. Go to your project dashboard in Vercel
2. Click on "Analytics"
3. Follow the instructions to enable analytics

## Conclusion

Your portfolio is now deployed on Vercel! You can share the URL with potential employers and collaborators. Remember to keep your portfolio updated with your latest projects and skills.