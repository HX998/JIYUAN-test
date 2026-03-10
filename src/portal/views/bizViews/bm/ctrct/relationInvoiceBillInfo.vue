<template>
  <div>
    <!--关联发票票据信息弹出框-->
    <h-msg-box v-model="tempRelationInvoiceBillWin" width="1000" :mask-closable="false" @on-close="goBack"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :footerHide="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <div class="h-form-search-box">
          <h-form :model="relationBillForm" :label-width="100" ref="relationBillForm" cols="4"
                  class="h-form-search">
            <h-form-item :label="$t('m.i.bm.invoiceNo')" prop="invoiceNo">
              <h-input v-model="relationBillForm.invoiceNo"></h-input>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </div>
      </div>
      <!--数据展示表格-->
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="columns"
            :url="URL"
            :bindForm="relationBillForm"
            :auto-load="false"
            highlightRow
            :row-select="true"
            :has-select="hasSelect"
            ref="datagrid">
            <!-- 弹出框模式顶部按钮 -->
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="modifyOccupyInvoiceAmt">{{$t("m.i.bm.modifyOccupyInvoiceAmt")}}</h-button>
              <h-button type="primary" @click="deleteOccupyInvoiceAmt">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="goBack">{{$t("m.i.common.goBack")}}</h-button>
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </h-msg-box>

    <!--修改占用发票金额信息弹出框-->
    <h-msg-box v-model="showModifyOccupyInvoiceWin" width="400" height="400"
               class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="modifyClose">
      <p slot="header">
        <span>修改占用发票金额</span>
      </p>
      <div>
        <h-form :model="modifyOccupyInvoiceFrom" :label-width="100" ref="modifyOccupyInvoiceFrom" cols="1"
                class="h-form-search">
          <h-form-item :label="$t('m.i.bm.invoiceNo')" prop="invoiceNo">
            <h-input v-model="modifyOccupyInvoiceFrom.invoiceNo" readonly></h-input>
          </h-form-item>
          <common-type-field v-model="modifyOccupyInvoiceFrom.invoiceAmt" :label="$t('m.i.bm.invoiceAmt')" prop="invoiceAmt" readonly></common-type-field>
          <common-type-field v-model="modifyOccupyInvoiceFrom.orgInvoiceUsedAmt" :label="$t('m.i.ce.orgInvoiceUsedAmt')" prop="orgInvoiceUsedAmt"
                             readonly className="h-form-long-label"></common-type-field>
          <common-type-field v-model="modifyOccupyInvoiceFrom.invoiceOtherUsedAmt" :label="$t('m.i.ce.invoiceOtherUsedAmt')" prop="invoiceOtherUsedAmt"
                             readonly></common-type-field>
          <common-type-field v-model="modifyOccupyInvoiceFrom.invoiceUsableAmt" :label="$t('m.i.ce.invoiceSurplusAmt')" prop="invoiceUsableAmt"
                             readonly className="h-form-long-label"></common-type-field>
          <h-form-item :label="$t('m.i.bm.modifyOccupyInvoiceAmt')" prop="invoiceUsedAmt" required class="h-form-long-label">
            <h-typefield type="money" v-model="modifyOccupyInvoiceFrom.invoiceUsedAmt" :maxlength="20" placeholder="" bigTips
                         @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')" :nonNegative="true"></h-typefield>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="modifyClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="modifySubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "relationInvoiceBillInfo",
    data() {
      return {
        showModifyOccupyInvoiceWin: false,
        URL: "/bm/ctrct/invoiceInfoManager/func_listRelationInvoiceInfo",
        relationBillForm: {
          invoiceNo:"",
          listId: ""
        },
        currentSelectRow:[],
        modifyOccupyInvoiceFrom: {
          invoiceNo:"",
          invoiceAmt:"",
          orgInvoiceUsedAmt:"",
          invoiceOtherUsedAmt:'',
          invoiceUsableAmt:'',
          invoiceUsedAmt:'',
          id:'',
          invoiceId:'',
        },
        hasSelect : false,
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
            title: this.$t('m.i.bm.invoiceNo'),
            key: "invoiceNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceAmtUnit'),
            key: "invoiceAmt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let invoiceAmt = formatNumber(params.row.invoiceAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: invoiceAmt
                }
              }, invoiceAmt);
            }
          },
          {
            title: this.$t('m.i.bm.invoiceUsedAmtByUnit'),
            key:'invoiceUsedAmt',
            hiddenCol:false,
            render: (h, params) => {
              if (params.row.invoiceUsedAmt == null || params.row.invoiceUsedAmt === "") {
                return h("span", "0.00");
              } else {
                let invoiceUsedAmt = formatNumber(params.row.invoiceUsedAmt, 2, ',');
                return h("span", {
                  domProps: {
                    title: invoiceUsedAmt
                  }
                }, invoiceUsedAmt);
              }
            }
          },
          {
            title: this.$t('m.i.bm.invoiceUsableAmtByUnit'),
            key:'invoiceUsableAmt',
            hiddenCol:false,
            render: (h, params) => {
              if (params.row.invoiceUsableAmt == null || params.row.invoiceUsableAmt === "") {
                return h("span", "0.00");
              } else {
                let invoiceUsableAmt = formatNumber(params.row.invoiceUsableAmt, 2, ',');
                return h("span", {
                  domProps: {
                    title: invoiceUsableAmt
                  }
                }, invoiceUsableAmt);
              }
            }
          },
          {
            title: this.$t('m.i.bm.billInvoiceUsedAmtUnit'),
            key:'invoiceBillUsedAmt',
            hiddenCol:false,
            render: (h, params) => {
              let invoiceBillUsedAmt = formatNumber(params.row.invoiceBillUsedAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: invoiceBillUsedAmt
                }
              }, invoiceBillUsedAmt);
            }
          },
          {
            title: this.$t('m.i.bm.invoiceDt'),
            key: "invoiceDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.invoiceDt == null || params.row.invoiceDt === "") {
                return "";
              }
              let date = this.$moment(params.row.invoiceDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.buyerName'),
            key: "buyerName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceContent'),
            key: "invoiceContent",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceType'),
            key: "invoiceType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "InvType", params.row.invoiceType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.bm.invoiceRatioPct'),
            key: "invoiceRatioPct",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.bm.invoiceTaxMoneyUnit'),
            key: "invoiceTaxInterest",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.invoiceTaxInterest == null || params.row.invoiceTaxInterest === "") {
                return h("span", "0.00");
              } else {
              let invoiceTaxInterest = formatNumber(params.row.invoiceTaxInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: invoiceTaxInterest
                }
              }, invoiceTaxInterest);
              }
            }
          }
        ]
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "已关联发票信息查询";
        }
      },
      relationInvoiceBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      relationInvoiceBillParams: {
        type: Object,
        default: {
          listId: "",
          cancelRelationUrl:"",
          dictMap: new Map()
        }
      }
    },
    watch: {
      relationInvoiceBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempRelationInvoiceBillWin: {
        get() {
          return this.relationInvoiceBillWin;
        },
        set() {
        }
      }
    },
    mounted() {
      this.getDictListByGroups("InvType").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },

      //查询
      formSearch() {
        this.relationBillForm.listId = this.relationInvoiceBillParams.listId;
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },
      resetSearch() {
        this.$refs.relationBillForm.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },

      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },

      //返回
      goBack() {
        this.$refs.relationBillForm.resetFields();
        this.relationBillForm.listId = "";
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("relationInvoiceBillWinClose", "");
      },

      //修改占用发票金额
      modifyOccupyInvoiceAmt() {
        if (this.$refs.datagrid.selects.length === 1) {
          this.modifyOccupyInvoiceFrom.invoiceNo = this.$refs.datagrid.selects[0].invoiceNo;
          this.modifyOccupyInvoiceFrom.invoiceAmt = this.$refs.datagrid.selects[0].invoiceAmt;
          this.modifyOccupyInvoiceFrom.orgInvoiceUsedAmt = this.$refs.datagrid.selects[0].invoiceBillUsedAmt;
          this.modifyOccupyInvoiceFrom.invoiceOtherUsedAmt = this.$refs.datagrid.selects[0].invoiceOtherUsedAmt;
          this.modifyOccupyInvoiceFrom.invoiceUsableAmt = this.$refs.datagrid.selects[0].invoiceUsableAmt;
          this.modifyOccupyInvoiceFrom.id = this.$refs.datagrid.selects[0].invoiceBillId;
          this.modifyOccupyInvoiceFrom.invoiceId = this.$refs.datagrid.selects[0].id;
          this.showModifyOccupyInvoiceWin = true;
          this.$nextTick(() => {
            this.$refs.modifyOccupyInvoiceFrom.resetValidateField("invoiceUsedAmt");
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return
        }
      },

      //确认
      modifySubmit() {
        if ((this.modifyOccupyInvoiceFrom.invoiceUsedAmt - this.modifyOccupyInvoiceFrom.orgInvoiceUsedAmt) > this.modifyOccupyInvoiceFrom.invoiceUsableAmt) {
          this.$msgTip.info(this, { info: "(修改占用金额-本张票据原占用发票金额）不得大于发票剩余可占用额度" });
          return;
        }
        this.$refs["modifyOccupyInvoiceFrom"].validate(valid => {
          if (valid){
            let orgInvoiceUsedAmt = "0";
            if (null != this.$refs.datagrid.selects[0].invoiceBillUsedAmt && this.$refs.datagrid.selects[0].invoiceBillUsedAmt != 0) {
              orgInvoiceUsedAmt = this.$refs.datagrid.selects[0].invoiceBillUsedAmt;
            }
            post({"id": this.modifyOccupyInvoiceFrom.id, "invoiceId":this.modifyOccupyInvoiceFrom.invoiceId,
                "orgInvoiceUsedAmt":orgInvoiceUsedAmt, "invoiceUsedAmt":this.modifyOccupyInvoiceFrom.invoiceUsedAmt},
              "/bm/ctrct/invoiceBillInfo/func_updateOccupyInvoiceAmt").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: res.data.retMsg });
                  this.modifyClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },

      //删除
      deleteOccupyInvoiceAmt() {
        if (this.$refs.datagrid.selects.length >= 1) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认删除吗",
            onOk: () => {
              let list = this.$refs.datagrid.selects;
              let relationDtoList = [];
              for (var i = 0; i < list.length; i++) {
                var obj = {"id":list[i].invoiceBillId,"invoiceId":list[i].id,"invoiceUsedAmt":list[i].invoiceBillUsedAmt};
                relationDtoList.push(obj);
              }
              debugger;
              post({relationDtoList : relationDtoList}, "/bm/ctrct/invoiceBillInfo/func_deleteRelatedInvoice").then(res => {
                if (res) {
                  if (res.data.retCode === "000000") {
                    this.$msgTip.success(this, { info: res.data.retMsg });
                    post({"id":this.relationInvoiceBillParams.listId}, this.relationInvoiceBillParams.cancelRelationUrl).then(then => {
                      if (res.data.retCode === "000000") {
                        this.modifyClose();
                      }
                    }).catch(error => {
                      this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
                    });
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            },
            onCancel: () => {
              this.modifyClose();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },

      //关闭
      modifyClose() {
        this.modifyOccupyInvoiceFrom.invoiceNo = "";
        this.modifyOccupyInvoiceFrom.invoiceAmt = "";
        this.modifyOccupyInvoiceFrom.orgInvoiceUsedAmt = "";
        this.modifyOccupyInvoiceFrom.invoiceOtherUsedAmt = "";
        this.modifyOccupyInvoiceFrom.invoiceUsableAmt = "";
        this.modifyOccupyInvoiceFrom.invoiceUsedAmt = "";
        this.modifyOccupyInvoiceFrom.id = "";
        this.modifyOccupyInvoiceFrom.invoiceId = "";
        this.showModifyOccupyInvoiceWin = false;
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },

      //金额格式化
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.modifyOccupyInvoiceFrom.invoiceUsedAmt)) && isFinite(this.modifyOccupyInvoiceFrom.invoiceUsedAmt)) {
            this.modifyOccupyInvoiceFrom.invoiceUsedAmt = this.modifyOccupyInvoiceFrom.invoiceUsedAmt == null ? "0.00" : formatNumber(this.modifyOccupyInvoiceFrom.invoiceUsedAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.modifyOccupyInvoiceFrom.invoiceUsedAmt = this.modifyOccupyInvoiceFrom.invoiceUsedAmt.toString().replace(/,/g, "");
        }
      },

    }
  };
</script>

<style scoped>

</style>
