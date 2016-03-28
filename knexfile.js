module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/reads-app'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
