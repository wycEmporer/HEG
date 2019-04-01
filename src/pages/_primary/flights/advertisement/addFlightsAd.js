const utils = require('utils');
const paths = utils.path;
export class AddAd {
  constructor(list) {
    this.list = list;
  }
  static addFlightsAd() {
    return new Promise((resolve, reject) => {
      if(sessionStorage.getItem('FADS') && !!JSON.parse(sessionStorage.getItem('FADS'))){
        return resolve(JSON.parse(sessionStorage.getItem('FADS')));
      }
      $.ajax({
        url: paths.getPromotionInfo() + 'type=12&device=1',
        cache: true,
        dataType: 'json',
        type: 'GET',
      }).done(res => {
        if (res.success) {
          if (res.list.length == 0) {
            return reject();
          }
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i].isUse == 0) {
              res.list.splice(i--, 1);
              continue;
            }
          }
          sessionStorage.setItem('FADS', JSON.stringify(res));
          return resolve(res);
        } else {
          reject();
        }
      }).fail(res => {
        reject();
      });
    });

  }
  static addSideBanner() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: paths.getPromotionInfo() + 'type=11&device=1',
        cache: true,
        dataType: 'json',
        type: 'GET',
      }).done(res => {
        if (res.success && res.list.length != 0) {
          let list = _.sortBy(res.list, 'sort');
          for (let i = 0; i < list.length; i++) {
            if (list[i].isUse == 0) {
              list.splice(i--, 1);
              continue;
            }
          }
          if (list.length == 0) {
            reject();
          }
          resolve(new AddAd(list));
        } else {
          reject(res.msg);
        }
      }).fail(res => {
        reject();
      });
    });

  }

}