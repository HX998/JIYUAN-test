/**
 * 返回审批模块，打印审批详情中的审批list所需的css样式
 * @returns {string}
 */
function getPrintAuditOperListStyle() {
  let style='<style type="text/css">\n' +
    'body, h1, h2, h3, h4, h5, h6, hr, p, ul, ol, li, div, textarea, th, td { margin: 0; padding: 0;}\n' +
    'body {font-family: "Microsoft YaHei", "\\5FAE\\8F6F\\96C5\\9ED1", Arial, sans-serif, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\\8F6F\\96C5\\9ED1", Arial, sans-serif;font-size: 12px;color: #333333;line-height: 1.5;background-color: #fff;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}\n' +
    'html,body{height: 100%;}\n' +
    'h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {margin-bottom: 0.5rem;font-weight: 500;line-height: 1.1;color: inherit;}\n' +
    'i, em {font-style: normal;}\n' +
    'ul, ol {list-style: none;}\n' +
    ':focus {outline: 0;}\n' +
    '.clearfix {zoom:1; /* IE < 8 */}\n' +
    '.clearfix:before,.clearfix:after {content:""; display:table;}\n' +
    '.clearfix:after {clear:both;}\n' +
    '* {box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);}\n' +
    '.list-header{height: 40px;padding: 9px 16px;background: #0c67b0;line-height: 22px;font-size: 14px;color: #ffffff;}\n' +
    '.list-total-info{padding: 20px 10px;}\n' +
    '.list-total-info li{float: left;width: 33.33333%;}\n' +
    '.list-total-info li .label{float: left;width: 35%;padding-right: 10px;margin-bottom: 10px;font-size: 12px;color: #666;text-align: right;line-height: 20px;}\n' +
    '.list-total-info li .val{float: left;width: 65%;margin-bottom: 10px;font-size: 12px;color: #000000;line-height: 20px;word-break: break-all;}\n' +
    '.list-table-box{padding: 10px;}\n' +
    '.list-table{width: 100%;border-collapse: collapse;border-spacing: 0;border: 1px solid #dddddd;}\n' +
    '.list-table th,.list-table td{border: 1px solid #dddddd;font-size: 12px;padding: 5px;line-height: 20px;text-align: left;}\n' +
    '.list-table th{background: #eaedf1;}\n' +
    '.list-table td{ white-space: pre; }\n' +
    '.list-table .ta-c{text-align: center;}\n' +
    '.list-table .ta-r{text-align: right;}\n' +
    '.list-table .ta-c{text-align: center;}\n' +
    '.list-page{padding: 15px 0;text-align: center;}\n' +
    '.list-page span{padding: 0 10px;}\n' +
    '.h-ticket-title {font-size: 20px;font-weight: bold;text-align: center;padding: 20px 0 15px 0;}\n' +
    '.h-ticket-table {margin: 0 20px;border: 1px solid #666666;}\n' +
    '.h-ticket-table table {border-collapse: collapse;border-spacing: 0;width: 100%;}\n' +
    '.h-ticket td {border: 1px solid #666666;height: 40px;padding: 0 12px;color: #000000;}\n' +
    '.h-ticket .th {text-align: right;color: #333333;}\n' +
    '.h-t_blue .th {background: rgba(12, 103, 176, 0.10);}\n' +
    '.h-t_green .th {background: rgba(107, 175, 27, 0.10);}\n' +
    '.h-t_pink .th {background: rgba(179, 60, 90, 0.10);}\n' +
    '.h-t_orange .th {background: rgba(198, 127, 28, 0.10);}\n' +
    '.h-ticket .tac {text-align: center;}\n' +
    '.h-ticket .h-money-cell {height: 59px;padding: 0;}\n' +
    '.h-ticket .h-money-unit {height: 26px;border-bottom: 1px solid #666666;}\n' +
    '.h-money-unit em {width: 8.3%;height: 26px;text-align: center;line-height: 26px;border-right: 1px solid #666666;color: #666666;float: left;}\n' +
    '.h-money-unit .h-last {border-right: none;}\n' +
    '.h-money-num span {width: 8.3%;height: 33px;text-align: center;line-height: 33px;border-right: 1px solid #666666;float: left;font-size: 16px;}\n' +
    '.h-money-num .h-last {border-right: none;}\n' +
    '.h-fs14 {font-size: 14px;font-weight: bold;}\n' +
    '.h-btw2 {border-top: 2px solid #666666;}\n' +
    '.h-ticket-info {margin: -5px 20px 10px 20px;}\n' +
    '.h-ticket-info li {float: left;width: 33.33%;margin-bottom: 5px;}\n' +
    '.h-bz-l {float: left;width: 40%;}\n' +
    '.h-bz-c {float: left;width: 30%;}\n' +
    '.h-bz-r {float: right;width: 130px;}\n' +
    '.h-pj-l {float: left;width: 50%;}\n' +
    '.h-pj-c {float: left;width: 25%;}\n' +
    '.h-pj-r {float: right;width: 140px;}\n' +
    '.h-ticket-dq {color: #238fdc;border: 1px solid rgba(35, 143, 220, 0.60);border-radius: 2px;height: 18px;padding: 0 4px;float: right;line-height: 16px;cursor: default;}\n' +
    '.h-c6 {color: #666666;}\n' +
    '.h-t_white {background: #fff;background-image: none;}\n' +
    '.h-t_white .th {text-align: center;} .h-t_white td {height: auto;padding: 4px 12px;}\n' +
    '.h-idea-box{width: 100%;padding: 5px 0;}\n' +
    '.h-idea-box .idea{height: auto;min-height:20px;}\n' +
    '.h-idea-box .date{text-align: right;padding-right: 20px;}\n' +
    '.h-ticket label{margin-right: 25px;}\n' +
    '.h-ticket .check{vertical-align: bottom;margin: 0 0 2px 4px;}\n' +
    '.h-ticket .money{padding: 0 10px;border-bottom: 1px solid #333;}\n' +
    '.table-record{padding: 0 20px;}' +
    '.timeline-wrap { overflow: auto; border-right: 1px solid #eee; }' + //这里的长度不能给，否则打印不全
    '.timeline-wrap .h-timeline { padding: 0 20px 0 70px; }' +
    '.timeline-wrap .h-timeline-item { padding: 20px 0 0 0; }' +
    '.timeline-wrap .h-timeline-item-tail { border-left: 1px solid #eee; left: 3px; height: 111px; float: left; margin-top: -16px;}' +
    '.timeline-wrap .h-timeline-item-head { width: 7px; height: 7px; background: #999; margin-top: 6px; float: left; margin-left: -4px; border: 0; border-radius: 4px; }' +
    '.timeline-wrap .h-timeline-item-content { padding: 1px 1px 10px 18px; }' +
    '.timeline-wrap .time { width: 60px; text-align: right; line-height: 16px; float: left; margin-left: -90px;}' +
    '.timeline-wrap .time p { color: #333; font-size: 14px; }' +
    '.timeline-wrap .time span { color: #666; font-size: 12px; }' +
    '.timeline-wrap .content { color: #666; font-size: 12px; line-height: 20px; }' +
    '.timeline-wrap .user { color: #333; font-size: 14px; line-height: 20px; }' +
    '.timeline-wrap .user span { font-weight: 700; margin-right: 10px; }' +
    '.timeline-wrap .result { line-height:20px; }' +
    '.timeline-wrap .color-blue { color: #238fdc; }' +
    '.timeline-wrap .color-red { color: #ea3a3c; }' +
    '.timeline-wrap .color-orange { color: #f39800; }' +
    '</style>';
  return style;
}

export {getPrintAuditOperListStyle}
