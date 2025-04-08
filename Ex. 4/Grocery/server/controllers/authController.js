const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Supplier = require("../models/Supplier");

const generateAccessToken = (supplier) => {
    
    const supInfo = {
        _id: supplier._id,
        companyName: supplier.companyName,
        phoneNumber: supplier.phoneNumber,
        representativeName: supplier.representativeName,
        goodsList: supplier.goodsList,
    };
    return jwt.sign(supInfo, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};

const generateRefreshToken = (phoneNumber) => {
    return jwt.sign({ phoneNumber }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const register = async (req, res) => {
    const { companyName, phoneNumber, representativeName, goodsList, password } = req.body;
    if (!companyName || !phoneNumber || !representativeName || !goodsList || !password) {
        return res.status(400).json({ error: true, message: "All fields are required", data: null });
    }
    try {
        const existedSupplier = await Supplier.findOne({ phoneNumber }).lean(); // בדוק לפי מספר טלפון
        if (existedSupplier) {
            return res.status(409).json({ error: true, message: "The supplier already exists!", data: null });
        }
        const hashPwd = await bcrypt.hash(password, 10);
        const supplier = await Supplier.create({ companyName, phoneNumber, representativeName, goodsList, password: hashPwd });
        const accessToken = generateAccessToken(supplier);
        const refreshToken = generateRefreshToken(phoneNumber);
        setRefreshTokenCookie(res, refreshToken);
        const { password: removedPassword, ...supplierWithoutPassword } = supplier.toObject();
        res.json({ accessToken, supplier: supplierWithoutPassword });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: true, message: "Internal server error", data: null });
    }
};

const login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        return res.status(400).json({ error: true, message: "Phone number and password are required", data: null });
    }
    try {
        const foundSup = await Supplier.findOne({ phoneNumber }).populate("goodsList").lean();
        if (!foundSup) {
            return res.status(401).json({ error: true, message: "Unauthorized", data: null });
        }
        const match = await bcrypt.compare(password, foundSup.password);
        if (!match) {
            return res.status(401).json({ error: true, message: "Unauthorized", data: null });
        }
        const accessToken = generateAccessToken(foundSup);
        const refreshToken = generateRefreshToken(phoneNumber);
        setRefreshTokenCookie(res, refreshToken);
        res.json({ accessToken });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: true, message: "Internal server error", data: null });
    }
};

const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ error: true, message: "Unauthorized from refresh no cookies", data: null });
    }
    const refreshToken = cookies.jwt;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decode) => {
        if (err) {
            return res.status(403).json({ error: true, message: "Forbidden from refresh token", data: null });
        }
        try {
            const foundSup = await Supplier.findOne({ phoneNumber: decode.phoneNumber }).populate("goodsList").lean();
            const accessToken = generateAccessToken(foundSup);
            res.json({ accessToken });
        } catch (error) {
            console.error("Error during refresh:", error);
            res.status(500).json({ error: true, message: "Internal server error", data: null });
        }
    });
};

const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(204).json({ error: true, message: "No Content", data: null });
    }
    res.clearCookie("jwt", { httpOnly: true });
    res.json({ error: false, message: "Cookie cleared", data: null });
};

module.exports = { register, login, refresh, logout };