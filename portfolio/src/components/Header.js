import React, { useEffect, useState } from 'react';
import '../styles/header.css';

const Header = ({ scrollToSection, sections }) => {
    const [activeSection, setActiveSection] = useState('homeRef');

    useEffect(() => {
        const observerOptions = {
            root: null,
            threshold: 0.6, // Section should be at least 60% visible
        };

        const sectionRefs = Object.entries(sections).map(([key, ref]) => ({
            key,
            element: ref.current,
        }));

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(
                        Object.keys(sections).find(
                            (key) => sections[key].current === entry.target
                        )
                    );
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sectionRefs.forEach(({ element }) => {
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sections]);

    return (
        <>
            <header className="header">
                <div className="logo">
                    <a onClick={() => scrollToSection(sections.homeRef)}>MyPortfolio</a>
                </div>
                <nav className="nav-links">
                    <ul>
                        <li>
                            <a onClick={() => scrollToSection(sections.homeRef)} className={activeSection === 'homeRef' ? 'active' : ''}>
                                Home
                            </a>
                        </li>
                        <li>
                            <a onClick={() => scrollToSection(sections.aboutRef)} className={activeSection === 'aboutRef' ? 'active' : ''}>
                                About
                            </a>
                        </li>
                        <li>
                            <a onClick={() => scrollToSection(sections.skillsRef)} className={activeSection === 'skillsRef' ? 'active' : ''}>
                                Skills
                            </a>
                        </li>
                        <li>
                            <a onClick={() => scrollToSection(sections.projectsRef)} className={activeSection === 'projectsRef' ? 'active' : ''}>
                                Projects
                            </a>
                        </li>
                        <li>
                            <a onClick={() => scrollToSection(sections.resumeRef)} className={activeSection === 'resumeRef' ? 'active' : ''}>
                                Resume
                            </a>
                        </li>
                        <li>
                            <a onClick={() => scrollToSection(sections.contactRef)} className={activeSection === 'contactRef' ? 'active' : ''}>
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
            <div className="content"></div>
        </>
    );
};

export default Header;
