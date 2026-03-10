import fetch from "../httpFetch.js";
import Vue from "vue";

export async function getSingleParamValuesByKeys(keys) {
  let dictMap = new Map();
  await fetch.get("/sm/auth/systemParameter/getParamValuesByKeys?paramKeys=" + keys).then(res => {
    if (res) {
      if (res.data.retCode === "000000") {
        dictMap = res.data.retData;
        return dictMap;
      } else {
        // 公共报错信息

      }
    } else {
      // 公共报错信息

    }
  });
  return dictMap;

}

export async function getMoreParamValuesByKeys(keys) {
  let dictMap = new Map();
  await fetch.get("/sm/auth/systemParameter/getMoreParamValuesByKeys?paramKeys=" + keys).then(res => {
    if (res) {
      if (res.data.retCode === "000000") {
        dictMap = res.data.retData;
        return dictMap;
      } else {
        // 公共报错信息

      }
    } else {
      // 公共报错信息

    }
  });
  return dictMap;

}

/**
 * 查询配置中心参数
 * @param keys  支持多个参数，使用","分隔
 * @returns Object对象，格式如下：{link_page_size: "10", keyup_pause_time: "1"}
 */
export async function getParamValuesByKeys(keys) {
  let dictMap = new Map();
  await fetch.get("/fw/controller/common/getParamValuesByKeys?paramKeys=" + keys).then(res => {
    if (res) {
      if (res.data.retCode === "000000") {
        dictMap = res.data.retData;
        return dictMap;
      } else {
        // 公共报错信息

      }
    } else {
      // 公共报错信息

    }
  });
  return dictMap;
}

/**
 * 获取数据字典
 * @param {组编号}  groupCodes（多个以英文逗号隔开）
 */

export let getDictListByGroups = async function getDictListByGroups(groupCodes) {
  let dictMap = new Map();
  let dictListArr = new Map();
  let codesArr = [];
  codesArr = groupCodes.split(",");
  await fetch.get("/sm/config/dictionary/getDictbyGroupCodes?code=" + groupCodes).then(res => {
    if (res) {
      if (res.data.retCode === "000000") {
        for (let i = 0; i < codesArr.length; i++) {
          dictListArr.set(codesArr[i], []);
          dictMap.set(codesArr[i], new Map());
        }
        let dictList = [];
        dictList = res.data.retData;
        for (let i = 0; i < dictList.length; i++) {
          dictListArr.get(dictList[i].dictGroupCode).push(dictList[i]);
          dictMap.get(dictList[i].dictGroupCode).set(dictList[i].key, dictList[i].value);
        }
      } else {
        // 公共报错信息

      }
    } else {
      // 公共报错信息

    }
  });
  dictListArr.set("map", dictMap);
  return dictListArr;
};

export let getUploadImgType = async function getUploadImgType(paramKey) {
  let obj = { value: "" };
  await fetch.get("/sm/auth/businessParamete/getBusinessParameter?paramKey=" + paramKey).then(res => {
    if (res) {
      if (res.data.retCode === "000000") {
        obj.value = res.data.retData;
      } else {
      }
    }
  });
  return obj;
};

/**
 * 根据业务參數pc.call_connect_mode获取连接模式
 * @returns 连接模式
 */
export let getConnectMode = async function getConnectMode() {
  let obj = {};
  await fetch.get("/sm/auth/systemParameter/func_getConnectMode").then(res => {
    if (res) {
      if (res.data.retCode === "000000") {
        obj = res.data.retData;
      } else {
      }
    }
  });
  return obj;
};


/**
 * 获取数据字典
 * @param {组编号} groupCode
 */

export async function getDictValueByKey(groupCode, key) {
  let value = "";
  await fetch.get("/sm/config/dictionary/queryDictionary?dictGroupCode=" + groupCode + "&key=" + key).then(res => {
    if (res) {
      if (res.data.retCode == "000000") {
        if (res.data.retData == null || res.data.retData.length <= 0) {
          return "";
        }
        value = res.data.retData[0].value;
      } else {
        // 公共报错信息

      }
    } else {
      // 公共报错信息

    }
  });
  return value;
}

/**
 * 查询指定业务参数，返回对应参数值，区分法人
 * @param params   格式如下：{paramKey:"pc.default_page_size"}
 * @param succCall   查询成功回调函数
 * @param failCall   查询失败回调函数
 */
export function getBusinessParameter(params, succCall, failCall) {
  post(params, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
    if (res) {
      if (res.data.retCode === "000000") {
        if (typeof succCall === "function") {
          succCall(res);
        }
      } else {
        if (typeof failCall === "function") {
          failCall(res);
        }
      }
    }
  });
}

/**
 * 从map中获取dict对象
 */
