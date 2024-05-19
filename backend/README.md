## Description

URL shortener API

## Installation

```bash
$ npm install
```

## Create .env file based on .env.example

```bash
$ cp .env.example .env
```

## Docker

```bash
# Inside .docker folder, execute
$ docker compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests (postgres and redis test containers should be up and running)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
