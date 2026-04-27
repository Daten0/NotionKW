# **File Tree Project: NotionKW**

` Simulasi Monitoring Container berbasis Grafana, menggunakan implementasi docker-compose `

```
├── 📁 backend
│   ├── 📁 src
│   │   ├── 📁 config
│   │   │   └── 📄 db.ts
│   │   ├── 📁 controllers
│   │   │   └── 📄 noteController.ts
│   │   ├── 📁 repositories
│   │   │   └── 📄 noteRepository.ts
│   │   ├── 📁 routes
│   │   │   └── 📄 noteRoutes.ts
│   │   ├── 📁 types
│   │   │   └── 📄 note.ts
│   │   └── 📄 index.ts
│   ├── ⚙️ .dockerignore
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitignore
│   ├── 🐳 Dockerfile
│   ├── 📄 bun.lock
│   ├── ⚙️ package.json
│   └── ⚙️ tsconfig.json
├── 📁 frontend
│   ├── 🐳 Dockerfile
│   ├── 📄 app.js
│   ├── 🌐 index.html
│   ├── ⚙️ nginx.conf
│   └── 🎨 style.css
├── 📁 monitoring
│   └── 📁 prometheus
│       └── ⚙️ prometheus.yml
├── ⚙️ .dockerignore
├── ⚙️ .env.example
├── ⚙️ .gitignore
├── 📝 Readme.md
└── ⚙️ docker-compose.yaml
```