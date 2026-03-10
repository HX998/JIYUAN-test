<!-- 再贴现审批书 -->
<template>
  <div :style="{minHeight: getHeight + 'px'}">
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <h-button type="primary" @click="handleVochRePrint()">{{$t("m.i.pe.vochRePrint")}}</h-button>
        <h-button type="primary" @click="handlePrintRecord()">{{$t("m.i.pe.printRecord")}}</h-button>
        <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
      </div>
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
                <h-col span="15" class="val">{{format("RediscBusiType",viewDetailForm.busiType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">批次号:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.batchNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.rediscountApplNo')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.quoteNo}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.applBrchName')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.dealNo')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.dealNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.traderName')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleTraderName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">本方复核交易员名称:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleCheckTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.pedBrchName')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.buyBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}:</h-col>
                <h-col span="15" class="val">{{format("DraftTypeCode",viewDetailForm.billType)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billClass')}}:</h-col>
                <h-col span="15" class="val">{{format("CDMedia",viewDetailForm.billClass)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.clearType')}}:</h-col>
                <h-col span="15" class="val">{{format("ClearType",viewDetailForm.clearType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.settleMode')}}:</h-col>
                <h-col span="15" class="val">{{format("SettleType",viewDetailForm.settleMode)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.clearSpeed')}}:</h-col>
                <h-col span="15" class="val">{{format("ClearSpeed",viewDetailForm.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.firstSettleDt')}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDetailForm.firstSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.prodName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row >
                <h-col span="9" class="label">人行受理人名称:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.buyTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8" >
              <h-row >
                <h-col span="9" class="label">人行复核人名称:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.buyCheckTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8" >
              <h-row>
                <h-col span="9" class="label">人行审批人名称:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.buyApproveTraderName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8" >
              <h-row>
                <h-col span="9" class="label" >人行受理人意见:</h-col>
                <h-col span="15" class="val" >{{viewDetailForm.buyTraderNote}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8" >
              <h-row>
                <h-col span="9" class="label">人行复核意见:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.buyCheckTraderNote}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8" >
              <h-row>
                <h-col span="9" class="label">人行审批意见:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.buyApproveTraderNote}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pe.printNum')}}：</h-col>
                <h-col span="15" class="val">{{ this.printNum }}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>

    <h-msg-box v-model="printWin" width="1000" :maximize="true">
      <p slot="header">
        <span>打印记录</span>
      </p>
      <div class="h-form-search-box">
        <h-panel class="clearfix">
          <h-form :model="printForm" :label-width="90" ref="printForm" cols="3" class="h-form-search">
            <h-form-item :label="$t('m.i.pe.printDt')" prop="createTimeRange" style="width:35%;">
              <h-date-picker placeholder="" type="daterange" :editable=false v-model="printForm.createTimeRange"
                             format="yyyy-MM-dd" showFormat @on-change="handlePrintDtChange"></h-date-picker>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="printFormSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="printFormSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <h-datagrid
        :columns="printColumns"
        highlight-row
        :autoLoad="false"
        url="/pe/print/voucherPrint/voucherPrintManger/queryPrintRecord"
        :bindForm="printForm"
        ref="printgrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="printWin=!printWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "rediscountVoucherPrintDetail",
    data() {
      return {
        printObj: "",
        vochId: "",
        voucherTypeList: [],
        printNum: "",
        dictMap : new Map(),
        viewDetailForm : {
          busiType: "",
          batchNo: "",
          quoteNo: "",
          saleBrchName: "",
          dealNo: "",
          saleTraderName:"",
          saleCheckTraderName: "",
          buyBrchName: "",
          billType: "",
          billClass: "",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          firstSettleDt: "",
          prodName: "",
          buyTraderName: "",
          buyCheckTraderName: "",
          buyApproveTraderName: "",
          buyTraderNote: "",
          buyCheckTraderNote: "",
          buyApproveTraderNote: ""
        },
        //打印记录弹窗
        printWin: false,
        printForm: {
          printStartDt: "",
          printEndDT: "",
          vochId: "",
          createTimeRange: ""
        },
        printColumns: [
          {
            title: " ",
            type: "radio",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.vochId'),
            key: "vochId",
            hiddenCol: false
          }, {
            title: this.$t('m.i.pc.voucherType'),
            key: "voucherType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "VoucherType", params.row.voucherType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t('m.i.pe.printDt'),
            key: "printDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.printDt == null ? "" : this.$moment(params.row.printDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default() {
          return false;
        }
      },
      listIds: "",
      batchId: "",
      tempPrintMode: "",
      billManagerParams: {
        type: Object,
        default() {
          return {
            batchNo: "",
            busiType: "",
            voucherType: "",
            rgstDt: "",
            brchNo: ""
          };
        }
      }
    },
    watch: {
      printWin(val) {
        if (!val) {
          this.printForm.printStartDt = "";
          this.printForm.printEndDT = "";
        } else {
          this.$nextTick(() => {
            this.$refs.printgrid.selfAdaption();
          });
        }
      },
    },
    computed:{
      getHeight() {
        let appObj = document.getElementsByClassName("app-main");
        let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
        return window.innerHeight - appOffsetTop;
      }
    },
    mounted() {
      post({},"/pe/print/voucherPrint/voucherPrintManger/func_queryVouchreTypeDict").then(res=>{
        if (res) {
          if (res.data.retCode === '000000') {
            let dictList = res.data.retData;
            this.voucherTypeList = dictList;
            this.getDictListByGroups("DraftTypeCode,CDMedia,ClearType,SettleType,ClearSpeed,VoucherType").then(res => {
              this.dictMap = res.get("map");
              if (dictList && dictList.length > 0) {
                let voucherTypeMap = new Map();
                for (let i = 0; i < dictList.length; i++) {
                  voucherTypeMap.set(dictList[i].key, dictList[i].value);
                }
                this.dictMap.set("VoucherType", voucherTypeMap);
                this.formSearch();
              }
            });
          }
        }
      });
      this.getPrintNum();
    },
    methods: {
      getPrintNum() {
        post({
          "batchNo": this.billManagerParams.batchNo,
          "busiType": this.billManagerParams.busiType,
          "voucherType": this.billManagerParams.voucherType,
          "rgstDt": this.billManagerParams.rgstDt,
          "brchNo": this.billManagerParams.brchNo,
          "batchId": this.batchId
        }, "/pe/print/voucherPrint/voucherPrintManger/queryVoucherList").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (null == res.data.retData || res.data.retData.list.length === 0) {
                  this.$msgTip.error(this, { info: "未查到相应的补打数据，请确认！" });
                  return;
                }
                this.printNum = res.data.retData.list[0].printNum;
                this.printObj = res.data.retData.list[0].printObj;
                this.vochId = res.data.retData.list[0].id;
                this.getBatchInfo();
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      //获取批次详细信息
      getBatchInfo() {
        post({ id: this.batchId}, "pe/print/voucherPrint/voucherPrintManger/func_queryBatchByid").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (null == res.data.retData) {
                this.$msgTip.error(this, { info: "未查到相应的批次信息，请重新确认！" });
                return;
              }
              this.viewDetailForm = res.data.retData;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //凭证补打
      handleVochRePrint() {
        let printData = [];
        printData.push(this.printObj);
        let printNum = this.printNum;
        this.$hMsgBox.confirm({
          title: "凭证补打",
          content: "此凭证为第"+ (printNum + 1) +"次补打，请注意重复！",
          onOk: () => {
            this.$print.vouchTemplatePrint(this, {
              data: printData,
              callback: () => {
                post({
                  "batchNo": this.billManagerParams.batchNo,
                  "busiType": this.billManagerParams.busiType,
                  "voucherType": this.billManagerParams.voucherType,
                  "rgstDt": this.billManagerParams.rgstDt,
                  "brchNo": this.billManagerParams.brchNo,
                  "batchId": this.batchId
                }, "/pe/print/voucherPrint/voucherPrintManger/func_savePrintRecordInfo").then(res => {
                    if (res) {
                      let msg = res.data.retMsg;
                      let retCode = res.data.retCode;
                      if (retCode === "000000") {
                        this.getPrintNum();
                      } else {
                        this.$msgTip.error(this, { info: msg });
                      }
                    } else {
                      this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                    }
                  }
                );
              },
              closeCallback: () => {
                this.getPrintNum();
              }
            });
          }})
      },
      //打印记录
      handlePrintRecord() {
        this.printWin = true;
        this.$nextTick(() => {
          this.printForm.vochId = this.vochId;
          this.$refs.printgrid.dataChange(1);
        });
      },
      printFormSearch() {
        this.$nextTick(() => {
          this.$refs.printgrid.dataChange(1);
        });
      },
      printFormSearchReset() {
        this.printForm.printStartDt = "";
        this.printForm.printEndDT = "";
        this.$refs.printForm.resetFields();
      },
      handlePrintDtChange(arr) {
        if(arr && arr.length === 2){
          this.printForm.printStartDt = arr[0].replace(/-/g, "");
          this.printForm.printEndDT = arr[1].replace(/-/g, "");
        }else{
          this.printForm.printStartDt = "";
          this.printForm.printEndDT = "";
        }
      },
      //跳转界面返回
      returnMain() {
        this.$emit("returnMain", "");
      },
      format(groupcode, key) {
        return getDictValueFromMap(this.dictMap, groupcode, key)
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : ""
      },
    }
  }
</script>

<style scoped>

</style>
