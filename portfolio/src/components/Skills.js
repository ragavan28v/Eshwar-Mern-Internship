import React from 'react';
import { FaPython, FaBrain, FaDatabase, FaReact, FaCode, FaChartLine } from 'react-icons/fa';
import '../styles/skills.css';

const skillsData = [
    { id: 1, icon: <FaPython className="skill-icon" />, name: 'Python', description: 'Experienced in Python programming for AI and ML.' },
    { id: 2, icon: <FaBrain className="skill-icon" />, name: 'Machine Learning', description: 'Skilled in building ML models and deep learning.' },
    { id: 3, icon: <FaDatabase className="skill-icon" />, name: 'Databases', description: 'Proficient in SQL and NoSQL database management.' },
    { id: 4, icon: <FaReact className="skill-icon" />, name: 'React.js', description: 'Building responsive web applications using React.' },
    { id: 5, icon: <FaCode className="skill-icon" />, name: 'Algorithms', description: 'Strong problem-solving skills with efficient algorithms.' },
    { id: 6, icon: <FaChartLine className="skill-icon" />, name: 'Data Analysis', description: 'Data processing and visualization techniques.' },
];

const Skills = () => {
    return (
        <section id="skills" className="skills-section">
            <h2 className="skills-heading">Skills</h2>
            <p className="skills-subheading">My Top Skills</p>
            <div className="skills-container">
                {skillsData.map((skill) => (
                    <div key={skill.id} className="skill-card">
                        {skill.icon}
                        <div className="skill-info">
                            <h3>{skill.name}</h3>
                            <p>{skill.description}</p>
                        </div>
                        <span className="skill-arrow">➜</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
