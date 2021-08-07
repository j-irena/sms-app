const rateLimit = require('axios-rate-limit');
const axios = require('axios');
const { Sms } = require('../models');
const config = require('../config/config');
const { smsResult } = require('../config/smsResult');
const moment = require('moment');

const saveSms = async (sms) => {
  return Sms.create(sms);
};

const getSmsById = async (id) => {
  return Sms.findById(id);
};

function deleteOldRecords(){
  let older_than = moment().subtract(1, 'hours').toDate();
  Sms.find({ createdAt: { $lte: older_than } }).deleteMany().exec().then((RemoveStatus) => {
      console.log("Documents Removed Successfully");
  }).catch((err) => {
      console.error('something error');
      console.error(err);
  })
}

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

const detectBadWords = async (smsBody) => {
  const badWordsArr = await getBadWords();
  const intersectionResult = smsBody.split(' ').filter((x) => badWordsArr.indexOf(x) !== -1);
  return intersectionResult;
};

const sendSms = async (sms) => {
  let smsRes = sms;
  smsRes.sendResult = smsResult.ACCEPTED;
  const http = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 10 });
  const areBadWordsDetected = await detectBadWords(sms.message);
  if (areBadWordsDetected && areBadWordsDetected?.length > 0) {
    console.log(`A bad word: ${areBadWordsDetected} was detected. Message would not be sent`);
    smsRes.sendResult = smsResult.FAILED;
  } else {
    http
      .post(`${config.smsService}/v1/sms/sendSms`, { sms })
      .then((res) => {
        smsRes = res.data;
        smsRes.sendResult = smsResult.SENT;
        console.log(`sendSms statusCode: ${res.status}`);
      })
      .catch((error) => {
        console.error(`sendSms:${error}`);
        smsRes.sendResult = smsResult.FAILED;
      });
  }
  saveSms(smsRes);
  deleteOldRecords();
  return smsRes;
};

module.exports = {
  saveSms,
  getSmsById,
  sendSms,
  getBadWords,
};
