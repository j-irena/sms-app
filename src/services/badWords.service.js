const axios = require('axios');
const { resolveConfig } = require('prettier');
const config = require('../config/config');

/*
const getBadWords = async () => {
  return axios
    .get(config.badWordsUrl)
    .then((res) => {
      const badWordsArr = res.data.replace(/\r\n/g, '\n').split('\n');
      badWordsArr.shift();
      return badWordsArr;
    })
    .catch((error) => {
      console.error(`filterBadWords: ${error}`);
    });
};
*/

const badWordsArr = axios.get(config.badWordsUrl).then((res) => {
  const badWordsArr = res.data.replace(/\r\n/g, '\n').split('\n');
  badWordsArr.shift();
  return badWordsArr;
});

module.exports = {
  badWordsArr,
};
