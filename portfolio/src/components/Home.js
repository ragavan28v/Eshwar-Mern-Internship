import React from 'react';
import '../styles/home.css';
import profileImage1 from '../assets/images/Profile1.jpg';

const Home = ({ scrollToSection, projectsRef }) => {
    return (
        <section id="home" className="home-section">
            <div className="home-content">
                <div className="home-image">
                    <img src={profileImage1} alt="Profile" />
                </div>
                <div className="home-text">
                    <h1>Hi, I'm <span className="highlight">RAGAVAN V</span></h1>
                    <p>I'm a passionate <span className="highlight">Machine Learning Enthusiast</span> with expertise in building intelligent systems and solutions.</p>

                    {/* Modify the button to trigger scrollToSection for the projects section */}
                    <button onClick={() => scrollToSection(projectsRef)} className="cta-button">
                        View My Work
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Home;
