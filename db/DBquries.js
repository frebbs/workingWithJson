const knex = require('./knex');


module.exports = {
    json: {
        getAll: function () { // Working now
            return knex('users_table')
                .orderBy('id', 'asc')
                .select();
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
        delete: (id) => {
            return knex('users_table')
                .where('id', id)
                .del();
        }
    },
    messages: {
        getAllByUserID: function (id) {
            return knex('users_table')
                .join('user_messages', 'users_table.id', 'user_messages.users_id')
                .where('users_table.id', id)
        }
    }
};