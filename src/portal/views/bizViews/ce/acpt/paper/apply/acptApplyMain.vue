<!--纸票承兑申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="queryForm" :label-width="90" ref="queryForm" cols="4" class="h-form-search">
                <h-form-item prop="isCommit" :label="$t('m.i.ce.isCommit')">
                  <h-radio-group v-model="isCommit">
                    <h-radio label="noCommit" @on-click="noCommitButton">
                      <span>{{$t("m.i.ce.noCommit")}}</span>
                    </h-radio>
                    <h-radio label="hasCommit" @on-click="hasCommitButton">
                      <span>{{$t("m.i.ce.hasCommit")}}</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="queryForm.drwrName" placeholder="" icon="android-search" @on-click="queryCustNo()" readonly></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="queryForm.acptProtocalNoLike" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="batchNoLike" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="queryForm.batchNoLike" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="queryForm.remitDt"  placeholder="" @on-change="handleDateChange" showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid
                :columns="batchColumns"
                highlightRow
                :auto-load="false"
                url="/ce/acpt/paper/apply/acptApplyMain/func_pageQueryAcptApplyBatch"
                :bindForm="queryForm"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="acptBatchOpenWin('add')" :disabled="isCommit === 'hasCommit'">{{$t("m.i.common.add")}}</h-button>
                  <h-button type="primary" @click="acptBatchOpenWin('modify')" :disabled="isCommit === 'hasCommit'">{{$t("m.i.common.modify")}}</h-button>
                  <h-button type="primary" @click="acptBatchDelete()" :disabled="isCommit === 'hasCommit'">{{$t("m.i.common.delete")}}</h-button>
                  <h-button type="primary" @click="acptBatchCancel()" :disabled="isCommit === 'noCommit'">{{$t("m.i.common.cancel")}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :showCustMessageWin="showCustInfoWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit" ref="showCustInfo"></show-cust-message>
        <!-- 新增修改弹窗 -->
        <acpt-apply-add :acptAddOrEditWin="acptAddOrEditWin" :batchParams="batchParams" :busiOwnBrchNo="busiOwnBrchNo"  @acptAddOrEditWinClose="acptAddOrEditWinClose" ref="acptAddOrEdit"></acpt-apply-add>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { off, on, post, getDictValueFromMap, formatNumber,getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptApplyMain",
    components: {
      "acpt-apply-add": ()=>import(/* webpackChunkName: "ce/acpt/paper/apply/acptApplyAdd" */`@/views/bizViews/ce/acpt/paper/apply/acptApplyAdd`),
    },
    data() {
      return {
        isCommit: "noCommit",
        showCustInfoWin: false,
        acptAddOrEditWin: false,
        acptTypeArray: [],
        guarntrTypeArray: [],
        busiOwnBrchNo:"",
        billTypeList: [],
        batchParams: {
          batchId: {
            type: Number
          },
          optType: "",
          isCommit: "",
          curFuncNo: "",
          invoiceAfterFlag:"0",
          acptType: "1",
          guarntrType: "4",
          dictMap: {
            type: Map
          },
          acptTypeArray: [],
          guarntrTypeArray: [],
          YonList: []
        },
        ifShowMore: false,
        dictMap: {
          type: Map
        },
        queryForm: {
          drwrCustNo: "",
          acptProtocalNoLike: "",
          batchNoLike: "",
          remitDt: "",
          curFuncNo: "PICE010203",
          billClass: "ME01",
          billType: "AC01",
          drwrName: ""
        },
        batchColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          }, {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          }, {
             title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.openBillManagerWin(params.row.id)
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          }, {
           title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          }, {
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            sortable: true,
            hiddenCol: false
          }, {
           title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          }, {
           title: this.$t("m.i.ce.acptType"),
            key: "acptType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AcptType", params.row.acptType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.ce.guarntrType"),
            key: "guarntrType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "GuarntrType", params.row.guarntrType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.billInfo.acptBrchNo"),
            key: "acptBrchNo",
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.acptType === "2") {
                return h("span",  params.row.agencyBankNo);
              } else {
                return h("span",  params.row.drweBankNo);
              }
            }
          }, {
           title: this.$t("m.i.ce.totalCount"),
            key: "totalCount",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.totalCount === "" || params.row.totalCount == null) {
                return h("span", "0");
              } else {
                return h("span", params.row.totalCount);
              }
            }
          },
          {
          title: this.$t("m.i.ce.totalAmt"),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null == params.row.totalAmt || params.row.totalAmt === "") {
                return h("span", "0.00");
              } else {
                let totalAmt = formatNumber(params.row.totalAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: totalAmt
                  }
                }, totalAmt);
              }
            }
          }
        ]
      };
    },
    mounted() {
      this.getDictListByGroups("GuarntrType,AcptType,Yon,DraftTypeCode").then(res => {
        this.YonList = res.get("Yon");
        this.billTypeList = res.get("DraftTypeCode");
        this.guarntrTypeArray = res.get("GuarntrType");
        this.acptTypeArray = res.get("AcptType");
        this.dictMap = res.get("map");
        this.handleSearch();
      });
      getSingleParamValuesByKeys("pc.is_marketing_bank_mode").then(res => {
        let busiOwnBrchNo = res["pc.is_marketing_bank_mode"];
        if (busiOwnBrchNo ==="1") {
          this.busiOwnBrchNo = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
        }
      });
    },
    watch: {
    },
    methods: {
      handleDateChange(value) {
        this.queryForm.remitDt = value.replace(/-/g, "");
      },
      //未提交
      noCommitButton() {
        this.isCommit = "noCommit";
        this.queryForm.curFuncNo = "PICE010203";
        this.handleSearch();
      },
      //已提交
      hasCommitButton() {
        this.isCommit = "hasCommit";
        this.queryForm.curFuncNo = "PICE010204";
        this.handleSearch();
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.queryForm.drwrCustNo = "";
        this.$refs.queryForm.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //查询客户信息
      queryCustNo() {
        this.showCustInfoWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.queryForm.drwrCustNo = info.custNo;
        this.queryForm.drwrName = info.custName;
        this.showCustInfoWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustInfoWin = false;
      },
      //新增、修改
      acptBatchOpenWin(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.batchId = this.currentSelectRow.id;
        } else {
          this.batchParams.batchId = null;
        }
        this.assembleParams(str);
      },
      //关闭新增、修改弹窗
      acptAddOrEditWinClose() {
        this.acptAddOrEditWin = false;
        let pageNo = this.batchParams.optType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除
      acptBatchDelete() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      openBillManagerWin(id) {
        this.batchParams.batchId = id;
        this.assembleParams("modify");
      },
      handleDel() {
        debugger
        let id = this.currentSelectRow.id;
        post({ id: id ,deleteFlag:"0"}, "/ce/acpt/paper/apply/acptApplyMain/func_delAcptBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else if(retCode === "000002" && retMsg === "100001"){
                this.continueApply(id);
            }else{
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      continueApply(id){
        let url="/ce/acpt/paper/apply/acptApplyMain/func_delAcptBatch";
        let content ="批次下所有明细将同时删除，确认要删除吗？";
        this.$hMsgBox.confirm({
          title:"确认要继续提交申请吗?",
          content:content,
          onOk: () => {
            post({ id: id ,deleteFlag:"1"}, url).then(res => {
              if (res) {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }
            });
          }
        });
      },
      //撤销
      acptBatchCancel() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定撤销申请吗?",
            onOk: () => {
              this.handleCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleCancel() {
        let batchId = this.currentSelectRow.id;
        post({ batchId: batchId }, "/ce/acpt/paper/apply/acptApplyMain/func_cancelSubmitFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      assembleParams(optType) {
        this.batchParams.optType = optType;
        this.batchParams.curFuncNo = this.queryForm.curFuncNo;
        this.batchParams.isCommit = this.isCommit;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.YonList = this.YonList;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.guarntrTypeArray = this.guarntrTypeArray;
        this.batchParams.acptTypeArray = this.acptTypeArray;
        this.batchParams.invoiceAfterFlag = "0";
        this.batchParams.acptType = "1";
        this.batchParams.guarntrType = "4";
        this.acptAddOrEditWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
