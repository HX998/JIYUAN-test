<!--下拉框联想-->
<template>
  <div>
    <div v-if="filterable">
      <h-simple-select v-model="selectValue" class="hpj-select-drop" searchIcon=" " :placeholder="placeholder" label-in-value
                       :multiple="showCheckBox" :filterable="filterable" remote :accuFilter="false" widthAdaption
                       :loading="isLoading" :showValue="showValue" :dropWidth="dropWidth" :isBackClear="isBackClear"
                       :autoFocus="autoFocus" :showBottom="showBottom" :clearable="clearable"
                       @on-change="selectChange" @on-drop-change="dropChange" @on-clear-select="clearSelect"
                       @on-focus="onFocus" @on-blur="onBlur" :readonly="readonly"
                       @keyup.native="keyUp" @keyup.delete.native.prevent="keyUpDelete"
                       @compositionstart.native="compositionStart" @compositionend.native="compositionend"
                       ref="simpleSelect" :class="{'h-selectTable-input-blur': isInit}">
        <h-select-block :data="findMatchValue" v-show="findMatchValue.length > 0 || isShowSelect"></h-select-block>
      </h-simple-select>
      <span class="hpj-selectdrop-icon icon-android-search" @click="searchClick" v-if="showIcon"
            ref="selectDropIcon"></span>
    </div>
    <h-input v-else v-model="itemValue" :placeholder="placeholder" readonly :class="selectLinkClassName"></h-input>
  </div>
</template>

