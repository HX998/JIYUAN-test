import messagelayer from './msgbox.vue'

const messagebox = {};
//是否将弹层放置于body内
let isTransfer = true;
const getTargetNode = function (isTransfer, instance, instanceByTransfer, type) {
  if (isTransfer) {
    if (type === "sure") {
      instance.options.hsure();
    }
    instance.visible = false;
    // document.body.removeChild(instance.$el);
  } else {
    if (type === "sure") {
      instanceByTransfer.options.hsure();
    }
    instanceByTransfer.visible = false;
  }
};
messagebox.install = function (Vue, options) {
  let opt = {
    hsure: () => {}
  };
  let messageboxControll = Vue.extend(messagelayer);
  let instance = new messageboxControll().$mount(document.createElement('div'));
  let instanceByTransfer = new messageboxControll().$mount(document.createElement('div'));
  let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  Vue.prototype.$messagebox = function (message, option) {
    if ((typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object') {
      for (var key in option) {
        opt[key] = option[key];
      }
    }
    if (isTransfer) {
      instance.message = message;
      instance.visible = true;
      instance.options = opt;
      document.body.appendChild(instance.$el);
    } else {
      instanceByTransfer.message = message;
      instanceByTransfer.visible = true;
      instanceByTransfer.options = opt;
      if (document.querySelector('.window-operate') !== null) {
        let node = document.querySelector('.window-operate');
        node.style.transform = 'translateX(0%) translateZ(0px)'
        node.style.willChange = 'transform'
        node.appendChild(instanceByTransfer.$el);
      } else {
        let node = document.querySelector('#appMain').children[0];
        node.style.transform = 'translateX(0%) translateZ(0px)'
        node.style.willChange = 'transform'
        node.appendChild(instanceByTransfer.$el);
      }
    }
  };
  Vue.prototype.$messagebox['show'] = function (message, option) {
    Vue.prototype.$messagebox(message, option);
    if (message.autoHide) {
      window.setTimeout(() => {
        getTargetNode(isTransfer, instance, instanceByTransfer);
      }, message.time);
    }
  };
  Vue.prototype.$messagebox['cancel'] = function () {
    getTargetNode(isTransfer, instance, instanceByTransfer);
  };
  Vue.prototype.$messagebox['sure'] = function () {
    getTargetNode(isTransfer, instance, instanceByTransfer, "sure");
  };
  Vue.prototype.$messagebox['setTransfer'] = function (transfer) {
    isTransfer = transfer;
  }
};
export default messagebox;
