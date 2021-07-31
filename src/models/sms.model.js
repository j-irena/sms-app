const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { smsResult } = require('../config/smsResult');

const SmsSchema = mongoose.Schema(
  {
    receipient: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
    },
    sendResult: {
      type: String,
      enum: [smsResult.FAILED, smsResult.ACCEPTED, smsResult.SENT],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
SmsSchema.plugin(toJSON);

const Sms = mongoose.model('Sms', SmsSchema);

module.exports = Sms;
