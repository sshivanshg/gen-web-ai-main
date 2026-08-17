# GenWeb.ai - AI Website Builder

<p align="center">
  <img src="assets/dashboard.png" alt="GenWeb.ai Dashboard Preview" width="800"/>
</p>

<p align="center">
  <a href="https://gen-web-ai-1-6qrz.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-8B5CF6?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo"/>
  </a>
  <a href="https://github.com/reck98/gen-web-ai" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo"/>
  </a>
  <a href="https://github.com/reck98/gen-web-ai/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-ISC-3178C6?style=for-the-badge" alt="License"/>
  </a>
  <br/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8"/>
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Auth"/>
  <img src="https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe Payments"/>
  <img src="https://img.shields.io/badge/OpenRouter-AI-FF6B6B?style=for-the-badge&logo=openai&logoColor=white" alt="OpenRouter AI"/>
</p>

---

**GenWeb.ai** is a full-stack AI-powered web application that generates production-ready, responsive HTML websites from natural language prompts. Describe your idea, and the AI builds a complete multi-page website with modern UI, animations, and mobile-first responsive design.

---

## Features

- **AI-Powered Generation** — Describe your website in plain English and get a complete, production-ready HTML/CSS/JS website
- **Iterative Refinement** — Improve your website through conversation-style prompts
- **Fully Responsive Output** — Every generated site is mobile-first and works on all screen sizes
- **Live Code Editor** — Monaco-based editor with real-time preview
- **One-Click Deploy** — Deploy generated websites to a shareable public URL
- **Credit-Based System** — Purchase credits via Stripe to generate and update websites
- **Google Authentication** — Sign in with Google via Firebase Auth
- **Modern UI** — Built with React 19, Tailwind CSS 4, and Framer Motion

---

## Tech Stack

### Frontend (`client/`)
- **React 19** with Vite 8
- **Tailwind CSS 4** for styling
- **Redux Toolkit** for state management
- **Firebase Auth** for Google authentication
- **Monaco Editor** for code editing
- **Framer Motion** for animations
- **Axios** for API calls
- **React Router DOM** for routing

### Backend (`server/`)
- **Express 5** REST API
- **MongoDB + Mongoose** for database
- **JWT** for authentication cookies
- **Stripe** for payment processing
- **OpenRouter API** for AI generation (DeepSeek Chat model)
- **Morgan** for logging

---

## System Architecture

GenWeb.ai is designed as a full-stack, decoupled web application utilizing a **Client-Server Architecture** with **micro-service external integrations** (AI LLM, Firebase Auth, Stripe Payments). Below are the diagrams detailing the system components, data flows, and database entity relationships.

### 1. High-Level Architecture Overview

```mermaid
graph TD
    subgraph Client ["Frontend (React 19 SPA)"]
        UI["React 19 Components + Framer Motion"]
        Redux["Redux Toolkit (Global State)"]
        Monaco["Monaco Editor & Live Preview Iframe"]
        FirebaseSDK["Firebase Auth Client SDK"]
    end

    subgraph Server ["Backend (Express 5 API Server)"]
        AuthMW["Auth Middleware (JWT Validation)"]
        AuthCtrl["Auth Controller"]
        WebCtrl["Website Controller (AI Orchestration)"]
        BillCtrl["Billing Controller"]
        WebhookCtrl["Stripe Webhook Handler"]
    end

    subgraph Database ["Database Layer"]
        MongoDB[("MongoDB (Mongoose ORM)")]
    end

    subgraph External ["External Services & APIs"]
        FirebaseAuth["Firebase Auth (Google OAuth 2.0)"]
        OpenRouter["OpenRouter API (DeepSeek LLM)"]
        Stripe["Stripe Payments Gateway"]
    end

    %% Client Interactions
    UI --> Redux
    Redux --> AuthMW
    Monaco <--> UI
    FirebaseSDK --> FirebaseAuth

    %% Server to DB Interactions
    AuthCtrl --> MongoDB
    WebCtrl --> MongoDB
    BillCtrl --> MongoDB
    WebhookCtrl --> MongoDB

    %% Server to External Integrations
    AuthCtrl -. Verify ID Token .-> FirebaseAuth
    WebCtrl -- Prompt & Multi-file Code Gen --> OpenRouter
    BillCtrl -- Create Checkout Session --> Stripe
    Stripe -- Webhook Events (checkout.session.completed) --> WebhookCtrl
```