export function getDictValueFromMap(map, groupCode, key) {
  if (map == null || map.get(groupCode) == null) {
    return key;
  }
  if (key == null || key === "") {
    return key;
  }
  let dictKey = key.split(",");
  let dictValues = "";
  if (dictKey.length === 1) {
    let dictValue = map.get(groupCode).get(key);
    if (dictValue == null || dictValue == "") {
      dictValue = key;
    }
    return dictValue;
  } else {
    for (let i = 0; i < dictKey.length; i++) {
      let dictValue = map.get(groupCode).get(dictKey[i]);
      if (dictValue == null || dictValue == "") {
        dictValues = key;
      } else {
        if (i != dictKey.length - 1) {
          dictValues += dictValue + ", ";
        } else {
          dictValues += dictValue;
        }
      }
    }
    return dictValues;
  }
}

/**
 * post方式发送请求方法
 * @param {*参数} params
 * @param {*请求url} url
 */
export function post(params, url) {
  if (params.loading == null || params.loading == undefined) {
    params.loading = true;
  }
  return fetch.post(url, params);
}

/**
 * get方式发送请求方法
 * @param {*参数} params
 * @param {*请求url} url
 */
export function get(params, url) {
  return fetch.get(url, { params });
}

/**
 * 表格上移
 */
export function rowMoveUp(currentSelectList, currentSelectRowInx, tempInx, refs, moveUpDisabled, moveDownDisabled, _this) {
  if (currentSelectList && currentSelectList.length == 1) {
    // var that = _this
    _this.tempInx = currentSelectRowInx[0];
    for (let i = 0; i < refs.tData.length; i++) {
      refs.tData[i]._checked = false;
    }
    _this.currentSelectList = [];
    _this.currentSelectRowInx = [];
    if (_this.tempInx > 0) {
      let upDate = refs.tData[_this.tempInx - 1];
      refs.tData.splice(_this.tempInx - 1, 1);
      refs.tData.splice(_this.tempInx, 0, upDate);

      refs.tData[_this.tempInx - 1]._checked = true;
      _this.currentSelectList.push(refs.tData[_this.tempInx - 1]);
      _this.currentSelectRowInx.push(_this.tempInx - 1);
      _this.moveDownDisabled = false;
      if (_this.tempInx == 1) {
        _this.moveUpDisabled = true;
      }

    } else {
      refs.tData[_this.tempInx]._checked = true;
      _this.currentSelectList.push(refs.tData[_this.tempInx]);
      _this.currentSelectRowInx.push(_this.tempInx);
      _this.$msgTip.error(_this, { info: _this.$t("m.i.common.moveMsg_1") });
    }
  } else {
    _this.$msgTip.error(_this, { info: _this.$t("m.i.common.chooseOneData") });
    return;
  }
}

/**
 * 表格下移
 */
export function rowMoveDown(currentSelectList, currentSelectRowInx, tempInx, refs, moveUpDisabled, moveDownDisabled, _this) {
  if (currentSelectList && currentSelectList.length == 1) {
    //   var that = _this;
    _this.tempInx = _this.currentSelectRowInx[0];
    if ((_this.tempInx + 1) === refs.tData.length) {
      _this.$msgTip.error(_this, { info: _this.$t("m.i.common.moveMsg_2") });
    } else {
      for (let i = 0; i < refs.tData.length; i++) {
        refs.tData[i]._checked = false;
      }
      _this.moveUpDisabled = false;
      let downDate = refs.tData[_this.tempInx + 1];
      refs.tData.splice(_this.tempInx + 1, 1);
      refs.tData.splice(_this.tempInx, 0, downDate);

      refs.tData[_this.tempInx + 1]._checked = true;
      _this.currentSelectRowInx = [];
      _this.currentSelectRowInx.push(_this.tempInx + 1);
      if ((_this.tempInx + 1) === refs.tData.length - 1) {
        _this.moveDownDisabled = true;
      }
    }
  } else {
    _this.$msgTip.error(_this, { info: _this.$t("m.i.common.chooseOneData") });
    return;
  }
}

/**
 * 数据库类型对象转驼峰型对象
 * @param obj 数据库类型对象
 * @param item 驼峰类型对象
 * @param type 转换类型（参数存在代表驼峰转成字段）
 * @return
 */
