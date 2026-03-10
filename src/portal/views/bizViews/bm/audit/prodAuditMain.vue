<template>
  <div class="layout">
    <!-- 主页面 -->
    <div v-if="mainVue">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <div class="h-form-search-box">
              <!-- 查询表单 -->
              <h-panel class="clearfix">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <show-product v-model="formItem.prodName" :clearProduct="clearProductName" @productSelectedChange="productSelectedChange"></show-product>
                  <h-form-item prop="createTellerName" :label="$t('m.i.bm.createTellerName')">
                    <h-input v-model="formItem.createTellerName" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="flowStartDt" :label="$t('m.i.bm.flowStartDt')">
                    <h-date-picker type="date" v-model="formItem.flowStartDt" placeholder="" showFormat
                                   @on-change="handleDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
            </div>
            <!-- 数据展示表格 -->
            <h-datagrid :columns="columns"
                        :autoLoad="false"
                        highlightRow
                        url="/bm/audit/prodAuditMain/func_listAuditFlow"
                        :bindForm="formItem"
                        :row-select="true"
                        :has-select="false"
                        ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="multipleAudit()">{{$t("m.i.bm.audit")}}</h-button>
                <h-button type="primary" @click="showDetails()">{{$t("m.i.common.view")}}</h-button>
              </div>
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
    </div>
    <!-- 子页面 -->
    <div v-if="billManagerVue">
      <div class="text-wrap mb-10">
        <h-button type="primary" @click="audit()">{{$t("m.i.bm.audit")}}</h-button>
        <h-button type="ghost" @click="returnMain()">{{$t("m.i.common.goBack")}}</h-button>
      </div>
      <component :is="batchAndBillInfo" :listIds="this.listIds" :batchId="this.batchId" :isShow="infoShow" :auditRouteId="this.auditRouteId"></component>
    </div>

    <!--审批弹出框 -->
    <h-msg-box v-model="auditWin" width="800" height="400" class="h-approve-layer" :maximize="true"
               :mask-closable="false" @on-close="auditClose">
      <p slot="header">
        <span>审批</span>
      </p>
      <div>
        <h-row>
          <h-col span="12" class="timeline-wrap">
            <h-timeline>
              <h-timeline-item v-for="item in auditList" :key="item.id">
                <div class="time"><p>{{ valueOperDt(item.operDt) }}</p><span>{{ valueOperTm(item.operTm) }}</span></div>
                <p class="user"><span>{{ item.operator }}</span></p>
                <p>{{ item.brchName }}</p>
                <p v-if="item.operResult === '1'" class="result color-blue">同意</p>
                <p v-else-if="item.operResult === '2'" class="result color-red">拒绝</p>
                <p v-else class="result color-orange">驳回</p>
                <p class="content">{{ item.operOpin }}</p>
              </h-timeline-item>
            </h-timeline>
          </h-col>
          <h-col span="12" class="pt-15">
            <h-form :model="auditFormItem" :label-width="100" ref="auditFormItem" class="h-form-search">
              <h-form-item prop="operResult" :label="$t('m.i.bm.operResult')" required class="result-item">
                <h-select v-model="auditFormItem.operResult" :label-in-value="true" @on-change="changeOperResult"
                          placeholder="">
                  <h-option value="1">同意</h-option>
                  <h-option value="2">拒绝</h-option>
                  <h-option value="3" v-if="auditStation.auditStationType!=='3'">驳回</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="noticeNextUser" label="通知下一岗" required class="h-form-long-label" v-if="showNoticeUserItem">
                <h-select v-model="auditFormItem.noticeNextUser" :label-in-value="true" placeholder="">
                  <h-option value="1">是</h-option>
                  <h-option value="0">否</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="auditStationName" :label="$t('m.i.bm.rollBackAuditStationName')" required
                           v-if="showUser">
                <h-input v-model="auditFormItem.auditStationName" placeholder="" icon="android-search"
                         @on-click="queryUserName()" readonly clearable @on-clear="clearUserName()"></h-input>
              </h-form-item>
              <h-form-item
                v-if="this.isChooseAuditUser==='1'&&this.showAudit&&this.auditParams.auditStationId!==0"
                :label="$t('m.i.pc.tellerNo')" prop="userName" >
                <h-input v-model="addForm.userName" :placeholder="''" readonly
                         icon="android-search" @on-click="queryAudit" clearable @on-clear="clearAudit"></h-input>
              </h-form-item>
              <h-form-item prop="operOpin" :label="$t('m.i.bm.operOpin')" required class="h-form-height-auto">
                <h-input v-model="auditFormItem.operOpin" :rows="4" type="textarea" placeholder=""
                         :maxlength="80"></h-input>
              </h-form-item>
            </h-form>
          </h-col>
        </h-row>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="auditClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="auditSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--批量审批弹出框 -->
    <h-msg-box v-model="multipleAuditWin" width="400" height="300" class="h-approve-layer" :maximize="true"
               :mask-closable="false" @on-close="multipleAuditClose">
      <p slot="header">
        <span>批量审批</span>
      </p>
      <div>
        <h-row>
          <h-form :model="auditMultipleFormItem" :label-width="70" ref="auditMultipleFormItem" class="h-form-search">
            <h-form-item prop="operResult" :label="$t('m.i.bm.operResult')" required class="result-item">
              <h-select v-model="auditMultipleFormItem.operResult" :label-in-value="true" @on-change="changeOperResult"
                        placeholder="">
                <h-option value="1">同意</h-option>
                <h-option value="2">拒绝</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="noticeNextUser" label="通知下一岗" required class="h-form-long-label" v-if="showNoticeUserItem">
              <h-select v-model="auditMultipleFormItem.noticeNextUser" :label-in-value="true" placeholder="">
                <h-option value="1">是</h-option>
                <h-option value="0">否</h-option>
              </h-select>
            </h-form-item>
            <h-form-item
              v-if="this.isChooseAuditUser==='1'&&this.showAudit&&this.auditParams.auditStationId!==0"
              :label="$t('m.i.pc.tellerNo')" prop="custNo" >
              <h-input v-model="addForm.userName" :placeholder="''" readonly
                       icon="android-search" @on-click="queryAudit" clearable @on-clear="clearAudit"></h-input>
            </h-form-item>
            <h-form-item prop="operOpin" :label="$t('m.i.bm.operOpin')" required class="h-form-height-auto">
              <h-input v-model="auditMultipleFormItem.operOpin" :rows="4" type="textarea" placeholder=""
                       :maxlength="80"></h-input>
            </h-form-item>
          </h-form>
        </h-row>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="multipleAuditClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="auditMultipleSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 当前操作者弹窗 -->
    <h-msg-box v-model="userListWin" width="1000" class="h-form-table-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>当前节点操作者列表</span>
      </p>
      <div>
        <h-datagrid :columns="userListColumns"
                    :autoLoad="false"
                    highlightRow
                    url="/bm/audit/prodAuditMain/func_queryCanReturnAuditStation"
                    :onCurrentChange="onCurrentUserChange"
                    :onCurrentChangeCancel="onCurrentUserChangeCancel"
                    :bindForm="userListFormItem"
                    ref="userListDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="userListWin = !userListWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--查看附件弹窗-->
    <show-attach :showAttachWin="showAttachWin" @attachWinClose="attachWinClose" :attachParams="attachParams"></show-attach>
    <show-audit-station :showAuditStationWin="showAuditStationWin" :title="'分配下岗审核柜员'"
                        @showAuditStationWinClose="showAuditStationWinClose"
                        @auditSelect="auditSelect" :auditParams="this.auditParams"></show-audit-station>
  </div>
