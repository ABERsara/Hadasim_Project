const verifySupplier = (req, res, next) => {
    if (req.user && req.user.permission === "Supplier") {
        next();
    } else {
        return res.status(401).json({ error: true, message: "Unauthorized Supplier", data: null });
    }
};

module.exports = verifySupplier;