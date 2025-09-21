# Real-time Chat Application

A modern real-time chat application built with Next.js, Socket.IO, and TypeScript, containerized with Docker.

## 🚀 Features

- **Real-time messaging** with Socket.IO
- **Room-based chat** with user management
- **Modern UI** with Next.js and CSS modules
- **TypeScript** for type safety
- **Docker** containerization
- **Monorepo** structure with Turborepo

## 📁 Project Structure

```
my-monorepo/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── server/       # Node.js Socket.IO server
│   └── docs/         # Next.js documentation
├── packages/
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
├── docker-compose.yml
└── run.sh
```

## 🛠️ Quick Start

### Option 1: Local Development (Recommended)

```bash
# Start all services locally
./start-local.sh
```

This will:
- Install dependencies
- Build all applications
- Start Redis (if available)
- Start the Socket.IO server
- Start the web application
- Start the documentation site

### Option 2: Docker Development

```bash
# Make sure Docker is running, then:
./run.sh docker
```

### Option 3: Manual Development

```bash
# Install dependencies
yarn install

# Start development servers
yarn dev
```

## 🌐 Access Your Application

Once running, you can access:

- **Web App**: http://localhost:3000
- **Server**: http://localhost:8000
- **Docs**: http://localhost:3001

## 🐳 Docker Commands

```bash
# Build Docker images
./run.sh build

# Start with Docker
./run.sh docker

# Stop Docker services
./run.sh stop

# View logs
./run.sh logs

# Clean Docker resources
./run.sh clean
```

## 🧪 Testing the Application

1. **Open the web app** at http://localhost:3000
2. **Enter your name** and a **room ID**
3. **Click "Join Room"** to start chatting
4. **Open another browser tab** and join the same room to test real-time messaging

## 📝 Development

### Available Scripts

```bash
# Development
yarn dev              # Start all development servers
yarn build            # Build all applications
yarn lint             # Run linting
yarn check-types      # Run type checking

# Individual apps
yarn dev --filter=web     # Start only web app
yarn dev --filter=server  # Start only server
yarn dev --filter=docs    # Start only docs
```

### Project Structure

- **Web App** (`apps/web`): Next.js frontend with Socket.IO client
- **Server** (`apps/server`): Node.js backend with Socket.IO server
- **Docs** (`apps/docs`): Next.js documentation site
- **Packages**: Shared configurations and UI components

## 🔧 Configuration

### Environment Variables

Create `.env.local` files for each app:

```bash
# apps/web/.env.local
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000

# apps/server/.env.local
PORT=8000
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Docker Configuration

- **Multi-stage builds** for optimization
- **Health checks** for all services
- **Volume management** for development
- **Network isolation** between services

## 🚀 Deployment

### Production with Docker

```bash
# Build production images
docker-compose build

# Start production services
docker-compose up -d
```

### Manual Production

```bash
# Build all applications
yarn build

# Start production servers
yarn start
```

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**: Stop other services using ports 3000, 3001, or 8000
2. **Docker not running**: Start Docker Desktop before running Docker commands
3. **Redis connection issues**: Install Redis or use Docker for Redis

### Getting Help

- Check the logs: `./run.sh logs`
- Verify services: `curl http://localhost:3000` and `curl http://localhost:8000/health`
- Restart services: `./run.sh stop && ./run.sh docker`

## 📄 License

This project is licensed under the MIT License.