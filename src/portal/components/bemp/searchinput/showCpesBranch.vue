<!--票交机构查询-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules" :class="className">
    <simple-select-link v-model="itemValue" :placeholder="placeholder" :queryUrl="queryUrl" :queryParams="linkQueryParams"
                        :filterable="filterable" :showValue="showValue" :dropWidth="dropWidth" :readonly="readonly"
                        :isBackClear="isBackClear" :autoFocus="autoFocus" :showCheckBox="showCheckBox"
                        :showBottom="showBottom" :clearable="clearable" :showIcon="showIcon" :msgBoxWin="msgBoxWin"
                        :isAutoCloseWin="isAutoCloseWin" treeOrTable="table" :selectLinkClassName="selectLinkClassName"
                        :isInitValueClearable="isInitValueClearable" :isCompositeQueryEnable="isCompositeQueryEnable"
                        :queryMsgBox="queryCpesBrch" :getCompositeQueryParams="getCompositeQueryParams"
                        :linkParams="[{'key': this.queryAttrValue[0], 'value': itemValue},{'key': this.queryAttrValue[1], 'value': cpesBrchName}]"
                        @updateChange="updateChange" @msgBoxWinClose="cpesBranchWinClose"
                        @selectedChange="handleSelectedChange" ref="simpleSelectLink"></simple-select-link>
    <cpes-branch-msgbox :showCpesBranchWin="showCpesBranchWin" :title="title" :datagridUrl="datagridUrl"
                        :selectType="selectType" :showEnable="showEnable" :cpesBrchParams="cpesBrchParams"
                        :isSelectRequired="isSelectRequired" @cpesBranchWinClose="cpesBranchWinClose"
                        @cpesBranchChange="cpesBranchChange" ref="cpesBranchMsgBox"></cpes-branch-msgbox>
  </h-form-item>
</template>
<script>
  export default {
    name: "showCpesBranch",
    components: {},
    data() {
      return {
        showCpesBranchWin: false
      };
    },
    props: {
      validRules: {
        type: [Array, String]
      },
      label: {
        type: String,
        default() {
          return this.$t("m.i.common.cpesBrchName");
        }
      },
      prop: {
        type: String,
        default: "cpesBrchName"
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
      placeholder: {
        type: String,
        default: ""
      },
      isQueryByBankNo: {//是否绑定票交机构行号，设为true时，需传bankNo
        type: Boolean,
        default: false
      },
      brchCode: {//票交机构代码
        type: [String, Number, Array],
        default: ""
      },
      bankNo: {//行号，isQueryByBankNo为true时生效
        type: [String, Number, Array],
        default: ""
      },
      cpesBrchName: {//票交机构名称
        type: [String, Number, Array],
        default: ""
      },
      title: {//机构树弹窗标题
        type: String,
        default: "票交机构查询"
      },
      selectType: { //选择框类型，默认为单选，radio-单选，check-复选
        type: String,
        default: "radio"
      },
      datagridUrl: {
        type: String
      },
      showEnable: {//是否查询可用机构
        type: Boolean,
        default: true
      },
      cpesBrchParams: {//查询票交机构需额外添加的条件
        type: Object,
        default() {
          return {};
        }
      },
      isSelectRequired: {//点击确定按钮时是否必选，false-否，true-是
        type: Boolean,
        default: true
      },
      queryUrl: {//文本框输入搜索时后台查询url
        type: String,
        default: "/shcpe/cpes/branch/agencyInformation/func_queryBranchs"
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
      readonly: {//是否不可编辑
        type: Boolean,
        default: false
      },
      msgBoxWin: {//在<h-msg-box>组件中调用时必传，参数为绑定在对话框的value值
        type: Boolean,
        default: false
      },
      isAutoCloseWin: {//是否自动关闭票交机构弹窗
        type: Boolean,
        default: true
      },
      isInitValueClearable: {//是否允许清空初始值，false-不允许
        type: Boolean,
        default() {
          return !this.required;
        }
      },
      queryAttrValue: {//联想查询时显示下拉框数据所对应的后台返回字段名称
        type: Array,
        default() {
          return this.isQueryByBankNo ? ["transBrchBankNo", "brchFullNameZh"] : ["brchCode", "brchFullNameZh"];
        }
      },
      /**
       * 票交机构联合查询规则如下：
       * 输入9位数字：根据字段brchCode查询
       * 输入12位数字且isQueryByBankNo为true：根据字段transBrchBankNo查询
       * 全中文或混合：根据字段brchFullNameZh查询
       */
      isCompositeQueryEnable: {//是否支持机构代码和机构名称联合查询
        type: Boolean,
        default: false
      },
      selectLinkClassName: {//filterable为false时，需要给文本框额外添加的样式
        type: String,
        default: ""
      }
    },
    watch: {},
    computed: {
      showCheckBox() {
        return this.selectType === "check";
      },
      itemValue() {
        return this.isQueryByBankNo ? this.bankNo : this.brchCode;
      },
      linkQueryParams(){
        let linkQueryParams = this.cpesBrchParams;
        linkQueryParams["showEnableStr"] = this.showEnable ? "1" : "0";
        return linkQueryParams;
      }
    },
    mounted() {},
    methods: {
      queryCpesBrch() {
        this.showCpesBranchWin = true;
      },
      updateChange(info) {
        if(this.isQueryByBankNo) {
          this.$emit("update:bankNo", info[this.queryAttrValue[0]]);
        } else {
          this.$emit("update:brchCode", info[this.queryAttrValue[0]]);
        }
        this.$emit("update:cpesBrchName", info[this.queryAttrValue[1]]);
        if (info.selectedChange) {
          this.handleSelectedChange(info.selectedChange);
        }
      },
      cpesBranchChange(item) {
        if (this.selectType === "radio") {
          item = item ? [item] : [];
        }
        this.$refs.simpleSelectLink.assembleSelectedInfo(item, true);
        this.$refs.simpleSelectLink.assembleMatchValue(item);
        if (this.isAutoCloseWin) {
          this.$refs.simpleSelectLink.assembleSelectValue(item);
        } else {
          this.$refs.simpleSelectLink.assembleChangeInfo(item, this.queryAttrValue[0]);
        }
        if (this.selectType === "radio" && this.value === item[0].brchCode) {
          if(this.isQueryByBankNo) {
            this.$emit("update:bankNo", item[0][this.queryAttrValue[0]]);
          } else {
            this.$emit("update:brchCode", item[0][this.queryAttrValue[0]]);
          }
          this.$emit("update:cpesBrchName", item[0][this.queryAttrValue[1]]);
        }
      },
      cpesBranchWinClose() {
        this.showCpesBranchWin = false;
      },
      /**
       * 返回选中数据对象
       * @param info
       * @param isTreeOrTable  用于区分是否通过弹窗选择数据，false-联想，true-弹窗
       */
      handleSelectedChange(info, isTreeOrTable) {
        this.$emit("cpesBranchChange", info);
      },
      //联合查询时根据输入字符区分后台查询字段
      getCompositeQueryParams(queryStr) {
        let queryInitParams = {};
        if (this.isCompositeQueryEnable) {
          if (/^\d{9}$/.test(queryStr)) {
            //输入9位数字：根据字段brchCode查询
            queryInitParams = { "brchCode": queryStr };
          } else if (this.isQueryByBankNo && /^\d{12}$/.test(queryStr)) {
            //输入12位数字且isQueryByBankNo为true：根据字段transBrchBankNo查询
            queryInitParams = { "transBrchBankNo": queryStr };
          }
        }
        return queryInitParams;
      }
    }
  };
</script>
<style>

</style>
