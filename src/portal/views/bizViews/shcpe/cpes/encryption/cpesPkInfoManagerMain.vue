<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">


                <h-form-item prop="legalNos" :label="$t('m.i.common.legalpersonName')" v-if="this.userType == '1'">
                  <h-input v-model="legalNames" placeholder="" icon="android-search"
                           @on-click="queryByLegalNo()" readonly  clearable @on-clear="clearName()"></h-input>
                </h-form-item>
                <common-select v-model="formItem.applStatus" prop="applStatus" :dictList="applyStatusList"
                               :label="$t('m.i.shcpe.applyStatus')"></common-select>
                <common-select v-model="formItem.rgstStatus" prop="rgstStatus" :dictList="rgstStatusList"
                               :label="$t('m.i.shcpe.rgstStatus')"></common-select>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/shcpe/cpes/encryption/func_queryCpesPkInfos"
                      :bindForm="formItem"
                      :onSelectChange="handleCurrentChange"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancle"
                      row-select="true"
                      has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pkApply" :disabled="authObj.apply">{{$t("m.i.shcpe.pkApply")}}</h-button>
              <h-button type="primary" @click="pkRgst" :disabled="authObj.register">{{$t("m.i.shcpe.pkRgst")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查询法人编号弹出框 -->
    <legal-no-search :legalNoSearchWin="legalNoSearchWin" @legalNoSearchClose="legalNoSearchClose"
                     @legalNoSearchChange="legalNoSearchChange"></legal-no-search>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "cpesPkInfoManagerMain",
    data() {
      return {
        userType:this.$store.getters.userInfo.userType,
        dictMap: new Map(),
        formItem: {
          legalNos: [],
          applStatus: "",
          rgstStatus: ""
        },
        legalNames: "",
        addLegalNames: "",
        busiChannelCode: "",
        busiChannelName: "",
        applyStatusList: {},
        rgstStatusList: {},
        //给按钮增加权限
        authObj: {
          apply: false, //申请
          register: false //登记
        },
        columns: [
          {
            title: null,
            type: "selection",
            align: "center",
            hiddenCol: false,
            width: 50
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalpersonName'),
            key: "legalpersonName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.memberId'),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.memberName'),
            key: "memberName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.applyStatus'),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "pkApplyStatus", params.row.applStatus);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.rgstStatus'),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "pkRgstStatus", params.row.rgstStatus);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.applDt'),
            key: "applDt",
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.applDt && "" !== params.row.applDt) {
                let dttm = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.shcpe.rgstDt'),
            key: "rgstDt",
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.rgstDt && "" !== params.row.rgstDt) {
                let dttm = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          }
        ],
        editNoView: true,
        editView: false,
        legalNoSearchWin: false,
        legalNoType: null,
        submitFlag: false,
        readonly: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        currentSelectRow: [],
      };
    },
    components: {
      LegalNoSearch: () => import(/* webpackChunkName: "sm/auth/legalPersonManager/legalNoSearch" */`@/views/bizViews/sm/auth/legalPersonManager/legalNoSearch`)
    },
    watch: {},
    computed: {},
    methods: {
      clearName() {
        this.formItem.legalNos = [];
        //this.formItem.memberName = "";
        this.legalNames = "";
      },
      // 查询法人编号弹窗
      queryByLegalNo() {
        this.legalNoSearchWin = true;
      },
      // 查询
      handleSearch() {
        this.authObj.register = false;
        this.authObj.apply = false;
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleCurrentChange(arr, selectInx) {
        this.currentSelectRow = arr;
        this.currentSelectRowInx = selectInx;
        this.checkStatus(arr);
      },
      // 重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.legalNames = "";
      },
      //根据弹框所选数据进行赋值
      legalNoSearchChange(info) {
        if (info.length === 0) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }

        this.formItem.legalNos = info.legalNo;
        this.legalNames = info.legalpersonName;
        this.legalNoSearchWin = false;
      },
      /*//根据弹框所选数据进行赋值
      legalNoSearchChange(info) {

        if (info.length === 0) {
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.legalNo = info.legalNo;
        this.legalName = info.legalpersonName;
        this.legalNoSearchWin = false;
      },*/
      legalNoSearchClose() {
        this.legalNoSearchWin = false;
      },
      // 行选中
     /* onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },*/
      checkStatus(arr) {

        let applyCheckStatus = "0";
        let rgstCheckStatus = "0";
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < list.length; i++) {
          if (list[i].applStatus === 'AP01' || list[i].rgstStatus === 'RE01') {
            applyCheckStatus = "1";
            break;
          }
        }

        for (let i = 0; i < list.length; i++) {
          if (list[i].applStatus !== 'AP02' || list[i].rgstStatus === 'RE01') {
            rgstCheckStatus = "1";
            break
          }
        }
        if (applyCheckStatus === "1"){
          this.authObj.apply = true;
        }else{
          this.authObj.apply = false;
        }
        if (rgstCheckStatus === "1"){
          this.authObj.register = true;
        }else{
          this.authObj.register = false;
        }
      },

      pkApply() {
        if (this.$refs.datagrid.selectIds.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let memberIds = [];
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < list.length; i++) {
          memberIds.push(list[i].memberId);
        }
        let url = "/shcpe/cpes/encryption/func_applyCpesPkInfos";
        post({memberIds: memberIds}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.authObj.register = false;
              this.authObj.apply = false;
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.authObj.register = false;
              this.authObj.apply = false;
            }
          } else {
            this.$refs.datagrid.dataChange(1);
            this.authObj.register = false;
            this.authObj.apply = false;
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      pkRgst() {
        if (this.$refs.datagrid.selectIds.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let memberIds = [];
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < list.length; i++) {
          memberIds.push(list[i].memberId);
        }
        let url = "/shcpe/cpes/encryption/func_registerCpesPkInfo";
        post({memberIds: memberIds}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.authObj.register = false;
              this.authObj.apply = false;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.authObj.register = false;
              this.authObj.apply = false;
            }
          } else {
            this.$refs.datagrid.dataChange(1);
            this.authObj.register = false;
            this.authObj.apply = false;
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    },
    mounted() {
      this.getDictListByGroups("pkApplyStatus,pkRgstStatus").then(res => {
        this.applyStatusList = res.get("pkApplyStatus");
        this.rgstStatusList = res.get("pkRgstStatus");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
