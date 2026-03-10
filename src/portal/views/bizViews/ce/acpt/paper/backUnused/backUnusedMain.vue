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
                  <h-radio-group v-model="isCommit">
                    <h-radio label="noCommit" @on-click="noCommitButton">
                      <span>{{$t('m.i.ce.noCommit')}}</span>
                    </h-radio>
                    <h-radio label="hasCommit" @on-click="hasCommitButton">
                      <span>{{$t('m.i.ce.hasCommit')}}</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
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
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleRemitDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="formItem.dueDt" placeholder="" @on-change="handleDueDtChange" :editable=false></h-date-picker>
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
                      :url="url"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="imageUpload" v-if="isShowImageButton" :disabled="isCommit === 'hasCommit'">{{$t('m.i.common.uploadImg')}}</h-button>
              <h-button type="primary" @click="backUnused" :disabled="isCommit === 'hasCommit'">{{$t('m.i.ce.backUnused')}}</h-button>
              <h-button type="primary" @click="backUnusedCancel()" :disabled="isCommit === 'noCommit'">{{$t("m.i.common.cancel")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!-- 信息登记弹窗 -->
        <h-msg-box v-model="infoRegisterWin" width="400" @on-close="infoRegisterWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>未用退回信息登记</span>
          </p>
          <div>
            <h-form :model="infoRegisterForm" :label-width="130" ref="infoRegisterForm" cols="1" class="h-form-search">
              <h-form-item prop="drwgBackReason" :label="$t('m.i.ce.drwgBackReason')" required>
                <h-input v-model="infoRegisterForm.drwgBackReason" placeholder="" :maxlength="150" :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="isReturnIssueFee" :label="$t('m.i.ce.isRetureSignFee')" v-if="hiddenControl" required>
                <h-select v-model="infoRegisterForm.isReturnIssueFee" placeholder="" :readonly="busiControl" >
                  <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="infoRegisterWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="infoRegisterSubmit()">{{$t("m.i.common.confirm")}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

        <image-loading
          :imageWin="imageWin"
          :imageParams="imageParams"
          :isShow="false"
          :isShowSearch="false"
          :isShowReset="false"
          :isShowDealPrcMsg="false"
          :isShowImgBatchNo="false"
          :authObj="authObject"
          :format="['jpg','JPG','png','PNG','jpeg','JPEG']"
          @imageWinClose="imageWinClose"></image-loading>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "backUnusedMain",
    components: {
    },
    data() {
      return {
        imageWin: false,
        isCommit: "noCommit",
        url:"/ce/acpt/paper/backUnused/backUnusedMain/func_pageQueryAcptDrwgBack",
        isShowImageButton: false,
        showBillInfoWin: false,
        licenseFlag:false,
        authPath: this.$route.path ,
        ownedBrchNo:"",
        billId: "",
        isReturnIssueFeeDefaultValue: "0",
        authObject: {
          imageAdd: true,       //影像新增
          imageRegister: false,  //登记
          imageDelete: true     //删除
        },
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          billNoLike: '',
          acptProtocalNoLike: '',
          remitDt: '',
          dueDt: '',
          billClass: 'ME01',
          acptStatus: '1',
          drwgBackStatusList: 'DB00,DB07',
          curFuncNo : 'PICE010503',
          isLock:'0',
          inOutFlag: '1', //进场内票据不查询
          licenseFlag:this.licenseFlag,
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          sort:"",
          applTellerNoNotEqual:"",
          auditModeKey:"",
          reverseBillNo: ''
        },
        infoRegisterForm: {
          id: '',
          drwgBackReason: '未用退回',
          isReturnIssueFee: '',
          billClass: 'ME01',
          licenseFlag:this.licenseFlag,
          ownedBrchNo:""
        },
        columns: [
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
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.riskStatus"),
            key: 'riskStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
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
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
            sortable: true,
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
          }
        ],
        busiControl: false,
        hiddenControl: true,
        YonList: [],
        dictMap: new Map(),
        submitFlag: false,
        currentSelectRow: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        infoRegisterWin: false,
        ifShowMore: false,

        imageParams: {
          id: '',
          prodNo:"01010311",
          imgType: "IM01",
          acptId:"",
          imageDeleteUrl:"/ce/acpt/paper/backUnused/backUnusedMain/func_deleteImage",
          imageUrl:"/ce/acpt/paper/backUnused/backUnusedMain/func_pageQueryAcptImgWithProd",
          imageUploadUrl: "/ce/acpt/paper/backUnused/backUnusedMain/func_loadImgFileAndSaveWithProd",
          imgShowUrl: "/ce/acpt/paper/backUnused/backUnusedMain/func_showAcptImgWithProd?id=",
          licenseFlag:"",
          ownedBrchNo:""
        }
      }
    },
    mounted() {
      getDictListByGroups("Yon,AcptType,DraftTypeCode,RiskStatus").then(res => {
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            this.formItem.licenseFlag = this.licenseFlag;
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
      this.queryIsShowImageButton();
      this.queryBusiParamDefaultValue();
      this.queryBusiParamIsReadonly();
    },
    methods: {
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
      imageWinClose() {
        this.imageWin = false;
        this.imageParams.id = "";
      },
      //查询业务参数  是否需要影像上传
      queryIsShowImageButton() {
        post({paramKey: "ce.acpt.drwgback.is_need_img"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isReadonly = res.data.retData;
              if(isReadonly === "0") {
                this.isShowImageButton = false;
              }else {
                this.isShowImageButton = true;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //查询业务参数
      queryBusiParamDefaultValue() {
        post({paramKey: "ce.acpt.drwgback.is_set_refunds_option"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData!=null){
                this.isReturnIssueFeeDefaultValue = res.data.retData;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryBusiParamIsReadonly() {
        post({paramKey: "ce.acpt.drwgback.is_modify_refunds_option"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isReadonly = res.data.retData;
                if(isReadonly === "0") {//不可修改
                  this.busiControl = true;
                }else if(isReadonly === "1") {//可修改
                  this.busiControl = false;
                }else if(isReadonly === "2"){//代表需要隐藏
                  this.hiddenControl = false;
                }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleRemitDtChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value) {
        this.formItem.dueDt = value.replace(/-/g, "");
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
          this.formItem.billNoLike = '';
          this.formItem.acptProtocalNoLike = '';
          this.formItem.remitDt = '';
          this.formItem.dueDt = '';
          this.formItem.ownedBrchNames = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.reverseBillNo = '';
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
        if (this.formItem.drwrCustNo === "") {
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
      //影像上传
      imageUpload() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.imageParams.id = this.currentSelectRow.id;
        this.imageParams.acptId = this.currentSelectRow.id;
        this.imageParams.imgType = "IM01";
        this.imageParams.licenseFlag = this.licenseFlag;
        this.imageParams.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
        this.imageWin = true;
      },
      //撤销
      backUnusedCancel() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定撤销未用退回申请吗?",
            onOk: () => {
              this.handleCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleCancel() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$loadingbox.open({
          title: "提交中，请稍后..."
        });
        post({ids: this.currentSelectRow.id, billOperType: "2"}, "/ce/acpt/paper/backUnused/backUnusedRecheck/func_acptDrwgBackApplyCheck").then(res => {
          if (res) {
            this.$loadingbox.close();
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$loadingbox.close();
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //未提交
      noCommitButton() {
        this.isCommit = "noCommit";
        this.url = "/ce/acpt/paper/backUnused/backUnusedMain/func_pageQueryAcptDrwgBack";
        this.formItem.drwgBackStatusList= 'DB00,DB07';
        this.formItem.curFuncNo = 'PICE010503';
        this.formItem.isLock='0';
        this.formItem.inOutFlag= '1'; //进场内票据不查询
        this.formItem.licenseFlag=this.licenseFlag;
        this.formItem.authPath=this.$route.path;
        this.formItem.sort="";
        this.formItem.auditModeKey = "";
        this.formItem.applTellerNoNotEqual = "";
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.isCommit = "hasCommit";
        this.url = "/ce/acpt/paper/backUnused/backUnusedRecheck/func_pageQueryAcptDrwgBack";
        this.formItem.drwgBackStatusList= 'DB01';
        this.formItem.isLock='1';
        this.formItem.curFuncNo = 'PICE010505';
        this.formItem.sort='update_time';
        this.formItem.licenseFlag="";
        this.formItem.authPath="";
        this.formItem.ownedBrchNos="";
        this.formItem.ownedBrchNames="";
        this.handleSearch();
      },
      //信息登记
      infoRegister() {
        this.infoRegisterForm.isReturnIssueFee = this.isReturnIssueFeeDefaultValue;
        this.infoRegisterForm.id = this.currentSelectRow.id;
        this.infoRegisterForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
        this.infoRegisterForm.licenseFlag = this.licenseFlag;
        this.infoRegisterWin = true;
      },
      //信息登记弹窗
      //登记
      infoRegisterSubmit() {
        if(this.isShowImageButton) {
          this.queryIsHasImage();
        }else {
          this.validRgstStatus();
        }
      },
      infoRegisterSubmitNext() {
        this.$refs["infoRegisterForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/ce/acpt/paper/backUnused/backUnusedMain/func_acptDrwgBackApply";
            post(this.infoRegisterForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.infoRegisterWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //关闭
      infoRegisterWinClose() {
        this.infoRegisterWin = false;
        this.$refs.infoRegisterForm.resetFields();
        this.infoRegisterForm.ids = '';
      },
      //未用退回
      backUnused() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.infoRegister();
      },
      backUnusedSubmit() {
        this.$loadingbox.open({
          title: "提交中，请稍后..."
        });
        post({id: this.currentSelectRow.id}, "/ce/acpt/paper/backUnused/backUnusedMain/func_acptDrwgBackApply").then(res => {
          this.submitFlag = true;
          if (res) {
            this.$loadingbox.close();
            this.submitFlag = false;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$loadingbox.close();
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      // 校验登记状态
      validRgstStatus(){
        let billId = this.currentSelectRow.id;
        post({ids : billId}, "/ce/acpt/paper/backUnused/backUnusedMain/func_validRgstStatus").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              if(res.data.retData.validRgstResult == '1'){
                this.$hMsgBox.confirm({
                  title: '是否未用退回',
                  content: "票据处于承兑登记申请待复核，是否确认提交未用退回?",
                  onOk: () => {
                    this.infoRegisterSubmitNext();
                  }
                });
              } else if(res.data.retData.validRgstResult == '0'){
                this.infoRegisterSubmitNext();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

      //查询是否已影像上传
      queryIsHasImage() {
        post({ listId: this.currentSelectRow.id, prodNo: "01010311", pageSize: 999},"/pc/img/imgUpRegister/findCrowdGroupByPage").then(res => {
            if(res){
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if(retCode === "000000" ){
                if (res.data.retData.list.length === 0) {
                  this.$hMsgBox.confirm({
                    title: '确认',
                    content: '未进行影像上传，请先上传影像！',
                    onOk: () => {
                      this.imageUpload();
                    }
                  });
                }else {
                  this.validRgstStatus();
                }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError")});
            }
          }
        )
      }
    }
  };
</script>


