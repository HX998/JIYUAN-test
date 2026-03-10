import loading from './loading.vue'
var loadingbox = {};
loadingbox.install = function(Vue, options) {
    var loadingboxControll = Vue.extend(loading);
    var instance = new loadingboxControll().$mount(document.createElement('div'));
    Vue.prototype.$loadingbox = function(message) {
        instance.message = message;
        instance.visible = true;
        document.body.appendChild(instance.$el);
    };
    Vue.prototype.$loadingbox['open'] = function(message) {
        Vue.prototype.$loadingbox(message);
    };
    Vue.prototype.$loadingbox['close'] = function() {
        if(instance.visible == true){
            document.body.removeChild(instance.$el);
            instance.visible = false;
        }
    };
};
export default loadingbox;