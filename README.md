# Crypto Alerts

## Overview
Crypto Alerts is a system that monitors token prices and sends alerts based on predefined conditions. It integrates with Moralis for blockchain data and uses email notifications for alerts.

## Prerequisites
Ensure you have the following installed before proceeding:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (if running locally)
- PostgreSQL (if running locally, otherwise use Docker)

## Environment Variables
Before running the project, set up the `.env` file by copying `env.example`:

```sh
cp env.example .env
```

Update the `.env` file with your credentials.

### Example `.env` file:
```ini
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crypto_db?schema=public"

# Moralis API Key (Should be stored securely)
MORALIS_API="your-secure-moralis-api-key"

# Token Addresses
WETH="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
WMATIC="0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"

# Email Credentials (Use App Passwords instead of real password)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Alert Email
TZ_EMAIL="your-email@gmail.com"
```

## Running the Project

### Using Docker (Recommended)
```sh
docker-compose up --build
```
This will start the NestJS app and the PostgreSQL database.

### Running Locally (Without Docker)
1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Run database migrations (if using Prisma):
   ```sh
   pnpm prisma migrate dev
   ```
3. Start the application:
   ```sh
   pnpm start
   ```

## Testing
Run tests using:
```sh
pnpm test
```

## Stopping Services
To stop the running containers, use:
```sh
docker-compose down -v
```

## License
This project is licensed under the MIT License.

