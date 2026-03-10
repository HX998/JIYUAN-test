export default {
  install (Vue, options) {
    Vue.prototype.optColum=function(colName,propName,option){
      option= option||{};
      let  sortable = option.sortable||false;
      return {title: colName, key: propName,
        hiddenCol: false,
        sortable: sortable};
    }
    Vue.prototype.optRenderColum=function(colName,propName,option){
      //renderType , groupCode,dictMap ,sortable
      option = option||{};
      let sortable = option.sortable||false;
      let renderType = option.renderType;
      let groupCode = option.groupCode;
      let dictMap = option.dictData;
      return {title: colName, key: propName,
        hiddenCol: false,
        sortable: sortable,
        render:(h, params) => {
          if (renderType == 'dict'){
            let dictValue = this.getDictValueFromMap(dictMap, groupCode, params.row[propName]);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          } else if (renderType == 'dt') {
            let date = params.row[propName];
            if (!!params.row[propName]) {
              date = this.$moment(params.row[propName], "YYYY-MM-DD").format("YYYY-MM-DD");
            }
            return h("span", date);
          } else if (renderType == 'tm') {
            let time = params.row[propName];
            if (!!params.row[propName]) {
              let transTm = params.row[propName].toString();
              if (transTm.length < 6) {
                for (let i = 0; i < (6 - transTm.length); i++) {
                  transTm = "0" + transTm;
                }
              }
              time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
            }
            return h("span", time);
          } else if (renderType == 'ct') {
            if (!!params.row[propName]) {
              let dttm = this.$moment(params.row[propName], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", dttm);
            }
          }
        }
      };
    }
  }
}
