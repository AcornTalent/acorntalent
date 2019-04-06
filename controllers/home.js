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

/**
 * GET /about
 * About page.
 */
exports.getAboutPage = (req, res) => {
  res.render('about', {
    title: 'About Us'
  });
};

/**
 * GET /cppibxacorntalent
 * Night with CPPIB page.
 */
exports.getCPPIBPage = (req, res) => {
  res.render('cppib', {
    title: 'Night with CPPIB'
  });
};
