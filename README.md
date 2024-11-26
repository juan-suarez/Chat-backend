# backend side project 

## Description

- **Infraestructure :** Api working with a nodeJs server, sqlLite data base runing in a free server [turso](https://turso.tech/), cookies injection, midelwares and jwt tokens for authorization. 
- **Code Architecture :** code workflow follows the hexagonal architecture, using the domain layout for db manipulation and entities, application for adapters and use-cases, and infraestructure for controllers, auth and midelware logic.

## App Init

### Instalation
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev
```

### Db model
![image](https://github.com/user-attachments/assets/0dec0b05-d436-4ce0-a0e2-bc282e73ee77)
https://dbdiagram.io/d/6746439de9daa85acacfcf38

