# Example-Backends
    This was intended to create several simple backends that can be showcased.
    The idea is to have multiple backends in varing frameworks

    planned backends:
    1. aiohttp
    1. flask
    1. django
    1. asp.net
    1. javaspring
    1. actix-web-rs
    1. rocket-rs
    1. warp.rs

    Currently only typescript is implemented
# Database(DB)
    The current only supported database is postgresql. All servers should include configuration files to change connection string if postgres is unwanted locally.
## Setup db
    you need the following:
    
    - openssh
    - python
    - [docker](https://www.docker.com/) and docker-compose
    - [psql](https://www.postgresql.org/docs/current/app-psql.html)
    - make

    TBC
    (note there might be compatibility issues with operating systems feel free to contact me for assistance.)

    At the moment, This repo is using self signed keys, they are required if any of the apps are going to run. they will be prompted first time installing, all fields can be left to default. WIP.

    If you want to setup database with custom settings, edit the ``` docker.env ```file with your prefered settings, the docker container by default has a pgadmin intance.

    Then run ``` make install-db ``` this will setup the local postgres instance


# Typescript-Express
    Typescript express backend, with the following structure
    ```
    ------typescript-express
    |--- __test__
    |--- doc
    |--- src
        |--- api
            |--- members
            |--- monitor
        |--- db
        |--- handlers
        |--- models
        |--- utils
    ```
    documentation on function is found within doc
## Setup Typescript
    only requirement is that [node](https://nodejs.org/en/) is available.
    go into the typescript-express folder and create an .env files with prefered settings, se example included. 
    to run tests either run 
    ``` make ts-run-test ``` from parent folder, or directly with ``` npm run test ```
    
    to run server ``` make run-ts-server ``` from the root directory of the repo.
    it should then be available on your https://localhost:5000, it may require you accept self signed key.

    This backend uses typescript and express to create an REST API. The API has also a monitor that can give general metrics on what is going on.

# Client-tester
    The clientester generates 30_000 clients and does mass tests on a backend, it requires the target is on port 5000, it is not currently configurable (to be implemented).
    To run a bench mark run 
    ``` make run-benchmark ```


