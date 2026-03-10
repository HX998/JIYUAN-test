<!--发出查询跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pe.rcvMemberId')" prop="rcvMemberId" v-if="false">
                  <h-input v-model="formItem.rcvMemberId" :maxlength="6"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.rcvMemberName')" prop="rcvMemberName">
                  <h-input v-model="formItem.rcvMemberName" readonly
                           icon="android-search" @on-click="queryApplMemberName()" :maxlength="60" clearable
                           @on-clear="clearRcvMemberName()"></h-input>
                </h-form-item>
               <!-- <h-form-item :label="$t('m.i.pe.rcvBrchCode')" prop="rcvBrchCode" v-if="false">
                  <h-input v-model="formItem.rcvBrchCode" :maxlength="9"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.rcvBrchName')" prop="rcvBrchName">
                  <h-input v-model="formItem.rcvBrchName" readonly
                           icon="android-search" @on-click="queryApplBrchName('query')" :maxlength="60" clearable
                           @on-clear="clearRcvBrchName('query')"></h-input>
                </h-form-item>-->
                <show-cpes-branch v-model="formItem.rcvBrchCode" :label="$t('m.i.pe.rcvBrchCode')"
                                  :brchCode.sync="formItem.rcvBrchCode"  :cpesBrchName.sync="formItem.rcvBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="rcvBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.common.queryDt')" prop="queryDt">
                  <h-date-picker v-model="formItem.queryDt" type="date" placeholder=""
                                 :editable=false :showFormat=true @on-change="handleQueryDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.replyDt')" prop="answerDt">
                  <h-date-picker v-model="formItem.answerDt" type="date" placeholder=""
                                 :editable=false :showFormat=true @on-change="handleAnswerDtChange"></h-date-picker>
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
            url="/pe/inqrep/queryAnswer/inquiryStackQuery"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleQuery('reply')" v-if="authObj.replyAuth">
                {{$t("m.i.pe.replyAuth")}}
              </h-button>
              <h-button type="primary" @click="handleQuery('showInquiry')" v-if="authObj.inquiryDetail">
                {{$t("m.i.pe.inquiryDetail")}}
              </h-button>
              <h-button type="primary" @click="handleQuery('showReply')" v-if="authObj.replyDetail">
                {{$t("m.i.pe.replyDetail")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--查看查询/查复书弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='reply'">{{$t("m.i.pe.replyAuth")}}</span>
        <span v-if="type==='showInquiry'">{{$t("m.i.pe.inquiryDetail")}}</span>
        <span v-if="type==='showReply'">{{$t("m.i.pe.replyDetail")}}</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pe.applMemberId')" prop="applMemberId" v-show="false">
            <h-input v-model="addForm.applMemberId" readonly :maxlength="6"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.applMemberName')" prop="applMemberName">
            <h-input v-model="addForm.applMemberName" readonly :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.applBrchName')" prop="applBrchCode" v-show="false">
            <h-input v-model="addForm.applBrchCode" readonly :maxlength="9"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.applBrchName')" prop="applBrchName">
            <h-input v-model="addForm.applBrchName" readonly :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.rcvBrchCode')" prop="rcvBrchCode" v-show="false">
            <h-input v-model="addForm.rcvBrchCode" readonly :maxlength="9"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.rcvBrchName')" prop="rcvBrchName">
            <h-input v-model="addForm.rcvBrchName" readonly :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.rcvMemberId')" prop="rcvMemberId" v-show="false">
            <h-input v-model="addForm.rcvMemberId" readonly :maxlength="6"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.rcvMemberName')" prop="rcvMemberName">
            <h-input v-model="addForm.rcvMemberName" readonly :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.queryDtTm')" prop="queryDtTm" v-if="type!=='reply'">
            <h-input :value="formatDtTm()" readonly></h-input>
          </h-form-item>
          <h-form-item :label="type==='showInquiry'?$t('m.i.common.queryDt'):$t('m.i.common.replyDt')"
                       :prop="type==='showInquiry'?'queryDt':'answerDt'">
            <h-input :value="formatDt()" readonly></h-input>
          </h-form-item>
          <h-form-item :label="type==='showInquiry'?$t('m.i.pe.queryBookNo'):$t('m.i.pe.answerBookNo')"
                       :prop="type==='showInquiry'?'queryBookNo':'answerBookNo'">
            <h-input v-model="type==='showInquiry'?addForm.queryBookNo:addForm.answerBookNo" readonly
                     :maxlength="20"></h-input>
          </h-form-item>
          <h-form-item :label="type==='showInquiry'?$t('m.i.pe.queryContent'):$t('m.i.pe.answerContent')"
                       :prop="type==='showInquiry'?'queryContent':'answerContent'" :required="isRequired"
                       class="h-form-height-auto">
            <h-input type="textarea" v-model="type==='showInquiry'?addForm.queryContent:addForm.answerContent" :rows=3
                     :canResize="false" :readonly="!isRequired" :maxlength="1000"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="closeWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 查询会员代码 -->
    <member-id-search :memberIdWin="showCpesMemberWin" @memberIdWinClose="memberIdWinClose"
                      @memberIdWinSubmit="memberIdWinSubmit"></member-id-search>
    <!--查询机构代码-->
    <!--<brch-code-search :brchCodeWin="showCpesBranchWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "inquiryStackQuery",
    data() {
      return {
        formItem: {
          rcvMemberId: "",
          rcvMemberName: "",
          rcvBrchCode: "",
          rcvBrchName: "",
          queryDt: "",
          applMemberId: "",
          applMemberName: "",
          applBrchCode: "",
          applBrchName: ""
        },
        //给按钮增加权限
        authObj: {
          inquiryAuth: true,       //发起查询
          inquiryDetail: true,    //查看查询书
          replyDetail: true    //查看查复书
        },
        dictMap: new Map(),
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.pe.applMemberName"),
            key: "applMemberName",
            hiddenCol: true,

            sortable: true
          },
          {
            title: this.$t("m.i.pe.applBrchName"),
            key: "applBrchName",
            hiddenCol: true,
            sortable: true
          },
          {
            title: this.$t("m.i.pe.rcvMemberName"),
            key: "rcvMemberName",
            hiddenCol: false,

            sortable: true
          },
          {
            title: this.$t("m.i.pe.rcvBrchName"),
            key: "rcvBrchName",
            hiddenCol: false,

            sortable: true
          },
          {
            title: this.$t("m.i.common.queryDt"),
            key: "queryDt",
            hiddenCol: false,

            sortable: true,
            render: (h, params) => {
              let queryDt = params.row.queryDt == null ? "" : this.$moment(params.row.queryDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", queryDt);
            }
          },
          {
            title: this.$t("m.i.pe.queryBookNo"),
            key: "queryBookNo",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.pe.queryContent"),
            key: "queryContent",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.common.result"),
            key: "queryAnswerStatus",
            hiddenCol: false,

            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "QueryAnswerStatus", params.row.queryAnswerStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.replyDt"),
            key: "answerDt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let answerDt = params.row.answerDt == null ? "" : this.$moment(params.row.answerDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", answerDt);
            }
          }

        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: [],
        type: null,
        isRequired: true,
        ifShowMore: false,
        addOrEditWin: false,
        submitFlag: false,
        addForm: {
          applMemberId: "",
          applMemberName: "",
          applBrchCode: "",
          applBrchName: "",
          rcvBrchCode: "",
          rcvBrchName: "",
          rcvMemberId: "",
          rcvMemberName: "",
          queryDtTm: "",
          queryDt: "",
          queryBookNo: "",
          queryContent: "",
          answerDt: "",
          answerBookNo: "",
          answerContent: ""
        },
        //会员弹出框
        showCpesMemberWin: false,
        //机构弹出框
        //showCpesBranchWin: false,
        //区分查询机构号操作类型
        brchType: ""
      };
    },
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`)
    },
    watch: {},

    computed: {},
    methods: {
      clearRcvMemberName() {
        this.formItem.rcvMemberId = "";
        this.formItem.rcvMemberName = "";
      },
      //查询会员名称
      queryApplMemberName() {
        this.showCpesMemberWin = true;
      },
      memberIdWinClose() {
        this.showCpesMemberWin = false;
      },
      //根据弹框所选数据进行赋值
      memberIdWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录!" });
          return;
        }
        this.formItem.rcvMemberId = info.memberId;
        this.formItem.rcvMemberName = info.memberName;
        this.showCpesMemberWin = false;
      },
     /* clearRcvBrchName(brchType) {
        if (brchType === "query") {
          this.formItem.rcvBrchCode = "";
          this.formItem.rcvBrchName = "";
        }
      },*/
      //查询机构名称
    /*  queryApplBrchName(brchType) {
        this.showCpesBranchWin = true;
        this.brchType = brchType;
      },*/
      /*brchCodeWinClose() {
        this.showCpesBranchWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (this.brchType === "query") {
          this.formItem.rcvBrchCode = info.brchCode;
          this.formItem.rcvBrchName = info.brchFullNameZh;
        }
        this.showCpesBranchWin = false;
      },*/
      handleQueryDtChange(value) {
        this.formItem.queryDt = value.replace(/-/g, "");
      },
      handleAnswerDtChange(value) {
        this.formItem.answerDt = value.replace(/-/g, "");
      },
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.rcvMemberId = "";
        this.$refs.formItem.resetFields();
        this.formItem.rcvBrchCode = "";
        this.formItem.rcvBrchName = "";
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.$refs.addForm.resetFields();
      },
      // 发起查询、查看查询/查复书
      handleQuery(str) {
        this.type = str;
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (this.type !== "reply") {
            this.isRequired = false;
            this.$nextTick(() => {
              this.addForm.applMemberId = this.currentSelectRow.applMemberId;
              this.addForm.applMemberName = this.currentSelectRow.applMemberName;
              this.addForm.applBrchCode = this.currentSelectRow.applBrchCode;
              this.addForm.applBrchName = this.currentSelectRow.applBrchName;
              this.addForm.rcvBrchCode = this.currentSelectRow.rcvBrchCode;
              this.addForm.rcvBrchName = this.currentSelectRow.rcvBrchName;
              this.addForm.rcvMemberId = this.currentSelectRow.rcvMemberId;
              this.addForm.rcvMemberName = this.currentSelectRow.rcvMemberName;
              this.addForm.queryDtTm = this.currentSelectRow.queryDtTm;
              if (this.type === "showInquiry") {
                this.addForm.queryDt = this.currentSelectRow.queryDt;
                this.addForm.queryBookNo = this.currentSelectRow.queryBookNo;
                this.addForm.queryContent = this.currentSelectRow.queryContent;
              } else if (this.type === "showReply") {
                this.addForm.answerDt = this.currentSelectRow.answerDt;
                this.addForm.answerBookNo = this.currentSelectRow.answerBookNo;
                this.addForm.answerContent = this.currentSelectRow.answerContent;
              }
            });
          } else {
            this.isRequired = true;
            this.$nextTick(() => {
              this.addFormReset();
              post({ id: this.currentSelectRow.id }, "/pe/inqrep/queryAnswer/editAnswer").then(res => {
                this.submitFlag = false;
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    let data = res.data.retData;
                    this.addForm.id = data.id;
                    this.addForm.applMemberId = data.applMemberId;
                    this.addForm.applMemberName = data.applMemberName;
                    this.addForm.applBrchCode = data.applBrchCode;
                    this.addForm.applBrchName = data.applBrchName;
                    this.addForm.rcvMemberId = data.rcvMemberId;
                    this.addForm.rcvMemberName = data.rcvMemberName;
                    this.addForm.rcvBrchCode = data.rcvBrchCode;
                    this.addForm.rcvBrchName = data.rcvBrchName;
                    this.addForm.answerDt = data.answerDt;
                    this.addForm.queryMsgId = data.queryMsgId;
                    this.addForm.answerBookNo = data.answerBookNo;
                    this.addForm.answerContent = data.answerContent;
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                  return false;
                }
              });
            });
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return;
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
      },
      closeWin() {
        this.addOrEditWin = !this.addOrEditWin;
        this.addFormReset();
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/pe/inqrep/queryAnswer/answerAplByAudit";
            let msg = "发起查复成功";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
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
      formatDtTm() {
        let queryDtTm = this.addForm.queryDtTm == null ? "" : this.$moment(this.addForm.queryDtTm.toString(), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        return queryDtTm;
      },
      formatDt() {
        let queryDt = this.addForm.queryDt == null ? "" : this.$moment(this.addForm.queryDt.toString()).format("YYYY-MM-DD");
        let answerDt = this.addForm.answerDt == null ? "" : this.$moment(this.addForm.answerDt.toString()).format("YYYY-MM-DD");
        return this.type === "showInquiry" ? queryDt : answerDt;
      }
    },
    mounted() {
      this.getDictListByGroups("QueryAnswerStatus").then(res => {
        this.dictMap = res.get("map");
      });
    }
  }
  ;
</script>

<style scoped>

</style>

