<!--表单组件，包含高级、查询和重置-->
<template>
  <h-form-item class="h-form-operate"
               :class="[formClassAdd == '1' ? 'one-form' : formClassAdd == '2' ? 'two-form' : '']">
    <span class="h-more-input" v-show='advanceShow' @click="changeShow">{{$t("m.i.common.searchAdvanced")}}<i
      class="icon iconfont"
      :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
    <h-button type="primary" @click="formSearch(searchPageNo)">{{$t("m.i.common.search")}}</h-button>
    <h-button type="ghost" @click="formSearchReset">{{$t("m.i.common.reset")}}</h-button>
  </h-form-item>
</template>

<script>
  export default {
    name: "queryBtn",
    data() {
      return {
        ifShowMore: false
      };
    },
    computed: {},
    props: {
      formSearch: {//查询事件
        type: Function,
        default() {
          return "";
        }
      },
      searchPageNo: {//查询页数
        type: Number,
        default: 1
      },
      formSearchReset: {//重置事件
        type: Function,
        default() {
          return "";
        }
      },
      advanceShow: {//是否显示高级
        type: Boolean,
        default: true
      },
      formClassAdd: {//空：不添加属性；1:一个查询条件，添加one-form属性；2：2个查询条件，添加two-form属性；
        type: String,
        default: ""
      }
    },
    methods: {
      changeShow(val) {
        this.$emit("showChange", this.ifShowMore = !this.ifShowMore);
      }
    }
  };
</script>
