<!--行名行号查询-->
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
                <h-form-item :label="$t('m.i.shcpe.actorBrchName')" prop="actorBrchName">
                  <h-input v-model="formItem.actorBrchName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.actorBrchBankNo')" prop="actorBrchBankNo" :label-width="100">
                  <h-input v-model="formItem.actorBrchBankNo" :maxlength="12"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.actorBrchType')" prop="actorBrchType">
                  <h-select v-model="formItem.actorBrchType" placeholder="">
                    <h-option v-for="item in actorBrchTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
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
            url="/shcpe/cpes/hvpsbank/hvpsBank/func_queryHvpsBank"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showDetail()">{{$t("m.i.common.viewDatail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击查看详情弹出窗-->
    <h-msg-box v-model="viewDatailWin" width="800" :mask-closable="false"  :maximize="true">
      <p slot="header">
        <span>机构大额系统详情</span>
      </p>
      <h-tabs value="viewDatail" :model="viewDatailForm">
        <h-tab-pane label="机构大额系统信息" name="branchInfo">
          <h-form>
            <div class="text-wrap mb-10">
              <div class="text-body">
                <h-row :gutter="12">
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">生效日期:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.activeDt}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">参与机构行号:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.actorBrchBankNo}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">行别代码:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.bankOtherCode}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">所属直参行号:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.ownBankNo}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.continueBankNo")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.continueBankNo}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.ownCcpc")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.ownCcpc}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">所在省份:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.province}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.phoneCable")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.phoneCable}}</h-col>
                    </h-row>
                  </h-col>

                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">失效日期:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.failureDt}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">参与机构全称:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.actorBrchName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">所属法人:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.ownMember}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.superBrch")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.superBrch}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">管辖人行行号:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.governmentBankNo}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.largeFlag")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.largeFlag}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.cityCode')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.cityCode}}</h-col>
                    </h-row>
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
    name: "hvpsBank",
    data() {
      return {
        formItem: {
          actorBrchName: "",
          actorBrchBankNo: "",
          actorBrchType: ""
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
    components: {},
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
      handleCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },
      // 查看详情
      showDetail() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/shcpe/cpes/hvpsbank/hvpsBank/func_hvpsBankDetail").then(res => {
          if (res.data.retCode === "000000") {
            this.viewDatailForm = res.data.retData;
            this.viewDatailForm.largeFlag = this.getDictValueFromMap(this.dictMap, "Yon", res.data.retData.largeFlag);
            this.viewDatailForm.province = this.getDictValueFromMap(this.dictMap, "Province", res.data.retData.province);
            this.viewDatailForm.activeDt = res.data.retData.activeDt?this.$moment(res.data.retData.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD"):'';
            this.viewDatailForm.failureDt = res.data.retData.failureDt?this.$moment(res.data.retData.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD"):'';
          }
          this.viewDatailWin = true;
        }).catch(error => {
          this.$hMessage.error({
            content: this.$t("m.i.common.netError") + error,
            duration: 5,
            closable: true
          });
        });
        this.viewDatailWin = true;
      }
    },
    mounted() {
      this.getDictListByGroups("ActorBrchType,Yon,Province").then(res => {
        this.actorBrchTypeList = res.get("ActorBrchType");
        this.yonList = res.get("Yon");
        this.provinceList = res.get("Province");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
