export default function (postData){
  let content = `
    <div>
        Base fare : <span class="pull-right grayBase"><i class="rs">Rs.</i> ${postData.totalObfp.toThree()}</span>
      </div>
      <div>Taxes &amp; fees : <span class="pull-right grayBase"><i class="rs">Rs.</i> ${postData.fees.toThree()}</span>
      </div>
      <div>Discount : <span class="pull-right grayBase"><i class="rs">Rs.</i> <span">${(postData.totalPrice - postData.oopr).toThree()}</span></span>
      </div>
      <div>Convenience fee: <span class="pull-right grayBase"><i class="rs">Rs.</i> <span class="discount">${postData.cf.toThree()}</span></span>
      </div>
      <div>Total : <span class="pull-right grayBase"><i class="rs">Rs.</i> <span class="Dtotal">${(postData.total + postData.cf).toThree()}</span></span>
    </div>`;
  $('#PTDetail .fare-breakup').popover({content});
}