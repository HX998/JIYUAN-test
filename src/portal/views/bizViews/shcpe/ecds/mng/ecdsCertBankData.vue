<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="ecdsCertBankDataMain">
          <div>
            <!-- 查询表单 -->
            <div class="h-form-search-box">
              <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                  <div class="h-search-form-row">
                    <h-form-item prop="bankNo" :label="$t('m.i.common.bankNo')">
                      <h-input v-model="formItem.bankNo" placeholder=""></h-input>
                    </h-form-item>
                    <h-form-item prop="certBindStatus" :label="$t('m.i.shcpe.certBindStatus')">
                      <h-select v-model="formItem.certBindStatus">
                        <h-option v-for="item in ecdsCertBindStsCodeList" :value="item.key" :key="item.key">{{
                          item.value }}
                        </h-option>
                      </h-select>
                    </h-form-item>
                    <h-form-item class="h-form-operate">
                      <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                      <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                    </h-form-item>
                  </div>
                </h-form>
              </h-panel>
            </div>
            <!-- 数据展示表格 -->
            <h-datagrid
              :columns="columns"
              highlight-row
              url="/shcpe/ecds/mng/ecdsCertBankData/func_pageQueryCertEcdsBankData"
              :bindForm="formItem"
              :onSelectChange="handleSelectClick"
              :rowSelect = true
              ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @on-click="certBind()">{{$t("m.i.shcpe.certiBind")}}</h-button>
                <h-button type="primary" @on-click="certRemove()">{{$t("m.i.shcpe.cancelBind")}}</h-button>
                <h-button type="primary" @on-click="showCertBindHisInfo()">{{$t("m.i.shcpe.certiChangeHis")}}</h-button>
              </div>
            </h-datagrid>
          </div>
        </div>


        <div v-if="ecdsBindHisMain">
          <h-datagrid
            :columns="ecdsBindHisColumns"
            highlight-row
            :auto-load="false"
            :bindForm="ecdsBindHisFormItem"
            url="/shcpe/ecds/mng/ecdsCertBankData/func_pageQueryCertBindHis"

            ref="ecdsBindHisDatagrid">
            <div slot="toolbar">
              <h-button type="primary" @click="refresh()">{{$t("m.i.config.refreshCache")}}</h-button>
              <h-button type="primary" @click="returnBack()">{{$t("m.i.common.goBack")}}</h-button>
            </div>
          </h-datagrid>
        </div>


      </h-col>
    </h-row>

  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "ecdsCertBankData",
    data() {
      return {
        formItem: {
          bankNo: "",
          certBindStatus: ""
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
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.bankNo'),
            key: "bankNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.actorFullCall"),
            key: "actorFullCall",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.certBindStatus'),
            key: "certBindStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "EcdsCertBindStsCode", params.row.certBindStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],

        ecdsBindHisFormItem: {
          bankNo: ""
        },

        ecdsBindHisColumns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.bankNo'),
            key: "bankNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.bankName'),
            key: "bankName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.changeCode'),
            key: "changeType",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.changeType==='AB00') return h('span','绑定')
              else if(params.row.changeType==='AB01') return h('span','解绑')
            }
          },
          {
            title: this.$t('m.i.shcpe.changTm'),
            key: "changeDt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.changeDt ? this.$moment(params.row.changeDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.shcpe.draftDealStatus'),
            key: "status",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.status==='0') return h('span','处理失败')
              else if(params.row.status==='1') return h('span','处理成功')
              else if(params.row.status==='2') return h('span','处理中')
            }
          },
          {
            title: this.$t('m.i.common.errorMsg'),
            key: "errorMsg",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          }
        ],
        ecdsCertBindStsCodeList: [],
        dictMap: new Map(),
        ifShowMore: false,
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        ecdsCertBankDataMain: true,
        ecdsBindHisMain: false,
        banNo: ""
      };
    },
    watch: {},

    computed: {},
    mounted() {
      getDictListByGroups("EcdsCertBindStsCode").then(res => {
        this.ecdsCertBindStsCodeList = res.get("EcdsCertBindStsCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.unDisabled();
        this.currentSelectRow = [];
        this.currentSelectRowInx = [];
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        // this.unDisabled();
        this.currentSelectRow = arr;
        this.currentSelectRowInx = selectInx;
        let selectIndex = selectInx[0];
        let lastSelectIndex = this.$refs.datagrid.tData.length - 1;
        if (selectIndex === "0") {
          this.moveUpDisabled = true;
        }
        if (selectIndex === lastSelectIndex) {
          this.moveDownDisabled = true;
        }
      },

      certBind() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let list = this.currentSelectRow;
        let bankNos = "";
        for (let i = 0; i < list.length; i++) {
          bankNos += list[i].bankNo;
          if (i < list.length - 1) {
            bankNos += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: "证书绑定",
          content: this.$t("m.i.common.confirm") + "是否证书绑定?",
          onOk: () => {

            post({ bankNos: bankNos, changeType: "AB00" }, "/shcpe/ecds/mng/ecdsCertBankData/func_certBind").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.shcpe.certiBindSuccess") });
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      certRemove() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }

        let list = this.currentSelectRow;
        let bankNos = "";
        for (let i = 0; i < list.length; i++) {
          bankNos += list[i].bankNo;
          if (i < list.length - 1) {
            bankNos += ",";
          }
        }

        this.$hMsgBox.confirm({
          title: "证书解除",
          content: this.$t("m.i.common.confirm") + "是否证书解除?",
          onOk: () => {
            post({ bankNos: bankNos, changeType: "AB01" }, "/shcpe/ecds/mng/ecdsCertBankData/func_certBind").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.shcpe.certiReleaseBindSuccess") });
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      //查看绑定历史
      showCertBindHisInfo() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.ecdsCertBankDataMain = false;
        this.ecdsBindHisFormItem.bankNo = this.currentSelectRow[0].bankNo;
        this.ecdsBindHisMain = true;
        this.$nextTick(() => {
          this.$refs.ecdsBindHisDatagrid.dataChange(1);
          this.$refs.ecdsBindHisDatagrid.selfAdaption();
          this.$refs.ecdsBindHisDatagrid.createShowCol(this.ecdsBindHisColumns);
        });
      },
      //返回
      returnBack() {
        this.ecdsBindHisMain = false;
        this.ecdsCertBankDataMain = true;
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
        });
      },
      refresh(){
        this.ecdsBindHisFormItem.bankNo = this.currentSelectRow[0].bankNo;
        this.$nextTick(() => {
          this.$refs.ecdsBindHisDatagrid.dataChange(1);
          this.$refs.ecdsBindHisDatagrid.selfAdaption();
          this.$refs.ecdsBindHisDatagrid.createShowCol(this.ecdsBindHisColumns);
        });
      }
    }
  };
</script>

<style scoped>

</style>
