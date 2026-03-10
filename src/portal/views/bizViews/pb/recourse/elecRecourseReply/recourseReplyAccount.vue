<!--同意清偿申请-同意清偿记账-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :validRules="billNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" :maxlength=60 :lengthByByte="false"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                  <h-input v-model="formItem.acptName" :maxlength=60 :lengthByByte="false"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.recourseName')" prop="recourseName">
                  <h-input v-model="formItem.recourseName" :maxlength=60 :lengthByByte="false"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.recourseDt')" prop="recourseDt">
                  <h-date-picker v-model="formItem.recourseDt" type="date" showFormat :editable=false placeholder="" ></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pb/recourse/recourseReplyAccount/func_queryAgreementForAcct"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recourseReplyAccout()" v-if="authObj.recourseReplyAccoutAuth">记账
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 分录弹框 -->
    <acct-record :param="acctRecordParam" :url="acctRecordUrl" :submitFlag="acctSubmitFlag"
                      :show-acct-record-win="showAcctRecordWin" @acctSubmitSure="acctSubmitSure"
                      @showAcctRecordWinClose="showAcctRecordWinClose"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>


  </div>
</template>

<script>
  import { on, off, post, formatNumber,formatBillRange,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseReplyAccount",
    data() {
      return {
        ifShowMore : false,
        showFileWin:false,
        fileBatchParams:{},
        filePathUrl:"/pb/recourse/recourseReplyAccount/",
        fileDetailStatusList:[],
        attTypeCodeList: [{key:'FT07',value:'其他'}],
        //给按钮增加权限
        authObj : {
          recourseReplyAccoutAuth: true           //同意清偿记账
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            key: "ownedBrchNo",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params);
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
            title: this.$t("m.i.common.showAttach"),
            key: "showAttach",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.billOrigin === 'CS01') {
                return h("span", "-")
              }
              return h('a', {
                on: {
                  click: () => {
                    this.showAttach(params)
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
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
            title: this.$t("m.i.bs.agreeAmtByUnit"),
            key: "agreeAmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let agreeAmt = formatNumber(params.row.agreeAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: agreeAmt
                }
              }, agreeAmt);
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.clearType'),
            key: "settleType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.settleType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
           title: this.$t("m.i.ce.agreeRemark"),
            key: "agreeRemark",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.bs.recourseMoneyByUnit"),
            key: "recourseAmt",
            hiddenCol: false,
            sortable: true,
            ellipsis: false,
            render: (h, params) => {
              let recourseAmt = formatNumber(params.row.recourseAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: recourseAmt
                }
              }, recourseAmt);
            }
          },
          {
            title: this.$t("m.i.ce.recourseDt"),
            key: "recourseDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.recourseDt == null ? "" : this.$moment(params.row.recourseDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.recourseName"),
            key: "recourseName",
            sortable: true,
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.recourseAcctNo"),
            key: "recourseAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.recourseBankNo"),
            key: "recourseBankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.recourseType"),
            key: "recourseType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RcrsTypeCode", params.row.recourseType);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.recourseReasonCode"),
            key: "recourseReasonCode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RecourseReasonCode", params.row.recourseReasonCode);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
            title: this.$t("m.i.ce.recourseRemark"),
            key: "recourseRemark",
            hiddenCol: false,
            ellipsis: false
          },
        ],
        formItem : {
          billOrigin: "",
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          billType: "",
          drwrName: "",
          acptName: "",
          recourseName: "",
          recourseDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        currentSelectRow : null,
        billTypeList : [],
        billOriginList: [],
        dictMap : new Map(),
        acctSubmitFlag : false,
        showAcctRecordWin : false,
        acctRecordParam : {},
        acctRecordUrl : "",
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart:"",
        billRangeEnd:"",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
      }
    },
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.formItem.recourseDt = this.formItem.recourseDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addForm.billId = "";
        this.addForm.id = "";
        this.$refs.addForm.resetFields();
      },
      formatAgreeAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.agreeAmt)) && isFinite(this.addForm.agreeAmt)) {
            this.addForm.agreeAmt = this.addForm.agreeAmt == null ? "0.00" : formatNumber(this.addForm.agreeAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.agreeAmt = this.addForm.agreeAmt.toString().replace(/,/g, "");
        }
      },
      //同意清偿记账
      recourseReplyAccout() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定记账吗?",
            onOk: () => {
              this.getEntryInfo();
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      //获取分录信息
      getEntryInfo() {
        this.acctRecordUrl = "/pb/recourse/elecRecourseReply/recourseReplyAccount/func_getRecourseRecord";
        this.acctRecordParam = {id: this.currentSelectRow.id, licenseFlag: this.licenseFlag};
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure() {
        let param = {id: this.currentSelectRow.id, licenseFlag: this.licenseFlag};
        this.acctSubmitFlag = true;
        post(param, "/pb/recourse/recourseReplyAccount/func_recourseAccount").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showAcctRecordWinClose();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(params){
        this.billId = params.row.billId;
        this.billNo = params.row.billNo;
        this.billRangeStart = params.row.billRangeStart;
        this.billRangeEnd = params.row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      // 打开附件弹窗
      showAttach(params) {
        this.fileBatchParams.operType = "show";
        this.fileBatchParams.busiId = params.row.id;
        this.fileBatchParams.attachBusiType = "recourseFile";
        this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
        this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
        this.showFileWin = true;
      },

      // 附件关闭
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsBillStatusCode,RcrsTypeCode,RecourseReasonCode,BillOrigin,SettleType,ClearType,BillOrigin,FileDetailStatus,AttTypeCode,PreRelationFlag").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billOriginList = res.get("BillOrigin");
        this.fileDetailStatusList = res.get("FileDetailStatus");
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
    }
  };
</script>

<style scoped>

</style>
