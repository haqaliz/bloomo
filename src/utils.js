const consola = require('consola');
const utils = require('date-fns');

module.exports = {
  log: consola,
  formatStatement: (statement, limit) => ((statement.length > limit)
    ? `${statement.substr(0, (limit - 1))}...` : statement),
  formatDate: (date, shortFormat = true) => {
    const formatted = utils.formatDistance(
      new Date(date),
      new Date(),
      { addSuffix: true },
    );
    return shortFormat ? formatted.replace(/^about /gi, '') : formatted;
  },
};
