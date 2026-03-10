<!--ECDS机构查询-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules" :class="className">
    <div v-if="filterable">
      <h-simple-select v-model="selectValue" class="hpj-select-drop" searchIcon=" " placeholder="" label-in-value
                       :multiple="showCheckBox" :filterable="filterable" remote accuFilter widthAdaption
                       :loading="isLoading" :showValue="showValue" :dropWidth="dropWidth" :isBackClear="isBackClear"
                       :autoFocus="autoFocus" :showBottom="showBottom" :clearable="clearable"
                       @on-change="selectChange" @on-drop-change="dropChange" @on-clear-select="clearSelect"
                       @on-focus="onFocus" @on-blur="onBlur"
                       @keyup.native="keyUp" @keyup.delete.native.prevent="keyUpDelete"
                       @compositionstart.native="compositionStart" @compositionend.native="compositionend"
                       ref="simpleSelect" :class="{'h-selectTable-input-blur': isInit}">
        <h-select-block :data="findMatchValue" v-show="findMatchValue.length > 0 || isShowSelect"></h-select-block>
      </h-simple-select>
      <span class="hpj-selectdrop-icon icon-android-search" @click="queryBrchNo" v-if="showIcon" ref="selectDropIcon"></span>
    </div>
    <h-input v-else v-model="itemValue" placeholder="" readonly></h-input>
    <common-tree :commonTreeWin="showBranchWin" :title="title" :url="url" :params="params" :isShowCheckStrictly="true"
                 :ifcheck="showCheckBox" :checkStrictly="tempCheckStrictly" :multiple="multiple"
                 :onlyUpdateDown="onlyUpdateDown" :required="isSelectRequired" :isNeedChecked="isNeedChecked"
                 :checkedDataArr="checkedBrchNoArr" :isShowRadioIcon="isShowRadioIcon" :notDeepCopy="false"
                 @treeSelectedChange="brchNoChange" @commonTreeWinClose="showBrchWinClose" :deepCopyForExpend="deepCopyForExpend">
      <h-checkbox slot="checkStrictly" v-model="isCheck" @on-change="checkChange" v-if="showCheckBox">{{$t("m.i.common.checkStrictly")}}
      </h-checkbox>
    </common-tree>
  </h-form-item>
