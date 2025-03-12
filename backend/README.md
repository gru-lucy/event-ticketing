# Event Ticketing Application

A simple event ticketing application built with NestJS, GraphQL, and TypeORM. This backend application allows users to view events, purchase tickets (with validation to prevent overselling), and receive order confirmations with transaction details.

## Table of Contents

- [Event Ticketing Application](#event-ticketing-application)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
  - [Database Configuration](#database-configuration)
    - [Datbase migration](#datbase-migration)
    - [Seeding](#seeding)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)
  - [Folder Structure](#folder-structure)
  - [Shortcuts \& Assumptions](#shortcuts--assumptions)

## Overview

This project is a take-home exercise designed to evaluate backend design, frontend architecture, database schema design, and state management. In this implementation, the focus is on building a cohesive backend that supports:

- **Viewing Events:** Users can retrieve a list of events with details such as event name, date, total tickets, and available tickets.
- **Purchasing Tickets:** Users can purchase multiple tickets in one transaction. The system validates that users do not purchase more tickets than are available.
- **Order Confirmation:** Once a purchase is successful, a confirmation is returned with an order number, event details, and the quantity of tickets purchased.
- **Transaction Recording:** Each ticket purchase is recorded in an Order entity that logs transaction details such as order number, quantity, event, and timestamp.

## Features

- **GraphQL API:** Uses Apollo Server integrated with NestJS to provide a GraphQL API.
- **TypeORM Integration:** Connects to a PostgreSQL database using TypeORM to manage data for events and orders.
- **Validation & Error Handling:** Ensures that users cannot purchase more tickets than are available, and proper errors are thrown when validations fail.
- **Unit Testing:** Comprehensive unit tests (using Jest) are provided for each module to ensure nearly 100% code coverage.

## Architecture

- **Backend Framework:** [NestJS](https://nestjs.com/)
- **API Type:** GraphQL (powered by Apollo Server)
- **Database:** PostgreSQL (configured via TypeORM)
- **Modules:**
  - **Event Module:** Manages event data (CRUD operations, ticket management).
  - **Order Module:** Handles the ticket purchasing process and order record creation.
- **Testing:** Jest is used for unit testing at the module and integration levels.

## Installation

### Prerequisites

- **Node.js:** v14 or above is recommended.
- **PostgreSQL:** Ensure PostgreSQL is installed and running on your machine.

### Clone the Repository

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/gru-lucy/event-ticketing.git
cd event-ticketing
```

### Install Dependencies

Install the dependencies using npm:

```bash
pnpm install
```

## Database Configuration

This project uses PostgreSQL as its database. Ensure you have PostgreSQL running and create a database for the application.

For example, using the `psql` command-line:

```sql
psql -U postgres
CREATE DATABASE "event-ticketing";
```

The database connection is configured in `src/app.module.ts` as follows:

```typescript
TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'event-ticketing',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
}),
```

Note: The `synchronize: true` flag is useful during development but should be disabled in production.

### Datbase migration

```bash
pnpm run migration:run
```

This will create `event` and `order` table in the database.

### Seeding

Create a seed factory for events. This file will generate new Event objects with randomized data. Create a file at src/seeds/event.factory.ts with the following content:

```bash
pnpm run seed
```

## Running the Application

Start the application in development mode with hot reloading:

```bash
pnpm run start:dev
```

You can access the GraphQL Playground at: [http://localhost:3000/graphql](http://localhost:3000/graphql)

## Testing

This project includes comprehensive unit tests to ensure nearly 100% code coverage. Tests are located in each module folder and at the app level.

To run the tests, execute:

```bash
pnpm run test
```

The tests cover:

- **Event Module:**
  - src/event/`__tests__`/event.service.spec.ts
  - src/event/`__tests__`/event.resolver.spec.ts
- **Order Module:**
  - src/order/`__tests__`/order.service.spec.ts
  - src/order/`__tests__`/order.resolver.spec.ts
- **Application Level:**
  - src/`__tests__`/app.resolver.spec.ts
  - src/`__tests__`/app.service.spec.ts

## Folder Structure

An overview of the project structure:

```bash
event-ticketing/
├── node_modules/
├── src/
│   ├── app.module.ts         # Main application module
│   ├── app.resolver.ts       # Root GraphQL resolver (e.g., hello query)
│   ├── app.service.ts        # Application service
│   ├── main.ts               # Application bootstrap file
│   ├── event/
│   │   ├── event.entity.ts   # Event entity definition
│   │   ├── event.module.ts   # Event module definition
│   │   ├── event.service.ts  # Business logic for events
│   │   ├── event.resolver.ts # GraphQL resolver for events
│   │   ├── __tests__/
│   │   │   ├── event.service.spec.ts  # Unit tests for EventService
│   │   │   └── event.resolver.spec.ts # Unit tests for EventResolver
│   ├── order/
│   │   ├── order.entity.ts   # Order entity definition
│   │   ├── order.module.ts   # Order module definition
│   │   ├── order.service.ts  # Business logic for ticket purchases
│   │   ├── order.resolver.ts # GraphQL resolver for orders
│   │   └── __tests__/
│   │       ├── order.service.spec.ts  # Unit tests for OrderService
│   │       └── order.resolver.spec.ts # Unit tests for OrderResolver
├── package.json
├── ... (other configuration and type definition files)
└── README.md
```

## Shortcuts & Assumptions

- **Frontend Exclusion**: This repository focuses solely on the backend implementation. The frontend (Expo/React Native) would be developed separately.
- **Database Seeding**: There is no automatic seeding script. You can create events via GraphQL mutations or extend the application to include seeding.
- **Error Handling**: Basic error handling is implemented. More robust error management might be needed for production.
- **Order Number Generation**: Uses a simple timestamp and random number method. In a production system, consider a more robust mechanism.
- **Security**: No authentication or authorization is implemented.
