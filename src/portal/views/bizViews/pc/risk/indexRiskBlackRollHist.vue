<template>
  <div class="layout">
    <h-msg-box v-model="tempImageWin" width="1000" @on-close="handleClose()" :maximize="true"   :mask-closable="false">
      <p slot="header">
        <span>{{title}}</span>
      </p>
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--数据展示表格-->
          <h-datagrid
                      :columns="columns"
                      highlight-row
                      getDataFunc
                      :autoLoad="false"
                      @get-data="queryHistData"
                      :gridData = "histData"
                      :bindForm="formItem"
                      :onRowClick="handlelRowClick"
                      :onSelectChange="handleSelectClick"
                      ref="datagrid">
          </h-datagrid>

        </div>
      </h-col>
    </h-row>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>

    </h-msg-box>
  </div>
</template>

<script>
  import { post, on,off } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexRiskBlackRollHist",
    components: {
    },
    props: {
      title: String,
      blackId:[String,Number],
      showHistWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },

    data(){
      let columns = [
        {
          type: "selection",
          width: 60,
          align: "center",
          key:"duoxuan",
          hiddenCol: true
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
          title:this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.cpesBrchCode"),
          key: "brchCode",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.cpesBrchName"),
          key: "brchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankNo'),
          key: "bankNo",
          hiddenCol: false
        },
        {
          title:this.$t('m.i.pc.applTellerName'),
          key: "applTellerName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pc.updateTime'),
          key: "updateTime",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", {domProps: {title: updateTime}}, updateTime);
          }
        },
        {
          title: this.$t('m.i.pc.checkTellerName'),
          key: "checkTellerName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pc.checkDtTm'),
          key: "checkDtTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let checkDtTm = params.row.checkDtTm == null ? "" : this.$moment(params.row.checkDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span",{domProps: {title: checkDtTm}}, checkDtTm);
          }
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "operStatus",
          width: 120,
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
      ];
      return {
        columns : columns,
        formItem : {
          custName:"",
          custType:'',
        },
        addForm : {
          id:"",
          custName:"",
          custNo:"",
          custType:"",
          keyWord:"",
          bankNo:"",
          riskDesc:"",
          origin:"",
          operNo:"",
          reserve1:"",
          reserve2:"",
          createDt:"",
          createTime:"",
          updateDt:"",
          updateTm:"",
          checkDtTm:"",
          transplantFlag:"",
          operStatus:'',
          brchCode:'',
          brchName:'',
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
        branchColumns:columns,
        operStatusList : [],
        type : null,
        readonly:false,
        isRequired:true,
        tableRef : "selfTable",
        histData : {rows:[],total:1},
        submitWin : false,
        custTypes : [],
        brchClassList : [],
        branchTypeList : [],
      };
    },
     watch:{
       showHistWin(val) {
         if (val == true) {
           this.getDictListByGroups("BrchClass,BrchType,BlackCustType,RiskOperStatus").then(res => {
             this.branchTypeList = res.get("BrchType");
             this.brchClassList = res.get("BrchClass");
             this.custTypes = res.get("BlackCustType");
             this.operStatusList = res.get("RiskOperStatus");
             this.dictMap = res.get("map");
           });
           this.queryHistData();
         }
       }

     },
    methods :{
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = '';
      },
      handleAddForm(str) {

        this.type = str;
        this.readonly = false;
        this.isRequired=true
        this.addForm.schemeId = ""
        this.addForm.schemeName = ""
        if (this.type == "modify" || this.type == "view") {
          let list = this.currentSelectList;
          if(list != null && list.length==1){
            this.currentSelectRow = this.currentSelectList[0];
          }else{
            this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
            return ;
          }
          this.addForm.id = this.currentSelectRow.id;
          this.addForm.custNo = this.currentSelectRow.custNo;
          this.addForm.custName = this.currentSelectRow.custName;
          this.addForm.custType = this.currentSelectRow.custType;
          this.addForm.keyWord = this.currentSelectRow.keyWord;
          this.addForm.bankNo = this.currentSelectRow.bankNo;
          this.addForm.riskDesc = this.currentSelectRow.riskDesc;
          this.addForm.origin = this.currentSelectRow.origin;
          this.addForm.createDt = this.currentSelectRow.createDt;
          this.addForm.createTime = this.currentSelectRow.createTime;
          this.addForm.operNo = this.currentSelectRow.operNo;
          this.addForm.reserve1 = this.currentSelectRow.reserve1;
          this.addForm.reserve2 = this.currentSelectRow.reserve2;
          this.addForm.updateDt = this.currentSelectRow.updateDt;
          this.addForm.updateTm = this.currentSelectRow.updateTm;
          this.addForm.transplantFlag = this.currentSelectRow.transplantFlag;
          if(this.type == "modify"){
            this.readonly = true;
          }
          if(this.type == "view"){
            this.isRequired=false
          }
        }else{
          this.addFormReset();
        }
        this.addOrEditWin = true;
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
        this.currentSelectRow = [];
        this.currentSelectList=[];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleClose() {
        this.$emit("showHistWinClose", "");
      },

      queryHistData(){
        let json = {id : this.blackId, pageNo: this.$refs.datagrid ==null ? 1 : this.$refs.datagrid.pageInfo.pageNo, pageSize:this.$refs.datagrid == null ? 10 : this.$refs.datagrid.pageInfo.pageSize};
        post(json,'pc/risk/black/indexRiskBlackRollHist/func_queryRiskBlackHisByBlackId').then(res => {
            if(res){
              let retCode = res.data.retCode;
              if(retCode == "000000" ){
                this.histData = res.data.retData;
              } else {
                // 查询失败
                // this.submitMsg = "查询失败";
                this.$msgTip.error(this,{info:res.data.retMsg})
              }
            } else {
              this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
            }
          }
        )
      }

    },
    computed: {
            tempImageWin: {
                get() {
                    return this.showHistWin;
                },
                set() {
                }
            }
        },

  };
</script>

<style scoped>

</style>
