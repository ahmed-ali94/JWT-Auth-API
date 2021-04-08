const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require("../model/User");

router.get('/verify', async (req,res) => {

    const token = req.header('Authorization').split(' ')[1];

    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = await jwt.verify(token,process.env.TOKEN_SECRET);
        var userId = verified._id;

        // send user id to mongodb to ge tuser details

        const userDetails = await User.findById(userId).exec();

        res.send(userDetails.toJSON(),200);
        
    } catch (error) {

        res.status(400).send(error.message);
        
    }

    


});


module.exports = router;