export function covertObj(obj, item, type) {
  let newObj = {};
  for (var key in obj) {
    let fieldName = columnName2FieldName(key);
    if (type) {
      fieldName = fieldName2ColumnName(key);
    }
    let val = "";
    if (obj[key] === 0 || obj[key] === false) {
      val = obj[key];
    } else {
      val = obj[key] ? obj[key] : "";
    }

    if (Array.isArray(val) && val[0] instanceof Object) {
      serialize(key, val, item);
    } else if (val.constructor === Object) {
      serialize(key, val, item);
    } else if (Array.isArray(val) && val.length === 0) {
      item[key] = [];
    } else {
      var turnCharR = false;
      var turnChar = false;
      let isTurn = false
      let isSingleQuotTurn = false
      if (typeof (val) === "string") {
        val = val.trim();
        if (/'/.test(val)) {
          // val = val.replace(/'/g, "\\'");
          val = val.replace(/'/g, "%27");
          isSingleQuotTurn = true
        }
        if (/\n/.test(val)) {
          val = val.replace(/\n/g, "%0A");
          turnChar = true;
        }
        if (/\r/.test(val)) {
          val = val.replace(/\r/g, "%0D");
          turnCharR = true;
        }
        if (/\\/.test(val)) {
          val = val.replace(/\\/g, "%5C");
          isTurn = true
        }
      }
      if (typeof (val) === "string" && val.indexOf("LODOP") > -1) {
        newObj[fieldName] = val;
      } else {
        eval("newObj." + fieldName + "='" + val + "'");
        // if (Array.isArray(val)) {
        //   newObj[fieldName] = val + '';
        // } else {
        //   newObj[fieldName] = val;
        // }
      }
      if (typeof newObj[fieldName] == "string" && isSingleQuotTurn) {
        // newObj[fieldName] = decodeURIComponent(newObj[fieldName]);
        newObj[fieldName] = newObj[fieldName].replace(/%27/g, "'");
      }
      if (typeof newObj[fieldName] == "string" && turnChar) {
        // newObj[fieldName] = decodeURIComponent(newObj[fieldName]);
        newObj[fieldName] = newObj[fieldName].replace(/%0A/g, "\n");
      }
      if (typeof newObj[fieldName] == "string" && turnCharR) {
        // newObj[fieldName] = decodeURIComponent(newObj[fieldName]);
        newObj[fieldName] = newObj[fieldName].replace(/%0D/g, "\r");
      }
      if (typeof newObj[fieldName] == "string" && isTurn) {
        newObj[fieldName] = newObj[fieldName].replace(/%5C/g, "\\");
      }
      Object.assign(item, newObj);
    }
  }
}

function serialize(key, value, param) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      serialize(key + "[" + i + "]", value[i], param);
    }
  } else if (value != undefined && value.constructor === Object) {
    for (let k in value) {
      serialize(key + "." + k, value[k], param);
    }
  } else {
    param[key] = value;
  }
}

/**
 * 把参数里的内容转义成html语言
 * @param obj 数据库类型对象
 * @return
 */
export function transferenceParam(obj, item) {
  let newObj = {};
  for (var key in obj) {

    let val = obj[key] ? obj[key] : "";
    if (val != "") {
      val = covertHtml(val);
    }
    eval("newObj." + key + "='" + val + "'");
  }
  Object.assign(item, newObj);
}

/**
 * 跨站脚本攻击，字符转义
 */
export function covertHtml(value) {
  if (!value) return "";
  let val = value + "";
  val = val.toLowerCase();//转换成小写
  if (val == "" || val == "undefined" || val == "null") return "";
  var arrEntities = { "<": "&lt;", ">": "&gt;" };
  var rs = val.replace(/(<|>)/ig, function(all, t) {
    return arrEntities[t];
  });
  return rs;
}

/**
 * 数据库列名转属性(下划线转驼峰)
 * @param columnName 数据库列名
 * @return
 */
function columnName2FieldName(columnName) {
  var result = "";
  var upcaseFlag = false;
  if (!columnName || columnName == "") return columnName;
  for (var i = 0; i < columnName.length; i++) {
    var ch = columnName[i];
    if (ch == "_") {
      upcaseFlag = true;
      continue;
    } else if (upcaseFlag) {
      result += ("" + ch).toUpperCase();
      upcaseFlag = false;
    } else {
      result += ch;
      upcaseFlag = false;
    }
  }
  return result;
}

/**
 * 属性转数据库列名(驼峰传下划线)
 * @param str 属性名
 * @return
 */
function fieldName2ColumnName(columnName) {
  var result = "";
  var upcaseFlag = false;
  if (!columnName || columnName == "") return columnName;
  for (var i = 0; i < columnName.length; i++) {
    var ch = columnName[i];
    if (allCaps(ch)) {
      result += ("_" + ch).toLowerCase();
    } else {
      result += ch;
    }
  }
  return result;
}

function allCaps(text) {
  if (text < "A" || text > "Z") {
    return false;
  }
  return true;
}

const isServer = Vue.prototype.$isServer;

/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * 对话框
 * @param _this 当前页面实例
 * @param url  点击确定后发送的请求url
 * @param param  请求参数
 * @param options  对话框属性
 * @param list  选中的列表要操作的数据
 */
