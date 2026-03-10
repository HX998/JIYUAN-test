<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="80" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="transName" :label="$t('m.i.common.prodName')">
                  <h-input v-model="formItem.transName"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/acct/acctConfig/queryAcctConfigTranPage"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleForm('modify')" v-if="authObj.billAccessModify">
                {{$t("m.i.pc.copy")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增/修改弹出框 -->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :mask-closable="false" :maximize="true" @on-close="handleWinClose">
      <p slot="header">
        <span>复制</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="90" ref="addOrEditForm" cols="1" class="h-form-search">
          <show-product v-model="addOrEditForm.prodName" :clearProduct="clearProdNo" @productSelectedChange="productSelectedChange" :required="true"></show-product>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>

  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "queryAcctRecord",
    data() {
      return {
        formItem: {
          prodName: ""
        },
        addOrEditForm: {
          id: "",
          brchName: "",
          prodNo: "",
          prodName: ""
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false,
            align: "center"
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
            title: this.$t("m.i.pc.transEventNo"),
            key: "transEventNo",
            hiddenCol: false,

            sortable: true
          }, {
            title: this.$t("m.i.common.transName"),
            key: "transName",

            hiddenCol: false,
            sortable: true
          }, {
            title: this.$t("m.i.common.prodNo"),
            key: "prodNo",
            hiddenCol: false,
            sortable: true
          }, {
            title: this.$t("m.i.pc.eventNo"),
            key: "eventNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", formatteracctEvent(params.row.eventNo, params.row, params.row.index))
              ]);
            }
          }, {
            title: this.$t("m.i.config.acctModel"),
            key: "acctMode",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", formatteracctMode(params.row.acctMode, params.row, params.row.index))
              ]);
            }
          }, {
            title: this.$t("m.i.pc.balanceFlag"),
            key: "balanceFlag",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", formatterbalanceFlags(params.row.balanceFlag, params.row, params.row.index))
              ]);
            }

          }
        ],
        //按钮权限
        authObj: {
          billAccessAdd: true,
          billAccessModify: true,
          billAccessDel: true,
          billAccessExport: true,
          billAccessImport: true
        },
        type: null,
        addOrEditWin: false,
        submitFlag: false,
        readonly: false,
        currentSelectList: [],
        currentSelectRowInx: [],
        tableRef: "selfTable",
        rateControlRequired: true,
        amtControlRequired: true,
        acptBankTypeRequired: true,
        acptBankLevelRequired: true,
        uploadFileName: "",
        fileId: "",
        isRequired: false,
        dictMap: new Map(),
        billTypeList: [],
        YonList: [],
        //是否显示更多查询项
        ifShowMore: false
      };

      function formatterbalanceFlags(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "0":
              return "无余额";
            case "1":
              return "余额开启";
            case "2":
              return "余额结束";
          }
        } else {
          return "";
        }
      }

      function formatteracctMode(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "trans_data":
              return "交易记账";
            case "record_data":
              return "分录记账";

          }
        } else {
          return "";
        }
      }

      function formatteracctEvent(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "1100":
              return "普通记账";
            case "1200":
              return "手续费";
            case "1300":
              return "撤销记账";
            case "1400":
              return "对方应答";
            case "对方拒绝":
              return "对方拒绝";

          }
        } else {
          return "";
        }
      }
    },
    components: {},
    watch: {
      uploadFileNoneStatus(status) {
        if (status == "error" || status == "clear") {
          this.isGotoAdd = false;
        }
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,bankType,Yon,bankLevel").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.YonList = res.get("Yon");
        this.acptBankTypesList = res.get("bankType");
        this.acptBankLevelsList = res.get("bankLevel");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      clearProdNo() {
        this.addOrEditForm.prodName = "";
        this.addOrEditForm.prodNo = "";
      },
      //选择产品名称弹出框确认
      productSelectedChange(arr) {
        this.addOrEditForm.prodName = arr[0].title;
        this.addOrEditForm.prodNo = arr[0].id;
      },
      //新增、修改
      handleForm(type) {
        this.type = type;
        if (this.type === "modify" && this.currentSelectList.length === 0) {
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return;
        }
        if (this.type === "modify" && this.currentSelectList.length > 1) {
          this.$msgTip.info(this,{info:this.$t('m.i.common.onlyChooseOneData')});
          return;
        }
        this.addOrEditWin = true;
        this.$nextTick(() => {
          if (this.type === "modify") {
            this.addOrEditForm.id = this.currentSelectList[0].id;
            let id = this.currentSelectList[0].id;
            post({ id: id }, "/bm/prod/rate/billAccessMain/func_findProductRate").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  if ( res.data.retData != null) {
                    this.addOrEditForm.prodNo = res.data.retData.prodNo;
                    this.addOrEditForm.prodName = res.data.retData.prodName;
                  } else {
                    this.addOrEditForm.prodNo = "";
                    this.addOrEditForm.prodName = "";
                  }
                } else {
                  this.$hMessage.error({
                    content: msg,
                    duration: 5,
                    closable: true
                  });
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          } else {
            this.addOrEditReset();
          }
        });
      },
      // 新增/修改页面提交
      formAdd() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? "/pc/acct/acctConfig/copyAcctConfigTran" : "/pc/acct/acctConfig/copyAcctConfigTran";
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this,{info:msg});
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectList = [];
                } else {
                  this.$hMessage.error({
                    content: msg,
                    duration: 5,
                    closable: true
                  });
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //重置新增/修改窗口
      addOrEditReset() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.addOrEditForm.prodNo = "";
      },
      handleWinClose() {
        this.$refs.addOrEditForm.resetFields();
      },
      addOrEditWinClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
