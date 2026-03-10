<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.custType')" prop="custType">
                  <h-select v-model="formItem.custType" placeholder=" ">
                    <h-option v-for="item in custTypes" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item  :label="this.$t('m.i.common.operStatus')" prop="operStatus">
                  <h-select v-model="formItem.operStatus" placeholder=" ">
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
            url="pc/risk/black/indexRiskBlackRollInfo/func_queryRiskBlackRollIndexPage"
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
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" @on-close="handleWinClose">
      <p slot="header">
        <span v-if="type=='add'">新增黑名单信息</span>
        <span v-if="type=='modify'">修改黑名单信息</span>
        <span v-if="type=='view'">查看黑名单信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">

          <h-form-item :label="$t('m.i.pc.custType')" prop="custType" :required="isRequired">
            <h-select v-if="type=='view'" v-model="addForm.custType" class="input-boder-0" :title="addForm.custType">
              <h-option v-for="item in custTypes" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type=='modify'" v-model="addForm.custType" readonly :title="addForm.custType" @on-change="custTypeChange">
              <h-option v-for="item in custTypes" :value="item.key" :key="item.key" >{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.custType"  @on-change="custTypeChange">
              <h-option v-for="item in custTypes" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="this.addForm.custType == '1'" v-show="this.addForm.custType == '1'">
            <h-input v-if="type=='view'" v-model="addForm.custName" class="input-boder-0" :title="addForm.custName"></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.cpesBrchCode')" prop="brchCode" :required="this.addForm.custType == '2'"  v-show="this.addForm.custType == '2'">
            <h-input v-if="type=='view'" v-model="addForm.brchCode" class="input-boder-0" :title="addForm.brchCode"></h-input>
            <h-input v-else-if="type=='modify'" v-model="addForm.brchCode" :maxlength=9 readonly></h-input>
            <h-input v-else v-model="addForm.brchCode" :maxlength=9 readonly
                     icon="android-search" @on-click="brchCodeWinOpen"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.cpesBrchName')" prop="brchName" :required="this.addForm.custType == '2'" v-show="this.addForm.custType == '2'">
            <h-input v-if="type=='view'" v-model="addForm.brchName" class="input-boder-0" :title="addForm.brchName"></h-input>
            <h-input v-else v-model="addForm.brchName" :maxlength=60 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.bankNo')" prop="bankNo"   v-if="this.addForm.custType == '2'">
            <h-input v-if="type=='view'" v-model="addForm.bankNo" class="input-boder-0" :title="addForm.bankNo"></h-input>
            <h-input v-else v-model="addForm.bankNo" :maxlength=60 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.brchType')" prop="brchType"   v-if="this.addForm.custType == '2'">
            <h-input v-if="type=='view'" v-model="addForm.brchTypeName" class="input-boder-0" :title="addForm.brchTypeName"></h-input>
            <h-input v-else v-model="addForm.brchTypeName" :maxlength=60 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.shcpe.transBrchClass')" prop="brchClass"  v-if="this.addForm.custType == '2'">
            <h-input v-if="type=='view'" v-model="addForm.brchClassName" class="input-boder-0" :title="addForm.brchClassName"></h-input>
            <h-input v-else v-model="addForm.brchClassName" :maxlength=60 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.blackRateLevel')" prop="rateLevel">
            <h-input v-if="type=='view'" v-model="addForm.rateLevel" class="input-boder-0" :title="addForm.rateLevel"></h-input>
            <h-input v-else v-model="addForm.rateLevel" :maxlength=10></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.keyWord')" prop="keyWord">
            <h-input v-if="type=='view'" v-model="addForm.keyWord" class="input-boder-0" :title="addForm.keyWord"></h-input>
            <h-input v-else v-model="addForm.keyWord" :maxlength=60></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.riskLevel')" prop="riskLevel" :required="isRequired">
            <h-select v-if="type=='view'" v-model="addForm.riskLevel" class="input-boder-0" :title="addForm.riskLevel">
              <h-option v-for="item in riskLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type=='modify'" v-model="addForm.riskLevel" class="input-boder-0" :title="addForm.riskLevel">
              <h-option v-for="item in riskLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.riskLevel">
              <h-option v-for="item in riskLevelList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.isFirstMatchCertifyNo')" prop="isFirstMatchCertifyNo" class="h-form-long-label"
                       :required="this.addForm.custType === '1'" v-show="this.addForm.custType === '1'">
            <h-select v-if="type==='view'" v-model="addForm.isFirstMatchCertifyNo" class="input-boder-0" :title="addForm.isFirstMatchCertifyNo">
              <h-option v-for="item in Yons" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type==='modify'" v-model="addForm.isFirstMatchCertifyNo" class="input-boder-0" :title="addForm.isFirstMatchCertifyNo">
              <h-option v-for="item in Yons" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.isFirstMatchCertifyNo">
              <h-option v-for="item in Yons" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.certifyType')" prop="certifyType" :required="this.addForm.isFirstMatchCertifyNo === '1'" v-show="this.addForm.custType === '1'">
            <h-select v-if="type==='view'" v-model="addForm.certifyType" class="input-boder-0" :title="addForm.certifyType">
              <h-option v-for="item in certificateCodeTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type==='modify'" v-model="addForm.certifyType" class="input-boder-0" :title="addForm.certifyType">
              <h-option v-for="item in certificateCodeTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.certifyType">
              <h-option v-for="item in certificateCodeTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.certifyNo')" prop="certifyNo" :required="this.addForm.isFirstMatchCertifyNo === '1'" v-show="this.addForm.custType === '1'">
            <h-input v-if="type==='view'" v-model="addForm.certifyNo" class="input-boder-0" :title="addForm.certifyNo"></h-input>
            <h-input v-else v-model="addForm.certifyNo" :maxlength=18></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.blackRiskRemark')" prop="riskRemark">
            <h-input v-if="type=='view'" type="textarea" v-model="addForm.riskRemark" class="input-boder-0" :title="addForm.riskRemark"></h-input>
            <h-input v-else type="textarea" v-model="addForm.riskRemark" :maxlength=1000></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addFormReset()">{{$t('m.i.common.reset')}}</h-button>-->
        <h-button type="ghost" @click="handleWinClose()">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary"  v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary"  v-else @click="submitForm()">{{$t('m.i.common.commit')}}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="handleWinClose()">{{$t('m.i.common.close')}}</h-button>
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
                      @brchCodeChange="brchCodeChange" optType="2" selectType="duoxuan"></brch-code-search>
    <h-black-hist :showHistWin="showHistWin" title="查看历史维护记录" :blackId="blackId" @showHistWinClose="showHistWinClose">

    </h-black-hist>

  </div>
</template>

<script>
  import { post, on,off, getMoreParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "indexRiskBlackRollInfo",
    components: {
      BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      HBlackHist:()=>import(/* webpackChunkName: "pc/risk/indexRiskBlackRollHist" */`@/views/bizViews/pc/risk/indexRiskBlackRollHist`),
    },
    data(){
      let columns = [
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
          title: this.$t("m.i.pc.id"),
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
            return h("span", val);
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
          title: this.$t('m.i.common.brchName'),
          key: "brchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.bankNo'),
          key: "bankNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.shcpe.transBrchClass'),
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
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let updateTime = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", {domProps: {title: updateTime}}, updateTime);
          }
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
      ];
      return {
        columns : columns,
        formItem : {
          custName:"",
          custType:'',
          operStatus:""
        },
        addForm : {
          id:"",
          custNo:"",
          custName:"",
          custType:"1",
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
          brchClass:"",
          brchTypeName:"",
          brchClassName:"",
          rateLevel:"",
          riskLevel:"1",
          certifyType:"",
          certifyNo:"",
          isFirstMatchCertifyNo:"",
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
        brchCodeWin : false,
        uploadFileName : "",
        fileId : "",
        uploadWin : false,
        showHistWin : false,
        blackId : '',
        ifShowMore : false,
        auditMode : true,
        branchTypeList : [],
        custTypes : [],
        operStatusList : [],
        brchClassList : [],
        certificateCodeTypeList : [],
        Yons : [],
        riskLevelList : [],
        uploadUrl : window.LOCAL_CONFIG.API_HOME+"/pc/risk/black/importBlackRollInfo",
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
        this.clearAddForm();
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired=true;
        if (this.type == "modify" || this.type == "view") {
          if(this.currentSelectRow == null || this.currentSelectRow.length == 0){
            this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
            return ;
          }
          if(this.currentSelectRow.operStatus == '12' || this.currentSelectRow.operStatus == '22'
            || this.currentSelectRow.operStatus == '32' || this.currentSelectRow.operStatus == '33'){
            this.$msgTip.info(this,{info:this.$t('m.i.pc.updateError')});
            return ;
          }else {
            this.$nextTick(() => {
              if (this.type == "modify") {
                this.readonly = true;
              }
              if (this.type == "view") {
                this.isRequired = false
              }
              this.queryObjById(this.currentSelectRow.id);
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
        post({id:id},"pc/risk/black/queryRiskBlackHisById").then(res => {
          this.submitFlag = false;
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.addForm.id = res.data.retData.id;
              this.addForm.custNo = res.data.retData.custNo;
              this.addForm.custName = res.data.retData.custName;
              this.addForm.custType = res.data.retData.custType;
              this.addForm.keyWord = res.data.retData.keyWord;
              this.addForm.bankNo = res.data.retData.transBrchBankNo;
              this.addForm.riskRemark = res.data.retData.riskRemark;
              this.addForm.origin = res.data.retData.origin;
              this.addForm.createDt = res.data.retData.createDt;
              this.addForm.createTime = res.data.retData.createTime;
              this.addForm.operNo = res.data.retData.operNo;
              this.addForm.reserve1 = res.data.retData.reserve1;
              this.addForm.reserve2 = res.data.retData.reserve2;
              this.addForm.updateDt = res.data.retData.updateDt;
              this.addForm.updateTm = res.data.retData.updateTm;
              this.addForm.transplantFlag = res.data.retData.transplantFlag;
              this.addForm.brchCode = res.data.retData.brchCode;
              this.addForm.brchName = res.data.retData.brchName;
              this.addForm.bankNo = res.data.retData.bankNo;
              this.addForm.brchType = res.data.retData.brchType;
              this.addForm.rateLevel = res.data.retData.rateLevel;
              this.addForm.brchClass = res.data.retData.brchClass;
              this.addForm.riskLevel = res.data.retData.riskLevel;
              this.addForm.certifyType = res.data.retData.certifyType;
              this.addForm.certifyNo = res.data.retData.certifyNo;
              this.addForm.isFirstMatchCertifyNo = res.data.retData.isFirstMatchCertifyNo;

              for (let i = 0; i < this.branchTypeList.length; i++) {
                if (res.data.retData.brchType === this.branchTypeList[i].key) {
                  this.addForm.brchTypeName = this.branchTypeList[i].value;
                }
              }
              for (let i = 0; i < this.brchClassList.length; i++) {
                if (res.data.retData.brchClass === this.brchClassList[i].key) {
                  this.addForm.brchClassName = this.brchClassList[i].value;
                }
              }
            }else{
              // this.submitMsg = "查询失败";
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
            let url = this.type=="add"?'pc/risk/black/indexRiskBlackRollInfo/func_addRiskBlackRollInfo':'pc/risk/black/indexRiskBlackRollInfo/func_updateRiskBlackRollInfo'
            let msg = this.type=="add"?this.$t('m.i.common.addSuccess'):this.$t('m.i.common.modifySuccess')
            this.submitFlag = true;
            //当客户类型是同业黑名单时，客户名称=机构名称
            if(this.addForm.custType==2){
              this.addForm.custName=this.addForm.brchName;
            }
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
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
              }

            });
          }
        });

      },
      handleComfirm(){
        if(this.currentSelectRow != null && this.currentSelectRow.length != 0){
          if(this.currentSelectRow.operStatus == '12' || this.currentSelectRow.operStatus == '22'
            || this.currentSelectRow.operStatus == '32' || this.currentSelectRow.operStatus == '33'){
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
        post({id:delId,blackFlag:blackFlag},'pc/risk/black/indexRiskBlackRollInfo/func_deleteRiskBlackRollInfo').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList=[];
            }else{
              // this.$hMessage.error(this.$t('m.i.common.deleteFailed')+res.data.retMsg)
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            // this.$hMessage.error(this.$t('m.i.common.netError'))
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },
      commitComfirm(){
        if(this.currentSelectRow != null && this.currentSelectRow.length != 0){
          let operStatus = this.currentSelectRow.operStatus;

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
        if(this.currentSelectRow == null || this.currentSelectRow.length == 0){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }

        let checkId = this.currentSelectRow.id;
        post({id:checkId},'pc/risk/black/indexRiskBlackRollInfo/func_submitRiskBlackRollInfo').then(res => {
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
            // this.$hMessage.error(this.$t('m.i.common.netError'))
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });

      },
      rollbackComfirm(){
        if(this.currentSelectRow != null && this.currentSelectRow.length != 0){
          let operStatus = this.currentSelectRow.operStatus;
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

        if(this.currentSelectRow == null || this.currentSelectRow.length == 0 ){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }

        let rollId = this.currentSelectRow.id;
        post({id:rollId},'pc/risk/black/indexRiskBlackRollInfo/func_rollbackRiskBlackRollInfo').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
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
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/black/indexRiskBlackRollInfo/func_download";
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
        this.addForm.brchCode = "";
        this.addForm.brchName = "";
        this.addForm.bankNo = "";
        this.addForm.brchType = "";
        this.addForm.brchClass = "";
        this.addForm.brchTypeName = "";
        this.addForm.brchClassName = "";
      },

      brchCodeWinClose() {
        this.brchCodeWin = false;
      },

      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if(info.length == 1){
          this.addForm.brchCode += info[0].brchCode;
          this.addForm.brchName += info[0].brchFullNameZh;
          this.addForm.bankNo += info[0].transBrchBankNo;
          this.addForm.brchType += info[0].brchType;
          this.addForm.brchClass += info[0].transBrchClass;
          for (let i = 0; i < this.branchTypeList.length; i++) {
            if (info[0].brchType === this.branchTypeList[i].key) {
              this.addForm.brchTypeName = this.branchTypeList[i].value;
            }
          }
          for (let i = 0; i < this.brchClassList.length; i++) {
            if (info[0].transBrchClass === this.brchClassList[i].key) {
              this.addForm.brchClassName = this.brchClassList[i].value;
            }
          }
        }else{
          for(let i = 0; i < info.length; i++) {
            this.addForm.brchCode += info[i].brchCode + ',';
            this.addForm.brchName += info[i].brchFullNameZh+ ',';
            this.addForm.bankNo += info[i].transBrchBankNo+ ',';
            this.addForm.brchType += info[i].brchType+ ',';
            this.addForm.brchClass += info[i].transBrchClass+ ',';

            for (let j = 0; j < this.branchTypeList.length; j++) {
              if (info[i].brchType === this.branchTypeList[j].key) {
                this.addForm.brchTypeName += this.branchTypeList[j].value + ',';
              }
            }
            for (let j = 0; j < this.brchClassList.length; j++) {
              if (info[i].transBrchClass === this.brchClassList[j].key) {
                this.addForm.brchClassName += this.brchClassList[j].value + ',';
              }
            }
          }
        }
        this.brchCodeWin = false;
      },

      handleWinClose(){
        this.clearAddForm();
        this.addOrEditWin = false;
      },

      /* 清空值 */
      clearAddForm(){
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.brchClassName = '';
          this.addForm.brchTypeName = '';
          this.addForm.id = '';
        });
      },

      showHist(){
        if(this.currentSelectRow == null || this.currentSelectRow.length == 0 ){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return
        }
        this.blackId = this.currentSelectRow.id;
        this.showHistWin = true;
      },

      showHistWinClose(){
        this.showHistWin = false;
      },

      custTypeChange(){
        if(this.addForm.custType == '2'){
          this.addForm.custName="";
        } else if(this.addForm.custType == '1'){
          this.addForm.brchCode="";
          this.addForm.brchName="";
          this.addForm.bankNo="";
          this.addForm.brchType="";
          this.addForm.brchClass="";
          this.addForm.riskLevel="1";
        } else {
          this.addForm.custName="";
          this.addForm.brchCode="";
          this.addForm.brchName="";
          this.addForm.bankNo="";
          this.addForm.brchType="";
          this.addForm.brchClass="";
        }
      },
    },

    mounted() {
      this.getDictListByGroups("BrchClass,BrchType,BlackCustType,RiskOperStatus,CertificateCodeType,Yon,RiskLevel").then(res => {
        this.branchTypeList = res.get("BrchType");
        this.custTypes = res.get("BlackCustType");
        this.brchClassList = res.get("BrchClass");
        this.operStatusList = res.get("RiskOperStatus");
        this.certificateCodeTypeList = res.get("CertificateCodeType");
        this.Yons = res.get("Yon");
        this.riskLevelList = res.get("RiskLevel");
        this.dictMap = res.get("map");
      });
      getMoreParamValuesByKeys("pc.risk.black_audit_mode").then(res => {
        let idAudit = res['pc.risk.black_audit_mode'];
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
