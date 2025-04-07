const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.permission === "Owner") {
        next()
    } else {
        return res.status(401).json({
            error: true,
            message: "Unauthorized Admin",
            data: null
        })
    }

}
module.exports = verifyAdmin