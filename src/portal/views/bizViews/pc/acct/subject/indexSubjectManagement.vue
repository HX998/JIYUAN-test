<style>

</style>
<!--科目维护 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="clearfix">
                  <h-form-item :label="$t('m.i.pc.subjectCode')" prop="subjectNo">
                    <h-input v-model="formItem.subjectNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.subjectName')" prop="subjectName">
                    <h-input v-model="formItem.subjectName" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item class="no-label">
                    <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/acct/subject/indexSubjectManagement/func_querySubject"
            :bindForm="formItem"
            row-select
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
        </div>
      </h-col>
    </h-row>

    <!--新增科目弹出框-->
    <h-msg-box width="400" v-model="addOrEditWin" class="h-form-search-layer" @on-close="cancleWin">
      <!--自定义页头，根据类型显示-->
      <p slot="header">
        <span v-if="type=='add'">{{$t("m.i.common.add")}}</span>
        <span v-if="type=='modify'">{{$t("m.i.common.modify")}}</span>
      </p>
      <!--表单主体-->
      <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">
        <h-form-item :label="$t('m.i.pc.subjectCode')" prop="subjectNo" :required="this.isRequired">
          <h-input v-if="type=='modify'" readonly :value="addForm.subjectNo" :title="addForm.subjectNo"></h-input>
          <h-input v-else v-model="addForm.subjectNo" :maxlength=20></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.pc.subjectName')" prop="subjectName" :required="this.isRequired">
          <h-input v-model="addForm.subjectName" :maxLength="20"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.pc.subjectType')" prop="subjectType" :required="this.isRequired">
          <h-select v-model="addForm.subjectType" showTitle placeholder="">
            <h-option v-for="item in subjectTypeList" :value="item.value" :key="item.value">{{ item.label }}
            </h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.pc.subjectDesc')" prop="subjectDesc" class="h-form-height-auto">
          <h-input v-model="addForm.subjectDesc" type="textarea" :rows="2" :maxlength=1000></h-input>
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
    name: "indexSubjectManagement",
    data() {
      return {
        //查询弹出页面的几个属性
        isShowAdd: false, //页面是否显示
        //更新弹出页面的几个属性
        isShowModify: false, //页面是否显示
        //弹窗的统一属性
        addOrEditWin: false, //弹窗value
        //科目类型下拉列表
        subjectTypeList: [
          {
            value: "1",
            label: "1"
          },
          {
            value: "2",
            label: "2"
          },
          {
            value: "3",
            label: "3"
          },
          {
            value: "4",
            label: "4"
          }
        ],
        //表单
        formItem: {
          id: "",
          subjectNo: "",
          subjectName: "",
          subjectType: "",
          subjectDesc: ""
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
            width: 60,
            type: "index",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.pc.subjectCode"),
            key: "subjectNo",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.pc.subjectName"),
            key: "subjectName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.subjectDesc"),
            key: "subjectDesc",
            hiddenCol: false,
            sortable: false
          }],
        //用于添加和更新的表单
        addForm: {
          id: "",
          subjectNo: "",
          subjectName: "",
          subjectType: "",
          subjectDesc: ""
        },
        //已经选中的列表数据，列表中每一个元素即是一行
        currentSelectList: [],
        //提交标志，一个请求正在提交的时候会设为false
        submitFlag: false,
        //控制层所在的url
        reqUrl: "/pc/acct/subject"
      };
    },
    components: {},
    methods: {
      //提交查询
      formSearch() {
        this.currentSelectList = []
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
            this.addForm.subjectNo = newRow.subjectNo;
            this.addForm.subjectName = newRow.subjectName;
            this.addForm.subjectDesc = newRow.subjectDesc;
            this.addForm.subjectType = newRow.subjectType;
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
            this.addForm.subjectNo = this.currentSelectList[0].subjectNo;
            this.addForm.subjectName = this.currentSelectList[0].subjectName;
            this.addForm.subjectType = this.currentSelectList[0].subjectType;
            this.addForm.subjectDesc = this.currentSelectList[0].subjectDesc;
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
            let url = this.type === "modify" ? this.reqUrl + "/indexSubjectManagement/func_modifySubject" : this.reqUrl + "/indexSubjectManagement/func_addSubject";
            this.submitFlag = true;
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
              this.handledel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      //提交删除请求
      handledel() {
        let url = this.reqUrl + "/indexSubjectManagement/func_deleteSubject";
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
    },
    mounted() {
      //数据字典，这里没有用到，留着做拓展
      this.getDictListByGroups("SubjectType").then(res => {
        /*this.subjectTypeList = res.get("SubjectType");*/
        this.dictMap = res.get("map");
      });
    }
  };
</script>
