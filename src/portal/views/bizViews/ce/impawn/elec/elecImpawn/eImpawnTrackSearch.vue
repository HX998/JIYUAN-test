<!--电票质押跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')" :title="formItem.ownedBrchNames" ></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNo" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="impawnDt" :label="$t('m.i.ce.impawnDt')">
                  <h-date-picker type="date" v-model="formItem.impawnDt" placeholder="" showFormat
                                 :editable=false @on-change="handleImpawnDtChange"></h-date-picker>
                </h-form-item>
                <!--票据来源：下拉框-->
<!--                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">-->
<!--                  <h-select v-model="formItem.billOrigin" placeholder="">-->
<!--                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>-->
<!--                  </h-select>-->
<!--                </h-form-item>-->
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/impawn/elec/elecImpawn/eImpawnTrackSearch/func_queryImpawnBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billDetail()">{{$t('m.i.ce.billManage')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <impawn-track-search :billManagerVue="billManagerVue" :impawnBillParams="impawnBillParams" :batchInfoShowVue=true
                         @returnTrackSearchMain="returnTrackSearchMain"></impawn-track-search>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "eImpawnTrackSearch",
    components: {
      ImpawnTrackSearch:()=>import(/* webpackChunkName: "ce/impawn/elec/elecImpawn/eImpawnTrackSearchBill" */`@/views/bizViews/ce/impawn/elec/elecImpawn/eImpawnTrackSearchBill`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 60
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
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
           title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    this.openBillManagerWin(params.row.id)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
         title: this.$t("m.i.common.custName"),
          key: "custName",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.custNo"),
          key: "custNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
         title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.impawnCtrctNo"),
          key: "transCtrctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        // {
        //   title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
        //   key: "billOrigin",
        //   hiddenCol: false,
        //   render: (h, params) => {
        //     let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
        //     return h("span", {
        //       domProps: {
        //         title: dictValue
        //       }
        //     }, dictValue);
        //   }
        // },
        {
          title: this.$t("m.i.ce.impawnDt"),
          key: "impawnDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.impawnDt == null || params.row.impawnDt === "") {
              return "";
            }
            let date = this.$moment(params.row.impawnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.common.custMgrName"),
          key: "custMgrName",
          ellipsis: false,
          hiddenCol: false
        },
        {
         title: this.$t("m.i.ce.sumCount"),
          key: "sumCount",
          ellipsis: false,
          hiddenCol: false
        },
        {
        title: this.$t("m.i.ce.totalAmt"),
          key: "sumMoney",
          sortable: true,
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let sumMoney = formatNumber(params.row.sumMoney, 2, ",");
            return h("span", {
              domProps: {
                title: sumMoney
              }
            }, sumMoney);
          }
        }
      ];
      return {
        ifShowMore: false,
        formItem: {
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:this.$store.getters.userInfo.brchName,
          ownedBrchNos:this.$store.getters.userInfo.brchNo,
          authPath:this.$route.path ,
          billClass: "ME02",
          custNo: "",
          custName: "",
          batchNo: "",
          impawnDt: "",
          dueDt: "",
          queryFlag: "0",
          billOrigin: "",
        },
        columns: columns,
        cloneColumns: deepClone(columns),
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        // brchNoWin : false,
        currentSelectRow: [],
        mainVue: true,
        billManagerVue: false,
        showCustMessageWin: false,
        dictMap: new Map(),
        impawnBillParams: {},
        // isPartExchange: false,
        billOriginList: [],
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,ImpawnRgstStatus,BillOrigin").then(res => {
        this.dictMap = res.get("map");
        this.billOriginList = res.get("BillOrigin");
      });
      this.getParams();
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let  columns = [];
            if (this.licenseFlag) {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.cloneColumns = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      handleRemitDtChange(value) {
        this.formItem.impawnDt = value.replace(/-/g, "");
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
          this.formItem.custName = "";
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.formItem.impawnDt = this.formItem.impawnDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.batchNo = "";
        this.formItem.impawnDt = "";
        this.formItem.dueDt = "";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      billDetail() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.impawnBillParams.batchId = this.currentSelectRow.id;
        this.assembleParams();
      },
      //返回主页面
      returnTrackSearchMain() {
        this.currentSelectRow = [];
        this.formItem.impawnDt = this.formItem.impawnDt.replace(/-/g, "");
        this.mainVue = true;
        this.billManagerVue = false;
        this.impawnBillParams = {};
        this.$nextTick(() => {
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      },
      //点击批次编号超链接
      openBillManagerWin(batchId) {
        this.impawnBillParams.batchId = batchId;
        this.assembleParams();
      },
      assembleParams() {
        this.impawnBillParams.dictMap = this.dictMap;
        this.impawnBillParams.billClass = this.formItem.billClass;
        this.impawnBillParams.accountType = "impawn";
        this.impawnBillParams.billOriginList = this.billOriginList;
        this.mainVue = false;
        this.billManagerVue = true;
      },
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
      },
      brchNoWinOpen() {
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
      getParams(){
        if (this.$route.path === "/ce/impawn/elec/elecImpawn/eImpawnTrackSearch") {
          if (this.$route.query.dueDt) {
            this.formItem.dueDt = this.$moment(this.$route.query.dueDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      }
    },
    watch: {
      "$route": "getParams"
    },
  };
</script>

<style scoped>

</style>
