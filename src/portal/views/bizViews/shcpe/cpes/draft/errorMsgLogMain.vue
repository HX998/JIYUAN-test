<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')">
                    <h-input v-model="formItem.billNoLike" placeholder="" :maxlength="30"></h-input>
                  </h-form-item>
                  <!--子票区间-->
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <h-form-item prop="draftNo" label="报文编号">
                    <h-input v-model="formItem.draftNo" placeholder="" :maxlength="6"></h-input>
                  </h-form-item>
                  <h-form-item prop="originalDraftNo" label="原报文编号">
                    <h-input v-model="formItem.originalDraftNo" placeholder="" :maxlength="6"></h-input>
                  </h-form-item>
                  <!--<h-form-item prop="branchName" label="对手方名称">
                    <h-input v-model="formItem.branchName" readonly icon="android-search"
                             @on-click="queryBranchCode()" placeholder="" :title="formItem.branchName"></h-input>
                  </h-form-item>-->
                  <show-cpes-branch :label="'对手方名称'"
                                    :brchCode.sync="formItem.branchCode" :cpesBrchName.sync="formItem.branchName"
                                    datagridUrl="/cpes/branch/queryBranchList" prop="branchName"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                  <h-form-item prop="minCreDtTmStr" label="起始接收报文时间" :label-wrap="true">
                    <h-date-picker v-model="formItem.minCreDtTmStr" type="datetime" placeholder=""
                                   format="yyyy-MM-dd HH:mm:ss" showFormat :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="maxCreDtTmStr" label="截止接收报文时间" :label-wrap="true">
                    <h-date-picker v-model="formItem.maxCreDtTmStr" type="datetime" placeholder=""
                                   format="yyyy-MM-dd HH:mm:ss" showFormat :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="branchCode" v-show="false">
                    <h-input v-model="formItem.branchCode"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                      class="icon iconfont"
                      :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch">{{ $t("m.i.common.search") }}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{ $t("m.i.common.reset") }}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/draft/check/msgLogMain/func_queryErrorMsgByPage"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showInfo()">{{ $t("m.i.common.viewDatail") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box v-model="draftInfoWin" width="1000" :mask-closable="false" :maximize="true"
               @on-close="closeForm">
      <p slot="header">
        <span>报文详情</span>
      </p>
      <h-panel>
        <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item label="报文内容" prop="draftContent" class="h-form-height-auto">
              <textarea id="draftContentIdError" readonly rows="20"
                        style="overflow-y:auto;overflow-x:auto;width: 100%"></textarea>
              <!--<h-input v-model="draftInfoForm.draftContent" readonly type="textarea" :rows="10"></h-input>-->
            </h-form-item>
            <h-form-item class="no-label">
              <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
              <h-button type="primary" v-else @click="formAdd()">补收</h-button>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer"></div>
    </h-msg-box>
    <!--点击查看权限弹出窗-->
    <h-msg-box v-model="viewAuthWin" width="400" :mask-closable="false" @on-close="handleWinClose"
               :maximize="true">
      <p slot="header">
        <span>错误信息查看</span>
      </p>
      <div style="word-wrap: break-word;">{{ authContext }}</div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{ $t("m.i.common.close") }}</h-button>
      </div>
    </h-msg-box>
    <!--<show-cpes-branch :showCpesBranch="showCpesBranchWin" @showCpesBranchClose="showCpesBranchWinClose"
                      @showCpesBranchSubmit="showCpesBranchWinSubmit"></show-cpes-branch>-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
import {post, on, off, getDictListByGroups, formatBillRange} from "@/api/bizApi/commonUtil";

