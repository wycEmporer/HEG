const paths = require('utils').path;
export default function(data, sendData) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: paths.getRoundFlightInfo(),
      type: 'POST',
      dataType: 'JSON',
      data: JSON.stringify(sendData),
      headers: {
        'x-Device': 'PC',
        'Content-Type':'application/json'
      },
    }).then(res => {
      if(res.success){
        var dId = res.data.departFlight.fn;
        var rId = res.data.returnFlight.fn;
        for(var x in res.data.departFlight.fee){
          data[0][dId].fee[x] = res.data.departFlight.fee[x];
        }
        for(var x in res.data.returnFlight.fee){
          data[1][rId].fee[x] = res.data.returnFlight.fee[x];
        }
        Object.assign(data[0][dId], {feee: res.data.departFlight.feee});
        Object.assign(data[1][rId], {feee: res.data.returnFlight.feee});
        data[0][dId].isBookable = res.code;
        data[0][dId].unBookableMsg = res.message || '';
        resolve(data);
      }
    }).fail(err => {
      reject();
    });
  });
}