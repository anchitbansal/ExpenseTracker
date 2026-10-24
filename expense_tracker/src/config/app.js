require('./paths');

const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");

const routes = require("../module/routes/routes");

const { routeNotFound } = require("../middlewares/routeNotFound.middleware");
const { initialValidation } = require("../middlewares/initialValidation.middleware");
const { jwtmiddleware } = require("../middlewares/jwt.middleware");
const{ userAuth } = require("../middlewares/userAuth.middleware");
const{ deviceAuth } = require("../middlewares/deviceAuth.middleware");

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileupload());

// Static
app.use(express.static(PATHS.public));

app.use("/api/user", initialValidation);
app.use("/api/user/auth", jwtmiddleware);
app.use("/api/user/auth", userAuth);
app.use("/api/user/auth", deviceAuth);

app.use("/api", routes);


app.use(routeNotFound);


module.exports = app;