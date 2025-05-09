const jwt = require("jsonwebtoken")

const jwtMiddleWares = (req, res, next) => {
    console.log("InsidemiddleWares");
    const token = req.headers['authorization'].split(" ")[1]
    if (token != "") {
        try {
            const jwtResponse = jwt.verify(token, process.env.jwtPassword)
            console.log(jwtResponse);
            req.userId = jwtResponse.userId
        } catch (error) {
            res.status(401).json("Authorization failed..please login!!!")
        }
    } else {
        res.status(404).json("authorization failed...Token is missing..!!!")
    }
    next()
}

module.exports = jwtMiddleWares