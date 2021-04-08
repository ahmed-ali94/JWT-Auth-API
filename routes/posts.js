const router = require('express').Router();

router.get('/verify', (req,res) => {

    const token = req.header('auth-token');

    if (!token) return res.status(401).send("Access denied");

    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET, (error,decoded) => {

            if(error) return res.status(401).send(error.message);
            

        });
        req.user = verified;
        
    } catch (error) {

        res.status(400).send(error);
        
    }

    res.json(req.user);


});


module.exports = router;