export function bempConfirm(_this, url, param, options, list, successCallback) {
  if (list.length > 0) {
    _this.$hMsgBox.confirm({
      title: options.title,
      content: options.content,
      onOk: () => {
        post(param, url).then(res => {
          if (res) {
            let return_code = res.data.retCode;
            if (return_code === "000000") {
              _this.$msgTip.success(_this);
              _this.$refs.datagrid.dataChange(1);
              _this.currentSelectRow = [];
              _this.currentSelectList = [];
              _this.$refs.datagrid.selects = [];
              _this.$refs.datagrid.selectIds = [];
              successCallback(_this);
            } else {
              _this.$msgTip.error(_this, { info: "操作失败:" + res.data.retMsg });
              _this.$refs.datagrid.dataChange(1);
            }
          } else {
            _this.$msgTip.error(_this, { info: _this.$t("m.i.common.netError") });
          }
        });
      }
    });
  } else {
    _this.$msgTip.info(_this, { info: _this.$t("m.i.common.chooseOneData") });
  }
}

/**
 * 将数值格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @param precision 精度，默认不变
 * @param separator 分隔符，默认为逗号
 * @return 金额格式的字符串,如'1,234,567'，默认返回NaN
 * @type String
 */
export function formatNumber(num, precision, separator) {
  var parts;
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    let wholeNumber = num.toString().split(".");
    let decimal;
    // 判断是否带小数
    if (wholeNumber.length === 1) {
      decimal = 0;
    } else {
      decimal = "0." + wholeNumber[1];
    }
    // 处理小数部分
    decimal = Number(decimal);
    // 处理小数点位数
    decimal = (typeof precision !== "undefined" ? (Math.round(decimal * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision) : decimal).toString();
    // 分离数字的小数部分和整数部分
    parts = decimal.split(".");
    // 处理整数部分
    // 整数部分加[separator]分隔, 借用一个著名的正则表达式
    parts[0] = wholeNumber[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + (separator || ","));
    return parts.join(".");
  }
  return !!num ? num : "-";
}

/**
 *
 * 金额小写转大写
 *
 * @param num  数字金额
 * @returns {String}  大写金额
 */
