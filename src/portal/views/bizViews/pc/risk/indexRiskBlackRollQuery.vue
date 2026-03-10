<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <h-form-item :label="$t('m.i.pc.custType')"  prop="custType">
                <h-select v-model="formItem.custType" placeholder=" ">
                  <h-option v-for="item in custTypeList" :value="item.value" :key="item.value">{{ item.label }}</h-option>
                </h-select>
              </h-form-item>
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
                      url="pc/risk/black/indexRiskBlackRollQuery/func_queryRiskBlackRollInfoPage"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportForm()" v-if="authObj.bizSetRoleAdd">{{$t('m.i.common.export')}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>
    <h-black-hist :showHistWin="showHistWin" title="查看历史维护记录" @showHistWinClose="showHistWinClose">

    </h-black-hist>

  </div>
</template>

<script>
  import { post, on,off } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexRiskBlackRollQuery",
    components: {
      HBlackHist:()=>import(/* webpackChunkName: "pc/risk/indexRiskBlackRollHist" */`@/views/bizViews/pc/risk/indexRiskBlackRollHist`),
    },
    data(){
      let columns = [
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
          title: this.$t('m.i.common.legalNo'),
          key: "legalNo",

          hiddenCol: false
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
            return h("span",{domProps: {title: val}},  val);
          }
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          sortable: true,
          hiddenCol: false
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
          title:  this.$t('m.i.common.bankNo'),
          key: "bankNo",
          hiddenCol: false
        },
        {
          title:this.$t('m.i.shcpe.transBrchClass'),
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
          title: this.$t('m.i.common.brchType'),
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
          title: this.$t('m.i.pc.blackRateLevel'),
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
          title: this.$t("m.i.common.checkTellerNo"),
          key: "checkTellerNo",
          hiddenCol: false
        },
        {
          title:this.$t("m.i.pc.newUpdateTime"),
          key: "updateTime",
          hiddenCol: false,
          sortable: true,

          render: (h, params) => {
            let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", {domProps: {title: updateTime}},  updateTime);
          }
        },
        {
          title: this.$t("m.i.pc.blackOriginFlag"),
          key: "blackFlag",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.blackFlagList;
            let blackFlag = params.row.blackFlag;
            for (let i = 0; i < list.length; i++) {
              if (params.row.blackFlag === list[i].key) {
                blackFlag = list[i].value;
              }
            }
            return h("span", {domProps: {title: blackFlag}}, blackFlag);
          }
        },
      ];
      return {
        columns :columns,
        formItem : {
          custName : '',
          custType:'',
        },
        addForm : {
          id:"",
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
          blackFlag:"",
          applTellerNo:"",
          checkTellerNo:"",
          brchCode:"",
          brchName:"",
          status:'',
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
        branchColumns : columns,
        // 是否显示新增或修改窗口
        addOrEditWin : false,
        type : null,
        readonly:false,
        isRequired:true,
        tableRef : "selfTable",
        deletDisabled : false,
        submitFlag : false,
        copyWin : false,
        uploadFileName : "",
        fileId : "",
        uploadWin : false,
        showHistWin : false,
        ifShowMore : false,
        branchTypeList : [],
        custTypes : [],
        blackFlagList : [],
        brchClassList : [],
      };
    },
    methods :{
		showHistWinClose(){
			this.showHistWin = false;
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
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url[TODO:替换后与后台联调]
            let url = this.type=="add"?'/pc/indexRiskBlackRollQuery/add.json':'/pc/indexRiskBlackRollQuery/update.json'
            let msg = this.type=="add"?this.$t('m.i.common.addSuccess'):this.$t('m.i.common.modifySuccess')
            this.submitFlag = true;
            post(this.addForm,url).then(res => {
              this.submitFlag = false;
              if(res){
                let retCode = res.data.retCode
                if(retCode=="000000"){
                  this.$msgTip.success(this)
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                  this.currentSelectList=[];
                }else{
                  // this.$hMessage.error(this.$t('m.i.common.addFailed')+res.data.retMsg);
                  this.$msgTip.error(this,{info:res.data.retMsg})
                }
              }else{
                // this.$hMessage.error(this.$t('m.i.common.netError'))
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
              }

            });
          }
        });

      },
      exportForm(){
        if (this.$refs.datagrid.selectIds.length != 0) {
          let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/black/exportExcel";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          form.innerHTML = `<input type="text" name="ids" value="${this.$refs.datagrid.selectIds}"/>
                            <input type="text" name="custType" value="${this.formItem.custType}"/>
                            <input type="text" name="custName" value="${this.formItem.custName}"/>`
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
        else {
          let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/black/exportExcel";
          let form = document.createElement("form");
          for (let obj in this.formItem) {
            if (this.formItem.hasOwnProperty(obj)) {
              let input = document.createElement('input')
              input.tpye = 'text'
              input.name = obj;
              input.value = this.formItem[obj];
              form.appendChild(input)
            }
          }
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
    },

    mounted() {
      this.getDictListByGroups("BrchClass,BrchType,BlackCustType,BlackFlag").then(res => {
        this.branchTypeList = res.get("BrchType");
        this.brchClassList = res.get("BrchClass");
        this.custTypes = res.get("BlackCustType");
        this.blackFlagList = res.get("BlackFlag");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
