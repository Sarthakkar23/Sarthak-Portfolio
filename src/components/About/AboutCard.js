import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ 
            fontSize: "1.5em", 
            fontWeight: "bold", 
            marginBottom: "15px", 
            color: "#c770f0",
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
          }}>
            🚀 Hey there! I&apos;m <span className="purple" style={{fontSize: "1.1em"}}>Sarthak Kar</span> 👋
          </p>
          
          <p style={{ 
            fontSize: "1.1em", 
            marginBottom: "20px", 
            color: "#8a8fa3",
            borderLeft: "3px solid #c770f0",
            paddingLeft: "10px"
          }}>
            🌍 From <span className="purple">India</span> | 🎓 AIML Enthusiast | 💡 Future Innovator
          </p>
          
          <p style={{ 
            textAlign: "left", 
            fontSize: "1.05em",
            lineHeight: "1.6",
            marginBottom: "20px"
          }}>
            I&apos;m a second-year student diving deep into the world of Artificial Intelligence and Machine Learning, 
            where data meets creativity and logic sparks innovation! I&apos;m driven by curiosity, fueled by challenges, 
            and excited by the endless possibilities AI has to offer.
          </p>
          
          <p style={{ 
            fontSize: "1.1em", 
            fontWeight: "bold",
            marginBottom: "15px", 
            color: "#c770f0",
            borderLeft: "3px solid #c770f0",
            paddingLeft: "10px"
          }}>
            💥 Beyond the Code – What Fires Me Up:
          </p>
          
          <p style={{ 
            textAlign: "left", 
            fontSize: "1.05em",
            lineHeight: "1.6",
            marginBottom: "10px"
          }}>
            <ImPointRight style={{ color: "#c770f0", marginRight: "10px" }} /> 
            🔬 Geeking out over the latest AI breakthroughs
          </p>
          
          <p style={{ 
            textAlign: "left", 
            fontSize: "1.05em",
            lineHeight: "1.6",
            marginBottom: "10px"
          }}>
            <ImPointRight style={{ color: "#c770f0", marginRight: "10px" }} /> 
            📚 Diving into cutting-edge research papers
          </p>
          
          <p style={{ 
            textAlign: "left", 
            fontSize: "1.05em",
            lineHeight: "1.6",
            marginBottom: "20px"
          }}>
            <ImPointRight style={{ color: "#c770f0", marginRight: "10px" }} /> 
            ⚡ Bringing ideas to life in hackathons and tech sprints
          </p>
          
          <p style={{ 
            textAlign: "left",
            fontSize: "1.05em",
            lineHeight: "1.6",
            marginBottom: "20px",
            borderLeft: "3px solid #c770f0",
            paddingLeft: "10px"
          }}>
            I believe in learning by building, growing through collaboration, and making tech that truly matters. 
            Welcome to my world — let&apos;s innovate together!
          </p>

          <p style={{ 
            color: "rgb(155 126 172)",
            fontStyle: "italic",
            fontSize: "1.1em",
            textAlign: "center",
            margin: "30px 0 10px 0"
          }}>
            "Strive to build things that make a difference!"
          </p>
          <footer className="blockquote-footer" style={{ textAlign: "center" }}>Sarthak</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
