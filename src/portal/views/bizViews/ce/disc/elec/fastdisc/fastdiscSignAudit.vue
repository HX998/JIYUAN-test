<template>
  <div>
    <!-- 极速贴现审批信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.custNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.custName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.custAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>


        </div>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :height="350"
        :bindForm="billFormItem"
        url="/ce/disc/elec/fastdisc/discApprove/func_info"
        ref="discTrackBillDatagrid">

      </h-datagrid>
    </div>
     </div>
</template>

<script>
  import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "fastdiscSignAudit",
    components: {
    },
    data() {
      return {
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        isNeedUpdDiscImg : false,
        signStatusList : [],
        YonList : [],
        custAreaList : [],
        dictMap : new Map(),
        billFormItem : {
          id: "",
          discIds: ""
        },
        viewDetailForm : {
          prodNo: "",
          billType: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          aoAcctNo: "",
          discDt: "",
          rate: "",
          payType: "",
          payCustName: "",
          payAcctNo: "",
          buyPayPcet: "",
          sumCount: "",
          sumMoney: "",
          sumBuyerInterest: "",
          sumSalerInterest: "",
          //总实收利息
          sumInterest: "",
          //支付贴现人总金额
          sumRealPayAmt: ""
        },
        billColumns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.signBrchName"),
            key: "signBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.signStatus"),
            key: "signStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FDiscSignStatus", params.row.signStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.signChannel"),
            key: "channelName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.ce.signApplyDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt;
              if (!!params.row.applDt) {
                date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.signApplyTm"),
            key: "applTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let time = params.row.applTm;
              if (!!params.row.applTm) {
                let transTm = params.row.applTm.toString();
                if (transTm.length < 6) {
                  for (let i = 0; i < (6 - transTm.length); i++) {
                    transTm = "0" + transTm;
                  }
                }
                time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              }
              return h("span", time);
            }
          },
          {
            title: this.$t("m.i.ce.applSignEnableDt"),
            key: "applActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applActiveDt;
              if (!!params.row.applActiveDt) {
                date = this.$moment(params.row.applActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.applSignDueDt"),
            key: "applFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applFailureDt;
              if (!!params.row.applFailureDt) {
                date = this.$moment(params.row.applFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignEnableDt"),
            key: "actualActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualActiveDt;
              if (!!params.row.actualActiveDt) {
                date = this.$moment(params.row.actualActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignDueDt"),
            key: "actualFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualFailureDt;
              if (!!params.row.actualFailureDt) {
                date = this.$moment(params.row.actualFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.adjustRate"),
            key: "adjustRate",
            hiddenCol: false,
            render: (h, params) => {
              let  adjustRate = formatNumber(accMul(params.row.adjustRate, 100), 4, ",");
              return h("span", adjustRate);
            }
          },
          {
            title: this.$t("m.i.ce.limitAmt"),
            key: "limitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let limitAmt = formatNumber(params.row.limitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitAmt
                }
              }, limitAmt);
            }
          },
          {
            title: this.$t("m.i.ce.discInBrchName"),
            key: "discInBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.isBargain"),
            key: "isBargain",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isBargain);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.bargainRate"),
            key: "bargainRate",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let  bargainRate = formatNumber(accMul(params.row.bargainRate, 100), 4, ",");
              return h("span", bargainRate);
            }
          },
          {
            title: this.$t("m.i.ce.isLimitFdiscSum"),
            key: "isLimitFdiscSum",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isLimitFdiscSum);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.everydayFdiscSum"),
            key: "everydayFdiscSum",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t('m.i.ce.industryCategory'),
            key: "industryCategory",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "IndustryCategoryDetail", params.row.industryCategory);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.inCustManagerNo"),
            key: "custMgrNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.inCustManagerName"),
            key: "custMgrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.custArea"),
            key: "custArea",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CustArea", params.row.custArea);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.remark"),
            key: "acceptRemark",
            hiddenCol: false,
            sortable: true
          }
        ],
        //影像上传
      };
    },
    created() {
      this.billFormItem.discIds = this.listIds;
      this.billFormItem.id = this.batchId;
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,PayType,Yon,IndustryCategoryDetail,FDiscSignStatus,CustArea").then(res => {
        this.signStatusList = res.get("FDiscSignStatus");
        this.YonList = res.get("Yon");
        this.custAreaList = res.get("CustArea");
        this.dictMap = res.get("map");
      });

      getBusinessParameter({paramKey:'ce.disc.is_paper_need_upload_img'}, this.getDiscUpdImgFlag);
      this.getBatchInfo();

    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: "",
      queryBatchUrl: {
        type: String,
        default() {
          return "/ce/disc/elec/fastdisc/discApprove/func_info";
        }
      }
    },
    methods: {

      getBatchInfo() {
        //获取批次详细信息
        post({ id: this.batchId, ids: this.listIds }, this.queryBatchUrl).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData.list[0];
              let obj = res.data.retData.list;
              if (obj[0].signStatus === "FD03" || obj[0].signStatus === "FD04") {
                this.$nextTick(() => {
                  this.$refs.discTrackBillDatagrid.controlColumnsHidden("actualActiveDt", true);
                  this.$refs.discTrackBillDatagrid.controlColumnsHidden("actualFailureDt", true);
                  this.$refs.discTrackBillDatagrid.controlColumnsHidden("acceptRemark", true);
                });
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });


      },
      // showDt(){
      //   post({  id: this.batchId, ids: this.listIds}, "/ce/disc/elec/fastdisc/discApprove/func_info").then(res => {
      //     if (res) {
      //       let retCode = res.data.retCode;
      //       if (retCode === "000000") {
      //
      //       } else {
      //         this.$msgTip.error(this, { info: res.data.retMsg });
      //       }
      //     } else {
      //       this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
      //     }
      //   });
      //
      // }


    },


  }
</script>

<style scoped>

</style>
