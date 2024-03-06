# 📜 NodeJs Authentication Server Template
![status](https://img.shields.io/badge/status-up-brightgreen)
This project is a TypeScript API server with JWT authentication and CRU operations for a user.

## 📚Technologies used:

-   **Node.js**
-   **Express**: *Minimal and flexible web application framework. Fast and easy to build.*
-   **TypeScript**: *Adds static typing to the language. Type safety, better tooling, and enhanced code maintainability.*
- **TypeORM**: *Convenient way to interact with DBs using TypeScript classes, manages database schema, and supports multiple database systems.*
- **PostgreSQL**: *Powerful, open-source relational DB. ACID-compliant, supports complex queries, and is known for its extensibility and standards compliance.*
- **Passport**: *Modular and flexible authentication framework, easy to integrate different authentication methods.*
-   **JWT authentication strategy**: *Stateless, allows for token-based authentication, and can include roles, permissions, etc. in a secure way.*
- **Bcrypt**: *Securely hashes passwords, adds a level of security against password-related attacks, and is widely used for password storage.*
- **Jest**: *Provides a test runner, assertion library, and spies, making it easy to write and run tests. Known for its speed and ease of use.*

## 🧪Getting Started

 1. **Clone the repository:**
 ```sh
 $ git clone git@github.com:HugosMind/AuthServiceTemplate-MA.git
 ```
 2. **Install PostgresQL.** I used Docker:
```sh
docker run -itd -e POSTGRES_USER=Micron -e POSTGRES_PASSWORD=Agritech -p 5432:5432 -v /data:/var/lib/postgresql/data --name postgresql postgres
```
**Any other credentials and DB can be used changing the `ormconfig.json` accordingly.*

 3. **Install dependencies:**
 ```sh
$ npm install
```
**Create a `.env` file in the root of the project and add your `JWT_SECRET`. Otherwise "Testing?" will be used*

 4. **Start the server:**
```sh
$ npm start
```
5. **Try it out:**

The server will be running at `http://localhost:3000`
It has these endpoints:

```
POST /api/users/register   Creates one user
POST /auth/login           Authenticates a user and returns a JWToken
GET /api/users/profile     Returns the authenticated user info
PUT /api/users/profile     Updates the authenticated user info
```

# Tests

There are some unit tests and some integration tests. The coverage is around 90%. To make them run:
 ```sh
$ npm test
```
