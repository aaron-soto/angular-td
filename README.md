<div align="center">
  <h3 align="center">Angular Tower Defense</h3>

  <p align="center">
    This is a re-make of an old game I made using just html, css and javsacript. This version is more complete and polished than the last.
    <br />
    <a href="https://github.com/aaron-soto/angular-tower-defense"><strong>Explore the code »</strong></a>
    <br />
    <br />
    <a href="https://angular-tower-defense.vercel.app/">View Live Demo</a>
    ·
    <a href="https://github.com/aaron-soto/terminal-app/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=Issue%3A+Bug+report+%F0%9F%90%9E">Report Bug</a>
    ·
    <a href="https://github.com/aaron-soto/terminal-app/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=Issue%3A+Feature+Request+%F0%9F%9A%80">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#⚠️-attention">Attention</a></li>
    <li><a href="#⚙️-installation">Installation</a></li>
    <li><a href="#✨-features">Features</a></li>
    <li><a href="#👍-contribute">Contribute</a></li>
    <li><a href="#🖥️-development">Development</a></li>
  </ol>
</details>

## ⚠️ Attention

This web terminal app is in beta and currently under active development. I recommend checking back at different times as it will be getting updated regularly with new and exciting features.

## ⚙️ Installation

This terminal can be ran by downloading the code. The project can be ran using:

### npm start

```json
"start": "ng serve",
```

**When to use it:**

- Use this script during your regular development activities when you are actively coding and need to see the results immediately in the browser.
- This command will serve your application with live reloading, meaning any changes you make to the source code will automatically trigger a rebuild of the application and refresh the browser.

**Realistic Example:**

- You are working on adding a new feature to your application, such as a user profile page. You would run npm start or yarn start to launch the application locally. As you edit your Angular components and services, the application in the browser updates in real-time, allowing you to test changes as you go.

### npm build

```json
"build": "ng build --prod",
```

**When to use it:**

- Use this script when you are ready to create a production-ready build of your application. This includes minification, uglification, and often ahead-of-time (AOT) compilation. It ensures the build is optimized for performance and size.
- Typically used before deploying the application to a production environment.

**Realistic Example:**

- You have completed development and testing of the current version of your application and are ready to release it. You would run npm run build or yarn build to generate the production build. Once the build is complete, you deploy the dist/ directory contents to your production server or cloud hosting platform.

### npm build:dev

```json
"build:dev": "ng build --configuration=development",
```

**When to use it:**

- Use this script when you need to create a build of your application that is not meant for production but needs a stable version for further testing or for sharing with other developers or testers.
- This configuration might include more detailed source maps, disabled optimization for easier debugging, and might not replace development environment variables.

**Realistic Example:**

- You are preparing your application for a testing phase where QA engineers will test it in a staging environment that mimics production but does not require production-level optimization. Running npm run build:dev or yarn build:dev creates a build suited for this purpose, facilitating easier debugging and problem resolution.

### npm serve:prod

```json
"serve:prod": "ng serve --configuration=production"
```

**When to use it:**

- Use this script when you want to simulate the production environment on your local machine. This is useful for testing how the application will behave in production before actually deploying it.
- This command serves the application with production settings, which might include different API endpoints, feature toggles, or any other environment-specific settings.

**Realistic Example:**

- Before deploying your application, you decide to run a final check locally using the production configuration to ensure everything works as expected with the production settings. You would run npm run serve:prod or yarn serve:prod to start the local server with the production environment's configuration. This helps catch any last-minute issues that might not have been evident in the development build.

## ✨ Features

- Fun facts about Me
- Tips about using the terminal

## 👍 Contribute

If you want to say Thank You and/or support the active development of this web terminal:

1. Add a GitHub Star to the project.
2. Support the project by donating a cup of coffee.

## 🖥️ Development

These are the features that I will be implementing in the future, if you have ideas I am always open to new ideas that I can code!
