# Sarthak Kar's Portfolio

A futuristic, AI/ML-themed personal portfolio website built with React.

## Features

- Modern, responsive design with a futuristic AI/ML theme
- Interactive particle background
- Animated typing effect
- Project showcase
- Skills and tools display
- GitHub contribution calendar
- Resume section

## Technologies Used

- React.js
- React Bootstrap
- React Router
- React Icons
- React Particles
- React GitHub Calendar
- Typewriter Effect

## Installation and Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Sarthakkar23/portfolio.git
   ```

2. Change into the directory
   ```bash
   cd portfolio
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   npm start
   ```

5. Build for production
   ```bash
   npm run build
   ```

## Customization

- Update personal information in the components
- Replace placeholder images with your own
- Add more projects to the Projects component
- Update your skills in the Techstack component
- Add your resume link in the Resume component

## Deployment

This site can be easily deployed to platforms like:
- Vercel
- Netlify
- GitHub Pages

## License

This project is open source and available under the MIT License.

## Updating the site

- **New projects appear automatically.** The Home and Projects pages read your public GitHub repos live
  (no redeploy needed). For a good-looking card, give the repo a **description**, a few **topics**
  (e.g. `llm`, `computer-vision`) and, if it has one, a **website** link — that becomes the "Live demo" button.
- **Feature a project with metrics:** add it to `src/data/projects.js` with the same `repo` name.
- **Hide a repo:** add its name to `hiddenRepos` in `src/data/projects.js`.
- **About page / résumé facts:** edit `src/data/resume.js`. Replace the PDF in `src/assets/resume/`.
- **Images:** `src/assets/avatar.webp` (hero, 3D) and `src/assets/portrait.webp` (About photo).
