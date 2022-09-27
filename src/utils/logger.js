const winston = require('winston');

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
}

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `[${info.level}] ${info.message}`,
    ),
)

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
    }),
    // new winston.transports.File({ filename: 'logs/all.log' }),
]

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

module.exports = logger;