# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). The TinyApp have encrypted cookies, user registration and login functionality that stores the user's password as a hash using bcryptjs. The App keeps track of which URLs belong to which particular user and displays as such.

## Final Product

!["The urls page when the user is not logged in"](https://github.com/Jackthz97/tinyapp/blob/main/docs/urls-page-not-logged-in.png?raw=true)

!["This is the registration page"](https://github.com/Jackthz97/tinyapp/blob/main/docs/Registration-page.png?raw=true)

!["This is the login page"](https://github.com/Jackthz97/tinyapp/blob/main/docs/Login-page.png?raw=true)

!["Create url page where user can create short urls by providing a long url"](https://github.com/Jackthz97/tinyapp/blob/main/docs/create-new-url-page.png?raw=true)

!["The is the edit url page where user can edit the long url"](https://github.com/Jackthz97/tinyapp/blob/main/docs/edit-url-page.png?raw=true)

!["Example of a logged in user"](https://github.com/Jackthz97/tinyapp/blob/main/docs/urls-page-user1.png?raw=true)

!["Example of a second user"](https://github.com/Jackthz97/tinyapp/blob/main/docs/urls-page-user2.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.