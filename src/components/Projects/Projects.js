import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import EnhancedProjectCard from "./EnhancedProjectCard";
import GithubProjects from "./GithubProjects";
import Particle from "../Particle";
import ImagePlaceholder from "./ImagePlaceholder"; // Temporary placeholder
import config from "../../config";

// When you add the actual image, replace the ImagePlaceholder with:
// import clearPixelAIImage from "../../assets/projects/clear-pixel-ai.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My <strong className="purple">Projects</strong>
        </h1>
        <p style={{ color: "white", marginBottom: "30px" }}>
          {config.projects.tagline}
        </p>
        
        {/* Combined Projects Section - Featured and GitHub Projects */}
        <Row style={{ justifyContent: "center", paddingBottom: "30px" }}>
          {/* Featured Project - Manually added and excluded from GitHub API results */}
          <Col md={4} className="project-card github-repo-card" style={{ animationDelay: "0s" }}>
            <EnhancedProjectCard
              imgPath={<ImagePlaceholder />}
              isBlog={false}
              title="Clear Pixel AI"
              description="An advanced image enhancement project that uses deep learning techniques to improve image quality. This project focuses on image denoising, super-resolution, and color correction using state-of-the-art AI models."
              ghLink="https://github.com/Sarthakkar23/Clear-Pixel-AI"
              demoLink=""
              // This is a manually featured project, so we don't need AI generation
              useAi={false}
            />
          </Col>
          
          {/* GitHub Projects - Automatically updates with latest repos */}
          <GithubProjects 
            username={config.github.username} 
            hideTitle={true} // We'll add a prop to hide the title since we're using a unified heading
          />
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;