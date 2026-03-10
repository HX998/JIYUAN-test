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
                <h-form-item class="h-form-operate one-form">
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
                      url="pc/risk/black/indexRiskBlackRollCheck/func_queryRiskBlackRollCheckPage"
                      :bindForm="formItem"
                      :row-select="true"
                      :onRowClick="handlelRowClick"
                      :onSelectChange="handleSelectClick"
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

  import { post, on,off } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexRiskBlackRollCheck",
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
            title:this.$t("m.i.pc.id"),
            key: "id",
            hiddenCol: true,
          },
          {
            title: this.$t("m.i.pc.custType"),
            key: "custType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.custTypes;
              let val = params.row.custType;
              for (let i = 0; i < list.length; i++) {
                if (params.row.custType === list[i].key) {
                  val = list[i].value;
                }
              }
              return h("span", {domProps: {title: val}}, val);
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
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
          {
            title:this.$t('m.i.common.bankNo'),
            key: "bankNo",
            hiddenCol: false
          },
          {
            title:this.$t('m.i.common.brchType'),
            key: "brchClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.brchClassList;
              let brchClass = params.row.brchClass;
              for (let i = 0; i < list.length; i++) {
                if (params.row.brchClass === list[i].key) {
                  brchClass = list[i].value;
                }
              }
              return h("span", {domProps: {title: brchClass}}, brchClass);
            }
          },
          {
            title: this.$t('m.i.shcpe.transBrchClass'),
            key: "brchType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.branchTypeList;
              let brchType = params.row.brchType;
              for (let i = 0; i < list.length; i++) {
                if (params.row.brchType === list[i].key) {
                  brchType = list[i].value;
                }
              }
              return h("span", {domProps: {title: brchType}}, brchType);
            }
          },
          {
            title:this.$t('m.i.pc.blackRateLevel'),
            key: "rateLevel",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.blackRiskRemark'),
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
              let list = this.operStatusList;
              let operStatus = params.row.operStatus;
              for (let i = 0; i < list.length; i++) {
                if (params.row.operStatus === list[i].key) {
                  operStatus = list[i].value;
                }
              }
              return h("span", {
                domProps: {
                  title: operStatus
                }
              },operStatus);
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
          custType:"",
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
          brchClass:"",
          rateLevel:"",
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
        custTypeList : [
          {
            value: '1',
            label: '企业'
          },{
            value: '2',
            label: '同业'
          }
        ],
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
        if(list != null && list.length>0){
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
        let ids = this.$refs.datagrid.selectIds;
        let url = '';
        if(oper == 'pass'){
          url = 'pc/risk/black/indexRiskBlackRollCheck/func_passRiskBlackRollInfo';
        }
        if(oper == 'reject'){
          url = 'pc/risk/black/indexRiskBlackRollCheck/func_rejectRiskBlackRollInfo';
        }
        post({ids:ids},url).then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              // this.$hMessage.success("复核"+msg+"成功")
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList=[];
            }else{
              // this.$hMessage.error("复核"+msg+"失败"+res.data.retMsg);
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            // this.$hMessage.error(this.$t('m.i.common.netError'))
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      }
    },
    mounted() {
      this.getDictListByGroups("BrchClass,BrchType,BlackCustType,RiskOperStatus").then(res => {
        this.branchTypeList = res.get("BrchType");
        this.brchClassList = res.get("BrchClass");
        this.custTypes = res.get("BlackCustType");
        this.operStatusList = res.get("RiskOperStatus");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
