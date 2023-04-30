import * as builder from 'knex'

const knex = builder.default({
    client: 'sqlite',
    connection: {
        filename: './tmp/app.db'
    },
    useNullAsDefault: true,
})

export { knex }