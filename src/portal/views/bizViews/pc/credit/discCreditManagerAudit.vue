<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <h-form :model="formItem" :label-width="120" ref="formItem" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.limitType')+':'">
            {{format("LimitType",formItem.limitType)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.totalLimitAmt')+':'">
            {{formItem.totalLimitAmt}}
          </h-form-item>
          <h-form-item :label="$t('m.i.common.activeDt')+':'">
            {{formatDate(formItem.activeDt)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.common.failureDt')+':'">
            {{formatDate(formItem.failureDt)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchName')+':'">
            {{formItem.belongBrchName}}
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')+':'">
            {{formatDate(formItem.applDt)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.applTellerName')+':'">
            {{formItem.createTellerName}}
          </h-form-item>
        </h-form>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :bindForm="formItem"
        url="/pc/credit/discCreditManager/getCreditScaleList"
        :row-select="true"
        :has-select="false"
        ref="billDatagrid">
        <div slot="toolbar">
        </div>
      </h-datagrid>
    </div>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  import { formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "discCreditManagerAudit",
    data() {
      return {
        formItem: {
          id:"",
          limitType:"",
          totalLimitAmt:"",
          flowStatus:"1,2",
          belongBrchNo:"",
          belongBrchName:"",
          activeDt: "",
          failureDt: "",
          applDt: "",
          createTellerName:"",
        },
        billColumns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.pc.limitType"),
            key: "limitType",
            hiddenCol: false,
            width: 120,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "LimitType", params.row.limitType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.totalLimitAmt"),
            key: "totalLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.totalLimitAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.common.activeDt"),
            key: "activeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.failureDt"),
            key: "failureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.failureDt == null ? "" : this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "belongBrchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pe.dpstDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.applTellerName"),
            key: "createTellerName",
            hiddenCol: false
          },
        ],
        dictMap: new Map(),
        showBillInfoWin: false,
        billId: "",
        billNo: ""
      }
    },
    components: {
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: "",
      creditLimitTypeList:[],
    },
    created() {
      this.formItem.id = this.batchId;
      this.init();
    },
    mounted() {
      this.getDictListByGroups("LimitType,map").then(res => {
        this.creditLimitTypeList = res.get("LimitType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let url = "";
        if (batchId) {
          url = "/pc/credit/discCreditManager/getCreditScaleList";
        } else {
          this.$msgTip.error(this, { info: "批次ID不能为空" });
        }
        post({ id: batchId }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                this.formItem = res.data.retData.list[0];
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
    }
  };
</script>

<style scoped>

</style>
