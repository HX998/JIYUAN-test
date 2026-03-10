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
                  <h-select v-model="formItem.whiteBusiType" placeholder=" ">
                    <h-option v-for="item in whiteBusiTypes" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item  :label="this.$t('m.i.common.operStatus')" prop="operStatusSub">
                  <h-select v-model="formItem.operStatusSub" placeholder=" ">
                    <h-option v-for="item in operStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
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
            url="pc/risk/white/riskWhiteRollInfo/func_queryRiskWhiteRollIndexPage"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd">{{$t('m.i.common.add')}}</h-button>
              <!--<h-button type="ghost" @click="handleAddForm('view')">{{$t('m.i.common.view')}}</h-button>-->
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd">{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="handleComfirm()" v-if="authObj.bizSetRoleDelete" :disabled="deletDisabled">{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="commitComfirm()" v-if="authObj.bizSetRoleDelete" :disabled="!auditMode">{{$t('m.i.common.submitCheck')}}</h-button>
              <h-button type="primary" @click="rollbackComfirm()" v-if="authObj.bizSetRoleDelete" :disabled="!auditMode">{{$t('m.i.common.cancelCheckAuth')}}</h-button>
              <h-button type="primary" @click="exportByExcel()" v-if="authObj.bizSetRoleDelete" :disabled="deletDisabled">{{$t('m.i.common.batchImport')}}</h-button>
              <h-button type="primary" @click="downModel()" v-if="authObj.bizSetRoleDelete" :disabled="deletDisabled">{{$t('m.i.common.templateDownload')}}</h-button>
              <h-button type="primary" @click="showHist()">{{$t('m.i.common.showHist')}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增白名单信息</span>
        <span v-if="type=='modify'">修改白名单信息</span>
        <span v-if="type=='view'">查看白名单信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">

          <h-form-item :label="$t('m.i.pc.whiteBusiType')" prop="whiteBusiType" :required="isRequired">
            <h-select v-if="type=='view'" v-model="addForm.whiteBusiType" class="input-boder-0" :title="addForm.whiteBusiType">
              <h-option v-for="item in whiteBusiTypes" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type=='modify'" v-model="addForm.whiteBusiType" :title="addForm.whiteBusiType">
              <h-option v-for="item in whiteBusiTypes" :value="item.key" :key="item.key" >{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.whiteBusiType">
              <h-option v-for="item in whiteBusiTypes" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.cpesBrchCode')" prop="brchCode" :required="isRequired">
            <h-input v-if="type=='view'" v-model="addForm.brchCode" class="input-boder-0" :title="addForm.brchCode"></h-input>
            <h-input v-else-if="type=='modify'" v-model="addForm.brchCode" :maxlength=9 readonly
                     icon="android-search" @on-click="brchCodeWinOpen"></h-input>
            <h-input v-else v-model="addForm.brchCode" :maxlength=9 readonly
                     icon="android-search" @on-click="brchCodeWinOpen"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="custName" >
            <h-input v-if="type=='view'" v-model="addForm.custName" class="input-boder-0" :title="addForm.custName"></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=60 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.cpesBrchName')" prop="brchName" >
            <h-input v-if="type=='view'" v-model="addForm.brchName" class="input-boder-0" :title="addForm.brchName"></h-input>
            <h-input v-else v-model="addForm.brchName" :maxlength=60 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.brchType')" prop="brchType"  >
            <h-select v-if="type=='view'" v-model="addForm.brchType" class="input-boder-0" showTitle>
              <h-option v-for="item in brchTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.brchType" readonly>
              <h-option v-for="item in brchTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.shcpe.transBrchClass')" prop="transBrchClass" >
            <h-select v-if="type=='view'" v-model="addForm.transBrchClass" class="input-boder-0" showTitle>
              <h-option v-for="item in transBrchClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.transBrchClass" readonly>
              <h-option v-for="item in transBrchClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankNo')" prop="bankNo"  >
            <h-input v-if="type=='view'" v-model="addForm.bankNo" class="input-boder-0" :title="addForm.bankNo"></h-input>
            <h-input v-else v-model="addForm.bankNo" :maxlength=60 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.whiteRateLevel')" prop="whiteRateLevel">
            <h-input v-if="type=='view'" v-model="addForm.whiteRateLevel" class="input-boder-0" :title="addForm.whiteRateLevel"></h-input>
            <h-input v-else v-model="addForm.whiteRateLevel" :maxlength=10></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.riskRemark')" prop="riskRemark" cols="2">
            <h-input v-if="type=='view'" type="textarea" v-model="addForm.riskRemark" class="input-boder-0" :title="addForm.riskRemark"></h-input>
            <h-input v-else type="textarea" v-model="addForm.riskRemark" :maxlength=256></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addFormReset()">{{$t('m.i.common.reset')}}</h-button>-->
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin;addFormReset();">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary"  v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary"  v-else @click="submitForm()">{{$t('m.i.common.commit')}}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin;addFormReset();">{{$t('m.i.common.close')}}</h-button>
      </div>
    </h-msg-box>

    <!-- 批量导入弹出框-->
    <h-msg-box title="批量导入" v-model="importWin" height="150" :footerHide="true" :maximize="true" :mask-closable="false">
      <h-upload :action="uploadUrl"
                :format="['xls','xlsx']"
                :max-size="2048"
                :with-credentials="true"
                :on-progress="handleProgress"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-format-error="handleFormatError"
                :on-preview="clickLink"
                :on-remove="handleRemove"
                @on-goto-add="selectData"
                ref="upload"
                selfConfig
                uploadAll
                :class="{'h-upload-goto-add': selectDataFirst}">
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="importSelect">{{$t("m.i.common.chooseImportFile")}}</h-button>
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="postFile" v-if="!importSelect">{{$t("m.i.common.submit")}}</h-button>
      </h-upload>
    </h-msg-box>

    <brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>
    <h-white-hist :showHistWin="showHistWin" title="查看历史维护记录" :whiteId="whiteId" @showHistWinClose="showHistWinClose">

    </h-white-hist>

  </div>
</template>

<script>

  import { post, on,off ,getMoreParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "riskWhiteRollInfo",
    components: {
      BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      HWhiteHist:()=>import(/* webpackChunkName: "pc/risk/white/riskWhiteRollHist" */`@/views/bizViews/pc/risk/white/riskWhiteRollHist`),
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
            title:this.$t("m.i.pc.whiteBusiType"),
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
            title: this.$t("m.i.pc.newUpdateTime"),
            key: "updateTime",
            sortable: true,
            hiddenCol: false,
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
          operStatusSub:''
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
        auditMode : true,
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
        brchTypeList: [],
        transBrchClassList: [],
        uploadUrl : window.LOCAL_CONFIG.API_HOME+"/pc/risk/white/importWhiteRollInfo",
        importSelect : true,
        selectDataFirst : false,
        importWin : false,
        dictMap : new Map(),
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
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired=true;
        if (this.type == "modify" || this.type == "view") {
          if(this.currentSelectRow == null || this.currentSelectRow.length==0){
            this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
            return ;
          }
          if(this.currentSelectRow.status == '12' || this.currentSelectRow.status == '22'
            || this.currentSelectRow.status == '32' || this.currentSelectRow.status == '33'){
            this.$msgTip.info(this,{info:this.$t('m.i.pc.updateError')});
            return ;
          }else {
            this.$nextTick(() => {
              this.queryObjById(this.currentSelectRow.id);
              if (this.type == "modify") {
                this.readonly = true;
              }
              if (this.type == "view") {
                this.isRequired = false
              }
            });
          }
        }else{
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },

      queryObjById(id){
        post({id:id},"pc/risk/white/riskWhiteRollInfo/func_queryWhiteHisById").then(res => {
          this.submitFlag = false;
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.addForm.id = res.data.retData.id;
              this.addForm.custName = res.data.retData.custName;
              this.addForm.whiteBusiType = res.data.retData.whiteBusiType;
              this.addForm.riskRemark = res.data.retData.riskRemark;
              this.addForm.brchCode = res.data.retData.brchCode;
              this.addForm.brchName = res.data.retData.brchName;
              this.addForm.bankNo = res.data.retData.bankNo;
              this.addForm.brchType = res.data.retData.brchType;
              this.addForm.whiteRateLevel = res.data.retData.whiteRateLevel;
              this.addForm.transBrchClass = res.data.retData.transBrchClass;
              this.addForm.status = res.data.retData.status;
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });

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
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.currentSelectRow = null;
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type=="add"?'pc/risk/white/riskWhiteRollInfo/func_addRiskWhiteRollInfo':'pc/risk/white/riskWhiteRollInfo/func_updateRiskWhiteRollInfo'
            let msg = this.type=="add"?this.$t('m.i.common.addSuccess'):this.$t('m.i.common.modifySuccess')
            this.submitFlag = true;
            post(this.addForm,url).then(res => {
              this.submitFlag = false;
              if(res){
                let retCode = res.data.retCode
                if(retCode=="000000"){
                  this.$msgTip.success(this)
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.addFormReset();
                  this.addOrEditWin = false;
                  this.currentSelectRow = [];
                }else{
                  // this.$hMessage.error(this.type=="add"?this.$t('m.i.common.addFailed')+res.data.retMsg:this.$t('m.i.common.modifyFailed')+res.data.retMsg);
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
      //白名单删除
      handleComfirm(){
        if(this.currentSelectRow != null &&  this.currentSelectRow.length!=0){
          if(this.currentSelectRow.status == '12' || this.currentSelectRow.status == '22'
            || this.currentSelectRow.status == '32' || this.currentSelectRow.status == '33'){
            this.$msgTip.info(this,{info:this.$t('m.i.pc.deleteError')});
            return ;
          }else {
            this.$hMsgBox.confirm({
              title: this.$t('m.i.common.confirm'),
              content: this.$t('m.i.common.isConfirmDelete') + '?',
              onOk: () => {
                this.handledel();
              }
            })
          }
        }else{
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }

      },
      handledel() {
        let delId = this.currentSelectRow.id;
        let blackFlag = this.currentSelectRow.blackFlag;
        post({id:delId,blackFlag:blackFlag},'pc/risk/white/riskWhiteRollInfo/func_deleteRiskWhiteRollInfo').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList=[];
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },

      //提交复核确认
      commitComfirm(){
        if(this.currentSelectRow != null && this.currentSelectRow.length != 0){
          let operStatus = this.currentSelectRow.status;
          if(operStatus!='11' && operStatus!='21' && operStatus!='31'){
            this.$msgTip.info(this,{info:'只有待提交状态才能提交复核'});
            return
          }
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmCommit') + '?',
            onOk: () => {
              this.commitCheck();
            }
          })
        }else{
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }
      },
      /**提交复核**/
      commitCheck(){
        if(this.currentSelectRow == null || this.currentSelectRow.length==0){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }

        let checkId = this.currentSelectRow.id;
        post({id:checkId},'pc/risk/white/riskWhiteRollInfo/func_submitRiskWhiteRollInfo').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList=[];
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });

      },
      rollbackComfirm(){
        if(this.currentSelectRow != null && this.currentSelectRow.length!=0){
          let operStatus = this.currentSelectRow.status;

          if(operStatus!='12' && operStatus!='22' && operStatus!='32' ){
            this.$msgTip.info(this,{info:'只有待复核状态才能撤销'});
            return
          }
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmRollBack') + '?',
            onOk: () => {
              this.rollback();
            }
          })
        }else{
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }
      },
      /**撤销**/
      rollback(){
        if(this.currentSelectRow == null || this.currentSelectRow.length==0){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }

        let rollId = this.currentSelectRow.id;
        post({id:rollId},'pc/risk/white/riskWhiteRollInfo/func_rollbackRiskWhiteRollInfo').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList=[];
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },

      /**批量导入**/
      exportByExcel(){
        this.importWin = true;
        this.$nextTick(() => {
          this.$refs.upload.clearFiles();
          this.importSelect = true;
          this.selectDataFirst = false;
        });
      },
      selectData(status) {
        this.selectDataFirst = status;
      },
      handleProgress () {
        this.$hMessage.loading({
          content: '文件正在上传中...'
        })
      },
      uploadSuccess(file){
        // this.$hMessage.success('已上传成功');
        this.importWin = false;
        let retCode = file.retCode;
        if(retCode=="000000"){
          this.$msgTip.success(this,{info:this.$t('m.i.common.importSuccess')});
        }else{
          this.$msgTip.error(this,{info:this.$t('m.i.common.importFailed')+ ':'+file.retMsg});
        }
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);

      },
      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传xls或xlsx格式的文件" });
      },
      uploadError (file) {
        // this.$hMessage.error(file.name+'上传失败')
        this.$msgTip.error(this,{info:file.name+'上传失败'})
      },
      clickLink (file) {
        this.$hNotice.info({
          title: '点击上传文件事件',
          desc: '点击已上传的文件链接时的事件'
        })
      },
      handleRemove(file){
        // this.$hMessage.success(file.name+'已移除');
        this.$msgTip.success(this)
        this.importSelect = true;
        this.selectDataFirst = false;
      },

      /**模板下载**/
      downModel(){
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/white/download";
        let form = document.createElement('form');
        form.setAttribute("id","formId");
        form.setAttribute('action',url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },

      brchCodeWinOpen() {
        this.brchCodeWin = true;
      },

      brchCodeWinClose() {
        this.brchCodeWin = false;
      },

      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        this.addForm.brchCode = info.brchCode;
        this.addForm.custName = info.brchFullNameZh;
        this.addForm.brchName = info.brchFullNameZh;
        this.addForm.bankNo = info.transBrchBankNo;
        this.addForm.brchType = info.brchType;
        this.addForm.transBrchClass = info.transBrchClass;
        this.brchCodeWin = false;
      },

      showHist(){
        if(this.currentSelectRow == null || this.currentSelectRow.length==0){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }
        this.whiteId = this.currentSelectRow.id;
        this.showHistWin = true;
      },

      showHistWinClose(){
        this.showHistWin = false;
      },

    },

    mounted() {
      this.getDictListByGroups("WhiteBusiType,BrchType,BrchClass,RiskOperStatus").then(res => {
        this.whiteBusiTypes = res.get("WhiteBusiType");
        this.operStatusList=res.get("RiskOperStatus");
        this.brchTypeList = res.get("BrchType");
        this.transBrchClassList = res.get("BrchClass");
        this.dictMap = res.get("map");
      });
      getMoreParamValuesByKeys("pc.risk.white_audit_mode").then(res => {
        let idAudit = res['pc.risk.white_audit_mode'];
        if(idAudit === '0'){
          this.auditMode = false;
        } else {
          this.auditMode = true;
        }
      });
    }

  };
</script>

<style scoped>

</style>
