<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <!--票据来源-->
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney">
                  <h-row>
                    <h-col span="11">
                      <h-form-item prop="minBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-form-item prop="maxBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                  <h-date-picker :value="dueDate" format="yyyy-MM-dd" type="daterange" showFormat :options="dueDateOptions"
                                 :editable=false @on-change="handleDueDateChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item prop="riskStatus" :label="$t('m.i.billInfo.riskStatus')">
                  <h-select v-model="formItem.riskStatus" placeholder="" showTitle>
                    <h-option v-for="item in riskStatusList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.billInfo.ownershipBankName')" prop="ownershipBankName" class="h-form-long-label">
                  <h-input v-model="formItem.ownershipBrchCode" v-show="false"></h-input>
                  <h-input v-model="formItem.ownershipBankName" readonly icon="android-search"
                           @on-click="queryBranchCode()" placeholder=""
                           clearable @on-clear="clearVal('ownershipBankName')"></h-input>
                </h-form-item>-->

                <show-cpes-branch :label="$t('m.i.billInfo.ownershipBankName')" class="h-form-long-label"
                                  :brchCode.sync="formItem.ownershipBrchCode"  :cpesBrchName.sync="formItem.ownershipBankName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="ownershipBankName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

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
            url="/be/trust/recourse/pendingRecourseApplyBill/func_queryRecourseableDraft"
            :bindForm="formItem"
            :hasSelect="false" rowSelect
            :notSetWidth="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="submitToReview()">{{$t('m.i.be.recourseAppl')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--追索申请确认弹框-->
    <h-msg-box v-model="pendingRecourseApply" width="400" class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>追索申请意见描述</span>
      </p>
      <h-panel>
        <h-form :model="pendingRecourseApplyForm" :label-width="90" ref="pendingRecourseApplyForm" cols="1" class="h-form-search">
          <h-form-item label="备注" prop="recourseRemark" class="h-form-height-auto" :validRules="validRules">
            <h-input type="textarea" :rows="3" v-model="pendingRecourseApplyForm.recourseRemark"
                     :maxlength=300></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="pendingRecourseApplySubmit('close')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="pendingRecourseApplySubmit('submit')">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--<show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>-->
    <bill-info-main
      @billInfoWinClose="billInfoWinClose"
      :showBillInfoWin="showBillInfoWin"
      :billId="billId"
      :billNo="billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"
    ></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>

  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "pendingRecourseApplyBill",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
     // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    data() {
      let _this = this;
      return {
        showFileWin:false,
        fileBatchParams:{},
        filePathUrl:"/be/trust/recourse/pendingRecourseApplyBill/",
        fileDetailStatusList:[],
        attTypeCodeList: [{key:'FT07',value:'其他'}],
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            render: (h, params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            //fileManage
            title: this.$t("m.i.common.fileManage"),
            key: "fileManage",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.billOrigin === 'CS01') {
                return h("span", "-")
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showAttach(params)
                  }
                }
              }, "查看详情");
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
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
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let remitDt = params.row.remitDt == null ? "" :this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = params.row.dueDt == null ? "" :this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.ownershipBankName'),
            key: "ownershipBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.riskStatus'),
            key: "riskStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
        ],
        dueDate:[],
        dueDateOptions : {
          disabledDate (date) {
            return date && date.valueOf() >= _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
          }
        },
        formItem: {
          reverseBillNo: "",
          billOrigin:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          billClass: "",
          billType: "",
          riskStatus: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          dueDt: "",
          billMoney: "",
          dueDate: "",
          ownershipBankName: "",
          ownershipBrchCode: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          transNo: "NES.012.00.00P",
          prodNo: "01080500"
        },
        pendingRecourseApplyForm:{
          recourseRemark:"",
          ownedBrchNo: "",
          licenseFlag: false,
        },
        billClassList: [],
        billTypeList: [],
        dictMap: new Map(),
        riskStatusList: [],
        billOriginList: [],
        validRules: [{ test: this.validNote, trigger: "blur,change" }],
        showBillInfoWin: false,
        ifShowMore: false,
        //showCpesBranch: false,
        billNo: "",
        billId: "",
        billRangeStart:"",
        billRangeEnd:"",
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        pendingRecourseApply:false,
      };
    },
    methods: {
      pendingRecourseApplySubmit(str){
        if ("close" === str) {
          this.pendingRecourseApply = false;
          this.pendingRecourseApplyForm.recourseRemark="";
        } else if ("submit" === str) {
          this.$refs["pendingRecourseApplyForm"].validate(valid => {
            if(valid){
              this.submitRecheck();
              this.pendingRecourseApplyForm.recourseRemark="";
            }
          });
        }
      },
      showBillInfo(billInfo) {
        this.billId = billInfo.billId;
        this.billNo = billInfo.billNo;
        this.billRangeStart = billInfo.billRangeStart;
        this.billRangeEnd = billInfo.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      // 打开附件弹窗
      showAttach(params) {
        this.fileBatchParams.operType = "upload";
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
      },
      /*queryBranchCode() {
        this.showCpesBranch = true;
      },*/
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.formItem.ownershipBrchCode = info.brchCode;
        this.formItem.ownershipBankName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/
      handleDueDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.dueDate = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.ownershipBankName = "";
        this.formItem.ownershipBrchCode = "";
        this.$refs.formItem.resetFields();
      },
      //追索申请提交
      submitToReview() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }

        //授权时，批次选只能选相同机构
        let ownedBrchNo = "";
        let flag = true;
        list.forEach(row => {
          if (ownedBrchNo !== "" && ownedBrchNo !== row.ownedBrchNo) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
            return flag = false;
          }
          ownedBrchNo = row.ownedBrchNo;
        });
        this.pendingRecourseApplyForm.ownedBrchNo = ownedBrchNo;
        this.pendingRecourseApply = true;
      },
      submitRecheck() {
        let list = this.$refs.datagrid.selects;
        let hldrIdList = "";
        let billIdList = "";
        for (let i = 0; i < list.length; i++) {
          hldrIdList += list[i].hldrId;
          billIdList += list[i].billId;
          if (i < list.length - 1) {
            hldrIdList += ",";
            billIdList += ",";
          }
        }
        post({ hldrIdList: hldrIdList,billIdList: billIdList,recourseRemark: this.pendingRecourseApplyForm.recourseRemark,
          ownedBrchNo:this.pendingRecourseApplyForm.ownedBrchNo,licenseFlag:this.licenseFlag}, "/be/trust/recourse/pendingRecourseApplyBill/func_saveRecourseApplyBillSend").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.pendingRecourseApply=false;
            } else {
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: "操作失败" });
          }
        });
      },
      clearVal(type) {
        if (type == "ownershipBankName") {
          this.formItem.ownershipBrchCode = "";
          this.formItem.ownershipBankName = "";
        }
      },

      //根据弹框所选数据进行赋值
     /* brchNoChange(info) {
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
      },*/
      validNote(rule, val, callback){
        if(val === null || val === ""){
          callback();
          return;
        }
        let value = val.toString();
        if(value.length > 150){
          callback(new Error("备注字段输入不能超过150个文本"));
        }else{
          callback();
        }
      }
    },
    mounted() {
      this.getDictListByGroups("RiskStatus,CDMedia,DraftTypeCode,executeMode,delayKind,BillOrigin,FileDetailStatus,AttTypeCode,PreRelationFlag").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.riskStatusList = res.get("RiskStatus");
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
