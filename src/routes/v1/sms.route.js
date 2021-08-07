const express = require('express');
const smsController = require('../../controllers/sms.controller');

const router = express.Router();

router.post('/sendSms', smsController.sendSms);
router.get('/getSms', smsController.getSms);

module.exports = router;
