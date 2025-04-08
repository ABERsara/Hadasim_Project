require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/connectDB");
const app = express();
const PORT = process.env.PORT || 2024;
const path = require("path");

connectDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("HomePage");
});

app.use("/api/products", require("./routers/productRouter"));
app.use("/api/orders", require("./routers/orderRouter"));
app.use("/api/auth", require("./routers/authRouter"));
app.use("/api/suppliers",require("./routers/suppliersRouter"))
app.use("/api/stock",require("./routers/stockRouter"))
app.use("/api/sales",require("./routers/salesRouter"))

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send("Something broke!");
});

mongoose.connection.once("open", () => {
    console.log("Connected to DB success");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

mongoose.connection.on("error", (err) => {
    console.error("Connected to DB failed:", err);
});