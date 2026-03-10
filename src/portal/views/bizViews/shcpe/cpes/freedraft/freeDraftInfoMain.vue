<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="respMemberName" label="接收会员名称">
                    <h-input v-model="formItem.respMemberName" readonly icon="android-search"
                             @on-click="queryMemberId2()" placeholder=""></h-input>
                  </h-form-item>
                  <show-cpes-branch  :label="'接收机构名称'"
                                     :brchCode.sync="formItem.rcvBrchCode"  :cpesBrchName.sync="formItem.respBrchName"
                                     datagridUrl="/cpes/branch/queryBranchList" prop="respBrchName"
                                     queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                  <h-form-item prop="msgId" :label="$t('m.i.common.msgId')">
                    <h-input v-model="formItem.msgId" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="draftDate" label="报文日期">
                    <h-date-picker v-model="formItem.draftDate" format="yyyy-MM-dd" type="daterange" placeholder=""
                                   showFormat :editable=false  @on-change="handleDraftDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="rcvBrchCode" v-show="false">
                    <h-input v-model="formItem.rcvBrchCode"></h-input>
                  </h-form-item>
                  <h-form-item prop="rcvMemberId" v-show="false">
                    <h-input v-model="formItem.rcvMemberId"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/freedraft/freeDraftInfoMain/func_queryAplFreeDraftInfoByPage"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleForm('add')" v-if="authObj.freeDraftSend">{{$t("m.i.shcpe.launch")}}</h-button>
              <h-button type="primary" @click="showWin()" v-if="authObj.freeDraftView">{{$t("m.i.common.viewDatail")}}
              </h-button>
              <h-button type="primary" @click="handleForm('modify')" :disabled="authObj.freeDraftSendAgain">{{$t("m.i.shcpe.launchAgain")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 点击新增/修改弹出框 -->
    <h-msg-box v-model="addOrEditWin" width="400"  :mask-closable="false" :maximize="true"
               @on-close="closeAddOrEditForm">
      <p slot="header">
        <span v-if="type==='add'">发起自由格式</span>
        <span v-if="type==='modify'">再次发起自由格式</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item label="发出会员名称" prop="applMemberName" required>
              <h-input v-model="addOrEditForm.applMemberName" :value="addOrEditForm.applMemberName" readonly
                       placeholder=""></h-input>
            </h-form-item>
            <h-form-item v-if="false" prop="applMemberId">
              <h-input v-model="addOrEditForm.applMemberId" :value="addOrEditForm.applMemberId"></h-input>
            </h-form-item>
            <h-form-item label="发出机构名称" prop="applBrchName" required>
              <h-input v-model="addOrEditForm.applBrchName" :value="addOrEditForm.applBrchName" readonly
                       placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="applBrchCode" v-if="false">
              <h-input v-model="addOrEditForm.applBrchCode" :value="addOrEditForm.applBrchCode"></h-input>
            </h-form-item>
            <h-form-item prop="respMemberName" label="接收会员名称" required>
              <h-input v-model="addOrEditForm.respMemberName" readonly icon="android-search"
                       @on-click="queryMemberId()" placeholder=""></h-input>
            </h-form-item>
            <show-cpes-branch  :label="'接收机构名称'"  :required="true" v-if="this.memberTypeCode !== 'MT05' && this.memberTypeCode !== 'MT06'"
                               :brchCode.sync="addOrEditForm.rcvBrchCode"  :cpesBrchName.sync="addOrEditForm.respBrchName"
                               :msgBoxWin="addOrEditWin" :clearable="false" :cpesBrchParams="cpesBrchParams"
                               @cpesBranchChange="respBrchNameChange($event)"
                               datagridUrl="/cpes/branch/queryBranchList" prop="respBrchName"
                               queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
<!--            <h-form-item label="接收会员名称" prop="respMemberName" required>-->
<!--              <h-input v-model="addOrEditForm.respMemberName" readonly-->
<!--                       placeholder=""></h-input>-->
<!--            </h-form-item>-->
            <h-form-item prop="rcvMemberId" v-if="false">
              <h-input v-model="addOrEditForm.rcvMemberId" :value="addOrEditForm.rcvMemberId" v-show="false"></h-input>
            </h-form-item>
            <h-form-item prop="rcvBrchCode" v-if="false">
              <h-input v-model="addOrEditForm.rcvBrchCode" :value="addOrEditForm.rcvBrchCode" v-show="false"></h-input>
            </h-form-item>
            <h-form-item label="正文" prop="content" required maxlength="20">
              <h-input v-model="addOrEditForm.content" :value="addOrEditForm.content" type="textarea"
                       placeholder="" :maxlength="1000"></h-input>
            </h-form-item>
            <br/>
            <h-form-item label="附件" prop="attFile" name="file" style="margin-top: 14px" class="h-form-height-auto">
              <h-input v-model="addOrEditForm.attachId" :value="addOrEditForm.attachId" v-show="false"></h-input>
              <h-upload ref="upload"
                        :action="uploadURL"
                        :format="['jpg','jpeg','png','gif','bmp','xls','xlsx','et','doc','docx','wps','ppt','pps','dps','pdf','zip','rar']"
                        :max-size="1536"
                        :on-exceeded-size="handleMaxSize"
                        :on-format-error="handleFormatError"
                        :on-success="handleSucess"
                        :on-error="handleFileError"
                        :before-upload="handleBeforeUpload"
                        :with-credentials="true"
                        @on-goto-add="uploadFileAdd"
                        @on-file-none="uploadFileNone"
                        :on-remove="handleRemove"
                        selfConfig
                        uploadAll>
                <h-button type="ghost" icon="ios-cloud-upload-outline" slot="chooseFile">{{$t('m.i.common.addAttach')}}</h-button>
                <h-button type="ghost" icon="ios-cloud-upload-outline" slot="postFile">{{$t('m.i.common.uploadAttach')}}</h-button>
              </h-upload>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
        <h-button type="primary" @click="resetForm()">{{$t("m.i.common.reset")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查询会员代码 -->
    <member-id-search :memberIdWin="memberIdQueryWin" @memberIdWinClose="memberIdQueryWinClose"
                      @memberIdWinSubmit="memberIdQueryWinSubmit"></member-id-search>
    <!-- 展示自由格式具体信息 -->
    <free-draft-info-view :freeDraftView="freeDraftInfoWin" :needInfoId="needInfoId"
                          @freeDraftInfoWinClose="freeDraftInfoClose"></free-draft-info-view>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "freeDraftInfoMain",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      FreeDraftInfoView: () => import(/* webpackChunkName: "shcpe/cpes/freedraft/freeDraftInfoView" */`@/views/bizViews/shcpe/cpes/freedraft/freeDraftInfoView`),
      MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`)

    },
    data() {
      return {
        formItem: {
          msgId: "",
          rcvMemberId: "",
          rcvBrchCode: "",
          respMemberName: "",
          respBrchName: "",
          minMsgTime: "",
          maxMsgTime: "",
          draftDate: ""
        },
        addOrEditForm: {
          id: "",
          applMemberId: "",
          applMemberName: "",
          applBrchCode: "",
          applBrchName: "",
          rcvMemberId: "",
          respMemberName: "",
          rcvBrchCode: "",
          respBrchName: "",
          content: "",
          attFile: "",
          attachId: ""
        },
        //给按钮增加权限
        authObj: {
          freeDraftSend: true,    //发起
          freeDraftView: true, //查看
          freeDraftSendAgain: true //再次发起
        },
        columns: [
          {
            title: " ",
            type: "radio",
            width: 60,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 60,
            hiddenCol: false
          },

          {
            title: "主键",
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.msgId'),
            key: "msgId",
            align: "center",
            hiddenCol: false
          },
          {
            title: "报文时间",
            key: "createDtTm",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.createDtTm && "" !== params.row.createDtTm) {
                let dttm = this.$moment(params.row.createDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                return h("span", dttm);
              }
            }
          },
          {
            title: "发出会员代码",
            key: "applMemberId",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "发出会员名称",
            key: "applMemberName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "发出机构代码",
            key: "applBrchCode",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "发出机构名称",
            key: "applBrchName",
            align: "center",
            sortable: true,
            hiddenCol: false

          },
          {
            title: "接收会员代码",
            key: "rcvMemberId",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "接收会员名称",
            key: "respMemberName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "接收机构代码",
            key: "rcvBrchCode",
            hiddenCol: true,
            align: "center"
          },
          {
            title: "接收机构名称",
            key: "respBrchName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "附件",
            key: "haveAttFile",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let flag = params.row.haveAttFile;
              if (flag === "0") {
                return h("span", "无");
              } else if (flag === "1") {
                return h("span", "有");
              }
            }
          },
          {
            title: this.$t("m.i.common.operStatus"),
            key: "sendStatus",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let flag = params.row.sendStatus;
              switch (flag) {
                case "1":
                  return h("span", "发送中");
                case "2":
                  return h("span", "发送成功");
                case "3":
                  return h("span", "发送失败");
                case "4":
                  return h("span", "已接收");
                case "5":
                  return h("span", "复核驳回");
                default :
                  return h("span", "");
              }
            }
          },
          {
            title: "处理结果",
            key: "errorMsg",
            hiddenCol: false,
            align: "center"

          }
        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        submitFlag: false,
        readonly: false,
        addOrEditWin: false,
        memberIdQueryWin: false,
        //showCpesBranchWin: false,
        //showCpesBranch: false,
        uploadList: [],
        currentSelectRow: null,
        moveUpDisabled: false,
        moveDownDisabled: false,
        tableRef: "selfTable",
        isFileUpdate: "0",//0-无文件 1-文件待上传 2-文件已上传
        type: null,
        optType: 1,
        isDisabled: true,
        needMemberId: "",
        freeDraftInfoWin: false,
        needInfoId: "",
        file: null,
        loadingStatus: false,
        ifShowMore: false,
        uploadURL: window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/freeDraftInfo/uploadFile",
        memberType:"",
        cpesBrchParams:{},
        memberTypeCode:""
      };
    },
    watch: {},

    computed: {},
    methods: {
      memberIdQueryWinClose() {
        this.memberIdQueryWin = false;
      },
      //根据弹框所选数据进行赋值
      memberIdQueryWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.memberType === 'search') {
          this.formItem.rcvMemberId = info.memberId;
          this.formItem.respMemberName = info.memberName;
        } else if (this.memberType === 'oper') {
          this.addOrEditForm.rcvMemberId = info.memberId;
          this.addOrEditForm.respMemberName = info.memberName;
          this.memberTypeCode = info.memberTypeCode;
          this.cpesBrchParams = {memberId: info.memberId, memberName: info.memberName};
          this.addOrEditForm.rcvBrchCode = "";
          this.addOrEditForm.respBrchName = "";
          if (this.memberTypeCode === 'MT05' || this.memberTypeCode === 'MT06'){
            this.addOrEditForm.rcvBrchCode = "0";
          }
        }
        this.memberIdQueryWin = false;
      },
      handleDraftDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minMsgTime = arr[0].replace(/-/g, "");
          this.formItem.maxMsgTime = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minMsgTime = "";
          this.formItem.maxMsgTime = "";
        }
      },
      handleSearch() {
        this.unDisabled();
        this.currentSelectRow = null;
        this.authObj.freeDraftSendAgain = true;
        this.$refs.datagrid.dataChange(1);
      },
      freeDraftInfoClose() {
        this.freeDraftInfoWin = false;
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.formItem.rcvMemberId = "";
        this.$refs.formItem.resetFields();
        this.formItem.rcvBrchCode = "";
        this.formItem.respBrchName = "";
      },
      //查询会员代码弹窗
      queryMemberId() {
        this.memberIdQueryWin = true;
        this.memberType = 'oper';
      },
      //查询会员代码弹窗
      queryMemberId2() {
        this.memberIdQueryWin = true;
        this.memberType = 'search';
      },
      respBrchNameChange(info){
        this.addOrEditForm.respMemberName = info[0].memberName;
        this.addOrEditForm.rcvMemberId = info[0].memberId;
      },
      // 行选中
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
        if (currentRow.sendStatus !== "5" && currentRow.sendStatus !== "3") {
          this.authObj.freeDraftSendAgain = true;
        } else {
          this.authObj.freeDraftSendAgain = false;
        }
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      showWin() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.freeDraftInfoWin = true;
        this.needInfoId = this.currentSelectRow.id;
      },
      // 新增/修改
      handleForm(str) {
        this.$nextTick(() => {
          this.uploadList = [];
          this.addOrEditForm.attachId = "";
          this.type = str;
          this.readonly = false;
          if (this.type === "modify") {
            if (!this.currentSelectRow) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
              return;
            }
            if (!this.currentSelectRow) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.readonly = true;
            let freeDraftInfoId = this.currentSelectRow.id;
            post({ id: freeDraftInfoId }, "/shcpe/cpes/freeDraftInfo/queryFreeDraftInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.addOrEditForm.id = res.data.retData.id;
                  this.addOrEditForm.applMemberId = res.data.retData.applMemberId;
                  this.addOrEditForm.applBrchCode = res.data.retData.applBrchCode;
                  this.addOrEditForm.rcvMemberId = res.data.retData.rcvMemberId;
                  this.addOrEditForm.rcvBrchCode = res.data.retData.rcvBrchCode;
                  this.addOrEditForm.content = res.data.retData.content;
                  this.addOrEditForm.fileSuffix = res.data.retData.fileSuffix;
                  this.addOrEditForm.applMemberName = res.data.retData.applMemberName;
                  this.addOrEditForm.applBrchName = res.data.retData.applBrchName;
                  this.addOrEditForm.respMemberName = res.data.retData.respMemberName;
                  this.memberTypeCode = res.data.retData.respMemberTypeCode;
                  this.addOrEditForm.respBrchName = res.data.retData.respBrchName;
                  this.addOrEditForm.attFile = res.data.retData.attFile;
                  this.addOrEditForm.attachId = res.data.retData.attachId;
                  this.addOrEditWin = true;
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            //返显会员、机构名称
            post({}, "/sm/auth/user/queryCurrentLoginInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retData = res.data.retData;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.addOrEditForm.id = "";
                  this.addOrEditForm.applMemberId = retData.memberId;
                  this.addOrEditForm.applBrchCode = retData.cepsBrchCode;
                  this.addOrEditForm.applMemberName = retData.memberName;
                  this.addOrEditForm.applBrchName = retData.brchName;
                  this.addOrEditForm.rcvMemberId = "";
                  this.addOrEditForm.respMemberName = "";
                  this.addOrEditForm.rcvBrchCode = "";
                  this.addOrEditForm.respBrchName = "";
                  this.addOrEditForm.content = "";
                  this.addOrEditForm.attFile = "";
                  this.addOrEditForm.attachId = "";
                  this.addOrEditWin = true;
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //新增修改页面提交
      formAdd() {
        debugger
        if (this.isFileUpdate === "1") {
          this.$msgTip.info(this, { info: "有文件没有上传，请上传后再次发送" });
          // this.$hMsgBox.confirm({
          //   title: "提示",
          //   content: "有文件没有上传，请上传后再次发送",
          //   okText: "确定",
          //   // onOk: () => {
          //   //   this.$hMsgBox.remove();
          //   // },
          //   onCancel: () => {
          //     return false;
          //   }
          // });
        } else {
          this.commitForm();
        }
      },
      commitForm() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = "/shcpe/cpes/freedraft/freeDraftInfoMain/func_freeDraftInfoApp";
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
                  this.$refs["addOrEditForm"].resetFields();
                  this.addOrEditWin = false;
                  this.resetForm();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = null;
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确" });
      },
      handleBeforeUpload() {
        this.uploadList = this.$refs.upload.fileList;
        const check = this.uploadList.length < 1;
        if (!check) {
          this.$msgTip.error(this, { info: "只能上传一个文件" });
        }
        return check;
      },
      handleMaxSize(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 太大" });
      },
      handleSucess(response, file, fileList) {
        if (response.retCode === "000000") {
          this.addOrEditForm.attachId = response.retData;
          this.$msgTip.success(this, { info: "文件上传成功" });
        } else {
          this.$msgTip.error(this, { info: response.retMsg });
        }
      },
      handleFileError(error, file, fileList) {
        this.$msgTip.error(this, { info: error });
      },
      closeAddOrEditForm() {
        this.needMemberId = "";
        this.$refs["addOrEditForm"].resetFields();
        this.addOrEditWin = false;
        this.resetForm();
      },
      resetForm() {
        this.addOrEditForm.rcvMemberId = "";
        this.addOrEditForm.respMemberName = "";
        this.addOrEditForm.rcvBrchCode = "";
        this.addOrEditForm.respBrchName = "";
        this.addOrEditForm.content = "";
        this.addOrEditForm.attachId = "";
        this.memberType = "";
        this.memberTypeCode = "";
        this.cpesBrchParams = {};
        this.$refs.upload.clearFiles();
      },
      uploadFileAdd(status) {
        if (status) {
          this.isFileUpdate = "1";
        } else {
          this.isFileUpdate = "0";
        }
      },
      handleRemove(file){
        // this.$hMessage.success(file.name+'已移除');
        this.$msgTip.success(this)
        this.addOrEditForm.attachId =null;
        this.isFileUpdate = "0";
      },
      uploadFileNone(status) {
        if (status === "success") {
          this.isFileUpdate = "2";
        } else {
          this.isFileUpdate = "0";
        }
      }
    }
  };
</script>

<style scoped>

</style>
