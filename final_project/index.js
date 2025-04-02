const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { secretKey } = require("./config/config.js");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  }),
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token;
  if (token) {
    // verify
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(403).send("Invalid token");
      } else {
        next();
      }
    });
  } else {
    res.status(403).send("No token has been provided");
  }
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
