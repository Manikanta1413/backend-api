const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

// Define log directory and format
const logDirectory = path.join(__dirname, "..", "logs");

const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  }
);

// Define colors for console
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
});

const transportFile = new winston.transports.DailyRotateFile({
  filename: "application-%DATE%.log",
  dirname: logDirectory,
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "5m", // 5MB
  maxFiles: "14d", // Keep logs for 14 days
  level: "info",
});

const transportConsole = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [transportFile, transportConsole],
});

module.exports = logger;
