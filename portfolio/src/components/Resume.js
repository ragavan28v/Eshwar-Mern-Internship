import React from 'react';
import '../styles/resume.css';

const Resume = () => {
  return (
    <div>
      <div className='spacing'></div>
      <h2 className="resume-header">My Professional Journey</h2>
      <p className="resume-subheading">Explore my career path, skills, and more.</p>

      <div className="resume-sections">
        {/* Work Experience Section */}
        <div className="resume-section">
          <h3 className="section-title">Work Experience</h3>
          <ul className="section-content">
            <li>AI/ML Intern at XYZ Corp. - Worked on predictive analytics and NLP tasks.</li>
          </ul>
        </div>

        {/* Skills Section */}
        <div className="resume-section">
          <h3 className="section-title">Skills</h3>
          <ul className="section-content">
            <li>Java, C++, JavaScript, SQL, React.js, Node.js, HTML, CSS</li>
            <li>Python, PyTorch, OpenCV, NLP, Pandas, Matplotlib</li>
          </ul>
        </div>

        {/* Education Section */}
        <div className="resume-section">
          <h3 className="section-title">Education</h3>
          <ul className="section-content">
            <li>B.E. in Computer Science (AIML) - Sri Eshwar College of Engineering</li>
          </ul>
        </div>

        {/* Certifications Section */}
        <div className="resume-section">
          <h3 className="section-title">Certifications</h3>
          <ul className="section-content">
            <li>Python Developer - Great Learning</li>
            <li>Machine Learning with TensorFlow - Coursera</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="resume-actions">
        <a href="/My_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-view-pdf">
          View Resume as PDF
        </a>
        <a href="/My_Resume.pdf" download="My_Resume.pdf" className="btn-download-resume">
          Download Resume
        </a>
      </div>
    </div>
  );
};

export default Resume;
