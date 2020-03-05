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

module.exports = router;