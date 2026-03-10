<template>
  <div class="layout">
    <!-- 数据展示表格 -->
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          highlight-row=""
          url="/pc/acct/subjectconfig/indexSubjectConfig/func_querySubjectConfig"
          :bindForm="formItem"
          :row-select="true"
          ref="datagrid">
          <div slot="toolbar" class='pull-left'>
            <h-button type="primary" @click="handleAddForm('add')">
              {{$t("m.i.common.add")}}
            </h-button>
            <h-button type="primary" @click="handleAddForm('modify')">
              {{$t("m.i.common.modify")}}
            </h-button>
            <h-button type="primary" @click="handleDelete()">
              {{$t("m.i.common.delete")}}
            </h-button>

          </div>
        </h-datagrid>
      </h-col>
    </h-row>
    <h-msg-box width="400" v-model="addOrEditWin"  class="h-form-search-layer" @on-close="cancleWin">
      <!--自定义页头，根据类型显示-->
      <p slot="header">
        <span v-if="type=='add'">{{$t("m.i.common.add")}}</span>
        <span v-if="type=='modify'">{{$t("m.i.common.modify")}}</span>
      </p>
      <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">
        <h-form-item :label="$t('m.i.pc.insubjectNo')" prop="insubjectNo" :required="isRequired" :validRules="subjectNoRule">
          <h-input v-model="addForm.insubjectNo" :maxlength=20  placeholder=""></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.pc.outsubjectNo')" prop="outsubjectNo" :required="isRequired" :validRules="subjectNoRule">
          <h-input v-model="addForm.outsubjectNo" :maxlength=20  placeholder=""></h-input>
        </h-form-item>
      </h-form>
      <!--自定义页尾-->
      <div slot="footer">
        <h-button type="ghost" @click="cancleWin()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexSubjectConfig",
    data() {
      return {
        //查询弹出页面的几个属性
        isShowAdd: false,//页面是否显示
        //更新弹出页面的几个属性
        isShowModify: false,//页面是否显示
        //弹窗的统一属性
        addOrEditWin: false,//弹窗value
        //表单
        formItem: {
          id: "",
          brchNo: "",
          legalNo: "",
          insubjectNo: "",
          outsubjectNo: "",
          createTime: "",
          updateTime: ""
        },
        //操作类型
        type: null,
        //是否只读
        readonly: false,
        //是否必填
        isRequired: true,
        //数据显示表格的列
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            width: 100,
            type: "index",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.pc.insubjectNo"),
            key: "insubjectNo",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.pc.outsubjectNo"),
            key: "outsubjectNo",
            hiddenCol: false,
            sortable: false
          }
        ],
        //用于添加和更新的表单
        addForm: {
          id: "",
          insubjectNo: "",
          outsubjectNo: ""
        },
        //已经选中的列表数据，列表中每一个元素即是一行
        currentSelectList: [],
        tempInx: 0,
        //提交标志，一个请求正在提交的时候会设为false
        submitFlag: false,
        subjectNoRule: [{ test: /^[0-9]{1,20}$/, trigger: "blur", message: "科目号由不超过20位数字组成"}],
      };
    },
    components: {},
    methods: {
      //提交查询
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单数据
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //判断是否继续
      isAllowContinue() {
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          if (list.length === 1) {
            return true;
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return false;
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }
      },
      //新增或修改操作
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.type === "modify" && this.isAllowContinue()) {
          this.$nextTick(() => {
            let newRow = this.currentSelectList[0];
            this.addForm.id = newRow.id;
            this.addForm.insubjectNo = newRow.insubjectNo;
            this.addForm.outsubjectNo = newRow.outsubjectNo;
            this.readonly = true;
          });
        } else if (this.type !== "add") {
          this.addFormReset();
          return;
        } else {
          this.addFormReset();
        }
        this.addOrEditWin = true;
      },
      //重置添加或修改表单
      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.id = "";
          if (this.type === "modify" && this.isAllowContinue()) {
            this.addForm.id = this.currentSelectList[0].id;
            this.addForm.insubjectNo = this.currentSelectList[0].insubjectNo;
            this.addForm.outsubjectNo = this.currentSelectList[0].outsubjectNo;
          }
        });
      },
      //取消表单操作
      cancleWin() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
        this.addOrEditWin = false;
      },
      //添加或修改表单提交请求
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "modify" ? "/pc/acct/subjectconfig/indexSubjectConfig/func_modifySubjectConfig" : "/pc/acct/subjectconfig/indexSubjectConfig/func_insertSubjectConfig";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "modify" ? this.$refs.datagrid.pageInfo.pageNo : 1;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //删除操作
      handleDelete() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      //提交删除请求
      handleDel() {
        let url = "/pc/acct/subjectconfig/indexSubjectConfig/func_deleteSubjectConfig";
        let ids = this.$refs.datagrid.selectIds.join(",");
        post({ ids: ids }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.currentSelectList = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>
