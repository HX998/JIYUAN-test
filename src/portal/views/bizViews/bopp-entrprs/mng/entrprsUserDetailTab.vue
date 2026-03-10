<!--企业平台用户明细-->
<template>
  <div>
    <div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        highlight-row
        :auto-load="false"
        :url="dataGridUrl"
        :bindForm="entrprsUserDetailFormItem"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
    </div>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "entrprsUserDetailTab",
    data() {
      return {
        dataGridUrl: "/entrprs/mng/entrprsUserDetailTab/func_getEnterpriseUserList",
        entrprsUserDetailFormItem: {
          legalNo: "",
          enterpriseId: this.entrprsParams.enterpriseId,
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.entrprs.enterprisePlatformUserNo"),
            key: "enterprisePlatformUserNo",
            hiddenCol: false,
            ellipsis: false
          },
          // {
          //   title: this.$t("s.i.entrprs.bindStatus"),
          //   key: "bindStatus",
          //   ellipsis: false,
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     let dictValue = this.getDictValueFromMap(this.dictMap, "BindStatus", params.row.bindStatus);
          //     return h("span", {
          //       domProps: {
          //         title: dictValue
          //       }
          //     }, dictValue);
          //   }
          // }
        ],
        bindStatusList : [],
        dictMap : new Map()
      };
    },
    props: {
      entrprsParams:{
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      handleSearch() {
        this.entrprsUserDetailFormItem.enterpriseId = this.entrprsParams.enterpriseId;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.entrprsUserDetailFormItem.resetFields();
      },
    },
    mounted() {
      this.$nextTick(()=>{
        this.getDictListByGroups("BindStatus").then(res => {
          this.bindStatusList = res.get("BindStatus");
          this.dictMap = res.get("map");
        });
      });
    },
    created() {
      this.entrprsUserDetailFormItem.legalNo = this.$store.getters.userInfo.legalNo
    }
  };
</script>

<style scoped>

</style>
