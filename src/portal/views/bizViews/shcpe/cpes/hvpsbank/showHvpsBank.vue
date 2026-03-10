<!--行名行号查询-->
<template>
  <h-msg-box v-model="tempShowHvpsBank" width="1000" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true">
    <p slot="header">
      <span>查询全市场行名行号</span>
    </p>
    <div>
      <!--查询表单-->
      <div class="h-form-search-box" :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <h-form-item label="机构全称" prop="actorBrchName">
            <h-input v-model="formItem.actorBrchName" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item label="机构行号" prop="actorBrchBankNo">
            <h-input v-model="formItem.actorBrchBankNo" :maxlength="12"></h-input>
          </h-form-item>
          <h-form-item label="机构类别" prop="actorBrchType">
            <h-select v-model="formItem.actorBrchType" placeholder="">
              <h-option v-for="item in actorBrchTypeList" :value="item.key" :key="item.key">{{ item.value
                }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
    </div>
    <h-datagrid
      :columns="columns"
      highlight-row
      :auto-load=false
      url="/shcpe/cpes/hvpsbank/hvpsBank/func_queryHvpsBank"
      :bindForm="formItem"
      :onSelectChange="handleSelectClick"
      :onCurrentChange="handleCurrentChange"
      :onCurrentChangeCancel="handleCurrentChangeCancel"
      :onRowDbClick="doubleHandleClick"
      ref="datagrid">
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "showHvpsBank",
    data() {
      return {
        formItem: {
          actorBrchName: "",
          actorBrchType: "",
          actorBrchBankNo:""
        },
        viewDatailForm: {
          id: "",
          effectiveType: "",
          activeFlag: "",
          activeDt: "",
          failureDt: "",
          actorBrchBankNo: "",
          actorBrchName: "",
          actorBrchType: "",
          bankOtherCode: "",
          ownBankNo: "",
          ownMember: "",
          ownCcpc: "",
          superBrch: "",
          continueBankNo: "",
          governmentBankNo: "",
          cityCode: "",
          largeFlag: "",
          phoneCable: "",
          createTime: "",
          updateTime: "",
          changeCode: ""
        },

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        columns: [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: " ",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.shcpe.actorBrchBankNo"),
            key: "actorBrchBankNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.actorBrchName"),
            key: "actorBrchName",
            hiddenCol: false,

            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.actorBrchType"),
            key: "actorBrchType",
            hiddenCol: false,

            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ActorBrchType", params.row.actorBrchType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.bankOtherCode"),
            key: "bankOtherCode",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.shcpe.ownBankNo"),
            key: "ownBankNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.ownMember"),
            key: "ownMember",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.largeFlag"),
            key: "largeFlag",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.largeFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        yonList: [],
        provinceList: [],
        actorBrchTypeList: [],
        type: null,
        readonly: false,
        isRequired: true,
        viewDatailWin: false,
        ifShowMore: false,
        submitFlag: false,
        id: null
      };
    },
    props: {
      showHvpsBank: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    components: {},
    watch: {
      tempShowHvpsBank(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempShowHvpsBank: {
        get() {
          return this.showHvpsBank;
        },
        set() {
        }
      }
    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) {
          return;
        }
      },
      handleCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("showHvpsBankSubmit", this.currentSelectRow);
      },
      //确定
      submitForm() {
        this.$emit("showHvpsBankSubmit", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("showHvpsBankClose", "");
      }
    },
    mounted() {
      this.getDictListByGroups("ActorBrchType,Yon").then(res => {
        this.actorBrchTypeList = res.get("ActorBrchType");
        this.yonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
