<!--极速贴现-异常票据查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.ce.discInBrchName')"
                             prop="brchNos" required
                             title="机构名称" :brchNo.sync="formItem.brchNos"
                             :brchName.sync="formItem.brchName">
                </show-branch>

                <h-form-item :label="$t('m.i.ce.discType')" prop="discType" required>
                  <h-select v-model="formItem.discType" placeholder="" @on-change="changeStatus()">
                    <h-option value="DT01">速贴通</h-option>
                    <h-option value="DT02">无感贴现</h-option>
                    <h-option value="DT04">普通贴现</h-option>
                    <h-option value="DT05">商票快贴</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.discDt')" prop="minDiscDt">
                  <h-date-picker :value="discDt" type="daterange" showFormat :editable=false
                                 @on-change="handleDiscDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item prop="discProtocalNo" :label="$t('m.i.ce.discProtocalNo')">
                  <h-input v-model="formItem.discProtocalNo" placeholder="" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            :url="this.queryUrl"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="discInfoExceptionResult">{{$t("m.i.ce.discInfoExceptionResult")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="billRangeStart"
                    :billRangeEnd="billRangeEnd"></bill-info-main>

    <!-- 查看明细弹出框 -->
    <h-msg-box v-model="showDetailWin" width="1200" class="h-form-table-layer" :maximize="true"
               :mask-closable="false">
      <!--弹出框模式标题-->
      <p slot="header">
        <span>查看明细</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="showDetailColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/ce/disc/discOnline/queryExceptionList"
                    :bindForm="showDetailWinItem"
                    ref="showDetailDatagrid"
                    class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>

      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="showDetailClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import {post, on, off, formatNumber, accMul, getDictValueFromMap, formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "eDiscExceptionMain",
    components: {},
    data() {
      return {
        dueDt: [],
        discDt: [],
        queryUrl: "/ce/disc/discOnline/queryExceptionList",
        ifShowMore: false,
        formItem: {
          brchNos: this.$store.getters.userInfo.brchNo,
          brchName: this.$store.getters.userInfo.brchName,
          minDiscDt: "",
          maxDiscDt: "",
          discProtocalNo: "",
          discType: "DT04",
        },
        showDetailWinItem: {
          batchId: "",
          discType: "DT01",
          status: "2"
        },
        showDetailColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: 'brchName',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.applyAcctNo"),
            key: "applAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.discProtocalNo"),
            key: "discProtocalNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.discDt == null || params.row.discDt === "") {
                return "";
              }
              let date = this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },


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
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            render: (h, params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.discInterestRateYear"),
            key: "rate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rate = params.row.rate;
              // if (!!params.row.rate) {
              rate = formatNumber(accMul(params.row.rate, 100), 4, ",");
              // }
              return h("span", rate);
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
            title: this.$t("m.i.ce.discInBankName"),
            key: "discInBankName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.discInBankNo"),
            key: "discInBankNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.discInAcctNo"),
            key: "discInAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.aoAcctNo"),
            key: "aoAcctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.aoAcctBankNo"),
            key: "aoAcctBankNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
        ],

        columns: [
          {
            title: " ",
            type: "radio",
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showDetail(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: 'brchName',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.applyAcctNo"),
            key: "applAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.discProtocalNo"),
            key: "discProtocalNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.discDt == null || params.row.discDt === "") {
                return "";
              }
              let date = this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },


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
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            render: (h, params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.discInterestRateYear"),
            key: "rate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rate = params.row.rate;
              // if (!!params.row.rate) {
              rate = formatNumber(accMul(params.row.rate, 100), 4, ",");
              // }
              return h("span", rate);
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
            title: this.$t("m.i.ce.discInBankName"),
            key: "discInBankName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.discInBankNo"),
            key: "discInBankNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.discInAcctNo"),
            key: "discInAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.aoAcctNo"),
            key: "aoAcctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.aoAcctBankNo"),
            key: "aoAcctBankNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
        ],
        YonList: [],
        dictMap: new Map(),
        currentSelectRow: [],
        showBillInfoWin: false,
        showDetailWin: false,
        billId: "",
        billNo: "",
      };
    },
    computed: {},
    mounted() {
      this.getDictListByGroups("DraftTypeCode,FDiscMode,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.fdiscModeList = res.get("FDiscMode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = [];
            this.formItem.minDiscDt = this.formItem.minDiscDt.replace(/-/g, "");
            this.formItem.maxDiscDt = this.formItem.maxDiscDt.replace(/-/g, "");
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      changeStatus() {
        if (this.formItem.discType === "DT01") {
          this.queryUrl = "/ce/disc/discOnline/queryExceptionBatch";
          this.$refs.datagrid.controlColumnsHidden("batchNo", false);
          this.$refs.datagrid.controlColumnsHidden("billType", true);
          this.$refs.datagrid.controlColumnsHidden("billRange", true);
          this.$refs.datagrid.controlColumnsHidden("billNo", true);
          this.$refs.datagrid.controlColumnsHidden("billMoney", true);
          this.$refs.datagrid.controlColumnsHidden("rate", true);
          this.$refs.datagrid.controlColumnsHidden("remitDt", true);
          this.$refs.datagrid.controlColumnsHidden("dueDt", true);
          this.$refs.datagrid.controlColumnsHidden("discInBankName", true);
          this.$refs.datagrid.controlColumnsHidden("discInBankNo", true);
          this.$refs.datagrid.controlColumnsHidden("discInAcctNo", true);
          this.$refs.datagrid.controlColumnsHidden("aoAcctNo", true);
          this.$refs.datagrid.controlColumnsHidden("aoAcctBankNo", true);

        } else {
          this.queryUrl = "/ce/disc/discOnline/queryExceptionList";
          this.$refs.datagrid.controlColumnsHidden("batchNo", true);
          this.$refs.datagrid.controlColumnsHidden("billType", false);
          this.$refs.datagrid.controlColumnsHidden("billRange", false);
          this.$refs.datagrid.controlColumnsHidden("billNo", false);
          this.$refs.datagrid.controlColumnsHidden("billMoney", false);
          this.$refs.datagrid.controlColumnsHidden("rate", false);
          this.$refs.datagrid.controlColumnsHidden("remitDt", false);
          this.$refs.datagrid.controlColumnsHidden("dueDt", false);
          this.$refs.datagrid.controlColumnsHidden("discInBankName", false);
          this.$refs.datagrid.controlColumnsHidden("discInBankNo", false);
          this.$refs.datagrid.controlColumnsHidden("discInAcctNo", false);
          this.$refs.datagrid.controlColumnsHidden("aoAcctNo", false);
          this.$refs.datagrid.controlColumnsHidden("aoAcctBankNo", false);
        }
        this.$nextTick(() => {
          this.handleSearch();
        });
      },
      handleDiscDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minDiscDt = arr[0].replace(/-/g, "");
          this.formItem.maxDiscDt = arr[1].replace(/-/g, "");
          this.discDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDiscDt = "";
          this.formItem.maxDiscDt = "";
          this.discDt = [];
        }

      },
      //重置表单查询结果
      resetSearch() {
        this.discDt = [];
        this.formItem.minDiscDt = "";
        this.formItem.maxDiscDt = "";
        this.formItem.brchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.brchName = this.$store.getters.userInfo.brchName;
        this.formItem.discType = "DT04";
        this.formItem.discProtocalNo = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },


      discInfoExceptionResult() {
        let list = this.currentSelectRow;
        if (null !== list && list.length !== 0) {
          let url = "";
          if (this.formItem.discType === "DT01") {
            url = "/banks/szbank/ce/disc/discOnline/dealOnlineDiscBatchExceptionInfo";
          } else if (this.formItem.discType === "DT02") {
            url = "/ce/disc/discOnline/dealOnlineDiscExceptionInfo";
          } else if (this.formItem.discType === "DT04") {
            url = "/banks/szbank/ce/disc/discOnline/dealOnlineDiscBillExceptionInfo";
          }else if (this.formItem.discType === "DT05") {
            url = "/banks/szbank/ce/disc/discOnline/dealOnlineDiscBillExceptionInfo";
          }

          post({id: list.id}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.handleSearch();
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //查看产品指标
      showDetail(id) {
        this.showDetailWin = true;
        this.$nextTick(() => {
          this.showDetailWinItem.batchId = id;
          this.$refs.showDetailDatagrid.dataChange(1);
        });
      },
      showDetailClose() {
        this.showDetailWin = false;
      },
    }
  };
</script>

<style scoped>

</style>
