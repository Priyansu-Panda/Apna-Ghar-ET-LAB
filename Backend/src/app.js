const express = require("express");
const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const cookieParser = require("cookie-parser")
const cors = require("cors");

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/",authRoutes);
app.use("/",propertyRoutes);



module.exports = app;