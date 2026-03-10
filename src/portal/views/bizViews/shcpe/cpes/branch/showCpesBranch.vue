<template>
  <h-msg-box v-model="tempShowCpesBranch" width="1000" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true" :zIndex="1003" top="45">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh">
            <h-input v-model="formItem.brchFullNameZh" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
            <h-input v-model="formItem.brchCode" :maxlength="9"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNo">
            <h-input v-model="formItem.transBrchBankNo" :maxlength="12"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberName')" v-if="showMemberId" prop="memberName">
            <h-input v-model="formItem.memberName" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.memberId')" v-if="showMemberId" prop="memberId">
            <h-input v-model="formItem.memberId" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
              <span class="h-more-input" @click="ifShowMore=!ifShowMore" v-if="showMemberId">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                              :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}
            </h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}
            </h-button>
          </h-form-item>
        </h-form>
      </div>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          highlight-row
          url="/cpes/branch/queryBranchList"
          :bindForm="formItem"
          :onCurrentChangeCancel="onCurrentChangeCancel"
          :onCurrentChange="onCurrentChange"
          :onRowDbClick="doubleHandleClick"
          :auto-load="false"
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  export default {
    name: "showCpesBranch",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          transBrchBankNo: "",
          memberName: "",
          memberId: "",
          brchType: "",
          showEnableStr: ""
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        dictMap: new Map(),
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
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
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transBrchBankNo"),
            key: "transBrchBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "brchFullNameZh",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchType"),
            key: "brchType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BrchType", params.row.brchType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.bankProv"),
            key: "transProvinceCode",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Province", params.row.transProvinceCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.brchStatus"),
            key: "brchStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", params.row.brchStatus === "ST01" ? "活动" : params.row.brchStatus === "ST02" ? "禁用" : "")
              ]);
            }
          }
        ],
        tableRef: "selfTable",
        currentSelectRow: null,
        ifShowMore: false,
        id: null
      };
    },
    props: {
      title: {
        type: String,
        default(){
          return "查询机构名称"
        }
      },
      memberId: String,
      brchType: String,
      showMemberId: {
        type: Boolean,
        default() {
          return true;
        }
      },
      showCpesBranch: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showEnable: {
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    computed: {
      tempShowCpesBranch: {
        get() {
          return this.showCpesBranch;
        },
        set() {
        }
      }
    },
    watch: {
      tempShowCpesBranch(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.memberId = this.memberId;
            this.formItem.brchType = this.brchType;
            if(!this.showEnable){
              this.formItem.showEnableStr = "0";
            }else{
              this.formItem.showEnableStr = "1";
            }
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.memberId = this.memberId;
        this.formItem.brchType = this.brchType;
      },
      //确定
      submitForm() {
        this.$emit("showCpesBranchSubmit", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("showCpesBranchClose", "");
      },
      onCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      onCurrentChange(arr, selectInx) {
        this.currentSelectRow = arr;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("showCpesBranchSubmit", this.currentSelectRow);
      }
    },
    mounted() {
      this.getDictListByGroups("Province,BrchType").then(res => {
        this.dictMap = res.get("map");
      });
    },
  };
</script>

<style scoped>

</style>
