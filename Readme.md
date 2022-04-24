
# Base Api

**Subscriber Project** that demostrate a simple task that print in the console the a super secret in the console (_requested as a dependency in the manifiest_), lift a server to get the live probeness for a kubernets environmet and finally connect to a nats queue ^^... all the things that we usually do when try to processing data following **data stream pipeline** concept in a k8s environment.

## Installation

In order to get this project work, the first step is to get all configuration files needed for running (_for example the .env file_)... and for do that run the following command in the terminal to get via **consul** all the required files.

**_Notes:_** We encourage you to all the **config files sensitive data** keep in the **config folder**, because following this "practice" will keep just one folder to treath this kind of data , and will be easy to mantain.

```bash
# extract all the environment files needed to running the project 
# note: you need a valid consul token with access
gulp config #-t YOUR_CONSUL_TOKEN
```

**_Tip:_** All the configuration for treath the sensitive data keep in **docker/config.hcl**... so if you want to add more files or configurations, now you know what is the file that you need to edit ^^.


## Develop inside k8s with devspace

In a container's world ^^, we need to work in a cluster environment (_like underworld_), and for that reason , we simulate this "k8se environment" with [devspace](http://devspace.sh) ,(_and also we loved the devspace UI_).

Devspace build, and run the kubectl command necesary to lift this project into the cluster (to create a local cluster , just clone the [Local k8s preparation](https://bitbucket.org/walmartdigital/dobby-local-environment-preparation/src/master/)), and run wih ```gulp cluster```; After that you will your project runnning inside a docker container and exposed via the kong ingress and with
**hot reloading** , **file sync**, and also you can use the UI [Devspace UI](http://localhost:8090)

```bash
# build the image and run the kubectl YAML 
gulp run
```

## Docker

Simply and solid... just run the following command if you want to run inside a container docker.

**_Notes_:**
To keep the same "**drone pipeline**", you need to create a **.docker.env** in the root directory with at least two required environment variables:

- **DOCKER_CONSUL_TOKEN:** Consul Token with access to extract the configuration.


```bash
# docker build in interactive mode
docker build . && \
# docker run (if you want get inside the docker just append /bin/bash)
# the K8S_ENVIRONMENT is assigned in the k8s deployment via env args
docker run --env K8S_ENVIRONMENT=development --rm -it $(docker build -q .)
```

## Gulp tasks

We use gulp as a task runner for a bunch of useful process, like for example:

- **"config":** Download and extract all configuration files from **consul** inside the **/config** files, like _.env files, certificates, secrets_ or all kind of sensitive data. 
- **"validate":** Some validation stuff like linting and things like that.
- **"docs":** Build the Readme.md doc dynamically.
- **"build":** Transpile the code from Typescript to Javascript.
- **"run":** Run this project inside a cluster with devspace (hot reload).
- **"local":** Run the code with nodemon to track the changes for ts files.
- **"publish":** Publish the code (_bump version and tagged_), also build the Readme.md.


An example of running the **validate** task is easy as running the following command in your terminal:

```bash
# validate project
gulp validate
```

## Subscriber manifiest

| docker | version | latest build |
| --- | --- | --- | --- |
| hermus-api | 1.0.0 | 2022-02-17T18:46:31.627Z |

