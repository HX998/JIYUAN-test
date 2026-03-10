<template>
  <div class="layout">
  <h-msg-box v-model="showUserWinTmp" :mask-closable="false" class="h-form-table-layer" width="1000" @on-close="handleClose"
    :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{$t('m.i.common.view')}}【{{title}}】用户</span>
    </p>
    <div>
      <!--查询表单-->
      <div class="h-form-search-box">
        <h-panel class="clearfix">
          <h-form :model="formItem" :label-width="60" ref="formItem" cols="4" class="h-form-search">
            <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"
                         title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
            </show-branch>
            <h-form-item class="h-form-operate" >
              <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <!--数据展示表格-->
      <h-datagrid :columns="columns" highlight-row :bindForm="formItem" :autoLoad="false" url="/sm/auth/branchTemporaryRole/queryUserByBranchRole"
        :onRowClick="handlelRowClick" :onSelectChange="handleSelectClick" ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="exportExcel()">{{$t('m.i.common.export')}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t('m.i.common.close')}}</h-button>
    </div>
  </h-msg-box>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>
<script>
import { post, on, off } from "@/api/bizApi/commonUtil";

export default {
  name: "branchRoleUser",
  components: {

  },
  props: {
    title: String,
    showUserWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    roleId: 0,
  },
  data() {
    let options = {};
    let columns = [
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
      },
      {
        title: this.$t('m.i.common.userName'),
        key: "userName",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.common.userNo'),
        key: "userNo",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.auth.brchName'),
        key: "brchName",
        hiddenCol: false
      },
      {
        title: this.$t('m.i.common.brchNo'),
        key: "brchNo",
        hiddenCol: false
      },
    ];
    let formItem = {
      id: '',
      branchName:JSON.parse(window.sessionStorage.getItem("userInfo")).brchName,
      //brchRange:'1',
      brchNos:JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo,
    };
    let brchRangeList = [
      {
        value: '1',
        label: '本机构'
      },{
        value: '2',
        label: '全辖'
      }
    ];
    options.brchRangeList = brchRangeList;
    options.columns = columns;
    options.formItem = formItem;
    options.submitWin = false;
    options.currentSelectRow = [];
    options.currentSelectList = [];
    options.currentSelectRowInx = [];
    options.tempShowExcelTemplateWin = false;
    options.param = null;
    options.rows = null;
    return options;
  },
  watch: {
    showUserWin(val) {
      if (val === true) {
        this.$nextTick(() => {
          this.formItem.id=this.roleId;
          this.$refs.datagrid.dataChange(1);
        });
      }
    }
  },

  computed: {
    showUserWinTmp: {
      get() {
        return this.showUserWin;
      },
      set() {
      }
    }
  },
  methods: {
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    handlelRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handleSelectClick(arr, selectInx) {
      this.currentSelectList = arr;
      this.currentSelectRowInx = selectInx
      if (arr.length == 0) return
    },
    handleClose() {
      this.formSearchReset();
      this.$emit("showUserWinClose", "");
    },
    formSearch() {
      this.currentSelectRow = [];
      this.currentSelectList = [];
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.formItem.brchNos=JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
      this.formItem.branchName=JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
      this.$refs.formItem.resetFields();
    },
    //导出
    exportExcel() {
      this.param = 'branchRoleUserExport';
      this.rows = this.$refs.datagrid.total;
      this.tempShowExcelTemplateWin = true;
    },
    //清单导出
    exportList(field, exportType){
      //exportType: 0-同步 1-异步
      let url = window.LOCAL_CONFIG.API_HOME + "/sm/auth/branchTemporaryRole/branchTemporaryRole/func_exportBrchRoleUser";
      if(exportType === "1"){
        let params = { id: this.formItem.id,brchNos : this.formItem.brchNos, field: field, exportType: exportType, excelName: this.param};
        post(params, url).then(res => {
          if(res.status === 200 && res.data === null){
            this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          }else if(res.status === 200 && res.data === ""){
            this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
          } else{
            this.$msgTip.error(this, { info: "异步导出失败" });
          }
        });
      }else {
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");

        let input1 = document.createElement('input');
        input1.type = 'text';
        input1.name = 'id';
        input1.value = this.formItem.id;
        form.appendChild(input1);
        let input2 = document.createElement('input');
        input2.type = 'text';
        input2.name = 'brchNos';
        input2.value = this.formItem.brchNos;
        form.appendChild(input2);
        let input3 = document.createElement('input');
        input3.type = 'text';
        input3.name = 'brchRange';
        //input3.value = this.formItem.brchRange;
        form.appendChild(input3);
        let input4 = document.createElement('input');
        input4.type = 'text';
        input4.name = 'field';
        input4.value = field;
        form.appendChild(input4);
        let input5 = document.createElement('input');
        input5.type = 'text';
        input5.name = 'exportType';
        input5.value = exportType;
        form.appendChild(input5);
        let input6 = document.createElement('input');
        input6.type = 'text';
        input6.name = 'excelName';
        input6.value = this.param;
        form.appendChild(input6);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    }
  },
};
</script>
<style scoped>

</style>
