<!-- 法人业务参数管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="legalNo" :label="$t('m.i.common.legalNo')">
                  <h-input v-model="formItem.legalNo" placeholder="" icon="android-search" @on-click="queryLegalNo('query')" readonly
                           clearable @on-clear="clearVal('legalNo')"></h-input>
                </h-form-item>
                <h-form-item label="通知类型" prop="noticeType">
                  <h-select v-model="formItem.noticeType" placeholder="" :clearable="false">
                    <h-option v-for="item in noticeTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in formBusiTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/sm/msg/msgpush/msgConfMain/func_queryMsgConfDtoByPage"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.msgConfAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.msgConfModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleDelForm()" v-if="authObj.msgConfDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="850" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增消息模板</span>
        <span v-if="type=='modify'">修改消息模板</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo" :required="isRequired">
            <h-input v-model="addForm.legalNo" placeholder="" icon="android-search" @on-click="queryLegalNo('add')" readonly
                     clearable @on-clear="clearVal('editLegalNo')"></h-input>
          </h-form-item>
          <h-form-item label="通知类型" prop="noticeType" required>
            <h-select v-model="addForm.noticeType" :readonly="type=='modify'">
              <h-option v-for="item in noticeTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item label="定时任务名称" prop="msgTaskName" :required="addForm.noticeType==='1'" v-show="addForm.noticeType==='1'">
            <h-input v-model="addForm.msgTaskName" placeholder="" readonly v-show="type==='modify'"></h-input>
            <h-input v-model="addForm.msgTaskName" placeholder="" icon="android-search" @on-click="querymsgTaskName()" readonly
                     clearable @on-clear="clearmsgTaskNameVal()" v-show="type==='add'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.pushMethod')" prop="pushMethod" :required="isRequired">
            <h-select  v-model="addForm.pushMethod">
              <h-option v-for="item in pushMethodList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" :required="isRequired" v-show="!!addForm.noticeType">
            <h-select  :readonly="type=='modify'" v-model="addForm.busiType">
              <h-option v-for="item in busiTypeListTemp" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.isUserPush')" prop="isUserPush" :required="isRequired">
            <h-select  v-model="addForm.isUserPush">
              <h-option v-for="item in onOffSwicthList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.isRolePush')" prop="isRolePush" :required="isRequired">
            <h-select  v-model="addForm.isRolePush">
              <h-option v-for="item in onOffSwicthList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.isBrchPush')" prop="isBrchPush" :required="isRequired">
            <h-select  v-model="addForm.isBrchPush">
              <h-option v-for="item in onOffSwicthList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.isTempEffective')" prop="isTempEffective" :required="isRequired">
            <h-select  v-model="addForm.isTempEffective">
              <h-option v-for="item in effectiveFlagList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.pushType')" prop="pushType" :required="isRequired">
            <h-select  v-model="addForm.pushType" @on-change="custTypeChange">
              <h-option v-for="item in pushTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.receiveUser')" prop="userNos"  v-show="this.addForm.pushType == '0'">
            <h-input v-model="addForm.userNos" placeholder="" icon="android-search" @on-click="queryUserNo()" readonly
                     clearable @on-clear="clearVal('userNos')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.receiveRole')" prop="roleTypeName" v-show="this.addForm.pushType == '1'">
            <h-input v-model="addForm.roleTypeName" placeholder="" icon="android-search" @on-click="queryRoleNo()" readonly
                     clearable @on-clear="clearVal('roleTypeName')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.receiveBrchNo')" prop="brchNos" v-show="this.addForm.pushType == '2'">
            <h-input v-model="addForm.brchNos" placeholder="" icon="android-search" @on-click="queryBrchNo()" readonly
                     clearable @on-clear="clearVal('brchNos')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.pushAddr')" prop="pushAddr" >
            <h-input v-model="addForm.pushAddr" :maxlength="150" placeholder="/aaa/bbb/ccc或者aaa/bbb/ccc"></h-input>
          </h-form-item>
          <h-form-item label="失败是否允许重发" prop="repeatFlag" required>
            <h-select v-model="addForm.repeatFlag">
              <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.msgTemp')" prop="msgTemp" :required="isRequired" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addForm.msgTemp" :canResize="false" :maxlength="500"></h-input>
            <div><span style="color: #ef2222">模板输入格式如：收到报价编号为%s的转贴现对话报价，报价单状态：已收到.....</span></div>
          </h-form-item>
         </h-form>
         </div>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!-- 查询法人编号弹出框 -->
    <legal-no-search :legalNoSearchWin="legalNoSearchWin" @legalNoSearchClose="legalNoSearchClose" @legalNoSearchChange="legalNoSearchChange"></legal-no-search>
    <!-- 查询用户弹出框 -->
    <user-no-search :userNoSearchWin="userNoSearchWin" @userNoSearchClose="userNoSearchClose" @userNoSearchChange="userNoSearchChange"></user-no-search>
    <!-- 查询机构弹出框 -->
    <brch-no-search :brchNoSearchWin="brchNoSearchWin" @brchNoSearchClose="brchNoSearchClose" @brchNoSearchChange="brchNoSearchChange"></brch-no-search>
    <!-- 查询角色弹出框 -->
    <role-no-search :roleNoSearchWin="roleNoSearchWin" @roleNoSearchClose="roleNoSearchClose" @roleNoSearchChange="roleNoSearchChange"></role-no-search>

    <show-msg-task-job :showMsgTaskJobWin="showMsgTaskJobWin" @closeMsgTaskJobWin="showMsgTaskJobWin=false" @msgTaskJobChange="msgTaskJobChange"></show-msg-task-job>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "msgConfMain",
    data() {
      return {
        formItem : {
          legalNo: "",
          legalpersonName: "",
          busiType: "",
          noticeType:"0"
        },
        //给按钮增加权限
        authObj : {
          msgConfAdd: true, //新增消息模板
          msgConfModify: true, //修改消息模板
          msgConfDelete: true //删除消息模板
        },
        columns : [
          {
            type: "radio",
            title:" ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.msg.pushMethod'),
            key: "pushMethod",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "PushMethod", params.row.pushMethod);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            },
          },
          {
            title:"通知类型",
            key:"noticeType",
            hiddenCol:false,
            render:(h, params)=>{
              let value = this.getDictValueFromMap(this.dictMap, "MsgNoticeType", params.row.noticeType);
              return h("span",
                {
                  domProps: {
                    title: value
                  }
                }, value);
            }
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let list="";
              if (params.row.noticeType==="1") {
                list = this.getDictValueFromMap(this.dictMap, "PushTTBusiType", params.row.busiType);
              }else {
                list = this.getDictValueFromMap(this.dictMap, "PushBusiType", params.row.busiType);
              }
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            },
          },
          {
            title: this.$t('m.i.msg.receiveRole'),
            key: "roleTypeName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.msg.receiveBrchNo'),
            key: "brchNos",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.msg.receiveUser'),
            key: "userNos",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.msg.msgTemp'),
            key: "msgTemp",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.msg.pushType'),
            key: "pushType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "PushType", params.row.pushType);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            },
          },
          {
            title: this.$t('m.i.msg.pushAddr'),
            key: "pushAddr",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.updateTime'),
            key: "updateTime",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          }
        ],
        addForm : {
          id: "",
          legalNo: "",
          pushMethod: "",
          busiType: "",
          msgTemp: "",
          pushType: "",
          pushAddr: "",
          isTempEffective: "",
          userNos: "",
          roleTypes: "",
          roleTypeName:"",
          brchNos: "",
          isUserPush: "",
          isRolePush: "",
          isBrchPush: "",

          noticeType:"",
          msgTaskName:"",
          msgTaskConfId:"",
          repeatFlag:""
        },
        currentSelectRow : null,
        //查询法人弹出框
        legalNoSearchWin : false,
        legalNoType : null,
        //用户查询
        userNoSearchWin : false,
        //机构查询
        brchNoSearchWin : false,
        //角色查询
        roleNoSearchWin : false,
        type:'',
        submitFlag : false,
        addOrEditWin : false,
        readonly : false,
        isRequired : true,
        dictMap : new Map(),
        busiTypeList:[],
        pushMethodList:[],
        pushTypeList:[],
        onOffSwicthList:[],
        effectiveFlagList:[],

        noticeTypeList:[],
        ttPushBusiTypeList:[],
        busiTypeListTemp:[],
        showMsgTaskJobWin:false,
        modifyWhenQuery:null,
        yonList:[],
        formBusiTypeList:[]
      }
    },
    components: {
      LegalNoSearch: () => import( /* webpackChunkName: "sm/auth/legalPersonManager/legalNoSearch" */ '@/views/bizViews/sm/auth/legalPersonManager/legalNoSearch'),
      UserNoSearch: () => import( /* webpackChunkName: "sm/msg/msgpush/userNoSearch" */ '@/views/bizViews/sm/msg/msgpush/userNoSearch'),
      BrchNoSearch: () => import( /* webpackChunkName: "sm/msg/msgpush/brchNoSearch" */ '@/views/bizViews/sm/msg/msgpush/brchNoSearch'),
      RoleNoSearch: () => import( /* webpackChunkName: "sm/msg/msgpush/roleNoSearch" */ '@/views/bizViews/sm/msg/msgpush/roleNoSearch'),
      ShowMsgTaskJob:()=> import(/* webpackChunkName: "sm/msg/msgpush/showMsgTaskJob" */ '@/views/bizViews/sm/msg/msgpush/showMsgTaskJob')
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.legalNo = "";
        } else if (type === 'editLegalNo') {
          this.addForm.legalNo = "";
          this.addForm.legalpersonName = "";
        } else if (type === 'userNos') {
          this.addForm.userNos = "";
        } else if (type === 'roleTypeName') {
          this.addForm.roleTypeName = "";
          this.addForm.roleTypes= "";
        } else if (type === 'editLegalNo') {
          this.addForm.brchNos = "";
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.noticeType="0";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.$refs.addForm.resetFields();
      },
      //新增消息模板
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired=true
        if (this.type == "modify" || this.type == "view") {
          if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
            this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
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
        this.modifyWhenQuery=null;
        this.addOrEditWin = true;
      },

      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = '';
      },

      queryObjById(id){
        post({id:id},"/sm/msg/msgpush/msgConfMain/func_getMsgConfDtoById").then(res => {
          this.submitFlag = false;
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.addForm.id = res.data.retData.id;
              this.addForm.legalNo = res.data.retData.legalNo;
              this.addForm.pushMethod = res.data.retData.pushMethod;
              this.addForm.busiType = res.data.retData.busiType;
              this.addForm.msgTemp = res.data.retData.msgTemp;
              this.addForm.pushType = res.data.retData.pushType;
              this.addForm.pushAddr = res.data.retData.pushAddr;
              this.addForm.isTempEffective = res.data.retData.isTempEffective;
              this.addForm.userNos = res.data.retData.userNos;
              this.addForm.roleTypes = res.data.retData.roleTypes;
              this.addForm.roleTypeName = res.data.retData.roleTypeName;
              this.addForm.brchNos = res.data.retData.brchNos;
              this.addForm.isUserPush = res.data.retData.isUserPush;
              this.addForm.isRolePush = res.data.retData.isRolePush;
              this.addForm.isBrchPush = res.data.retData.isBrchPush;

              this.addForm.noticeType=res.data.retData.noticeType;
              this.addForm.msgTaskName=res.data.retData.msgTaskName;
              this.addForm.msgTaskConfId=res.data.retData.msgTaskConfId;
              this.addForm.repeatFlag=res.data.retData.repeatFlag;
              this.modifyWhenQuery="1";
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });

      },

      //删除
      handleDelForm() {
        let list = this.currentSelectRow;
        if (list != null && list.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        let list = this.currentSelectRow;
        post({ code: list.id }, "/sm/msg/msgpush/msgConfMain/func_deleteMsgConfInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList = [];
            } else {
              this.$msgTip.error(this,{info:this.$t('m.i.common.deleteFailed')+res.data.retMsg})
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo)
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      submitForm() {
        let btnType = this.type
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type=="add"?'/sm/msg/msgpush/msgConfMain/func_addMsgConfInfo':'/sm/msg/msgpush/msgConfMain/func_updateMsgConfInfo'
            if (this.type==="add") {
              this.vaildMsgConf(url);
            }else {
              this.sendForm(url);
            }
          }
        });
      },
      //校验是否允许新增消息模板
      vaildMsgConf(url){
        post(this.addForm,"/sm/msg/msgpush/msgConfMain/func_vaildMsgConf").then(res=>{
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retMsg==="1") {
                //可以新增
                this.sendForm(url);
              }else {
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: res.data.retMsg,
                  onOk: () => {
                    this.sendForm(url);
                  }
                });
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        })
      },
      //发送请求
      sendForm(url){
        post(this.addForm, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.addOrEditWin = false;
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      custTypeChange(){
        if(this.addForm.pushType == '0'){//用戶
          this.addForm.roleTypes="";
          this.addForm.brchNos="";
        } else if(this.addForm.pushType == '1'){//角色
          this.addForm.userNos="";
          this.addForm.brchNos="";
        } else if(this.addForm.pushType == '2'){//
          this.addForm.userNos="";
          this.addForm.roleTypes="";
        } else {
          this.addForm.userNos="";
          this.addForm.roleTypes="";
          this.addForm.brchNos="";
        }
      },

      // 查询法人编号弹窗
      queryLegalNo(legalNoType) {
        if(legalNoType == 'modify') {
          return;
        }
        this.legalNoType = legalNoType;
        this.legalNoSearchWin = true;
      },
      //根据弹框所选数据进行赋值
      legalNoSearchChange(info) {
        if(this.legalNoType == 'query') {
          if(info.length === 0) {
            this.$msgTip.error(this, { info: "请先选择记录！" });
            return;
          }
          this.formItem.legalNo = info.legalNo;
        }
        if(this.legalNoType == 'add') {
          if(info.length === 0) {
            this.$msgTip.error(this, { info: "请先选择记录！" });
            return;
          }
          this.addForm.legalNo = info.legalNo;
          this.addForm.legalpersonName = info.legalpersonName;
        }
        this.legalNoSearchWin = false;
      },
      legalNoSearchClose() {
        this.legalNoSearchWin = false;
      },

      // 查询用户编号弹窗
      queryUserNo() {
        this.userNoSearchWin = true;
      },
      //根据弹框所选数据进行赋值
      userNoSearchChange(info) {
        let userNos=[];
        if(info != null && info.length>0){
          for(let i=0;i<info.length;i++) {
            userNos.push(info[i].userNo)
          }
          this.addForm.userNos =userNos.join(",");
        }
        this.userNoSearchWin = false;
      },
      userNoSearchClose() {
        this.userNoSearchWin = false;
      },
      // 查询机构编号弹窗
      queryBrchNo() {
        this.brchNoSearchWin = true;
      },
      //根据弹框所选数据进行赋值
      brchNoSearchChange(info) {
        let brchNos=[];
        if(info != null && info.length>0){
          for(let i=0;i<info.length;i++) {
            brchNos.push(info[i].brchNo)
         }
          this.addForm.brchNos =brchNos.join(",");
        }
        this.brchNoSearchWin = false;
      },
      brchNoSearchClose() {
        this.brchNoSearchWin = false;
      },
      // 查询角色编号弹窗
      queryRoleNo() {
        this.roleNoSearchWin = true;
      },
      //根据弹框所选数据进行赋值
      roleNoSearchChange(info) {
        this.addForm.roleTypeName = info.roleName;
        this.addForm.roleTypes=info.id;
        this.roleNoSearchWin = false;
      },
      roleNoSearchClose() {
        this.roleNoSearchWin = false;
      },


      querymsgTaskName(){
        this.showMsgTaskJobWin=true;
      },
      clearmsgTaskNameVal(){
        this.addForm.msgTaskConfId="";
        this.addForm.msgTaskName="";
      },
      msgTaskJobChange(data){
        this.addForm.msgTaskName=data.taskName;
        this.addForm.msgTaskConfId=data.id;
        this.showMsgTaskJobWin=false
      },
    },
    mounted() {
      this.getDictListByGroups("PushBusiType,PushMethod,PushType,OnOffSwicth,EffectiveFlag,MsgNoticeType,PushTTBusiType,Yon").then(res => {
        this.busiTypeList = res.get("PushBusiType");
        this.pushMethodList = res.get("PushMethod");
        this.pushTypeList = res.get("PushType");
        this.onOffSwicthList = res.get("OnOffSwicth");
        this.effectiveFlagList = res.get("EffectiveFlag");
        this.noticeTypeList = res.get("MsgNoticeType");
        this.ttPushBusiTypeList = res.get("PushTTBusiType");
        this.yonList=res.get("Yon");
        this.dictMap = res.get("map");
        this.formBusiTypeList=this.busiTypeList;//默认实时通知的业务类型
      });
    },
    watch:{
      'addForm.noticeType'(val){
        if (val==="0") {
          //实时通知
          this.busiTypeListTemp=this.busiTypeList;
          this.addForm.msgTaskConfId="";
          this.addForm.msgTaskName=""
        }else if (val==="1") {
          //定时通知使用定时的业务类型字典
          this.busiTypeListTemp=this.ttPushBusiTypeList;
        }
      },
      'formItem.noticeType'(val){
        if (val==="0") {
          this.formBusiTypeList=this.busiTypeList
        }else if (val==="1") {
          this.formBusiTypeList=this.ttPushBusiTypeList;
        }
        this.formSearch();
      }
    }
  };
</script>

<style scoped>

</style>
