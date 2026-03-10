<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow" key="1">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <div class="text-body">
          <h-row>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.custName")}}:</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.custNo")}}:</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.custAcctNo")}}:</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.createDt')}}:</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.getBatchDt == null ? "" : this.$moment(viewDetailForm.getBatchDt,
                  "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}:</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}:</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.pe.totalAmt")}}:</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.pe.total")}}:</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.pl.getWay")}}:</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"GetWay",viewDetailForm.getWay) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>

    <!-- 数据展示表格 -->
    <div v-if="isShow" key="2">
      <h-datagrid :columns="columns"
                  url="/pl/custody/paper/getBill/getBillTrackSearch/func_getBillInfoTrackSearch"
                  :auto-load="false"
                  :row-select="true"
                  :bindForm="formItem"
                  ref="datagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { formatNumber, getDictValueFromMap, post, on, off ,getDictListByGroups ,accMul} from "@/api/bizApi/commonUtil";


  export default {
    name: "pGetBillAudit",
    components: {
    },
    data() {
      return {
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        formItem : {
          batchId: '',
          ids: ''
        },
        dictMap : new Map(),
        viewDetailForm : {
          custName: '',
          custNo: '',
          custAcctNo: '',
          getBatchDt: '',
          billType: '',
          batchNo: '',
          totalAmt: '',
          totalCount: '',
          getWay: ''
        },
        columns : [
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
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
            key: 'dueDt',
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
           title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drweBankAddr"),
            key: 'drweBankAddr',
            hiddenCol: false,
          }
        ],
      };
    },
    created() {
      this.formItem.ids = this.listIds;
      this.formItem.batchId = this.batchId;
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,GetWay").then(res => {
        this.dictMap = res.get("map");
      });
      this.getBatchInfo();
      this.$refs.datagrid.dataChange(1);
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    methods: {
      //获取批次详细信息
      getBatchInfo() {
        let params = {
          batchId: this.batchId,
          billIds: this.listIds,
          billClass: "ME01"
        };
        post(params, "/pl/custody/paper/getBill/getBillTrackSearch/func_pageQueryGetBatchTrack").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData !== null && res.data.retData.list.length > 0) {
                this.viewDetailForm.custName = res.data.retData.list[0].custName;
                this.viewDetailForm.custNo = res.data.retData.list[0].custNo;
                this.viewDetailForm.custAcctNo = res.data.retData.list[0].custAcctNo;
                this.viewDetailForm.getBatchDt = res.data.retData.list[0].getBatchDt;
                this.viewDetailForm.billType = res.data.retData.list[0].billType;
                this.viewDetailForm.batchNo = res.data.retData.list[0].batchNo;
                this.viewDetailForm.totalAmt = res.data.retData.list[0].totalAmt;
                this.viewDetailForm.totalCount = res.data.retData.list[0].totalCount;
                this.viewDetailForm.getWay = res.data.retData.list[0].getWay;
                if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                  this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
                }
              }else {
                this.viewDetailForm.totalCount = "0";
                this.viewDetailForm.totalAmt = "0";
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
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
