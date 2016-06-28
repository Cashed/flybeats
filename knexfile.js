module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/play'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}
