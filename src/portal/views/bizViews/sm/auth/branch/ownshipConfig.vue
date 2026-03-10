<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"
                               :title="$t('m.i.common.brchName')" :showCheckBox="true" :brchNo.sync="formItem.brchNos"
                               :brchName.sync="formItem.brchNames"></show-branch>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch">{{ $t("m.i.common.search") }}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{ $t("m.i.common.reset") }}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/auth/branch/ownshipConfig/func_queryBranchWithOwnership"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="selectOwnershipBrch()">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @on-click="downloadModel()">{{$t("m.i.common.importTemplateDownload")}}</h-button>
              <h-button type="primary" @on-click="batchImport()">{{$t("m.i.common.batchImport")}}</h-button>
              <h-button type="primary" @on-click="deleteOwnershipBrch()">{{$t("m.i.common.delete")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 机构名称选择弹窗框 -->
    <common-tree :commonTreeWin="showBranchWin" title="权属机构选择" url="/sm/auth/branch/queryAllBranchTree"
                 :required="true" :isShowRadioIcon="true"
                 @treeSelectedChange="brchNoChange" @commonTreeWinClose="showBrchWinClose">
    </common-tree>

    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importWinClose"></common-file-upload>
  </div>
</template>

<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "ownshipConfig",
  data() {
    let importColumns = [
      {
        type: "index",
        title: this.$t("m.i.common.index"),
        align: "center",
        width: 60,
        hiddenCol: false
      },
      {
        title: this.$t('m.i.common.brchName'),
        key: "brchName",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t('m.i.common.cpesBrchCode'),
        key: "cpesBrchCode",
        hiddenCol: false,
        sortable: true
      },
      {
        title: this.$t('m.i.common.brchNo'),
        key: "brchNo",
        hiddenCol: false,
      },
      {
        title: this.$t('m.i.billInfo.ownershipBrchNo'),
        key: "ownershipBrchNo",
        hiddenCol: false,
      }
    ];
    return {
      formItem: {
        brchNos: "",
        brchNames: "",
      },
      fileParams: {
        loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/sm/auth/branch/ownshipConfig/func_batchImportValidate",  //导入excel数据解析接口
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/sm/auth/branch/ownshipConfig/func_editOwnershipBranch",  //excel数据导入接口
        formItem: {},           //请求表格数据时附带参数
        uploadParams: {},       //调用excel数据解析接口时附带的额外参数
        extraGridDatas: {},     //需在反显数据中额外添加的字段
        columns: importColumns,
        paramKey: "branchDtoList"         //后台接收对应key
      },
      params: {
        brchList: [],
      },
      columns: [
        {
          type: "selection",
          hiddenCol: false,
          width: 60,
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
          title: this.$t('m.i.common.brchName'),
          key: "brchName",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.cpesBrchCode'),
          key: "cpesBrchCode",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.brchNo'),
          key: "brchNo",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.ownershipCpesBrchName'),
          key: "ownershipBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.ownershipBrchCode'),
          key: "ownershipBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.ownershipBrchNo'),
          key: "ownershipBrchNo",
          hiddenCol: false,
        }
      ],
      importWin: false,
      showBranchWin: false,
    };
  },
  methods: {
    handleSearch() {
      this.$refs.datagrid.dataChange(1);
    },
    resetSearch() {
      this.$refs.formItem.resetFields();
    },
    selectOwnershipBrch() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.params.brchList = this.$refs.datagrid.selects;
      this.showBranchWin = true;
    },
    showBrchWinClose() {
      this.params.brchList = [];
      this.showBranchWin = false;
    },
    downloadModel() {
      let form = document.createElement("form");
      let url = window.LOCAL_CONFIG.API_HOME + "/sm/auth/branch/ownshipConfig/func_downloadModel";
      form.setAttribute("id", "formId");
      form.setAttribute("action", url);
      form.setAttribute("method", "post");
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    batchImport() {
      this.importWin = true;
    },
    importWinClose() {
      this.importWin = false;
      this.$refs.datagrid.dataChange(1);
    },
    deleteOwnershipBrch() {
      debugger;
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      let branchDtoList = this.$refs.datagrid.selects;
      for (let i = 0 ; branchDtoList.length > i ; i++) {
        branchDtoList[i].ownershipBrchNo = "";
      }
      this.editOwnershipBranch(branchDtoList);
    },
    brchNoChange: function (selectedBrchNo) {
      let ownershipBrch = selectedBrchNo[0];
      let branchDtoList = this.$refs.datagrid.selects;
      let brchCodes = [];
      for (let i = 0; branchDtoList.length > i; i++) {
        branchDtoList[i].ownershipBrchNo = ownershipBrch.id;
        brchCodes.push(branchDtoList[i].cpesBrchCode);
      }
      this.$hMsgBox.confirm({
        title: "确认",
        content: "请确认票交所客户端已维护机构代码[" + brchCodes.toString() + "]对应的贴现权属机构号" + ownershipBrch.id + ",机构代码" + ownershipBrch.extParam.cpesBrchCode + "是否一致",
        zIndex: 9999,
        onOk: () => {
          this.editOwnershipBranch(branchDtoList);
          this.showBrchWinClose();
        },
        onCancel: () => {
          return;
        }
      });
    },
    editOwnershipBranch(branchDtoList) {
      post({branchDtoList: branchDtoList}, "/sm/auth/branch/ownshipConfig/func_editOwnershipBranch").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, {info: msg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
        }
      });
    }
  },
}
</script>

<style scoped>

</style>
