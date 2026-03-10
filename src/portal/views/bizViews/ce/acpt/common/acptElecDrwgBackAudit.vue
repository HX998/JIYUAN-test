<template>
  <div>
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.sumMoney')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
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
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
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
          ids: ""
        },
        viewDetailForm: {
          totalCount: '',
          totalAmt: '',
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
                    this.showBillInfo(params.row.billId, "billId", params.row.billRangeStart, params.row.billRangeEnd);
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
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: 'pyeeBankNo',
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
        billRangeStart: '',
        billRangeEnd: '',
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
      this.billManagerFormItem.ids = this.listIds;
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,PayType,Yon,AcptType,GuarntrType").then(res => {
        this.dictMap = res.get("map");
      });
      this.getBatchInfo();
    },
    watch: {
      isShow(val) {
        if (val) {
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
      showBillInfo(info, type, billRangeStart, billRangeEnd) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
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
                this.viewDetailForm.totalCount = res.data.retData.totalCount;
                this.viewDetailForm.totalAmt = res.data.retData.totalAmt;
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
    }
  };
</script>

<style scoped>

</style>
