<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="isCommit" :label="$t('m.i.ce.isCommit')">
                  <h-radio-group v-model="formItem.isCommit">
                    <h-radio label="noCommit" @on-click="noCommitButton">
                      <span>{{$t("m.i.ce.noCommit")}}</span>
                    </h-radio>
                    <h-radio label="hasCommit" @on-click="hasCommitButton">
                      <span>{{$t("m.i.ce.hasCommit")}}</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
             <!--   <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.cfmAppType')" prop="cfmAppType">
                  <h-select v-model="formItem.cfmAppType" placeholder="" showTitle>
                    <h-option v-for="item in cfmAppTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <bill-money :formItem="formItem"></bill-money>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
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
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/be/barter/payment/payConfirmResponseMain/func_pageQueryPayConfirmRespList"
            highlightRow
            :bindForm="formItem"
            :hasSelect = false
            :rowSelect = true
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="auditPass" :disabled="formItem.isCommit === 'hasCommit'">{{$t('m.i.be.auditPass')}}</h-button>
              <h-button type="primary" @click="refuse" :disabled="formItem.isCommit === 'hasCommit'">{{$t('m.i.be.refuse')}}</h-button>
              <h-button type="primary" @click="viewImage" :disabled="formItem.isCommit === 'hasCommit'">{{$t('m.i.common.showImg')}}</h-button>
              <h-button type="primary" @click="cancel" :disabled="formItem.isCommit === 'noCommit'">{{$t("m.i.common.cancel")}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 审批通过弹窗 -->
        <h-msg-box v-model="auditPassWin" width="400" @on-close="auditPassWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>审批通过意见描述</span>
          </p>
          <div>
            <h-form :model="auditPassForm" :label-width="130" ref="auditPassForm" cols="1" class="h-form-search">
              <h-form-item prop="cfmAppOpin" :label="$t('m.i.billInfo.cfmAppOpin')" class="h-form-height-auto">
                <h-input v-model="auditPassForm.cfmAppOpin" placeholder="" type="textarea" :maxlength=150 :autosize="{minRows: 2, maxRows: 4}"></h-input>
              </h-form-item>
              <h-form-item prop="respRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
                <h-input v-model="auditPassForm.respRemark" placeholder="" type="textarea" :maxlength=150 :lengthByByte="false" :autosize="{minRows: 2, maxRows: 4}"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="auditPassWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="submitPayConfirm()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 拒绝弹窗 -->
        <h-msg-box v-model="refuseWin" width="400" @on-close="refuseWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>拒绝意见描述</span>
          </p>
          <div>
            <h-form :model="refuseForm" :label-width="130" ref="refuseForm" cols="1" class="h-form-search"
                    onlyBlurRequire>
              <h-form-item prop="cfmAppRefuseCode" :label="$t('m.i.be.cfmAppRefuseCode')" required>
                <h-select v-model="refuseForm.cfmAppRefuseCode" placeholder="" showTitle>
                  <h-option value="RR02" v-show="RR02Show">拒绝(需补录资料)</h-option>
                  <h-option value="RR03" v-show="RR03Show">拒绝(需实物验证)</h-option>
                  <h-option value="RR05" v-show="RR05Show">拒绝(真伪存疑)</h-option>
                  <!--<h-option v-for="item in cfmAppRefuseCodeList" :value="item.key" :key="item.key">{{item.value}}</h-option>-->
                </h-select>
              </h-form-item>
              <h-form-item prop="cfmAppOpin" :label="$t('m.i.billInfo.cfmAppOpin')" class="h-form-height-auto">
                <h-input v-model="refuseForm.cfmAppOpin" placeholder="" type="textarea" :maxlength=150 :autosize="{minRows: 2, maxRows: 4}"></h-input>
              </h-form-item>
              <h-form-item prop="respRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
                <h-input v-model="refuseForm.respRemark" placeholder="" type="textarea" :maxlength=150 :lengthByByte="false" :autosize="{minRows: 2, maxRows: 4}"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="refuseWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="refuseWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 影像信息界面-->
        <show-image-info :show-upload-image-win="showUploadImageWin"
                         :params="imageParams"
                         :isShowInfo="false"
                         @uploadImageWinClose="uploadImageWinClose"></show-image-info>

      </h-col>
    </h-row>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

  <!--  <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "payConfirmResponseMain",
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
    },
    data() {
      return {
          showBillInfoWin: false,
          billId: "",
          billNo: "",
        formItem: {
          cfmAppType: "",
          billNo: "",
          likeBillNo: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          isCommit: "noCommit",
          authPath: this.$route.path,
          billStatusList: "RV10,RV12,RV08" //待应答\应答失败\审批不通过
        },
        auditPassForm: {
          ids: "",
          cfmAppOpin: "",
          respRemark: "",
          licenseFlag:"",
        },
        refuseForm: {
          ids: "",
          cfmAppRefuseCode: "",
          cfmAppOpin: "",
          respRemark: "",
          licenseFlag:"",
        },
        cancelForm:{
          ids: ""
        },
        columns: [
          {
            type: "selection",
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
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", applDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
              render: (h, params) => {
                  let info = "", type = "";
                  if (!!params.row.billId) {
                      info = params.row.billId;
                      type = "billId";
                  } else {
                      info = params.row.billNo;
                      type = "billNo";
                  }
                  return h("a", {
                      on: {
                          click: () => {
                              this.showBillInfo(info, type);
                          }
                      }
                  }, params.row.billNo);
              }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
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
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
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
            title: this.$t('m.i.billInfo.cfmAppType'),
            key: "cfmAppType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CfmAppType", params.row.cfmAppType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "viewImage",
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
                      this.openImgWin(params.row.id);
                    }
                  }
                }, this.$t("m.i.common.showImg"))
              ]);
            }
          },
          {
            title: this.$t('m.i.be.cfmAppReqType'),
            key: "cfmAppReqType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CfmAppReqType", params.row.cfmAppReqType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.applBrchCode'),
            key: "applBrchCode",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.applBrchName'),
            key: "applBrchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptAcctNo'),
            key: "acptAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.reqRemark'),
            key: "reqRemark",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: "billStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.billStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }

        ],
        RR02Show: true,
        RR03Show: true,
        RR05Show: true,
        dueDt: [],
        currentSelectList: [],
        dictMap: new Map(),
        billTypeList: [],
        cfmAppRefuseCodeList: [],
        cfmAppTypeList: [],
        auditPassWin: false,
        refuseWin: false,
        submitFlag: false,
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        confirmType:"",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        //影像上传
        showUploadImageWin: false,
        imageParams: {
          id: "",
          pageSearchUrl: "/be/barter/payment/payConfirmResponseMain/func_pageQueryPayConfirmRespImgList", //分页查询url
          imageSearchUrl: "/be/barter/payment/payConfirmResponseMain/func_queryCpesImgage", //影像查询url
          imgShowUrl:"/be/barter/payment/payConfirmResponseMain/func_showImgage?id=", //查看url
        }
      };
    },
    computed: {
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,RefuseReason,CfmAppType,CfmAppReqType,BarterTrustStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.cfmAppRefuseCodeList = res.get("RefuseReason");
        this.cfmAppTypeList = res.get("CfmAppType");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
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
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    watch: {},
    methods: {
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      //未提交
      noCommitButton() {
        this.formItem.isCommit = "noCommit";
        this.formItem.billStatusList = "RV10,RV12,RV08";
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.formItem.isCommit = "hasCommit";
        this.formItem.billStatusList = "RV05";
        this.handleSearch();
      },
      //表单查询
      handleSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.ownedBrchNo = "";
          this.formItem.ownedBrchName = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.ownedBrchNames = "";
          this.dueDt = null;
          this.formItem.minDueDt = null;
          this.formItem.maxDueDt = null;
          this.$refs.formItem.resetFields();
          this.noCommitButton();
        });
      },
      //行选中
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },
      //审批通过
      auditPass() {
        let selects = this.$refs.datagrid.selects;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let cfmAppType=selects[0].cfmAppType;
        for (let i=1;i<selects.length;i++){
          if (selects[i].cfmAppType!=cfmAppType){
            this.$msgTip.info(this, { info: "影像验证和实物验证类型不能同批次审批" });
            return;
          }
        }
        this.confirmType = cfmAppType=="VM01"?"影像验证":"实物验证";
        this.auditPassWin = true;
      },
      cancel(){
        let selects = this.$refs.datagrid.selects;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.$refs.datagrid.selects !== null) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定撤销吗?",
            onOk: () => {
              this.handleCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleCancel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.cancelForm.ids = ids;
        post({ ids: ids }, "/be/barter/payment/payConfirmResponseMain/func_payConfirmRespAuditCheckCancel").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.hasCommitButton();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //审批通过
      submitPayConfirm() {
        let content;
        if (this.confirmType==="实物验证") {
          content = "承兑付款确认申请类型为"+"["+this.confirmType+"]"+",是否已完成实物验证并确认提交?";
        } else {
          content = "承兑付款确认申请类型为"+"["+this.confirmType+"]"+",是否确认提交?";
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            this.auditPassWinSubmit();
          }
        });
      },
      //审批通过弹窗确定
      auditPassWinSubmit() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.auditPassForm.ids = ids;
        this.auditPassForm.licenseFlag = this.licenseFlag;
        this.$refs["auditPassForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/be/barter/payment/payConfirmResponseMain/func_payConfirmRespAuditCheck";
            post(this.auditPassForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.auditPassWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.noCommitButton();
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
      //审批通过弹窗关闭
      auditPassWinClose() {
        this.$refs.auditPassForm.resetFields();
        this.auditPassWin = false;
      },
      //拒绝
      refuse() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let cfmAppType=list[0].cfmAppType;
        for (let i=1;i<list.length;i++){
          if (list[i].cfmAppType!=cfmAppType){
            this.$msgTip.info(this, { info: "影像验证和实物验证类型不能同批次审批" });
            return;
          }
        }
        this.confirmType = cfmAppType==="VM01"?"影像验证":"实物验证";

        this.RR02Show = true;
        this.RR03Show = true;
        this.RR05Show = true;
        if (cfmAppType === "VM01") {
          this.RR05Show = false;
        } else if (cfmAppType === "VM02") {
          this.RR03Show = false;
        }
        this.refuseWin = true;
      },
      //拒绝弹窗确定
      refuseWinSubmit() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.refuseForm.ids = ids;
        this.refuseForm.licenseFlag = this.licenseFlag;
        this.$refs["refuseForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/be/barter/payment/payConfirmResponseMain/func_payConfirmRespAuditCheck";
            post(this.refuseForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.refuseWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.noCommitButton();
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
      //拒绝弹窗关闭
      refuseWinClose() {
        this.$refs.refuseForm.resetFields();
        this.refuseWin = false;
      },
      //查看影像
      viewImage() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.imageParams.id = list[0].id;
        this.showUploadImageWin = true;
      },
      //影像维护弹窗
      openImgWin(str) {
        this.imageParams.id = str;
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
      },
        //票面
        billInfoWinClose(){
            this.showBillInfoWin = false;
        },
        showBillInfo(info, type) {
            this.billId = "";
            this.billNo = "";
            if (type === "billId") {
                this.billId = info;
            } else {
                this.billNo = info;
            }
            this.showBillInfoWin = true;
        },

     /* //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      }*/

    }
  };
</script>

<style scoped>

</style>
