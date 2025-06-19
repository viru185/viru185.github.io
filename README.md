# viru185.github.io

This is a modern, responsive personal website project for showcasing the professional profile of Viren Hirpara. The website features dark and light mode options, making it user-friendly and visually appealing.

## Project Structure

```
viru185.github.io
├── public
│   └── index.html          # Main HTML file serving as the entry point
├── src
│   ├── assets
│   │   └── styles
│   │       ├── dark.css    # Styles for dark mode
│   │       └── light.css   # Styles for light mode
│   ├── components
│   │   ├── Header.js       # Header component displaying name and tagline
│   │   ├── Contact.js      # Component for contact information
│   │   ├── Education.js    # Component for education details
│   │   ├── Experience.js   # Component for work experience
│   │   ├── Skills.js       # Component for skills and tools
│   │   ├── Projects.js     # Component for personal projects
│   │   ├── Certifications.js # Component for certifications
│   │   └── LanguagesInterests.js # Component for languages and interests
│   ├── App.js              # Main application file managing layout and theme
│   └── ThemeToggle.js      # Component for toggling between dark and light modes
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Features

- **Responsive Design**: The website is designed to be mobile-friendly and adapts to various screen sizes.
- **Dark and Light Mode**: Users can toggle between dark and light themes for a personalized viewing experience.
- **Modular Components**: The website is built using modular components, making it easy to edit and maintain.

## Local Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/viru185/viru185.github.io.git
   cd viru185.github.io
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000` to view the website.

---

## Deployment to GitHub Pages (viru185.github.io) — Automated with GitHub Actions

This project uses a GitHub Actions workflow to automatically build and deploy your site to GitHub Pages every time you push to the `main` branch. You do not need to manually copy the build folder or run extra commands.

### 1. Push your changes to `main`

```sh
git add .
git commit -m "Your message"
git push origin main
```

### 2. GitHub Actions will build and deploy automatically
- The workflow in `.github/workflows/deploy.yml` will run on every push to `main`.
- It builds your React app and publishes the `build` output to the root of the `main` branch (as required for user/organization sites).

### 3. Configure GitHub Pages (one-time setup)
- Go to your repository on GitHub.
- Click **Settings** > **Pages**.
- Under **Source**, select the `main` branch and `/ (root)` folder.
- Save.

### 4. Access your site
- Visit: https://viru185.github.io

**Note:**
- It may take a few minutes for changes to appear after each push.
- For custom domains, configure in the same GitHub Pages settings.

---

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.