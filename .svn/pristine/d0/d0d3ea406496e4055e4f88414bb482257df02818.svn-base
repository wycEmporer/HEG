require('./content.less');
require('cp');
import * as formReg from 'formVerify';
import {cookieUtil, path} from 'utils';
import { getBannerInfo, REGISTRATIONREWARD } from 'pagesDir/_component/getBannerInfo/index';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
const jobId = window.location.search; 
var operatorId = 0; 
var departmentId = 0; 
var href=  window.location.href;

getBannerInfo(REGISTRATIONREWARD);