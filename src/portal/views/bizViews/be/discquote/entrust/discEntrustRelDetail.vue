<!--贴现通挂牌-新增、修改弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempDiscEntrustRelDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>委托申请详情</span>
      </p>
      <div>
        <div class="text-body">
          <h-row :gutter="16">
            <!--批次号-->
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}：</h-col>
                <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
              </h-row>
            </h-col>
            <!--本方机构名称-->
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.ownBrchName")}}：</h-col>
                <h-col span="15" class="val">{{viewDatailForm.brokerBrchName}}</h-col>
              </h-row>
            </h-col>
            <!--贴现申请人名称-->
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.discOutName")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.discCustName}}</h-col>
              </h-row>
            </h-col>
            <!--贴现申请人社会信用代码-->
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.ce.discountApplySocCode")}}：</h-col>
                <h-col span="15" class="val">{{viewDatailForm.discSocCode}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="16">
            <!--票据数量-->
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.totalNum")}}：</h-col>
                <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          :url="dataGridUrl"
          :bindForm="dataGridFormItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">

            <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { post, formatNumber ,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "discEntrustRelDetail",
    components: {

    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        viewDatailForm: {
          id: "",
          batchNo: "",
          brokerBrchCode: "",
          brokerBrchName: "",
          discCustName:"",
          discSocCode:"",
          totalNum:""
        },
        dataGridFormItem: {
          batchId: ""
        },
        columns: [
          // {
          //   type: "selection",
          //   width: 50,
          //   hiddenCol: false,
          //   align: "center"
          // },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            align: "left",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.entrustDate"),
            key: "entrustDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.entrustDt ? this.$moment(params.row.entrustDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.entrustMaxRate"),
            key: "entrustMaxRatePct",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.be.entrustEndDate"),
            key: "entrustEndDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.entrustEndDt ? this.$moment(params.row.entrustEndDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "discOutAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discOutBankNo"),
            key: "discOutBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discOutBankName"),
            key: "discOutBankName",
            hiddenCol: false
          }
        ],
        tempShowExcelTemplateWin: false,
        param: "",
        rows: ""
      };
    },
    props: {
      discEntrustRelDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
    },
    computed: {
      tempDiscEntrustRelDetailWin: {
        get() {
          return this.discEntrustRelDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      discEntrustRelDetailWin(val) {
        if (val) {
          this.dataGridUrl = "/be/discquote/entrust/discEntrustRelApplyMain/func_queryDiscEntrustRelBillPage";
          if(this.batchParams.dataGridUrl){
            this.dataGridUrl =this.batchParams.dataGridUrl;
          }

          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId=this.batchId;
            this.queryObjById();
            this.handleSearch();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/be/discquote/entrust/discEntrustRelApplyMain/func_getDiscEntrustRelBatch";
        if(this.batchParams.url){
          url=this.batchParams.url;
        }
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.viewDatailForm.id = obj.id;
              this.viewDatailForm.batchNo = obj.batchNo;
              this.viewDatailForm.brokerBrchName = obj.brokerBrchName;
              this.viewDatailForm.brokerBrchCode = obj.brokerBrchCode;
              this.viewDatailForm.discCustName = obj.discCustName;
              this.viewDatailForm.discSocCode = obj.discSocCode;
              this.viewDatailForm.totalNum = obj.totalNum;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.viewDatailForm.id = "";
        this.batchId = "";
        this.dataGridFormItem.batchId="";
        this.dataGridUrl ="";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("discEntrustRelDetailWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      listExport() {
        this.param = "discEntrustRelBillExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + this.batchParams.exportUrl;
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            batchId: this.batchId,
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = {
            batchId: this.batchId
          };
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },
    }
  };
</script>

<style scoped>

</style>
