# Arogyata - Web3 Healthcare Data Privacy Platform

Arogyata is a full-stack application designed to revolutionize healthcare data privacy using Web3 technology. It empowers patients with control over their medical records while providing institutions with a secure and efficient way to access authorized data.

## 🚀 Features

- **Secure Authentication**: Robust user login and registration system.
- **Role-Based Dashboards**: Tailored experiences for Patients and Institutions.
- **Records Vault**: Securely upload, view, edit, and delete health records with encryption.
- **Blockchain Integration**: Web3 wallet connection for decentralized access control and audit trails.
- **AI Chatbot Assistant**: Intelligent chatbot to assist users with queries and navigation.
- **Responsive Design**: Modern, glassmorphic UI built with Tailwind CSS and Radix UI.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Radix UI, Framer Motion, GSAP
- **State Management**: Tanstack Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form, Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Blockchain**: Ethers.js
- **AI**: OpenAI API
- **Security**: Helmet, CORS, JWT, Bcryptjs

## 📂 Project Structure

This project is organized as a monorepo using npm workspaces:

- `frontend/`: React application code
- `backend/`: Node.js/Express API server code

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Arogyata-fullstack
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
# Add other necessary variables (e.g., Blockchain keys)
```

### Running the Application

To start both the frontend and backend servers concurrently:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 📜 Scripts

- `npm run dev`: Starts both frontend and backend in development mode.
- `npm run build`: Builds both frontend and backend for production.
- `npm run dev:frontend`: Starts only the frontend.
- `npm run dev:backend`: Starts only the backend.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[Choose a license, e.g., MIT]
