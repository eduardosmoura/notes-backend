# notes-backend
Notes Backend API (Node + Express + MongoDB + JWT)

### Details
* API that allows users to create, read, update, and delete notes (CRUD)
* Allows users to share their notes with other users
* Search for notes based on keywords

### Technical Details
* A secure and scalable RESTful API using `NodeJS` and `Express`
* NoSQL Database using `MongoDB`
* Authentication protocol using `JWT` and rate limiting / request throttling to handle high traffic using `Express-Rate-Limit`.
* Search functionality for notes based on keywords using `Text Index` and `Score Meta`
* Unit tests and integration tests using `Jest` and `Supertest`

### API Endpoints

#### Authentication Endpoints
* POST /api/auth/signup: create a new user account
* POST /api/auth/login: log in to an existing user account and receive an access token

#### Note Endpoints
* GET /api/notes: get a list of all notes for the authenticated user
* GET /api/notes/id: get a note by ID for the authenticated user
* POST /api/notes: create a new note for the authenticated user
* PUT /api/notes/id: update an existing note by ID for the authenticated user
* DELETE /api/notes/id: delete a note by ID for the authenticated user
* POST /api/notes/id/share: share a note with another user for the authenticated user
* GET /api/search?q=query: search for notes based on keywords for the authenticated user

### Rest Client
* Sends HTTP request and view the response in VS Code directly
* [`rest-client/authLogin.rest`](rest-client/authLogin.rest)
* [`rest-client/authSignup.rest`](rest-client/authSignup.rest)
* [`rest-client/noteCreate.rest`](rest-client/noteCreate.rest)
* [`rest-client/noteDelete.rest`](rest-client/noteDelete.rest)
* [`rest-client/noteList.rest`](rest-client/noteList.rest)
* [`rest-client/noteRead.rest`](rest-client/noteRead.rest)
* [`rest-client/noteSearch.rest`](rest-client/noteSearch.rest)
* [`rest-client/noteShare.rest`](rest-client/noteShare.rest)
* [`rest-client/noteUpdate.rest`](rest-client/noteUpdate.rest)

### Dev Dependencies
* faker (Generates fake data)
* jest (Testing)
* nodemon (Automatic restart)
* prettier (Code formatter)
* sinon (Standalone test spies, stubs and mocks)
* standard (Eslint)
* supertest (Endpoint testing with Jest)

### Dependencies
* bcrypt (Password hashing for NodeJS)
* cors (Enable All Cors Requests)
* dotenv (Loads environment variables into process.env)
* express (Web Framework for NodeJS)
* express-rate-limit (Rate Limiting and Request Throttling)
* jsonwebtoken (JSON Web Tokens)
* mongoose (MongoDB Object Modeling for NodeJS)
* mongoose-unique-validator (Validates unique fields within a Mongoose schema)
* swagger (OpenAPI Documentation)

### ENV File
* Copy file from **.env.example** to **.env** in same location and add values

### Scripts
```shell
 npm install
 npm run dev
 npm run test
```

### Local Development
* Setup `.env` file
* Setup a local `MongoDB` database
* Run the API using `npm run dev`

### Live Deployment
* https://notes-api-ggzj.onrender.com/api/docs/
* The deployed API could be on `idle` state so please wait a few seconds after hitting it at the first time
