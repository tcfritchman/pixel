var keystone = require('keystone');
var async = require('async');
var Behavior = keystone.list('Behavior');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Init locals
  locals.section = 'behaviors';
  //locals.filters
  locals.behaviors = [];

  // Load the behaviors
  view.on('init', function (next) {
    var q = Behavior.paginate({
      page: req.query.page || 1,
      perPage: 5,
      maxPages: 10,
    })
    .sort('-createdAt')
    .populate('author');

    q.exec(function (err, results) {
      locals.behaviors = results;
      next(err);
    });
  });

  // Render the view
  view.render('Behaviors');
};
