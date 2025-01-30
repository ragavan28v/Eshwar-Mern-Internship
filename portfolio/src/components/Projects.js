import React, { useState, useEffect } from 'react';
import '../styles/projects.css';

const projects = [
  {
    name: "Library Management System (LMS)",
    description: "A software solution for automating library operations including book cataloging, circulation management, and user account handling. Features include book loans, returns, and reservations.",
    techStack: ["C Language"],
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    ],
    link: "https://project-link.com"
  },
  {
    name: "Face Detection Module",
    description: "A face detection module using OpenCV to automate identification of human faces in images and video streams, with Haar Cascade classifiers for real-time detection.",
    techStack: ["OpenCV", "Python"],
    images: [
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3"
    ],
    link: "https://project-link.com"
  },
  {
    name: "ChessMind: Intelligent Chess Partner",
    description: "An interactive chess application built with Python and Tkinter, featuring two game modes: Human vs. Human and Human vs. Engine, along with move suggestions and a chatbot.",
    techStack: ["Python", "Tkinter", "Stockfish"],
    images: [
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0"
    ],
    link: "https://project-link.com"
  }
];

const Projects = () => {
  const [currentProject, setCurrentProject] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % projects[currentProject].images.length);
    }, 3000);

    const cardInterval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length);
      setCurrentImage(0);
    }, 9000);

    return () => {
      clearInterval(imageInterval);
      clearInterval(cardInterval);
    };
  }, [currentProject]);

  const handleDotClick = (index) => {
    setCurrentProject(index);
    setCurrentImage(0);
  };

  return (
    <div className="projects-container">
      <div className="just"></div>
      <h2 className="projects-title">My Projects</h2>
      
      <div className="projects-content">
        {/* Left side - Projects */}
        <div className="projects-list">
          <div className="projects-caption">Explore my recent works</div>
          <div className="projects-slider-container">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`project-card ${index === currentProject ? 'active' : ''}`}
                style={{
                  transform: `rotateY(${index === currentProject ? '0' : '180'}deg)`,
                  transition: 'transform 1s ease-in-out',
                  zIndex: index === currentProject ? '1' : '0',
                }}
              >
                <div className="project-details">
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="tech-stack">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="view-project-btn">
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Project navigation dots */}
          <div className="navigation-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentProject ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Right side - Images */}
        <div className="images-container">
          <div className="images-slider">
            {projects[currentProject].images.map((image, index) => (
              <div 
                key={index}
                className={`image-slide ${index === currentImage ? 'active' : ''}`}
                style={{ 
                  backgroundImage: `url(${image})`,
                  opacity: index === currentImage ? 1 : 0
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
