# Back-End Server #
-  Typescript / Node.js / Express.js / Apollo / Graphql / PostgreSQL / Redis / argon2d 
- supports login and registration
- cookies are used to keep track of the user's session and to keep the user logged in
- use a PostgreSQL database to store user information
- uses argon2d to hash passwords
- redis-connect is used to store session information 


# How do sessions work? #
- When a user logs in, a session is created and stored in the redis database
- The session is stored in the user's cookies
- req.session is used to access the session information
- req.session.userId = userId
  - userId: 1 --> sent to redis
  - redis has a key with the userId stored
- express session middleware sets a cookie on the browser 
- When a user makes a request, the cookie is sent to the server
- The server unsigns / decrypts the cookie and checks if the session exists in the redis database 