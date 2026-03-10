<!--挂失解挂发生查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.acptRgstBrchNoList" :label="$t('m.i.pe.acptBrch')" prop="acptRgstBrchNoList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.acptRgstBrchNoList" :brchName.sync="formItem.acptRgstBrchList"></show-branch>
                <h-form-item prop="sspdStatus" :label="$t('m.i.pe.sspdStatus')">
                  <h-select v-model="formItem.sspdStatus" placeholder="">
                    <h-option value="3" key="3">已止付</h-option>
                    <h-option value="6" key="6">已解除止付</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxLength="30"></h-input>
                </h-form-item>
          <!--      <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>-->
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="minBillMoney">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20" placeholder="" bigTips
                                   divided></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20" placeholder="" bigTips
                                   divided></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('drwrName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly clearable></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pe.sumMoney')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.total')">
                    <h-input v-model="sumCount" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            get-data-func
            @get-data="getStopPaymentDataList"
            :gridData="gridData"
            :bindForm="formItem"
            :hasSelect = false
            :rowSelect = true
            :url="dataUrl"
            :auto-load="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryBill()">{{$t("m.i.pe.showBillInfo")}}</h-button>
              <h-button type="primary" @click="queryDetail()">{{$t("m.i.common.queryLog")}}</h-button>
              <h-button type="primary" @click="excelExport('bill')" :disabled="this.ifDisabledExport">{{$t("m.i.common.billInfoExport")}}</h-button>
              <h-button type="primary" @click="excelExport('detail')" :disabled="!this.ifDisabledExport">{{$t("m.i.common.logExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <!-- 查看影像 -->
<!--    <stop-pay-occur-image :show-upload-image-win="showUploadImageWin" :imageParams="imageParams"
                          @uploadImageWinClose="uploadImageWinClose"></stop-pay-occur-image>-->
    <!--清单导出-->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="showExcelTemplateWin" :param="this.exportParam"
                           :rows="this.exportRows"></common-excel-download>
    <!-- 查看影像 -->
    <image-loading
      :imageWin="showUploadImageWin"
      :imageParams="imageParams"
      :isShow="false"
      :isShowSearch="false"
      :isShowReset="false"
      :authObj="authObject"
      :isShowImgBatchNo="false"
      @imageWinClose="uploadImageWinClose"></image-loading>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "stopPaymentCorpOccurQuery",
    components: {
      StopPayOccurImage: () => import(/* webpackChunkName: "pe/busiqry/stopPayOccurImage" */ "@/views/bizViews/pe/busiqry/stopPayOccurImage"),
    },
    data: function() {
      return {
        ifShowMore: false,
        formItem: {
          billClass: "ME01",
          acptRgstBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          acptRgstBrchList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          sspdStatus: "",
          billNo: "",
          acptProtocalNo: "",
          billType: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          drwrCustNo: "",
          drwrName: "",
          drwrAcctNo: ""
        },
        dataUrl: "/pe/busiqry/stopPaymentCorpOccurQuery/func_queryCorpOccurPage",
        dataSumUrl:"/pe/busiqry/stopPaymentCorpOccurQuery/func_querySumCorpOccurPage",
        gridData: {},
        sumMoney: "",
        sumCount: "",
        remitDt: [],
        dueDt: [],
        columns: [],
        billColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
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
            title: this.$t("m.i.pe.acptBrch"),
            key: "acptRgstBrchName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pe.sspdStatus"),
            key: "sspdStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SspdStatus", params.row.sspdStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pe.acptStatus"),
            key: "acptStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcptStatus", params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
/*          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            hiddenCol: false,
            sortable: true
          },*/
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.acptDt"),
            key: "acptDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acptDt == null || params.row.acptDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          }
        ],
        detailColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
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
            title: this.$t("m.i.pe.acptBrch"),
            key: "acptRgstBrchName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
/*          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            hiddenCol: false,
            sortable: true
          },*/
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.acptDt"),
            key: "acptDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acptDt == null || params.row.acptDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pe.sspdType"),
            key: "sspdType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SspdType", params.row.sspdType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pe.sspdImage"),
            key: "sspdImage",
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
                      // this.openImgWin(params.row.id, "IM09");
                      this.openImgWin(params.row.id, "0");
                    }
                  }
                }, "查看")
              ]);
            }
          },
          {
            title: this.$t("m.i.pe.sspdName"),
            key: "sspdName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.sspdAcctNo"),
            key: "sspdAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.sspdAddr"),
            key: "sspdAddr",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.sspdDt"),
            key: "sspdDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.sspdDt == null || params.row.sspdDt === "") {
                return "";
              }
              let date = this.$moment(params.row.sspdDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pe.sspdReason"),
            key: "sspdReason",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.sspdPhone"),
            key: "sspdPhone",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.sspdCertType"),
            key: "sspdCertType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CertificateType", params.row.sspdCertType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title:this.$t("m.i.pe.sspdCertNo"),
            key: "sspdCertNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.sspdCorpName"),
            key: "sspdCorpName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.sspdReportNo"),
            key: "sspdReportNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.anlgSspdDt"),
            key: "anlgSspdDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.anlgSspdDt == null || params.row.anlgSspdDt === "") {
                return "";
              }
              let date = this.$moment(params.row.anlgSspdDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pe.relieveType"),
            key: "relieveType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AnlgSspdType", params.row.relieveType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pe.relieveImage"),
            key: "relieveImage",
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
                      this.openImgWin(params.row.id, "1");
                    }
                  }
                }, "查看")
              ]);
            }
          },
          {
            title: this.$t("m.i.pe.anlgSspdName"),
            key: "anlgSspdName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.anlgSspdAcctNo"),
            key: "anlgSspdAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.relieveReason"),
            key: "relieveReason",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.anlgSspdCertType"),
            key: "anlgSspdCertType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CertificateType", params.row.anlgSspdCertType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pe.anlgSspdCertNo"),
            key: "anlgSspdCertNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.anlgSspdCorpName"),
            key: "anlgSspdCorpName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.anlgSspdReportNo"),
            key: "anlgSspdReportNo",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        //showBranchWin: false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        dictMap: new Map(),
        billTypeList: [],
        //影像上传
        showUploadImageWin: false,
        imageParams: {
          listId: "",
          imageUrl:"/pe/busiqry/stopPaymentCorpOccurQuery/func_imageListPage", //查询可查看影像url
          imgShowUrl:"/pe/busiqry/stopPaymentCorpOccurQuery/func_imageById?id=", //查看影像url
          busiType:"RI05"
        },
        authObject:{
          imageAdd:false,
          imageRegister:false,
          imageDelete:false
        },
        //清单导出
        selectExportType: "",
        showExcelTemplateWin: false,
        exportParam: "",
        exportRows: "",
        ifDisabledExport: false,
        selects : [],
        selectIds : [],
        pageNo : 0,
        pageSize : 0,
      };
    },
    created() {
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,AcptStatus,SspdStatus,SspdType,AnlgSspdType,CertificateType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
      this.$nextTick(() => {
        this.columns = this.deepClone(this.billColumns);
        this.$refs.datagrid.createShowCol(this.billColumns);
        this.getStopPaymentDataList();
      });
    },
    methods: {
      //重置表单查询结果
      resetSearch() {
        this.formItem.acptRgstBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.acptRgstBrchList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.drwrCustNo = "";
        this.remitDt = [];
        this.dueDt = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }

      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrCustNo = info.custNo;
        this.formItem.drwrName = info.custName;
        if (info.drwrAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        } else {
          this.formItem.drwrAcctNo = "";
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.drwrName === "") {
          this.$msgTip.info(this, { info: "请先选择出票人！" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      getStopPaymentDataList() {
        let params = Object.assign({}, this.formItem);
        post(params, this.dataSumUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              // this.gridData = res.data.retData;
              this.sumCount = res.data.retData.counts;
              this.sumMoney = res.data.retData.sumBillMoney === null ? "0.00" : formatNumber(res.data.retData.sumBillMoney, 2, ",");
              this.$nextTick(() => {
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$nextTick(() => {
          this.getStopPaymentDataList();
        });
      },
      //查询票据明细
      queryBill() {
        this.ifDisabledExport = false;
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.dataUrl = "/pe/busiqry/stopPaymentCorpOccurQuery/func_queryCorpOccurPage";
        this.dataSumUrl ="/pe/busiqry/stopPaymentCorpOccurQuery/func_querySumCorpOccurPage";
        this.$nextTick(() => {
          this.columns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
          this.getStopPaymentDataList();
        });
      },
      //查询历史
      queryDetail(acptId) {
        if (!!acptId) {
          this.formItem.id = acptId;
        } else {
          this.formItem.id = "";
        }
        this.ifDisabledExport = true;
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.dataUrl = "/pe/busiqry/stopPaymentCorpOccurQuery/func_queryCorpSspdRegPage";
        this.dataSumUrl ="/pe/busiqry/stopPaymentCorpOccurQuery/func_querySumCorpSspdRegPage";
        this.$nextTick(() => {
          this.columns = this.deepClone(this.detailColumns);
          this.$refs.datagrid.createShowCol(this.detailColumns);
          this.getStopPaymentDataList();
        });
      },
      //票据明细/历史导出
      excelExport(selectExportType) {
        this.selectExportType = selectExportType;
        if (selectExportType === "bill") {
          this.exportParam = "acptSspdBillCorpOccurExportInfo";
        } else {
          this.exportParam = "acptSspdRegCorpOccurExportInfo";
        }
        this.exportRows = this.$refs.datagrid.total;
        this.showExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = "";
        if (this.selectExportType === "bill") {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/stopPaymentCorpOccurQuery/func_exportAcptSspdBillExcel";
        } else {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/stopPaymentCorpOccurQuery/func_exportAcptSspdRegExcel";
        }
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = this.deepClone(this.formItem);
          options.params.ids =  this.$refs.datagrid.selectIds;
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.deepClone(this.formItem);
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this,this.exportParam, field, exportType, exportUrl, options);
      },

      showExcelTemplateWinClose() {
        this.showExcelTemplateWin = false;
      },
      billInfoWinClose() {
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
      //影像维护弹窗
      openImgWin(id, imgType) {
        this.imageParams.listId = id;
        this.imageParams.imgBusiType=imgType;
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },

      /*//影像查看弹窗
      openImgWin(id, imgType) {
        this.imageParams.id = id;
        this.imageParams.imgType = imgType;
        this.imageParams.viewUrl = imgType === "IM09" ? window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/stopPayment/stopPaymentRegisterApply/func_imageById" : window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/stopPayment/cancelStopPaymentRegisterApply/func_imageById";
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.queryDetail();
      },*/
      clearVal(optType) {
        if (optType === "acptRgstBrchList") {
          this.formItem.acptRgstBrchNoList = "";
          this.formItem.acptRgstBrchList = "";
        } else if (optType === "drwrName") {
          this.formItem.drwrAcctNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrCustNo = "";
        }
      }
    }
  };
</script>

<style scoped>

</style>
