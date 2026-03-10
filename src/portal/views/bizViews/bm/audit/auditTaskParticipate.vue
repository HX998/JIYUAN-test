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
                <h-form :model="formItem" :label-width="80" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item prop="prodName" :label="$t('m.i.common.prodName')">
                    <h-input v-model="formItem.prodName" placeholder="" icon="android-search"
                             @on-click="queryProductName()" readonly clearable @on-clear="clearProductName()"></h-input>
                  </h-form-item>
                  <h-form-item prop="auditStatus" :label="$t('m.i.bm.auditStatus')">
                    <h-select v-model="formItem.auditStatus" placeholder="">
                      <h-option v-for="item in operStatusList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="operResult" :label="$t('m.i.bm.operResult')">
                    <h-select v-model="formItem.operResult" placeholder="">
                      <h-option v-for="item in operResultList" :value="item.key" :key="item.key">{{item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="operDt" :label="$t('m.i.bm.operDt')">
                    <h-date-picker type="date" v-model="formItem.operDt" placeholder=""
                                   @on-change="handleDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                      class="icon iconfont"
                      :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
            </div>
            <!-- 数据展示表格 -->

            <h-datagrid :columns="columns"
                        highlight-row
                        url="/bm/audit/auditTaskParticipate/func_listDoingAuditFlow"
                        :bindForm="formItem"
                        :onCurrentChange="onCurrentChange"
                        :onCurrentChangeCancel="onCurrentChangeCancel"
                        ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="showDetails()">{{$t("m.i.common.view")}}</h-button>
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
        <h-button type="primary" @click="auditDetail()">{{$t("m.i.bm.auditDetail")}}</h-button>
        <h-button type="ghost" @click="returnMain()">{{$t("m.i.common.goBack")}}</h-button>
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
    <!--查看附件弹窗-->
    <show-attach :showAttachWin="showAttachWin" @attachWinClose="attachWinClose" :attachParams="attachParams"></show-attach>
  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "auditTaskParticipate",
    data() {
      let formItem = {
        operDt: "",
        auditStatus: "",
        operResult: "",
        prodName: "",
        prodNo: ""
      };
      let userListFormItem = {
        auditFlowId: "",
        legalNo: ""
      };
      let columns = [
        {
          title: " ",
          type: "radio",
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
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          align: "left",
          hiddenCol: true,
          sortable: true
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          align: "left",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.bm.auditAmt"),
          key: "auditAmt",
          align: "left",
          hiddenCol: false,
          sortable: true,
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
          title: this.$t("m.i.bm.auditStatus"),
          key: "auditStatus",
          align: "left",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "AuditStatus", params.row.auditStatus);
            return h("span", {
              domProps: {
                title: list
              }
            }, list);
          }
        },
        {
          title: this.$t("m.i.bm.operResult"),
          key: "operResult",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (null == params.row.operResult || params.row.operResult === "") {
              return h("span", "---");
            } else {
              let list = getDictValueFromMap(this.dictMap, "AuditOperResult", params.row.operResult);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          }
        },
        {
          title: this.$t("m.i.bm.userList"),
          key: "userList",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.auditStatus === "0" || params.row.auditStatus === "1") {
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
                      this.showUserList(params.row.id);
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
          title: this.$t("m.i.bm.createTellerName"),
          key: "createTellerName",
          align: "left",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.bm.createFlowBrchName"),
          key: "createBrchName",
          align: "left",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.bm.flowStartDt"),
          key: "flowStartDt",
          align: "left",
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
          title: this.$t("m.i.bm.flowCreateTime"),
          key: "createTime",
          align: "left",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.createTime == null || params.row.createTime === "") {
              return h("span", "---");
            }
            if (params.row.createTime.toString().length < 6) {
              let createTime = params.row.createTime + "";
              for (let i = 0; i < (6 - params.row.createTime.toString().length); i++) {
                createTime = "0" + createTime;
              }
              let date = this.$moment(createTime, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            } else {
              let date = this.$moment(params.row.createTime, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          }
        },
        {
          title: this.$t("m.i.bm.operDt"),
          key: "operDt",
          align: "left",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.operDt == null || params.row.operDt === "") {
              return "";
            }
            let date = this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.bm.operTm"),
          key: "operTm",
          align: "left",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.operTm == null || params.row.operTm === "") {
              return h("span", "---");
            }
            if (params.row.operTm.toString().length < 6) {
              let operTm = params.row.operTm + "";
              for (let i = 0; i < (6 - params.row.operTm.toString().length); i++) {
                operTm = "0" + operTm;
              }
              let date = this.$moment(operTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            } else {
              let date = this.$moment(params.row.operTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          }
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
      let auditColumn = [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.bm.approveCommitPerson"),
          key: "a",
          align: "left",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.bm.approveCommitPersonBrch"),
          key: "b",
          align: "left",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.bm.operResult"),
          key: "e",
          align: "left",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.bm.operOpin"),
          key: "f",
          align: "left",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.bm.operTm"),
          key: "h",
          align: "left",
          hiddenCol: false
        }
      ];
      return {
        formItem: formItem,
        userListFormItem: userListFormItem,
        columns: columns,
        userListColumns: userListColumns,
        auditColumn: auditColumn,
        selectData: null,
        productSelectWin: false,
        userListWin: false,
        batchAndBillInfoUrl: "",
        mainVue: true,
        billManagerVue: false,
        batchAndBillInfo: "",
        auditList: [],
        operResultList: [],
        auditWin: false,
        auditFlowId: "",
        batchId: "",
        listIds: "",
        infoShow: "",
        dictMap: new Map(),
        operStatusList: [],
        ifShowMore: false,
        showAttachWin: false,
        attachId: "",
        attachParams: {
          queryUrl: "",
          downloadUrl: "",
          attachFormItem: {
            auditFlowId: ""
          },
        }
      };
    },
    components: {
      CommonProductSelect: () => import(/*webpackChunkName: "bm/prod/product/commonProductSelect"*/"@/views/bizViews/bm/prod/product/commonProductSelect.vue"),
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
      this.getDictListByGroups("AuditFlow,AuditStatus,AuditOperResult").then(res => {
        this.operResultList = res.get("AuditOperResult");
        this.operStatusList = res.get("AuditStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel() {
        this.selectData = null;
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
        // this.$refs.formItem.resetFields()
        this.formItem.prodName = "";
        this.formItem.prodNo = "";
        this.formItem.auditStatus = "";
        this.formItem.operResult = "";
        this.formItem.operDt = "";
      },
      handleDateChange(value) {
        this.formItem.operDt = value.replace(/-/g, "");
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
      //查看
      showDetails() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.auditFlowId = this.selectData.id;
        post({ auditFlowId: this.auditFlowId }, "/bm/audit/auditTaskParticipate/func_getAuditBusiDataByFlowId").then(res => {
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
              let flowFuncNo = this.selectData.flowFuncNo + "-" + this.selectData.billClass;
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


      //查看子页面功能逻辑
      //返回
      returnMain() {
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
