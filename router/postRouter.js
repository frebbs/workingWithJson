const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const queryDB = require('../db/DBquries');
const formidable = require('formidable');

// Maybe remove this? Change to other authentication verify methods
const {isAuth} = require('../helpers/authHelper');

const SALT = 10;


router.post('/createaccount', async(req, res) => {

    let errors = [];

    if (req.body.password1 !== req.body.password2) {
        errors.push({text: "Passwords didnt match, try again"});
    }

    if(!req.body.first_name) {
        errors.push({text: "Please supply a First name to continue"});
    }

    if(!req.body.last_name) {
        errors.push({text: "Please supply a Last name to continue"});
    }

    if(!req.body.email) {
        errors.push({text: "You must supply a valid Email Address to create an account"});
    }

    if (errors.length > 0 ) {
        return res.render('signup', {
            errors,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        })
    } else {
        req.body.password1 = await bcrypt.hash(req.body.password1, SALT);

        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password1,
            email: req.body.email,
            access_level: 5
        };

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
    }
});

router.post('/createpost', async (req, res) => {
    // console.log(req.body);
    const userPost = {
        users_id: req.session.profile.id,
        message_title: req.body.message_title,
        message_content: req.body.message_content
    };
    await queryDB.messages
        .createMessage(userPost)
        .then(() => {
            res.redirect('/members')
        })
        .catch(err => console.log(err));
});

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
        });

    if(findUser) {
        let matchedPassword = await bcrypt.compare(req.body.password, findUser.password);
        if(matchedPassword) {
            await queryDB.json
                .addSession(findUser.id, req.sessionID)
                .then(() => {
                    const { first_name, last_name, id, email, access_level } = findUser;
                    req.session.login = true;
                    req.session.profile = {id, first_name, last_name, email, access_level };

                    return res.redirect('/members')
                })
                .catch(err => console.log(err))
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

});

router.put('/update/:id', async(req, res) => {

    if(await isAuth(req.sessionID)) {
        if(req.body.access_level) {
            req.body.access_level = parseInt(req.body.access_level);
        }

        await queryDB.json
            .update(req.params.id, req.body)
            .then(data => {
                const { first_name, last_name, id, email, access_level } = data[0]
                req.session.profile = {id, first_name, last_name, email, access_level }
                return res.redirect('/members')
            })
            .catch(err => {
                res.json({
                    status: '💔',
                    message: 'Opps, bad data maybe? Check the below error',
                    ERROR: err
                })
            })
    } else {
        res.redirect('/login')
    }
});

router.post('/uploadphoto', async(req, res, next) => {

    const form = formidable({multiple: false, uploadDir: process.env.PWD +  '/public/user_uploads', keepExtensions: true});
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
        }

        const userProfile = {
            users_id: req.session.profile.id,
            description: fields.description,
            img_name: files.file.name,
            img_type: files.file.type,
            img_path: files.file.path
        };

        await queryDB.profile
            .uploadPhoto(userProfile)
            .catch(err => console.log(err))
    });
    res.redirect('/members')
});

module.exports = router;