import winston from 'winston';

const logConfig = {
  transports: [
    new winston.transports.Console({
      level: 'warn'
    }),
    new winston.transports.Console({
      level: 'info'
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'logs/error.log'
    }),
    new winston.transports.File({
      level: 'debug',
      filename: 'logs/debug.log'
    })
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    winston.format.printf(
      (info) =>
        `${info.level.toUpperCase()}: ${[info.timestamp]}: ${info.message}`
    )
  )
};

const logger = winston.createLogger(logConfig);

export default logger;
