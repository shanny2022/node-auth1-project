const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// Configure express-session middleware
server.use(session({
  name: 'chocolatechip', // name of the cookie
  secret: 'keep it secret, keep it safe', // used for cookie encryption
  cookie: {
    maxAge: 1000 * 60 * 60, // valid for 1 hour
  },
  httpOnly: true, // prevent client-side JS from accessing the cookie
  secure: false, // set to true in production, requires https
  resave: false,
  saveUninitialized: false, // don't create a session until something is stored
}));

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
