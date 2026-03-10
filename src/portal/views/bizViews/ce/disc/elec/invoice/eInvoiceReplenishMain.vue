<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div >
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWin = true" v-if="this.licenseFlag"></own-brch-nos>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <cust-name :formItem = "formItem" @queryCustMessage="queryCustMessage"></cust-name>
                <invoice-finish-flag :formItem = "formItem" :youList="youList"></invoice-finish-flag>
                <ce-disc-dt :formItem = "formItem"></ce-disc-dt>
                <batch-no v-model="formItem.batchNo"></batch-no>
                <query-btn  v-on:showChange="showQry"  :advanceShow='true' :formSearch='handleSearch' :formSearchReset='resetSearch'> </query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="batchColumns"
                      highlightRow
                      url="/ce/disc/elec/invoice/eInvoiceReplenishMain/func_queryPageInvociceReplenish"
                      :bindForm="formItem"
                      :auto-load="false"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="invoiceBillManage()" >{{$t('m.i.ce.billManage')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <e-invoice-replenish :showEDiscInvoiceWin="showEDiscInvoiceWin" :discBatchId="discBatchId" :licenseFlag="licenseFlag" @eDiscInvoiceWinClose="eDiscInvoiceWinClose"></e-invoice-replenish>
      </h-col>
    </h-row>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups,getBusinessParameter,getDictValueFromMap , formatNumber,accMul,formatTime } from "@/api/bizApi/commonUtil";

  export default {
    name: "eInvoiceReplenishMain",

    components:{
      "e-invoice-replenish":()=>import(/* webpackChunkName: "ce/disc/elec/invoice/eInvoiceReplenish" */`@/views/bizViews/ce/disc/elec/invoice/eInvoiceReplenish`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },

    data() {
      return {
        //brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        showCustMessageWin : false,
        showEDiscInvoiceWin: false,
        ifShowMore : false,
        discBatchId : '',
        youList : [],
        currentSelectRow: [],
        syncOperMode:"",
        queryUrl: "/pc/busiLock/func_getBusiLockParam",
        dictMap : new Map(),
        formItem : {
          custName: "",
          invoiceFinishFlag: "",
          discDt: "",
          batchNo: "",
          billClass: 'ME02',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        batchColumns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.batchNoMain(params.row.id,params.row.lockUserNo)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t('m.i.ce.invoiceAfterFlag'),
            key: 'invoiceAfterFlag',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"Yon",params.row.invoiceAfterFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.ce.forceInvoiceFlag'),
            key: 'forceInvoiceFlag',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"Yon",params.row.forceInvoiceFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.ce.invoiceFinishFlag'),
            key: 'invoiceFinishFlag',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"Yon",params.row.invoiceFinishFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.discDt == null || params.row.discDt === ""){
                return "";
              }
              let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.totalCount"),
            key: "sumCount",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.totalAmt"),
            key: "sumMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.sumMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.interestMethod"),
            key: "payType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"PayType",params.row.payType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.ce.salerCustName"),
            key: "salerCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.salerAcctNo"),
            key: "salerAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyPayPcetByUnit"),
            key: "buyPayPcet",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyerPayInterName"),
            key: "payCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.buyerPayInterAcctNo"),
            key: "payAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdPayPcet"),
            key: "thirdPayPcet",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdCustName"),
            key: "thirdCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.thirdAcctNo"),
            key: "thirdAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.transCtrctNo"),
            key: "transCtrctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.busiBrchName"),
            key: "busiBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.corpScale"),
            key: "corpScale",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"CorpScale",params.row.corpScale);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.common.isGreenCorp"),
            key: "isGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isGreenCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.ce.lockUserNo"),
            key: "lockUserNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.lockBrchName"),
            key: "lockBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.lockTm"),
            key: "lockTm",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.lockTm == null || params.row.lockTm === "" ||params.row.lockTm === 0) {
                return "";
              }
              let lockTm = formatTime(this,params.row.lockTm);
              return h("span", lockTm);
            }
          },
        ],
      };
    },

    mounted() {
      this.getSyncOperMode();
      this.getDictListByGroups("DraftTypeCode,Yon,PayType,CorpScale").then(res => {
        this.youList = res.get("Yon");
        this.dictMap = res.get("map");
        this.handleSearch();
      });

      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },

    methods: {
     /* //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },*/
      getSyncOperMode() {
        let url = this.queryUrl;
        post({},url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.syncOperMode = res.data.retMsg;
                if (this.syncOperMode==='1') {
                  this.$refs.datagrid.controlColumnsHidden("lockUserNo", false);
                  this.$refs.datagrid.controlColumnsHidden("lockBrchName", false);
                  this.$refs.datagrid.controlColumnsHidden("lockTm", false);
                } else {
                  this.$refs.datagrid.controlColumnsHidden("lockUserNo", true);
                  this.$refs.datagrid.controlColumnsHidden("lockBrchName", true);
                  this.$refs.datagrid.controlColumnsHidden("lockTm", true);
                }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      //查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },

      //重置查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.custName = "";
          this.formItem.invoiceFinishFlag = "";
          this.formItem.discDt = "";
          this.formItem.batchNo = "";
          this.formItem.ownedBrchNames="";
          this.formItem.ownedBrchNos=""
        });
      },

      showQry(val){
        this.ifShowMore = val;
      },

      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },

      handleRowClickCancel() {
        this.currentSelectRow = [];
      },

      //查询客户信息
      queryCustMessage(){
        this.showCustMessageWin = true;
      },

      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custName = info.custName;
        this.showCustMessageWin = false;
      },

      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },

      //批次编号超链接
      batchNoMain(str,lockUserNo) {
        this.discBatchId = str;
        if (this.syncOperMode==='1') {
          let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
            if (lockUserNo !== userNo ) {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
              return;
            }
          }
          this.addOrDelBatchBusiLock(this.discBatchId,"add");
        } else {
          this.showEDiscInvoiceWin = true;
        }
      },

      //票据管理
      invoiceBillManage() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.discBatchId = this.currentSelectRow.id;
        if (this.syncOperMode==='1') {
          let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          let lockUserNo = this.currentSelectRow.lockUserNo;
          if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
            if (lockUserNo !== userNo ) {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
              return;
            }
          }
          this.addOrDelBatchBusiLock(this.discBatchId,"add");
        } else {
          this.showEDiscInvoiceWin = true;
        }
      },

      eDiscInvoiceWinClose() {
        if (this.syncOperMode==='1') {
          this.addOrDelBatchBusiLock(this.discBatchId,"delete");
        }
        this.showEDiscInvoiceWin = false;
        this.discBatchId = "",
        this.handleSearch();
      },
      addOrDelBatchBusiLock(id,type) {
          let lockUserNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          let lockBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
          if (type === "add") {
            post({
              id: id,
              lockType: "0",
              lockUserNo: lockUserNo,
              lockBrchName: lockBrchName
            }, "/ce/disc/elec/apply/eAcptApplyMain/func_addBatchBusiLock").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode !== "000000") {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.handleSearch();
                } else {
                  this.showEDiscInvoiceWin = true;
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            post({ id: id, lockType: "1" }, "/ce/disc/elec/apply/eAcptApplyMain/func_deleteBatchBusiLock").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode !== "000000") {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
      },
    }


  };
</script>

<style scoped>

</style>
