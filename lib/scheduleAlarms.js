var CronJob = require('cron').CronJob;
var moment = require('moment');
var app = { timeZone: 'America/New_York' };

module.exports = function (docs) {
  // extract date information from docs
  var start, jobs = {};

  start = moment(docs.starts_at);
  duration = docs.duration || 7;

  function addJob(name, moment, callback) {
    jobs[name] = new CronJob(moment.toDate(), callback, null, true, app.timeZone);
  }

  console.log(start.subtract('weeks', 1));

  addJob('weekBefore', start.subtract('weeks', 1), function () {
    // Notify members that an event is comming up
  });
  addJob('dayBefore', start.subtract('days', 1), function () {
    // Notify members that an event is starting soon
  });
  addJob('afterEnd', start.add('hours', duration), function () {
    // Tell ChanServ to update the subject for the group's IRC
  });

  // Save jobs to the database?

};
