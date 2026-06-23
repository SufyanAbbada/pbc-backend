# PBC (Pakistan Business Council) Mideast Metals API

This repository contains the backend API for the Pakistan Business Council (PBC) platform. Currently, it includes the authentication module, providing secure user registration, login, and role-based access control.

## Technologies

- Environment: NodeJS (v18.20.7)
- Language: Typescript
- Framework: ExpressJS
- ORM: Prisma
- Database: PostgreSQL(v.14+)
- Authentication: Basic, JWT, bcrypt

## Prequisite

- Clone the Repository (Configurations can be of your choice.)

```bash
git clone https://github.com/your-repo/pbc-backend.git
cd pbc-backend
```

- Create the `.env` file by copying the `.env.example` file

```bash
cp  .env.template  .env
```

- Edit file `.env`

- Ensure PostgreSQL is installed and running.

- Once you have the database connection URL, replace the sample one in the `.env` file by yours

- Run Postgres database at port 5432

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DB_NAME?schema=public"
```

- Install dependencies

```bash
npm install
```

- Initialize database schema

```bash
npx  prisma  migrate  deploy
```

## NPM scripts

1. Run dev

```bash
npm  run  dev
```

2. Build

```bash
npm  run  build
```

3. Run production

```bash
npm  run  start
```
