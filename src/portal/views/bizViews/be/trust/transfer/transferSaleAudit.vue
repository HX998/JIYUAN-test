<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')">
            {{addForm.busiBatchNo}}
          </h-form-item>
          <h-form-item :label="$t('m.i.be.brchName')">
            {{addForm.saleBrchName}}
          </h-form-item>
          <h-form-item :label="$t('m.i.be.otherBrchName')">
            {{addForm.buyBrchName}}
          </h-form-item>
          <h-form-item :label="$t('m.i.be.custBrchCode')">
            {{addForm.buyBrchCode}}
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')">
            {{formatDate(addForm.applDt)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')">
            {{format("DraftTypeCode",addForm.billType)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')">
            {{format("CDMedia",addForm.billClass)}}
          </h-form-item>
          <h-form-item :label="$t('m.i.be.transferReason')">
            {{addForm.transferReason}}
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')">
            {{addForm.reqRemark}}
          </h-form-item>
        </h-form>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :height="350"
        :bindForm="billFormItem"
        :onCurrentChange="onCurrentChange"
        :onCurrentChangeCancel="onCurrentChangeCancle"
        url="/be/trust/transfer/func_queryTransferSaleBillAudit"
        ref="billDatagrid">
        <div slot="toolbar">
          <h-button type="primary" @click="showImage">{{$t('m.i.common.image')}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

    <h-msg-box maximize v-model="showBillImage" width="800">
      <p slot="header">
        <span>影像信息</span>
      </p>
      <h-datagrid
        :columns="billimagecolumns"
        :autoLoad="false"
        highlight-row
        :url="billImgsUrl"
        :bindForm="imgParams"
        :row-select="true"
        ref="billimages">
      </h-datagrid>
      <div slot="footer"></div>
    </h-msg-box>
    <!-- 查看影像弹出框-->
    <show-image title="影像查看" :carousel-form="carouselForm" :carousel-data="carouselData"></show-image>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferSaleAudit",
    data() {
      return {
        currentSelectRow: [],
        // 影像控件弹框轮播图数据url
        carouselData: {
          imgUrls: []
        },
        // 影像控件弹框轮播图表单
        carouselForm: {
          initialIndex: 0,    //初始图片位置
          showDialog: false,    //控制影像控件显隐
          tags: []          //图片提示
        },
        billFormItem: {
          batchId: "",
          busiBatchId: ""
        },
        addForm: {
          billNo: "",
          billType: "",
          billClass: "",
          busiBatchNo: "",
          buyBrchName: "",
          saleBrchName: "",
          buyBrchCode: "",
          applDt: "",
          transferReason: "",
          reqRemark: ""
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
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.be.buyDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBrchCode'),
            key: "cfmAppBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dsctGrntBrCode'),
            key: "discGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        billimagecolumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed: "left",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.imgBatchNo'),
            key: "imgBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.imgType'),
            key: "imgType",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", "非交易过户");
            }
          },
          {
            title: this.$t('m.i.common.showImg'),
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showTransferSaleImage(params.row.id);
                  }
                }
              }, this.$t('m.i.common.view'));
            }
          }
        ],
        showImgWin: false,
        billImgsUrl: "/be/trust/transfer/func_queryTransferSaleImagePage",
        imgUrl: "",
        baseImgUrl: this.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleImage/func_showImg?id=",
        imgParams: {
          listId: ""
        },
        showBillImage: false,
        dictMap: new Map(),
        busiType: "",
        showBillInfoWin: false,
        billId: "",
        billRangeStart: "",
        billRangeEnd: "",
        billNo: "",
        selectBillsData: null
      };
    },
    components: {
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    created() {
      this.billFormItem.busiBatchId = this.batchId;
    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
      this.init();
    },
    methods: {
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectBillsData = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.selectBillsData = null;
      },
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let url = "";
        if (batchId) {
          url = "/be/trust/transfer/func_queryTransferSaleBatch";
        } else {
          this.$msgTip.error(this, { info: "批次ID不能为空" });
        }
        post({ id: batchId }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                this.addForm = res.data.retData;
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      //点击影像按钮事件
      showImage() {
        if (this.selectBillsData) {
          this.showBillImage = true;
          this.imgParams.listId = this.selectBillsData.id;
          this.$nextTick(() => {
            this.$refs.billimages.dataChange(1);
          });
        } else if (this.selectBillsData) {
          this.$msgTip.error(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //显示影像
      showTransferSaleImage(id) {
        let list = this.$refs.billimages.$data.tData;
        let initialIndex = 0;
        let preUrl = this.baseImgUrl;
        this.carouselData.imgUrls = [];
        for (let i = 0; i < list.length; i++) {
          this.carouselData.imgUrls.push(preUrl + list[i].id);
          if (id === list[i].id) {
            initialIndex = i;
          }
        }
        this.$loadingbox.open({
          title: "获取图像信息中，请稍后..."
        });
        setTimeout(() => {
          this.$loadingbox.close();
          // this.showImgWin = true;
          this.carouselForm.showDialog = true;
          this.carouselForm.initialIndex = initialIndex;
        }, 1000);
      },
      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      },
    }
  };
</script>

<style scoped>

</style>
