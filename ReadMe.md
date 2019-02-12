### 1. Clone the repo
```
git clone git@github.com:nitingupta220/graphql-server.git
```
### 2. Install all the required dependencies
```
npm install
```
### 3. Host the db.json so we can fetch the data in our app
```
json-server --watch db.json
```
### 4. Check whether the data has been hosted or not by browser to
``` 
localhost:3000/users
localhost:3000/companies
```


### 5. Run our app server
``` 
npm run start
```

### 6. Now browse to
```
localhost:4005/graphl
```

### You should see GraphQL client on the page

### Now make queries and have fun :)

## Some example queries

### Querying a User with it's id
```
{
    user(id: "21") {
        id
        firstName
        age
    }
}
```
### Querying a company with it's id
```
{
  company(id:"2"){
    id
    name
    description 
  }
}
```

### Querying a company and the user who worked in that company
```
{
  company(id:"2"){
    id
    name
    description
    users{
      id
      firstName
      age
    }
  }
}
```

### Now some mutation examples

### adding a new user
```
mutation{
  addUser(firstName:"sandip",age:23, companyId:"2"){
   id
    firstName
    age
  }
}
```

### deleting a user with it's ID
```

mutation{
  deleteUser(id:"Y74B9tz"){
    firstName
  }
}
```

### Editing the user with ID 23
```
mutation {
  editUser(id: "23", firstName: "medium", age: 50) {
    id
    firstName
    age
  }
}
```