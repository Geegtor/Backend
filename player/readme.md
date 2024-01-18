# NoDaNorm_back
## How to run the app without Docker:
1. Install dependencies ```npm i``` or ```yarn```
2. Run  the app ```npm start``` or ```yarn start```

_Note:_ be sure you have installed Postgres on your machine:

1. Install postgres and save cred's:
  - user('postgres' by default)
  - user password for access (2nd password etnered while installing PG)
  - db name you are going use ('postgres' by default)
  -any other options you've changed from default (port, host)

2. Make sure for etnering the credentials from DB in the .env file in the project root marked wirh 'POSTGRES_' prefix. 

3. Connect to DB with pgAdmin4 / SQL Shell / docker;

Migrations:

  To create/generate migrations use:
    Create
    - npm run migration:create <MigrationName> -- -c  development
    Generate
    - npm run migration:generate <MigrationName> -- -c development
    
    For testing change type of connection to test. Example: -c test 

  To run migrations use:
    For development
    - npm run migration:run development
    For testing
    - npm run migration:run test

Seeds:
  To run seeds:
  - npm run seed:run <SeedName> -- -c development

  
## Swagger API:

  1. Install dependencies ```npm i``` or ```yarn```

  2. Visit URL <your_hostname:port>/swagger
