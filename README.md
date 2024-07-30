 ```
 server
├── README.md
├── Tree.md
├── package-lock.json
├── package.json
├── server.js
└── src
    ├── app.js
    ├── configs
    │   └── config.mongodb.js
    ├── constants
    │   ├── error.reponse.sjs
    │   ├── httpStatusCode.js
    │   ├── statusDescription.js
    │   └── success.response.js
    ├── controllers
    │   └── access.controller.js
    ├── dbs
    │   └── init.mongodb.js
    ├── helpers
    │   └── check.connect.js
    ├── models
    │   ├── keytoken.model.js
    │   └── user.model.js
    ├── routers
    │   ├── access
    │   │   └── index.js
    │   ├── index.js
    │   └── user
    │       └── index.js
    ├── services
    │   ├── access.service.js
    │   ├── keyToken.service.js
    │   └── user.service.js
    └── utils
        ├── auth.js
        ├── checkAuth.js
        ├── errorHandler.js
        └── index.js
```
