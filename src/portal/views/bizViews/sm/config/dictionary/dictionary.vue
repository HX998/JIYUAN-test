<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.config.dictGroupCode')" prop="dictGroupCode">
                  <h-input v-model="formItem.dictGroupCode"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.description')" prop="description">
                  <h-input v-model="formItem.description"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" highlightRow url="/sm/config/dictionary/queryDictionaryPage"
                      :bindForm="formItem" :onRowClick="handlelRowClick" :onSelectChange="handleSelectClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('view')" v-if="authObj.bizSetRoleAdd">
                {{$t('m.i.common.view')}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">{{$t('m.i.shcpe.addRoleInfo')}}</span>
        <span v-if="type=='modify'">{{$t('m.i.shcpe.modifyRoleInfo')}}</span>
        <span v-if="type=='view'">{{$t('m.i.shcpe.viewRoleInfo')}}</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.id')" prop="id" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.id" class="input-boder-0" :title="addForm.id"></h-input>
            <h-input v-else v-model="addForm.id" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.legalNo" class="input-boder-0" :title="addForm.legalNo"></h-input>
            <h-input v-else v-model="addForm.legalNo" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.config.dictGroupCode')" prop="dictGroupCode" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.dictGroupCode" class="input-boder-0" :title="addForm.dictGroupCode"></h-input>
            <h-input v-else v-model="addForm.dictGroupCode" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.config.key')" prop="key" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.key" class="input-boder-0" :title="addForm.key"></h-input>
            <h-input v-else v-model="addForm.key" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.config.value')" prop="value" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.value" class="input-boder-0" :title="addForm.value"></h-input>
            <h-input v-else v-model="addForm.value" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.description')" prop="description" :required="isRequired" cols="2">
            <h-input v-if="type=='view'" :value="addForm.description" class="input-boder-0" :title="addForm.reserve1" type="textarea" :canResize="false"></h-input>
            <h-input v-else v-model="addForm.description" :maxlength=60 type="textarea" :canResize="false"></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" style="margin:0 8px"  @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary"  v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary"  v-else @click="submitForm()">{{$t('m.i.common.commit')}}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t('m.i.common.close')}}</h-button>
      </div>
    </h-msg-box>
    <h-msg-box v-model="submitWin" width="300" height="180">
      <p slot="header">
        <span>{{submitTitle}}</span>
      </p>
      <div class="h-prompt-content">
        <div class="h-prompt-top">
          <i v-if="retMsg == ''" class="icon iconfont icon-right"></i>
          <i v-else class="icon iconfont icon-wrong"></i>
          <span>{{submitMsg}}</span>
        </div>
        <p class="h-prompt-words">{{retMsg}}</p>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="submitWin = false">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitWin = false">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>


  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "dictionary",
    components: {
    },
    data(){
      let columns = [
        {
          type: "selection",
          key:"duoxuan",
          width: 60,
          align: "center",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key:"xuhao",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.legalNo'),
          key: "legalNo",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.config.dictGroupCode'),
          key: "dictGroupCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.config.key'),
          key: "key",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.config.value'),
          key: "value",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.description"),
          key: "description",

          hiddenCol: false
        },
      ];
      return {
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
        formItem :  {
          dictGroupCode:"",
          description:"",
        },
        addForm : {
          id:"",
          legalNo:"",
          dictGroupCode:"",
          key:"",
          value:"",
          description:"",
        },
        columns : columns,
        branchColumns : columns,
        type : null,
        readonly:false,
        isRequired:true,
        tableRef:"selfTable",
        deletDisabled : false,
        submitFlag : false,
        copyWin : false,
        brchCodeWin : false,
        submitWin : false,
        submitMsg : '',
        submitTitle : '',
        retMsg : '',
        ifShowMore : false,
        dictValue : '',
        dictDataList : [],
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
            this.$hMessage.info(this.$t('m.i.common.chooseOneData'));
            return ;
          }
          this.queryObjById(this.currentSelectRow.id);
          if(this.type == "modify"){
            this.readonly = true;
          }
          if(this.type == "view"){
            this.isRequired=false
          }
        }else{
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      queryObjById(id){
        post({id:id},"/sm/config/dictionary/showDictionaryDetail").then(res => {
          this.submitFlag = false;
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.addForm.id = res.data.retData.id;
              this.addForm.legalNo = res.data.retData.legalNo;
              this.addForm.dictGroupCode = res.data.retData.dictGroupCode;
              this.addForm.key = res.data.retData.key;
              this.addForm.value = res.data.retData.value;
              this.addForm.description = res.data.retData.description;
              this.addForm.reserve1 = res.data.retData.reserve1;
              this.addForm.reserve2 = res.data.retData.reserve2;
              this.addForm.reserve3 = res.data.retData.reserve3;
              this.addForm.createTime = res.data.retData.createTime;
              this.addForm.updateTime = res.data.retData.updateTime;
            }else{
              this.$refs.datagrid.dataChange(1)
              this.submitMsg = "查询失败";
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          }else{
            this.submitMsg = "查询失败";
            this.retMsg = this.$t('m.i.common.netError');
            this.submitWin = true;
          }
        });

      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr,selectInx) {
        this.unDisabled()
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx
        if(arr.length==0) return
        if(arr[0].role_code == "admin"){
          this.deletDisabled=true
        }
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
      }
    }
  };
</script>

<style scoped>

</style>
