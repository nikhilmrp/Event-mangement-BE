# Event Management Backend

Event management API server.

**API documentation:** [docs/API.md](docs/API.md)

```ecommerce-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Sequelize config
│   ├── models/
│   │   ├── index.ts             # Sequelize init & associations
│   ├── repositories/            # Data access layer
│   ├── services/                # Business logic layer
│   ├── controllers/             # Request/Response handling
│   ├── middleware/
│   │   ├── errorHandler.middleware.ts
│   ├── routes/
│   │   ├── index.ts
│   ├── validators/
│   ├── dto/                     # Data Transfer Objects
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   ├── asyncHandler.ts
│   │   ├── logger.ts
│   │   └── helpers.ts
│   ├── seeders/
│   ├── migrations/
│   │
│   └── app.ts
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── repositories/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .sequelizerc
├── package.json
└── server.ts
```