<script>
  import { post, getParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "simpleSelectLink",
    data() {
      return {
        linkPageSize: 5,   //联想时下拉框显示条数
        keyupPauseTime: 1,    //输入文字停顿时间，单位为秒
        findMatchValue: [],     //搜索匹配值
        selectValue: this.showCheckBox ? [] : "",   //下拉框选中值
        isShowSelect: false,
        isNeedQuery: false,
        isLoading: false,
        timer: null,
        isCompositionend: false,   //判断是否输入中文
        isInit: false,     //是否需要赋初始值
        initValue: "",    //记录传入的初始值
        isTreeOrTable: false,    //是否通过弹窗选择数据，false-联想，true-弹窗
        treeOrTableSelectedInfo: [],      //树或表格弹窗选中数据
        querySelectedInfo: []      //联想查询数据
      };
    },
    props: {
      value: {
        type: [String, Number, Array],
        default: ""
      },
      placeholder: {
        type: String,
        default: ""
      },
      linkParams: {//联想对应字段，如查询企业客户，则[{'key': 'custNo', value: 实际custNo值},{'key': 'custName', value: 实际custName值}]
        type: Array
      },
      queryUrl: {//文本框输入搜索时后台查询url
        type: String
      },
      queryParams: {//联想时需额外添加的条件
        type: Object
      },
      filterable: {//是否支持搜索，不支持搜索时只读
        type: Boolean,
        default: true
      },
      showValue: {//输入框是否显示value值，默认label
        type: Boolean,
        default: false
      },
      dropWidth: {//设置下拉框的宽度,不设置时下拉框的宽度等于输入框宽度
        type: [Number, String]
      },
      isBackClear: {//输入框是否可通过backspace按键清除选中项(只支持谷歌)
        type: Boolean,
        default: false
      },
      autoFocus: {//是否自动高亮第一个检索选项
        type: Boolean,
        default: false
      },
      showBottom: {//搜索框显示位置，只在（filterable为true）时使用,默认显示在输入框位置，设置为true时显示在下拉框顶部
        type: Boolean,
        default: false
      },
      clearable: {//是否可以清空选项，只在单选时有效
        type: Boolean,
        default: true
      },
      showIcon: {//是否显示搜索图标
        type: Boolean,
        default: true
      },
      readonly: {//输入框是否可通过backspace按键清除选中项(只支持谷歌)
        type: Boolean,
        default: false
      },
      showCheckBox: {//是否显示多选框，默认显示
        type: Boolean,
        default: true
      },
      msgBoxWin: {//在<h-msg-box>组件中调用时必传，参数为绑定在对话框的value值
        type: Boolean,
        default: false
      },
      isAutoCloseWin: {//是否自动关闭弹窗
        type: Boolean,
        default: true
      },
      treeOrTable: {//弹出框数据展示类型，默认为表格-table
        type: String,
        default: "table"
      },
      queryMsgBox: {//搜索图标点击事件，一般为显示弹窗
        type: Function
      },
      // assembleTreeInfo: {//用于弹窗加载内容为树结构时，需额外拼接参数时自定义方法
      //   type: Function
      // },
      extraTreePrams: {//弹窗加载为树结构时，数据选中事件需额外返回的字段，只在treeOrTable为tree时生效
        type: Array
      },
      isInitValueClearable: {//是否允许清空初始值，false-不允许
        type: Boolean,
        default: false
      },
      isCompositeQueryEnable: {//是否同时支持XX号和XX名称联合查询，如机构号和机构名称
        type: Boolean,
        default: false
      },
      getCompositeQueryParams: {//isCompositeQueryEnable为true时，联合查询后台字段匹配规则对应方法
        type: Function
      },
      selectLinkClassName: {
        type: String,
        default: ""
      }
    },
    watch: {
      value(val) {
        if (val == null || val === "" || (Array.isArray(val) && val.length <= 0)) {
          this.selectValue = this.showCheckBox ? [] : "";
        } else {
          if (this.msgBoxWin && this.isInit) {
            this.initValue = !!val ? val : "";
          }
          this.$nextTick(() => {
            if (this.linkParams[0].value.toString() === this.initValue.toString()) {
              this.initSelectValue();
            }
          });
        }
      },
      msgBoxWin(val) {
        this.isInit = val;
        this.resetSelectedInfo();
        if (!val) {
          this.initValue = "";
        } else {
          this.initValue = !!this.linkParams[0].value ? this.linkParams[0].value : "";
          this.initSelectValue();
        }
      }
    },
    computed: {
      itemValue: {
        get() {
          return this.showValue ? this.linkParams[0].value : this.linkParams[1].value;
        },
        set(val) {
        }
      }
    },
    created() {
      // this.$watch(() => {
      //   return this.linkParams[0].value;
      // }, (newVal, oldVal) => {
      //   if (this.msgBoxWin && this.isInit) {
      //     this.initValue = !!newVal ? newVal : "";
      //   }
      // }, { immediate: false })
    },
    mounted() {
      getParamValuesByKeys("link_page_size,keyup_pause_time").then(res => {
        this.linkPageSize = !!res["link_page_size"] ? res["link_page_size"] : this.linkPageSize;
        this.keyupPauseTime = !!res["keyup_pause_time"] ? Number(res["keyup_pause_time"]) * 1000 : this.keyupPauseTime * 1000;
      });
      this.initValue = !!this.linkParams[0].value ? this.linkParams[0].value : "";
      this.initSelectValue();
    },
    methods: {
      searchClick() {
        this.isInit = false;
        if(this.queryMsgBox instanceof Function) {
          this.queryMsgBox();
        }
      },
      initSelectValue() {
        this.isInit = true;
        this.findMatchValue = [];
        if (!!this.linkParams[0].value || (Array.isArray(this.linkParams[0].value) && this.linkParams[0].value.length > 0)) {
          if (Array.isArray(this.linkParams[0].value)) {
            for (let i = 0; i < this.linkParams[0].value.length; i++) {
              this.findMatchValue.push({ value: this.linkParams[0].value[i], label: this.linkParams[1].value[i] });
            }
          } else {
            let selectValues = this.linkParams[0].value ? this.linkParams[0].value.split(",") : [];
            let selectNames = this.linkParams[1].value ? this.linkParams[1].value.split(",") : [];
            for (let i = 0; i < selectValues.length; i++) {
              this.findMatchValue.push({ value: selectValues[i], label: selectNames[i] });
            }
          }
          this.$nextTick(() => {
            if (Array.isArray(this.linkParams[0].value)) {
              this.selectValue = this.showCheckBox ? this.linkParams[0].value : this.linkParams[0].value.toString();
            } else {
              this.selectValue = this.showCheckBox ? this.linkParams[0].value.split(",") : this.linkParams[0].value;
            }
          });
        }
      },
      //组装匹配的下拉框数据
      assembleMatchValue(datas, searchLinkData = [], attrValue = [this.linkParams[0].key, this.linkParams[1].key]) {
        for (let data of datas) {
          searchLinkData.push({ value: data[attrValue[0]], label: data[attrValue[1]] });
        }
        this.findMatchValue = searchLinkData;
      },
      //组装下拉框选中值
      assembleSelectInfo(item, attrValue = ["value", "label"]) {
        let selectValues = [];
        let selectNames = [];
        for (let i = 0; i < item.length; i++) {
          selectValues.push(item[i][attrValue[0]]);
          selectNames.push(item[i][attrValue[1]]);
        }
        return { "selectValues": selectValues.join(","), "selectNames": selectNames.join(",") };
      },
      //组装联想选中或弹窗选择数据
      assembleSelectedInfo(items, isTreeOrTable, attrValue = [this.linkParams[0].key, this.linkParams[1].key]) {
        this.resetSelectedInfo();
        this.isTreeOrTable = isTreeOrTable;
        let selectedInfos = [];
        if (this.treeOrTable === "table") {
          selectedInfos = items;
        } else if (this.treeOrTable === "tree") {
          for (let i = 0; i < items.length; i++) {
            let selectedInfo = {};
            if (items[i].hasOwnProperty(attrValue[0])) {
              selectedInfo[this.linkParams[0].key] = items[i][attrValue[0]];
            }
            if (items[i].hasOwnProperty(attrValue[1])) {
              selectedInfo[this.linkParams[1].key] = items[i][attrValue[1]];
            }
            for (let param of this.extraTreePrams) {
              selectedInfo[param] = items[i][param];
            }
            selectedInfos.push(selectedInfo);
          }
          // if(this.assembleTreeInfo instanceof Function) {
          //   selectedInfos = this.assembleTreeInfo(items, attrValue);
          // } else {
          //   for (let i = 0; i < items.length; i++) {
          //     let selectedInfo = {};
          //     if (items[i].hasOwnProperty(attrValue[0])) {
          //       selectedInfo[this.linkParams[0].key] = items[i][attrValue[0]];
          //     }
          //     if (items[i].hasOwnProperty(attrValue[1])) {
          //       selectedInfo[this.linkParams[1].key] = items[i][attrValue[1]];
          //     }
          //     selectedInfos.push(selectedInfo);
          //   }
          // }
        }
        if (isTreeOrTable) {
          this.treeOrTableSelectedInfo = selectedInfos;
        } else {
          this.querySelectedInfo = selectedInfos;
        }
      },
      //关闭弹窗，联想下拉框赋值
      assembleSelectValue(item, attrValue = [this.linkParams[0].key, this.linkParams[1].key]) {
        this.$nextTick(() => {
          let selectedInfo = this.assembleSelectInfo(item, attrValue);
          this.selectValue = this.showCheckBox ? selectedInfo.selectValues.split(",") : selectedInfo.selectValues;
          this.$emit("msgBoxWinClose");
        });
      },
      resetSelectedInfo() {
        this.treeOrTableSelectedInfo = [];
        this.querySelectedInfo = [];
      },
      clearSelect() {
        this.selectValue = this.showCheckBox ? [] : "";
        this.findMatchValue = [];
        this.isShowSelect = false;
        this.resetSelectedInfo();
        if (this.isInitValueClearable || this.initValue.toString() === "") {
          let params = {};
          params[this.linkParams[0].key] = "";
          params[this.linkParams[1].key] = "";
          params["selectedChange"] = [];
          this.$emit("updateChange", params);
        }
      },
      queryLinkData(queryStr) {
        if (queryStr !== "") {
          this.isLoading = true;
          this.isShowSelect = true;
          this.findMatchValue = [];
          if (this.isNeedQuery) {
            let params = { "pageSize": this.linkPageSize, loading: false };
            let queryInitParams = {};
            if (this.isCompositeQueryEnable && this.getCompositeQueryParams instanceof Function) {
              queryInitParams = this.getCompositeQueryParams(queryStr);
            }
            if (Object.keys(queryInitParams).length > 0) {
              params = Object.assign(params, queryInitParams);
            } else {
              params[this.linkParams[1].key] = queryStr.replace(/ /g, "%");
            }
            post(Object.assign(params, this.queryParams), this.queryUrl).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.isLoading = false;
                  this.assembleMatchValue(res.data.retData.list);
                  this.assembleSelectedInfo(res.data.retData.list, false);
                  if (res.data.retData.list.length === 1) {
                    this.assembleSelectValue(this.findMatchValue, ["value", "label"]);
                    if (this.selectValue === queryStr || this.selectValue === this.findMatchValue[0]["value"]) {
                      this.$refs.simpleSelect.setQuery(this.findMatchValue[0]["label"]);
                      this.$refs.simpleSelect.blur();
                    } else {
                      this.$refs.simpleSelect.blur();
                    }
                  }
                } else {
                  this.isLoading = false;
                  this.isShowSelect = false;
                  this.findMatchValue = [];
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.isLoading = false;
                this.isShowSelect = false;
                this.findMatchValue = [];
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        } else {
          this.isLoading = false;
          this.isShowSelect = false;
          this.findMatchValue = [];
        }
      },
      selectChange(selectOption) {
        let item = [];
        if (Array.isArray(selectOption)) {
          item = selectOption;
        } else {
          if (!!selectOption.value) {
            item[0] = selectOption;
          }
        }
        this.isShowSelect = false;
        let selectedInfo = {};
        if (!this.showCheckBox) {
          selectedInfo = this.assembleSelectInfo(item);
        }
        this.$nextTick(() => {
          if (!this.isInitValueClearable && item.length <= 0 && this.initValue.toString() !== "") {
            this.initSelectValue();
            this.$msgTip.info(this, { info: "当前存在初始数据，不允许清除" });
            return;
          }
          if (this.showCheckBox) {
            // if (this.showCheckBox && !this.$refs.simpleSelect.$props.showValue) {
            selectedInfo = this.assembleSelectInfo(this.$refs.simpleSelect.$data.viewValue);
          }
          let params = {};
          params[this.linkParams[0].key] = selectedInfo.selectValues;
          params[this.linkParams[1].key] = selectedInfo.selectNames;
          this.$emit("updateChange", params);
          this.assembleChangeInfo(item, "value");
          this.offsetArrow();
        });
      },
      assembleChangeInfo(item, attrValue) {
        let selectedInfoArr = this.treeOrTableSelectedInfo.concat(this.querySelectedInfo);
        if (selectedInfoArr.length > 0) {
          let info = [];
          for (let obj of item) {
            for (let selectedData of selectedInfoArr) {
              if (obj[attrValue] === selectedData[this.linkParams[0].key]) {
                info.push(selectedData);
                break;
              }
            }
          }
          this.$emit("selectedChange", info, this.isTreeOrTable);
        }
      },
      offsetArrow() {
        if (!this.showCheckBox) return;
        let el = this.$refs.simpleSelect.$refs.reference;
        if (el.scrollHeight > el.clientHeight) {
          let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0 ? true : false;
          if (isIE) {
            this.$refs.selectDropIcon.style.right = "16px";
          } else {
            this.$refs.selectDropIcon.style.right = "6px";
          }
        } else {
          this.$refs.selectDropIcon.style.right = "0px";
        }
      },
      dropChange(status) {
        this.isInit = false;
        this.isLoading = false;
        if (status) {
          this.isShowSelect = false;
          this.findMatchValue = [];
        } else {
          this.isNeedQuery = false;
        }
      },
      onFocus() {
        this.offsetArrow();
      },
      onBlur() {
        this.$refs.selectDropIcon.style.right = "0px";
      },
      keyUp(event) {
        let that = this;
        let flag = (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 89);
        if (flag && !this.isCompositionend) {
          clearTimeout(this.timer);
          this.timer = setTimeout(function() {
            that.isNeedQuery = true;
            that.queryLinkData(event.target.value);
          }, that.keyupPauseTime);
        }
      },
      keyUpDelete(event) {
        let that = this;
        if (event.target.value === "") {
          this.isShowSelect = false;
          this.findMatchValue = [];
          return;
        }
        if (!this.isCompositionend) {
          clearTimeout(this.timer);
          this.timer = setTimeout(function() {
            that.isNeedQuery = true;
            that.queryLinkData(event.target.value);
          }, that.keyupPauseTime);
        }
      },
      compositionStart(event) {
        this.isCompositionend = true;
        this.isNeedQuery = false;
      },
      compositionend(event) {
        let that = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
          that.isCompositionend = false;
          that.isNeedQuery = true;
          that.queryLinkData(event.target.value);
        }, that.keyupPauseTime);
      }
    }
  };
</script>

<style scoped>

</style>
