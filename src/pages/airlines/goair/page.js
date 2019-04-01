require('./content.less');
require('cp');
const handleForm = require('cityLayer').handleForm;
var utils = require('utils');
var paths = utils.path;
import {getBannerInfo} from '../_getAds/getBannerAds.js';
import {getAirDivisionInfo} from '../_getAds/getAirDivisionInfo.js';
$(() =>{
  getBannerInfo();
  getAirDivisionInfo(138, $('#goair'), $('#goairTpl'));
});
$('#search_flights').on('click', function(){
  handleForm(this);
});