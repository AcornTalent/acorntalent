/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

/**
 * GET *
 * Error 404 page.
 */
exports.noPage = (req, res) => {
  res.render('404', {
    title: 'Page Not Found'
  });
};

/**
 * GET /callofdata
 * Get Call of Data page.
 */
exports.getCallOfDataPage = (req, res) => {
  res.render('callofdata', {
    title: 'Call of Data'
  });
};
