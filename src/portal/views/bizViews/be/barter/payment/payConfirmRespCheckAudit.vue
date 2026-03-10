<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <h-form :model="formItem" :label-width="120" ref="formItem" cols="3" class="h-form-search">
          <h-form-item :label="$t('m.i.pe.totalAmt')+':'">
            {{formatMoney(viewDetailForm.sumAmt)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.sumCount')+':'">
            {{viewDetailForm.totalNum}}
          </h-form-item>
        </h-form>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :bindForm="formItem"
        url="/be/barter/payment/payConfirmResponseMain/func_pageQueryPayConfirmRespList"
        :row-select="true"
        :has-select="false"
        ref="billDatagrid">
        <div slot="toolbar">
        </div>
      </h-datagrid>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
    <!-- 影像信息界面-->
    <show-image-info :show-upload-image-win="showUploadImageWin"
                     :params="imageParams"
                     :isShowInfo="false"
                     @uploadImageWinClose="uploadImageWinClose"></show-image-info>
  </div>
</template>

<script>
  import { post, on, off,formatNumber,getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "payConfirmRespCheckAudit",
    data() {
      return {
        formItem: {
          ids:""
        },
        viewDetailForm:{
          sumAmt:"",
          totalNum:""
        },
        billColumns: [
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
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.be.applDealOpin'),
            key: "cfmAppRefuseCode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let cfmAppRefuseCode = this.formatRefuseCode(params.row.cfmAppRefuseCode);
              return h("span", {
                domProps: {
                  title: cfmAppRefuseCode
                }
              }, cfmAppRefuseCode);
            }
          },
          {
            title: this.$t('m.i.billInfo.cfmAppOpin'),
            key: "cfmAppOpin",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "respRemark",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
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
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.cfmAppType'),
            key: "cfmAppType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CfmAppType", params.row.cfmAppType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.cfmAppReqType'),
            key: "cfmAppReqType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CfmAppReqType", params.row.cfmAppReqType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.applBrchCode'),
            key: "applBrchCode",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.applBrchName'),
            key: "applBrchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptAcctNo'),
            key: "acptAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "viewImage",
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
                      this.openImgWin(params.row.id);
                    }
                  }
                }, this.$t("m.i.common.showImg"))
              ]);
            }
          },
        ],
        dictMap: new Map(),
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        //影像上传
        showUploadImageWin: false,
        imageParams: {
          id: "",
          pageSearchUrl: "/be/barter/payment/payConfirmResponseMain/func_pageQueryPayConfirmRespImgList", //分页查询url
          imageSearchUrl: "/be/barter/payment/payConfirmResponseMain/func_queryCpesImgage", //影像查询url
          imgShowUrl:"/be/barter/payment/payConfirmResponseMain/func_showImgage?id=", //查看url
        }
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
      formatMoney(value) {
        return formatNumber(value, 2, ',');
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
        if (ids) {
          url = "/be/barter/payment/payConfirmResponseMain/func_pageQueryPayConfirmRespListSumAmtAndTotalNum";
        } else {
          this.$msgTip.error(this, { info: "明细ID不能为空" });
        }
        post({ ids: ids }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                this.viewDetailForm.sumAmt = res.data.retData.sumAmt;
                this.viewDetailForm.totalNum = res.data.retData.totalNum;
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //影像维护弹窗
      openImgWin(str) {
        this.imageParams.id = str;
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
