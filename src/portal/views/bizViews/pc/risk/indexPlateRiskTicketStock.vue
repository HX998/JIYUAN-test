<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo"></h-input>
                </h-form-item>

                <!-- todo: 机构名称 -->
                <h-form-item :label="$t('m.i.common.brchName')" required props="brchNo">
                  <h-input v-model="formItem.brchNo" v-show="false"></h-input>
                  <h-input :value="formItem.branchName" readonly icon="android-search"
                           @on-click="queryBrchNos"></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.pc.pkDt')" prop="xxx">
                  <h-date-picker type="daterange" v-model="formItem.xxx" placement="bottom-end"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
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
            url="/pc/indexRiskTicket/query.json"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('view')">{{$t("m.i.common.view")}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增风险盘库信息</span>
        <span v-if="type=='modify'">修改风险盘库信息</span>
        <span v-if="type=='view'">查看风险盘库信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :required="isRequired" cols="2">
            <h-input v-if="type=='view'" :value="addForm.billNo" class="input-boder-0"
                     :title="addForm.billNo"></h-input>
            <h-input v-else v-model="addForm.billNo" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired" cols="2">
            <h-select v-if="type=='view'" :value="addForm.billType" class="input-boder-0" :title="addForm.billType">
              <h-option v-for="item in billTypeList" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billType">
              <h-option v-for="item in billTypeList" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
          </h-form-item>


          <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="remitter" cols="2">
            <h-input v-if="type=='view'" :value="addForm.remitter" class="input-boder-0"
                     :title="addForm.remitter"></h-input>
            <h-input v-else v-model="addForm.remitter" :maxlength=60></h-input>
          </h-form-item>


          <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acceptor" cols="2">
            <h-input v-if="type=='view'" :value="addForm.acceptor" class="input-boder-0"
                     :title="addForm.acceptor"></h-input>
            <h-input v-else v-model="addForm.acceptor" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="acptDt" cols="2">
            <h-date-picker v-if="type=='view'" :value="addForm.acptDt" class="input-boder-0" :title="addForm.acptDt"
                           type="date"></h-date-picker>
            <h-date-picker v-else v-model="addForm.acptDt" :maxlength=60 type="date"></h-date-picker>
          </h-form-item>

          <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt" cols="2">
            <h-date-picker v-if="type=='view'" :value="addForm.dueDt" class="input-boder-0" :title="addForm.dueDt"
                           type="date"></h-date-picker>
            <h-date-picker v-else v-model="addForm.dueDt" :maxlength=60 type="date"></h-date-picker>
          </h-form-item>


          <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" :required="isRequired" cols="2">
            <h-input v-if="type=='view'" :value="addForm.billMoney" class="input-boder-0"
                     :title="addForm.billMoney"></h-input>
            <h-typefield v-else type="money" bigTips v-model="addForm.billMoney" integerNum="10"
                         placeholder=""></h-typefield>
          </h-form-item>


          <h-form-item :label="$t('m.i.pc.riskDesc')" prop="riskDesc" cols="2">
            <h-input v-if="type=='view'" :value="addForm.riskDesc" class="input-boder-0"
                     :title="addForm.riskDesc"></h-input>
            <h-input v-else v-model="addForm.riskDesc" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.billInfo.riskStatus')" prop="origin" :required="isRequired" cols="2">
            <h-input v-if="type=='view'" :value="addForm.origin" class="input-boder-0"
                     :title="addForm.origin"></h-input>
            <h-input v-else v-model="addForm.origin" :maxlength=60></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addFormReset()">{{$t('m.i.common.reset')}}</h-button>-->
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <show-branch :showBranchWin="brchNoWin" title="机构名称" @brchNoChange="brchNoChange"
                 @showBranchWinClose="brchNoWinClose" ifcheck="true"></show-branch>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" ref="billInfoMain"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexPlateRiskTicketStock",
    components: {
      showBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key: "duoxuan",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key: "xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.id, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "remitter",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acceptor",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "acptDt",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
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
            title: this.$t("m.i.pc.riskDesc"),
            key: "riskDesc",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.riskStatus"),
            key: "xxx",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.originFlag"),
            key: "origin",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.kcBrch"),
            key: "xxx",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.pkDt"),
            key: "startDt",
            sortable: true,
            hiddenCol: false
          }
        ],
        formItem: {
          billNo: "",
          billType: "",
          remitter: "",
          acceptor: "",
          xxx: ""
        },
        addForm: {
          id: "",
          billNo: "",
          billType: "",
          acceptor: "",
          remitter: "",
          billMoney: "",
          acptDt: "",
          dueDt: "",
          riskDesc: "",
          origin: "",
          createDt: "",
          createTime: "",
          operNo: "",
          reserve1: "",
          reserve2: "",
          updateDt: "",
          updateTm: ""
        },
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        billTypeList: [
          {
            value: "1",
            label: "AC01:银承"
          }, {
            value: "2",
            label: "AC02:商承"
          }
        ],
        riskStatusList: [
          {
            value: "1",
            label: "RS01:挂失支付"
          }, {
            value: "2",
            label: "RS02:公示催告"
          }, {
            value: "3",
            label: "RS03:司法冻结"
          }, {
            value: "5",
            label: "RS05:争议票据"
          }
        ],
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        type: null,
        readonly: false,
        isRequired: true,
        tableRef: "selfTable",
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        brchNoWin: false,
        ifShowMore: false
      };
    },
    methods: {
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      handleAddForm(str) {

        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          let list = this.currentSelectList;
          if (list != null && list.length == 1) {
            this.currentSelectRow = this.currentSelectList[0];
          } else {
            this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
            return;
          }
          this.$nextTick(() => {
            this.queryObjById(this.currentSelectRow.id);
            if (this.type == "modify") {
              this.readonly = true;
            }
            if (this.type == "view") {
              this.isRequired = false;
            }
          });
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      queryObjById(id) {
        post({ id: id }, "/get.json").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.billNo = res.data.retData.billNo;
              this.addForm.billType = res.data.retData.billType;
              this.addForm.acceptor = res.data.retData.acceptor;
              this.addForm.remitter = res.data.retData.remitter;
              this.addForm.billMoney = res.data.retData.billMoney;
              this.addForm.acptDt = res.data.retData.acptDt;
              this.addForm.dueDt = res.data.retData.dueDt;
              this.addForm.riskDesc = res.data.retData.riskDesc;
              this.addForm.origin = res.data.retData.origin;
              this.addForm.createDt = res.data.retData.createDt;
              this.addForm.createTime = res.data.retData.createTime;
              this.addForm.operNo = res.data.retData.operNo;
              this.addForm.reserve1 = res.data.retData.reserve1;
              this.addForm.reserve2 = res.data.retData.reserve2;
              this.addForm.updateDt = res.data.retData.updateDt;
              this.addForm.updateTm = res.data.retData.updateTm;
              this.addForm.transplantFlag = res.data.retData.transplantFlag;
            } else {
              // this.submitMsg = "查询失败";
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },

      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url[TODO:替换后与后台联调]
            let url = this.type == "add" ? "/pc/indexRiskTicket/add.json" : "/pc/indexRiskTicket/update.json";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$hMessage.success(msg);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  this.$hMessage.error(this.$t("m.i.common.addFailed") + res.data.retMsg);
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$hMessage.error(this.$t("m.i.common.netError"));
              }

            });
          }
        });

      },
      handleComfirm() {
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          //this.delConfirm=true;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
        }

      },
      handledel() {
        let list = this.currentSelectList;

        if (list.length > 1) {
          this.$hMessage.info(this.$t("m.i.common.onlyChooseOneData"));
          return;
        }
        let delId = this.currentSelectList[0].id;
        post({ id: delId }, "/pc/indexRiskTicket/delete.json").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$hMessage.success(this.$t("m.i.common.deleteSuccess"));
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
            } else {
              this.$hMessage.error(this.$t("m.i.common.deleteFailed") + res.data.retMsg);
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$hMessage.error(this.$t("m.i.common.netError"));
          }
        });
      },
      //机构弹出框
      queryBrchNos() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },
      //根据弹框所选数据进行赋值
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
        this.formItem.brchNo = brchNos.substring(0, brchNos.length - 1);
        this.formItem.branchName = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      }
    }

  };
</script>

<style scoped>

</style>
