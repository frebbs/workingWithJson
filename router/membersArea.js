const express = require('express');
const router = express.Router();
const queryDB = require('../db/DBquries');


router.get('/', async (req, res) => {

    if(req.session.login === true) {
        let userPosts = await queryDB.messages
            .getAllByUserID(req.session.profile.id)
            .then(data => { return data })
            .catch(err => { console.log(err)});
            res.render('members/home', {profile: req.session.profile, userPosts});
    } else {
        res.redirect('/login');
    }
});

router.get('/createpost', (req, res) => {
    if(req.session.login === true) {
        res.render('members/createPost', {
            profile: req.session.profile
        })
    } else {
        res.redirect('/login')
    }

});

router.get('/logout', async (req, res) => {

    let foundUser = await queryDB.json
        .findBySessionID(req.sessionID)
        .then((data) => {
            return data;
        })
        .catch(err => {
            console.log(err);
        });
    if (foundUser) {
        await queryDB.json
            .addSession(foundUser.id, 'Logged Out')
            .then(() => {
                req.session.profile = {};
                req.session.login = false;
                req.session.admin = false;
                res.redirect('/');
            })
            .catch(err => console.log(err));
    } else {
        res.redirect('/');
    }

});

router.get('/profile/:id', (req, res) => {
    if(req.session.login === true) {
        res.render('members/profile', {
            profile: req.session.profile
        });
    } else {
        res.redirect('/login');
    }

});

module.exports = router;








