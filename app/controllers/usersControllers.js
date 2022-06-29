const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const usersController = {}

usersController.register = async (req, res) => {
    const body = req.body 
    const user = new User(body)
    const salt = await bcryptjs.genSalt()
    const encrypted = await  bcryptjs.hash(user.password, salt)
    user.password = encrypted
    user.save()
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })      
}

usersController.login = async (req, res) => {
    const body = req.body 
    const userData = await User.findOne({ email: body.email })
    console.log(userData)
    if(!userData) {
        res.json({
             errors: 'invalid email or password'
        })
    }
            const match = await bcryptjs.compare(body.password, userData.password)
                    if(match) {
                        const tokenData = {
                            _id: userData._id,
                            email: userData.email,
                            username: userData.username
                        }
                        // let privateKey = fs.readFile('./private.pem');
                        // console.log(privateKey)
                        const token = jwt.sign(tokenData, 'taaj123', { expiresIn: '2d'})
                        // const token = jwt.sign(tokenData,{ key: privateKey}, {algorithm: 'RS256'}, {expiresIn: '2d'})
                        res.json({
                            token: `Bearer ${token}`
                        })
                    } else {
                        res.json({ errors: 'invalid email or password'})
                    }
}

usersController.account = (req, res) => {
    res.json(req.user)
}



module.exports = usersController