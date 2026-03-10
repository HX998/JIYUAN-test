/**
 * 项目提示框
 * 在每个请求响应成功后：不论结果成功与否都应给与提示
 * 提示
 * 成功
 * 报错
 */
const msgTip = {
  success: function (that, options) {
    that.$messagebox.show(Object.assign({
      noHead: true,
      noFoot: true,
      title: '提示框',
      icon: true,
      stateType: 'success',
      stateTitle: '操作成功',
      info: '',
      btnType: '',
      // width: '200',
      // height: '180',
      autoHide: true,
      time: 1000
    }, options));
  },
  info: function (that, options) {
    that.$messagebox.show(Object.assign({
      title: '提示框',
      icon: false,
      stateType: '',
      stateTitle: '',
      info: '',
      btnType: 'inform',
      // width: '800',
      // height: '400'
    }, options));
  },
  warn: function (that, options) {
    that.$messagebox.show(Object.assign({
      title: '提示框',
      icon: true,
      stateType: 'warn',
      stateTitle: '是否确定删除',
      info: '',
      btnType: 'confirm',
      width: '300',
      height: '200'
    }, {
      hsure: () => {
        alert(this.test);
      }
    }, options));
  },
  error: function (that, options) {
    that.$messagebox.show(Object.assign({
      title: '提示框',
      icon: true,
      stateType: 'failure',
      stateTitle: '操作失败',
      info: '',
      btnType: 'inform',
      // width: '300',
      // height: '260'
    }, options));
  },
  remove: function (that) {
    that.$messagebox.cancel();
  }
}

export default msgTip
