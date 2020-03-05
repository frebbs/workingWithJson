const express = require('express');
const router = express.Router();
const queryDB = require('../db/DBquries');
const {isAuth} = require('../helpers/authHelper');


router.get('/', async(req, res) => {

    if(await isAuth(req.sessionID)) {
        res.render('members/home', {userID: req.cookies.profile, name: req.cookies.name});
    } else {
        res.redirect('/')
    }
});

router.get('/logout', async (req, res) => {

    let foundUser = await queryDB.json
        .findBySessionID(req.sessionID)
        .then((data) => {
            return data
        })
        .catch(err => {
            console.log(err)
        });
    if (foundUser) {
        await queryDB.json
            .addSession(foundUser.id, 'Logged Out')
            .then(() => {
                res.redirect('/')
            })
            .catch(err => console.log(err));
    } else {
        res.redirect('/')
    }

});

router.get('/profile/:id', async(req, res) => {

    if(await isAuth(req.sessionID)) {
        await queryDB.json
            .getOneByID(req.params.id)
            .then(data => {
                if (data) {
                    if(data.session_data !== req.sessionID) {
                        res.json({
                            message: "NOT AUTH"
                        })
                    } else {
                        return res.render('members/profile.ejs', {
                            userProfile: data,
                            userID: req.cookies.profile
                        });
                    }


                } else{
                    return res.json({
                        status: '😭',
                        data: "No user with that ID was found"
                    })
                }
            })
            .catch(err => {
                return res.json({
                    status: '💔',
                    message: "Sorry, something went wrong, check the error below",
                    ERROR: err
                })
            });
    } else {
        res.redirect('/login')
    }


});

module.exports = router;








