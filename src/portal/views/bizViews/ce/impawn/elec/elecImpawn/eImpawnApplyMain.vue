<!--电票质押申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="isCommit" :label="$t('m.i.ce.isCommit')">
                  <h-radio-group v-model="formItem.isCommit">
                    <h-radio label="noCommit" @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label="hasCommit" @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
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
                  <h-date-picker type="date" v-model="formItem.impawnDt" placeholder="" @on-change="handleDateChange"
                                 showFormat :editable=false></h-date-picker>
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
            url="/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_queryImpawnBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="impawnOpenWin('add')" :disabled="formItem.isCommit === 'hasCommit'">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="impawnOpenWin('modify')"
                        :disabled="formItem.isCommit === 'hasCommit'">{{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="impawnDelete()" :disabled="formItem.isCommit === 'hasCommit'">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="impawnCancel()" :disabled="formItem.isCommit === 'noCommit'">{{$t("m.i.common.cancel")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit" :ownedBrchNos="this.formItem.ownedBrchNos" :licenseFlag="this.licenseFlag"></show-cust-message>
        <!-- 新增修改弹窗 -->
        <e-impawn-apply-add :impawnAddOrEditWin="impawnAddOrEditWin" :batchParams="batchParams" :licenseFlag="this.licenseFlag" :buttonAuth="btnAuth"
                            @impawnAddOrEditWinClose="impawnAddOrEditWinClose" :isMixPack1="this.isMixPack1"></e-impawn-apply-add>
      </h-col>
    </h-row>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off,formatNumber,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "eImpawnApplyMain",
    components: {
      EImpawnApplyAdd:()=>import(/* webpackChunkName: "ce/impawn/elec/elecImpawn/eImpawnApplyAdd" */`@/views/bizViews/ce/impawn/elec/elecImpawn/eImpawnApplyAdd`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      return {
        btnAuth:{},
        formItem: {
          custNo: "",
          custName: "",
          batchNo: "",
          impawnDt: "",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          isCommit: "noCommit",
          billClass: "ME02",
          funcNo: "PICE030216",
          billOrigin: "",
          queryFlag: "0",
          isMixPack1:"",
        },
        columns: [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
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
                      this.openImpawnEditWin(params.row.id)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
           title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.impawnCtrctNo"),
            key: "transCtrctNo",
            ellipsis: false,
            hiddenCol: false
          },
          // {
          //   title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
          //   key: "billOrigin",
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
          //     return h("span", {
          //       domProps: {
          //         title: dictValue
          //       }
          //     }, dictValue);
          //   }
          // },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
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
        ],
        currentSelectRow: [],
        showCustMessageWin: false,
        impawnAddOrEditWin: false,
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        // brchNoWin : false,
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        billTypeList: [],
        YonList: [],
        billOriginList: [],
        //传入质押明细界面的参数
        batchParams: {},
        isMixPack1:false,
        //是否允许混包交易，用来控制票据来源的单选多选
        //mixedPackageExchange: false,
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.YonList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");

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

      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

      //查询业务参数，混包业务场景
      post({paramKey: "cs.mix_pack_busi_scene"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let mixPackBusiScene = res.data.retData;
            if(mixPackBusiScene) {
              if(mixPackBusiScene.indexOf("03") >= 0){
                this.isMixPack1 = true;
              }else{
                this.isMixPack1 = false;
              }
            }else {
              this.isMixPack1 = false;
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
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
        this.formItem.impawnDt = value.replace(/-/g, "");
      },
      //未提交
      noCommitButton() {
        this.formItem.isCommit = "noCommit";
        this.formItem.funcNo = "PICE030216";
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.formItem.isCommit = "hasCommit";
        this.formItem.funcNo = "PICE030217";
        this.handleSearch();
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.formItem.impawnDt = this.formItem.impawnDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos ="";
        this.formItem.ownedBrchNames = "";
        this.formItem.funcNo = "PICE030216";
        this.$refs.formItem.resetFields();
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
      //新增、修改
      impawnOpenWin(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.impawnBatchId = this.currentSelectRow.id;
        } else {
          this.batchParams.impawnBatchId = "";
        }
        this.assembleParams(str);
      },
      //关闭新增、修改弹窗
      impawnAddOrEditWinClose() {
        this.impawnAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除
      impawnDelete() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        let id = this.currentSelectRow.id;
        post({ id: id,deleteFlag: "0" }, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_deleteImpawnBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else if(retCode === "000002" && retMsg === "100001"){
              this.continueApply(id);
            } else {
              this.$refs.datagrid.dataChange(1);
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      continueApply(id){
        let url="/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_deleteImpawnBatch";
        let content ="批次下所有明细将同时删除，确认要删除吗？";
        this.$hMsgBox.confirm({
          title:"确认要继续提交申请吗?",
          content:content,
          onOk: () => {
            post({ id: id ,deleteFlag:"1"}, url).then(res => {
              if (res) {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }
            });
          }
        });
      },
      //撤销
      impawnCancel() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定撤销申请吗?",
            onOk: () => {
              this.handleCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleCancel() {
        let batchId = this.currentSelectRow.id;
        post({ batchId: batchId ,ownedBrchNo : this.currentSelectRow.ownedBrchNo,
          licenseFlag : this.licenseFlag, }, "/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_cancelFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //点击批次编号超链接
      openImpawnEditWin(batchId) {
        this.batchParams.impawnBatchId = batchId;
        this.assembleParams("modify");
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.funcNo = this.formItem.funcNo;
        this.batchParams.isCommit = this.formItem.isCommit;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.YonList = this.YonList;
        this.impawnAddOrEditWin = true;
        this.batchParams.billOriginList = this.billOriginList;
        if (optType === "modify") {
          this.batchParams.isMixPack1 = true;
        }else{
          this.batchParams.isMixPack1 = this.isMixPack1;
        }
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
