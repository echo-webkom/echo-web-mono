/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import chalk from "chalk";

export type LogLevel = "log" | "error" | "info";

export class Logger {
  /**
   * Logs a message with the given name
   *
   * @param name name of the function or class
   * @param messages messages to log
   */
  static log(name: string, ...messages: Array<any>) {
    this.handleLog("log", name, ...messages);
  }

  /**
   * Logs an error message with the given name
   *
   * @param name name of the function or class
   * @param messages messages to log
   */
  static error(name: string, ...messages: Array<any>) {
    this.handleLog("error", name, ...messages);
  }

  /**
   * Logs an info message with the given name
   *
   * @param name name of the function or class
   * @param messages messages to log
   */
  static info(name: string, ...messages: Array<any>) {
    this.handleLog("info", name, ...messages);
  }

  private static handleLog(level: LogLevel, name: string, ...messages: Array<any>) {
    const coloredLevel = this.getColoredLevel(level);

    const logLevel = coloredLevel(`[${level.toLocaleUpperCase()}]`);
    const logName = chalk.green(`[${name}]`);

    console[level](`${logLevel} ${logName}`, ...messages);
  }

  private static getColoredLevel(level: LogLevel) {
    switch (level) {
      case "log":
        return chalk.bgGreen.black.bold;
      case "error":
        return chalk.bgRed.black.bold;
      case "info":
        return chalk.bgBlue.black.bold;
    }
  }
}
