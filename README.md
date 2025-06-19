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

## Deployment to GitHub Pages (viru185.github.io)

For user/organization sites like `viru185.github.io`, GitHub Pages only serves from the root of the `main` branch. This means you must build your site locally and copy the contents of the `build` folder to the root of your repository before pushing.

### 1. Build the production files

```sh
npm run build
```
This will create a `build` folder with the production-ready static files.

### 2. Copy the build output to the root of your repository

```sh
# On Windows PowerShell
Copy-Item -Path .\build\* -Destination .\ -Recurse -Force

# Remove the build folder (optional)
Remove-Item -Recurse -Force .\build
```

### 3. Commit and push your changes

```sh
git add .
git commit -m "Deploy production build to GitHub Pages"
git push origin main
```

### 4. Configure GitHub Pages (one-time setup)
- Go to your repository on GitHub.
- Click **Settings** > **Pages**.
- Under **Source**, select the `main` branch and `/ (root)` folder.
- Save.

### 5. Access your site
- Visit: https://viru185.github.io

**Note:**
- It may take a few minutes for changes to appear after each push.
- For custom domains, configure in the same GitHub Pages settings.

---

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.