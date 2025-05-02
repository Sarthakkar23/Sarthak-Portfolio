import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { FaRobot } from "react-icons/fa";
import { processRepository } from "../../utils/aiGeneration";
import "./ProjectCards.css";

/**
 * Enhanced project card that can use AI-generated content
 */
function EnhancedProjectCard(props) {
  const [enhancedContent, setEnhancedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  useEffect(() => {
    // If we already have AI-generated content, use it
    if (props.enhancedDescription || props.aiGeneratedImage) {
      setEnhancedContent({
        description: props.enhancedDescription || props.description,
        imageUrl: props.aiGeneratedImage || props.imgPath,
      });
      setIsAiGenerated(true);
      return;
    }

    // Otherwise, check if we should generate content
    if (props.repo && props.useAi) {
      generateContent();
    }
  }, [props.repo, props.useAi]);

  const generateContent = async () => {
    if (!props.repo) return;
    
    setIsLoading(true);
    try {
      // Set a timeout to prevent hanging if the API is slow
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Content generation timed out')), 15000)
      );
      
      // Race the actual processing against the timeout
      const processedRepo = await Promise.race([
        processRepository(props.repo),
        timeoutPromise
      ]);
      
      setEnhancedContent({
        description: processedRepo.enhancedDescription || props.description,
        imageUrl: processedRepo.imageUrl || props.imgPath,
      });
      
      setIsAiGenerated(true);
    } catch (error) {
      console.error("Error generating content:", error);
      // Show a user-friendly message
      setEnhancedContent({
        description: props.description,
        imageUrl: props.imgPath,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine what to display
  const displayDescription = enhancedContent?.description || props.description;
  const displayImage = enhancedContent?.imageUrl || props.imgPath;

  return (
    <Card className="project-card-view">
      {/* Image section */}
      {typeof displayImage === 'string' ? (
        <Card.Img variant="top" src={displayImage} alt="card-img" />
      ) : (
        <div className="card-img-component">{displayImage}</div>
      )}
      
      {/* AI badge if content was generated */}
      {isAiGenerated && (
        <div className="ai-badge" title="AI-enhanced content">
          <FaRobot />
        </div>
      )}
      
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        
        {/* Description with loading state */}
        <Card.Text style={{ textAlign: "justify" }}>
          {isLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Generating AI content...</p>
            </div>
          ) : (
            typeof displayDescription === 'string' ? displayDescription : displayDescription
          )}
        </Card.Text>
        
        {/* Action buttons */}
        <Button variant="primary" href={props.ghLink} target="_blank">
          <BsGithub /> &nbsp;
          {props.isBlog ? "Blog" : "GitHub"}
        </Button>
        {props.demoLink && (
          <Button
            variant="primary"
            href={props.demoLink}
            target="_blank"
            style={{ marginLeft: "10px" }}
          >
            <CgWebsite /> &nbsp;
            {"Demo"}
          </Button>
        )}
        
        {/* Manual AI generation button */}
        {props.repo && !isAiGenerated && !isLoading && (
          <Button
            variant="outline-secondary"
            onClick={generateContent}
            className="ai-generate-btn"
            title="Generate AI content for this project"
          >
            <FaRobot /> &nbsp;
            Enhance
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default EnhancedProjectCard;