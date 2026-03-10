<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div v-if="mainVue" key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')">
                  <h-select v-model="formItem.acptType" placeholder="">
                    <h-option v-for="item in acptTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="batchNoLike" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/paper/print/acptPrintBackMain/func_queryPageAcptBatchAndBill"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t("m.i.ce.billManage")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <div v-if="billManagerVue" key="2">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="billManagerFormItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
        <acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams"
                                :batchUrl = "'/ce/acpt/paper/print/acptPrintBackMain/func_getAcptBatchByQueryDto'"
                                ref="acptBatchInfoDetail"></acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/paper/print/acptPrintBackMain/func_queryPageAcptBill"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :on-select-change="billManagerHandleRowClick"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="imageUpload" v-if="imageUploadIsShow">{{$t('m.i.common.uploadImg')}}</h-button>
              <h-button type="primary" @click="validRgstStatus">{{$t('m.i.common.proofPrintBack')}}</h-button>
              <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>

        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :isShowReset="false"
          :authObj="authObject"
          :isShowImgBatchNo="false"
          :isShowDealPrcMsg="false"
          :format="imageFormatType"
          :maxSize="999999999"
          @imageWinClose="uploadImageWinClose"></image-loading>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";
import {deepClone} from "@/utils/index";

export default {
    name: "acptPrintBackMain",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      // AcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/acptBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/acptBatchInfoDetail`)
    },
    data() {
      let columns = [
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
          key: 'batchNo',
          hiddenCol: false,
          sortable: true,
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
                    this.batchNoMain(params.row.id,params.row.ownedBrchNo)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: 'acptProtocalNo',
          hiddenCol: false,
          sortable: true,
        },
        {
         title: this.$t("m.i.ce.acptType"),
          key: 'acptType',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
            return h("span", {
              domProps: {
                title: list
              }
            }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drwrCustNo"),
          key: 'drwrCustNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: 'drweBankName',
          sortable: true,
          hiddenCol: false,
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
         title: this.$t("m.i.ce.totalFee"),
          key: 'totalFee',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalFee = formatNumber(params.row.totalFee, 2, ',');
            return h("span", {
              domProps: {
                title: totalFee
              }
            }, totalFee);
          }
        },
        {
          title: this.$t("m.i.ce.totalCommitFee"),
          key: 'totalCommitFee',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalCommitFee = formatNumber(params.row.totalCommitFee, 2, ',');
            return h("span", {
              domProps: {
                title: totalCommitFee
              }
            }, totalCommitFee);
          }
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: 'totalCount',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
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
        }
      ];
      let billManagerColumns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
        },
        {
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: true,
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
          title: this.$t("m.i.billInfo.billNo"),
          key: 'billNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = "";
            if (params.row.billNo === null || params.row.billNo === "") {
              billNo = "查看票面";
            }else {
              billNo = params.row.billNo;
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row.billId);
                }
              }
            }, billNo);
          }
        },
        {
          title: this.$t("m.i.ce.promNoteNo"),
          key: 'promNoteNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billMoney"),
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
         title: this.$t("m.i.ce.fee"),
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
          title: this.$t("m.i.ce.commitFee"),
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
          title: this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.pyeeAcctNo"),
          key: 'pyeeAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.pyeeBankName"),
          key: 'pyeeBankName',
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
          title: this.$t("m.i.ce.bailPcetStr"),
          key: 'bailPcet',
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.bailPcet != null && params.row.bailPcet !== ""){
              let rate = accMul(params.row.bailPcet, 100);
              let rateFormat = formatNumber(rate, 2, ',');
              return h("span", rateFormat);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guarntrAmt"),
          key: 'guarntrAmt',
          hiddenCol: false,
          sortable: true,
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
          title: this.$t("m.i.ce.guarntrNo"),
          key: "guarntrNo",
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showDueDeductAcct(params.row.id);
                }
              }
            }, '查看');
          }
        },
        {
          title: this.$t("m.i.ce.drwrAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.returnReason"),
          key: 'vochReturnReason',
          hiddenCol: false,
        },
      ];
      return {
        imageFormatType:['jpg','JPG','png','PNG','jpeg','JPEG'],
        showBillInfoWin: false,
        licenseFlag:false,
        authPath: this.$route.path ,
        billId: "",
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          batchNoLike:'',
          remitDt: '',
          acptType: '',
          billClass: 'ME01',
          acptStatus: '1',
          printStatus: '1',
          curFuncNo: 'PICE010403',
          acptTypeNotEqual : '2',
          isLock:'0',
          deductStatus: '0',
          printDt: window.sessionStorage.getItem("workDate"),
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          billNoLike: '',
          batchId: '',
          billClass: 'ME01',
          acptStatus: '1',
          printStatus: '1',
          curFuncNo: 'PICE010403',
          isLock:'0',
          printDt: window.sessionStorage.getItem("workDate"),
          reverseBillNo:''
        },
        batchInfoParams: {
          id: '',
          billClass: 'ME01',
          acptStatus: '1',
          printStatus: '1',
          billNoLike: "",
          curFuncNo: 'PICE010403',
          isLock:'0',
          printDt: window.sessionStorage.getItem("workDate"),
          reverseBillNo : ''
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        acptTypeList: [],
        dictMap: new Map(),
        batchId: "",
        currentSelectRow: [],
        billManagerCurrentSelectRow: [],
        mainVue: true,
        billManagerVue: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        imageUploadIsShow: true,
        //影像上传
        showUploadImageWin: false,
        imageParams: {
          imgTypeList: [],//影像类型数据字典
          id: '',
          acptId:"",
          prodNo:"02020211",
          imgType: "",
          imageUploadUrl: "/ce/acpt/paper/print/acptPrintBackMain/func_loadImgFileAndSaveWithProd",
          imgShowUrl: "/ce/acpt/paper/print/acptPrintBackMain/func_showAcptImgWithProd?id=",
          //分页查询
          imageUrl: "/ce/acpt/paper/print/acptPrintBackMain/func_pageQueryAcptImgWithProd",
          //删除
          imageDeleteUrl: "/ce/acpt/paper/print/acptPrintBackMain/func_deleteImage",
        },
        ifShowMore: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        authObject: {
          imageAdd: true,       //影像新增
          imageRegister: false,  //登记
          imageDelete: true     //删除
        },
        showParams: {
          listId:"",
        }
      }
    },
    mounted() {
      getDictListByGroups("AcptType").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.acptTypeList = this.acptTypeList.filter(item => item.key !== "2");
        this.dictMap = res.get("map");
      });
      //集中操作授权
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let columns=[]
            if (this.licenseFlag) {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.temp=deepClone(columns)
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      // this.getBusiParam();
    },
    methods: {
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },

      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
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
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = '';
          this.formItem.drwrAcctNo = '';
          this.formItem.acptProtocalNoLike = '';
          this.formItem.remitDt = '';
          this.formItem.acptType = '';
          this.formItem.ownedBrchNames = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.batchNoLike = "";
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
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if(this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //票据管理
      billManager() {
        if(this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.batchId = this.batchId;
        //集中授权参数赋值
        this.billManagerFormItem.licenseFlag=this.licenseFlag;
        this.billManagerFormItem.ownedBrchNo=this.currentSelectRow.ownedBrchNo;
        this.batchInfoParams.id = this.batchId;
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },
      //承兑协议编号超链接
      batchNoMain(str, ownedBrchNo) {
        this.batchId = str;
        this.billManagerFormItem.batchId = this.batchId;
        //集中授权参数赋值
        this.billManagerFormItem.licenseFlag=this.licenseFlag;
        this.billManagerFormItem.ownedBrchNo=ownedBrchNo;
        this.batchInfoParams.id = this.batchId;
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },



      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.billManagerCurrentSelectRow = [];
        this.batchInfoParams.billNoLike = this.billManagerFormItem.billNoLike;
        this.batchInfoParams.reverseBillNo = this.billManagerFormItem.reverseBillNo;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptBatchInfoDetail.getBatchInfo();
        })
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.billNoLike = '';
          this.billManagerFormItem.reverseBillNo = '';
          this.batchInfoParams.reverseBillNo = '';
        })
      },
      //行选中
      billManagerHandleRowClick(arr) {
        this.billManagerCurrentSelectRow = arr;
      },
      //凭证打印退回
      billPrintBack() {
        if(this.billManagerCurrentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let billId = this.billManagerCurrentSelectRow[0].id;
        post({batchId:this.batchId, ids : billId,licenseFlag :this.licenseFlag,
          ownedBrchNo :this.currentSelectRow.ownedBrchNo}, "/ce/acpt/paper/print/acptPrintBackMain/func_vochPrintReturn").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              if(this.$refs.billManagerDatagrid.total === 1) {
                this.returnMain();
              }else {
                this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                this.billManagerCurrentSelectRow = [];
                this.$refs.acptBatchInfoDetail.getBatchInfo();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

      // 校验登记状态
      validRgstStatus(){
        if(this.billManagerCurrentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let billId = this.billManagerCurrentSelectRow[0].id;
        post({batchId:this.batchId, ids : billId,licenseFlag :this.licenseFlag,
          ownedBrchNo :this.currentSelectRow.ownedBrchNo}, "/ce/acpt/paper/print/acptPrintBackMain/func_validRgstStatus").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              if(res.data.retData.validRgstResult == '1'){
                this.$hMsgBox.confirm({
                  title: '是否凭证退回',
                  content: "票据处于承兑登记申请待复核，是否确认退回?",
                  onOk: () => {
                    this.billPrintBack();
                  }
                });
              } else if(res.data.retData.validRgstResult == '0'){
                this.billPrintBack();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

      //影像上传
      imageUpload() {
        if(this.billManagerCurrentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.imageParams.id = this.billManagerCurrentSelectRow[0].id;
        this.imageParams.acptId = this.billManagerCurrentSelectRow[0].id;
        this.imageParams.imgTypeList.push({key: 'IM01', value: '承兑正面'});
        this.imageParams.imgTypeList.push({key: 'IM98', value: '承兑背面'});
        this.imageParams.imgTypeList.push({key: 'IM99', value: '承兑资料'});
        this.showUploadImageWin = true;
      },
      //影像关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList=[];
        this.billManagerHandleSearch();
      },
      //返回主页面
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = [];
        this.billManagerCurrentSelectRow = [];
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
        });
      },
    }
  };
</script>

<style scoped>

</style>
