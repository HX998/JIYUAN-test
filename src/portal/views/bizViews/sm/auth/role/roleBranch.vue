<template>
  <h-msg-box v-model="tempRoleBranchWin" width="1000" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize" >
    <p slot="header">
      <span>{{$t("m.i.common.view")}}【{{title}}】机构</span>
    </p>
    <div class="h-tree-search" ref="roleBrch">
      <!--弹出框模式标题-->
      <div class="h-modal-header-wrapper">
        <h-row name="flex" class="layout-menu-wrapper">
          <h-col span="24">
            <div>
              <!--数据展示表格-->
              <h-row>
                <h-col span="24">
                  <h-datagrid
                    :columns="columns"
                    highlight-row
                    :url="'/sm/auth/role/roleBranch/func_queryBranchBySysRole'"
                    :bindForm="formItem"
                    :onRowClick="handlelRowClick"
                    :onSelectChange="handleSelectClick"
                    ref="datagrid">
                    <div slot="toolbar" class="pull-left">
                      <h-button type="primary" @click="exportExcel()">{{$t('m.i.common.export')}}</h-button>
                    </div>
                  </h-datagrid>
                </h-col>
              </h-row>
            </div>
          </h-col>
        </h-row>
      </div>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </h-msg-box>
</template>

<script>
  import { post,on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "roleBranch",
    components: {},
    props: {
      title: String,
      roleId: {
        type : [String, Number],
        default: ""
      },
      roleName: String,
      showRoleBranchWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false,
            sortable: true
          }
        ],
        formItem: {
          roleName: "",
          roleId: ""
        }
      };
    },
    watch: {
      showRoleBranchWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.roleId = this.roleId;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempRoleBranchWin: {
        get() {
          return this.showRoleBranchWin;
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
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
      },
      handleClose() {
        this.$emit("roleBranchWinClose", "");
      },
      //导出
      exportExcel() {
        this.param = 'branchRoleExport';
        this.rows = this.$refs.datagrid.total;
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/sm/auth/role/roleBranch/func_exportData";
        if(exportType === "1"){
          let params = { roleId: this.roleId, field: field, exportType: exportType, excelName: this.param};
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

          let input = document.createElement('input');
          input.type = 'text';
          input.name = 'roleId';
          input.value = this.roleId;
          form.appendChild(input);
          let input1 = document.createElement('input');
          input1.type = 'text';
          input1.name = 'roleName';
          input1.value = this.roleName;
          form.appendChild(input1);
          let input2 = document.createElement('input');
          input2.type = 'text';
          input2.name = 'field';
          input2.value = field;
          form.appendChild(input2);
          let input3 = document.createElement('input');
          input3.type = 'text';
          input3.name = 'exportType';
          input3.value = exportType;
          form.appendChild(input3);
          let input4 = document.createElement('input');
          input4.type = 'text';
          input4.name = 'excelName';
          input4.value = this.param;
          form.appendChild(input4);

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
