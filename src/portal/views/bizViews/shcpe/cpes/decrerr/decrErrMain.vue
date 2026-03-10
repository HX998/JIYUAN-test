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
                 <!-- <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')">
                    <h-input v-model="formItem.billNoLike" placeholder="" :maxlength="30"></h-input>
                  </h-form-item>-->
                  <common-select v-model="formItem.decryptState" :label="$t('m.i.shcpe.decryptState')" prop="decryptState" :dictList="decryptStatusList"></common-select>

                  <h-form-item :label="$t('m.i.common.memberName')" prop="memberName" v-if="this.userType == '1'">
                    <h-input v-model="formItem.memberName" readonly clearable @on-clear="clearName()"
                             icon="android-search" @on-click="queryMemberId('query')"></h-input>
                  </h-form-item>
                  <h-form-item prop="msgId" :label="$t('m.i.common.msgId')">
                    <h-input v-model="formItem.msgId" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                  <!--  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                      class="icon iconfont"
                      :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
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
            url="/shcpe/cpes/decrerr/decrErrMain/func_queryErrorMsgByPage"
            :bindForm="formItem"
            :onSelectChange="handleCurrentChange"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showInfo()">{{ $t("m.i.common.viewDatail") }}</h-button>
              <h-button type="primary" @on-click="batchDecr()" :disabled="authObj.decrypt">{{ $t("m.i.shcpe.batchDecr") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box v-model="encrDraftInfoWin" width="1000" :mask-closable="false" :maximize="true"
               @on-close="encrDraftCloseForm">
      <p slot="header">
        <span>加密报文详情</span>
      </p>
      <h-panel>
        <h-form :model="encrDraftInfoForm" :label-width="115" ref="encrDraftInfoForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item label="报文内容" prop="encrDraftContent" class="h-form-height-auto">
              <textarea id="encrDraftContentIdError" readonly rows="20"
                        style="overflow-y:auto;overflow-x:auto;width: 100%">{{this.encrDraftContentInfo}}}</textarea>
              <!--<h-input v-model="draftInfoForm.draftContent" readonly type="textarea" :rows="10"></h-input>-->
            </h-form-item>
            <h-form-item class="no-label">
              <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
              <h-button type="primary" v-else @click="formAdd()" :disabled="encrSucc">{{ $t("m.i.shcpe.againDecr") }}</h-button>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer"></div>
    </h-msg-box>

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
                        style="overflow-y:auto;overflow-x:auto;width: 100%">{{this.orgnlDraftContentInfo}}</textarea>
              <!--<h-input v-model="draftInfoForm.draftContent" readonly type="textarea" :rows="10"></h-input>-->
            </h-form-item>
            <!--<h-form-item class="no-label">
              <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
              <h-button type="primary" v-else @click="formAdd()">再次解密</h-button>
            </h-form-item>-->
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
    <!--<bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>-->
    <!-- 查询会员代码 -->
    <member-id-search :memberIdWin="memberIdWin" @memberIdWinClose="memberIdWinClose"
                      @memberIdWinSubmit="memberIdWinSubmit"></member-id-search>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatBillRange } from "@/api/bizApi/commonUtil";
    export default {
      name: "decrErrMain",
      components: {
        MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`),
        //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
        //TraderIdSearch: () => import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`)

      },
      data(){
        return {
          userType:this.$store.getters.userInfo.userType,
          decryptStatusList:[],
          dictMap : new Map(),
          ifShowMore: false,
          memberIdWin:false,
          orgnlDraftContentInfo:"",
          encrDraftContentInfo:"",
          formItem: {
            decryptState:"0",
            memberId:"",
            memberName:"",
          },
          //给按钮增加权限
          authObj: {
            decrypt: false //登记
          },
          pageInfo: {
            pageNo: 1,
            pageSize: 10
          },
          draftInfoForm: {
            draftContent: "",
            creDtTm: ""
          },
          encrDraftInfoForm: {
            encrDraftContent: "",
            creDtTm: ""
          },
          columns: [
            {
              type: "selection",
              width: 50,
              align: "center",
              hiddenCol: false
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
              title: this.$t("m.i.shcpe.decryptState"),
              key: "decryptState",
              hiddenCol: false,
              ellipsis: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "decryptStatus", params.row.decryptState);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.common.memberId"),
              key: "memberId",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.common.memberName"),
              key: "memberName",
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.common.msgId"),
              key: "msgId",
              align: "center",
              hiddenCol: false
            },
          /*  {
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
            },*/
           /* {
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
            },*/
            {
              title: this.$t("m.i.shcpe.orgDraft"),
              key: "msgLogId",
              align: "center",
              hiddenCol: false,
              render: (h, params) => {
                if (params.row.msgLogId == null || params.row.msgLogId === "") {
                  return "";
                }
                return h("a", {
                  on: {
                    click: () => {
                      this.getOrgnlDraft(params.row.msgLogId);
                    }
                  }
                }, "查看原报文");
              }
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
              title: this.$t("m.i.common.createTime"),
              key:"createTime",
              hiddenCol:false,
              render:(h, params) =>{
                return h('span', params.row.createTime?this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"):"-")
              }
            },
            {
              title: this.$t("m.i.pc.updateDt"),
              key:"updateTime",
              hiddenCol:false,
              render:(h, params) =>{
                return h('span', params.row.updateTime?this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"):"-")
              }
            }
           /* {
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
            }*/
          ],
          authContext: null,
          viewAuthWin: false,
          //currentSelectRow: null,
          submitFlag: false,
          draftInfoWin: false,
          encrDraftInfoWin: false,
          encrSucc:false,
        };
      },
      methods: {
        clearName() {
          this.formItem.memberId = "";
          this.formItem.memberName = "";
        },
        handleWinClose() {
          this.authContext = "";
          this.viewAuthWin = false;
        },
        handleSearch() {
          this.authObj.decrypt = false;
          this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.dataChange(1);
          //this.draftInfoForm.draftContent = "";
        },
        //重置查询结果
        resetSearch() {
          this.$refs.formItem.resetFields();
          this.formItem.decryptState = "0";
          this.formItem.memberId = "";
          this.formItem.memberName = "";
        },
        /*onCurrentChange(currentRow, oldCurrentRow, _index) {
          this.currentSelectRow = currentRow;
        },
        onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
          this.currentSelectRow = null;
        },*/
        //查询会员代码弹窗
        queryMemberId() {
          this.memberIdWin = true;
        },
        //根据弹框所选数据进行赋值
        memberIdWinSubmit(info) {
          if (info === null) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.formItem.memberId = info.memberId;
          this.formItem.memberName = info.memberName;
          this.memberIdWin = false;
        },
        //关闭查询会员代码窗口
        memberIdWinClose() {
          this.memberIdWin = false;
        },

        closeForm() {
          this.draftInfoForm.draftContent = "";
          this.draftInfoWin = false;
      /*    this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.dataChange(1);*/
        },
        encrDraftCloseForm() {
          this.encrDraftInfoForm.encrDraftContent = "";
          this.encrDraftInfoWin = false;
         /* this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.selects = [];*/
          //this.$refs.datagrid.dataChange(1);
        },
        showInfo() {
          let selects = this.$refs.datagrid.selects;
          if (selects === null || selects.length == 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          }
          if (selects.length > 1){
            this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
            return;
          }
          if (selects[0].decryptState == '1'){
            this.encrSucc = true;
          } else {
            this.encrSucc = false;
          }
          this.encrDraftInfoWin = true;
          post({id: selects[0].id}, "/shcpe/cpes/decrerr/decrErrMain/func_detailEncrMessageInfo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retData = res.data.retData;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                //this.$nextTick(() => {
                  //document.getElementById("encrDraftContentIdError").innerHTML = retData == null ? "" : retData.encrDraftContent;
                this.encrDraftContentInfo = retData.encrDraftContent;
          //this.$nextTick(() => {
                  //document.getElementById("encrDraftContentIdError").innerHTML = selects.encrDraftContent == null ? "" : selects.encrDraftContent;
         // });
                  // this.draftInfoForm.draftContent = retData.draftContent;
                //});
              } else {
                this.$msgTip.error(this, {info: msg});
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        },

        batchDecr() {
          if (this.$refs.datagrid.selectIds && this.$refs.datagrid.selectIds.length > 0) {
            this.$hMsgBox.confirm({
              title: "批量解密",
              content: "确定要批量解密吗？",
              onOk: () => {
                let list = this.$refs.datagrid.selects;
                for (let i = 0; i < list.length; i++) {
                  if (list[i].decryptState === '1') {
                    this.$msgTip.info(this, {info: "选中数据存在解密成功数据，请检查"});
                    return;
                  }
                }
                this.formAddBatch();
              }
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          }
        },
        // 单笔
        formAdd() {
          //let msg = document.getElementById("encrDraftContentIdError").value;
          //let selects = this.currentSelectRow;
          let ids = this.$refs.datagrid.selectIds;
          this.submitFlag = true;
          // msg = msg.replace(/[\r\n]/g, "\\n");
          post({ids: ids, isSingle:'1' }, "/shcpe/cpes/decrerr/decrErrMain/func_againDecrypt").then(res => {
            this.submitFlag = false;
            if (res) {
              let msg = res.data.retMsg;
              let retData = res.data.retData;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: this.$t("m.i.common.actionSuccess")});
                this.encrDraftCloseForm();
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, {info: msg});
                //this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        },
        // 批量解密
        formAddBatch() {
          //let msg = document.getElementById("encrDraftContentIdError").value;
          //let selects = this.currentSelectRow;
          let ids = this.$refs.datagrid.selectIds;
          this.submitFlag = true;
          // msg = msg.replace(/[\r\n]/g, "\\n");
          post({ids: ids, isSingle:'0' }, "/shcpe/cpes/decrerr/decrErrMain/func_againDecrypt").then(res => {
            this.submitFlag = false;
            if (res) {
              let msg = res.data.retMsg;
              let retData = res.data.retData;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: this.$t("m.i.common.actionSuccess")});
                this.encrDraftCloseForm();
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, {info: msg});
                this.$refs.datagrid.dataChange(1);
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        },
        //查看权限弹窗
        getAutolist(value) {
          this.authContext = value;
          this.viewAuthWin = true;
        },
        handleCurrentChange(arr, selectInx) {
          //this.currentSelectList = arr;
          //this.currentSelectRowInx = selectInx;
          this.checkStatus(arr);
        },
        checkStatus(arr) {
          let checkStatus = "0";
          let list = this.$refs.datagrid.selects;
          for (let i = 0; i < list.length; i++) {
            if (list[i].decryptState === '1') {
              checkStatus = "1";
              break;
            }
          }

          if (checkStatus === "1") {
            this.authObj.decrypt = true;
          } else {
            this.authObj.decrypt = false;

          }
        },

        getOrgnlDraft(msgLogId) {
       /*   let selects = this.currentSelectRow;
          if (null === selects) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          }*/
          this.draftInfoWin = true;
          post({id: msgLogId}, "/shcpe/cpes/draft/check/msgLogMain/func_detailMessageInfo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retData = res.data.retData;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$nextTick(() => {
                  this.orgnlDraftContentInfo = retData.draftContent;
                  //document.getElementById("draftContentIdError").innerHTML = retData == null ? "" : retData.draftContent;
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
      },
      mounted() {
        this.getDictListByGroups("decryptStatus").then(res => {
          this.decryptStatusList = res.get("decryptStatus");
          this.dictMap = res.get("map");
        });
      }

    }

</script>

<style scoped>

</style>
