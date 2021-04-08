const router = require('express').Router();
const User = require("../model/User");
const brcypt = require("bcryptjs");
const {registerValidation,loginValidation} = require('../validation');
const jwt = require('jsonwebtoken');






router.post('/register', async (req,res) => {


    // lets validate user before we create a new user

    const {error} = registerValidation(req.body);
     
    if (error) return res.status(400).send(error.details[0].message);

    // check if user is already in the database
    const emailExist = await User.findOne({email: req.body.email});

    if (emailExist) return res.status(400).send("Email already exists");

    // Hash Password
    const salt = await brcypt.genSalt(10);
    const hashedPassword = await brcypt.hash(req.body.password,salt);




    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {

        const savedUser = await user.save();
        res.send({user: user._id});
        
    } catch (error) {

        res.status(400).send(error);
        
    }

    

});



router.post('/login', async (req,res) => {


    // lets validate user before we sign in

    const {error} = loginValidation(req.body);
     
    if (error) return res.status(401).send(error.details[0].message);

    // check if email exists
    const user = await User.findOne({email: req.body.email});

    if (!user) return res.status(401).send("Email or password is wrong");

    // check pasword

    const validPass = await brcypt.compare(req.body.password, user.password);

    if (!validPass) return res.status(401).send('password is wrong');

    // create and assign web token

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.send(token);

    







});


module.exports = router;