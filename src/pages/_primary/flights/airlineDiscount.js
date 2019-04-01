export function airlineDiscount(DFlight, RFlight, rtd){
  let dfd = 0, rfd = 0, ord = {};
  if(DFlight.al == RFlight.al){
    // return dfd,rfd discount , fn: fligth number
    DFlight.disFn = DFlight.fn.replace(/\//g, '');
    RFlight.disFn = RFlight.fn.replace(/\//g, '');
    if(rtd && rtd.or[DFlight.disFn + '/' + RFlight.disFn]){
      dfd =  Math.floor(rtd.or[DFlight.disFn + '/' + RFlight.disFn] / 2);
      rfd = rtd.or[DFlight.disFn + '/' + RFlight.disFn] - dfd;
      ord.or = {};
      ord.or[DFlight.disFn + '/' + RFlight.disFn] = rtd.or[DFlight.disFn + '/' + RFlight.disFn];
      
    }else if(rtd){
      if(rtd.o[DFlight.disFn]){
        dfd = rtd.o[DFlight.disFn];
        ord.o = {};
        ord.o[DFlight.disFn] = rtd.o[DFlight.disFn];
      }
      if(rtd.r[RFlight.disFn]){
        rfd = rtd.r[RFlight.disFn];
        ord.r = {};
        ord.r[RFlight.disFn] = rtd.r[RFlight.disFn];
      }
    } 
  }
  return {
dfd, rfd, ord
};
}