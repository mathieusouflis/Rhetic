module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-here',
  jwt: {
    expiresIn: '30d',
  },
};