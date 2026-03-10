<template>
  <div>
    <h-msg-box v-model="tempAcptAddOrEditWin" :maximize="true" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="9" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{$t('m.i.ce.guarntrAmtAddTo')}}</span>
      </p>
      <div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="showColumns"
          url="/ce/acpt/repay/repayAcctMaintain/func_queryGuarntrInfo"
          :bindForm="batchParams"
          :hasSelect="false"
          rowSelect
          ref="showDatagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="infoAddWin()">
              {{$t("m.i.common.add")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>

      <!--保证金账号新增-->
      <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"
                 @on-close="addOrEditWinClose">
        <p slot="header">
          <span>{{$t('m.i.common.add')}}</span>
        </p>
        <h-panel>
          <h-form :model="formItem" :label-width="120" ref="formItem" cols="2" class="h-form-search">
            <h-form-item prop="guarntrNo" :label="$t('m.i.common.acctNo')" required>
              <h-input v-model="formItem.guarntrNo" placeholder=""
                       :icon="'android-search'" @on-click="queryCustAcct()"
                       readonly></h-input>
            </h-form-item>
            <h-form-item prop="billTypeName" :label="$t('m.i.ce.bailAcctType')">
              <h-input v-model="formItem.billTypeName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.addType')" prop="addTypeList" required>
                  <h-select v-model="formItem.addTypeList" placeholder="" :setDefSelect="true">
                    <h-option value="1">追加</h-option>
                    <h-option value="2">追减</h-option>
                  </h-select>
              </h-form-item>
            <h-form-item v-if="formItem.addTypeList == '1'" :label="$t('m.i.ce.addToAmt')" prop="bailMoney" required :validRules="agreementMoneyRule">
              <h-row>
                <h-col>
                  <h-typefield type="money" v-model="formItem.bailMoney" :maxlength="20"
                               placeholder="数字，小数位最多2位" divided></h-typefield>
                </h-col>
              </h-row>
            </h-form-item>
            <h-form-item v-if="formItem.addTypeList == '2'" :label="$t('m.i.ce.subtractToAmt')" prop="bailMoney" required  :validRules="agreementMoneyRule">
              <h-row>
                <h-col>
                  <h-typefield type="money" v-model="formItem.bailMoney" :maxlength="20"
                               placeholder="数字，小数位最多2位" divided></h-typefield>
                </h-col>
              </h-row>
            </h-form-item>
          </h-form>
        </h-panel>
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </h-msg-box>
      <!-- 查询客户账号信息弹窗 -->
      <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="batchParams.drwrCustNo" :title="'查看保证金账户'"
                      :selectType="'select'" :custAcctKind="2" @showCustAcctWinClose="showCustAcctWinClose"
                      @custAcctSelect="custAcctSelect"></show-cust-acct>
      <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="batchParams.billId"
                      :billNo="batchParams.billNo"></bill-info-main>
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
    import { post, on, off, formatNumber,getDictListByGroups, } from "@/api/bizApi/commonUtil";

  export default {
    name: "guarntrAmtAdd",
    components: {
      ShowCustAcct: () => import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
    },
    data() {
      return {
        billNo: "",
        paramId: "id",
        rows: null,
        bailTypeList: [],
        agreementMoneyRule : [{ test: validAgreementMoney, trigger: "blur", }],
        formItem: {
          id: '',
          guarntrNo: '',
          bailMoney:'',
          drwrCustNo: '',
          bailType:'',
          billTypeName:'',
          acptProtocalNo:'',
          billNo:'',
          promNoteNo:'',
          billId:'',

        },
        addOrEditWin: false,
        showCustAcctWin: false,
        showBillInfoWin: false,
        dictMap : new Map(),
        showColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            sortable: true,
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
            title: this.$t("m.i.pl.billBailAcctNo"),
            key: "deductAcctNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.freezeDt"),
            key: "dpstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dpstDt == null || params.row.dpstDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dpstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.guarntrAmtByUnit"),
            key: 'dpstAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let bailAmt = formatNumber(params.row.dpstAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: bailAmt
                }
              }, bailAmt);
            }
          },
          {
            title: this.$t("m.i.ce.guarntrOrderNum"),
            key: "dpstNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: 'pyeeName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
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
            title: this.$t('m.i.billInfo.dueDt'),
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
          }
        ]
      };
      function validAgreementMoney(rule, val, callback) {
        debugger;
        let value = val.toString().replace(/,/g, "");
        if(value > 0) {
          callback();
        } else {
          callback(new Error("输入金额不能为0或负数"));
        }
      }
    },
    props: {
      acptAddOrEditWin: {
        type: Boolean,
        default: false
      },
      batchParams: {
        id: "",
        drwrCustNo: "",
        guarntrNo: "",
        bailMoney: "",
        bailType: "",
        billTypeName: "",
        acptProtocalNo: "",
        billNo: "",
        promNoteNo: "",
        billId: ""
      }
    },
    computed: {
      tempAcptAddOrEditWin: {
        get() {
          return this.acptAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      acptAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            debugger
            this.formItem.id = this.batchParams.id;
            this.formItem.drwrCustNo = this.batchParams.drwrCustNo;
            this.formItem.acptProtocalNo = this.batchParams.acptProtocalNo;
            this.formItem.billNo = this.batchParams.billNo;
            this.formItem.promNoteNo = this.batchParams.promNoteNo;
            this.formItem.billId = this.batchParams.billId;
            this.$refs.showDatagrid.dataChange(1);
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      //关闭弹窗
      handleClose() {
        this.$emit("acptAddOrEditWinClose", "");
        this.$refs.formItem.resetFields();
        this.$refs.batchParams.resetFields();
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.showDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      infoAddWin() {
        this.addOrEditWin = true;
      },
      billInfoWinOpen(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.showBillInfoWin = false;
      },
      addOrEditWinClose() {
        this.addOrEditWin = false;
        this.formItem.bailMoney = "";
        this.$refs.formItem.resetFields();
      },
      //查询客户账号信息
      queryCustAcct() {
        this.showCustAcctWin = true;
      },
      //客户保证金查询框关闭
      showCustAcctWinClose() {
        this.showCustAcctWin = false;
      },
      //根据客户保证金账号查询框所选数据进行赋值
      custAcctSelect(info) {
        this.formItem.guarntrNo = info.custAcctNo;
        this.formItem.bailType = info.bailType;
        this.formItem.billTypeName = this.getDictValueFromMap(this.dictMap,"bailType",this.formItem.bailType);
        debugger;
        this.showCustAcctWin = false;
      },
      submitFailed(title, retMsg) {
        this.$msgTip.error(this, {info: retMsg});
      },
      submitForm() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            let url = "/ce/acpt/repay/repayAcctMaintain/func_addGuarntrNoAndAmt";
            post(this.formItem, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.addOrEditWinClose();
                  this.$msgTip.success(this);
                  this.$refs.showDatagrid.dataChange(this.$refs.showDatagrid.pageInfo.pageNo);
                  this.$emit("refushDatagrid", "");
                } else {
                  let msg = '保证金新增';
                  this.submitFailed(msg, res.data.retMsg);
                }
              } else {
                let msg = '保证金新增';
                this.submitFailed(msg, this.$t("m.i.common.netError"));
              }

            });
          }
        });
      }
    },
    mounted() {
      this.formItem.addTypeList = '1';
      this.getDictListByGroups("bailType").then(res => {
        this.bailTypeList = res.get("bailType");
        this.dictMap = res.get("map");
      });
    },
  };
</script>

<style scoped>

</style>
