# African Marketplace API Documentation

## **SCHEMA**

### ⭐ users

| Field            | Type    | Metadata                            |
| ---------------- | ------- | ---------------------------------- |
| id               | integer | _primary key_ and _autoincrements_ |
| email            | string  | _required_ and _unique_            |
| password         | string  | _required_                         |
| first_name       | string  | _required_                         |
| last_name        | string  | _required_                         |
| shop_name        | string  | _required_                         |
| location_id      | integer | _required_                         |
| role_id          | integer | _required_ and _autogenerated_     |

❗ ```location_id``` and ```role_id``` are foriegn keys!

---
### ⭐roles

| Field      | Type    | Metadata                           |
| ---------- | ------- | ---------------------------------- |
| id         | integer | _primary key_ and _autoincrements_ |
| role       | string  | _required_ and _unique_            |

❗ ```role``` can be ```owner``` (id: 1) or ```shopper``` (id: 2).

---
### ⭐locations

| Field      | Type    | Metadata                           |
| ---------- | ------- | ---------------------------------- |
| id         | integer | _primary_ and _autoincrements_ |
| location   | string  | _required_ and _unique_            |

❗ ```location``` can be ```KEN``` (id: 1), ```TZA``` (id: 2), ```RWA``` (id: 3), or ```UGA``` (id: 4).

### ⭐products

| Field            | Type    | Metadata                           |
| ---------------- | ------- | ---------------------------------- |
| id               | integer | _primary_ and _autoincrements_ |
| item_name        | string  | _required_                         |
| price            | float   | _required_                         |
| description      | string  | _optional_                         |
| user_id          | integer | _required_                         |
| category_id      | integer | _required_                         |

❗ ```user_id``` and ```category_id``` are foreign keys!

### categories

| Field          | Type    | Metadata                           |
| ----------     | ------- | ---------------------------------- |
| id             | integer | _primary_ and _autoincrements_ |
| category_name  | string  | _required_ and _unique_            |

❗ These are ```animal products``` (id: 1), ```cereals``` (id: 2), ```clothing and shoes``` (id: 3), ```cosmetics``` (id: 4), ```fruits``` (id:5), ```seeds and nuts``` (id:6), ```vegetables``` (id:7), and ```other``` (id:8).


## **ENDPOINTS**
🌍root url :  https://tt-202-african-marketplace.herokuapp.com

### ⭐POST /api/auth/register/owner
*Adds user with owner role to the database*

request
```json
{
	"email": "jamboojam@email.com",
	"password": "iL0<3j@M",
	"first_name": "Jami",
	"last_name": "Boo",
	"shop_name": "Jam Boo Jams",
	"location_id": "4"
}
```

response:
```json
{
    "message": "Thank you for registering, Jami!", 
	"email": "jamboojam@email.com",
	"shop_name": "Jam Boo Jams",
}
```

### ⭐POST /api/auth/login
*Logs in a registered user with valid credentials and gives a token, if sucessful.*

request:

```json
{
	"email": "jamboojam@email.com",
	"password": "iL0<3j@M",
}
```

response:
```json
{
    "message": "Welcome, Jami",
    "id": "1",
	"token": "wow.thats.a.long.token",
}
```

### ⭐POST /api/auth/add-product
❗ *Due to project restraints, user does not have to be logged in for this to work.*

*Will add a product to the database. ```decription``` can be null.*

request:
```json
{ 
    "item_name": "odd fruit", 
    "category_id": 5, 
    "price": 10.50,
    "description": "odd but sweet" 
}
```
response:
```json
{   "message": "product added!",
    "product": {
        "id": 13,
        "item_name": "odd fruit", 
        "user_id": 1,
        "category_id": 5, 
        "price": 10.50,
        "description": "odd but sweet" 
    }
}
```
### GET /api/auth/users
*Returns an array of registered users.*

response:
```json
[
    {
        "id": 1,
        "shop_name": "Zesty Testy's Spices",
        "role_id": 2,
        "location_id": 1,
        "email": "test@test.com",
        "password": "test",
        "first_name": "Testy",
        "last_name": "Tester"
    },
    {
        "id": 2,
        "shop_name": "Jane Two Exports",
        "role_id": 2,
        "location_id": 2,
        "email": "janedoe@test.com",
        "password": "test",
        "first_name": "Jane",
        "last_name": "Doe"
    },
    {
        "id": 3,
        "shop_name": "Jamboo Jams",
        "role_id": 2,
        "location_id": 3,
        "email": "jamboo@test.com",
        "password": "test",
        "first_name": "Jam",
        "last_name": "Boo"
    },
]
```

### GET /api/auth/users/:userID
*Reutrns a object containing the user data that is associated with the id in the url*.

request url: 

https://tt-202-african-marketplace.herokuapp.com/api/auth/users/1

response:
```json
{
    "id": 1,
    "shop_name": "Zesty Testy's Spices",
    "role_id": 2,
    "location_id": 1,
    "email": "test@test.com",
    "password": "test",
    "first_name": "Testy",
    "last_name": "Tester"
}
```

### GET /api/products
*Auth not required. Returns an array of all added products.*

response:
```json
[
  {
    "id": 1,
    "item_name": "test item",
    "user_id": 1,
    "category_id": 3,
    "price": "6.99",
    "description": "looks good!"
  },
  {
    "id": 2,
    "item_name": "dummy product",
    "user_id": 2,
    "category_id": 3,
    "price": "3.00",
    "description": "comfortable!"
  },
  {
    "id": 3,
    "item_name": "unknown item",
    "user_id": 1,
    "category_id": 8,
    "price": "0.01",
    "description": null
  },
]
```

### GET /api/products/:productID
Auth not required. Returns an object containing the product data that is associated with the id in the url.

request url:

https://tt-202-african-marketplace.herokuapp.com/api/products/1

response:
```json
{
    "id": 1,
    "item_name": "test item",
    "user_id": 1,
    "category_id": 3,
    "price": "6.99",
    "description": "looks good!"
}
```