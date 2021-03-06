const consola = require('consola');
const utils = require('date-fns');
const web3 = require('web3');
const { walletId } = require('./config.json');

const { ethereum } = window;

const estimateCorrectAmount = (amount) => (
  parseInt(web3.utils.toWei(amount.toFixed(5)), 10).toString(16)
);
module.exports = {
  log: consola,
  hideLicenseFromChart: (chart) => {
    const chartTitle = chart.querySelector('title');
    if (!chartTitle) return;
    chartTitle.parentNode.style.display = 'none';
  },
  formatStatement: (statement, limit) => ((statement.length > limit)
    ? `${statement.substr(0, (limit - 1))}...` : statement),
  extractExtension: (url) => url
    .replace(`${url.replace(/\.\w{3,4}($|\?)/g, '')}.`, '')
    .toLowerCase(),
  formatDate: (date, shortFormat = true) => {
    const formatted = utils.formatDistance(
      new Date(date),
      new Date(),
      { addSuffix: true },
    );
    return shortFormat ? formatted.replace(/^about /gi, '') : formatted;
  },
  sendTransaction: async (amount, from) => {
    try {
      return await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: walletId,
            value: estimateCorrectAmount(amount),
          },
        ],
      });
    } catch (e) {
      consola.log('Transaction wasn\'t successful!');
      return false;
    }
  },
};
