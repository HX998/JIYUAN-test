<!--机构查询-->
<template>
  <h-msg-box v-model="tempshowHeadBankWin" :mask-closable="false" :maximize="true" :z-index=1200
             @on-close="handleClose" width="1000" class="h-form-table-layer">
    <p slot="header">
      <span>总行信息查询</span>
    </p>
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.memberId')" prop="memberId" :validRules="memberIdRule">
          <h-input v-model="formItem.memberId" :maxlength="6"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.memberBankNo')" prop="memberBankNo"
                     :validRules="memberBankNoRule">
          <h-input v-model="formItem.memberBankNo" :maxlength="12"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.memberBankName')" prop="memberBankName">
          <h-input v-model="formItem.memberBankName" :maxlength="150"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.bankLevel')" prop="bankLevel">
          <h-select v-model="formItem.bankLevel" placeholder="">
            <h-option v-for="item in bankLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.bankType')" prop="bankType">
          <h-select v-model="formItem.bankType" placeholder="">
            <h-option v-for="item in bankTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
        <query-btn @showChange="ifShowMore=!ifShowMore" :formSearch="formSearch"
                   :formSearchReset="formSearchReset"></query-btn>
      </h-form>
    </div>
    <!--弹出框内容-->
    <h-row>
      <h-col span="24">
        <div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="showColumns"
            highlight-row
            url="/banks/szbank/pl/inpoolLimit/queryTopBankInfo"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            :onRowDbClick="doubleHandleClick"
            ref="datagrid">
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      <h-button type="primary" @click="submitForm">{{ $t("m.i.common.commit") }}</h-button>
    </div>
  </h-msg-box>
</template>
<script>

export default {
  name: "showHeadBank",
  data() {
    return {
      memberIdRule: [{ test: /^[0-9a-zA-Z]{6}$/, trigger: "blur", message: "会员代码为6位" }],
      memberBankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成" }],
      showColumns: [
        {
          title: " ",
          type: "radio",
          width: 50,
          align: "center"
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
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
      ],
      formItem: {
        memberId: "",
        memberBankNo: "",
        bankLevel: "",
        memberBankName: "",
        bankType: ""
      },
      ifShowMore: false,
      bankLevelList: [],
      bankTypeList: [],
      dictMap: new Map(),
      currentSelectRow: null
    };
  },
  props: {
    showHeadBankWin: {
      type: Boolean,
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
  methods: {
    formSearch() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.currentSelectRow=[];
          this.$refs.datagrid.dataChange(1);
        }
      });

    },
    formSearchReset() {
      this.formItem.memberBankNo = "";
      this.formItem.bankType = "";
      this.formItem.bankLevel = "";
      this.formItem.memberId = "";
      this.formItem.memberBankName = "";
    },
    onCurrentChange(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = currentRow;
    },
    onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
      this.currentSelectRow = null;
    },
    doubleHandleClick(arr) {
      this.currentSelectRow = arr;
      this.$emit("headBankSelect", this.currentSelectRow);
    },
    submitForm() {
      if (!this.currentSelectRow) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        return;
      }
      // 选择客户
      this.$emit("headBankSelect", this.currentSelectRow);
    },
    handleClose() {
      this.$emit("showHeadBankWinClose", "");
    }
  },
  mounted() {
    this.getDictListByGroups("bankLevel,bankType").then(res => {
      this.bankLevelList = res.get("bankLevel");
      this.bankTypeList = res.get("bankType");
      this.dictMap = res.get("map");
    });
  },
  watch:{
    showHeadBankWin(val){
      if (val === true) {
        this.$nextTick(() => {
          this.currentSelectRow = [];
          this.formSearchReset();
          this.$refs.datagrid.$refs.gridPage.clearElevator();
          this.formSearch();
        })
      }
    }
  }
};
</script>
<style>

</style>
