const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { smsService } = require('../services');

const sendSms = catchAsync(async (req, res) => {
  const sms = await smsService.sendSms(req.body);
  res.status(httpStatus.CREATED).send(sms);
});

const getSms = catchAsync(async (req, res) => {
  const sms = await smsService.getSmsById(req.params.transaction_id);
  if (!sms) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sms transaction id was not found');
  }
  res.send(sms);
});

module.exports = {
  sendSms,
  getSms,
};
