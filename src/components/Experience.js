import React from 'react';

const Experience = () => {
  return (
    <section className="section">
      <h2>Experience</h2>
      <div className="two-column">
        <div className="column">
          <p>
            <strong>Technical Operations & Automation Specialist</strong><br />
            Tuma Café, UK (2023-2024)
          </p>
          <ul>
            <li>Developed Python scripts for automation, improving efficiency.</li>
            <li>Configured and maintained secure Wi-Fi and POS ecosystems.</li>
            <li>Streamlined operational analytics through data-driven strategies.</li>
          </ul>
        </div>
        <div className="column">
          <p>
            <strong>Digital Forensic Analyst Intern</strong><br />
            Teesside University, UK (2021-2022)
          </p>
          <ul>
            <li>Conducted forensic analysis of digital evidence & cyber incidents.</li>
            <li>Implemented security automation using Python & forensic tools.</li>
            <li>Specialized in network vulnerabilities, threat intelligence, and reporting.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Experience;