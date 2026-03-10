<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.whiteBusiType')" prop="whiteBusiType">
                  <h-select v-model="formItem.whiteBusiType" placeholder="">
                    <h-option v-for="item in whiteBusiTypes" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.cpesBrchCode')" class="h-form-long-label" prop="brchCode">
                  <h-input v-model="formItem.brchCode" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.cpesBrchName')" class="h-form-long-label" prop="brchName">
                  <h-input v-model="formItem.brchName" :maxlength=60 :title="formItem.brchName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.brchType')" prop="transBrchClass">
                  <h-select v-model="formItem.transBrchClass" placeholder="">
                    <h-option v-for="item in brchClasses" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.transBrchClass')" prop="brchType">
                  <h-select v-model="formItem.brchType" placeholder="">
                    <h-option v-for="item in brchTypes" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.operStatus')" prop="status">
                  <h-select v-model="formItem.status" placeholder="">
                    <h-option v-for="item in statuses" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
            </h-form>
          </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
                      :columns="columns"
                      highlight-row
                      url="pc/risk/white/riskWhiteRollTrackView/func_trackQueryRiskWhiteRollHis"
                      :bindForm="formItem"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancle"
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
  import { post, on,off } from "@/api/bizApi/commonUtil";

  export default {
    name: "riskWhiteRollTrackView",
    components: {
    },
    data(){
      return {
        columns : [
          {
            title: ' ',
            type: "radio",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: 'ID',
            key: "id",
            hiddenCol: true,
          },
          {
            title: this.$t("m.i.pc.whiteBusiType"),
            key: "whiteBusiType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "WhiteBusiType", params.row.whiteBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.cpesBrchCode"),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title:  this.$t("m.i.common.cpesBrchName"),
            key: "brchName",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.common.brchType"),
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
            title: this.$t("m.i.shcpe.transBrchClass"),
            key: "transBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BrchClass", params.row.transBrchClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:this.$t("m.i.common.bankNo"),
            key: "bankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.whiteRateLevel"),
            key: "whiteRateLevel",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.pc.riskRemark"),
            key: "riskRemark",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.applTellerName"),
            key: "applTellerName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.checkTellerName"),
            key: "checkTellerName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.checkDtTm"),
            key: "checkDtTm",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let checkDtTm = params.row.checkDtTm == null ? "" : this.$moment(params.row.checkDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", {domProps: {title: checkDtTm}},  checkDtTm);
            }
          },
          {
            title:  this.$t("m.i.pc.newUpdateTime"),
            key: "updateTime",
            sortable: true,
            hiddenCol: true,
            render: (h, params) => {
              let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", {domProps: {title: updateTime}}, updateTime);
            }
          },
          {
            title: this.$t("m.i.common.operStatus"),
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RiskOperStatus", params.row.status);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
        ],
        formItem : {
          custName:"",
          whiteBusiType:'',
          brchCode:"",
          brchName:"",
          transBrchClass:"",
          brchType:"",
          status:"",
        },
        addForm : {
          id:"",
          custNo:"",
          custName:"",
          keyWord:"",
          bankNo:"",
          riskRemark:"",
          blackFlag:"",
          createDt:"",
          createTime:"",
          operNo:"",
          reserve1:"",
          reserve2:"",
          updateDt:"",
          updateTm:"",
          transplantFlag:"",
          applTellerNo:"",
          checkTellerNo:"",
          brchCode:"",
          brchName:"",
          brchType:"",
          transBrchClass:"",
          whiteRateLevel:"",
          riskLevel:"",
          whiteBusiType:"",
        },
        //给按钮增加权限
        authObj : {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true, //角色信息下载
        },
        // 是否显示新增或修改窗口
        addOrEditWin : false,
        type : null,
        readonly:false,
        isRequired:true,
        tableRef : "selfTable",
        deletDisabled : false,
        submitFlag : false,
        copyWin : false,
        brchCodeWin : false,
        uploadFileName : "",
        fileId : "",
        uploadWin : false,
        riskLevelList : [
          {value: '1',label: '提示'},
          {value: '0',label: '禁止'},
        ],
        showHistWin : false,
        whiteId : '',
        ifShowMore : false,
        whiteBusiTypes : [],
        branchTypes : [],
        custTypes : [],
        operStatuss : [],
        brchClasses : [],
        dictMap : new Map(),
        uploadUrl : window.LOCAL_CONFIG.API_HOME+"/pc/risk/white/importWhiteRollInfo",
        importSelect : true,
        selectDataFirst : false,
        importWin : false,
      };
    },
     watch:{
       selectDataFirst(val) {
         if(val) {
           this.importSelect = false;
         }
       }

     },
    methods :{
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = '';
      },

      onCurrentChange(currentRow,oldCurrentRow,_index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow,oldCurrentRow,_index){
        this.currentSelectRow = null;
      },
      unDisabled(){
        this.deletDisabled=false
      },
      formSearch() {
        this.unDisabled()
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.currentSelectRow = [];
        this.$refs.formItem.resetFields();
      }
    },
    mounted() {
      this.getDictListByGroups("WhiteBusiType,BrchType,BrchClass,RiskOperStatus").then(res => {
        this.whiteBusiTypes = res.get("WhiteBusiType");
        this.brchTypes = res.get("BrchType");
        this.brchClasses = res.get("BrchClass");
        this.statuses = res.get("RiskOperStatus");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
