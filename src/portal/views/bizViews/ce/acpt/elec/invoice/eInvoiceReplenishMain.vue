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
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustNo()" readonly></h-input>
                </h-form-item>
                <h-form-item prop="invoiceFinishFlag" :label="$t('m.i.ce.invoiceFinishFlag')">
                  <h-select v-model="formItem.invoiceFinishFlag" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="batchNoLike" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNoLike" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}
                    <i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i>
                  </span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="batchColumns"
                      highlightRow
                      url="/ce/acpt/elec/invoice/eInvoiceReplenishMain/func_queryPageInvociceReplenish"
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
        <show-cust-message :showCustMessageWin="showCustInfoWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit" ref="showCustInfo"></show-cust-message>
        <e-invoice-replenish :showInvoiceReplenishWin="invoiceReplenishWin" :batchParams="batchParams"  @invoiceReplenishFormClose="invoiceReplenishFormClose" ref="invoiceReplenishInfo"></e-invoice-replenish>
      </h-col>
    </h-row>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
import {formatNumber, formatTime, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "eInvoiceReplenishMain",
    components:{
      "e-invoice-replenish":()=>import(/* webpackChunkName: "ce/acpt/elec/invoice/eInvoiceReplenish" */`@/views/bizViews/ce/acpt/elec/invoice/eInvoiceReplenish`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      return {
        // brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        ifShowMore: false,
        showCustInfoWin: false,
        invoiceReplenishWin: false,
        YonList: [],
        acptTypeArray: [],
        billOriginList : [],
        guarntrTypeArray: [],
        currentSelectRow: [],
        syncOperMode:"",
        queryUrl: "/pc/busiLock/func_getBusiLockParam",
        dictMap: new Map(),
        formItem: {
          drwrName: '',
          invoiceFinishFlag: '',
          remitDt: '',
          acptProtocalNoLike: '',
          batchNoLike: '',
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.openBillManagerWin(params.row.id,params.row.lockUserNo)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            sortable: true,
            hiddenCol: false
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
            title:  this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.ce.acptType'),
            key: 'acptType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.guarntrType"),
            key: "guarntrType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "GuarntrType", params.row.guarntrType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.ce.totalCount'),
            key: 'totalCount',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.ce.totalAmt'),
            key: 'totalAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: totalAmt
                }
              }, totalAmt);
            }
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
        batchParams : {
          batchId: {
            type: Number
          },
          dictMap: {
            type: Map
          },
          YonList: [],
          guarntrTypeArray: [],
          acptTypeArray: []
        }
      };
    },

    mounted() {
      this.getSyncOperMode();
      this.getDictListByGroups("AcptType,Yon,GuarntrType,DraftTypeCode,BillOrigin").then(res => {
        this.YonList = res.get("Yon");
        this.acptTypeArray = res.get("AcptType");
        this.guarntrTypeArray = res.get("GuarntrType");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
        this.handleSearch();
      });
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
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
      handleDateChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },

      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },

      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.drwrName = '';
          this.formItem.invoiceFinishFlag = '';
          this.formItem.remitDt = '';
          this.formItem.ownedBrchNames = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.acptProtocalNoLike = '';
          this.formItem.batchNoLike = '';
        });
      },

      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },

      handleRowClickCancel() {
        this.currentSelectRow = [];
      },

      //查询客户信息
      queryCustNo() {
        this.showCustInfoWin = true;
      },

      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrName = info.custName;
        this.showCustInfoWin = false;
      },

      //关闭
      custCorpWinClose() {
        this.showCustInfoWin = false;
      },

      openBillManagerWin(id,lockUserNo) {
        this.batchParams.batchId = id;
        if (this.syncOperMode==='1') {
          let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
            if (lockUserNo !== userNo ) {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
              return;
            }
          }
          this.addOrDelBatchBusiLock(this.batchParams.batchId,"add");
        } else {
          this.assembleParams();
        }
      },

      //票据管理
      invoiceBillManage() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.batchId = this.currentSelectRow.id;
        if (this.syncOperMode==='1') {
          let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          let lockUserNo = this.currentSelectRow.lockUserNo;
          if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
            if (lockUserNo !== userNo ) {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
              return;
            }
          }
          this.addOrDelBatchBusiLock(this.batchParams.batchId,"add");
        } else {
          this.assembleParams();
        }
      },

      assembleParams() {
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.YonList = this.YonList;
        this.batchParams.guarntrTypeArray = this.guarntrTypeArray;
        this.batchParams.acptTypeArray = this.acptTypeArray;
        this.invoiceReplenishWin = true;
      },

      //发票后补回调关闭
      invoiceReplenishFormClose () {
        if (this.syncOperMode==='1') {
          this.addOrDelBatchBusiLock(this.batchParams.batchId,"delete");
        }
        this.invoiceReplenishWin = false;
        this.handleSearch();
        this.batchParams = {};
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
            }, "/ce/acpt/elec/apply/eAcptApplyMain/func_addBatchBusiLock").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode !== "000000") {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.handleSearch();
                } else {
                  this.assembleParams();
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            post({ id: id, lockType: "1" }, "/ce/acpt/elec/apply/eAcptApplyMain/func_deleteBatchBusiLock").then(res => {
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
