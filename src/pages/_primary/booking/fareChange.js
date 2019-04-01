function fare(result, postData){
  let roundArr = [
    {
      gst: result.msg.dtp,
      cbfp: result.msg.dbp,
      obfp: result.msg.dobfp
    }
    
  ];
  if(result.msg.rbp){
    roundArr.push({
      gst: result.msg.rtp,
      cbfp: result.msg.rbp,
      obfp: result.msg. robfp
    });
  }
  postData.feeArray = roundArr;
  
}