export default {
  name: "errorMsgLogMain",
  components: {
    //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)

  },
  data() {
    return {
      billId: "",
      billNo: "",
      billRangeStart: "",
      billRangeEnd: "",
      showBillInfoWin: false,
      formItem: {
        billNoLike: "",
        draftNo: "",
        originalDraftNo: "",
        branchName: "",
        minCreDtTm: "",
        minCreDtTmStr: "",
        maxCreDtTm: "",
        maxCreDtTmStr: "",
        branchCode: "",
        minBillRangeStart:"",
        maxBillRangeEnd:""
      },

      pageInfo: {
        pageNo: 1,
        pageSize: 10
      },
      draftInfoForm: {
        draftContent: "",
        creDtTm: ""
      },
      columns: [
        {
          type: "radio",
          title: " ",
          hiddenCol: false,
          align: "center",
          width: 60
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          align: "center",
          hiddenCol: false,
          width: 60
        },
        {
          title: this.$t("m.i.common.id"),
          key: "id",
          hiddenCol: true,
          align: "center"
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          align: "center",
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
          title: this.$t("m.i.common.draftNo"),
          key: "draftNo",
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.originalDraftNo"),
          key: "originalDraftNo",
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.errorMsg"),
          key: "errorMsg",
          align: "center",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.errorMsg == null || params.row.errorMsg === "") {
              return "";
            }
            return h("a", {
              on: {
                click: () => {
                  this.getAutolist(params.row.errorMsg);
                }
              }
            }, "查看错误信息");
          }
        },
        {
          title: this.$t("m.i.common.msgId"),
          key: "msgId",
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.originalMsgId"),
          key: "originalMsgId",
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.senderName"),
          key: "senderName",
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.receiverName"),
          key: "receiverName",
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.draftTime"),
          key: "draftTime",
          align: "center",
          hiddenCol: false,
          render: (h, params) => {
            if (null != params.row.draftTime && "" !== params.row.draftTime) {
              let dttm = this.$moment(params.row.draftTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", dttm);
            }
          }
        }
      ],
      authContext: null,
      viewAuthWin: false,
      currentSelectRow: null,
      dictMap: [],
      //showCpesBranchWin: false,
      moveUpDisabled: false,
      moveDownDisabled: false,
      ifShowMore: false,
      tableRef: "selfTable",
      submitFlag: false,
      draftInfoWin: false
    };
  },
  watch: {},

  computed: {},
  mounted() {
    getDictListByGroups("DraftDirection").then(res => {
      this.dictMap = res.get("map");
    });
  },
  methods: {
    handleWinClose() {
      this.authContext = "";
      this.viewAuthWin = false;
    },
    //查看权限弹窗
    getAutolist(value) {
      this.authContext = value;
      this.viewAuthWin = true;
    },
    /*queryBranchCode() {
      this.showCpesBranchWin = true;
    },*/
    /*showCpesBranchWinClose() {
      this.showCpesBranchWin = false;
    },*/
    showBillInfo(row) {
      this.billNo = row.billNo;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    /*showCpesBranchWinSubmit(info) {
      if (info === null) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        return;
      }
      this.formItem.branchCode = info.brchCode;
      this.formItem.branchName = info.brchFullNameZh;
      this.showCpesBranchWin = false;
    },*/
    handleSearch() {
      let minCreDtTmStr = this.formItem.minCreDtTmStr.replace(/-/g, "").replace(" ", "").replace(/:/g, "");
      let maxCreDtTmStr = this.formItem.maxCreDtTmStr.replace(/-/g, "").replace(" ", "").replace(/:/g, "");
      this.formItem.minCreDtTm = minCreDtTmStr;
      this.formItem.maxCreDtTm = maxCreDtTmStr;
      this.unDisabled();
      this.$refs.datagrid.dataChange(1);
    },
    unDisabled() {
      this.moveUpDisabled = false;
      this.moveDownDisabled = false;
    },
    //重置查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
      this.formItem.branchName = "";
      this.formItem.branchCode = "";
      this.formItem.minBillRangeStart = null;
      this.formItem.maxBillRangeEnd = null;
    },
    onCurrentChange(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = currentRow;
    },
    onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = null;
    },
    showInfo() {
      let selects = this.currentSelectRow;
      if (null === selects) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      this.draftInfoWin = true;
      post({id: selects.msgLogId}, "/shcpe/cpes/draft/check/msgLogMain/func_detailMessageInfo").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retData = res.data.retData;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$nextTick(() => {
              document.getElementById("draftContentIdError").innerHTML = retData == null ? "" : retData.draftContent;
              // this.draftInfoForm.draftContent = retData.draftContent;
            });
          } else {
            this.$msgTip.error(this, {info: msg});
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    closeForm() {
      this.draftInfoForm.draftContent = "";
      this.draftInfoForm.creDtTm = "";
      this.draftInfoWin = false;
    },
    formAdd() {
      let msg = document.getElementById("draftContentIdError").value;
      this.submitFlag = true;
      // msg = msg.replace(/[\r\n]/g, "\\n");
      post({message: msg}, "/shcpe/cpes/draft/addSubMessage").then(res => {
        this.submitFlag = false;
        if (res) {
          let msg = res.data.retMsg;
          let retData = res.data.retData;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, {info: this.$t("m.i.common.actionSuccess")});
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
