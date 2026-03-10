<!--追索申请-发出追索-->
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
                <h-form-item :label="$t('m.i.ce.recourseType')" prop="recourseType">
                  <h-select v-model="formItem.recourseType" placeholder="" showTitle>
                    <h-option v-for="item in recourseTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <!--票据来源-->
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo" :validRules="billNoRule">
                  <h-input v-model="formItem.reverseBillNo" :maxlength="30"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" :maxlength="120"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                  <h-input v-model="formItem.acptName" :maxlength="120"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.isRecourse')" prop="isRecourse">
                  <h-select v-model="formItem.isRecourse" placeholder="" showTitle>
                    <h-option v-for="item in isRecourseList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
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
            url="/pb/recourse/elecRecourseApply/recourseApply/func_queryRecourseableDraft"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recourseApply()" v-if="authObj.recourseApplyAuth">发起追索</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <recourse-apply-detail-ecds :addOrEditWin="showRecoursesEcds" :recourseReasonCodeList="this.recourseReasonCodeList" :recourseTypeList="this.recourseTypeList" :billOriginList="this.billOriginList"
                                :dictMap="this.dictMap" :addForm="this.addForm" @handleWinClose="handleWinClose"/>
    <recourse-apply-detail-cpes :addOrEditWin="showRecoursesCpes" :rcvgDistTypeList="this.rcvgDistTypeList" :recourseTypeList="this.recourseTypeList" :billOriginList="this.billOriginList"
                                :dictMap="this.dictMap" :addForm="this.addForm" @handleWinClose="handleWinClose"/>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>

  </div>
</template>

<script>
  import { on, off, post, formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseApply",
    data() {
      return {
        ifShowMore : false,
        showRecoursesEcds:false,
        showRecoursesCpes:false,
        showFileWin:false,
        fileBatchParams:{},
        filePathUrl:"/pb/recourse/elecRecourseApply/recourseApply/",
        fileDetailStatusList:[],
        attTypeCodeList: [{key:'FT07',value:'其他'}],
        //给按钮增加权限
        authObj : {
          recourseApplyAuth: true           //发起追索
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
            key: "hldrBrchNo",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "hldrBankName",
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
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
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
/*          {
            title: this.$t("m.i.billInfo.ecdsBillStatus"),
            key: "ecdsBillStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "EcdsBillStatusCode", params.row.ecdsBillStatus);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },*/
          {
            title: this.$t("m.i.ce.recourseType"),
            key: "recourseType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.ce.isRecourse"),
            key: "isRecourse",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isRecourse);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          }
        ],
        formItem : {
          recourseType: "",
          reverseBillNo: "",
          billOrigin:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          billType: "",
          drwrName: "",
          acptName: "",
          isRecourse: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          billClass: "ME02",
          authPath: this.$route.path
        },
        addForm : {
          billNo: "",
          billId: "",
          hldrId: "",
          billOrigin:"",
          billRangeStart: "",
          billRangeEnd: "",
          recourseType: "",
          recourseAmt: "",
          hldrBrchNo: "",
          billMoney: "",
          recourseDt : this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD"),
          isRecourse: "",
          ownedBrchNo: "",
          ownedBrchName: "",
          cirStatus:"",
          licenseFlag: false
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        currentSelectRow : null,
        recourseTypeList : [],
        rcvgDistTypeList: [],
        billTypeList : [],
        isRecourseList : [],
        recourseReasonCodeList : [],
        billOriginList:[],
        dictMap : new Map(),
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
      RecourseApplyDetailEcds: () => import(/* webpackChunkName: "pb/recourse/elecRecourseApply/recourseApplyDetailEcds" */ '@/views/bizViews/pb/recourse/elecRecourseApply/recourseApplyDetailEcds'),
      RecourseApplyDetailCpes: () => import(/* webpackChunkName: "pb/recourse/elecRecourseApply/recourseApplyDetailCpes" */ '@/views/bizViews/pb/recourse/elecRecourseApply/recourseApplyDetailCpes'),
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),

    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
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
        this.addForm.billNo = "";
        this.addForm.billId = "";
        this.addForm.hldrId =  "";
        this.addForm.cirStatus = "";
        this.addForm.isRecourse = "";
        this.addForm.recourseType = "";
        this.addForm.ownedBrchNo = "";
        this.addForm.billRangeStart = "";
        this.addForm.billRangeEnd = "";
        this.addForm.billMoney = "";
        this.addForm.hldrBrchNo = "";
        this.addForm.applyDt = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD");
        this.showRecoursesEcds = false;
        this.showRecoursesCpes = false;
        this.formSearch();
      },

      // 发起追索
      recourseApply() {
        if (this.currentSelectRow == null || this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }
        post({code:this.currentSelectRow.billOrigin}, "/pb/recourse/elecRecourseApply/recourseApply/func_isEcdsChannelAvailable").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            debugger;
            if (retCode === "000000") {
              this.addForm.billNo = this.currentSelectRow.billNo;
              this.addForm.billId = this.currentSelectRow.billId;
              this.addForm.hldrId =  this.currentSelectRow.hldrId;
              this.addForm.cirStatus = this.currentSelectRow.cirStatus;
              this.addForm.isRecourse = this.currentSelectRow.isRecourse;
              this.addForm.recourseType = this.currentSelectRow.recourseType;
              this.addForm.ownedBrchNo = this.currentSelectRow.hldrBrchNo;
              this.addForm.ownedBrchName = this.currentSelectRow.hldrBankName;
              this.addForm.hldrBrchNo = this.currentSelectRow.hldrBrchNo;
              this.addForm.billOrigin = this.currentSelectRow.billOrigin;
              this.addForm.licenseFlag = this.licenseFlag;
              this.addForm.billRangeStart = this.currentSelectRow.billRangeStart;
              this.addForm.billRangeEnd = this.currentSelectRow.billRangeEnd;
              this.addForm.billMoney = this.currentSelectRow.billMoney == null ? "0.00" : formatNumber(this.currentSelectRow.billMoney, 2, ",");
              this.addForm.recourseAmt = this.addForm.billMoney;
              if (this.currentSelectRow.applyDt != null && this.currentSelectRow.applyDt !== "") {
                this.addForm.recourseDt = this.$moment(this.currentSelectRow.applyDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              if (res.data.retData) {
                // ecds
                this.showRecoursesEcds = true;
              } else {
                // cpes
                this.showRecoursesCpes = true;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        });
      },

      billInfoWinClose(){
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billInfo) {
        this.billId = billInfo.billId;
        this.billNo = billInfo.billNo;
        this.billRangeStart = billInfo.billRangeStart;
        this.billRangeEnd = billInfo.billRangeEnd;
        this.showBillInfoWin = true;
      },

      // 打开附件弹窗
      showAttach(params) {
        this.fileBatchParams.operType = "upload";
        this.fileBatchParams.busiId = params.row.hldrId;
        this.fileBatchParams.attachBusiType = "recourseFile";
        this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
        this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
        this.fileBatchParams.maxSize = 3072;
        this.showFileWin = true;
      },

      // 附件关闭
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsBillStatusCode,partnerType,RecourseReasonCode,BillOrigin,RcrsTypeCode,DistTypeCode,FileDetailStatus,AttTypeCode,PreRelationFlag").then(res => {
        this.recourseTypeList = res.get("RcrsTypeCode");
        this.billTypeList = res.get("DraftTypeCode");
        this.isRecourseList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.recourseReasonCodeList = res.get("RecourseReasonCode");
        this.rcvgDistTypeList = res.get("DistTypeCode");
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
