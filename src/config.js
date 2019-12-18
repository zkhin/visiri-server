module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://zayar@localhost/visiri',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://zayar@localhost/visiri-test',
  JWT_SECRET: process.env.JWT_SECRET || 'xjixx76871i2h3uix898u12312jhgjkx',
}
