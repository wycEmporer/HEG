export default function getPathParameter() {
  var regex = /flights\/([A-Z]{3})-([A-Z]{3})\/(20\d{2}-\d{2}-\d{2})(-(20\d{2}-\d{2}-\d{2}))?/gi;
  var results = regex.exec(location.href);
  if (results != null) {
    return {
      from: results[1],
      to: results[2],
      departDate: results[3],
      returnDate: results[5]
    };
  }
  return {};
}
