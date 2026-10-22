# Node.js CI/CD Pipeline with GitHub Actions

## 📌 Project Overview

This is a simple, interactive task management web application built using Node.js . Users can add tasks, mark them as completed, filter tasks, and delete them through a clean, responsive web interface.

This task automates testing, Docker image building, and pushing to Docker Hub using GitHub Actions.



## 🛠️ Technologies Used

- **Node.js** — JavaScript runtime
- **HTML, CSS, JavaScript** — Frontend interface
- **Docker** — Containerization
- **GitHub** — Source code management
- **GitHub Actions** — CI/CD automation
- **Docker Hub** — Docker image registry

## 📂 Project Structure

```text
nodejs-demo-app/
├── .github/
│   └── workflows/
│       └── main.yml
├── app.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

## ⚙️ How the CI/CD Pipeline Works

Whenever code is pushed to the `main` branch, GitHub Actions automatically performs the following steps:

1. Checks out the source code.
2. Sets up Node.js.
3. Installs dependencies using `npm ci`.
4. Checks syntax using `node --check app.js`.
5. Builds the Docker image.
6. Pushes the image to Docker Hub after the test job succeeds.

### Pipeline Flow

`Code Push → Install Dependencies → Syntax Check → Docker Build → Docker Hub Push`

The workflow is defined in `.github/workflows/main.yml`.

## 🐳 Docker Hub Image

**Image:** `lalita15/nodejs-demo-app`

[View Docker Hub Repository](https://hub.docker.com/r/lalita15/nodejs-demo-app)

## 💻 Run the Application Locally


Open `http://localhost:3000` in your browser.

### Run with Docker

Pull the published image:

```bash
docker pull lalita15/nodejs-demo-app
```

Run the container:

```bash
docker run  -p 3000:3000 lalita15/nodejs-demo-app
```

Open `http://localhost:3000` in your browser.

## 🔐 GitHub Secrets

The workflow uses GitHub repository secrets to authenticate with Docker Hub:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

These secrets keep credentials out of the workflow source code.

##  Project Outcome

Implemented an automated CI/CD pipeline for a Node.js web application using GitHub Actions and Docker. The pipeline checks application syntax, builds a container image, and publishes it to Docker Hub when changes are pushed to the `main` branch.

## 👩‍💻 Author

**Lalita Rajpoot**

- GitHub: [lalita-15](https://github.com/lalita-15)
- Project Repository: [nodejs-demo-app](https://github.com/lalita-15/nodejs-demo-app)
- Docker Hub: [lalita15/nodejs-demo-app](https://hub.docker.com/r/lalita15/nodejs-demo-app)

---

*This project was developed as part of a DevOps internship task to practice Docker and CI/CD automation.*
