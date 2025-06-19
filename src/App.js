import React, { useState } from 'react';
import './assets/styles/light.css';
import './assets/styles/dark.css';
import Header from './components/Header';
import Contact from './components/Contact';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import LanguagesInterests from './components/LanguagesInterests';
import ThemeToggle from './ThemeToggle';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <Header />
      <Contact />
      <Education />
      <Experience />
      <Skills />
      <Projects />
      <Certifications />
      <LanguagesInterests />
    </div>
  );
}

export default App;