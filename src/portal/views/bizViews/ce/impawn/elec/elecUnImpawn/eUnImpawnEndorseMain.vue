<!--电票解质押背书-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <h-col span="24">
        <!-- 主页面 -->
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')" :title="formItem.ownedBrchNames" ></h-input>
                </h-form-item>-->
                <h-form-item prop="isCommit" :label="$t('m.i.common.status')+'：'">
                  <h-radio-group v-model="formItem.isCommit">
                    <h-radio label="noCommit" @on-click="noCommitButton">
                      <span>未背书</span>
                    </h-radio>
                    <h-radio label="hasCommit" @on-click="hasCommitButton">
                      <span>已背书</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
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
                <h-form-item prop="unImpawnDt" :label="$t('m.i.common.unImpawnDt')">
                  <h-date-picker type="date" v-model="formItem.unImpawnDt" placeholder="" @on-change="handleDateChange"
                                 showFormat :editable=false></h-date-picker>
                </h-form-item>

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
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/impawn/elec/elecUnImpawn/eUnImpawnEndorseMain/func_list"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="unImpawnEndorse()" :disabled="formItem.isCommit === 'hasCommit'">背书
              </h-button>
              <h-button type="primary" @click="endorseCancel()" :disabled="formItem.isCommit === 'noCommit'">撤销背书
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <e-un-impawn-endorse-bill :billManagerVue="billManagerVue" :unImpawnBillParams="unImpawnBillParams"
                              @returnSignMain="returnSignMain"></e-un-impawn-endorse-bill>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";
  import { deepClone } from "@/utils/index";

  export default {
    name: "eUnImpawnEndorseMain",
    components: {
      EUnImpawnEndorseBill:()=>import(/* webpackChunkName: "ce/impawn/elec/elecUnImpawn/eUnImpawnEndorseBill" */`@/views/bizViews/ce/impawn/elec/elecUnImpawn/eUnImpawnEndorseBill`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

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
        {
          title: this.$t("m.i.common.unImpawnDt"),
          key: "unimpawnDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.unimpawnDt == null || params.row.unimpawnDt === "") {
              return "";
            }
            let date = this.$moment(params.row.unimpawnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
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
        formItem: {
          billClass: "ME02",
          funcNo: "PICE031501",
          isCommit: "noCommit",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          custNo: "",
          custName: "",
          batchNo: "",
          unImpawnDt: "",
          queryFlag: "0",
        },
        columns: columns,
        cloneColumns: deepClone(columns),
        dictMap: new Map(),
        currentSelectRow: [],
        mainVue: true,
        billManagerVue: false,
        showCustMessageWin: false,
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        // brchNoWin : false,
        //是否显示更多查询项
        ifShowMore: false,
        unImpawnBillParams: {},
        billOriginList: [],
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,BillOrigin").then(res => {
        this.dictMap = res.get("map");
        this.billOriginList = res.get("BillOrigin");

      });

      //授权时显示业务所属机构列
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
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
          this.formItem.custName = "";
        }
      },
      handleDateChange(value) {
        this.formItem.unImpawnDt = value.replace(/-/g, "");
      },
      //未背书
      noCommitButton() {
        this.formItem.isCommit = "noCommit";
        this.formItem.funcNo = "PICE031501";
        this.handleSearch();
      },
      //已背书
      hasCommitButton() {
        this.formItem.isCommit = "hasCommit";
        this.formItem.funcNo = "PICE031502";
        this.handleSearch();
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.formItem.unImpawnDt = this.formItem.unImpawnDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.batchNo = "";
        this.formItem.unImpawnDt = "";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
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
      //解质押背书
      unImpawnEndorse() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.unImpawnBillParams.batchId = this.currentSelectRow.id;
        this.assembleParams();
      },
      //解质押撤销背书
      endorseCancel() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.unImpawnBillParams.batchId = this.currentSelectRow.id;
        this.assembleParams();
      },
      //返回主页面
      returnSignMain() {
        this.currentSelectRow = [];
        this.formItem.unImpawnDt = this.formItem.unImpawnDt.replace(/-/g, "");
        this.mainVue = true;
        this.billManagerVue = false;
        this.unImpawnBillParams = {};
        this.$nextTick(() => {
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      },
      //点击批次编号超链接
      openBillManagerWin(batchId) {
        this.unImpawnBillParams.batchId = batchId;
        this.assembleParams();
      },
      assembleParams() {
        this.unImpawnBillParams.dictMap = this.dictMap;
        this.unImpawnBillParams.funcNo = this.formItem.funcNo;
        this.unImpawnBillParams.billClass = this.formItem.billClass;
        this.unImpawnBillParams.isCommit = this.formItem.isCommit;
        this.unImpawnBillParams.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
        this.unImpawnBillParams.licenseFlag = this.licenseFlag;
        this.unImpawnBillParams.accountType = "unImpawn";
        this.unImpawnBillParams.billOriginList = this.billOriginList;
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
    }
  };
</script>

<style scoped>

</style>
