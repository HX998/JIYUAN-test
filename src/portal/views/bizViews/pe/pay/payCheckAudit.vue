<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.batchNo')}}：</h-col>
                <h-col span="15" class="val">{{  viewDetailForm.batchNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.prodName }}</h-col>
              </h-row>
            </h-col>

            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.brchNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.brchNo  }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.brchName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.brchName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.pyeeAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.pyeeAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.pyeeName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.pyeeName }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.pyeeBankNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.pyeeBankNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.pyeeBankName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.pyeeBankName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.pe.payAmt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.payAmt }}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="columns"
        highlight-row
        :bindForm="formItem"
        url="/pe/pay/payCheckAudit/func_pageQueryPayDetailInfo"
        :row-select="true"
        :has-select="false"
        ref="billDatagrid">
        <div slot="toolbar">
        </div>
      </h-datagrid>
    </div>
  </div>
</template>

<script>
  import { post, on, off,formatNumber,getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "payCheckAudit",
    data() {
      return {
        formItem: {
          ids:"",
          batchId:"",
        },
        viewDetailForm:{
          batchNo : "",
          prodNo  : "",
          prodName  : "",
          brchNo  : "",
          brchName  : "",
          pyeeName  : "",
          pyeeBankName : "",
          pyeeBankNo  : "",
          pyeeAcctNo  : "",
          drweName  : "",
          drweAcctNo  : "",
          drweBankNo  : "",
          payAmt  : "",
        },
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
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.pe.payAmt'),
            key: "payAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let payAmt = formatNumber(params.row.payAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: payAmt
                }
              }, payAmt);
            }
          },
          {
            title: this.$t('m.i.common.prodNo'),
            key: "prodNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.prodName'),
            key: "prodName",
            hiddenCol: false,
          },

        ],
        dictMap: new Map(),
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        //影像上传
        showUploadImageWin: false,

      }
    },
    components: {
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: "",
    },
    created() {
      this.formItem.ids = this.listIds;
      this.formItem.batchId = this.batchId;
    },
    mounted() {
      getDictListByGroups("CfmAppReqType,CfmAppType,DraftTypeCode,map").then(res => {
        this.dictMap = res.get("map");
      });
      this.getBatchInfo();
    },
    methods: {
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      formatRefuseCode(code){
        if (code === null || code ==="") {
          return "同意"
        } else {
          if(code==="RR02"){
            return "需补录影像";
          } else if (code==="RR03") {
            return "需实物验证";
          } else if (code==="RR05") {
            return "审批拒绝";
          }
        }
      },
      //  初始获取批次信息
      getBatchInfo() {
        let ids = this.listIds;
        let url = "";
        if (this.batchId) {
          url = "/pe/pay/payCheckAudit/func_queryPayInfoSumInfo";
        } else {
          this.$msgTip.error(this, { info: "明细ID不能为空" });
        }
        post({ id: this.batchId }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                this.viewDetailForm.batchNo = res.data.retData.batchNo;
                this.viewDetailForm.prodNo = res.data.retData.prodNo;
                this.viewDetailForm.prodName = res.data.retData.prodName;
                this.viewDetailForm.brchNo = res.data.retData.brchNo;
                this.viewDetailForm.brchName = res.data.retData.brchName;
                this.viewDetailForm.pyeeName = res.data.retData.pyeeName;
                this.viewDetailForm.pyeeBankName = res.data.retData.pyeeBankName;
                this.viewDetailForm.pyeeBankNo = res.data.retData.pyeeBankNo;
                this.viewDetailForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
                this.viewDetailForm.drweName = res.data.retData.drweName;
                this.viewDetailForm.drweAcctNo = res.data.retData.drweAcctNo;
                this.viewDetailForm.drweBankNo = res.data.retData.drweBankNo;
                this.viewDetailForm.payAmt = res.data.retData.payAmt;
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

    }
  };
</script>

<style scoped>

</style>
