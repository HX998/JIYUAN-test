<template>
  <div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="columns"
        highlight-row
        :bindForm="formItem"
        url="/bm/prod/guideRate/guideRateMain/func_queryProductGuideRateHisByPage"
        :row-select="true"
        :has-select="false"
        ref="datagrid">
        <div slot="toolbar">
        </div>
      </h-datagrid>
    </div>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "guideRateAudit",
    data() {
      return {
        formItem: {
          ids:""
        },
        viewDetailForm:{
          sumAmt:"",
          totalNum:""
        },
        columns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.channelNameArray"),
            key: "channelNameArray",
            sortable: true,
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
            }
          }
        ],
        dictMap: new Map(),
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        sysParam: false,
        prodMap: new Map(),
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
    },
    created() {
      this.formItem.ids = this.listIds;
    },
    mounted() {
      this.getDictListByGroups("RiskOperStatus,DraftTypeCode,CDMedia,bankLevel,bankType,CorpScale,Yon").then(res => {
        this.operStatusList = res.get("RiskOperStatus");
        this.dictMap = res.get("map");
      });
      this.getParamInfo();
      this.getBatchInfo();
    },
    methods: {
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      //  初始获取信息
      getBatchInfo() {
        let ids = this.listIds;
        let url = "";
        if (ids) {
          url = "/bm/prod/guideRate/guideRateMain/func_queryProductGuideRateHisByPage";
        } else {
          this.$msgTip.error(this, { info: "明细ID不能为空" });
        }

        post(this.formItem, url).then(result => {
          if (result && result.data) {
            let productNoParam = result.data.retData.list[0].prodNo;
            let channelNoArray = result.data.retData.list[0].channelNoArray;
            //判断是否添加渠道字段
            this.columns.splice(3,0,{
              title: this.$t("m.i.common.channelNameArray"),
              key: "channelNameArray",
              sortable: true,
              hiddenCol: !this.isChannelMode(productNoParam)
            });
            post({ prodNo: productNoParam,channelNoArray:channelNoArray }, "/bm/prod/guideRate/rateTemplate/func_queryProductRateKpi").then(res => {
              if (res && res.data) {
                let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];

                for (let item of data) {
                  if (item.kpiCode === "isGreenCorp") {
                    this.columns.push({
                      title: this.$t('m.i.common.isGreenCorpFdisc'),
                      key: "isGreenCorp",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp));
                      }
                    });
                  }
                  if (item.kpiCode === "isArc") {
                    this.columns.push({
                      title: this.$t('m.i.common.isArcFdisc'),
                      key: "isArc",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", this.getDictValueFromMap(this.dictMap, "Yon", params.row.isArc));
                      }
                    });
                  }
                  if (item.kpiCode === "billClass") {
                    this.columns.push({
                      title: this.$t('m.i.billInfo.billClass'),
                      key: "billClass",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass));
                      }
                    });
                  }
                  if (item.kpiCode === "acptBankLevel") {
                    this.columns.push({
                      title: this.$t('m.i.billInfo.acptTopBankLevel'),
                      key: "acptBankLevel",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", this.getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevel));
                      }
                    });
                  } else if(item.kpiCode === "acptBankType"){
                    this.columns.push({
                      title: this.$t('m.i.billInfo.acptBankType'),
                      hiddenCol: false,
                      key: "acptBankType",
                      render: (h, params) => {
                        return h("span", this.getDictValueFromMap(this.dictMap, "bankType", params.row.acptBankType));
                      }
                    });
                  } else if (item.kpiCode === "discBankLevel") {
                    this.columns.push({
                      title: "贴现行级别",
                      key: "discBankLevel",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", this.getDictValueFromMap(this.dictMap, "bankLevel", params.row.discBankLevel));
                      }
                    });
                  } else if (item.kpiCode === "corpType") {
                    this.columns.push({
                      title: this.$t('m.i.common.corpScale'),
                      key: "corpType",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", this.getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpType));
                      }
                    });
                  } else if (item.kpiCode === "billMoney") {
                    this.columns.push({
                      title: "最小票面金额(元)",
                      key: "minBillAmt",
                      hiddenCol: false
                    }, {
                      title: "最大票面金额(元)",
                      key: "maxBillAmt",
                      hiddenCol: false
                    });
                  } else if (item.kpiCode === "remainDays") {
                    this.columns.push({
                      title: "最小剩余期限(天)",
                      key: "minResidualTerm",
                      hiddenCol: false
                    }, {
                      title: "最大剩余期限(天)",
                      key: "maxResidualTerm",
                      hiddenCol: false
                    });
                  } else if (item.kpiCode === "remainMonths") {
                    this.columns.push({
                      title: "最小剩余跨月数量(月)",
                      key: "minResidueMonthNum",
                      hiddenCol: false
                    }, {
                      title: "最大剩余跨月数量(月)",
                      key: "maxResidueMonthNum",
                      hiddenCol: false
                    });
                  }
                }
              }
              this.columns.push({
                title: "指导利率(%)",
                key: "ratePct",
                sortable: true,
                hiddenCol: false
              });
              this.getSysParamShowRateDetail();
              this.$refs.datagrid.dataChange(1);
            });
          }
        });
      },

      getSysParamShowRateDetail() {
        if (this.sysParam) {
          this.columns.push(
            {
              title: "成本利率(%)",
              key: "costRatePct",
              hiddenCol: false
            }
          );
        }
      },


      getParamInfo() {
        post({}, "/bm/prod/guideRate/getParamValues").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              let list = res.data.retData;
              if (list.costRateBoolean == true) {
                this.sysParam = true;
              }
            }
          }
        });
      },
      //判断是否是渠道模式
      isChannelMode(prod){
        this.prodMap.set("010612",true);
        return this.prodMap.get(prod);
      },
    }
  };
</script>

<style scoped>

</style>
