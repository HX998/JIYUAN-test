import MsgBox from "h_ui/dist/lib/MsgBox.js";
let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;

const msgBoxInstance = {
  info: function(options, props = {
    transfer: false, scrollable: true,
    targetNode: !!document.querySelector('#appMain').children[0] ? document.querySelector('#appMain').children[0] : null,
    className: isIE ? "h-msgbox-transfer-position" : ""
  }) {
    MsgBox.info(Object.assign(props, options));
  },
  success: function(options, props = {
    transfer: false, scrollable: true,
    targetNode: !!document.querySelector('#appMain').children[0] ? document.querySelector('#appMain').children[0] : null,
    className: isIE ? "h-msgbox-transfer-position" : ""
  }) {
    MsgBox.success(Object.assign(props, options));
  },
  warning: function(options, props = {
    transfer: false, scrollable: true,
    targetNode: !!document.querySelector('#appMain').children[0] ? document.querySelector('#appMain').children[0] : null,
    className: isIE ? "h-msgbox-transfer-position" : ""
  }) {
    MsgBox.warning(Object.assign(props, options));
  },
  error: function(options, props = {
    transfer: false, scrollable: true,
    targetNode: !!document.querySelector('#appMain').children[0] ? document.querySelector('#appMain').children[0] : null,
    className: isIE ? "h-msgbox-transfer-position" : ""
  }) {
    MsgBox.error(Object.assign(props, options));
  },
  confirm: function(options, props = {
    transfer: false, scrollable: true,
    targetNode: !!document.querySelector('#appMain').children[0] ? document.querySelector('#appMain').children[0] : null,
    className: isIE ? "h-msgbox-transfer-position" : ""
  }) {
    MsgBox.confirm(Object.assign(props, options));
  },
  remove: function() {
    MsgBox.remove();
  }
};

export default msgBoxInstance;
