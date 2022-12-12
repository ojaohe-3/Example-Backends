

POSTGRES_DATABASE ?= $(shell bash -c 'read -p "Database: " database; echo $$database')
POSTGRES_USER ?= $(shell bash -c 'read -p "User: " usr; echo $$usr')
POSTGRES_HOST ?= $(shell bash -c 'read -p "Host: " host; echo $$host')


install-db: generate-ssh-key run-postsql-docker create-tables


generate-client-tester: 
	python -m venv ./client-tester


install-client-requirements:
	pip install -r ./client-tester

activate-venv-client: generate-client-tester
	source ./client-tester/bin/activate

run-benchmark: install-client-requirements activate-venv-client
	python ./client-tester/benchmarker.py



create-envs-files:
ifeq ("$(wildcard *.env)","")
	cp docker.env.example docker.env 
endif

run-postgresql-docker: create-envs-files
	docker-compose up -d

create-tables: run-postgresql-docker
	psql -h ${POSTGRES_HOST} -U ${POSTGRES_USER} -d ${POSTGRES_DATABASE} -a -f create_tables.sql


generate-ssh-key:
ifeq ("$(wildcard *.crt *.key *.pem)", "")
	openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out MyCertificate.crt -keyout MyKey.key 
endif


# run-client:
# run-flask-server:
# run-aiohttp-server:


ts-install: 
	npm install --prefix ./typescript-express

ts-build: ts-install
	npm run build --prefix ./typescript-express

run-ts-server: ts-build
	npm start --prefix ./typescript-express

ts-run-test: ts-build
	npm run test --prefix ./typescript-express