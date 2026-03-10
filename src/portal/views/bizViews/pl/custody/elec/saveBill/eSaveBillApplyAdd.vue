<!--电票代保管存票申请管理-新增/修改申请-->
<template>
  <div>
    <h-msg-box v-model="tempSaveBillAddOrEditWin" :maximize="true" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'noCommit'">修改申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'hasCommit'">撤销申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <h-form-item prop="agreementNo" :label="$t('m.i.pl.agreementNo')" required>
              <h-input v-model="addOrEditForm.agreementNo" placeholder=""  icon="android-search" @on-click="queryAgreementNo()" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
              <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
              <h-input v-model="addOrEditForm.custNo" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required>
              <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly></h-input>
            </h-form-item>
            <common-select v-model="addOrEditForm.billOriginArray" :label="$t('m.i.billInfo.billOrigin')" prop="billOriginArray"
                           :readonly="batchParams.batchType==='modify'"
                           :dictList="batchParams.billOriginArray"
                           :multiple="(this.isMixPack && batchParams.batchType==='add')||batchParams.batchType !=='add'" required ></common-select>
            <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
              <h-select v-model="addOrEditForm.billType"  placeholder="" >
                <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="saveBatchDt" :label="$t('m.i.common.createDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.saveBatchDt" placeholder="" @on-change="handleSaveBatchDtChange" :editable=false></h-date-picker>
            </h-form-item>
            <show-branch v-show="false" v-model="addOrEditForm.saveBrchNo" :label="$t('m.i.pl.saveBrchName')" prop="saveBrchNo" required title="机构名称"
                         :brchNo.sync="addOrEditForm.saveBrchNo" :brchName.sync="addOrEditForm.saveBrchName"
                         :showIcon="false" :readonly="true"
                         :filterable="true" :showCheckBox="false" :msgBoxWin="tempSaveBillAddOrEditWin">
            </show-branch>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="formSave()" v-show="this.batchParams.isCommit === 'noCommit'" >{{$t("m.i.common.save")}}</h-button>
        </div>
        <h-form :model="addSumForm" :label-width="115" ref="addSumForm" cols="3" class="h-form-search">
          <div>
            <h-form-item :label="$t('m.i.pe.total')" prop="totalCount">
              <h-input  v-model="addSumForm.totalCount" disabled></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pe.totalAmt')" prop="totalAmt">
              <h-input  v-model="addSumForm.totalAmt" disabled></h-input>
            </h-form-item>
          </div>
        </h-form>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          :auto-load="false"
          url="/pl/custody/elec/saveBill/eSaveBillApplyMain/func_pageQuerySaveBillList"
          :bindForm="formItem"
          :rowSelect="true"
          :has-select="hasSelect"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="pickBillWinOpen">{{$t('m.i.pl.pickBill')}}</h-button>
            <h-dropdown placement="bottom-start" @on-click="deleteBillDetail" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t("m.i.common.delete")}}<h-icon name="unfold"></h-icon></h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">选择删除</h-dropdown-item>
                <h-dropdown-item name="batch">批次删除</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t("m.i.common.submit")}}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">选择提交</h-dropdown-item>
                <h-dropdown-item name="batch">批次提交</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="confirmPrint">{{$t("m.i.pl.confirmPrint")}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="infoCancel">{{$t("m.i.common.cancelCheckAuth")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-sign-agreement :signAgreementWin="signAgreementWin" @signAgreementWinClose="signAgreementWinClose"
                         @signAgreementSubmit="signAgreementSubmit" :signParams="signParams"></show-sign-agreement>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :bill-range-start="this.billRangeStart" :bill-range-end="this.billRangeEnd"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <!--风险信息-->
    <risk-check :riskCheckWin="riskCheckWin" :riskParams="riskParams" @riskCheckWinClose="riskCheckWinClose"
                @riskCheckSubmit="riskCheckSubmit"></risk-check>
    <!-- 挑票 -->
    <e-save-bill-pick :save-pick-bill-win="savePickBillWin" @savePickBillWinClose="savePickBillWinClose"
                      @savePickBillChange="savePickBillChange" :e-save-pick-bill-form="this.eSavePickBillBillForm"
    ></e-save-bill-pick>

    <!-- 所属机构弹出框 -->
    <h-msg-box v-model="saveBrchNoWin" width="400" @on-close="saveBrchNoClose()" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-maximize="getTreeHeight($event, 'saveBrchNoMsg')" ref="saveBrchNoMsg">
      <p slot="header">
        <span>机构选择</span>
      </p>
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(saveBrchNoTreeData)' >{{$t("m.i.common.expand")}}</h-button>
            <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(saveBrchNoTreeData)' >{{$t("m.i.common.noExpand")}}</h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
          <h-tree :data="saveBrchNoTreeData" ref="saveBrchNoTreeData" class='h-tree-self' @on-toggle-expand="toggleExpand"></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="saveBrchNoWin=!saveBrchNoWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="saveBrchNoConfirm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, formatNumber ,formatBillRange} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "eSaveBillApplyAdd",
    components: {
      ESaveBillPick: () => import(/* webpackChunkName: "pl/custody/common/saveBillPick" */ '@/views/bizViews/pl/custody/common/eSaveBillPick')
    },
    data() {
      return {
        // 是否混包
        isMixPack : false,
        savePickBillWin : false,
        addSumForm : {
          totalAmt: '0.00',
          totalCount: '0'
        },
        billClass : "ME02",
        submitFlag : false,
        hasSelect : false,
        batchId : "",
        billOriginArray: [],
        addOrEditForm : {
          id:'',
          billClass: 'ME02',
          billOriginArray: [],
          agreementNo: '',
          custName: '',
          custNo: '',
          custAcctNo: '',
          billType: '',
          saveBatchDt: window.sessionStorage.getItem("workDate"),
          saveBrchNo: this.$store.getters.userInfo.brchNo,
          saveBrchName: this.$store.getters.userInfo.brchName,
          dataSource: '1'
        },
        formItem : {
          batchId: '',
          billClass: 'ME02',
          curFuncNo: 'PIPL020201',
        },
        columns : [],
        columnsNoCommit : [
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
           title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let type = "";
              if (!!params.row.billId) {
                type = "billId";
              } else {
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
              if(params.row.remitDt == null || params.row.remitDt === ""){
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
              if(params.row.dueDt == null || params.row.dueDt === ""){
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
        columnsHasCommit : [
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
           title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let type = "";
              if (!!params.row.billId) {
                type = "billId";
              } else {
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
              if(params.row.remitDt == null || params.row.remitDt === ""){
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
              if(params.row.dueDt == null || params.row.dueDt === ""){
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
        billTypeList : [],
        saveAddBillInfoForm : {},
        currentSelectList : [],
        signAgreementWin : false,
        signParams : {},
        //记录批次是否已保存
        hadBatchSave : false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart: "",
        billRangeEnd: "",
        //风险信息窗口
        riskCheckWin : false,
        riskParams : {},
        saveBrchNoTreeData : [],
        saveBrchNoWin : false,
        mTreeHeight: 300,
        isDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        // 调票查询传递参数
        eSavePickBillBillForm: {}
      };
    },
    props: {
      saveBillAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          billTypeList: [],
          billOriginArray: [],
          isList: [],
          batchId: "",
          batchType: "",
          isCommit: "",
          curFuncNo: "",
          billType: "",
          billClass: "",
          custAcctNo: "",
          custNo: "",
        }
      }
    },
    computed: {
      tempSaveBillAddOrEditWin: {
        get() {
          return this.saveBillAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      saveBillAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.addOrEditForm.resetFields();
            this.$refs.addSumForm.resetFields();
            this.addOrEditForm.id = "";
            this.addOrEditForm.saveBrchNo = this.$store.getters.userInfo.brchNo;
            this.addOrEditForm.saveBrchName = this.$store.getters.userInfo.brchName;
            this.hadBatchSave = false;
            if(this.batchParams.isCommit === 'hasCommit') {
              this.columns = deepClone(this.columnsHasCommit);
              this.$refs.datagrid.createShowCol(this.columns);
            }else {
              this.columns = deepClone(this.columnsNoCommit);
              this.$refs.datagrid.createShowCol(this.columns);
            }
            this.batchId = this.batchParams.batchId;
            this.billTypeList = this.batchParams.billTypeList;
            this.formItem.batchId = this.batchParams.batchId;
            this.formItem.curFuncNo = this.batchParams.curFuncNo;
            this.formItem.billClass = this.batchParams.billClass;
            if (this.batchParams.batchType === "modify") {
              this.queryObjById();
              this.handleSearch();
              this.hadBatchSave = true;
            }
            if (this.batchParams.batchType === "add") {
              this.$refs.datagrid.tData = [];
              this.addOrEditForm.saveBatchDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
            }
          });
        }
      },
    },
    mounted() {
      //查询业务参数，混包业务场景
      post({paramKey: "cs.mix_pack_busi_scene"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let mixPackBusiScene = res.data.retData;
            if (mixPackBusiScene) {
              if (mixPackBusiScene.indexOf("03") >= 0) {
                this.isMixPack = true;
              } else {
                this.isMixPack = false;
              }
            } else {
              this.isMixPack = false;
            }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    methods: {
      getTreeHeight(isMax, msgRef) {
        this.$nextTick(() => {
          if(isMax) {
            let headerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header')[0].offsetHeight;
            let footerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-footer')[0].offsetHeight;
            let headerBtnHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header-wrapper')[0].offsetHeight;
            let mTreeHeight = window.innerHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
            if(window.sessionStorage.getItem("isTransfer") === "0") {
              let appObj = document.getElementsByClassName("app-main");
              let appOffsetHeight = appObj.length == 0 ? 0 : appObj[0].offsetHeight;
              mTreeHeight = appOffsetHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
            }
            this.mTreeHeight = mTreeHeight;
          } else {
            this.mTreeHeight = 300;
          }
        });
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = false;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = true;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            this.$set(arr[i], "expand", isExpand);
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      //获取机构树弹窗关闭
      saveBrchNoClose() {
        this.saveBrchNoWin = false;
      },
      //获取机构树确认
      saveBrchNoConfirm() {
        let arr = this.$refs["saveBrchNoTreeData"].getSelectedNodes();
        if(arr.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.addOrEditForm.saveBrchName = arr[0].title;
        this.addOrEditForm.saveBrchNo = arr[0].id;
        this.saveBrchNoWin = false;
      },
      //修改时根据票据批次Id查询票据批次信息
      queryObjById() {
        let params = { id: this.batchId, curFuncNo: this.batchParams.curFuncNo, billClass: 'ME02'};
        post(params, "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_pageQuerySaveBatchList").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (null !== res.data.retData.list && res.data.retData.list.length > 0) {
                let obj = res.data.retData.list[0];
                this.addOrEditForm.id = obj.id;
                this.addOrEditForm.agreementNo = obj.agreementNo;
                this.addOrEditForm.custName = obj.custName;
                this.addOrEditForm.custNo = obj.custNo;
                this.addOrEditForm.custAcctNo = obj.custAcctNo;
                this.addOrEditForm.billType = obj.billType;
                if (obj.billOriginArray === "" || obj.billOriginArray === null) {
                  this.addOrEditForm.billOriginArray = [];
                } else {
                  let _billOriginArray = obj.billOriginArray.indexOf("!") >= 0 ? obj.billOriginArray.substring(0,
                    obj.billOriginArray.length - 1) : obj.billOriginArray;
                  this.addOrEditForm.billOriginArray = _billOriginArray.split(",");
                }
                this.addOrEditForm.saveBatchDt = obj.saveBatchDt;
                this.addOrEditForm.checkType = obj.checkType;
                this.addOrEditForm.saveBrchNo = obj.saveBrchNo;
                this.addOrEditForm.saveBrchName = obj.saveBrchName;
                if(obj.saveBatchDt != null && obj.saveBatchDt !== ""){
                  this.addOrEditForm.saveBatchDt = this.$moment(obj.saveBatchDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                this.addSumForm.totalCount = obj.totalCount;
                this.addSumForm.totalAmt = formatNumber(obj.totalAmt, 2, ',');
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        // this.$refs.addOrEditForm.resetFields();
        // this.$refs.addSumForm.resetFields();
        // this.addOrEditForm.id = "";
        // this.hadBatchSave = false;
        this.$emit("saveBillAddOrEditWinClose", "");
      },
      handleSaveBatchDtChange(value) {
        this.addOrEditForm.saveBatchDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //查询签约信息
      queryAgreementNo() {
        this.signParams.agreementUrl = "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_pagingBillAgreement";
        this.signParams.signFuncNo = "1";
        this.signParams.effectiveFlag = "1";
        this.signAgreementWin = true;
      },
      //赋值
      signAgreementSubmit(info) {
        this.addOrEditForm.agreementNo = info.agreementNo;
        this.addOrEditForm.custName = info.custName;
        this.addOrEditForm.custNo = info.custNo;
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.signAgreementWin = false;
      },
      //关闭
      signAgreementWinClose() {
        this.signParams = {};
        this.signAgreementWin = false;
      },
      //保存批次信息
      formSave() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.saveBatchDt = this.$moment(this.addOrEditForm.saveBatchDt).format("YYYYMMDD");
            if (this.addOrEditForm.saveBatchDt < window.sessionStorage.getItem("workDate")) {
              this.$msgTip.info(this, { info: "创建日期必须大于或等于当前营业日期" });
              return;
            }
            let url = this.batchParams.batchType === "add" ? "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_addSaveBatch" : "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_updateSaveBatch";
            if (this.hadBatchSave) {
              url = "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_updateSaveBatch";
            }
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.batchParams.custAcctNo = this.addOrEditForm.custAcctNo;
                  this.batchParams.billType = this.addOrEditForm.billType;
                  if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                    this.batchId = res.data.retData;
                    this.formItem.batchId = res.data.retData;
                    this.addOrEditForm.id = res.data.retData;
                    this.batchParams.batchId = res.data.retData;
                    if (!this.isMixPack && typeof (this.addOrEditForm.billOriginArray) === 'string') {
                      let _billOriginArray = this.addOrEditForm.billOriginArray.indexOf("!") >= 0 ? this.addOrEditForm.billOriginArray.substring(0,
                        this.addOrEditForm.billOriginArray.length - 1) : this.addOrEditForm.billOriginArray;
                      this.addOrEditForm.billOriginArray = _billOriginArray.split(",");
                    }
                  }
                  this.handleSearch();
                  this.hadBatchSave = true;
                  this.batchParams.batchType = "modify";
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //挑票
      pickBillWinOpen() {
        if (this.batchParams.batchType === "add") {
          if (this.hadBatchSave) {
            this.jumpToBillWin();
          }else {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
        }
        if (this.batchParams.batchType === "modify") {
          this.jumpToBillWin();
        }
      },
      //跳转到挑票界面
      jumpToBillWin(){
        this.eSavePickBillBillForm.billClass = this.billClass;
        this.eSavePickBillBillForm.billType = this.batchParams.billType;
        this.eSavePickBillBillForm.batchId = this.batchParams.batchId;
        this.eSavePickBillBillForm.custAcctNo = this.batchParams.custAcctNo;
        this.eSavePickBillBillForm.custNo = this.addOrEditForm.custNo;
        this.eSavePickBillBillForm.billOriginArray = this.addOrEditForm.billOriginArray;
        this.formItem.billOriginArray = this.addOrEditForm.billOriginArray;
        this.savePickBillWin = true;
      },
      //挑票界面根据弹框所选票进行赋值
      savePickBillChange(info) {
        let list = info;
        let pickDtoList = [];
        for(let i=0; i<list.length; i++) {
          let pickDto = {
            transId: list[i].transId,
            billId: list[i].billId,
            hldrId: list[i].hldrId,
            billRangeStart: list[i].billRangeStart,
            billRangeEnd: list[i].billRangeEnd,
          };
          pickDtoList.push(pickDto);
        }
        post({batchId: this.batchId , pickBillDtoList: pickDtoList},'/pl/custody/elec/saveBill/eSaveBillApplyMain/func_pickSaveBillInfo').then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.$msgTip.success(this,{info:res.data.retMsg});
              this.savePickBillWin = false;
              this.queryObjById();
              this.handleSearch();
              this.$emit("pageReFresh","");
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.datagrid.dataChange(1);
              this.$emit("pageReFresh","");
            }
          }else{
            this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
          }
        });
      },
      //挑票界面取消按钮
      savePickBillWinClose(){
        this.savePickBillWin = false;
        this.handleSearch();
      },
      //删除
      deleteBillDetail(str) {
        if(str === "batch") {
          this.batchDelete();
        }
        if(str === "select") {
          this.selectDelete();
        }
      },
      //批次删除
      batchDelete() {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        if (this.$refs.datagrid.tData.length === 0) {
          this.$msgTip.info(this, { info: "该批次下无数据" });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次删除明细吗",
          onOk: () => {
            let flowStatusList = ['PIPL02010102-PIPL02020101','PIPL02020402-PIPL02020101','PIPL02020602-PIPL02020101','PIPL02030402-PIPL02020101','PIPL02020202-PIPL02020202','PIPL02020302-PIPL02020101'];
            post({batchId: this.batchId, billOperType: "1", flowStatusList: flowStatusList }, "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_deleteSaveBillInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.queryObjById();
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //选择删除
      selectDelete() {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定选择删除明细吗",
          onOk: () => {
            let ids = "";
            for(let i=0; i<list.length; i++) {
              ids += list[i].id;
              if(i<list.length-1) {
                ids += ",";
              }
            }
            post({batchId: this.batchId, billOperType: "0", ids: ids }, "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_deleteSaveBillInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.queryObjById();
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //提交
      submit(type) {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        if (type === "select") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          let ids = "";
          for(let i=0; i<list.length; i++) {
            ids += list[i].id;
            if(i<list.length - 1) {
              ids += ",";
            }
          }
          let params = { batchId: this.batchId, ids: ids, billOperType: "0" };
          this.getRiskBillNo(params);
        } else if (type === "batch") {
          if (this.batchId === "") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if (this.$refs.datagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = { batchId: this.batchId, billOperType: "1" };
          this.getRiskBillNo(params);
        }
      },
      //提交前先调用风险检查接口
      getRiskBillNo(params) {
        post(params, "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_getRiskBillNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let data = res.data.retData;
            if (retCode === "000000") {
              if (Object.keys(data).length > 0) {
                this.riskCheckWin = true;
                this.riskParams.gridDatas = data;
                this.riskParams.submitParams = params;
                this.riskParams.YonList = this.batchParams.isList;
              } else {
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: "确定提交申请吗?",
                  onOk: () => {
                    this.handleSubmit(params);
                  }
                });
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      handleSubmit(params, isRiskCkeck) {
        post(params, "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_submitSaveBillFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.queryObjById();
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            if (isRiskCkeck) {
              this.riskCheckWinClose();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //撤销
      infoCancel() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      handleCancelApplyBatch() {
        post({ batchId: this.batchId, billOperType: '1' }, "/pl/custody/elec/saveBill/eSaveBillApplyMain/func_cancelSaveBillFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleClose();
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info.billId;
        } else {
          this.billNo = info.billNo;
        }
        this.billRangeStart = info.billRangeStart;
        this.billRangeEnd = info.billRangeEnd;
        this.showBillInfoWin = true;
      },
      riskCheckWinClose() {
        this.riskCheckWin = false;
        this.riskParams = {};
      },
      riskCheckSubmit(info) {
        this.handleSubmit(info, true);
      },

      //确认书打印
      confirmPrint() {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.assembleBillParams(list);
      },

      assembleBillParams(vocherData) {
        let bodyStr = "";
        for (let i = 0; i < vocherData.length; i++) {
          let printData = {};
          printData.billOrigin = !!vocherData[i].billOrigin ? this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", vocherData[i].billOrigin) : "";
          printData.billNo = vocherData[i].billNo;
          printData.billRange = formatBillRange(vocherData[i].billOrigin, vocherData[i].billRangeStart, vocherData[i].billRangeEnd);
          printData.flowStatusName = !!vocherData[i].flowStatusName ? vocherData[i].flowStatusName : "";
          printData.billType = !!vocherData[i].billType ? this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", vocherData[i].billType) : "";
          printData.remitDt = !!vocherData[i].remitDt ? this.$moment(vocherData[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
          printData.dueDt = !!vocherData[i].dueDt ? this.$moment(vocherData[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
          printData.billMoney = formatNumber(vocherData[i].billMoney, 2, ",");
          printData.drwrName = vocherData[i].drwrName === null ? "" : vocherData[i].drwrName;
          printData.drwrAcctNo = vocherData[i].drwrAcctNo === null ? "" : vocherData[i].drwrAcctNo;
          printData.pyeeName = vocherData[i].pyeeName === null ? "" : vocherData[i].pyeeName;
          printData.acptName = vocherData[i].acptName === null ? "" : vocherData[i].acptName;
          printData.pyeeAcctNo = vocherData[i].pyeeAcctNo === null ? "" : vocherData[i].pyeeAcctNo;
          printData.flowNo = vocherData[i].acctFlowId === null ? "" : vocherData[i].flowNo;
          printData.printObj = JSON.stringify(vocherData[i]);

          bodyStr += "<tr>";
          bodyStr += "<td class='ta-c'>" + (1 + i) + "</td>";
          bodyStr += "<td>" + printData.billOrigin + "</td>";
          bodyStr += "<td>" + printData.billNo + "</td>";
          bodyStr += "<td>" + printData.billRange + "</td>";
          bodyStr += "<td>" + printData.flowStatusName + "</td>";
          bodyStr += "<td>" + printData.billType + "</td>";
          bodyStr += "<td>" + printData.billMoney + "</td>";
          bodyStr += "<td>" + printData.remitDt + "</td>";
          bodyStr += "<td>" + printData.dueDt + "</td>";
          bodyStr += "<td>" + printData.drwrName + "</td>";
          bodyStr += "<td>" + printData.drwrAcctNo + "</td>";
          bodyStr += "<td>" + printData.pyeeName + "</td>";
          bodyStr += "<td>" + printData.acptName + "</td>";
          bodyStr += "</tr>";
        }
        let headHtml = `<div style="text-align:center;" ref="headHtml">
          <div style="text-align:center;font-size:18px;font-weight:bold;">票据池确认清单</div>
           <div style="text-align:left;font-size:14px;font-weight:bold;">存票：√</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户名称：${this.addOrEditForm.custName}</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户账号：${this.addOrEditForm.custAcctNo}</div>
        </div>`;
        let footerHtml = `<div style="font-size:14px;font-weight:bold;display:-webkit-box;display:flex;justify-content:flex-end;">
          <label style="padding-right:20%">收款行:</label>
          <label style="padding-right:20%">客户:</label>
        </div>`;
        let bodyHtml = `<div class="list-table-box"><table class="list-table">
          <thead>
            <tr>
              <th class="ta-c"><b>序号</b></th>
              <th>票据来源</th>
              <th>票据(包)号码</th>
              <th>子票区间</th>
              <th>流程状态</th>
              <th>票据种类</th>
              <th>票据(包)金额(元)</th>
              <th>出票日期</th>
              <th>汇票到期日</th>
              <th>出票人全称</th>
              <th>出票人账号</th>
              <th>收款人全称</th>
              <th>承兑人全称</th>
            </tr>
          </thead>
          <tbody>${bodyStr}</tbody>
        </table>
      </div>`;
        this.$print.printListHtm(this, headHtml, bodyHtml, {
          bodyTop: "20%", bodyLeft: "1%", bodyWidth: "99%", bodyHeight: "75%"
        }, footerHtml);
      },
      recursiveAssigNode(menuTreeData, arr) {
        this.flag = false;
        for (let i = 0; i < menuTreeData.length; i++) {
          if (this.flag) {
            break;
          }
          if (menuTreeData[i].id === arr.id) {
            menuTreeData[i] = arr;
            this.flag = true;
            break;
          }
          if (menuTreeData[i].children) {
            this.recursiveAssigNode(menuTreeData[i].children, arr)
          }
        }
      },
      isAllExpand(arr) {
        this.flag = true;
        for (let i = 0; i < arr.length; i++) {
          if (!this.flag) {
            break;
          }
          if (arr[i].expand === false && arr[i].children) {
            this.flag = false;
            break;
          }
          if (arr[i].children) {
            this.isAllExpand(arr[i].children)
          }
        }
      },
      toggleExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.saveBrchNoTreeData, arr);
        this.isAllExpand(this.saveBrchNoTreeData);
        // 完全收缩
        for (let i = 0; i < this.saveBrchNoTreeData.length; i++) {
          if (this.saveBrchNoTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.saveBrchNoTreeData.length) {
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
          return;
        }
        if(!this.flag){
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = false;
        }else{
          this.isExpandDisabled = true;
          this.isNotExpandDisabled = false;
        }

      },
    }
  };
</script>

<style scoped>

</style>