export function cmycurd(num) {  //转成人民币大写金额形式
  let numberValue = String(Math.round(num * 100)); // 数字金额
  let chineseValue = ""; // 转换后的汉字金额
  let String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
  let String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
  let len = numberValue.length; // numberValue 的字符串长度
  let Ch1; // 数字的汉语读法
  let Ch2; // 数字位的汉字读法
  let nZero = 0; // 用来计算连续的零值的个数
  let String3; // 指定位置的数值
  if (len > 15) {
    alert("超出计算范围");
    return "";
  }

  if (numberValue == 0) {
    chineseValue = "零元整";
    return chineseValue;
  }
  String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
  for (let i = 0; i < len; i++) {
    String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值
    if (i !== (len - 3) && i !== (len - 7) && i !== (len - 11) && i !== (len - 15)) {
      if (String3 === 0) {
        Ch1 = "";
        Ch2 = "";
        nZero = nZero + 1;
      } else if (String3 !== 0 && nZero !== 0) {
        Ch1 = "零" + String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else {
        Ch1 = String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      }
    } else { // 该位是万亿，亿，万，元位等关键位
      if (String3 !== 0 && nZero !== 0) {
        Ch1 = "零" + String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else if (String3 !== 0 && nZero === 0) {
        Ch1 = String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else if (String3 === 0 && nZero >= 3) {
        Ch1 = "";
        Ch2 = "";
        nZero = nZero + 1;
      } else {
        Ch1 = "";
        Ch2 = String2.substr(i, 1);
        nZero = nZero + 1;
      }
      if (i === (len - 11) || i === (len - 3)) { // 如果该位是亿位或元位，则必须写上
        Ch2 = String2.substr(i, 1);
      }
    }
    chineseValue = chineseValue + Ch1 + Ch2;
  }
  if (String3 === 0) { // 最后一位（分）为0时，加上“整”
    chineseValue = chineseValue + "整";
  }
  return chineseValue;
}

/**
 * javascript的加法结果会有误差，在两浮点数相加的时候偶然会出现。这个函数返回较为精确的加法结果。
 *
 * @param arg1
 * @param arg2
 * @returns arg1加arg2的精确结果
 */
export const accAdd = (arg1, arg2) => {
  let r1, r2;
  let m = 0;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
};

/**
 * javascript的减法结果会有误差，在两浮点数相减的时候偶然会出现。这个函数返回较为精确的减法结果。
 *
 * @param arg1
 * @param arg2
 * @returns arg1减arg2的精确结果
 */
export function accSub(arg1, arg2) {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 * javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 *
 * @param arg1
 * @param arg2
 * @returns arg1乘以arg2的精确结果
 */
export function accMul(arg1, arg2) {
  if (arg1 == null) {
    return arg1;
  }
  let m = 0;
  let s1 = arg1.toString();
  let s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 *
 * @param arg1
 * @param arg2
 * @returns arg1除以arg2的精确结果
 */
export function accDiv(arg1, arg2) {
  let t1 = 0, t2 = 0;
  let r1, r2, r3, r4;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {
  }
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {
  }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  r3 = Math.pow(10, t2 - t1);
  r4 = r1 / r2;
  let m = 0;
  let s1 = r3.toString();
  let s2 = r4.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 打印时对金额进行分格显示
 * @param billMoney       初始数据
 * @param data      打印时反显数据
 * @param titleKey       开头字母，默认为a
 */
export function billMoneyDisplay(billMoney, data, titleKey = "a") {
  let subMoney = billMoney.split(".");
  if (1 === subMoney.length) {
    data[titleKey + "10"] = "0";
    data[titleKey + "11"] = "0";
  } else {
    data[titleKey + "10"] = subMoney[1].substring(0, 1);
    data[titleKey + "11"] = subMoney[1].length === 1 ? "0" : subMoney[1].substring(1, 2);
  }
  let money = subMoney[0].split("");
  for (let j = 0; j < money.length; j++) {
    let k = 9 - j;
    let flag = 9 - money.length;
    let moneyLength = money.length - j - 1;
    if (flag === (k - 1)) {
      let key = titleKey + k;
      data[key] = money[moneyLength];
      for (let l = -1; l <= flag; l++) {
        let key = titleKey + l;
        data[key] = " ";
      }
    } else {
      let key = titleKey + k;
      data[key] = money[moneyLength];
    }
  }
}

/**
 * 将数字转换成大写
 * @param value       待转换值
 * @param isNeedUnit  是否添加单位，如：数字123 转换成 壹佰贰拾叁
 * @returns {string}  大写数字
 */
export function numToUpper(value, isNeedUnit = false) {
  let length = value.length;
  let String1 = "零壹贰叁肆伍陆柒捌玖拾";
  let String2 = "拾佰仟万"; // 对应单位
  let num = "";
  if (isNeedUnit) {
    for (let i = 0; i < length; i++) {
      let numStr = value.substring(value.length - i - 1, value.length - i);
      if (numStr === "0") {
        if (i > 0) {
          num = String1.substring(numStr, 1 + parseInt(numStr)) + num;
        }
      } else {
        num = String1.substring(numStr, 1 + parseInt(numStr)) + String2.substring(i - 1, i) + num;
      }
    }
    return num;
  }
  if (length === 4) {
    for (let i = 0; i < 4; i++) {
      num = num + String1.substring(value.substring(i, i + 1), parseInt(value.substring(i, i + 1)) + 1);
    }
  } else if (length === 2) {
    if (value === "10") {
      num = "壹拾";
    } else if (value === "20") {
      num = "贰拾";
    } else if (value === "30") {
      num = "叁拾";
    } else if (value < 10) {
      num = String1.substring(value.substring(0, 1), parseInt(value.substring(0, 1)) + 1) + String1.substring(value.substring(1, 2), parseInt(value.substring(1, 2)) + 1);
    } else {
      num = String1.substring(value.substring(0, 1), parseInt(value.substring(0, 1)) + 1) + "拾" + String1.substring(value.substring(1, 2), parseInt(value.substring(1, 2)) + 1);
    }
  } else if (length === 1) {
    num = num + String1.substring(value.substring(0, 1), parseInt(value.substring(0, 1)) + 1);
  }
  return num;
}

/**
 * 将月份转换成大写
 * @param value
 * @returns {String}
 */
export function monthToUpper(value) {
  let month = "";
  //为防止变造票据的出票日期，在填写月、日时，月为壹、贰和壹拾的，日为壹至玖和壹拾、贰拾和叁抬的，应在其前加零
  if (value === "01") {
    month = "零壹";
  } else if (value === "02") {
    month = "零贰";
  } else if (value === "10") {
    month = "零壹拾";
  } else {
    if (value.substr(0, 1) === "0") {
      value = value.substring(1);
    }
    month = numToUpper(value);
  }
  return month;
}

/**
 * 将日期转换成大写
 * @param value
 * @returns {String}
 */
export function dateToUpper(value) {
  let date = "";
  //为防止变造票据的出票日期，在填写月、日时，月为壹、贰和壹拾的，日为壹至玖和壹拾、贰拾和叁抬的，应在其前加零
  if (value === "10" || value === "20" || value === "30") {
    date = "零" + numToUpper(value);
  } else {
    date = numToUpper(value);
  }
  return date;
}

/**
 * 动态注册路由，进行菜单跳转
 * gotoPageType 跳转类型，sidebar-左侧菜单栏跳转，mainIndex-首页跳转
 * item   跳转菜单内容
 * turnType   首页切换类型
 */
export function handleGotoPage(_this, gotoPageType, item, turnType) {
  if (gotoPageType === "sidebar") {
    window.sessionStorage.setItem("curMenu", JSON.stringify(item));
  } else {
    let curMenu = {
      title: typeof (item.menuName) == "string" ? item.menuName : item.pendRemark,
      id: item.menuId.toString(),
      path: item.menuUrl.indexOf("?") != -1 ? item.menuUrl.substring(0, item.menuUrl.lastIndexOf("?")) : item.menuUrl,
    };
    window.sessionStorage.setItem("curMenu", JSON.stringify(curMenu));
  }
  let isOpened = _this.$store.getters.openedRouterList.some(child => {
    let flag = gotoPageType === "sidebar" ? (item.path === child.path) : (item.menuUrl === child.path && turnType !== "unApprove");
    return flag;
  });
  if (window.isIE) {
    // 打开新的iframe页面
    _this.$store.dispatch("setCurOpenTag", item);
    _this.$store.dispatch("addFrame", item);
  } else {
    if (isOpened) {
      _this.$router.push({
        path: gotoPageType === "sidebar" ? item.path : item.menuUrl,
        query: item.connectMode === "embed" ? { embedPath: item.embedPath.substring(item.embedPath.indexOf("url")).split("=")[1] } : {}
      });
    } else {
      let meunData = {};
      if (gotoPageType === "mainIndex") {
        let menuId = item.menuUrl.substring(item.menuUrl.lastIndexOf("\/") + 1, item.menuUrl.length);
        let prodNo, prodName;
        if (menuId.indexOf("?") != -1) {
          prodNo = getQueryString(item.menuUrl, "prodNo");
          prodName = getQueryString(item.menuUrl, "prodName");
          // item.menuUrl = item.menuUrl.substring(0,item.menuUrl.lastIndexOf('?'))
          menuId = menuId.substring(0, menuId.lastIndexOf("?"));
        }

        meunData = {
          title: typeof (item.menuName) == "string" ? item.menuName : item.pendRemark,
          path: item.menuUrl.indexOf("?") != -1 ? item.menuUrl.substring(0, item.menuUrl.lastIndexOf("?")) : item.menuUrl,
          isKeepAlive: true,
          id: item.menuId + ""
        };
      }

      _this.$store.dispatch("GenerateRoutesByMenus", [gotoPageType === "sidebar" ? item : meunData]).then((res) => {
        _this.$router.addRoutes(_this.$store.getters.addRouters);
        // 路由未定义
        // _this.$router.push(gotoPageType === "sidebar" ? item.path : item.menuUrl);
        _this.$router.push({
          path: gotoPageType === "sidebar" ? item.path : item.menuUrl,
          query: item.connectMode === "embed" ? { embedPath: item.embedPath.substring(item.embedPath.indexOf("url")).split("=")[1] } : {}
        });
      });
    }
  }
}

function getQueryString(url, name) {
  var reg = new RegExp("(^|&?)" + name + "=([^&]*)(&|$)");
  var r = url.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}

/**
 * 根据配置参数，控制界面按钮的显隐
 * @param btnAuth     当前菜单对应按钮权限
 * @param optType     操作类型，非必填，如新增、修改共用同一组件时，需传入此参数
 *
 * btnAuth对象参数如下：
 * authId：菜单ID、子页面对应父级页面ID（可通过按钮命名）
 * isBtnShow：按钮是否显示，以按钮名称作为key
 * children： 子页面，格式如上，可多层嵌套
 * @returns {string}
 */
export function getBtnAuth(btnAuth, optType="") {
  let childrenBtnAuth = {};
  for (let children of btnAuth) {
    let authIdArr = children.authId.split(",");
    for (let i = 0; i < authIdArr.length; i++) {
      if (childrenBtnAuth.authId === undefined || childrenBtnAuth.authId === "") {
        childrenBtnAuth.authId = optType === "" ? children.authId : authIdArr[i] === optType ? authIdArr[i] : "";
      }
      if (optType === "" || authIdArr[i] === optType) {
        for (let item of Object.keys(children).filter(obj => obj !== "authId")) {
          childrenBtnAuth[item] = children[item];
        }
        break;
      }
    }
  }
  return childrenBtnAuth;
}


/**
 * 将时间补全至6位
 * @param _this
 * @param param     时间，如101212
 * @returns {string}
 */
export function formatTime(_this, param) {
  if (param == null || param === "") {
    return "";
  }
  let paramStr = param.toString();
  if (param.toString().length < 6) {
    for (let i = 0; i < (6 - param.toString().length); i++) {
      paramStr = "0" + paramStr;
    }
  }
  paramStr = _this.$moment(paramStr, "HH:mm:ss").format("HH:mm:ss");
  return paramStr;
}

/**
 * 清单导出
 * @param _this
 * @param excelName     导出模板名称
 * @param field         待导出字段
 * @param exportType    导出类型，0-同步，1-异步
 * @param exportUrl     导出url
 * @param options       导出时所需条件,包含以下属性
 *         params：{}    导出时所传参数
 *         pageSize: 0   查询数据条数
 *         downloadByHttpReq    不传默认使用form提交，用于同步导出，传入此参数表示调用fileDownload方法进行下载，支持异常时弹窗提示
 */
export function exportList(_this, excelName, field, exportType, exportUrl, options = {}) {
  if (exportType === "1") {
    let params = {
      excelName: excelName,
      field: field,
      exportType: exportType,
      pageSize: options.pageSize || 0
    };
    for (let obj in options.params) {
      if (options.params.hasOwnProperty(obj)) {
        let val = !!options.params[obj] ? options.params[obj] : "";
        if (typeof (val) === "string") {
          options.params[obj] = val.trim();
        }
      }
    }
    params = Object.assign(params, options.params || {});
    post(params, exportUrl).then(res => {
      if(res.status === 200 && (res.data === null || res.data === "")){
        _this.$msgTip.info(_this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
      } else{
        _this.$msgTip.error(_this, { info: res.data.retMsg });
      }
    });
  } else {
    if (options.downloadByHttpReq) {
      let params = {
        excelName: excelName,
        field: field,
        exportType: exportType,
        pageSize: options.pageSize || 0
      };
      fileDownload(_this, exportUrl, {
        downloadMethod: 'post',
        paramsByPost: Object.assign(params, options.params || {}),
        downloadFilename: options.downloadFilename
      });
      return
    }

    let form = document.createElement("form");
    form.setAttribute("id", "formId");
    form.setAttribute("action", exportUrl);
    form.setAttribute("method", "post");

    let input1 = document.createElement("input");
    input1.type = "text";
    input1.name = "excelName";
    input1.value = excelName;
    form.appendChild(input1);
    let input2 = document.createElement("input");
    input2.type = "text";
    input2.name = "field";
    input2.value = field;
    form.appendChild(input2);
    let input3 = document.createElement("input");
    input3.type = "text";
    input3.name = "exportType";
    input3.value = exportType;
    form.appendChild(input3);
    let input4 = document.createElement("input");
    input4.type = "text";
    input4.name = "pageSize";
    input4.value = options.pageSize || 0;
    form.appendChild(input4);

    for (let obj in options.params) {
      if (options.params.hasOwnProperty(obj)) {
        let input = document.createElement("input");
        input.type = "text";
        input.name = obj;
        let val = !!options.params[obj] ? options.params[obj] : "";
        if (typeof (val) === "string") {
          options.params[obj] = val.trim();
        }
        input.value = !!options.params[obj] ? options.params[obj] : "";
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}

/**
 * 模板下载
 * @param downloadUrl    模板下载url
 * @param extraParams   模板下载时所传参数
 */
export function templateDownload(downloadUrl, extraParams) {
  let form = document.createElement("form");
  form.setAttribute("id", "formId");
  form.setAttribute("action", downloadUrl);
  form.setAttribute("method", "post");
  createInputElement(form, extraParams);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

/**
 * 动态构造form表单所需条件
 * @param form
 * @param params
 */
function createInputElement(form, params) {
  for (let obj in params) {
    if (params.hasOwnProperty(obj)) {
      let input = document.createElement("input");
      input.type = "text";
      input.name = obj;
      let val = !!params[obj] ? params[obj] : "";
      if (typeof (val) === "string") {
        params[obj] = val.trim();
      }
      input.value = !!params[obj] ? params[obj] : "";
      form.appendChild(input);
    }
  }
}

/**
 * 报表通用方法
 */
export const reportFunc = {
  /**
   * 报表查询
   * @param _this
   * @param reportUrl   报表查询url
   * @param params      查询所需参数
   */
  createReport(_this, reportUrl, params) {
    if(reportUrl && params) {
      post(params, reportUrl).then(res => {
        if (res) {
          if (res.data.retCode === "000000") {
            _this.$msgTip.success(_this, { info: res.data.retMsg ? res.data.retMsg : _this.$t("m.i.common.actionSuccess") });
            _this.$refs.datagrid.dataChange(1);
          } else {
            _this.$msgTip.error(_this, { info: res.data.retMsg });
          }
        } else {
          _this.$msgTip.error(_this, { info: _this.$t("m.i.common.netError") });
        }
      });
    } else {
      _this.$msgTip.error(_this, { info: "方法调用缺少入参，请检查" });
    }
  },
  /**
   * 报表下载
   * @param _this
   * @param params    当前方法所需参数，包括以下几个字段
   *          status            报表状态
   *          downReportUrl     下载报表url
   *          urlSuffix         下载报表所需参数
   *          downReportTitle   下载报表标题
   */
  async downReport(_this, params) {
    if(params) {
      if(params.status != 2){
        _this.$msgTip.error(_this, { info: "报表未生成完，稍后请重试" });
        return;
      }
      const res = await this.getFunc(_this, window.LOCAL_CONFIG.API_HOME + params.downReportUrl + "?" + params.urlSuffix)
      if(res) {
        let sp = _this.$refs.excel;
        await sp.open(res.data);
        sp.save(params.downReportTitle);
      }
    } else {
      _this.$msgTip.error(_this, { info: "方法调用缺少入参，请检查" });
    }
  },
  /**
   * 发送请求
   * @param _this
   * @param url
   */
  getFunc(_this, url) {
    return _this.$http({
      method: "get",
      url: url,
      responseType: "blob"
    });
  },
  /**
   * 获取报表展示列表高度
   */
  getSpreadSheetHeight() {
    return window.innerHeight - 100 + "px";
  },
  /**
   * 格式化报表状态
   * @param value
   */
  formatStatus(value) {
    switch (value) {
      case '1':
        return '处理中';
      case '2':
        return '处理完成';
      default:
        return "";
    }
  }
};


/**
 * 前台展示利率排序
 */
export function rateSortMethod(a,b,type) {
  if (type==="asc") {
    let a1=parseFloat(a);
    let a2=parseFloat(b);
    if (isNaN(a1)) return -1;
    if (isNaN(a2)) return 1;
    return a1-a2;
  }else if (type==="desc") {
    let a1=parseFloat(a);
    let a2=parseFloat(b);
    if (isNaN(a1)) return 1;
    if (isNaN(a2)) return -1;
    return a2-a1;
  }
}

/**
 * 文件下载，导出异常时抛错
 * @param _this
 * @param downloadUrl       文件下载路径
 * @param params
 *        downloadMethod      文件下载方式，默认为get
 *        paramsByGet         get请求时的入参
 *        paramsByPost        post请求时的入参
 *        downloadFilename    文件下载名称，不传可支持从后台获取，后台不支持则默认为“下载模板.xlsx“
 *        文件名需要从后台获取时，需要在开发接口时添加如下代码：response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
 */
export function fileDownload(_this, downloadUrl, params = {}) {
  let url = downloadUrl.includes(window.LOCAL_CONFIG.API_HOME) ? downloadUrl : window.LOCAL_CONFIG.API_HOME + downloadUrl;
  _this.$http({
    method: params.downloadMethod ? params.downloadMethod : "get",
    url: url,
    params: params.paramsByGet,
    data: params.paramsByPost,
    responseType: "blob"
  }).then((res) => {
    if (res.data.type.indexOf('application/json') >= 0) {
      let reader = new FileReader()
      reader.onload = () => {
        _this.$msgTip.error(_this, { info: JSON.parse(reader.result.toString()).retMsg });
      }
      reader.readAsText(res.data)
      return;
    }
    //下载文件名
    let retFileName = res.headers["content-disposition"] ? res.headers["content-disposition"].split(";")[1].split("fileName=")[1].replace(/\"/g, "") : "下载模板.xlsx";
    let filename = params.downloadFilename ? params.downloadFilename : retFileName;
    filename = decodeURIComponent(filename);
    let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
    if(isIE) {
      navigator.msSaveOrOpenBlob(new Blob([res.data]), filename);
      return;
    }
    let url = window.URL.createObjectURL(new Blob([res.data])); //创建下载链接
    let link = document.createElement('a'); //创建a标签
    link.style.display = 'none';  //将a标签隐藏
    link.href = url;  //给a标签添加下载链接
    link.setAttribute('download', filename); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
    document.body.appendChild(link);
    link.click()  //执行a标签
    document.body.removeChild(link);
  });
}

/**
 * 格式化子票区间
 * 处理规则：
 * 1. 纸票或ECDS票据 返回-
 * 2. 子票区间起始或子票区间截止不存在（错误数据） 返回-
 * 3. 子票区间起始或子票区间截止均为0（零票） 返回0
 * 4. 格式化显示普通等分化票据
 *
 * @param billOrigin 票据来源
 * @param billRangeStart 子票区间起始
 * @param billRangeEnd 子票区间截止
 * @returns {string} 子票区间
 */
export function formatBillRange(billOrigin, billRangeStart, billRangeEnd) {
  if (!billOrigin || billOrigin.toString() === 'CS01'){
    return "-";
  }
  if(billRangeStart === null || billRangeEnd === null){
    return "-";
  }
  if (!(billRangeStart+"") || !(billRangeEnd+"")){
    return "-";
  }
  if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0'){
    return "0";
  }
  return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
}

export function formatBillRangeNoBillOrigin(billRangeStart, billRangeEnd){
  if(billRangeStart === null || billRangeEnd === null){
    return "-";
  }
  if (!(billRangeStart+"") || !(billRangeEnd+"")){
    return "-";
  }
  if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0'){
    return "0";
  }
  return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
}

export function formatBillNoAndRange(billNo, billRangeStart, billRangeEnd) {
  if (billNo && billNo.length === 30){
    let mark = billNo.substr(0,1);
    if (mark === '5' || mark === '6' || mark === '7' || mark === '8'){
      if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0'){
        return billNo + "，子票区间[0]";
      }
      return billNo + "，子票区间[" + billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0') +"]";
    }
  }
  return billNo;
}
