const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')


module.exports.login = async function(request, response){
    const candidate = await User.findOne({email: request.body.email})

    if (candidate){
        // Password verification, user exists
        const passwordResult = bcrypt.compareSync(request.body.password, candidate.password)
        if (passwordResult){
            // Token generation, passwords matched
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})
            response.status(200).json({
                token: `Bearer ${token}`
            })
        } else{
            // Passwords don`t match
            response.status(401).json({
                message: "Passwords don`t match. Please try again."
            })
        }
    } else{
        // User does not exist, error
        response.status(404).json({
            message: "User with this email not found."
        })
    }
}

module.exports.register = async function(request, response){
    // email, password
    const candidate = await User.findOne({email: request.body.email})

    if (candidate){
        // User exists, need to send an error
        response.status(409).json({
            message: "This email is already taken. Please try another."
        })
    } else{
        // Need to create user
        const salt = bcrypt.genSaltSync(10)
        const password = request.body.password
        const user = new User({
            email: request.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            response.status(201).json(user)
        } catch(e){
            // Handle the error
        }
        
    }
}