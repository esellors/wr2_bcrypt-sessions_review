const bcrypt = require('bcryptjs');

module.exports = {
    registerUser: (req, res) => {
        const db = req.app.get('db');
        const { username, password } = req.body;

        // rule out existing user
        db.auth.get_user({username})
            .then(dbRes => {
                if (dbRes[0]) {
                    return res.status(403).send('Username Taken')
                } else {
                    // create hash for new user
                    const salt = bcrypt.genSaltSync();
                    const hash = bcrypt.hashSync(password, salt)
                    
                    // add new user to db and get back info
                    db.auth.add_user({username, hash})
                        .then(dbRes => {
                            // delete hash from dbRes info, add to session, & send response to client
                            delete dbRes[0].hash

                            req.session.user = { ...dbRes[0] } 
                            
                            res.status(200).send(req.session.user)
                        })
                }
            })
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