<!--电票质押申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="queryForm" :label-width="90" ref="queryForm" cols="4" class="h-form-search">
                <h-form-item prop="isCommit" :label="$t('m.i.ce.isCommit')">
                  <h-radio-group v-model="isCommit">
                    <h-radio label="noCommit" @on-click="noCommitButton">
                      <span>{{$t('m.i.ce.noCommit')}}</span>
                    </h-radio>
                    <h-radio label="hasCommit" @on-click="hasCommitButton">
                      <span>{{$t('m.i.ce.hasCommit')}}</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <!--<own-brch-nos :formItem = "queryForm" @brchNoWinOpen="brchNoWin = true" v-if="this.licenseFlag"></own-brch-nos>-->
                <show-branch v-model="queryForm.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="queryForm.ownedBrchNos" :brchName.sync="queryForm.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="queryForm.drwrName" placeholder="" icon="android-search" @on-click="queryCustNo()" readonly></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="queryForm.acptProtocalNoLike" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="batchNoLike" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="queryForm.batchNoLike" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker v-model="queryForm.remitDt" type="date" placeholder="" @on-change="handleDateChange" showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid
                :columns="batchColumns"
                highlightRow
                :auto-load="false"
                url="/ce/acpt/elec/apply/eAcptApplyMain/func_pageQueryAcptApplyBatch"
                :bindForm="queryForm"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="acptBatchOpenWin('add')" :disabled="isCommit === 'hasCommit'">{{$t("m.i.common.add")}}</h-button>
                  <h-button type="primary" @click="acptBatchOpenWin('modify')" :disabled="isCommit === 'hasCommit'">{{$t("m.i.common.modify")}}</h-button>
                  <h-button type="primary" @click="acptBatchDelete()" :disabled="isCommit === 'hasCommit'">{{$t("m.i.common.delete")}}</h-button>
                  <h-button type="primary" @click="acptBatchCancel()" :disabled="isCommit === 'noCommit'">{{$t("m.i.common.cancel")}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :showCustMessageWin="showCustInfoWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit" ref="showCustInfo"></show-cust-message>
        <!-- 新增修改弹窗 -->
        <e-acpt-apply-add :acptAddOrEditWin="acptAddOrEditWin" :batchParams="batchParams" :busiOwnBrchNo="busiOwnBrchNo" @acptAddOrEditWinClose="acptAddOrEditWinClose" ref="acptAddOrEdit" :licenseFlag="licenseFlag" :authPath="authPath"></e-acpt-apply-add>
      </h-col>
    </h-row>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
import {formatNumber, formatTime, getSingleParamValuesByKeys, post} from "@/api/bizApi/commonUtil";

export default {
    name: "eAcptApplyMain",
    components: {
      "e-acpt-apply-add":()=>import(/* webpackChunkName: "ce/acpt/elec/apply/eAcptApplyAdd" */`@/views/bizViews/ce/acpt/elec/apply/eAcptApplyAdd`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
    },
    data() {
      return {
        // brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        isCommit: "noCommit",
        showCustInfoWin: false,
        acptAddOrEditWin: false,
        acptTypeArray: [],
        eAcptTypeArray:[],
        guarntrTypeArray: [],
        lockMark:false,
        syncOperMode:"",
        queryUrl: "/pc/busiLock/func_getBusiLockParam",
        busiOwnBrchNo:"",
        YonList: [],
        billOriginArray : [],
        isMixPack:false,
        batchParams: {
          batchId: {
            type: Number
          },
          optType: "",
          isCommit: "",
          curFuncNo: "",
          dictMap: {
            type: Map
          },
          acptTypeArray: [],
          eAcptTypeArray: [],
          guarntrTypeArray: [],
          YonList: [],
          invoiceAfterFlag: "0",
          acptType: "1",
          guarntrType: "4",
          billOriginArray:[],
          isMixPack:""
        },
        ifShowMore: false,
        dictMap: {
          type: Map
        },
        queryForm: {
          drwrCustNo: "",
          acptProtocalNoLike: "",
          batchNoLike: "",
          remitDt: "",
          curFuncNo: "PICE010203",
          billClass: "ME02",
          billType: "AC01",
          drwrName: "",
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        batchColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          }, {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: true
          },
            {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
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
          }, {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          }, {
            title: this.$t("m.i.ce.acptType"),
            key: "acptType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "EAcptType", params.row.acptType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
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
          }, {
            title: this.$t("m.i.billInfo.acptBrchNo"),
            key: "acptBrchNo",
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.acptType === "2") {
                return h("span",  params.row.agencyBankNo );
              } else {
                return h("span",  params.row.drweBankNo);
              }
            }
          }, {
            title: this.$t("m.i.ce.totalCount"),
            key: "totalCount",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.totalCount === "" || params.row.totalCount == null) {
                return h("span", "0");
              } else {
                return h("span", params.row.totalCount);
              }
            }
          },
          {
            title: this.$t("m.i.ce.totalAmt"),
            key: "totalAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null == params.row.totalAmt || params.row.totalAmt === "") {
                return h("span", "0.00");
              } else {
                let totalAmt = formatNumber(params.row.totalAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: totalAmt
                  }
                }, totalAmt);
              }
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
        ]
      };
    },
    mounted() {
      this.getSyncOperMode();
      this.getDictListByGroups("GuarntrType,AcptType,Yon,DraftTypeCode,BillOrigin,EAcptType").then(res => {
        this.YonList = res.get("Yon");
        this.guarntrTypeArray = res.get("GuarntrType");
        this.acptTypeArray = res.get("AcptType");
        this.eAcptTypeArray = res.get("EAcptType");
        this.billOriginArray = res.get("BillOrigin");
        this.dictMap = res.get("map");
        this.handleSearch();
      });
      getSingleParamValuesByKeys("pc.is_marketing_bank_mode").then(res => {
        let busiOwnBrchNo = res["pc.is_marketing_bank_mode"];
        if (busiOwnBrchNo ==="1") {
          this.busiOwnBrchNo = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
        }
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

      //查询业务参数，混包业务场景
      post({paramKey: "cs.mix_pack_busi_scene"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let mixPackBusiScene = res.data.retData;
            if(mixPackBusiScene) {
              if(mixPackBusiScene.indexOf("01") >= 0){
                this.isMixPack = true;
              }else{
                this.isMixPack = false;
              }
            }else {
              this.isMixPack = false;
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
        this.queryForm.remitDt = value.replace(/-/g, "");
      },
      //未提交
      noCommitButton() {
        this.isCommit = "noCommit";
        this.queryForm.curFuncNo = "PICE010203";
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.isCommit = "hasCommit";
        this.queryForm.curFuncNo = "PICE010204";
        this.handleSearch();
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.queryForm.drwrCustNo = "";
        this.$refs.queryForm.resetFields();
        this.queryForm.ownedBrchNames = "";
        this.queryForm.ownedBrchNos = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //查询客户信息
      queryCustNo() {
        this.showCustInfoWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.queryForm.drwrCustNo = info.custNo;
        this.queryForm.drwrName = info.custName;
        this.showCustInfoWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustInfoWin = false;
      },
      async queryObjById() {
        let params = { id: this.currentSelectRow.id };
        return post(params, "/ce/acpt/elec/apply/eAcptApplyMain/func_getAcptBatchById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              if (obj == null){
                return "批次信息不存在，请重新确认";
              } else {
                return "";
              }
            } else {
              return "查询批次信息失败:"+res.data.retMsg;
            }
          } else {
            return this.$t("m.i.common.netError");
          }
        });
      },
      //新增、修改
      async acptBatchOpenWin(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.batchId = this.currentSelectRow.id;
          let errorMsg = await this.queryObjById();
          if (errorMsg != "" && errorMsg != null){
            this.$msgTip.error(this, { info: errorMsg });
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            return;
          }
          if (this.syncOperMode === '1') {
            let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
            let lockUserNo = this.currentSelectRow.lockUserNo;
            if (lockUserNo !== "" && lockUserNo !== null && lockUserNo !== undefined) {
              if (lockUserNo !== userNo) {
                this.$msgTip.info(this, {info: this.$t("m.i.ce.busiLockErrorMsg") + '[' + lockUserNo + ']' + this.$t("m.i.ce.busiLockErrorMsg1")});
                return;
              }
            }
            this.addOrDelBatchBusiLock(this.batchParams.batchId, "add", str);
          } else {
            this.assembleParams(str);
          }
        } else {
          this.batchParams.batchId = null;
          this.assembleParams(str);
        }
      },
      //关闭新增、修改弹窗
      acptAddOrEditWinClose() {
        this.acptAddOrEditWin = false;
        if (this.lockMark) {
          this.addOrDelBatchBusiLock(this.batchParams.batchId,"delete","");
        }
        let pageNo = this.batchParams.optType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
        this.lockMark = false;
      },
      //删除
      acptBatchDelete() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
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
          this.addOrDelBatchBusiLock(this.batchParams.batchId,"add","modify");
        } else {
          this.assembleParams("modify");
        }
      },
      handleDel() {
        let id = this.currentSelectRow.id;
        post({ id: id ,deleteFlag:"0"}, "/ce/acpt/elec/apply/eAcptApplyMain/func_delAcptBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else if(retCode === "000002" && retMsg === "100001"){
              this.continueApply(id);
            }else{
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      continueApply(id){
        let url="/ce/acpt/elec/apply/eAcptApplyMain/func_delAcptBatch";
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
      acptBatchCancel() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定撤销申请吗?",
            onOk: () => {
              this.handleCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      handleCancel() {
        let batchId = this.currentSelectRow.id;
        post({ batchId: batchId ,licenseFlag:this.licenseFlag,ownedBrchNo:this.currentSelectRow.ownedBrchNo}, "/ce/acpt/elec/apply/eAcptApplyMain/func_cancelSubmitFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      assembleParams(optType) {
        this.batchParams.optType = optType;
        this.batchParams.curFuncNo = this.queryForm.curFuncNo;
        this.batchParams.isCommit = this.isCommit;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.YonList = this.YonList;
        this.batchParams.guarntrTypeArray = this.guarntrTypeArray;
        this.batchParams.acptTypeArray = this.acptTypeArray;
        this.batchParams.eAcptTypeArray = this.eAcptTypeArray;
        this.batchParams.invoiceAfterFlag = "0";
        this.batchParams.acptType = "1";
        this.batchParams.guarntrType = "4";
        this.batchParams.billOriginArray = this.billOriginArray;
        this.batchParams.isMixPack = this.isMixPack;
        this.acptAddOrEditWin = true;
      },
      addOrDelBatchBusiLock(id,type,str) {
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
                  this.lockMark = false;
                  this.handleSearch();
                } else {
                  this.lockMark = true;
                  this.assembleParams(str);
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
        this.queryForm.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.queryForm.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },*/
    }
  };
</script>

<style scoped>

</style>
