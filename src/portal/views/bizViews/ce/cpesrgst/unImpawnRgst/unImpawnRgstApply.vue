<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA01" key="BTA01">已录入</h-option>
                    <h-option value="BTA06" key="BTA06">登记复核已驳回</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="rgstDt" :label="$t('m.i.common.unImpawnDt')">
                  <h-date-picker type="date" v-model="formItem.rgstDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleRgstDtChange"></h-date-picker>
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
                      url="/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/func_pagingQueryPaperRgst"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pickBill">{{$t("m.i.common.pickBill")}}</h-button>
              <h-button type="primary" @click="busiModify">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="busiDelete">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="templateDownload">{{$t("m.i.common.templateDownload")}}</h-button>
              <h-button type="primary" @click="batchImport">{{$t("m.i.common.batchImport")}}</h-button>
              <h-button type="primary" @click="submitRecheck">{{$t("m.i.common.submitCheck")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>


    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>

    <!-- 挑票 -->
    <un-impawn-rgst-apply-pick-bill :pick-bill-win="pickBillWin"
                                    @pickBillWinClose="pickBillWinClose"
                                    @pickBillSubmit="pickBillSubmit"></un-impawn-rgst-apply-pick-bill>

    <!-- 修改解质押登记信息 -->
    <h-msg-box v-model="editWin" width="800" @on-close="editWinClose" class="h-form-search-layer" :maximize="true"
               :mask-closable="false">
      <p slot="header">
        <span>修改解质押登记信息</span>
      </p>
      <div>
        <h-form :model="editForm" :label-width="115" ref="editForm" cols="2" class="h-form-search">
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="editForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
            <h-input v-model="editForm.billNo" :maxlength="16" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required>
            <h-typefield v-model="editForm.billMoney" :maxlength="20" placeholder="" bigTips readonly></h-typefield>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="editForm.dueDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.drweBankNo')" required>
            <h-input v-model="editForm.acptBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="rgstDt" :label="$t('m.i.common.unImpawnDt')" required>
            <h-date-picker v-model="editForm.rgstDt" type="date" showFormat :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item prop="rgstRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="editForm.rgstRemark" :canResize="false"
                     :maxlength="300"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="editWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="editWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "unImpawnRgstApply",
    components: {
      UnImpawnRgstApplyPickBill: () => import(/* webpackChunkName: "ce/cpesrgst/unImpawnRgst/unImpawnRgstApplyPickBill" */`@/views/bizViews/ce/cpesrgst/unImpawnRgst/unImpawnRgstApplyPickBill`)
    },
    data() {
      return {
        //修改
        editWin: false,
        editForm: {
          id: "",
          billType: "",
          billNo: "",
          billMoney: "",
          dueDt: "",
          acptBankNo: "",
          rgstDt: "",
          rgstRemark: ""
        },
        //挑票
        pickBillWin: false,
        //票面
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        //字典值
        dictMap: new Map(),
        billTypeList: [],
        rgstStatusList: [],

        ifShowMore: false,
        formItem: {
          rgstClass: "RI02",
          billNo: "",
          rgstDt: "",
          rgstStatus: ""
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.unImpawnDt"),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rgstDt == null || params.row.rgstDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.qualityBankName"),
            key: "transToBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.pledgorName"),
            key: "transFromName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.pledgorAcctNo"),
            key: "transFromAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.pledgorBankName"),
            key: 'transFromBankName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.registerStatus"),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AcptRgstStatus", params.row.rgstStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.dataSource"),
            key: "isInnerChannel",
            hiddenCol: false,
            render: (h, params) => {
              let flag = "";
              if (params.row.dataSource === "1") {
                flag = "是";
              } else if (params.row.dataSource === "2") {
                flag = "否";
              }
              return h("span", { domProps: { title: flag } }, flag);
            }
          },
          {
            title: this.$t("m.i.common.remark"),
            key: "rgstRemark",
            hiddenCol: false
          }
        ],

        //导入
        importWin: false,
        fileParams: {
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/analysisExcelData",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/func_saveExcelData",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
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
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              hiddenCol: false,
              sortable: true,
              /*render: (h, params) => {
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row.billId, params.row.billNo);
                    }
                  }
                }, params.row.billNo);
              }*/
            },
            {
              title: this.$t("m.i.billInfo.billMoneyByUnit"),
              key: "billMoney",
              hiddenCol: false,
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
              title: this.$t("m.i.billInfo.acptBankNo"),
              key: "acptBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.common.unImpawnDt"),
              key: "rgstDt",
              hiddenCol: false,
              render: (h, params) => {
                let date = params.row.rgstDt == null ? "" : this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.common.remark"),
              key: "rgstRemark",
              hiddenCol: false
            }
          ],
          paramKey: "list"         //后台接收对应key
        }

      };
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,AcptRgstStatus").then(res => {
        this.rgstStatusList = res.get("AcptRgstStatus");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleRgstDtChange(value) {
        this.formItem.rgstDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //票面
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      //挑票
      pickBill() {
        this.pickBillWin = true;
      },
      pickBillSubmit(list) {
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        // let id = "";
        // id = list[0].id;
        post({ ids: ids }, "/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/func_addUmimpawnRgstInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.pickBillWinClose();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      pickBillWinClose() {
        this.pickBillWin = false;
        this.handleSearch();
      },

      //修改
      busiModify() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.$refs.datagrid.selects[0].id;
        post({ id: id }, "/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/func_queryPaperRgstById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.editForm.id = id;
              this.editForm.billType = res.data.retData.billType;
              this.editForm.billNo = res.data.retData.billNo;
              this.editForm.billMoney = res.data.retData.billMoney;
              this.editForm.dueDt = this.$moment(res.data.retData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.editForm.acptBankNo = res.data.retData.acptBankNo;
              this.editForm.rgstDt = this.$moment(res.data.retData.rgstDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.editForm.rgstRemark = res.data.retData.rgstRemark;
              this.editWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      editWinSubmit() {
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            this.editForm.dueDt = this.$moment(this.editForm.dueDt).format("YYYYMMDD");
            this.editForm.rgstDt = this.$moment(this.editForm.rgstDt).format("YYYYMMDD");
            let pageNo = this.$refs.datagrid.pageInfo.pageNo;
            post(this.editForm, "/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/func_updateUmimpawnPaperRgst").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.editWinClose();
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(pageNo);
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
      editWinClose() {
        this.editWin = false;
        this.editForm.id = "";
        this.$refs.editForm.resetFields();
      },

      //删除
      busiDelete() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/func_deleteUmimpawnPaperRgst").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/func_downloadUmimpawnRgstModel";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },

      //批量导入
      batchImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },

      //提交复核
      submitRecheck() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定提交复核吗？",
          onOk: () => {
            this.handleRecheck();
          }
        });
      },
      handleRecheck() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/ce/cpesrgst/umImpawnRgst/umImpawnRgstApply/func_submitRgstApply").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
