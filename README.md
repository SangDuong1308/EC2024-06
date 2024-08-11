## APIs docs
[APIs documentation](https://documenter.getpostman.com/view/30706098/2sA3rzLszY)

## Database Seed

* For more information, see code [here](src/data/seedDB.js)

```
node .\seedDB.js --import

```
* Delete Data
```
node .\seedDB.js --delete

```

 ```
├── README.md
├── Tree.md
├── eslint.config.js
├── package-lock.json
├── package.json
├── server.js
└── src
    ├── app.js
    ├── configs
    │   └── config.mongodb.js
    ├── constants
    │   ├── error.reponse.js
    │   ├── httpStatusCode.js
    │   ├── index.js
    │   ├── statusDescription.js
    │   └── success.response.js
    ├── controllers
    │   ├── access.controller.js
    │   ├── category.controller.js
    │   ├── product.controller.js
    │   └── user.controller.js
    ├── data
    │   ├── cake.json
    │   ├── category.json
    │   └── seedDB.js
    ├── dbs
    │   └── init.mongodb.js
    ├── helpers
    │   └── check.connect.js
    ├── models
    │   ├── category.model.js
    │   ├── keytoken.model.js
    │   ├── product.model.js
    │   └── user.model.js
    ├── products_scraper
    │   ├── cakes_detail.py
    │   ├── product_review.py
    │   └── raw_data
    ├── routers
    │   ├── access
    │   ├── admin
    │   ├── cart
    │   ├── category
    │   ├── index.js
    │   ├── product
    │   └── user
    ├── services
    │   ├── access.service.js
    │   ├── keyToken.service.js
    │   ├── product.service.js
    │   └── user.service.js
    └── utils
        ├── auth.js
        ├── errorHandle.js
        ├── index.js
        └── swagger.js
```
