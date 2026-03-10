<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="draftNo" :label="$t('m.i.shcpe.meetCode')">
                    <h-input v-model="formItem.meetCode"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate one-form">
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch1">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            :highlightRow="true"
            url="/shcpe/ecds/basic/ecdsApData/func_pageQueryEcdsApData"
            :bindForm="formItem"
            :onCurrentChange="handlelRowClick"
            :onCurrentChangeCancel="handleCancelClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showInfo()">{{$t("m.i.shcpe.accesPoint")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box v-model="apInfoWin" width="1000"  :maximize="true"
               @on-close="closeForm">
      <p slot="header">
        <span>查看接入点消息</span>
      </p>
      <h-panel>
        <h-form :model="apInfoForm" :label-width="150" ref="apInfoForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.shcpe.meetCode')" prop="meetCode" class="h-form-height-auto">
            <h-input v-model="apInfoForm.meetCode" readonly :rows="10"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.shcpe.meetName')" prop="meetName" class="h-form-height-auto">
            <h-input v-model="apInfoForm.meetName" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.nonceCcpc')" prop="nonceCcpc" class="h-form-height-auto">
            <h-input v-model="apInfoForm.nonceCcpc" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.meetStatus')" prop="meetStatus" class="h-form-height-auto">
            <h-select v-model="apInfoForm.meetStatus" placeholder="" readonly :rows="10">
              <h-option v-for="item in meetStatusList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.activeDt')" prop="activeDt" class="h-form-height-auto">
            <h-input v-model="apInfoForm.activeDt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.logoutDt')" prop="logoutDt" class="h-form-height-auto">
            <h-input v-model="apInfoForm.logoutDt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.updateDt')" prop="updateGmt" class="h-form-height-auto">
            <h-input v-model="apInfoForm.updateGmt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.latelyUpdateWork')" prop="latelyUpdateWork" class="h-form-height-auto">
            <h-select v-model="apInfoForm.latelyUpdateWork" placeholder="" readonly :rows="10">
              <h-option v-for="item in latelyUpdateWorkList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.meetEnterStatus')" prop="meetEnterStatus" class="h-form-height-auto">
            <h-select v-model="apInfoForm.meetEnterStatus" placeholder="" readonly :rows="10">
              <h-option v-for="item in meetEnterStatusList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.enterIdentify')" prop="enterIdentify" class="h-form-height-auto">
            <h-input v-model="apInfoForm.enterIdentify" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.thisMonthSetFirstTime')" prop="thisMonthSetFirstTime" class="h-form-height-auto">
            <h-input v-model="apInfoForm.thisMonthSetFirstTime" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.thisMonthSetSecond')" prop="thisMonthSetSecond" class="h-form-height-auto">
            <h-input v-model="apInfoForm.thisMonthSetSecond" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.thisMonthFirstLimited')" prop="thisMonthFirstLimited" class="h-form-height-auto">
            <h-input v-model="apInfoForm.thisMonthFirstLimited" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.thisMonthSecondLimited')" prop="thisMonthSecondLimited" class="h-form-height-auto">
            <h-input v-model="apInfoForm.thisMonthSecondLimited" readonly :rows="10"></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer"></div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "ecdsApData",
    data() {
      return {
        formItem: {
          meetCode: ""
        },
        columns: [
          {
            title:" ",
            type:"radio",
            width:60,
            align:"center"
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.shcpe.meetCode"),
            key: "meetCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.meetName"),
            key: "meetName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.nonceCcpc"),
            key: "nonceCcpc",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.shcpe.meetStatus"),
            key: "meetStatus",
            hiddenCol: false,

            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "EcdsAccssPtsInfStsCode", params.row.meetStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.modifyDt'),
            key: "updateGmt",
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.updateGmt && "" !== params.row.updateGmt) {
                let updateGmt = this.$moment(params.row.updateGmt, "YYYY-MM-DD HH:mm:ss:SSS").format("YYYY-MM-DD HH:mm:ss:SSS");
                return h("span", updateGmt);
              }
            }
          },
          {
            title: this.$t('m.i.shcpe.latelyUpdateWork'),
            key: "latelyUpdateWork",
            hiddenCol: false,

            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "EcdsAccssPtsInfLateUpWorkCode", params.row.latelyUpdateWork);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.meetEnterStatus'),
            key: "meetEnterStatus",
            hiddenCol: false,

            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "EcdsAccssPtsInfMeetEnterStsCode", params.row.meetEnterStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        apInfoWin: false,
        dictMap: new Map(),
        apInfoForm: {
          meetCode: "",
          meetName: "",
          nonceCcpc: "",
          meetStatus: "",
          activeDt: "",
          logoutDt: "",
          updateGmt: "",
          latelyUpdateWork: "",
          meetEnterStatus: "",
          enterIdentify: "",
          thisMonthSetFirstTime: "",
          thisMonthSetSecond: "",
          thisMonthFirstLimited: "",
          thisMonthSecondLimited: ""
        },

        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        meetStatusList:[],
        latelyUpdateWorkList:[],
        meetEnterStatusList:[]
      };
    },
    watch: {},

    computed: {},
    mounted() {
      getDictListByGroups("EcdsAccssPtsInfLateUpWorkCode,EcdsAccssPtsInfStsCode,EcdsAccssPtsInfMeetEnterStsCode,EcdsBkInfLateUpWorkCode").then(res => {
        this.meetStatusList=res.get("EcdsAccssPtsInfStsCode")
        this.latelyUpdateWorkList=res.get("EcdsAccssPtsInfLateUpWorkCode")
        this.meetEnterStatusList=res.get("EcdsAccssPtsInfMeetEnterStsCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch1() {
        this.formItem.meetCode = "";
      },
      handlelRowClick(currentRow,oldCurrentRow,_index) {
        this.currentSelectRow[0]=currentRow;
      },
      handleCancelClick(currentRow, oldCurrentRow, _index){
        this.currentSelectRow=[]
      },
      showInfo() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        post({ id: this.currentSelectRow[0].id }, "/shcpe/ecds/basic/ecdsApData/func_getEcdsApDataById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.apInfoForm.meetCode = retData.meetCode;
              this.apInfoForm.meetName = retData.meetName;
              this.apInfoForm.nonceCcpc = retData.nonceCcpc;
              this.apInfoForm.meetStatus = retData.meetStatus;
              this.apInfoForm.activeDt = retData.activeDt?this.$moment(retData.activeDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              this.apInfoForm.logoutDt = retData.logoutDt?this.$moment(retData.logoutDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              this.apInfoForm.updateGmt = retData.updateGmt?this.$moment(retData.updateGmt, "YYYYMMDDHHmmssSSS").format("YYYY-MM-DD HH:mm:ss.SSS") : "";
              this.apInfoForm.latelyUpdateWork = retData.latelyUpdateWork;
              this.apInfoForm.meetEnterStatus = retData.meetEnterStatus;
              this.apInfoForm.enterIdentify = retData.enterIdentify;
              this.apInfoForm.thisMonthSetFirstTime = retData.thisMonthSetFirstTime;
              this.apInfoForm.thisMonthSetSecond = retData.thisMonthSetSecond;
              this.apInfoForm.thisMonthFirstLimited = retData.thisMonthFirstLimited;
              this.apInfoForm.thisMonthSecondLimited = retData.thisMonthSecondLimited;
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        this.apInfoWin = true;
      },
      closeForm() {
        this.$refs["apInfoForm"].resetFields();
        this.apInfoWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
