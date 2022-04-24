# Tip for testing: 
#   create a .docker.env in the root folder containing at least 2 variables:
#      DOCKER_CONSUL_TOKEN=${Consul Token with access to extract the configutation}
#      DOCKER_ENVIRONMENT=${Environment to load in the run}
#   and then you can build and run the container with tthe following script
#      docker build . && docker run --rm -it $(docker build -q.)

FROM us.gcr.io/cencosudx/build/node:v14.18-alpine3.15 AS builder

WORKDIR /home/app
 
COPY src/ src/
COPY package.json \
     package-lock.json \
     tsconfig.json \
     gulpfile.ts \
     .eslintrc.js \
     .env.example ./
COPY gulpfile.ts ./src

RUN npm install --quiet && \
    npm run env -- gulp build

COPY ./config/ ./dist/config

WORKDIR /home/app/dist

RUN npm install gulp yargs --quiet && \
    npm install --quiet --production

FROM us.gcr.io/cencosudx/golden/node:v14

WORKDIR /home/app
COPY --from=builder /home/app/dist ./

EXPOSE 80

CMD ["-r", "dotenv-safe/config", "index.js", "dotenv_config_path=./config/.env"]