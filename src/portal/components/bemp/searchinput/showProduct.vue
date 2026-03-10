<!--产品名称-->
<template>
  <div class="h-form-item-parent">
    <common-input v-model="itemValue" :label="label" :prop="prop" :required="required" @on-click="queryProduct"
                  :showIcon="showIcon" :readonly="readonly" :clearable="clearable" :clearVal="clearProduct"
                  :clearValTag="clearValTag" :class="className" :validRules="validRules">
    </common-input>
    <common-tree :commonTreeWin="showProductWin" :title="title" :url="url" :params="params" :ifcheck="ifcheck"
                 :checkStrictly="checkStrictly" :multiple="multiple" :onlyUpdateDown="onlyUpdateDown"
                 :required="isSelectRequired" :isNeedChecked="isNeedChecked" :checkedDataArr="checkedDataArr"
                 :notDeepCopy="false" @treeSelectedChange="productSelectedChange"
                 @commonTreeWinClose="productWinClose" :deepCopyForExpend="deepCopyForExpend">
    </common-tree>
  </div>
</template>
<script>
  export default {
    name: "showProduct",
    data() {
      return {
        showProductWin: false
      };
    },
    props: {
      validRules: {
        type: [Array, String]
      },
      label: {
        type: String,
        default() {
          return this.$t("m.i.common.prodName");
        }
      },
      prop: {
        type: String,
        default: "prodName"
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
        type: String,
        default: ""
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      readonly: {
        type: Boolean,
        default: true
      },
      clearable: {
        type: Boolean,
        default: true
      },
      clearProduct: {
        type: Function
      },
      clearValTag: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: "产品号选择"
      },
      url: {
        type: String,
        default: "/bm/prod/product/queryProductMaintenanceTree"
      },
      params: {//调用接口时对应参数
        type: Object,
        default() {
          return {};
        }
      },
      ifcheck: {//是否显示复选框，默认不显示
        type: Boolean,
        default: false
      },
      checkStrictly: {//父子节点是否联动，false-联动，true-不联动
        type: Boolean,
        default: false
      },
      multiple: {//是否支持多选(只支持树节点多选，与多选框无关)，false-不支持，true-支持
        type: Boolean,
        default: false
      },
      onlyUpdateDown: {//父子组件级联时是否只向下级联，不向上级联，false-向上级联，true-不向上级联
        type: Boolean,
        default: false
      },
      // notDeepCopy: {//组件data属性传入组件中变量是否随组件内部修改而修改，false-不修改，true-修改
      //   type: Boolean,
      //   default: false
      // },
      deepCopyForExpend: {//展开收缩时是否记住勾选值
        type: Boolean,
        default: true
      },
      isSelectRequired: {//点击确定按钮时是否必选，false-否，true-是
        type: Boolean,
        default: true
      },
      isNeedChecked: {//反显时是否需选中已选项
        type: Boolean,
        default: false
      },
      checkedDataArr: {//待选中数据
        type: Array,
        default() {
          return [];
        }
      }
    },
    computed: {
      itemValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("input", val);
        }
      }
    },
    methods: {
      //选择产品名称
      queryProduct() {
        this.showProductWin = true;
      },
      productWinClose() {
        this.showProductWin = false;
      },
      productSelectedChange(selectedNodes) {
        this.showProductWin = false;
        this.$emit("productSelectedChange", selectedNodes);
      }
    }
  };
</script>
<style scoped>
</style>
