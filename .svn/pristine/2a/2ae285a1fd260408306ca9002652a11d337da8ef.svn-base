require('./content.less');
require('cp');

import {getBannerInfo, HOTELPREDIWALISALE} from 'pagesDir/_component/getBannerInfo/index';
import 'pagesDir/_component/hotelSearch/index';
getBannerInfo(HOTELPREDIWALISALE);

$(document).on('click', '#copyText', function() {
  var val = $(this)[0];
  window.getSelection().selectAllChildren(val);
  document.execCommand('Copy');
  const TipsMsg = $(this).parents('p').siblings('.TipsMsg')[0];
  $ (TipsMsg).fadeIn(500).delay(2000).fadeOut(1000);
});