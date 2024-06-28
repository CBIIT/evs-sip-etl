import fs from "fs";

const logDir = process.env.LOG_DIR;

/**
 * Logger class to handle logging messages to a file.
 *
 * This class provides methods to ensure a log file exists,
 * and to log messages with timestamps to the file.
 *
 * @example
 * // Create an instance of the Logger class
 * const logger = new Logger('log.txt');
 *
 * // Log messages to the file
 * logger.log('This is a log message');
 * logger.log('This is another log message', value);
 */
export default class Logger {
  constructor() {
    this.filename = `${new Date().toISOString()} - logout.txt`;
  }

  log(...messages) {
    // const logMessage = `${new Date().toISOString()} - ${message}\n`;
    const logMessage = `${new Date().toISOString()} - ${messages.join(' ')}\n`;

    fs.appendFile(`${logDir}/${this.filename}`, logMessage, (err) => {
      if (err) {
        console.error("Error writing to log file", err);
      }
    });
  }
}
