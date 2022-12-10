
install: generate-ssh-key generate-enviorments run-postsql-docker install-flask-requirements install-client-requirements install-aiohttp-requirements


generate-client-tester: 
	python -m venv ./client-tester
generate-aiohttp-backend: 
	python -m venv ./aiohttp-backend
generate-flask-backend: 
	python -m venv ./flask-backend

install-flask-requirements:
	pip install -r ./flask-backend

install-client-requirements:
	pip install -r ./client-tested

install-aiohttp-requirements:
	pip install -r ./aiohttp-backend

generate-enviorments: generate-client-tester generate-aiohttp-backend generate-flask-backend ts-example

create-envs-files:
ifeq ("$(wildcard *.env)","")
	cp docker.env.example docker.env 
endif

run-postsql-docker: create-envs-files
	docker-compose up -d

ts-example: 
	npm install --prefix ./typescript-express


generate-ssh-key:
ifeq ("$(wildcard *.crt *.key *.pem)", "")
	openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out MyCertificate.crt -keyout MyKey.key 
endif


# run-client:
# run-flask-server:
# run-aiohttp-server:
run-ts-server:
	npm start --prefix ./typescript-express