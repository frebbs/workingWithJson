const knex = require('./knex');


module.exports = {
    json: {
        getAllUsers: function() {
            return knex.select(['id','first_name', 'last_name', 'email', 'access_level'])
                .from('users_table')
                .orderBy('last_name');
        },
        getOneByEmail: function (email) {
            return knex('users_table')
                .where('email', email)
                .first();
        },
        getOneByID: function (id) {
            return knex('users_table')
                .where('id', id)
                .first();
        },
        create: function (user) {
            return knex('users_table').insert(user).returning('*');
        },
        update: (id, user) => {
            return knex('users_table')
                .where('id', id)
                .update(user, 'id')
                .returning('*');
        },
        findByEmailForAuth: (email) => {
            return knex.select(['email', 'session_data', 'access_level'])
                .from('users_table')
                .where('email', email)
                .first();
        },
        findBySessionID: (session) => {
            return knex('users_table')
                .where('session_data', session)
                .first();
        },
        addSession: (id, session) => {
            return knex('users_table')
                .where('id', id)
                .update('session_data', session)
        },
        delete: (id) => {
            return knex('users_table')
                .where('id', id)
                .del();
        }
    },
    messages: {
        getAllByUserID: function (id) {
            return knex.select(['users_table.email','user_messages.message_title', 'user_messages.message_content', 'user_messages.created_on'])
                .from('users_table')
                .join('user_messages', 'users_table.id', 'user_messages.users_id')
                .where('users_table.id', id)
        },
        createMessage: function (message) {
            return knex('user_messages')
                .insert(message)
        }
    },
    profile: {
        uploadPhoto: function (data) {
            return knex('profile')
                .insert(data)
        }
    }

};