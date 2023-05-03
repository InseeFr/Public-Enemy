# Public-Enemy

Contextualized questionnaire vizualisation tools developped with react/mui/vite

This project is directly linked with [Public Enemy Backoffice](https://github.com/InseeFr/Public-Enemy-Back-Office/) to create and save questionnaires.

## Global project concept

Public-Enemy (& backoffice) is a tool used to test questionnaires with data. Questionnaire designer create questionnaire in pogues but can't test them with predefined data directly. Public-Enemy gives to the designer the ability to inject a questionnaire in orchestrators (stromae, queen soon), and add predefined survey units data in the orchestrators for this questionnaire.

Public-Enemy's global functionalities for a designer:

- create a questionnaire in public-enemy
  - retrieve the questionnaire from pogues
  - create the questionnaire in public-enemy
  - inject the questionnaire and survey units data (given by the designer when creating questionnaire in public-enemy) in the orchestrators
- update a questionnaire in public-enemy
  - synchronise the questionnaire with the orchestrators (when pogues questionnaire has been edited for example, or to change survey units data)
- delete a questionnaire in public-enemy
  - delete questionnaire in orchestrators
- access to questionnaire in orchestrators
  - designer can access to a questionnaire in orchestrators for a specific survey unit
  - designer can reset a specific survey unit data

## Requirements

For building and running the application you need:

- yarn
- a public-enemy environment (backoffice, db, pogues, stromae) configured and running

## Install

```shell
yarn
```

## Running the application locally

```shell
yarn start
```

## Docker/Kubernetes

A Dockerfile is present on this root project to deploy a container. You can [get docker images on docker hub](https://hub.docker.com/r/inseefr/public-enemy/tags)

[Helm chart repository](https://github.com/InseeFr/Helm-Charts/) is available for the public-enemy backoffice/frontend

The repository contains helm charts to deploy pogues/eno/stromae too.

## Create a production build

```shell
yarn run build
```

### Configuration

Before launching app, you must set up some environment variables:

```
# base url of public-enemy api (back-office)
VITE_API_URL=http://localhost:8080/api
# root url of orchestrator ui
VITE_ORCHESTRATOR_URL=http://localhost:3001
# root url of pogues ui
VITE_POGUES_URL=http://localhost/pogues
# documentation url
VITE_DOCUMENTATION_URL=http://localhost/documentation
# locale
VITE_LOCALE=fr
```

For docker, the environment variables can be injected as system environment variables, a script is used to generate environment variables after build time, see Dockerfile and container/env.sh)

## Libraries used

- typescript
- vite
- react
- react mui
- react-intl
- react-query
- husky
- tss-react
- notistack
- eslint
- semantic-release

## Before you commit

Before committing code please ensure,  
1 - README.md is updated  
2 - A successful build is run and all tests are successful  
3 - All newly implemented APIs are documented  
4 - All newly added properties are documented

## License

Please check [LICENSE](https://github.com/InseeFr/Public-Enemy/blob/main/LICENSE) file
