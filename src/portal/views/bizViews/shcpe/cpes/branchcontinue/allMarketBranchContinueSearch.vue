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
                <show-cpes-branch :label="this.$t('m.i.shcpe.byContinueBrchName')" className="h-form-long-label"
                                  :brchCode.sync="formItem.byContinueBrchCode"
                                  :cpesBrchName.sync="formItem.byContinueBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="byContinueBankName"
                                  :showEnable="false"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <show-cpes-branch :label="this.$t('m.i.shcpe.continueBrchName')"
                                  :brchCode.sync="formItem.continueBrchCode"
                                  :cpesBrchName.sync="formItem.continueBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="continueBankName"
                                  :showEnable="false"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="this.$t('m.i.shcpe.status')" prop="statuses">
                  <h-select v-model="formItem.statuses" placeholder="">
                    <h-option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="this.$t('m.i.shcpe.isPlatform')" prop="isPlatform">
                  <h-select v-model="formItem.isPlatform" placeholder="">
                    <h-option v-for="item in isPlatformList" :value="item.value" :key="item.value">{{ item.label }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="this.$t('m.i.common.activeDt')" prop="activeDtStr">
                  <h-date-picker type="daterange" v-model="formItem.activeDtStr" :showFormat="true"
                                 placeholder="" @on-change="handleActiveDtStrChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch('1')">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" highlight-row
                      url="/cpes/branch/branchContinue/allMarketBranchContinueSearch/func_queryAllContinueInfoByPage"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statuses: "",
      formItem: {
        activeDtStr: "",
        isPlatform: "",
        statuses: "",
        minActiveDt: "",
        maxActiveDt: "",
        continueBrchCode: "",
        continueBankName: "",
        byContinueBrchCode: "",
        byContinueBankName: ""
      },
      columns: [
        {
          type: "radio",
          key: "danxuan",
          title: "  ",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.activeDt"),
          key: "activeDt",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", params.row.activeDt ? this.$moment(params.row.activeDt, "YYYYMMDD").format("YYYY-MM-DD") : "");
          }
        }, {
          title: this.$t("m.i.shcpe.byContinueBrchName"),
          key: "byContinueBrchName",
          hiddenCol: false
        }, {
          title: this.$t("m.i.shcpe.continueBrchName"),
          key: "continueBrchName",
          hiddenCol: false
        }, {
          title: this.$t("m.i.shcpe.status"),
          key: "status",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.status === "0") {
              return h("span", "未生效");
            } else if (params.row.status !== "0") {
              return h("span", "已生效");
            } else return h("span", "-");
          }
        }, {
          title: this.$t("m.i.shcpe.isPlatform"),
          key: "isPlatform",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.isPlatform === "0") {
              return h("span", "否");
            } else if (params.row.isPlatform === "1") {
              return h("span", "是");
            } else return h("span", "-");
          }
        }
      ],
      statusList: [
        {
          value: "0",
          label: "未生效"
        },
        {
          value: "1,2",
          label: "已生效"
        }
      ],
      isPlatformList: [
        {
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "是"
        }
      ],
      ifShowMore: false,
    };
  },
  components: {},
  methods: {
    handleActiveDtStrChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minActiveDt = arr[0].replace(/-/g, "");
        this.formItem.maxActiveDt = arr[1].replace(/-/g, "");
      } else {
        this.formItem.minActiveDt = "";
        this.formItem.maxActiveDt = "";
      }
    },
    formSearch() {
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
      this.formItem.byContinueBrchCode = "";
      this.formItem.continueBrchCode = "";
      this.formItem.byContinueBankName = "";
      this.formItem.continueBankName = "";
    },
  }
};

</script>
