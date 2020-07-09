const bcrypt = require('bcryptjs');

// async function doIt() {}

// doIt()

module.exports = {
    registerUser: async (req, res) => {
        const db = req.app.get('db');
        const { username, password } = req.body;
        
        // rule out existing user
        const foundUser = await db.auth.get_user({username})
        if (foundUser[0]) return res.status(403).send('Username Taken')
        
        // create hash for new user
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        
        // add new user to db and get back info
        const newUser = await db.auth.add_user({username, hash})
        
        // delete hash from info, add to session, & send response to client
        delete newUser[0].hash

        req.session.user = { ...newUser[0] } 
                            
        res.status(200).send(req.session.user)
    },
    loginUser: (req, res) => {


        // rule out existing user


        // compare password and hash, reject if no match

        

        // delete hash from info, add to session, & send response to client



        res.status(200).send('HI DAD');
    },
    logoutUser: (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    }
}