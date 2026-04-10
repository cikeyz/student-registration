# Student Registration

<p align="center">
  <strong>Multi-section student registration form with live validation.</strong><br>
  Notebook-inspired layout. Vanilla HTML, CSS, and JavaScript.
</p>

<p align="center">
  <a href="https://cikeyz.github.io/student-registration/">Live Demo</a>
  &nbsp;·&nbsp;
  <a href="#quick-start">Quick Start</a>
  &nbsp;·&nbsp;
  <a href="#project-structure">Structure</a>
  &nbsp;·&nbsp;
  <a href="#license">License</a>
</p>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=111111">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-22c55e?logo=open-source-initiative&logoColor=white">
  <img alt="GitHub Pages" src="https://img.shields.io/badge/Demo-GitHub%20Pages-222222?logo=github&logoColor=white">
</p>

## Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [License](#license)
- [Course Note](#course-note)

## Overview

A front-end student registration form for a Computer Engineering context. Fieldsets cover personal, academic, and account details with client-side validation, password feedback, and a lightweight section stepper. No backend is required for the demo.

## Features

| Feature | Description |
|---------|-------------|
| Multi-fieldset form | Personal, academic, and account sections |
| Client validation | Required fields, patterns, and password rules |
| Stepper / progress | Section guidance while filling the form |
| Branding assets | PUP and program logos |

## Screenshots

| Form |
|------|
| ![Student registration form](docs/screenshots/form.png) |

## Quick Start

```bash
git clone https://github.com/cikeyz/student-registration.git
cd student-registration
python -m http.server 8000
# http://localhost:8000
```

## Project Structure

```text
student-registration/
├── index.html
├── script.js
├── style.css
├── LICENSE
├── README.md
├── assets/
│   ├── cpe-logo.png
│   ├── favicon.svg
│   └── pup-logo.png
└── docs/
    └── screenshots/
        └── form.png
```

## License

MIT. See [LICENSE](LICENSE).

PUP logos and marks belong to the Polytechnic University of the Philippines.

## Course Note

Built for CMPE 364 (Web and Mobile Systems), Polytechnic University of the Philippines, under Engr. Arlene B. Canlas. Published here as a standalone project.
