<!--计费规则查看-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--手续费品种-->
                <common-select v-model="formItem.prodNo" :label="$t('m.i.bs.stdFeeType')" prop="prodNo"
                               :dictList="stdFeeTypeList" ></common-select>
                <!--计费类型-->
                <common-select v-model="formItem.calFeeType" :label="$t('m.i.bs.calFeeMode')" prop="calFeeType"
                               :dictList="calFeeTypeList" ></common-select>
                <!--状态-->
                <common-select v-model="formItem.activeFlag" :label="$t('m.i.common.status')" prop="activeFlag"
                               :dictList="activeFlagList" ></common-select>

                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bs/corpstdbill/feerule/stdCalFeeQuery/func_queryCalFeeRulePage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--详情弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>规则详情</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <!--手续费品种-->
          <common-select v-model="addForm.prodNo" :label="$t('m.i.bs.stdFeeType')" prop="prodNo"
                         :dictList="stdFeeTypeList" :readonly="true"></common-select>
          <!--控制模式-->
          <common-select v-model="addForm.controlMode" :label="$t('m.i.bs.controlMode')" prop="controlMode"
                         :dictList="controlModeList"  :readonly="true"></common-select>
          <!--计费方式-->
          <common-select v-model="addForm.calFeeType" :label="$t('m.i.bs.calFeeMode')" prop="calFeeType"
                         :dictList="calFeeTypeList"  :readonly="true" ></common-select>
          <!--费率-->
          <common-input  v-model="addForm.feeRatePct" :label="$t('m.i.bs.feeRatePct')" prop="feeRatePct"
                        :readonly="true"  :maxlength="20"  ></common-input>

        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCalFeeQuery",
    data(){
      return {
        ifShowMore : false,
        columns : [  //产品名称 计费类型 控制方式 状态
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.bs.stdFeeType"),
            key: "prodName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showInfoDetail(params.row);
                  }
                }
              }, params.row.prodName);
            }
          },
          {
            title: this.$t("m.i.bs.calFeeMode"),
            key: "calFeeType",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "CalFeeType", params.row.calFeeType);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
          },
          {
            title: this.$t("m.i.bs.controlMode"),
            key: "controlMode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CalFeeRuleControlMode", params.row.controlMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.status"),
            key: "activeFlag",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CalFeeRuleActiveFlag", params.row.activeFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        formItem : {
          prodName:"",
          prodNo:"",
          calFeeType:"",
          activeFlag:"",
        },
        addForm : {
          id:"",
          prodName:"",
          prodNo:"",
          calFeeType:"",
          activeFlag:"",
          controlMode:"",
          feeRatePct:"",
        },
        currentSelectRow : null,
        dictMap : new Map(),
        activeFlagList : [],
        controlModeList : [],
        calFeeTypeList : [],
        stdFeeTypeList:[],

        // 是否显示新增或修改窗口
        addOrEditWin: false,

      }

    },
    components: {

    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.prodName = "";
        this.formItem.prodNo = "";
        this.formItem.activeFlag = "";
        this.formItem.calFeeType = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //查看详情
      showInfoDetail(list){
        this.addOrEditWin = true;
        this.addForm.prodNo = list.prodNo;
        this.addForm.prodName = list.prodName;
        this.addForm.controlMode = list.controlMode;
        this.addForm.activeFlag = list.activeFlag;
        this.addForm.feeRatePct = list.feeRatePct;
        this.addForm.calFeeType = list.calFeeType;
      },
      addFormReset(){
        this.$refs.addForm.resetFields();
        this.addForm.id = '';
        this.addForm.prodName = '';
        this.addForm.prodNo = '';
        this.addForm.calFeeType = '';
        this.addForm.activeFlag = '';
        this.addForm.controlMode = '';
        this.addForm.feeRatePct='';
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addFormReset();
      },
    },
    mounted() {
      this.getDictListByGroups("CalFeeRuleActiveFlag,CalFeeRuleControlMode,CalFeeType,StdFeeType").then(res => {
        this.activeFlagList = res.get("CalFeeRuleActiveFlag");
        this.controlModeList = res.get("CalFeeRuleControlMode");
        this.calFeeTypeList = res.get("CalFeeType");
        this.stdFeeTypeList= res.get("StdFeeType");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
