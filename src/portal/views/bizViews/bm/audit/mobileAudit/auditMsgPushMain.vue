<template>
  <div class="layout">
    <!-- 主页面 -->
    <div v-if="mainVue">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!-- 查询表单 -->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <show-branch prop="createBrchNoList" :label="$t('m.i.pc.todoTaskBelongBrch')" class="h-form-long-label"
                               v-model="formItem.createBrchNoList" title="机构名称" :showCheckBox="true"
                               :brchNo.sync="formItem.createBrchNoList" :brchName.sync="formItem.createBrchNameList">
                  </show-branch>
                  <h-form-item prop="moduleNo" :label="$t('m.i.pc.busiModule')">
                    <h-select v-model="formItem.moduleNo" placeholder="" filterable @on-change="changeModuleNo">
                      <h-option v-for="item in moduleNoList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="taskNo" :label="$t('m.i.pc.todoTaskName')">
                    <h-select v-model="formItem.taskNo" placeholder="" filterable>
                      <h-option v-for="item in taskNoList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="prodNo" :label="$t('m.i.common.prodName')">
                    <h-input v-model="formItem.prodName" placeholder="" icon="android-search"
                             @on-click="queryProductName" readonly clearable @on-clear="clearProductName"></h-input>
                  </h-form-item>
                  <h-form-item prop="batchNo" :label="$t('m.i.pc.busiPrimaryKey')" :validRules="batchNoRules">
                    <h-input v-model="formItem.batchNo" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="operUserNameLike" :label="$t('m.i.pc.operUser')">
                    <h-input v-model="formItem.operUserNameLike" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="lastPushDtRange" :label="$t('m.i.pc.lastPushDt')">
                    <h-date-picker v-model="formItem.lastPushDtRange" :editable=false @on-clear="clearLastPushDtRange" @on-change="handleLastPushDtChange"
                                   showFormat format="yyyy-MM-dd" type="daterange" placeholder="选择日期" autoPlacement></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="taskStatus" :label="$t('m.i.pc.taskStatus')">
                    <h-select v-model="formItem.taskStatus" placeholder="">
                      <h-option v-for="item in taskStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
            </div>

            <!-- 数据展示表格 -->
            <h-datagrid :bindForm="formItem"
                        :columns="columns"
                        url="/bm/audit/mobileAudit/func_queryPageAuditMsgPush"
                        :highlight-row="false"
                        :row-select="false"
                        ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="pushAgain">{{$t("m.i.pc.pushAgain")}}</h-button>
              </div>
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
    </div>

    <!-- 产品名称选择弹出框 -->
    <common-product-select :productSelectWin="productSelectWin" @productSelectChange="productSelectChange"
                           @productSelectWinClose="productSelectWinClose"></common-product-select>

    <!-- 子页面 -->
    <div v-if="billManagerVue">
      <div class="text-wrap mb-10">
        <h-button type="primary" @click="auditDetail">{{$t("m.i.bm.auditDetail")}}</h-button>
        <h-button type="ghost" @click="returnMain">{{$t("m.i.common.goBack")}}</h-button>
      </div>
      <component :is="batchAndBillInfo" :listIds="this.listIds" :batchId="this.batchId" :isShow="infoShow"></component>
    </div>

    <!--审批详情弹出框 -->
    <h-msg-box v-model="auditWin" width="600" height="400" class="h-approve-layer" :maximize="true">
      <p slot="header">
        <span>审批详情</span>
      </p>
      <div ref="print">
        <h-row>
          <h-col class="timeline-wrap">
            <h-timeline>
              <h-timeline-item v-for="item in auditList" :key="item.id">
                <div class="time"><p>{{ valueOperDt(item.operDt)}}</p><span>{{ valueOperTm(item.operTm) }}</span></div>
                <p class="user"><span>{{ item.operator }}</span></p>
                <p>{{ item.brchName }}</p>
                <p v-if="item.operResult === '1'" class="result color-blue">同意</p>
                <p v-else-if="item.operResult === '2'" class="result color-red">拒绝</p>
                <p v-else class="result color-orange">驳回</p>
                <p class="content">{{ item.operOpin }}</p>
              </h-timeline-item>
            </h-timeline>
          </h-col>
        </h-row>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="auditClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="print">{{$t("m.i.bm.print")}}</h-button>
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
                    url="/bm/audit/auditTaskParticipate/func_queryCurrentAuditUser"
                    :bindForm="userListFormItem"
                    ref="userListDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="userListWin = !userListWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "auditMsgPushMain",
    data() {
      let formItem = {
        createBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        createBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        moduleNo: "",
        taskNo: "",
        prodNo: "",
        prodName: "",
        batchNo: "",
        operUserNameLike: "",
        lastPushDtRange: [],
        minLastPushDt: "",
        maxLastPushDt: "",
        taskStatus: "TS00"
      };
      let userListFormItem = {
        auditFlowId: "",
        legalNo: ""
      };
      let columns = [
        {
          type: "selection",
          align: "center",
          width: 50
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "业务模块",
          key: "moduleName",
          align: "center",
          hiddenCol: false,
          sortable: false
        },
        {
          title: "待办任务名称",
          key: "taskName",
          align: "center",
          hiddenCol: false,
          sortable: false
        },
        {
          title: "产品名称",
          key: "prodName",
          align: "center",
          hiddenCol: false,
          sortable: false
        },
        {
          title: "业务主键",
          key: "batchNo",
          align: "center",
          hiddenCol: false,
          sortable: false
        },
        {
          title: "金额(元)",
          key: "auditAmt",
          align: "center",
          hiddenCol: false,
          sortable: false,
          render: (h, params) => {
            if(params.row.auditAmt === 0){
              return h('p', '-');
            }
            return h('p', formatNumber(params.row.auditAmt, 2, ','));
          }
        },
        {
          title: "操作用户",
          key: "operationUser",//不添加key会导致隐藏的时候隐藏所有没有key的列
          align: "center",
          hiddenCol: false,
          sortable: false,
          render: (h, params) => {
            if (params.row.taskStatus === "TS00") {
              return h("div", [
                h("Button", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showUserList(params.row.auditFlowId);
                    }
                  }
                }, this.$t("m.i.bm.cureetOperUser"))
              ]);
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: "推送次数(次)",
          key: "pushNum",
          align: "center",
          hiddenCol: false,
          sortable: false
        },
        {
          title: "最后推送时间",
          key: "lastPushDateTime",//不添加key会导致隐藏的时候隐藏所有没有key的列
          align: "center",
          hiddenCol: false,
          sortable: false,
          render: (h, params) => {
            if (params.row.lastPushDt == null || params.row.lastPushDt === ""
              || params.row.lastPushTm == null || params.row.lastPushTm === "") {
              return h("span", "---");
            }
            let lastPushDt = params.row.lastPushDt.toString();
            let lastPushTm = params.row.lastPushTm.toString();
            if (lastPushTm.length < 6) {
              for (let i = 0; i < (6 - lastPushTm.length); i++) {
                lastPushTm = "0" + lastPushTm;
              }
            }
            let date = this.$moment(lastPushDt.concat(lastPushTm), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", date);
          }
        },
        {
          title: "任务状态",
          key: "taskStatus",
          align: "center",
          hiddenCol: false,
          sortable: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "TaskStatus", params.row.taskStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: "待办任务所属机构",
          key: "createBrchName",
          align: "center",
          hiddenCol: false,
          sortable: false
        },
        {
          title: "查看",
          key: "examine",//不添加key会导致隐藏的时候隐藏所有没有key的列
          align: "center",
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.showDetails(params.row.auditFlowId);
                }
              }
            }, "查看详情");
          }
        }
      ];
      let userListColumns = [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.bm.theUserName"),
          key: "userName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.bm.inBrchName"),
          key: "brchName",
          hiddenCol: false
        }
      ];
      return {
        batchNoRules: [{
          test:  /^\w{0,50}$/,
          trigger: "blur",
          message: "长度不能超过50位字符"
        }],
        formItem: formItem,
        userListFormItem: userListFormItem,
        columns: columns,
        userListColumns: userListColumns,
        selectData: null,
        userListWin: false,
        mainVue: true,
        billManagerVue: false,
        productSelectWin: false,
        batchAndBillInfoUrl: "",
        batchAndBillInfo: "",
        auditWin: false,
        auditList: [],
        auditFlowId: "",
        batchId: "",
        listIds: "",
        dictMap: new Map(),
        moduleNoList: [],
        taskNoList: [],
        taskStatusList: [],
        infoShow: "",
        ifShowMore: false
      };
    },
    components: {
      CommonProductSelect: () => import(/*webpackChunkName: "bm/prod/product/commonProductSelect"*/"@/views/bizViews/bm/prod/product/commonProductSelect.vue"),
    },
    computed: {
      valueOperTm() {
        return function(value) {
          let date;
          if (value.toString().length < 6) {
            let operTm = value + "";
            for (let i = 0; i < (6 - value.toString().length); i++) {
              operTm = "0" + operTm;
            }
            date = this.$moment(operTm, "HH:mm:ss").format("HH:mm:ss");
          } else {
            date = this.$moment(value, "HH:mm:ss").format("HH:mm:ss");
          }
          return date;
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
      getDictListByGroups("AuditFlow,ModuleNo,TaskStatus").then(res => {
        this.moduleNoList = res.get("ModuleNo");
        this.taskStatusList = res.get("TaskStatus");
        this.dictMap = res.get("map");
      });
      this.getTaskNoList();
    },
    methods: {
      changeModuleNo() {
        this.formItem.taskNo = "";
        this.getTaskNoList(this.formItem.moduleNo);
      },
      getTaskNoList(code){
        post({ code: code, loading: false}, "/bm/audit/mobileAudit/func_getTaskNoList").then(res => {
          if(res && res.data.retCode === "000000"){
            this.taskNoList = res.data.retData
          }else {
            this.taskNoList = [];
          }
        });
      },
      clearProductName() {
        this.formItem.prodName = "";
        this.formItem.prodNo = "";
      },
      //产品名称选择弹出框
      queryProductName() {
        this.productSelectWin = true;
      },
      //产品名称选择确认
      productSelectChange(info) {
        this.formItem.prodName = info[0].title;
        this.formItem.prodNo = info[0].id;
        this.productSelectWin = false;
      },
      //产品名称选择关闭窗口
      productSelectWinClose() {
        this.productSelectWin = false;
      },
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if(valid) {
            this.$nextTick(() => {
              this.$refs.datagrid.dataChange(1);
            });
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.createBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.createBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.prodNo = "";
        this.formItem.prodName = "";
        this.formItem.minLastPushDt = "";
        this.formItem.maxLastPushDt = "";
      },
      clearLastPushDtRange() {
        this.formItem.lastPushDtRange=[];
        this.formItem.minLastPushDt="";
        this.formItem.maxLastPushDt="";
      },
      handleLastPushDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minLastPushDt = arr[0].replace(/-/g, "");
          this.formItem.maxLastPushDt = arr[1].replace(/-/g, "");
          this.formItem.lastPushDtRange = [arr[0], arr[1]];
        }
      },
      //重新推送
      pushAgain() {
        let ids = this.$refs.datagrid.selectIds;
        if(!ids || ids.length === 0){
          this.$msgTip.error(this, { info: "请先选择记录" });
          return;
        }
        let selects = this.$refs.datagrid.selects;
        for (let i = 0; i < selects.length; i++) {
          if (selects[i].taskStatus === "TS01") {
            this.$msgTip.info(this, { info: "已办理的推送消息不支持重新推送" });
            return;
          }
        }
        this.$hMsgBox.confirm({
          title: "重新推送",
          content: "确认要重新推送吗？",
          onOk: () => {
            let code = ids.join(",");
            post({code:code}, "/bm/audit/mobileAudit/func_pushAgain").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let return_code = res.data.retCode;
                if (return_code === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      //查看详情
      showDetails(auditFlowId) {
        this.auditFlowId = auditFlowId;
        post({ auditFlowId: auditFlowId }, "/bm/audit/mobileAudit/func_getAuditBusiDataByFlowId").then(res => {
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
              let flowFuncNo = res.data.retData.flowFuncNo + "-" + res.data.retData.billClass;
              this.batchAndBillInfoUrl = getDictValueFromMap(this.dictMap, "AuditFlow", flowFuncNo);
              this.openBatchAndBillInfo();
              this.mainVue = false;
              this.billManagerVue = true;
              this.infoShow = true;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //打开批次明细信息
      openBatchAndBillInfo() {
        this.batchAndBillInfo = this._getAuditComponentByUrl(this.batchAndBillInfoUrl);
      },

      //当前操作者列表
      showUserList(str) {
        this.userListWin = true;
        this.userListFormItem.auditFlowId = str;
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.userListFormItem.legalNo = userInfo.legalNo;
        this.$nextTick(() => {
          this.$refs.userListDatagrid.dataChange(1);
        });
      },

//======================================================================================================================
      //查看子页面功能逻辑
      //返回
      returnMain() {
        this.auditFlowId = "";
        this.mainVue = true;
        this.billManagerVue = false;
        this.resetSearch();
        this.selectData = null;
      },
      //审批详情
      auditDetail() {
        post({ id: this.auditFlowId }, "/bm/audit/auditTaskParticipate/func_queryAuditStationOperationByFlowId").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.auditList = res.data.retData;
              this.auditWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
              this.auditWin = true;
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            this.auditWin = true;
          }
        });
      },
      //审批关闭
      auditClose() {
        this.auditWin = false;
        this.auditList = [];
      },
      //打印审批详情
      print() {
        let bodyHtml = this.$refs.print.outerHTML;
        this.$print.printHtm(this, bodyHtml, "审批详情");
      }
    }
  };
</script>

<style scoped>

</style>
