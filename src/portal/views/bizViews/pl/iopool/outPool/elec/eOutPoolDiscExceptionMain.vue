<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="applAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.applAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike" v-model="formItem.billNoLike"></bill-no>
                <h-form-item prop="errorType" label="异常类型">
                  <h-select v-model="formItem.errorType" placeholder="">
                    <h-option value="0">代客签收</h-option>
                    <h-option value="1">贴现申请</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}
                    <i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/pl/iopool/outpool/elec/eOutPoolDiscExceptionMain/func_pageQueryOutPoolException"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exceptionBillProcess()" >异常处理</h-button>
            </div>
          </h-datagrid>

        </div>

        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose"
                           @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 票面 -->
        <bill-info-main :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"
                        :bill-range-start="this.billRangeStart" :bill-range-end="this.billRangeEnd"
                        @billInfoWinClose="billInfoWinClose"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber  } from "@/api/bizApi/commonUtil";

  export default {
    name: "eOutPoolDiscExceptionMain",

    components: {},

    data() {
      return {
        formItem: {
          custNo: "",
          custName: "",
          applAcctNo: "",
          billNoLike: "",
          errorType: ""
        },
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
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "applAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
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
            title: "状态",
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "OutPoolDiscStatus", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
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
            title: "贴现金额",
            key: "discAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let discAmt = formatNumber(params.row.discAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: discAmt
                }
              }, discAmt);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          }, {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          },
          {
            title: "异常原因",
            key: "returnMsg",
            hiddenCol: false
          }
        ],
        billId: "",
        billNo: "",
        billRangeStart: "",
        billRangeEnd: "",
        isList: [],
        billTypeList: [],
        dictMap: new Map(),
        ifShowMore: false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        showBillInfoWin: false,

      };
    },

    //html加载完成之前，执行。执行顺序：父组件-子组件
    created() {

    },

    //html加载完成后执行。执行顺序：子组件-父组件 页面初始化执行
    mounted() {
      getDictListByGroups("DraftTypeCode,Yon,OutPoolDiscStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });

    },

    //监听一个值的变化，然后执行相对应的函数
    watch: {},

    //计算属性，也就是依赖其它的属性计算所得出最后的值
    computed: {},

    //事件方法执行
    methods: {
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },

      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        if (info.custAcctNo !== "") {
          this.formItem.applAcctNo = info.custAcctNo;
        } else {
          this.formItem.applAcctNo = "";
        }
        this.showCustMessageWin = false;
      },

      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },

      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },

      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.applAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },

      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      clearVal(type){
        if (type === 'custName') {
          this.formItem.custNo = "";
          this.formItem.custName = "";
          this.formItem.applAcctNo = "";
        } else {
          this.formItem.applAcctNo = "";
        }
      },

      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      showBillInfo(info) {
        this.billId = info.billId;
        this.billNo = info.billNo;
        this.billRangeStart = info.billRangeStart;
        this.billRangeEnd = info.billRangeEnd;
        this.showBillInfoWin = true;
      },

      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs["formItem"].validate(valid => {
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        });
      },

      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.formItem.resetFields();
      },

      //异常处理
      exceptionBillProcess() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        } else {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.info"),
            content: "确认手工处理异常流程吗？",
            onOk: () => {
              let param = {ids: this.$refs.datagrid.selectIds};
              let url = "/pl/iopool/outpool/elec/eOutPoolDiscExceptionMain/func_exceptionBillProcess";
              post(param, url).then(res => {
                if (res) {
                  if (res.data.retCode === "000000") {
                    this.$msgTip.success(this, { info: res.data.retMsg });
                    this.handleSearch();
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            },
            onCancel: () => {
              this.handleSearch();
            }
          });
        }
      },

    },


  };


</script>


<style scoped>

</style>
