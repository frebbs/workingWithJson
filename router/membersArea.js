const express = require('express');
const router = express.Router();
const queryDB = require('../db/DBquries');



router.get('/', (req, res) => {
    res.render('members/home');
});

router.get('/profile/:id', async(req, res) => {

    await queryDB.json
        .getOneByID(req.params.id)
        .then(data => {
            if (data) {
                return res.render('members/profile.ejs', {
                    userProfile: data
                });

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

});

module.exports = router;








