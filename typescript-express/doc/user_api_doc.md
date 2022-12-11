# User

Users member items.

**URL** : `/api/v1/users/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "first_name": "[plain text]",
    "last_name": "[plain text]",
    "email": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "first_name": "henrik",
    "last_name": "henrikson",
    "email": "henrik.henriknson@gmail.com",
    "password": "123"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "success": true,
  "message": "user {first_name} {last_name} added successfully"
}
```

## Error Response

**Condition** : If 'email' exists.

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "success": false,
  "details": "Key (email)=(henrik.henriknson@gmail.com) already exists.",
  "message": "duplicate key value violates unique constraint \"users_email_key\"",
  "name": "error"
}
```

**Condition** : If any argument is in wrong format.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "success": false,
  "error": {
    "code": "ERR_INVALID_ARG_TYPE"
    },
}
```

**URL** : `/api/v1/users/:id`

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "success": true,
  "body": {
    {
        "id":116,
        "first_name":"ben",
        "last_name":"benson",
        "email":"ben.benson@gmail.com",
        "updated_at":"2022-12-10T21:41:54.181Z",
        "last_login":"2022-12-10T21:41:54.181Z",
        "created_at":"2022-12-10T21:41:54.181Z"
    }
  }
}
```

## Error Response

**Condition** : If 'id' do not exists.

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "success": false,
}
```

**URL** : `/api/v1/users/:id`

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "success": true,
  "body": {
    {
        "id":116,
        "first_name":"ben",
        "last_name":"benson",
        "email":"ben.benson@gmail.com",
        "updated_at":"2022-12-10T21:41:54.181Z",
        "last_login":"2022-12-10T21:41:54.181Z",
        "created_at":"2022-12-10T21:41:54.181Z"
    }
  }
}
```

## Error Response

**Condition** : If 'id' do not exists.

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "success": false,
}
```

**URL** : `/api/v1/users/:id`

**Method** : `DELETE`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "success": true,
  "message": "user has been deleted" 
}
```

## Error Response

**Condition** : Database error

**Code** : `500 Internal Server Error`

**Content** :

```json
{
  "success": false,
}
```

*URL** : `/api/v1/users/`

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  [
    {
      "id":150,
      "first_name":"henrik",
      "last_name":"henrikson",
      "email":"henrik.henriknson1@gmail.com",
      "updated_at":"2022-12-10T22:25:25.040Z",
      "last_login":"2022-12-10T22:25:25.040Z",
      "created_at":"2022-12-10T22:25:25.040Z"
    }
  ]
}
```

