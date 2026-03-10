<!--全市场交易员信息查询-->
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
                <h-form-item :label="$t('m.i.common.traderId')" prop="traderIdLike">
                  <h-input v-model="formItem.traderIdLike" :maxlength="10"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.traderName')" prop="traderName">
                  <h-input v-model="formItem.traderName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.userStatus')" prop="traderStatus">
                  <h-select v-model="formItem.traderStatus" placeholder="">
                    <h-option v-for="item in traderStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.userType')" prop="traderType">
                  <h-select v-model="formItem.traderType" placeholder="">
                    <h-option v-for="item in traderTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <show-cpes-branch v-model="formItem.brchCode" :label="$t('m.i.auth.brchName')"
                                  :brchCode.sync="formItem.brchCode"  :cpesBrchName.sync="formItem.brchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="brchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

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
            url="/cpes/trader/queryTraderAll"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="viewDatail()">
                {{$t("m.i.common.viewDatail")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 票交机构弹出框 -->
    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose" :optType="optType"
                      @brchCodeChange="brchCodeChange"></brch-code-search>-->
    <!--点击查看详情弹出窗-->
    <h-msg-box v-model="viewDatailWin" width="800" :mask-closable="false"  :maximize="true">
      <p slot="header">
        <span>用户详情</span>
      </p>
      <h-tabs value="viewDatail" :model="viewDatailForm">
        <h-tab-pane label="用户信息" name="traderInfo">
          <h-form>
            <div class="text-wrap mb-10">
              <div class="text-body">
                <h-row :gutter="12">
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.traderName')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.traderName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.memberName')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.memberName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.brchName')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchFullNameZh}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.userType')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.traderTypeName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.userStatus')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.traderStatusName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.phone')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.phone}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">手机:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.tel}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">邮箱:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.email}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">备注2:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.note2}}</h-col>
                    </h-row>
                  </h-col>

                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.traderId')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.traderId}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.memberId')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.memberId}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.brchCode')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchCode}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.common.userRole")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.traderRole}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">地址:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.address}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">手机是否公开:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.telPubMark}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">个性签名:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.celSign}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">备注1:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.note1}}</h-col>
                    </h-row>
                    <!--<h-row>
                      <h-col span="9" class="label">备注3:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.reserve3}}</h-col>
                    </h-row>-->
                  </h-col>
                </h-row>

              </div>
            </div>
          </h-form>
        </h-tab-pane>
      </h-tabs>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="viewDatailWin =! viewDatailWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "trader",
    data() {
      return {
        formItem: {
          traderId: "",
          traderIdLike: "",
          traderName: "",
          traderStatus: "",
          traderType: "",
          brchName: "",
          brchCode: ""
        },
        viewDatailForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchFullNameZh: "",
          traderId: "",
          traderType: "",
          traderTypeName: "",
          traderRole: "",
          traderName: "",
          traderStatus: "",
          traderStatusName: "",
          address: "",
          phone: "",
          tel: "",
          telPubMark: "",
          celSign: "",
          email: "",
          reserve1: "",
          reserve2: "",
          reserve3: "",
          operTm: "",
          createTime: "",
          updateTime: "",
          note1: "",
          note2: "",
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
            title: this.$t("m.i.common.traderId"),
            key: "traderId",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.traderName"),
            key: "traderName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.userType"),
            key: "traderType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TraderType", params.row.traderType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.userStatus"),
            key: "traderStatus",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TraderStatus", params.row.traderStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "brchFullNameZh",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        traderTypeList: [],
        traderStatusList: [],
        yonList: [],
        optType: "",
        type: null,
        readonly: false,
        isRequired: true,
        viewDatailWin: false,
        //brchCodeWin: false,
        ifShowMore: false,
        id: null
      };
    },
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)

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
        this.formItem.brchName = "";
        this.formItem.brchCode = "";
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
      viewDatail() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/cpes/trader/trader/func_traderDetail").then(res => {
          if (res.data.retCode === "000000") {
            this.viewDatailForm = res.data.retData;
            this.viewDatailForm.traderTypeName = formatterTraderType(res.data.retData.traderType);
            this.viewDatailForm.traderStatusName = formatterTraderStatus(res.data.retData.traderStatus);
            this.viewDatailForm.telPubMark = this.getDictValueFromMap(this.dictMap, "Yon", res.data.retData.telPubMark);
            this.viewDatailForm.traderRole = formatterTraderRole(res.data.retData.traderRole);
          }
          this.viewDatailWin = true;
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
        this.viewDatailWin = true;
      }
    },
    mounted() {
      this.getDictListByGroups("TraderType,TraderStatus,Yon").then(res => {
        this.traderTypeList = res.get("TraderType");
        this.traderStatusList = res.get("TraderStatus");
        this.yonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    }
  };

  function formatterTraderType(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case "UT01":
        return "场务管理员";
      case "UT02":
        return "场务操作员";
      case "UT03":
        return "机构管理员";
      case "UT04":
        return "机构操作员";
    }
  }

  function formatterTraderRole(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case "UR01":
        return "交易员";
      case "UR02":
        return "非交易员";
    }
  }

  function formatterTraderStatus(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"US01":
        return "正常";
      case"US02":
        return "禁用";
      case"US03":
        return "锁定";
    }
  }
</script>
