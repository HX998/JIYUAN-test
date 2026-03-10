<style>

</style>
<!--柜员白名单管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.userNo')" prop="userNo">
                  <h-input v-model="formItem.userNo" :maxlength="20"></h-input>
                </h-form-item>
                <show-branch v-model="formItem.brchName"  :label="$t('m.i.common.brchName')"  prop="brchName"
                             :showCheckBox="false" :brchNo.sync="formItem.brchNo"    :brchName.sync="formItem.brchName"></show-branch>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      url="/sm/auth/whiteroll/userWhiteRoll/func_pageQueryUserWhiteRoll"
                      :bindForm="formItem"
                      highlight-row
                      :rowSelect=true
                      :hasSelect=false
                      ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handleAddForm('add')"> {{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleDelete()">{{$t("m.i.common.delete")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :maximize="true" @on-close="handleWinClose">
      <p slot="header">
        <span v-if="type=='add'">新增日终柜员白名单</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.userNo')" prop="userNo" :required="isRequired" >
            <h-input v-model="addForm.userNo" :maxlength=20   icon="android-search"
                     @on-click="queryUserNo('query')" readonly></h-input >
          </h-form-item>
          <h-form-item :label="$t('m.i.common.userName')" prop="userName" :required="isRequired" >
            <h-input v-model="addForm.userName"  readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo" :required="isRequired" >
            <h-input :value="addForm.brchNo"  readonly :placeholder="''"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName" :required="isRequired" >
            <h-input :value="addForm.brchName"  readonly :placeholder="''"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="handleWinClose">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <show-user-no :userNoSearchWin="userNoSearchWin" @userNoSearchClose="userNoSearchClose" @userNoSearchChange="userNoSearchChange"
                  :legalNo=this.legalNo :userType="3"
    ></show-user-no>
  </div>
</template>
<script>
  import { post, on, off, bempConfirm  } from "@/api/bizApi/commonUtil";

  export default {
    name: "userWhiteRoll",
    data() {
      return {
        showIcon:true,//是否显示机构组件的放大镜图标
        formItem: {
          brchNo: "",
          brchName:"",
          userNo:"",
          userName: "",
        },

        type: null,
        addOrEditWin: false,
        userNoSearchWin : false,
        readonly: false,
        isRequired: true,
        addForm: {
          brchNo: "",
          brchName:"",
          userName:"",
          userNo:"",
        },
        columns: [
          {
            type: "selection",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center",
            hiddenCol: false,
            width: 50
          },
          {
            title: this.$t('m.i.common.userNo'),
            key: "userNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.userName'),
            key: "userName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        legalNo : JSON.parse(window.sessionStorage.getItem('userInfo')).legalNo,
        userNoRule: [{ test: /^[a-zA-Z0-9]{1,20}$/, trigger: "blur", message: "用户号应小于等于20位数字或字母组成" }],
        deletDisabled: false,
        submitFlag: false,
        reqUrl: "/sm/auth/whiteroll/userWhiteRoll",
      };
    },
    watch: {
    },
    components:{},
    computed: {},
    methods: {
      handleWinClose(){
        this.showIcon=true
        this.readonly = false;
        this.addOrEditWin=false
      },
      // // 选中一条记录
      // handlelRowClick(arr) {
      //   let temp = [];
      //   temp.push(arr);
      //   this.currentSelectRow = temp;
      // },
      // //取消选中
      // cancelSel() {
      //   this.currentSelectRow = [];
      // },
      formSearch() {
        // this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },

      formSearchReset() {
        this.$nextTick(() => {
          this.$refs.formItem.resetFields();
          this.formItem.brchNo="";
          this.formItem.brchName="";
          this.formItem.userNo="";
          this.formItem.userName="";
        });
      },
      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.brchNo="";
          this.addForm.brchName="";
          this.addForm.userNo="";
          this.addForm.userName="";
        });
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addFormReset();
        this.addOrEditWin = true;
      },
      // handleSelectClick(arr, selectInx) {
      //   this.currentSelectList = arr;
      //   this.currentSelectRowInx = selectInx;
      //   if (arr.length == 0) return;
      // },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.reqUrl + "/func_addUserWhiteRollInfo";
            let msg = this.$t("m.i.common.actionSuccess");
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  // this.$hMessage.success(msg);
                  this.$msgTip.success(this);
                  this.handleWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  // this.currentSelectRow = [];
                  // this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed") + "，" +res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }

            });

          }
        });

      },
      handleDelete() {
        // let list = this.currentSelectRow;
        let list = this.$refs.datagrid.selectIds;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmDelete') + '?',
            onOk: () => {
              this.handleDel();
            }
          })
        } else {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseOneData')});
        }

      },
      handleDel(){
        let list = this.$refs.datagrid.selectIds;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i];
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ids: ids}, this.reqUrl + "/func_deleteUserWhiteRollInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(1);
              this.selectReset();
            } else {
              this.$msgTip.error(this, {info: this.$t('m.i.common.deleteFailed') + res.data.retMsg})
              this.$refs.datagrid.dataChange(1)
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
          }
        });
      },
      // 查询法人编号弹窗
      queryUserNo() {
        console.log(this.legalNo);
        this.userNoSearchWin = true;
      },
      //根据弹框所选数据进行赋值
      userNoSearchChange(info) {
        this.addForm.brchNo=info.brchNo;
        this.addForm.brchName=info.brchName;
        this.addForm.userNo=info.userNo;
        this.addForm.userName=info.userName;
        this.userNoSearchWin = false;
      },
      userNoSearchClose() {
        this.userNoSearchWin = false;
      },
    },
    mounted() {
    },
    created() {
    }
  };
</script>
