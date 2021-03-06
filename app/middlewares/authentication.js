const jwt = require('jsonwebtoken')
const User = require('../models/user')
const fs = require('fs/promises')
const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1]
    let tokenData 
    try {
        // tokenData = jwt.verify(token, 'taaj123')
        var cert = await fs.readFile('public.pem');
        tokenData = jwt.verify(token, cert, { algorithms: ['RS256'] })
        User.findById(tokenData._id)
            .then((user) => {
                req.user = user 
                next()
            })
            .catch((err) => {
                res.json(err)
            })
       
    } catch(e) {
        res.json(e.message)
    }
}

// const authorizeUser = () => {

// }

module.exports = {
    authenticateUser
}