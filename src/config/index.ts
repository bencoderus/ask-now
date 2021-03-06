import dotenv from 'dotenv';

dotenv.config();

export default {
  // Application configurations.
  name: process.env.APP_NAME || 'Default',
  port: process.env.APP_PORT || '5000',
  environment: process.env.NODE_ENV || 'development',

  // JWT configurations.
  jwtSecret: process.env.JWT_SECRET || 'helloworld@123.~',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '3000h',

  // MongoDB configurations.
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:270177/ask-now',
  testMongoUri:
    process.env.MONGO_URI || 'mongodb://localhost:270177/ask-now-test',

  // Redis configurations.
  redis: {
    host: process.env.REDIS_HOST || 'redis://localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
  },
  redisUri: process.env.REDIS_URI || 'redis://localhost:6379',

  saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10)
};
