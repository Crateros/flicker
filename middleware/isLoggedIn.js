//Halts user from accessing user content before login
module.exports = function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You must be logged in to access that page');
    res.redirect('/auth/login');
  } else {
    next();
  }
};
