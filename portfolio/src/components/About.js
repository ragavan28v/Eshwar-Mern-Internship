import React from 'react';
import '../styles/about.css'; // Add the corresponding CSS file
import profileImage1 from '../assets/images/Profile1.jpg';
const About = () => {
    return (
        <section id="about" className="about-section">
            <div id="spacing"></div>
            <div className="about-content">
                <div className="about-text">
                    <h2>About Me</h2>
                    <p>
                        Hi! I'm <span className="highlight">RAGAVAN V</span>, a passionate Machine Learning Engineer with expertise in developing intelligent solutions using Python, TensorFlow, and PyTorch. I enjoy building data-driven models that solve complex real-world problems, leveraging my skills in deep learning, natural language processing, and computer vision. My goal is to continuously enhance my knowledge, stay updated with the latest advancements in AI, and contribute to innovative projects that make a meaningful impact.
                    </p>
                </div>
                <div className="about-image">
                <img src={profileImage1} alt="Profile" />
                </div>
            </div>
        </section>
    );
};

export default About;