</template>

<script>
import { post, on, off, formatNumber,formatTime, getDictValueFromMap } from "@/api/bizApi/commonUtil";

export default {
  name: "prodAuditMain",
  components: {
    showAuditStation: () => import(/* webpackChunkName: "bm/audit/showAuditStation"*/"@/views/bizViews/bm/audit/showAuditStation.vue"),
  },
  data() {
    let formItem = {
      prodName: "",
      prodNo: "",
      createTellerName: "",
      flowStartDt: ""
    };
    let columns = [
      {
        type: 'selection',
        key: 'multiSelect',
        width: 60,
        hiddenCol: false,
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
        title: this.$t("m.i.common.batchNo"),
        key: "batchNo",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.common.prodName"),
        key: "prodName",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t("m.i.bm.flowNumber"),
        key: "id",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.bm.flowName"),
        key: "auditRouteName",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.bm.flowStartDt"),
        key: "flowStartDt",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          if (params.row.flowStartDt == null || params.row.flowStartDt === "") {
            return "";
          }
          let date = this.$moment(params.row.flowStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          return h("span", date);
        }
      },
      {
        title: this.$t("m.i.bm.auditStatus"),
        key: "auditStatus",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap, "AuditStatus", params.row.auditStatus);
          return h("span", {
            domProps: {
              title: list
            }
          }, list);
        }
      },
      {
        title: this.$t("m.i.bm.auditAmt"),
        key: "auditAmt",
        hiddenCol: false,
        render: (h, params) => {
          let auditAmt = formatNumber(params.row.auditAmt, 2, ",");
          return h("span", {
            domProps: {
              title: auditAmt
            }
          }, auditAmt);
        }
      },
      {
        title: this.$t("m.i.bm.createTellerName"),
        key: "createTellerName",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t("m.i.bm.createFlowBrchName"),
        key: "createBrchName",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t("m.i.auth.attachment"),
        key: "attachment",
        render: (h, params) => {
          let attachment = "查看附件";
          return h("a", {
            on: {
              click: () => {
                this.showAttachDeal(params.row.id);
              }
            }
          }, attachment);
        }
      },
      {
        title: this.$t("m.i.ce.lockUserNo"),
        key: "lockUserNo",
        sortable: true,
        hiddenCol: false
      },
      {
        title: this.$t("m.i.ce.lockBrchName"),
        key: "lockBrchName",
        sortable: true,
        hiddenCol: false
      },
      {
        title: this.$t("m.i.ce.lockTm"),
        key: "lockDt",
        sortable: true,
        hiddenCol: false,
        render: (h, params) => {
          if (params.row.lockDt == null || params.row.lockDt === "" ||params.row.lockDt === 0) {
            return "";
          }
          let lockTm = formatTime(this,params.row.lockDt);
          return h("span", lockTm);
        }
      },
    ];
    let auditFormItem = {
      operResult: "",
      operOpin: "",
      auditFlowId: "",
      auditStationName: "",
      preStationId: "",
      noticeNextUser:"0",
      ids:"",
      userIds: "",
    };
    let auditMultipleFormItem = {
      operResult: "",
      operOpin: "",
      auditFlowId: "",
      auditStationName: "",
      preStationId: "",
      noticeNextUser:"0",
      ids:"",
      userIds: "",
    };
    let userListFormItem = {
      auditFlowId: "",
      legalNo: ""
    };
    let addForm = {
      id: "",
      userNo: "",
      userName: "",
    };
    let userListColumns = [
      {
        title: " ",
        type: "radio",
        align: "center",
        width: 50
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
        title: this.$t("m.i.bm.auditStationName"),
        key: "auditStationName",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.bm.auditStationType"),
        key: "auditStationType",
        hiddenCol: false,
        render: (h, params) => {
          let list = this.getDictValueFromMap(this.dictMap, "AuditStationType", params.row.auditStationType);
          return h("span", {
            domProps: {
              title: list
            }
          }, list);
        }
      }
    ];
    return {
      formItem: formItem,
      columns: columns,
      auditFormItem: auditFormItem,
      auditMultipleFormItem: auditMultipleFormItem,
      userListFormItem: userListFormItem,
      userListColumns: userListColumns,
      showAudit: true,
      addForm: addForm,
      showAuditStationWin: false,
      auditParams: {
        auditStationId: ""
      },
      prodNameList: "",
      infoShow: false,
      dictMap: new Map(),
      viewCurrentSelectList: [],
      batchAndBillInfoUrl: "",
      mainVue: true,
      billManagerVue: false,
      batchAndBillInfo: "",
      auditList: [],
      auditWin: false,
      multipleAuditWin: false,
      auditFlowId: "",
      code:"",
      currentSelectRow: [],
      batchId: "",
      listIds: "",
      auditRouteId:"",
      userListWin: false,
      showUser: false,
      selectData: null,
      queryUrl: "/pc/busiLock/func_getBusiLockParam",
      syncOperMode:"",
      selectUserData: null,
      showAttachWin: false,
      attachId: "",
      attachParams: {
        queryUrl: "",
        downloadUrl: "",
        attachFormItem: {
          auditFlowId: ""
        },
      },
      auditStation: {},
      isChooseAuditUser: "0",
      showNoticeUserItem:false,
      billManagerVueHeight: 0
    };
  },
  computed: {
    valueOperTm() {
      return function(value) {
        if (value.toString().length < 6) {
          let operTm = value + "";
          for (let i = 0; i < (6 - value.toString().length); i++) {
            operTm = "0" + operTm;
          }
          let date = this.$moment(operTm, "HH:mm:ss").format("HH:mm:ss");
          return date;
        } else {
          let date = this.$moment(value, "HH:mm:ss").format("HH:mm:ss");
          return date;
        }
      };
    },
    valueOperDt() {
      return function(value) {
        let month = value.toString().substring(4, 6);
        let day = value.toString().substring(6, 8);
        return month + "-" + day;
      };

    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getSyncOperMode();
      this.getDictListByGroups("AuditFlow,AuditStatus,AuditStationType").then(res => {
        this.dictMap = res.get("map");
      });
      this.formItem.prodNo = this.$route.query.prodNo;
      this.formItem.prodName = this.$route.query.prodName;
      this.$refs.datagrid.dataChange(1);
      this.getDefaultNoticeNextUserValue();
      this.getIsShowNoticeNextUserItem();
      // 控制选择下一岗人员按钮显隐
      post({paramKey: "pc.flow.is_choose_audit_user"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if (res.data.retData === "1") {
              this.isChooseAuditUser = "1";
            }
          } else {
            this.isChooseAuditUser = "0";
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    });
  },
  watch: {
    "$route.path": function(val) {
      if (val === "/bm/audit/prodAuditMain") {
        if (this.$route.query.prodNo) {
          this.formItem.prodNo = this.$route.query.prodNo;
          this.formItem.prodName = this.$route.query.prodName;
          this.$refs.datagrid.dataChange(1);
        }
      }
    },
    billManagerVue(val) {
      if(val) {
        this.getHeight();
      }
    }
  },
  methods: {
    //设置子页面初始最小高度
    getHeight() {
      let appObj = document.getElementsByClassName("app-main");
      let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
      this.billManagerVueHeight = window.innerHeight - appOffsetTop - 20;
    },
    queryAudit() {
      this.showAuditStationWin = true;
    },
    clearAudit() {
      this.addForm.id = "";
      this.addForm.userName = "";
    },
    showAuditStationWinClose() {
      this.showAuditStationWin = false;
    },
    auditSelect(info) {
      this.addForm.id = info.userIds;
      this.addForm.userName = info.userName;
      this.showAuditStationWin = false;
    },
    getSyncOperMode() {
      let url = this.queryUrl;
      post({},url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.syncOperMode = res.data.retMsg;
              if (this.syncOperMode==='1') {
                this.$refs.datagrid.controlColumnsHidden("lockUserNo", false);
                this.$refs.datagrid.controlColumnsHidden("lockBrchName", false);
                this.$refs.datagrid.controlColumnsHidden("lockDt", false);
              } else {
                this.$refs.datagrid.controlColumnsHidden("lockUserNo", true);
                this.$refs.datagrid.controlColumnsHidden("lockBrchName", true);
                this.$refs.datagrid.controlColumnsHidden("lockDt", true);
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        }
      );
    },
    //获取系统参数（短信通知下一岗选项是否显示）
    getIsShowNoticeNextUserItem() {
      let paramKey = "pc.flow.is_show_notice_next_station";
      post({ paramKey: paramKey }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.showNoticeUserItem = res.data.retData === "1";
          } else {
            this.showNoticeUserItem = false;
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    //获取系统参数（短信通知下一岗选项默认值）
    getDefaultNoticeNextUserValue() {
      let paramKey = "pc.flow.default_notice_next_station_value";
      post({ paramKey: paramKey }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.auditFormItem.noticeNextUser = res.data.retData?res.data.retData:"0";
            this.auditMultipleFormItem.noticeNextUser = res.data.retData?res.data.retData:"0";
          } else {
            this.auditFormItem.noticeNextUser="0";
            this.auditMultipleFormItem.noticeNextUser="0";
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    handleDateChange(value) {
      this.formItem.flowStartDt = value.replace(/-/g, "");
    },
    //行选中
    handleRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handleRowClickCancel() {
      this.currentSelectRow = [];
    },
    //表单查询
    handleSearch() {
      this.selectData = null;
      this.$nextTick(() => {
        this.$refs.datagrid.dataChange(1);
      });
    },
    //重置表单查询结果
    resetSearch() {
      this.$nextTick(() => {
        this.formItem.prodName = "";
        this.formItem.prodNo = "";
        this.formItem.createTellerName = "";
        this.formItem.flowStartDt = "";
      });
    },
    onCurrentChange(currentRow, oldCurrentRow, _index) {
      this.selectData = currentRow;
    },
    onCurrentChangeCancel() {
      this.selectData = null;
    },
    onCurrentUserChange(currentRow, oldCurrentRow, _index) {
      this.selectUserData = currentRow;
    },
    onCurrentUserChangeCancel() {
      this.selectUserData = null;
    },
    //退回节点弹出框
    queryUserName() {
      this.userListFormItem.auditFlowId = this.auditFlowId;
      this.userListWin = true;
      this.$nextTick(() => {
        this.$refs.userListDatagrid.dataChange(1);
      });
    },
    clearUserName() {
      this.auditFormItem.auditStationName = "";
      this.auditFormItem.preStationId = "";
      this.auditMultipleFormItem.auditStationName = "";
      this.auditMultipleFormItem.preStationId = "";

    },
    //当审批结果为驳回时，查询之前操作者
    changeOperResult(currentValue) {
      if (this.multipleAuditWin===true){ this.auditMultipleFormItem.operOpin = currentValue.label;}
      if (this.auditWin===true){ this.auditFormItem.operOpin = currentValue.label;}
      if (currentValue.value === "2") {
        this.showAudit = false;
      }
      if (currentValue.value === "1" && this.isChooseAuditUser === "1" && this.auditParams.auditStationId !== 0) {
        let nextId = this.auditParams.auditStationId;
        post({id: nextId}, "/bm/audit/auditRoute/func_getAuditStationById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData.auditStationType === "3") {
                this.showAudit = false;
                this.addForm.userName = "";
                this.addForm.id = "";
                this.auditMultipleFormItem.userIds = "";
              }else {
                this.showAudit = true;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      }
      if (this.auditFormItem.operResult === "3") {
        post({ auditFlowId: this.auditFlowId }, "/bm/audit/prodAuditMain/func_queryCanReturnAuditStation").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let list = res.data.retData.list;
              this.showAudit = false;
              if (list.length !== 0) {
                this.showUser = true;
              } else {
                this.showUser = false;
              }
            }
          }
        }).catch(error => {
          this.$hMessage.error(this.$t("m.i.common.netError") + error);
        });
      } else {
        this.showUser = false;
      }
    },
    //退回节点界面提交
    submitForm() {
      if (!this.selectUserData) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        return;
      }
      this.auditFormItem.auditStationName = this.selectUserData.auditStationName;
      this.auditFormItem.preStationId = this.selectUserData.id;
      this.auditMultipleFormItem.auditStationName = this.selectUserData.auditStationName;
      this.auditMultipleFormItem.preStationId = this.selectUserData.id;
      this.userListWin = false;
      this.selectUserData = null;
    },
    clearProductName() {
      this.formItem.prodName = "";
      this.formItem.prodNo = "";
    },
    productSelectedChange(arr) {
      this.formItem.prodName = arr[0].title;
      this.formItem.prodNo = arr[0].id;
    },
    //查看
    showDetails() {
      this.billList = this.$refs.datagrid.selects
      if (null == this.billList ||this.billList.length ===0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        return;
      }
      if (this.billList.length >1 ) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        return;
      }

      let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
      let lockUserNo = this.$refs.datagrid.selects[0].lockUserNo;
      if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
        if (lockUserNo !== userNo ) {
          this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
          return;
        }
      }
      this.code = this.$refs.datagrid.selectIds;
      this.auditFlowId = this.$refs.datagrid.selects[0].id;
      this.auditRouteId = this.$refs.datagrid.selects[0].auditRouteId;
      post({
        auditFlowId: this.auditFlowId,
        queryType: "1"
      }, "/bm/audit/prodAuditMain/func_getAuditBusiDataByFlowId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.batchId = res.data.retData.batchId;
            let ids = "";
            for (let i = 0; i < res.data.retData.ids.length; i++) {
              ids += res.data.retData.ids[i];
              if (i < res.data.retData.ids.length - 1) {
                ids += ",";
              }
            }
            this.listIds = res.data.retData.ids;
            let flowFuncNo = this.$refs.datagrid.selects[0].flowFuncNo + "-" + this.$refs.datagrid.selects[0].billClass;
            this.batchAndBillInfoUrl = this.getDictValueFromMap(this.dictMap, "AuditFlow", flowFuncNo);
            this.openBatchAndBillInfo();
            if (this.syncOperMode==='1') {
              this.addOrDelBatchBusiLock(this.auditFlowId,"add");
            } else {
              this.mainVue = false;
              this.billManagerVue = true;
              this.infoShow = true;
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    //查看附件
    showAttachDeal(auditFlowId) {
      this.auditFlowId = auditFlowId;
      this.attachParams.queryUrl = "/bm/audit/auditTaskSubmit/func_queryAuditAttach";
      this.attachParams.downloadUrl = "/bm/audit/auditTaskSubmit/func_attachDownload";
      this.attachParams.attachFormItem.auditFlowId = auditFlowId;
      this.showAttachWin = true;
    },
    //查看附件窗口关闭
    attachWinClose() {
      this.showAttachWin = false;
      this.auditFlowId = "";
      this.attachParams.queryUrl = "";
      this.attachParams.downloadUrl = "";
      this.attachParams.attachFormItem.auditFlowId = "";
    },
    openBatchAndBillInfo() {
      this.batchAndBillInfo = this._getAuditComponentByUrl(this.batchAndBillInfoUrl);
    },

    //查看子页面功能逻辑
    //返回
    returnMain() {
      if (this.syncOperMode==='1') {
        this.addOrDelBatchBusiLock(this.auditFlowId,"delete");
      }
      this.mainVue = true;
      this.billManagerVue = false;
      this.selectData = null;
      this.$nextTick(() => {
        this.getSyncOperMode();
        this.formItem.flowStartDt = this.formItem.flowStartDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      });
    },
    //批量审批
    multipleAudit() {
      this.billList = this.$refs.datagrid.selects
      if (null == this.billList || this.billList.length === 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        return;
      }
      this.code = this.$refs.datagrid.selectIds;

      let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
      let lockUserNo = this.$refs.datagrid.selects[0].lockUserNo;
      if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
        if (lockUserNo !== userNo ) {
          this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
          return;
        }
      }
      this.auditFlowId = this.$refs.datagrid.selects[0].id;
      this.auditRouteId = this.$refs.datagrid.selects[0].auditRouteId;
      post({ id:  this.auditFlowId}, "/bm/audit/prodAuditMain/func_queryCurrentAuditStation").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.auditStation = res.data.retData;
            this.auditParams.auditStationId = this.auditStation.nextStation;
          } else {
            this.$msgTip.error(this, { info: msg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      post({ id: this.auditFlowId  }, "/bm/audit/prodAuditMain/func_queryAuditStationOperationByFlowId").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.auditList = res.data.retData;
            this.multipleAuditWin = true;
          } else {
            this.$msgTip.error(this, { info: msg });
            this.multipleAuditWin = false;
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          this.multipleAuditWin = false;
        }
      });
    },
    //审批
    audit() {
      post({ id: this.auditFlowId }, "/bm/audit/prodAuditMain/func_queryCurrentAuditStation").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.auditStation = res.data.retData;
            this.auditParams.auditStationId = this.auditStation.nextStation;
          } else {
            this.$msgTip.error(this, { info: msg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      post({ id: this.auditFlowId }, "/bm/audit/prodAuditMain/func_queryAuditStationOperationByFlowId").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.auditList = res.data.retData;
            this.auditWin = true;
          } else {
            this.$msgTip.error(this, { info: msg });
            this.auditWin = false;
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          this.auditWin = false;
        }
      });
    },
    //审批确认
    auditSubmit() {
      this.auditFormItem.auditFlowId = this.auditFlowId;
      this.auditFormItem.userIds = this.addForm.id;
      this.$refs["auditFormItem"].validate(valid => {
        if (valid) {
          let url = "/bm/audit/prodAuditMain/func_doingAuditFlow";
          this.submitFlag = true;
          post(this.auditFormItem, url).then(res => {
            this.submitFlag = false;
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.auditClose();
                this.multipleAuditClose();
                this.returnMain();
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$hMessage.error(this.$t("m.i.common.netError"));
            }
          });
        }
      });
    },
    //批量审批确认
    auditMultipleSubmit() {
      this.auditMultipleFormItem.ids = this.code;
      this.auditMultipleFormItem.userIds = this.addForm.id;
      this.$refs["auditMultipleFormItem"].validate(valid => {
        if (valid) {
          let url = "/bm/audit/prodAuditMain/func_doingBatchAuditFlow";
          this.submitFlag = true;
          post(this.auditMultipleFormItem, url).then(res => {
            this.submitFlag = false;
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.auditClose();
                this.multipleAuditClose();
                this.returnMain();
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$hMessage.error(this.$t("m.i.common.netError"));
            }
          });
        }
      });
    },
    //审批关闭
    auditClose() {
      this.$nextTick(() => {
        this.auditWin = false;
        this.$refs.auditFormItem.resetFields();
        this.$refs.auditMultipleFormItem.resetFields();
        this.auditList = [];
      });
    },
    //批量审批关闭
    multipleAuditClose() {
      this.$nextTick(() => {
        this.multipleAuditWin = false;
        this.$refs.auditMultipleFormItem.resetFields();
        this.addForm = [];
        this.auditList = [];
      });
    },
    addOrDelBatchBusiLock(id,type) {
      let lockUserNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
      let lockBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
      if (type ==="add") {
        post({ id: id,lockType:"0",lockUserNo:lockUserNo,lockBrchName:lockBrchName}, "/bm/audit/prodAuditMain/func_addBatchBusiLock").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode !== "000000") {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            } else {
              this.mainVue = false;
              this.billManagerVue = true;
              this.infoShow = true;
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      } else {
        post({ id: id,lockType:"1"}, "/bm/audit/prodAuditMain/func_deleteBatchBusiLock").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode !== "000000") {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    },
  }
};
</script>

<style scoped>

</style>
