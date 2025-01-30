import React from 'react';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} MyPortfolio. All Rights Reserved.</p>
                <div className="footer-links">
                    <a href="https://github.com/SECE-2023-2027/practice-project-phase-i-ragavan28v" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/feed/">LinkedIn</a>
                    <a href="mailto:your.email@example.com">Contact Me</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
