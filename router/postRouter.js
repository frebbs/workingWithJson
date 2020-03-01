const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const queryDB = require('../db/DBquries');
const SALT = 10


// Signup POST route
// TODO compare passwords, rerender page if errors!
router.post('/createaccount', async(req, res) => {


    let errors = [];

    if (req.body.password1 !== req.body.password2) {
        errors.push({password: "Passwords didnt match, try again"})
        return res.render('signup', {
            errors,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        })
    };

    req.body.password1 = await bcrypt.hash(req.body.password1, SALT)

    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password1,
        email: req.body.email
    }
        await queryDB.json
        .create(newUser)
        .then( (data) => {
            return res.redirect('/login')
    })
        .catch(err => {
        res.json({
            status: '💔',
            message: 'Opps, bad data maybe? Check the below error',
            ERROR: err
        })
    })
});

// Login POST route
router.post('/login', async (req, res) => {
    let findUser = await queryDB.json
        .getOneByEmail(req.body.email)
        .then((data) => {
            return data
        })
        .catch(err => {
            return res.json({
                status: '💔',
                message: 'Opps, Found no users with that email address',
                ERROR: err
            })
        })

    if(findUser) {
        let matchedPassword = await bcrypt.compare(req.body.password, findUser.password)
        if(matchedPassword) {
            return res.redirect('/members')
        } else {
            return res.json({
                status: '💔',
                message: 'Passwords Didnt match',
            })
        }
    } else {
        return res.json({
            status: '💔',
            message: 'No user found',
        })
    }

})

// Using ID needs to be at the end of the routes otherwise other routes will not work
// The order matters here
router.post('/delete/:id', async(req, res) => {
    let userID = req.params.id

    await queryDB.json
    .delete(userID)
    .then( (data) => {
        if(data) {
            res.json({
                status: '🍻',
                message: 'User has been deleted',
                data: data
            })
        } else {
            res.json({
                status: '💔',
                message: "Opps, couldn't find that user!",
            })
        }
    })
    .catch(err => {
        res.json({
            status: '💔',
            message: 'Opps, bad data maybe? Check the below error',
            ERROR: err
        })
    })
})


router.put('/update/:id', async(req, res) => {

    if(req.body.access_level) {
        req.body.access_level = parseInt(req.body.access_level);
    }

    console.log(req.body)
    await queryDB.json
        .update(req.params.id, req.body)
        .then(data => {
            return res.redirect('/members')
        })
        .catch(err => {
        res.json({
            status: '💔',
            message: 'Opps, bad data maybe? Check the below error',
            ERROR: err
        })
    })
});

module.exports = router;