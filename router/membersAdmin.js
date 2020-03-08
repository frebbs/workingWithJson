const express = require('express');
const router = express.Router();
const queryDB = require('../db/DBquries');
const authHelpers = require('../helpers/authHelper');

router.get('/', async (req, res) => {
    req.session.admin = false;
    if(req.session.profile) {
        if (await authHelpers.authCheck(req.sessionID, req.session)) {
            req.session.admin = true;
            return res.render('admin/home', {profile: req.session.profile});
        } else {
            return res.redirect('/login')
        }
    } else {
        return res.redirect('/login')
    }
});


router.get('/getallusers', async (req, res) => {
    if(req.session.admin === true) {

        let foundUsers = await queryDB.json
            .getAllUsers()
            .then(data => {return data})
            .catch(err => console.log(err));

        return res.render('admin/users', {foundUsers})
    } else {
        return res.redirect('/members')
    }
});

module.exports = router;