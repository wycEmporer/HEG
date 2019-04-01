const config = require('configModule');
const content = require('./content.ejs'); 
const layout = require('layout');
const dirsConfig = config.DIRS;
let metaKeywords = ' domestic flight offers, Domestic flight Discount, Airline Discount and Offers, Domestic Flight offers 2017';
let metaDescription = 'Grab the best travel deals and offers, while airline booking from our travel agency. Visit happyeasygo.com and get exclusive offers.';

module.exports = layout.init({
  pageTitle: 'Get the Best Deals on Domestic Flight Booking',
  metaKeywords,
  metaDescription,
}).run(content(dirsConfig));
