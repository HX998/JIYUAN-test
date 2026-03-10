/*
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * */
export function numberFormat(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  let n = !isFinite(+number) ? 0 : +number;
  let prec = !isFinite(+decimals) ? 2 : Math.abs(decimals);
  let sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
  let dec = (typeof dec_point === 'undefined') ? '.' : dec_point;
  let s = '';
  let toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  let re = /(-?\d+)(\d{3})/;
  while(re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


/*
 * 参数说明：
 * dateStr：要格式化的日期
 * formateStr：需要格式的样式
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * */
export function dateFormat(dateStr, formateStr) {
  dateStr = dateStr+"";
  if(dateStr && dateStr.length==8 && formateStr){
        if(formateStr.indexOf("-")!=-1){
             return dateStr.substr(0,4) + "-" + dateStr.substr(4,2) + "-" + dateStr.substr(6,2);
        }else if(formateStr.indexOf("/")!=-1){
             return dateStr.substr(0,4) + "/" + dateStr.substr(5,2) + "/" + dateStr.substr(6,2);
        }
        return dateStr;
  }
  return dateStr;
}
