# Node-TS-Api-Base

This project includes the boilerplate for a basic rest-api made in Node.JS with Express + Typescript.

## Basic Requirements

1. Install Node.js (lts-version v14.16.0)
2. Install `yarn` if not present `curl -o- -L https://yarnpkg.com/install.sh | bash` (macOS and generic Unix environments)
3. Install required dependencies by `yarn`
4. `cp .example.env .env.dev`
5. `cp .example.env.test .env.test`
6. Create your DB (i.e. psql for Postgres: `psql -U <user> -h <host> -c "create database <db name>;"`) with same name of the TYPEORM_DATABASE property inside of the .env file.
7. Run `yarn [dev,test,prod]:db`.
8. Start your server with `ENV=[dev, prod] yarn dev`.

## Some scripts

Add `ENV=[dev, prod]` before running scripts.
Why?: [Configuration file used by Typeorm](https://typeorm.io/#/using-ormconfig/which-configuration-file-is-used-by-typeorm)

Run `yarn build` to build js from typescript source.

Run `yarn start` to start the server from the compiled folder (/dist).

Run `yarn test` to run tests.

Run `yarn dev` to start and automatically detect any source-code changes, restarting the server as well.

Run `yarn typeorm schema:drop` to drop your schema of the DB.

Run `yarn typeorm schema:sync` to resync the schema of your DB.

Run `yarn seed:run` to run seed files.

Run `yarn db:reset` to drop schema and re run it, then seed the DB.

Run `yarn typeorm migration:generate -n <migration's name>` to create a new migration.

Run `yarn typeorm migration:run` to run pending migrations.

Run `yarn typeorm migration:revert` to rollback migrations.

Run `yarn typeorm migration:show` to see the list of all migrations (pending and also ran).

Run `yarn dev:db` to setup the database using the dev environment variables.

Run `yarn test:db` to setup the database using the test environment variables.

Run `yarn prod:db` to setup the database using the prod environment variables.
<<<<<<< HEAD
=======

>>>>>>> 2e233c3 (Add ci config for redis)

## Github Actions
Our CI workflow is based on [Github Actions](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions), for this, we need to set several secret keys for integrated with some services like SonarQube or databases for example.
To configure these keys in the GitHub repo, you can follow the next [guideline](https://docs.github.com/en/actions/learn-github-actions/security-hardening-for-github-actions#using-secrets).
| Action                                                     | Secret Key             |
|------------------------------------------------------------|------------------------|
| Password for the database that is used in the testing step | TEST_POSTGRES_PASSWORD |
| GitHub personal access token to run the auto-merge task    | GH_PERMISSIONS_TOKEN   |


## Running with Docker

### Prerequisites
In order to run the app with Docker, you should install or update to the latest version, we recommend to install [Docker-Desktop](https://docs.docker.com/get-docker/) due to composer and some cool CLI-UI tools are included.

### Development with Docker

The following commands will build and run all you need to start working on the project, without any other installation requirements. Important: if you already have postgres running locally, you'll need to kill the service before run `docker-compose up`.

```
docker-compose --env-file .env.dev build
```

```
docker-compose --env-file .env.dev up
```

### Configure PgAdmin4 
1.Run the following command that will start a pgadmin instance on localhost:5050.

```
docker run --rm -p 5050:5050 thajeztah/pgadmin4
```

2.Go to create Servers, create server... 
3.Configure the connection tab host value with you IP as a host. 
4.Give the server a name on the general tab and then hit save.


### Deployment with Docker (only for production)

The following commands will `build and run` a Docker image ready for production and size-optimized.

#### Build Docker image

```
docker build -f Dockerfile.prod -t node-ts-api-base .
```

#### Run docker image (you need to add .env file as param)

```
docker run --rm --env-file=.env.prod -p 3000:3000 --name node-api node-ts-api-base
```

### Fix issue at build docker image (dependencies to install bcrypt are not providede in alpine version of node)
 
Add the following line before the command ` RUN yarn ` in the Dockerfile.

```
RUN apk --no-cache add --virtual builds-deps build-base python
```

## API Documentation

After running the server you will find OpenAPI Specification here: `http://<host>:<port>/docs`


## App scaffolding

This is the suggested scaffolding for this project. You can take a look at:

```bash
.
├── __tests__
│   └── ...
├── src
│   ├── config
│   │   └── ...
│   ├── controllers
│   │   └── ...
│   ├── database
│   │   └── ...
│   ├── entities
│   │   └── ...
│   ├── interfaces
│   │   └── ...
│   ├── services
│   │   └── ...
│   ├── utils
│   │   └── ...
│   ├── views
│   │   └── ...
│   ├── app.ts            (App root and is where the application will be configured.)
│   ├── server.ts         (HTTP server)
├── README.md
├── .nvmrc                (Locks down your Node version.)
├── jest.config.js        (Jest configuration file.)
├── yarn-lock.json
├── package.json          (Your application’s package manifest.)
├── tsconfig.json         (The TypeScript project configuration.)
├── prod-path.js          (Tool used to run in production, translates ts-path and alias)
```

## Dependencies

- [routing-controllers](https://github.com/typestack/routing-controllers) - Create structured class-based controllers with decorators usage in Express.
- [routing-controllers-openapi](https://www.npmjs.com/package/routing-controllers-openapi) - Runtime OpenAPI v3 schema generation for routing-controllers.
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) - Serves auto-generated swagger-ui API docs from express.
- [typeorm](https://typeorm.io/#/) - NodeJS ORM.
- [nodemon](https://nodemon.io/) - Utility that will monitor for any changes in your source and automatically restart your server.
- [multer](https://github.com/expressjs/multer) -  NodeJS middleware for handling multipart/form-data.
- [tsconfig-paths](https://github.com/dividab/tsconfig-paths#readme) - Utility to register relative paths set at tsconfig file
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit) - Basic rate-limiting middleware used to limit repeated requests to public APIs
- [morgan](https://github.com/expressjs/morgan) - HTTP request logger middleware for node.js
- [nodemailer](github.com/nodemailer/nodemailer) - Module for Node.js to allow the easy email sending. 
- [typedi](https://github.com/typestack/typedi) - Module to manage the DI

## Docs

[Express documentation](https://expressjs.com/es/)
[Typescript documentation](https://www.typescriptlang.org/)
