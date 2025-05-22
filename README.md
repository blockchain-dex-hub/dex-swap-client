# BNW DEX Swap

A decentralized exchange (DEX) swap application built with modern web technologies.

## 🚀 Features

- Modern React-based frontend with TailwindCSS
- Express.js backend with TypeScript
- PostgreSQL database with Drizzle ORM
- Real-time updates using WebSocket
- Secure authentication system
- Responsive and accessible UI components
- Form validation and error handling

## 📋 Prerequisites

- Node.js (version specified in `.nvmrc`)
- Yarn package manager
- PostgreSQL database
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd bnw-dex-swap
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

4. Initialize the database:
```bash
yarn db:push
```

## 🏃‍♂️ Development

Start the development server:
```bash
yarn dev
```

This will start both the frontend and backend servers in development mode.

## 🏗️ Building for Production

Build the application:
```bash
yarn build
```

Start the production server:
```bash
yarn start
```

## 📁 Project Structure

```
bnw-dex-swap/
├── client/           # Frontend React application
├── server/           # Backend Express application
├── shared/           # Shared types and utilities
├── dist/            # Production build output
└── attached_assets/ # Static assets
```

## 🛠️ Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn check` - Type-check TypeScript files
- `yarn db:push` - Push database schema changes

## 🔧 Technology Stack

- **Frontend:**
  - React
  - Vite
  - TailwindCSS
  - Radix UI Components
  - React Query
  - React Hook Form
  - Zod

- **Backend:**
  - Express.js
  - TypeScript
  - Drizzle ORM
  - Passport.js
  - WebSocket

- **Database:**
  - PostgreSQL
  - Drizzle ORM

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
