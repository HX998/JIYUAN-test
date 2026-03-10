<!--全市场机构信息查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh">
                  <h-input v-model="formItem.brchFullNameZh" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCodeLike">
                  <h-input v-model="formItem.brchCodeLike" :maxlength="9"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNoLike">
                  <h-input v-model="formItem.transBrchBankNoLike" :maxlength="12"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.brchType')" prop="brchType">
                  <h-select v-model="formItem.brchType" placeholder="">
                    <h-option v-for="item in brchTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
                  <h-input v-model="formItem.memberName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.brchStatus')" prop="brchStatus">
                  <h-select v-model="formItem.brchStatus" placeholder="">
                    <h-option v-for="item in brchStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <!--新增承接机构全称查询条件-->
                <h-form-item :label="$t('m.i.shcpe.undertakeBrch')" prop="continueBranchName">
                  <h-input v-model="formItem.continueBranchName" :maxlength="20"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.bankProv')" prop="transProvinceCode">
                  <h-select v-model="formItem.transProvinceCode" placeholder="">
                    <h-option v-for="item in provinceCodeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/cpes/branch/queryBranchList"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="branchDetail()">
                {{$t("m.i.common.viewDatail")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击查看详情弹出窗-->
    <branch-detail :viewDatailWin="viewDatailWin" :id="id" @branchDatailWinClose="branchDatailWinClose">
    </branch-detail>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "branch",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          brchCodeLike: "",
          transBrchBankNo: "",
          transBrchBankNoLike: "",
          brchType: "",
          memberName: "",
          brchStatus: "",
          continueBranchName: "",
          custNo: "",
          transProvinceCode: ""
        },
        editForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchNum: "",
          brchType: "",
          transBrchClass: "",
          brchFullNameZh: "",
          brchFullNameEn: "",
          brchShortNameZh: "",
          brchShortNameEn: "",
          socCode: "",
          transProvinceCode: "",
          transCorpClass: "",
          prodBeginDt: "",
          prodEndDt: "",
          brchStatus: "",
          transAcctStatus: "",
          regAcctStatus: "",
          transCorpReg: "",
          transRegistCapital: "",
          address: "",
          linkMan: "",
          phone: "",
          custFax: "",
          postCode: "",
          transBrchBankNo: "",
          brchBankName: "",
          eAgentBankNo: "",
          ecdsAcctNo: "",
          cpesBrchRemark: "",
          operTm: "",
          brLv: "",
          operType: "",
          brchInternalAcctNo: "",
          brchInternalAcctName: "",
          memberTxAcctNo: "",
          memberRegAcctNo: "",
          cpesAcctNo: "",
          outAcctBankNo: "",
          outAcctNo: "",
          outAcctName: "",
          firstAdminId: "",
          firstAdminName: "",
          firstAdminStatus: "",
          secondAdminId: "",
          secondAdminName: "",
          secondAdminStatus: "",
          continueBrchCode: "",
          createTime: "",
          updateTime: "",
          custNo: "",
          reserve1: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          isPlatform: "",
          continueBranchName: ""
        },
        agencyForm: {
          id: "",
          cpesBrchRemark: "",
          custNo: "",
          reserve1: ""
        },
        viewDatailForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchNum: "",
          brchType: "",
          brchTypeName: "",
          transBrchClass: "",
          transBrchClassName: "",
          brchFullNameZh: "",
          brchFullNameEn: "",
          brchShortNameZh: "",
          brchShortNameEn: "",
          socCode: "",
          transProvinceCode: "",
          transProvince: "",
          transCorpClass: "",
          transCorpClassName: "",
          prodBeginDt: "",
          prodEndDt: "",
          brchStatus: "",
          brchStatusName: "",
          transAcctStatus: "",
          transAcctStatusName: "",
          regAcctStatus: "",
          regAcctStatusName: "",
          transCorpReg: "",
          transRegistCapital: "",
          address: "",
          linkMan: "",
          phone: "",
          custFax: "",
          postCode: "",
          transBrchBankNo: "",
          brchBankName: "",
          eAgentBankNo: "",
          ecdsAcctNo: "",
          cpesBrchRemark: "",
          operTm: "",
          brLv: "",
          operType: "",
          brchInternalAcctNo: "",
          brchInternalAcctName: "",
          memberTxAcctNo: "",
          memberRegAcctNo: "",
          cpesAcctNo: "",
          outAcctBankNo: "",
          outAcctNo: "",
          outAcctName: "",
          firstAdminId: "",
          firstAdminName: "",
          firstAdminStatus: "",
          secondAdminId: "",
          secondAdminName: "",
          secondAdminStatus: "",
          continueBrchCode: "",
          createTime: "",
          updateTime: "",
          custNo: "",
          reserve1: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          isPlatform: "",
          continueBranchName: ""
        },

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        socCodeRule: [{ test: /^[A-Za-z0-9\-]{18}$/, trigger: "blur", message: "统一社会信用代码为18位只含a-z,A-Z,0-9,-字符" }],
        custNoRule: [{ test: /^[a-zA-Z0-9#]{0,20}$/, trigger: "blur", message: "同业客户号为20位只含a-z,A-Z,0-9字符" }],
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        //给按钮增加权限
        authObj: {
          viewDatail: true //查看详情
        },
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
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.transBrchBankNo"),
            key: "transBrchBankNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "brchFullNameZh",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchType"),
            key: "brchType",
            hiddenCol: false,
            ellipsis: false,
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
            ellipsis: false,
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
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UserBrchStatus", params.row.brchStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.undertakeBrch"),
            key: "continueBranchName",
            sortable: true,
            hiddenCol: false,
          },
          /*
          {
            title: this.$t("m.i.shcpe.custNo"),
            key: "custNo",
            hiddenCol: false,
            ellipsis: false
          }*/
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        brchTypeList: [],
        brchStatusList: [],
        provinceCodeList: [],
        type: null,
        isRequired: true,
        editWin: false,
        agencyWin: false,
        viewDatailWin: false,
        ifShowMore: false,
        submitFlag: false,
        id: null
      };
    },
    components: {
      BranchDetail: () => import(/* webpackChunkName: "shcpe/cpes/branch/branchDetail" */`@/views/bizViews/shcpe/cpes/branch/branchDetail`)

    },
    watch: {},

    computed: {},
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
      // 查看详情
      branchDetail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length != 0) {
          this.viewDatailWin = true;
          this.id = this.currentSelectRow.id;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      branchDatailWinClose() {
        this.viewDatailWin = false;
      }
    },
    mounted() {
      this.getDictListByGroups("BrchType,UserBrchStatus,Province").then(res => {
        this.brchTypeList = res.get("BrchType");
        this.brchStatusList = res.get("UserBrchStatus");
        this.provinceCodeList = res.get("Province");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