### 2. AI Website Generation & Refinement Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React SPA (Client)
    participant Server as Express Server
    participant DB as MongoDB
    participant AI as OpenRouter (DeepSeek)

    User->>Client: Enter prompt ("Create modern SaaS landing page")
    Client->>Server: POST /api/website/generate (with JWT Auth Cookie)
    Server->>Server: Validate Auth Token (Auth Middleware)
    Server->>DB: Check User Credit Balance
    
    alt Insufficient Credits (< 50)
        DB-->>Server: Credit balance insufficient
        Server-->>Client: 403 Forbidden ("Not enough credits")
    else Sufficient Credits (>= 50)
        DB-->>Server: User verified & credits available
        Server->>AI: Request Code Gen (System Prompt + User Prompt)
        AI-->>Server: Return HTML / CSS / JS code payload
        Server->>DB: Save Website document & deduct 50 credits
        DB-->>Server: Database updated
        Server-->>Client: 200 OK (Website Data + Generated Code)
        Client->>User: Mount Code in Monaco & Render in Live Sandbox
    end
```

### 3. Data Schema & Entity Relationships

```mermaid
erDiagram
    USER ||--o{ WEBSITE : owns
    USER {
        string _id PK
        string firebaseUid "Unique"
        string email
        string name
        number credits
        string plan
        date createdAt
    }
    WEBSITE {
        string _id PK
        string userId FK
        string prompt
        string title
        string slug "Unique"
        string code
        boolean isDeployed
        array conversationHistory
        date createdAt
    }
```

### 4. Key Architectural Highlights (For Interview Discussions)

- **Decoupled Architecture**: The React SPA communicates with the Express REST API asynchronously via Axios. Static frontend assets and backend service layers scale independently.
- **Dual-Token Authentication Strategy**: Google OAuth authentication is initiated client-side via Firebase Auth SDK. The server verifies the token and issues an **HTTP-only JWT cookie**, mitigating XSS risks while providing secure session persistence.
- **Credit Economy & Stripe Webhook Integration**: Website generation (50 credits) and iterative prompt updates (25 credits) enforce server-side credit validation. Stripe Checkout sessions handle purchases, with transactional credit fulfillment processed via signed Stripe webhooks.
- **LLM Orchestration & Code Extraction**: Express acts as an orchestration engine, formatting user instructions and system design rules sent to OpenRouter (DeepSeek Chat). It validates and parses incoming LLM code payloads before storing them in MongoDB.
- **Client-Side Live Preview Sandbox**: Generated code is rendered inside an isolated browser iframe sandbox alongside the Monaco Editor, enabling real-time code editing and live visual feedback without server roundtrips.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Firebase project (for Google Auth)
- Stripe account
- OpenRouter API key

### 1. Clone & Install

```bash
git clone https://github.com/reck98/gen-web-ai.git
cd gen-web-ai

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

**Server** (`server/.env`):
```env
MONGO_URI="your_mongo_connection_string"
PORT="3002"
JWT_SECRET="your_jwt_secret"
FRONTEND_URL="http://localhost:5173"
DB_NAME="gen-web-ai-db"
OPENROUTER_API_KEY="your_openrouter_api_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
```

**Client** (`client/.env`):
```env
VITE_FIREBASE_API_KEY="your_firebase_api_key"
```

### 3. Run Development

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd client
npm run dev
```

The client runs on `http://localhost:5173` and the API on `http://localhost:3002`.

### 4. Build for Production

```bash
cd client
npm run build
```

The server automatically serves the built client from `client/dist/` when `NODE_ENV=production`.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/google` | No | Google OAuth login |
| `GET` | `/api/auth/logout` | No | Clear auth cookie |
| `GET` | `/api/user/me` | Yes | Get current user |
| `POST` | `/api/website/generate` | Yes | Generate a new website |
| `POST` | `/api/website/update/:id` | Yes | Update website via AI |
| `GET` | `/api/website/get-by-id/:id` | Yes | Get website by ID |
| `GET` | `/api/website/get-by-slug/:slug` | No | Get website by slug (public) |
| `GET` | `/api/website/get-all` | Yes | Get all user websites |
| `GET` | `/api/website/deploy/:id` | Yes | Deploy website to public URL |
| `POST` | `/api/billing` | Yes | Create Stripe checkout session |
| `POST` | `/api/stripe/webhook` | No | Stripe webhook for payments |

---

## Credit System

| Plan | Price | Credits |
|------|-------|---------|
| Free | ₹0 | 100 |
| Pro | ₹499 | 500 |
| Enterprise | ₹1499 | 1000 |

- **Generating** a new website costs **50 credits**
- **Updating** an existing website costs **25 credits**

---

## Screenshots

<p align="center">
  <img src="assets/dashboard.png" alt="Dashboard" width="90%"/>
  <br/>
  <em>Dashboard — manage your generated websites</em>
</p>

---

## Links

- **Live Site**: [https://gen-web-ai-1-6qrz.onrender.com](https://gen-web-ai-1-6qrz.onrender.com)
- **GitHub Repo**: [https://github.com/reck98/gen-web-ai](https://github.com/reck98/gen-web-ai)
- **Report Issues**: [GitHub Issues](https://github.com/reck98/gen-web-ai/issues)

---

## License

This project is licensed under the ISC License.
