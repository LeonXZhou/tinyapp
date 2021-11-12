# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

TinyApp requires user registration and login inorder to shorten URLs and view shortened URLs. The URLs displayed on the main page are account specific.

Shortened URL redirects are accesible by any user though.

## Final Product
Registration page
!["account registration screen"](https://github.com/LeonXZhou/tinyapp/blob/master/docs/registration.png)
URL shortening page
!["long URL shortening page"](https://github.com/LeonXZhou/tinyapp/blob/master/docs/Shorten%20New%20Url.png)
URL list page. Displays all URL shortened by the logged in account.
!["URL list page"](https://github.com/LeonXZhou/tinyapp/blob/master/docs/URL%20list.png)
URL editing page. Allows the the user to update the long URL.
!["long URL editing page"](https://github.com/LeonXZhou/tinyapp/blob/master/docs/Edit%20URL.png)

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