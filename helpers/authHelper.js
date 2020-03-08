const queryDB = require('../db/DBquries');

async function isAuth (session) {

    let foundUser = await queryDB.json
        .findBySessionID(session)
        .then((data) => {
            return data
        })
        .catch(err => {
            return console.log(err)
        });

    return !!foundUser;
}

async function authCheck (sessionID, session) {

    let foundUser = await queryDB.json
        .findByEmailForAuth(session.profile.email)
        .then(data => {
            return data})
        .catch(err => console.log(err));

    return foundUser.session_data === sessionID
        && foundUser.access_level === session.profile.access_level
        && foundUser.access_level !== null;
}

module.exports = {
    isAuth, authCheck
};