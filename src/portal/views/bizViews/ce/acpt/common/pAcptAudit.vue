<template>
  <div>
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrCustNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.drwrCustNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.drwrName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.drwrAcctNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.acptProtocalNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.acptProtocalNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.remitDt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.remitDt ? this.$moment(viewDetailForm.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : ""}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.acptType')}}：</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"AcptType",viewDetailForm.acptType)
                  }}
                </h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalFee')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalFee }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalCommitFee')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalCommitFee }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.guarntrType')}}：</h-col>
                <h-col span="15" class="val">{{
                  getDictValueFromMap(this.dictMap,"GuarntrType",viewDetailForm.guarntrType) }}
                </h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>
    <div v-if="isShow">
      <h-row name="flex" class="layout-menu-wrapper" v-if="tempIsShow">
        <h-col span="24">
          <div>
            <h-datagrid
              :columns="billManagerColumns"
              url="/bm/audit/prodAuditMain/func_pageQueryAcptBillList"
              highlightRow
              :bindForm="billManagerFormItem"
              :onSelectChange="billManagerHandleRowClick"
              :rowSelect="true"
              ref="billManagerDatagrid">
              <div slot="toolbar" class="pull-left">
              </div>
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
import {formatNumber, post} from "@/api/bizApi/commonUtil";

export default {
    name: "acptAudit",
    components: {
    },
    data() {
      return {
        billManagerDetailShow: true,
        billManagerFormItem: {
          batchId: "",
          ids: ""
        },
        viewDetailForm: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNo: '',
          remitDt: "",
          acptType: '',
          totalCount: '',
          totalAmt: '',
          totalFee: '',
          totalCommitFee: '',
          guarntrType: ''
        },
        billManagerColumns: [
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: false,
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = this.$t('m.i.ce.showBillInfo');
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, "billId");
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
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
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.ce.guarntrAmt'),
            key: 'guarntrAmt',
            hiddenCol: false,
            render: (h, params) => {
              let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: guarntrAmt
                }
              }, guarntrAmt);
            }
          },
          {
            title: this.$t('m.i.ce.fee'),
            key: 'fee',
            hiddenCol: false,
            render: (h, params) => {
              let fee = formatNumber(params.row.fee, 2, ',');
              return h("span", {
                domProps: {
                  title: fee
                }
              }, fee);
            }
          },
          {
            title: this.$t('m.i.ce.commitFee'),
            key: 'commitFee',
            hiddenCol: false,
            render: (h, params) => {
              let commitFee = formatNumber(params.row.commitFee, 2, ',');
              return h("span", {
                domProps: {
                  title: commitFee
                }
              }, commitFee);
            }
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: 'pyeeAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          }
        ],
        currentSelectList: [],
        showBillInfoWin: false,
        dictMap: new Map(),
        billId: "",
        billNo: "",
      }
    },
    props: {
      isShow: {
        type: Boolean,
        default() {
          return false;
        }
      },
      listIds: "",
      batchId: ""
    },
    computed: {
      tempIsShow: {
        get() {
          return this.isShow;
        },
        set() {
        }
      }
    },
    created() {
      this.billManagerFormItem.batchId = this.batchId;
      this.billManagerFormItem.ids = this.listIds;

    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,PayType,Yon,AcptType,GuarntrType,BillOrigin").then(res => {
        this.dictMap = res.get("map");
      });
      this.getBatchInfo();
    },
    watch: {
      isShow(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.batchId;
          this.billManagerFormItem.ids = this.listIds;
        }
      }
    },
    methods: {
      //行选中
      billManagerHandleRowClick(arr) {
        this.currentSelectList = arr;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      //获取批次详细信息
      getBatchInfo() {
        post({id:this.batchId,listIds:this.listIds}, "/bm/audit/prodAuditMain/func_getAuditAcptBatch").then(res => {
          if(res) {
            let msg = res.data.retMsg
            let retCode = res.data.retCode
            if (retCode == "000000") {
              if(res.data.retData !== null) {
                this.viewDetailForm.drwrCustNo = res.data.retData.drwrCustNo;
                this.viewDetailForm.drwrName = res.data.retData.drwrName;
                this.viewDetailForm.drwrAcctNo = res.data.retData.drwrAcctNo;
                this.viewDetailForm.acptProtocalNo = res.data.retData.acptProtocalNo;
                this.viewDetailForm.remitDt = res.data.retData.remitDt;
                this.viewDetailForm.acptType = res.data.retData.acptType;
                this.viewDetailForm.guarntrType = res.data.retData.guarntrType;
                this.viewDetailForm.totalCount = res.data.retData.totalCount;
                this.viewDetailForm.totalAmt = res.data.retData.totalAmt;
                this.viewDetailForm.totalFee = res.data.retData.totalFee;
                this.viewDetailForm.totalCommitFee = res.data.retData.totalCommitFee;
                if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                  this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
                }
                if(this.viewDetailForm.totalFee !== null && this.viewDetailForm.totalFee !== ""){
                  this.viewDetailForm.totalFee = formatNumber(this.viewDetailForm.totalFee, 2, ',')
                }
                if(this.viewDetailForm.totalCommitFee !== null && this.viewDetailForm.totalCommitFee !== ""){
                  this.viewDetailForm.totalCommitFee = formatNumber(this.viewDetailForm.totalCommitFee, 2, ',')
                }
              }else {
                this.viewDetailForm.totalCount = "0";
                this.viewDetailForm.totalAmt = "0";
                this.viewDetailForm.totalFee = "0";
                this.viewDetailForm.totalCommitFee = "0";
              }
            } else {
              this.$msgTip.error(this, { info: msg });
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
