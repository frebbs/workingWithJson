const express = require('express');
const router = express.Router();
const queryDB = require('../db/DBquries');


// GET Routes
router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/signup', (req, res) => {
    res.render('signup', {errors: []})
});

router.get('/login', (req, res) => {
    res.render('login')
});

// Not used outside of DEV env
router.get('/all', async (req, res) => {
    await queryDB.json
        .getAll()
        .then(data => {
            if(data) {
                return res.json({
                    status: '🍻',
                    data: data
                })
            }
        })
        .catch(err => {
            return res.json({
                status: '💔',
                message: "An error happened, best check below!",
                ERROR: err
            })
        });

});

router.get('/getAllMessagesByID/:id', async(req, res) => {
    await queryDB.messages
        .getAllByUserID(req.params.id)
        .then((data) => {
            if (data) {
                return res.json({
                    data
                })
            }
        })
        .catch(err => {
            return res.json({
                status: '💔',
                message: "Sorry, something went wrong, check the error below",
                ERROR: err
            })
        })
});

module.exports = router;