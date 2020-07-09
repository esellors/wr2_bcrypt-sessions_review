const bcrypt = require('bcryptjs');

module.exports = {
    registerUser: async (req, res) => {
        const db = req.app.get('db');
        const { username, password } = req.body;
        let foundUser, dbRes;

        // rule out existing user
        try {
            foundUser = await db.auth.get_user({username})
        } catch(err) {
            return res.status(500).send('Error getting user from DB')
        }

        if (foundUser[0]) return res.status(403).send('Username taken');
        
        // create hash for new user

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt)

        // add new user to db and get back info

        try {
            dbRes = await db.auth.add_user({username, hash});
        } catch(err) {
            return res.status(500).send('Error adding user to DB')
        }

        // delete hash from info, add to session, & send response to client

        delete dbRes[0].hash;
        req.session.user = { ...dbRes[0] };

        res.status(200).send(req.session.user);
    },
    loginUser: async (req, res) => {
        const db = req.app.get('db');
        const { username, password } = req.body;
        let foundUser, dbRes;

        // rule out existing user
        try {
            foundUser = await db.auth.get_user({username})
        } catch(err) {
            return res.status(500).send('Error getting user from DB')
        }

        if (!foundUser[0]) return res.status(403).send('Username or Password Incorrect');
        
        // compare password and hash, reject if no match
        const { hash } = foundUser[0];

        const isAuthenticated = await bcrypt.compare(password, hash);

        if (!isAuthenticated) return res.status(403).send('UUUsername or Password Incorrect');

        // delete hash from info, add to session, & send response to client

        delete foundUser[0].hash;
        req.session.user = { ...foundUser[0] };

        res.status(200).send(req.session.user);
    },
    logoutUser: (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    }
}