/**
 * Logger for the frontend application
 * 
 */

// Dependencies
import winston from 'winston';
import fs      from 'fs';
import path    from 'path';

const logDir = path.resolve('./logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
 }

const now = new Date();

let options = {
  file: {
    level: 'info',
    name: 'log-file',
    filename: './logs/info-' + now + '.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
  }
};

let logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.prettyPrint()
  }))
}

export default logger;