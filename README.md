                                    routers => controllers => services => models

```
server
├── README.md
├── package-lock.json
├── package.json
├── server.js
└── src
    ├── REST_Client
    │   └── access.post.http
    ├── app.js
    ├── auth
    │   └── authUtils.js
    ├── configs
    │   └── config.mongodb.js
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
    │   └── keyToken.service.js
    └── utils
        └── index.js
```
