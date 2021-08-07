const moment = require('moment');
const { Sms } = require ('../models');

const deleteOldRecords = (_req, _res, next) => {
  let older_than = moment().subtract(1, 'hours').toDate();
  Sms.find({ createdAt: { $lte: older_than } })
    .deleteMany()
    .exec()
    .then((_RemoveStatus) => {
      console.log('Documents removed successfully');
    })
    .catch((err) => {
      console.error(err);
    });
  next();
}

module.exports = deleteOldRecords;
