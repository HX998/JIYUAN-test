<!--点击成交-授信额度管理-新增、修改、查看弹出框-->
<template>
  <div>
    <div>
      <h-form :model="creditLimitFormItem" :label-width="115" ref="creditLimitFormItem" cols="3" class="h-form-search">
        <div>
          <h-form :model="creditLimitFormItem" :label-width="90" ref="creditLimitFormItem" cols="4" class="h-form-search">
            <common-input v-model="creditLimitFormItem.transMemberName" :label="$t('m.i.common.memberName')" prop="transMemberName"
                          :maxlength="60"></common-input>
            <query-btn :advanceShow="false" formClassAdd="1" :formSearch="handleSearch"
                       :formSearchReset="resetSearch"></query-btn>
          </h-form>
        </div>
      </h-form>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        highlight-row
        :auto-load="false"
        :url="dataGridUrl"
        :bindForm="creditLimitFormItem"
        :has-select="false"
        :rowSelect="true"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="infoAdd('add')" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.add")}}
          </h-button>
          <h-button type="primary" @click="infoAdd('modify')" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.modify")}}
          </h-button>
          <h-dropdown placement="bottom-start" @on-click="infoRestore" v-if="batchType!=='show'">
            <h-button type="primary" :disabled="!this.hadBatchSave">
              恢复
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list" id="dropDownMenu">
              <h-dropdown-item name="1" :disabled="!this.hadBatchSave">选择恢复</h-dropdown-item>
              <h-dropdown-item name="2" :disabled="!this.hadBatchSave">批次恢复</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="primary" @click="importTemplate" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.templateDownload")}}
          </h-button>
          <h-button type="primary" @click="infoImport" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.batchImport")}}
          </h-button>
          <h-button type="primary" @click="infoDelete" :disabled="!this.hadBatchSave"
                    v-if="batchType!=='show'">
            {{$t("m.i.common.delete")}}
          </h-button>
        </div>
      </h-datagrid>
    </div>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="optType==='add'">新增额度</span>
        <span v-if="optType==='modify'">设置回购额度</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <common-input v-model="addForm.transMemberId" :label="$t('m.i.be.memberId')" prop="transMemberId"
                        :maxlength="6" :readonly="true" :showIcon="optType==='add'" :required="true"
                        @on-click="showCpesBranch()" :clearVal="clearVal" :clearable="true"></common-input>
          <common-input v-model="addForm.transMemberName" :label="$t('m.i.be.memberName')" prop="transMemberName"
                        :maxlength="60" :readonly="true" :required="true"></common-input>
          <common-input v-model="addForm.transBrchCode" :label="$t('m.i.be.custBrchCode')" prop="transBrchCode"
                        :maxlength="6" :readonly="true"></common-input>
          <common-input v-model="addForm.transBrchName" :label="$t('m.i.be.otherBrchName')" prop="transBrchName"
                        :maxlength="60" :readonly="true"></common-input>
          <common-type-field v-model="addForm.saleAmt" :label="$t('m.i.be.saleAmt')" prop="saleAmt"
                             :validRules="amtRule" :required="true" :bigTips="false"></common-type-field>
          <common-type-field v-model="addForm.rebuyAmt" :label="$t('m.i.be.rebuyAmt')" prop="rebuyAmt"
                             :validRules="amtRule" :required="true" :bigTips="false"></common-type-field>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--查看额度使用详情弹出窗-->
    <h-msg-box v-model="quotaDetailWin" width="800" :mask-closable="false" @on-close="quotaDetailWinClose" class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>查看报价</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        :columns="detailColumns"
        highlight-row
        :auto-load="false"
        :url="quotaDetailUrl"
        :bindForm="quotaDetailFormItem"
        :has-select="false"
        :rowSelect="true"
        ref="quotaDetailDatagrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="quotaDetailWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <show-cpes-brch :brchCodeWin="showCpesBranchWin" @brchCodeWinClose="brchCodeWinClose"
                    @brchCodeChange="brchCodeChange" :cpesBrchParams="cpesBrchParams" selectType="radio" title="查询会员窗口"
                    datagridUrl="/be/market/anonyclick/credit/creditLimit/func_findPreCreditTradeMemberByPage"></show-cpes-brch>
    <!-- 批量导入 -->
    <common-file-upload-no-show :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "creditLimitTab",
    components: {
      ShowCpesBrch: () => import(/* webpackChunkName: "be/market/common/showCpesBrch"*/"@/views/bizViews/be/market/common/showCpesBrch")
    },
    data() {
      return {
        dataGridUrl: "",
        quotaDetailUrl: "",
        batchType: "",
        creditLimitFormItem: {
          batchId: this.batchParams.creditId,
          transMemberName: ""
        },
        quotaDetailFormItem: {
          batchId: "",
          transMemberId: ""
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
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
            title: this.$t("m.i.common.status"),
            key: "operFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditOperStatus", params.row.operFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "transMemberId",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "transMemberName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "transBrchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "transBrchName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.saleAmt"),
            key: "saleAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.saleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.be.rebuyAmt"),
            key: "rebuyAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.rebuyAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          }
        ],
        columnsForUphold: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
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
            title: this.$t("m.i.common.status"),
            key: "operFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditOperStatus", params.row.operFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "transMemberId",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "transMemberName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "transBrchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "transBrchName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.saleAmt"),
            key: "saleAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.saleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.be.rebuyAmt"),
            key: "rebuyAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.rebuyAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          }
        ],
        columnsForView: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
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
            title: this.$t("m.i.common.status"),
            key: "operFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditOperStatus", params.row.operFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "transMemberId",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "transMemberName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "transBrchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "transBrchName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.saleAmt"),
            key: "saleAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.saleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.be.showSale"),
            key: "showSale",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showCreditDetail(params.row.batchId, params.row.transMemberId,
                      '/be/market/anonyclick/credit/creditLimitSearch/func_searchSaleCreditDetail');
                  }
                }
              }, this.$t('m.i.common.view'));
            }
          },
          {
            title: this.$t("m.i.be.rebuyAmt"),
            key: "rebuyAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.rebuyAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.be.showRebuy"),
            key: "showRebuy",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showCreditDetail(params.row.batchId, params.row.transMemberId,
                      '/be/market/anonyclick/credit/creditLimitSearch/func_searchRebuyCreditDetail');
                  }
                }
              }, this.$t('m.i.common.view'));
            }
          }
        ],
        detailColumns: [
          {
            title: " ",
            type: "radio",
            key: "singleSelect",
            width: 60,
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('m.i.be.dueSettleDt'),
            key: "dueSettleDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.be.billTotalAmt"),
            key: "totalAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.totalAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.be.dueSettleAmtByUnit"),
            key: "dueSettleAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.dueSettleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          }
        ],
        optType: "",
        addOrEditWin: false,
        quotaDetailWin: false,
        submitFlag: false,
        addForm: {
          id: "",
          transMemberId: "",
          transMemberName: "",
          transBrchCode: "",
          transBrchName: "",
          saleAmt: "",
          rebuyAmt: ""
        },
        showCpesBranchWin: false,
        cpesBrchParams: {
          batchId: ""
        },
        amtRule: [{ trigger: "blur", message: "金额必须为数字，且整数不超过12位、小数不超过2位" }],
        importWin: false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/market/anonyclick/credit/creditLimit/func_importCreditTradeMember",  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
            batchId: ""
          }
        }
      };
    },
    props: {
      hadBatchSave: {
        type: Boolean,
        default: true
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          creditId: "",
          batchType: ""
        }
      }
    },
    watch: {
      "batchParams.batchType": {
        handler(val) {
          if (val) {
            this.dataGridUrl = val === "show" ? "/be/market/anonyclick/credit/creditLimitSearch/func_searchCreditTradeMemberPage" : "/be/market/anonyclick/credit/creditLimit/func_searchCreditTradeMemberPage";
            this.selectionHiddenCol();
          }
        },
        immediate: true
      },
      "batchParams.creditId": {
        handler(val) {
          if (val) {
            this.creditLimitFormItem.batchId = val;
          }
        },
        immediate: true
      }
    },
    methods: {
      selectionHiddenCol(){
        const columns = this.columnsForView;
        let selection=null;
        for (let column of columns) {
          if (column.key === 'multiSelect') {
            selection = column;
            break;
          }
        }
        if (selection != null) {
          selection.hiddenCol = this.batchParams.batchType === "show" ? true : false;
        }
      },
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        if (this.batchType === "show") {
          this.columns = this.columnsForView;
        } else {
          this.columns = this.columnsForUphold;
        }
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.creditLimitFormItem.resetFields();
        this.creditLimitFormItem.transMemberName = "";
      },
      clearVal() {
        this.addForm.transMemberId = "";
        this.addForm.transMemberName = "";
        this.addForm.transBrchCode = "";
        this.addForm.transBrchName = "";
      },
      showCpesBranch() {
        this.cpesBrchParams.batchId = this.batchParams.creditId;
        this.showCpesBranchWin = true;
      },
      brchCodeWinClose() {
        this.cpesBrchParams.batchId = "";
        this.showCpesBranchWin = false;
      },
      brchCodeChange(info) {
        this.addForm.transMemberId = info.transMemberId;
        this.addForm.transMemberName = info.transMemberName;
        this.addForm.transBrchCode = info.transBrchCode;
        this.addForm.transBrchName = info.transBrchName;
        this.showCpesBranchWin = false;
      },
      //新增、修改
      infoAdd(str) {
        this.optType = str;
        if (str === "modify") {
          if (this.$refs.datagrid.selects.length === 0 || this.$refs.datagrid.selects.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.addOrEditWin = true;
          this.addForm.id = this.$refs.datagrid.selects[0].id;
          this.addForm.transMemberId = this.$refs.datagrid.selects[0].transMemberId;
          this.addForm.transMemberName = this.$refs.datagrid.selects[0].transMemberName;
          this.addForm.transBrchCode = this.$refs.datagrid.selects[0].transBrchCode;
          this.addForm.transBrchName = this.$refs.datagrid.selects[0].transBrchName;
          this.addForm.saleAmt = formatNumber(this.$refs.datagrid.selects[0].saleAmt, 2, ",");
          this.addForm.rebuyAmt = formatNumber(this.$refs.datagrid.selects[0].rebuyAmt, 2, ",");
        } else {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.$refs.addForm.resetFields();
            this.resetAddForm();
          });
        }
      },
      resetAddForm() {
        this.addForm.id = "";
        this.addForm.transMemberId = "";
        this.addForm.transMemberName = "";
        this.addForm.transBrchCode = "";
        this.addForm.transBrchName = "";
        this.addForm.saleAmt = "";
        this.addForm.rebuyAmt = "";
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.addForm.saleAmt = this.addForm.saleAmt.toString().replace(/,/g, "");
            this.addForm.rebuyAmt = this.addForm.rebuyAmt.toString().replace(/,/g, "");
            this.submitFlag = true;
            let url = this.optType === "add" ? "/be/market/anonyclick/credit/creditLimit/func_addCreditTradeMember" : "/be/market/anonyclick/credit/creditLimit/func_editCreditTradeMember";
            let params = this.optType === "add" ?  { batchId: this.batchParams.creditId, creditTradeMemberDtos: [this.addForm] } : Object.assign({ batchId: this.batchParams.creditId }, this.addForm);
            post(params, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
      handleWinClose() {
        this.$refs.addForm.resetFields();
        this.resetAddForm();
        this.addOrEditWin = false;
      },
      //批量导入
      infoImport() {
        this.fileParams.uploadParams.batchId = this.batchParams.creditId;
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/anonyclick/credit/creditLimit/func_downloadImportInfo";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //删除
      infoDelete() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDeleteDetail();
          }
        });
      },
      handleDeleteDetail() {
        let list = this.$refs.datagrid.selects;
        let creditIds = [];
        for (let i = 0; i < list.length; i++) {
          creditIds.push(list[i].id);
        }
        post({
          batchId: this.batchParams.creditId,
          ids: creditIds.join(",")
        }, "/be/market/anonyclick/credit/creditLimit/func_deleteCreditTradeMember").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      infoRestore(type){
        let param = {};
        if(type === "1"){
          //选择恢复
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          let list = this.$refs.datagrid.selects;
          let creditIds = [];
          for (let i = 0; i < list.length; i++) {
            creditIds.push(list[i].id);
          }
          param.ids = creditIds.join(",");
        }
        param.batchId = this.batchParams.creditId;
        post(param, "/be/market/anonyclick/credit/creditLimit/func_restoreCreditTradeMember").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      quotaDetailWinOpen() {
        this.quotaDetailWin = true;
      },
      quotaDetailWinClose() {
        this.quotaDetailWin = false;
        this.quotaDetailUrl = "";
        this.quotaDetailFormItem.batchId = "";
        this.quotaDetailFormItem.transMemberId = "";
      },
      showCreditDetail(batchId, transMemberId, queryUrl) {
        this.quotaDetailUrl = queryUrl;
        this.quotaDetailFormItem.batchId = batchId;
        this.quotaDetailFormItem.transMemberId = transMemberId;
        this.$nextTick(() => {
          this.$refs.quotaDetailDatagrid.dataChange(1);
        });
        this.quotaDetailWinOpen();
      }
    },
    created() {
      this.creditLimitFormItem.batchId = this.batchParams.creditId;
      this.batchType = this.batchParams.batchType;
    },
    activated () {
      this.creditLimitFormItem.transMemberName = "";
    },
    deactivated () {
      this.creditLimitFormItem.transMemberName = "";
    }
  };
</script>

<style scoped>

</style>
