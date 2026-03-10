<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.prodName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.custNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
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
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.recvAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.aoAcctNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.discDt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.discDt == null ? "" : this.$moment(viewDetailForm.discDt, "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.discInterestRate')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.ratePct }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.interestMethod')}}：</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"PayType",viewDetailForm.payType) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8" v-if="viewDetailForm.payType == '1'">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.buyerPayInterName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.payCustName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.buyerPayInterAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.payAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.buyPayPcetByUnit')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.buyPayPcet }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8" v-if="viewDetailForm.payType == '2'">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.salerCustName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.salerAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.salerPayPcet')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.salerPayPcet }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8" v-if="viewDetailForm.payType == '4'">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.thirdCustName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.thirdCustName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.thirdAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.thirdAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.thirdPayPcet')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.thirdPayPcet }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8" v-if="viewDetailForm.payType == '3'">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.buyerPayInterName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.payCustName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.buyerPayInterAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.payAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.buyPayPcetByUnit')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.buyPayPcet }}</h-col>
              </h-row>
            </h-col>


            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.salerCustName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.salerAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.salerPayPcet')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.salerPayPcet }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.sumCount }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.sumMoney }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8" v-if="viewDetailForm.payType == '1' || viewDetailForm.payType == '3'">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.sumBuyerInterest')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.sumBuyerInterest }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8" v-if="viewDetailForm.payType == '4'">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.sumThirdInterest')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.sumThirdInterest }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8" v-if="viewDetailForm.payType == '2' || viewDetailForm.payType == '3'">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.sumSellerInterest')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.sumSalerInterest }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.sumInterest')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.sumInterest }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.sumRealPayAmt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.sumRealPayAmt }}</h-col>
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
        url="/ce/disc/paper/apply/discApplyBatchMain/func_pageQueryCeDiscBillList"
        ref="discTrackBillDatagrid">
        <div slot="toolbar">
          <h-button type="primary" v-if="this.isNeedUpdDiscImg" @click="viewAuditImage">{{$t('m.i.common.showImg')}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <!-- 查看影像 -->
    <show-disc-image-search :show-upload-image-win="showUploadImageWin" :params="imageParams" @uploadImageWinClose="uploadImageWinClose"></show-disc-image-search>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "pDiscAudit",
    components: {
      ShowDiscImageSearch:() => import(/* webpackChunkName: "ce/disc/common/showDiscImageSearch" */`@/views/bizViews/ce/disc/common/showDiscImageSearch`)
    },
    data() {
      return {
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        isNeedUpdDiscImg : false,
        dictMap : new Map(),
        billFormItem : {
          batchId: "",
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
          salerPayPcet: "",
          thirdPayPcet: "",
          sumCount: "",
          sumMoney: "",
          sumBuyerInterest: "",
          sumSalerInterest: "",
          sumThirdInterest: "",
          //总实收利息
          sumInterest: "",
          //支付贴现人总金额
          sumRealPayAmt: ""
        },
        billColumns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
           title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
          },
          {
            title:this.$t("m.i.common.guideRate"),
            key:"guideRate",
            hiddenCol:true,
            render: (h, params) => {
              if (params.row.guideRate != null && params.row.guideRate !== "") {
                let rate = accMul(params.row.guideRate, 100) + "(%)";
                return h("span", rate);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
            }
          },
          {
            title: this.$t("m.i.ce.outAcctNo"),
            key: "putOutNo",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankName"),
            key: "drweBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
           title: this.$t("m.i.ce.isOwnBankAcpt"),
            key: "isAcpt",
            hiddenCol: false,
            render:(h,params) => {
              if (params.row.isAcpt == null || params.row.isAcpt === ""){
                return "";
              }
              if (params.row.isAcpt === '1') {
                return h("span", "是");
              } else {
                return h("span", "否");
              }
            }
          },
          {
            title: this.$t("m.i.ce.isSameCity"),
            key: "isSameCity",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isSameCity));
            }
          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "busiClassify",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.busiClassify);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.interestDueDt"),
            key: "galeDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.galeDt == null || params.row.galeDt === "") {
                return "";
              }
              let date = this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.interestCalDays"),
            key: "interestCalDays",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.delayDays"),
            key: "delayDays",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyerInterest"),
            key: "buyerInterest",
            hiddenCol: false,
            render: (h, params) => {
              let buyerInterest = formatNumber(params.row.buyerInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: buyerInterest
                }
              }, buyerInterest);
            }
          },
          {
            title: this.$t("m.i.ce.salerInterest"),
            key: "salerInterest",
            hiddenCol: false,
            render: (h, params) => {
              let salerInterest = formatNumber(params.row.salerInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: salerInterest
                }
              }, salerInterest);
            }
          },
          {
            title: this.$t("m.i.ce.thirdInterest"),
            key: "thirdInterest",
            hiddenCol: false,
            render: (h, params) => {
              let thirdInterest = formatNumber(params.row.thirdInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: thirdInterest
                }
              }, thirdInterest);
            }
          },
          {
            title: this.$t("m.i.ce.realPayAmt"),
            key: "realPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              let realPayAmt = formatNumber(params.row.realPayAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: realPayAmt
                }
              }, realPayAmt);
            }
          },
          {
            title: this.$t("m.i.ce.bankPayAmt"),
            key: "payAmt",
            hiddenCol: false,
            render: (h, params) => {
              let payAmt = formatNumber(params.row.payAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: payAmt
                }
              }, payAmt);
            }
          }
        ],
        //影像上传
        showUploadImageWin : false,
        imageParams : {
          listId: Number,
          prodNo: String,
          imgType: "IM20",
          queryUrl: window.LOCAL_CONFIG.API_HOME + "/bm/audit/prodAuditMain/func_paperDiscImageListPage",
          viewUrl: window.LOCAL_CONFIG.API_HOME + "/bm/audit/prodAuditMain/func_paperDiscImageById"
        },
        isCheckGuideRate:false
      };
    },
    created() {
      this.billFormItem.discIds = this.listIds;
      this.billFormItem.batchId = this.batchId;
      this.imageParams.listId = this.batchId;
      this.showCheckGuide();
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,PayType,Yon,AssetIndustry").then(res => {
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
          return "/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscBatch";
        }
      },
      auditRouteId:""
    },
    methods: {
      //显示指导利率展示列的显影
      showCheckGuide() {
        if (this.auditRouteId==null||this.auditRouteId==undefined||this.auditRouteId=="") {
          return;
        }
        post({ id: this.auditRouteId }, "/bm/audit/auditRoute/func_getAuditRouteById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData.isCheckGuideRate==="1"){
                this.isCheckGuideRate=true;
              }
              this.$refs.discTrackBillDatagrid.controlColumnsHidden("guideRate",!this.isCheckGuideRate);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      getDiscUpdImgFlag(res) {
        if (res.data.retData === '1') {
          this.isNeedUpdDiscImg = true;
        }
      },
      //查看影像
      viewAuditImage() {
        this.showUploadImageWin = true;
      },
      //影像弹窗关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
      },
      getBatchInfo() {
        //获取批次详细信息
        post({ id: this.batchId, ids: this.listIds }, this.queryBatchUrl).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData;
              if(this.viewDetailForm.payType === "1") {
                this.viewDetailForm.buyPayPcet = "100";
              }else if(this.viewDetailForm.payType === "2") {
                this.viewDetailForm.buyPayPcet = "0";
                this.viewDetailForm.salerPayPcet = "100";
              } else if(this.viewDetailForm.payType === "3") {
                console.log();
                this.viewDetailForm.salerPayPcet = 100 - this.viewDetailForm.buyPayPcet;
              } else if(this.viewDetailForm.payType === "4") {
                this.viewDetailForm.thirdPayPcet = "100";
              }
              this.imageParams.prodNo = this.viewDetailForm.prodNo;
              if (this.viewDetailForm.buyPayPcet !== null && this.viewDetailForm.buyPayPcet !== "") {
                this.viewDetailForm.buyPayPcet = this.viewDetailForm.buyPayPcet;
              }
              if(this.viewDetailForm.salerPayPcet !== null && this.viewDetailForm.salerPayPcet !== ""){
                this.viewDetailForm.salerPayPcet = this.viewDetailForm.salerPayPcet;
              }
              if(this.viewDetailForm.thirdPayPcet !== null && this.viewDetailForm.thirdPayPcet !== ""){
                this.viewDetailForm.thirdPayPcet = this.viewDetailForm.thirdPayPcet;
              }
              if (this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== "") {
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ",");
                this.viewDetailForm.sumBuyerInterest = formatNumber(this.viewDetailForm.sumBuyerInterest, 2, ",");
                this.viewDetailForm.sumSalerInterest = formatNumber(this.viewDetailForm.sumSalerInterest, 2, ",");
                this.viewDetailForm.sumInterest = formatNumber(this.viewDetailForm.sumInterest, 2, ",");
                this.viewDetailForm.sumThirdInterest = formatNumber(this.viewDetailForm.sumInterest, 2, ',');
                this.viewDetailForm.sumRealPayAmt = formatNumber(this.viewDetailForm.sumRealPayAmt, 2, ",");
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //票面信息关闭
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
