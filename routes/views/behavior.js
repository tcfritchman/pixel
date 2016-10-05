var keystone = require('keystone');
var Behavior = keystone.list('Behavior');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Init locals
  locals.section = 'behaviors';
  locals.filters = {
    behavior: req.params.behavior
  };

  // Load the current behavior
  view.on('init', function (next) {
    var q = Behavior.model.findOne({
      key: locals.filters.behavior
    }).populate('author');

    q.exec(function (err, result) {
      locals.behavior = result;
      next(err);
    });
  });

  // Render the view
  view.render('Behavior');
};
