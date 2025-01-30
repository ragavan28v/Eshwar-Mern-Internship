import React, { useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import 'animate.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

const App = () => {
    // Create refs for each section
    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const skillsRef = useRef(null);
    const projectsRef = useRef(null);
    const resumeRef = useRef(null);
    const contactRef = useRef(null);

    // Function to handle smooth scrolling to a section
    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <Header scrollToSection={scrollToSection} sections={{ homeRef, aboutRef, skillsRef, projectsRef, resumeRef, contactRef }} />
            <main>
                <section ref={homeRef}><Home scrollToSection={scrollToSection} projectsRef={projectsRef} /></section>
                <section ref={aboutRef}><About /></section>
                <section ref={skillsRef}><Skills /></section>
                <section ref={projectsRef}><Projects /></section>
                <section ref={resumeRef}><Resume /></section>
                <section ref={contactRef}><Contact /></section>
            </main>
            <Footer />
        </div>
    );
};

export default App;
