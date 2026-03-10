<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.bs.custName')" prop="custNameLike">
                  <h-input v-model="formItem.custNameLike" :maxlength="150" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.socCode')" prop="socCodeLike" :validRules="socCodeRuleLike" class="h-form-long-label">
                  <h-input v-model="formItem.socCodeLike" :maxlength=18 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNoLike">
                  <h-input v-model="formItem.custAcctNoLike" :maxlength=32 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctType')" prop="acctType">
                  <h-select v-model="formItem.acctType" placeholder="">
                    <h-option v-for="item in acmtAcctTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.operType')" prop="operType">
                  <h-select v-model="formItem.operType" placeholder="">
                    <h-option v-for="item in acmtOperTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bm/cust/acmtacct/acmtAcctApply/func_queryCheckAcmtAcct"
            :bindForm="formItem"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="submitPass()">{{$t('m.i.common.pass')}}
              </h-button>
              <h-button type="primary" @click="submitReject()">{{$t('m.i.common.back')}}
              </h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <acmt-auth-list :acmtAuthListWin="acmtAuthListWin" @acmtAuthListWinClose="acmtAuthListWinClose" :propAuthList="this.propAuthList"></acmt-auth-list>
  </div>
</template>

<script>
  import {post, on, off, getMoreParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "acmtAcctCheck",
    components: {
      AcmtAuthList:()=>import(/* webpackChunkName: 'bm/cust/acmtacct/acmtAuthList' */`@/views/bizViews/bm/cust/acmtacct/acmtAuthList`),
    },
    data() {
      return {
        dictMap: new Map(),
        acmtAcctTypeList: [],
        distTypeList: [],
        acmtOperStatusList: [],
        acmtOperTypeList: [],
        auditMode: true,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        acmtAuthListWin: false,
        socCodeRuleLike: [{test: /^[0-9A-Z]{1,18}$/, trigger: "blur", message: "统一社会信用代码查询由1-18位数字或大写字母组成"}],
        propAuthList:[],
        formItem: {
          custName: '',
          socCode: '',
          custAcctNo: '',
          custNameLike: '',
          socCodeLike: '',
          custAcctNoLike: '',
          acctType: '',
          operType: '',
          status: '',
        },

        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            key: "xuhao",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: 'ID',
            key: "id",
            hiddenCol: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.socCode'),
            key: "socCode",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: "custAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctName'),
            key: "acctName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctType'),
            key: "acctType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtAcctTypeCode", params.row.acctType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.distType'),
            key: "distType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DistTypeCode", params.row.distType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.openBrchCode'),
            key: "openBrchCode",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.common.openBrchName'),
            key: "openBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.busiChannelCode'),
            key: "memberId",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctAuthList'),
            key: "acctAuthList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showAuthList(params.row.acctAuthList);
                  }
                }
              }, "权限清单");
            }

          },
          {
            title: this.$t('m.i.common.rgstName'),
            key: "rgstName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.rgstBrchCode'),
            key: "rgstBrchCode",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operType'),
            key: "operType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtOperTypeCode", params.row.operType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.operStatus'),
            key: "status",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtOperStatusCode", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.changeCustName'),
            key: "changeCustName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeCustAcctNo'),
            key: "changeCustAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeAcctName'),
            key: "changeAcctName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeOpenBrchName'),
            key: "changeOpenBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeAcctAuthList'),
            key: "changeAcctAuthList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showAuthList(params.row.changeAcctAuthList);
                  }
                }
              }, "权限清单");
            }
          },

        ],
        currentSelectList: [],
        type: null,
        readonly: false,
        isRequired: true,
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        //brchCodeWin: false,
        submitWin: false,
        showCpesMemberWin: false,
        brchCodeWin: false,
        showCustMessageWin: false,
        showCustAcctNoWin : false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
      };
    },
    mounted() {
      getMoreParamValuesByKeys("bm.cust.acmt_audit_mode").then(res => {
        let isAudit = res['bm.cust.acmt_audit_mode'];
        if (isAudit === '0') {
          this.auditMode = false;
        } else {
          this.auditMode = true;
        }
      });
      this.getDictListByGroups("AcmtAcctTypeCode,AcmtOperStatusCode,AcmtOperTypeCode,DistTypeCode").then(res => {
        this.acmtAcctTypeList = res.get("AcmtAcctTypeCode");
        this.acmtOperTypeList = res.get("AcmtOperTypeCode");
        this.distTypeList = res.get("DistTypeCode");
        this.dictMap = res.get("map");
      });


    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },

      formSearchReset() {
        this.$refs.formItem.resetFields();
      },

      handlelRowClickBill(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handlelRowClickBillCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },

      // 提交复核
      submitPass(){
        this.currentSelectList = this.$refs.datagrid.selects;
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let ids = "";
          for (let i = 0; i < list.length; i++) {
            ids += list[i].id;
            if (i < list.length - 1) {
              ids += ",";
            }
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定要通过吗?",
            onOk: () => {
              this.handleSubmitPass(ids);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }

      },
      handleSubmitPass(ids){
        post({ids: ids}, "/bm/cust/acmtacct/acmtAcctApply/func_submitPass").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.retMsg = "";
            } else {
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      // 撤销提交复核
      submitReject(){
        this.currentSelectList = this.$refs.datagrid.selects;
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let ids = "";
          for (let i = 0; i < list.length; i++) {
            ids += list[i].id;
            if (i < list.length - 1) {
              ids += ",";
            }
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要驳回吗?",
            onOk: () => {
              this.handleSubmitReject(ids);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      handleSubmitReject(ids){
        post({ids: ids}, "/bm/cust/acmtacct/acmtAcctApply/func_submitReject").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.retMsg = "";
            } else {
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      showAuthList(acctAuthList){
        if (acctAuthList == null){
          acctAuthList = "";
        }
        this.propAuthList= acctAuthList.toString().split("|");
        this.acmtAuthListWin = true;
      },
      acmtAuthListWinClose (){
        this.acmtAuthListWin = false;
      },

    }

  };
</script>

<style scoped>

</style>
