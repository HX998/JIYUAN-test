<!--企业客户查询-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :validRules="validRules" :class="className">
    <simple-select-link v-model="custNo" :placeholder="placeholder" :queryUrl="queryUrl" :queryParams="custCorpParams"
                        :filterable="filterable" :showValue="showValue" :dropWidth="dropWidth"
                        :isBackClear="isBackClear" :autoFocus="autoFocus" :showCheckBox="showCheckBox"
                        :showBottom="showBottom" :clearable="clearable" :showIcon="showIcon" :msgBoxWin="msgBoxWin"
                        :isAutoCloseWin="isAutoCloseWin" treeOrTable="table" :selectLinkClassName="selectLinkClassName"
                        :isInitValueClearable="isInitValueClearable" :queryMsgBox="queryCustCorp"
                        :linkParams="[{'key':this.queryAttrValue[0], 'value':custNo},{'key':this.queryAttrValue[1], 'value':custName}]"
                        @updateChange="updateChange" @msgBoxWinClose="custCorpWinClose"
                        @selectedChange="handleSelectedChange" ref="simpleSelectLink"></simple-select-link>
    <cust-corp-msg-box :showCustCorpWin="showCustCorpWin" :title="title" :datagridUrl="datagridUrl"
                       :licenseFlag="licenseFlag" :selectType="selectType" :custCorpParams="custCorpParams"
                       :isQueryCustAcct="isQueryCustAcct" :custAcctQueryUrl="custAcctQueryUrl"
                       :custAcctParams="custAcctParams" :isSelectRequired="isSelectRequired"
                       @custCorpWinClose="custCorpWinClose" @custCorpChange="custCorpChange"
                       ref="custCorpMsgBox"></cust-corp-msg-box>
  </h-form-item>
</template>
<script>

  export default {
    name: "showCustCorp",
    components: {},
    data() {
      return {
        showCustCorpWin: false
      };
    },
    props: {
      validRules: {
        type: [Array, String]
      },
      label: {
        type: String,
        default() {
          return this.$t("m.i.common.custName");
        }
      },
      prop: {
        type: String,
        default: "custName"
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
      custNo: {//企业客户号
        type: [String, Number, Array],
        default: ""
      },
      custName: {//企业客户名称
        type: [String, Number, Array],
        default: ""
      },
      title: {
        type: String
      },
      selectType: { //选择框类型，默认为单选，radio-单选，check-复选
        type: String,
        default: "radio"
      },
      licenseFlag: {//查询机构是否授权此菜单
        type: Boolean,
        default: false
      },
      datagridUrl: {//企业客户弹窗表单数据查询接口
        type: String
      },
      custCorpParams: {//查询企业客户需额外添加的条件
        type: Object
      },
      isQueryCustAcct: {//是否需要根据客户号查询客户账户
        type: Boolean,
        default: false
      },
      custAcctQueryUrl: {//根据客户号查询客户账户接口
        type: String
      },
      custAcctParams: {//查询企业客户账号需额外添加的条件
        type: Object
      },
      isSelectRequired: {//点击确定按钮时是否必选，false-否，true-是
        type: Boolean,
        default: true
      },
      queryUrl: {//文本框输入搜索时后台查询url
        type: String,
        default: "/bm/cust/corp/pageQueryCustCorpList"
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
      msgBoxWin: {//在<h-msg-box>组件中调用时必传，参数为绑定在对话框的value值
        type: Boolean,
        default: false
      },
      isAutoCloseWin: {//是否自动关闭企业客户弹窗
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
          return ["custNo", "custName"];
        }
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
      }
    },
    mounted() {},
    methods: {
      queryCustCorp() {
        this.showCustCorpWin = true;
      },
      updateChange(info) {
        this.$emit("update:custNo", info[this.queryAttrValue[0]]);
        this.$emit("update:custName", info[this.queryAttrValue[1]]);
        if (info.selectedChange) {
          this.handleSelectedChange(info.selectedChange);
        }
      },
      custCorpChange(item) {
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
      },
      custCorpWinClose() {
        this.showCustCorpWin = false;
      },
      /**
       * 返回选中数据对象
       * @param info
       * @param isTreeOrTable  用于区分是否通过弹窗选择数据，false-联想，true-弹窗
       */
      handleSelectedChange(info, isTreeOrTable) {
        if (isTreeOrTable !== undefined && !isTreeOrTable && this.isQueryCustAcct) {
          this.$refs.custCorpMsgBox.getCustAcctList(info[0].custNo, (info) => {
            if (this.selectType === "radio") {
              info = [info];
            }
            this.$emit("custCorpChange", info);
          });
        } else {
          this.$emit("custCorpChange", info);
        }
      }
    }
  };
</script>
<style>

</style>
