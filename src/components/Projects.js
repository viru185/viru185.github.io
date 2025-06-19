import React from 'react';

const Projects = () => {
  const projectList = [
    {
      title: "ChameleonResume",
      description: "AI-powered resume optimizer",
      link: "https://github.com/viru185/ChameleonResume"
    },
    {
      title: "Python Automation",
      description: "Developed scripts for web scraping, data mining, and workflow automation.",
      link: "#"
    },
    {
      title: "NoteApp_flask",
      description: "Web-based note-taking app",
      link: "https://github.com/viru185/NoteApp_flask.git"
    },
    {
      title: "Data Mining on Ransomware Tweets",
      description: "Conducted Twitter-based data mining research.",
      link: "#"
    }
  ];

  return (
    <section className="section">
      <h2>Projects</h2>
      <ul>
        {projectList.map((project, index) => (
          <li key={index}>
            <strong>{project.title}:</strong> {project.description} - 
            <a href={project.link} target="_blank" rel="noopener noreferrer"> GitHub</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Projects;