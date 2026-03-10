<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item  :label="$t('m.i.common.acctDt')"  prop="acctDate">
                  <h-date-picker type="daterange" v-model="formItem.acctDate" format="yyyy-MM-dd" showFormat
                                 placeholder="" @on-change="handleAcctDateChange"></h-date-picker>
                </h-form-item>
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"
                             title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                </show-branch>
                <h-form-item :label="$t('m.i.common.foreFlowNo')" prop="foreFlowNo">
                  <h-input v-model="formItem.foreFlowNo"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pc.sumInterestMoney')" class="h-form-long-label">
                    <h-input v-model="sumBillMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item  :label="$t('m.i.pc.total')">
                    <h-input v-model="counts" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/acct/provision/querySumProvision"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showJiTi">{{$t("m.i.pc.showJiTi")}}</h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <h-msg-box maximize v-model="showProvisionDetil" width=1000>
      <p slot="header">
        <span>查看计提明细</span>
      </p>
      <h-datagrid
        :columns="jitimingxicolumns"
        :autoLoad="autoLoad"
        url="/pc/acct/provision/provisionSumSearch/func_queryProvisionCurrently"
        :bindForm="whichSelect"
        ref="datagrid1">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>

    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo":billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>
<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "provisionSumSearch",
    components: {

    },
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        dictMap : new Map(),
        jitimingxicolumns : [
          {
            type: "selection",
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 50,
            hiddenCol: false
          },
          {
            key: "acctDt",
            title: this.$t("m.i.common.acctDt"),
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.acctDt ? this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-")
            },
          },
          {
            key: "provisionType",
            title:this.$t("m.i.pc.provisionType"),
            hiddenCol: false,
            render: (h, params) => {
              switch (params.row.provisionType) {
                case '1': return h('span', '贴现余额');
                case '2': return h('span', '转入余额');
                case '3': return h('span', '质押式逆回购余额');
                case '4': return h('span', '买断式逆回购余额');
                case '5': return h('span', '质押式正回购余额');
                case '6': return h('span', '买断式正回购余额');
                case '8': return h('span', '再贴现回购余额');
                case '9': return h('span', '非交易过户余额');
              }
              return h('span', '')
            },
          },
          {
            key: 'brchName',
            title: this.$t('m.i.common.brchName'),
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
              if (params.row.billOrigin===dictValue) {
                dictValue='-';
              }
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            key: "billNo",
            title: this.$t("m.i.billInfo.billPackageNo"),
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.billInfo.billPackageMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.billMoney, 2, ','))
              ]);
            }
          },
          {
            key: "currentInterest",
            title: this.$t("m.i.pc.currentInterest"),
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.currentInterest, 2, ','))
            },
          },
          {
            key: 'drSubjectNo',
            title: this.$t("m.i.pc.drSubjectNo"),
            hiddenCol: false
          },
          {
            key: 'crSubjectNo',
            title: this.$t("m.i.pc.crSubjectNo"),
            hiddenCol: false
          },
          {
            key: 'backFlowNo',
            title:this.$t("m.i.common.backFlowNo"),
            hiddenCol: false
          },
          {
            key: "isAcctSuccess",
            title: this.$t('m.i.common.status'),
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.isAcctSuccess);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        columns : [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 50,
            hiddenCol: false
          },
          {
            key: "acctDt",
            title: this.$t("m.i.common.acctDt"),
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.acctDt ? this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-")
            },
          },
          {
            key: 'brchName',
            title: this.$t('m.i.common.brchName'),
            sortable: true,
            hiddenCol: false
          },
          {
            key: "foreFlowNo",
            title: this.$t('m.i.common.foreFlowNo'),
            hiddenCol: false,
          },
          {
            key: "sumCurrentInterest",
            title:  this.$t('m.i.pc.sumCurrentInterest'),
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.sumCurrentInterest, 2, ','))
            },
          },
          {
            key: "countBill",
            title:this.$t('m.i.pc.total'),
            hiddenCol: false,
          },
          {
            key: 'drSubjectNo',
            title: this.$t('m.i.pc.drSubjectNo'),
            hiddenCol: false
          },
          {
            key: 'crSubjectNo',
            title:this.$t('m.i.pc.crSubjectNo'),
            hiddenCol: false
          },
        ],
        formItem : {
          acctDate:"",
          minAcctDt:"",
          maxAcctDt:"",
          brchNos:"",
          branchName:"",
          foreFlowNo:"",
        },
        // 机构树
        branchList : [],
        showMessageBox : false,
        messageBoxData : [],
        brchNosOrprodNos : false,
        messageBoxTitle : '',
        checkedbrchNosName : '',
        checkedbrchs : [],
        checkedprodNos : '',
        type : null,
        showProvisionDetil : false,
        showmsgBox : false,
        //选择的机构号集合
        selectList : [],
        //表格内选中的数据的id号
        whichSelect : {
          acct_id: ''
        },
        wanttosave : [],
        productTreeData : [],
        selectData : null,
        isDisabled : true,
        ifShowMore : false,
        showcheckbox : false,
        autoLoad : false,
        sumBillMoney : "",
        counts : "",
        balanceRegisterDate : {rows:[],total:1},
      };
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    },
    mounted() {
      this.getProvisionSumSearch();
      this.getDictListByGroups("AcctFlag,BillOrigin").then(res => {
        this.acctStatusList = res.get("AcctFlag");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
        showBillInfo(row) {
            this.billId = row.billId;
            this.billNo = row.billNo;
            this.billRangeStart = row.billRangeStart;
            this.billRangeEnd = row.billRangeEnd;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      //计提明细按钮点击事件
      showJiTi() {
        this.wanttosave = this.selectData;
        if (this.wanttosave) {
          this.showProvisionDetil = true;
          this.$nextTick(() => {
            this.whichSelect.acct_id = this.wanttosave.acctId;
            this.$refs.datagrid1.dataChange(1);
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      getProvisionSumSearch() {
        let obj = Object.assign({}, this.formItem);
        let url = "/pc/acct/provision/queryStockSumProvision";
        post(obj, url).then(res => {
            if (res) {
              this.counts = res.data.counts;
              this.sumBillMoney = formatNumber(res.data.sumBillMoney, 2, ",");
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      handleAcctDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minAcctDt = arr[0].replace(/-/g, "");
          this.formItem.maxAcctDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minAcctDt = "";
          this.formItem.maxAcctDt = "";
        }
      },
      //查询点击事件
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        //设置清单导出时所需的查询条件
        this.getProvisionSumSearch();
        this.$refs.datagrid.dataChange(1);
      },
      //表单重置事件
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.$refs.formItem.resetFields();
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      }
    }
  };

</script>
