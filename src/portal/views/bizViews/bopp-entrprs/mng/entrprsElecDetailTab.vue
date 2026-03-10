<!--企业电票账户明细-->
<template>
  <div>
    <h-form :model="entrprsElecDetailFormItem" :label-width="90" ref="entrprsElecDetailFormItem" cols="4" class="h-form-search">
      <common-input v-model="entrprsElecDetailFormItem.enterpriseElecBankNo" :label="$t('s.i.entrprs.enterpriseElecBankNo')"
                    class="h-form-long-label" prop="enterpriseElecBankNo" :maxlength=12></common-input>
      <common-input v-model="entrprsElecDetailFormItem.enterpriseElecAcctNo" :label="$t('s.i.entrprs.enterpriseElecAcctNo')"
                    prop="enterpriseElecAcctNo" :maxlength=32></common-input>
      <common-select v-model="entrprsElecDetailFormItem.bindStatus" :dictList="this.bindStatusList"
                     :label="$t('s.i.entrprs.operationStatus')" prop="bindStatus"></common-select>
      <query-btn :formSearch="handleSearch" :formSearchReset="resetSearch" :advanceShow='false'></query-btn>
    </h-form>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      :auto-load="false"
      :url="dataGridUrl"
      :bindForm="entrprsElecDetailFormItem"
      ref="datagrid">
      <div slot="toolbar" class="pull-left">
      </div>
    </h-datagrid>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "entrprsElecDetailTab",
    data() {
      return {
        dataGridUrl: "/entrprs/mng/entrprsElecDetailTab/func_getEnterpriseElecList",
        entrprsElecDetailFormItem: {
          legalNo: "",
          enterpriseId: this.entrprsParams.enterpriseId,
          enterpriseElecBankNo: "",
          enterpriseElecAcctNo:"",
          bindStatus:""
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
            title: this.$t("s.i.entrprs.enterpriseElecOrgName"),
            key: "enterpriseElecBankName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("s.i.entrprs.enterpriseElecBankNo"),
            key: "enterpriseElecBankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("s.i.entrprs.enterpriseElecAcctNo"),
            key: "enterpriseElecAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("s.i.entrprs.enterpriseElecAcctName"),
            key: "enterpriseElecAcctName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("s.i.entrprs.operationStatus"),
            key: "bindStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BindStatus", params.row.bindStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.entrprs.signType"),
            key: "signType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SignType", params.row.signType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.entrprs.errorMsg"),
            key: "errorMsg",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        bindStatusList : [],
        signTypeList: [],
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
        this.entrprsElecDetailFormItem.enterpriseId = this.entrprsParams.enterpriseId;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.entrprsElecDetailFormItem.resetFields();
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.getDictListByGroups("BindStatus,SignType").then(res => {
          this.bindStatusList = res.get("BindStatus").filter(item => item.key !== 'AL04');
          this.signTypeList = res.get("SignType");
          this.dictMap = res.get("map");
        });
      });
    },
    created() {
      this.entrprsElecDetailFormItem.legalNo = this.$store.getters.userInfo.legalNo
    }
  };
</script>

<style scoped>

</style>
