/* ga constant */
export  const Left_side = 'Left_side';
export  const Search_result1 = 'Search_result1';
export  const Search_result2 = 'Search_result2';
export  const Homepages = ['Homepage1', 'Homepage2', 'Homepage3', 'Homepage4', 'Homepage5', 'Homepage6'];
export  const Pop_in = 'Pop_in';
export const AnniBanner = 'AnniBanner';

$(document).on('click', '.GAAD', function(){
  let event = {
      'event': 'custom_event',
      'gtm.category': 'Banner_ADs',
      'gtm.label': $(this).attr('ga'),
  };
  window.dataLayer.push(event);
});

export function emitEvent (category, label, action, value){
  let event = {
      'event': 'custom_event',
      'gtm.category': category,
      'gtm.label': label,
      'gtm.action': action || '',
      'gtm.value': value || '',
  };
  window.dataLayer.push(event);
}