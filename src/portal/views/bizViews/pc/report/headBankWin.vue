<!--机构查询-->
<template>
  <div class="h-tree-search">
    <div class="h-modal-header-wrapper">
      <h-msg-box v-model="tempshowHeadBankWin" @on-close="handleClose" class="h-form-table-layer"  width="1000">
        <p slot="header">
          <span>{{title}}</span>
        </p>
        <!--弹出框内容-->
        <h-row name="flex" class="layout-menu-wrapper">
          <h-col span="24">
            <div>
              <!--查询表单-->
              <div class="h-form-search-box" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" >
                    <h-input v-model="formItem.memberId" :maxlength=60 ></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.memberBankNo')" prop="memberBankNo" >
                    <h-input v-model="formItem.memberBankNo" :maxlength=60 ></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.memberBankName')" prop="memberBankName" >
                    <h-input v-model="formItem.memberBankName" :maxlength=60></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </h-form>
              </div>
              <!--数据展示表格-->
              <h-datagrid
                :columns="showColumns"
                highlight-row
                url = "/shcpe/cust/bankinfo/queryCustTopBankInfo"
                :auto-load="false"
                :gridData="headBankData"
                :bindForm="formItem"
                :onRowDbClick="doubleHandleClick"
                :onCurrentChange="onCurrentChange"
                :onCurrentChangeCancel="onCurrentChangeCancle"
                ref="datagrid">
              </h-datagrid>
            </div>
          </h-col>
        </h-row>
        <!-- 弹出框模式底部按钮 -->
        <div slot="footer">
          <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </h-msg-box>
      <h-msg-box v-model="submitWin" width="300" height="180">
        <p slot="header">
          <span>{{submitTitle}}</span>
        </p>
        <div class="h-prompt-content">
          <div class="h-prompt-top">
            <i v-if="retMsg == ''" class="icon iconfont icon-right"></i>
            <i v-else class="icon iconfont icon-wrong"></i>
            <span>{{submitMsg}}</span>
          </div>
          <p class="h-prompt-words">{{retMsg}}</p>
        </div>
        <div slot="footer">
          <h-button type="ghost" @click="submitWin = false">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </h-msg-box>
    </div>
  </div>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "headBankWin",
    data() {
      let columns = [
        {
          title: " ",
          type: "radio",
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
          title: "id",
          key: "id",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.memberId"),
          key: "memberId",

          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.memberBankNo"),
          key: "memberBankNo",

          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.memberBankName"),
          key: "memberBankName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.bankLevel"),
          key: "bankLevel",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "bankLevel", params.row.bankLevel);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.common.bankType"),
          key: "bankType",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "bankType", params.row.bankType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        }
      ];
      let formItem = {
        roleName: "",
        memberId : "",
        memberBankNo : "",
        memberBankName : ""

      };
      return {
        showColumns: columns,
        formItem: formItem,
        selectData:null,
        headBankData: { rows: [], total: 1 },
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        dictMap : new Map(),
      };
    },
    props: {
      title: String,
      showHeadBankWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ifcheck: {
        default() {
          return false;
        }
      }
    },
    computed: {
      tempshowHeadBankWin: {
        get() {
          return this.showHeadBankWin;
        },
        set() {
        }
      }
    },
    watch:{
      showHeadBankWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      doubleHandleClick(arr) {
        this.selectData = arr;
        this.submitForm();
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      formSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      submitForm() {
        if (!this.selectData) {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
          return;
        }
        let obj = {
          "id": this.selectData.memberId,
          "bankNo": this.selectData.memberBankNo,
          "bankName": this.selectData.memberBankName
        };
        // 选择客户
        this.$emit("headBankSelect", obj);

      },
      handleClose() {
        this.formSearchReset();
        this.$emit("showHeadBankWinClose", "");
      },
    },
    mounted() {
      this.getDictListByGroups("bankLevel,bankType").then(res => {
        this.bankLevelList = res.get("bankLevel");
        this.bankTypeList = res.get("bankType");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
<style>

</style>