</template>
<script>
  import { post, getParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "showEcdsBranch",
    data() {
      return {
        linkPageSize: 5,   //联想时下拉框显示条数
        keyupPauseTime: 1,    //输入文字停顿时间，单位为秒
        showBranchWin: false,
        checkedBrchNoArr: [],    //已选中机构
        isCheck: true,    //是否勾选联动，默认勾选
        tempCheckStrictly: this.checkStrictly,
        findMatchValue: [],     //搜索匹配值
        selectValue: this.showCheckBox ? [] : "",   //下拉框选中值
        isShowSelect: false,
        isNeedQuery: false,
        isLoading: false,
        timer: null,
        isCompositionend: false,   //判断是否输入中文
        isInit: false,     //是否需要赋初始值
        initValue: "",    //记录传入的初始值
        isTree: true,    //是否通过机构树选择数据
        treeSelectedInfo: [],      //机构树选中数据
        querySelectedInfo: []      //联想查询数据
      };
    },
    props: {
      validRules: {
        type: [Array, String]
      },
      label: {
        type: String,
        default() {
          return this.$t("m.i.common.ecdsBankNo");
        }
      },
      prop: {
        type: String,
        default: "ecdsBankNo"
      },
      required: {
        type: Boolean,
        default: false
      },
      className: {
        type: String,
        default: ""
      },
      value: {
        type: [String, Number, Array],
        default: ""
      },
      ecdsBankNo: {
        type: [String, Number, Array],
        default: ""
      },
      ecdsBankName: {
        type: [String, Number, Array],
        default: ""
      },
      title: {//机构树弹窗标题
        type: String,
        default: "机构查询"
      },
      url: {//查询机构rul
        type: String,
        default: "/sm/auth/branch/queryBranchTree"
      },
      params: {//调用接口时对应参数
        type: Object,
        default() {
          return {};
        }
      },
      queryUrl: {//文本框输入搜索时后台查询url
        type: String,
        default: "sm/auth/branch/branch/func_queryBranchByBrchNo"
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
      showCheckBox: {//是否显示多选框，默认显示
        type: Boolean,
        default: true
      },
      checkStrictly: {//父子节点是否联动，false-联动，true-不联动，默认联动
        type: Boolean,
        default: false
      },
      multiple: {//是否支持多选(只支持树节点多选，与多选框无关)，false-不支持，true-支持
        type: Boolean,
        default: false
      },
      onlyUpdateDown: {//父子组件级联时是否只向下级联，不向上级联，false-向上级联，true-不向上级联
        type: Boolean,
        default: true
      },
      isSelectRequired: {//点击确定按钮时是否必选，false-否，true-是
        type: Boolean,
        default: true
      },
      isNeedChecked: {//反显时是否需选中已选项
        type: Boolean,
        default: true
      },
      isShowRadioIcon: {//单选时是否显示单选图标
        type: Boolean,
        default: true
      },
      // notDeepCopy: {//组件data属性传入组件中变量是否随组件内部修改而修改，false-不修改，true-修改
      //   type: Boolean,
      //   default: false
      // },
      deepCopyForExpend: {//展开收缩时是否记住勾选值
        type: Boolean,
        default: true
      },
      msgBoxWin: {//在<h-msg-box>组件中调用时必传，参数为绑定在对话框的value值
        type: Boolean,
        default: false
      },
      isAutoCloseWin: {//是否自动关闭机构树弹窗
        type: Boolean,
        default: true
      },
      isBankNoRequire: {//行号是否必输
        type: Boolean,
        default: false
      },
      queryAttrValue: {//联想查询时显示下拉框数据所对应的后台返回字段名称
        type: Array,
        default() {
          return ["bankNo", "brchName"];
        }
      },
      isInitValueRequired: {//是否允许删除初始值，true-不允许删除
        type: Boolean,
        default: true
      }
    },
    watch: {
      value(val) {
        if (val == null || val === "" || (Array.isArray(val) && val.length <= 0)) {
          this.selectValue = this.showCheckBox ? [] : "";
        } else {
          this.$nextTick(() => {
            // if (this.ecdsBankNo.toString() === this.initValue.toString()) {
              this.initSelectValue();
            // }
          });
        }
      },
      msgBoxWin(val) {
        this.isInit = val;
        this.resetSelectedInfo();
        if(!val) {
          this.initValue = "";
        }else {
          this.initValue = !!this.ecdsBankNo ? this.ecdsBankNo : "";
          this.initSelectValue();
        }
      },
      ecdsBankNo(val) {
        if (this.msgBoxWin && this.isInit) {
          this.initValue = !!val ? val : "";
        }
      }
    },
    computed: {
      itemValue: {
        get() {
          return this.showValue ? this.ecdsBankNo : this.ecdsBankName;
        },
        set(val) {
        }
      }
    },
    mounted() {
      getParamValuesByKeys("link_page_size,keyup_pause_time").then(res => {
        this.linkPageSize = !!res["link_page_size"] ? res["link_page_size"] : this.linkPageSize;
        this.keyupPauseTime = !!res["keyup_pause_time"] ? Number(res["keyup_pause_time"]) * 1000 : this.keyupPauseTime * 1000;
      });
      this.initValue = !!this.ecdsBankNo ? this.ecdsBankNo : "";
      this.initSelectValue();
    },
    methods: {
      initSelectValue() {
        this.isInit = true;
        this.findMatchValue = [];
        if (!!this.ecdsBankNo || (Array.isArray(this.ecdsBankNo) && this.ecdsBankNo.length > 0)) {
          if (Array.isArray(this.ecdsBankNo)) {
            for (let i = 0; i < this.ecdsBankNo.length; i++) {
              this.findMatchValue.push({ value: this.ecdsBankNo[i], label: this.ecdsBankName[i] });
            }
          } else {
            let ecdsBankNos = !!this.ecdsBankNo ? this.ecdsBankNo.split(",") : [];
            let ecdsBankNames = !!this.ecdsBankName? this.ecdsBankName.split(",") : [];

            for (let i = 0; i < ecdsBankNos.length; i++) {
              this.findMatchValue.push({ value: ecdsBankNos[i], label: ecdsBankNames[i] });
            }
          }
          this.$nextTick(() => {
            if (Array.isArray(this.ecdsBankNo)) {
              this.selectValue = this.showCheckBox ? this.ecdsBankNo : this.ecdsBankNo.toString();
            } else {
              this.selectValue = this.showCheckBox ? this.ecdsBankNo.split(",") : this.ecdsBankNo;
            }
          });
        }
      },
      //组装匹配的下拉框数据
      assembleMatchValue(datas, searchBranch, attrValue) {
        for (let data of datas) {
          searchBranch.push({ value: data[attrValue[0]], label: data[attrValue[1]] });
        }
        return searchBranch;
      },
      //组装下拉框选中值
      assembleSelectInfo(item, attrValue) {
        let ecdsBankNos = [];
        let ecdsBankNames = [];
        for (let i = 0; i < item.length; i++) {
          ecdsBankNos.push(item[i][attrValue[0]]);
          ecdsBankNames.push(item[i][attrValue[1]]);
        }
        return { "ecdsBankNos": ecdsBankNos.join(","), "ecdsBankNames": ecdsBankNames.join(",") };
      },
      assembleSelectedInfo(brchInfos, isTree, attrValue) {
        this.isTree = isTree;
        let selectedInfo = [];
        for (let i = 0; i < brchInfos.length; i++) {
          let brchInfo = {};
          if (brchInfos[i].hasOwnProperty(attrValue[0])) {
            brchInfo.ecdsBankNo = brchInfos[i][attrValue[0]];
          }
          if (brchInfos[i].hasOwnProperty(attrValue[1])) {
            brchInfo.ecdsBankName = brchInfos[i][attrValue[1]];
          }
          if (brchInfos[i].hasOwnProperty("brchNo")) {
            brchInfo.brchNo = brchInfos[i].brchNo;
          }
          if (brchInfos[i].hasOwnProperty("brchName")) {
            brchInfo.brchName = brchInfos[i].brchName;
          }
          if (brchInfos[i].hasOwnProperty("orgCode")) {
            brchInfo.orgCode = brchInfos[i].orgCode;
          }
          selectedInfo.push(brchInfo);
        }
        if(isTree) {
          this.treeSelectedInfo = selectedInfo;
        } else {
          this.querySelectedInfo = selectedInfo;
        }
      },
      queryBrchNo() {
        if (this.isNeedChecked && !!this.value) {
          if (Array.isArray(this.value)) {
            this.checkedBrchNoArr = this.value;
          } else {
            this.checkedBrchNoArr = this.value.split(",");
          }
        }
        this.isInit = false;
        this.showBranchWin = true;
      },
      brchNoChange(item) {
        this.assembleSelectedInfo(item, true, ["bankNo", "title"]);
        this.findMatchValue = this.assembleMatchValue(item, [], ["bankNo", "title"]);
        if (!item[0].bankNo && this.isBankNoRequire){
          this.$msgTip.error(this, { info: "无法获取到ECDS参与行行名/ECDS参与组织机构代码,请在系统中提前配置" });
          return;
        }
        if(this.isAutoCloseWin) {
          this.assembleSelectValue(item);
        } else {
          this.assembleBrchInfo(item, "bankNo");
        }
      },
      assembleSelectValue(item, attrValue = ["bankNo", "title"]) {
        this.$nextTick(() => {
          let selectedInfo = this.assembleSelectInfo(item, attrValue);
          this.selectValue = this.showCheckBox ? selectedInfo.ecdsBankNos.split(",") : selectedInfo.ecdsBankNos;
          this.showBrchWinClose();
        });
      },
      resetSelectedInfo() {
        this.treeSelectedInfo = [];
        this.querySelectedInfo = [];
      },
      clearSelect() {
        this.selectValue = this.showCheckBox ? [] : "";
        this.isShowSelect = false;
        this.findMatchValue = [];
        this.resetSelectedInfo();
        if(!this.isInitValueRequired || this.initValue.toString() === "") {
          this.$emit("update:ecdsBankNo", "");
          this.$emit("update:ecdsBankName", "");
          this.$emit("brchNoChange", []);
        }
      },
      showBrchWinClose() {
        this.checkedBrchNoArr = [];
        this.showBranchWin = false;
      },
      checkChange(val) {
        this.tempCheckStrictly = !val;
      },
      queryBranch(queryStr) {
        if (queryStr !== "") {
          this.isLoading = true;
          this.isShowSelect = true;
          this.findMatchValue = [];
          if (this.isNeedQuery) {
            let params = { brchName: queryStr.replace(/ /g, "%"), "pageSize": this.linkPageSize, loading: false };
            post(Object.assign(params, this.params), this.queryUrl).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.isLoading = false;
                  this.findMatchValue = this.assembleMatchValue(res.data.retData.list, [], this.queryAttrValue);
                  this.assembleSelectedInfo(res.data.retData.list, false, this.queryAttrValue);
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
          if(!!selectOption.value) {
            item[0] = selectOption;
          }
        }
        this.isShowSelect = false;
        let selectedInfo = {};
        if (!this.showCheckBox) {
          selectedInfo = this.assembleSelectInfo(item, ["value", "label"]);
          // this.$refs.simpleSelect.blur();
        }
        this.$nextTick(() => {
          if(this.isInitValueRequired && item.length <= 0 && this.initValue.toString() !== "") {
            this.initSelectValue();
            this.$msgTip.info(this, { info: "当前存在初始数据，不允许清除" });
            return;
          }
          if (this.showCheckBox) {
            // if (this.showCheckBox && !this.$refs.simpleSelect.$props.showValue) {
            selectedInfo = this.assembleSelectInfo(this.$refs.simpleSelect.$data.viewValue, ["value", "label"]);
          }
          this.$emit("update:ecdsBankNo", selectedInfo.ecdsBankNos);
          this.$emit("update:ecdsBankName", selectedInfo.ecdsBankNames);
          this.assembleBrchInfo(item, "value");
          this.offsetArrow();
        });
      },
      assembleBrchInfo(item, attrValue) {
        let selectedInfoArr = this.treeSelectedInfo.concat(this.querySelectedInfo);
        if(selectedInfoArr.length > 0) {
          let info = [];
          for (let obj of item) {
            for (let selectedData of selectedInfoArr) {
              if (obj[attrValue] === selectedData.ecdsBankNo) {
                info.push(selectedData);
                break;
              }
            }
          }
          this.$emit("brchNoChange", info);
        }
      },
      offsetArrow() {
        if (!this.showCheckBox) return;
        let el = this.$refs.simpleSelect.$refs.reference;
        if (el.scrollHeight > el.clientHeight) {
          let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0  ? true : false
          if(isIE) {
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
            that.queryBranch(event.target.value);
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
            that.queryBranch(event.target.value);
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
          that.queryBranch(event.target.value);
        }, that.keyupPauseTime);
      }
    }
  };
</script>
<style>

</style>
