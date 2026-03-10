<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
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
                      url="pc/risk/white/riskWhiteRollCheck/func_queryRiskWhiteRollCheckPage"
                      :bindForm="formItem"
                      :onRowClick="handlelRowClick"
                      :onSelectChange="handleSelectClick"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleComfirm('pass')" v-if="authObj.bizSetRoleDelete" :disabled="deletDisabled">{{$t('m.i.common.pass')}}</h-button>
              <h-button type="primary" @click="handleComfirm('reject')" v-if="authObj.bizSetRoleDelete" :disabled="deletDisabled">{{$t('m.i.common.reject')}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>

  import { post,on,off } from "@/api/bizApi/commonUtil";

  export default {
    name: "riskWhiteRollCheck",
    components: {
    },
    data(){
      return {
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",
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
            hiddenCol: false,
            sortable: true,
          },
          {
            title:this.$t("m.i.common.cpesBrchCode"),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.cpesBrchName"),
            key: "brchName",
            hiddenCol: false
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
            title: this.$t("m.i.common.bankNo"),
            key: "bankNo",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.pc.whiteRateLevel"),
            key: "whiteRateLevel",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.pc.riskRemark"),
            key: "riskRemark",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.applTellerNo"),
            key: "applTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.operStatus"),
            key: "operStatus",
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
          custName : '',
          custType:'',
        },
        addForm : {
          id:"",
          custNo:"",
          custName:"",
          whiteBusiType:"",
          keyWord:"",
          bankNo:"",
          riskRemark:"",
          origin:"",
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
          operStatus:'',
          brchType:"",
          transBrchClass:"",
          whiteRateLevel:"",
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
        deletDisabled : false,
        submitFlag : false,
        copyWin : false,
        uploadFileName : "",
        fileId : "",
        uploadWin : false,
        ifShowMore : false,
        branchTypeList : [],
        custTypes : [],
        operStatusList : [],
        brchClassList : [],
        dictMap : new Map(),
      };
    },
    methods :{
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = '';
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr,selectInx) {
        this.unDisabled()
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx
        if(arr.length==0) return
      },
      unDisabled(){
        this.deletDisabled=false
      },
      formSearch() {
        this.unDisabled()
        this.currentSelectRow = null;
        this.currentSelectList=[];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleComfirm(oper){
        let msg = '';
        if(oper == 'pass'){
          msg = '通过'
        }
        if(oper == 'reject'){
          msg = '驳回'
        }
        let list = this.currentSelectList;
        if(list != null && list.length > 0){
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: '确定要'+ msg + '吗?',
            onOk: () => {
              this.handlePassOrRej(oper, msg);
            }
          })
        }else{
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }

      },
      handlePassOrRej(oper, msg) {
        let list = this.currentSelectList;
        let ids = this.$refs.datagrid.selectIds;
        let url = '';
        if(oper == 'pass'){
          url = 'pc/risk/white/riskWhiteRollCheck/func_passRiskWhiteRollInfo';
        }
        if(oper == 'reject'){
          url = 'pc/risk/white/riskWhiteRollCheck/func_rejectRiskWhiteRollInfo';
        }
        post({ids:ids},url).then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = null;
              this.currentSelectList=[];
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },
    },

    mounted() {
      this.getDictListByGroups("WhiteBusiType,BrchType,BrchClass,RiskOperStatus").then(res => {
        this.whiteBusiTypes = res.get("WhiteBusiType");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
