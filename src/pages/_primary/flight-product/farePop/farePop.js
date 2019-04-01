export function farePop(feeObj){
  let content = `
        <div style="width: 180px;">
          <ul>
          <li class="clearfix">
            <span class="pull-left">
              Base fare
            </span>
            <span class="pull-right textR fontB"> 
              <i class="fa fa-inr"></i>
              <span class="viewObfp">. . .</span>
            </span>
          </li>
          <li class="clearfix">
            <span class="pull-left">
              Taxes &amp; fees
            </span>
            <span class="pull-right textR fontB">
              <i class="fa fa-inr"></i>
              <span class="viewOgst">. . .</span>
            </span>
          </li>
          <!--  <li class="clearfix">
            <span class="pull-left">
              Customer Prom
            </span>
            <span class="pull-right textR fontB">
              <i class="fa fa-inr"></i>
              <span class="viewCash">. . .</span>
            </span> 
          </li> -->
        </ul>
      </div>
      `;
  $('#showFareDetail').popover({content});

  $(document).on('shown.bs.popover', '#showFareDetail', function(e){
    $('.popover .viewObfp').text(feeObj.fee.obfp.toThree());
    $('.popover .viewOgst').text(feeObj.fee.ogst.toThree());
  });
}