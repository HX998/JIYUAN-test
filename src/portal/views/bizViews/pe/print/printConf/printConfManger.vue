<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="voucherType" :label="$t('m.i.pc.voucherType')">
                  <h-select v-model="formItem.voucherType" placeholder="">
                    <h-option v-for="item in voucherTypeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pe/print/printConf/printConfManger/queryPrintConfPage"
            :bindForm="formItem"
            :onCurrentChange="handlelRowClick"
            :onCurrentChangeCancel="cancelSel"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handleAddForm('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleAddForm('edit')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="handleDelete()">{{$t("m.i.common.delete")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--新增、编辑模板-->
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <h-msg-box v-model="addOrEditWin" width="500" :maximize="true">
          <p slot="header">
            <span v-if="type=='add'">新增配置</span>
            <span v-if="type=='edit'">修改配置</span>
          </p>
          <h-panel>
            <h-form :model="addForm" :label-width="80" ref="addForm">
              <h-row>
                <h-col span="20">
                  <h-form-item :label="$t('m.i.pc.voucherType')" prop="voucherType" :required="isRequired">
                    <h-select v-model="addForm.voucherType">
                      <h-option v-for="item in voucherTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                </h-col>
              </h-row>
              <h-row type="flex" align="middle">
                <h-col span="20">
                  <h-form-item :label="$t('m.i.pe.confContent')" prop="confContent" :required="isRequired">
                    <h-input v-model="addForm.confContent"></h-input>
                  </h-form-item>
                </h-col>
                <h-col span="4">
                    <h-button type="primary" @click="importConf()">{{$t("m.i.common.import")}}</h-button>
                </h-col>
              </h-row>
              <h-row>
                <h-col span="20">
                  <h-form-item :label="$t('m.i.common.remark')" prop="tempConfRemark">
                    <h-input v-model="addForm.tempConfRemark" type="textarea" :maxlength="256" :canResize="false"></h-input>
                  </h-form-item>
                </h-col>
              </h-row>
            </h-form>
          </h-panel>
          <div slot="footer" v-if="type!='view'">
            <h-button type="ghost" style="margin:0 8px" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}
            </h-button>
            <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
            <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
          </div>
          <div slot="footer" v-else>
            <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>
    <!--导入配置模板弹窗-->
    <h-msg-box v-model="fileWin" width="1000" class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span>文件选择</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        :columns="fileColumns"
        :autoLoad="false"
        highlight-row
        url= "/pe/print/printConf/printConfManger/queryPrintFileFromHome"
        :bindForm="addForm"
        :onCurrentChange="handlelRowClickFile"
        :onCurrentChangeCancel="cancelSelFile"
        ref="fileDatagrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="closeWin()">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" @click="importTemplate()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  import ShowControlLog from "../../../pc/credit/showControlLog";

  export default {
    name: "printConfManger",
      components: {ShowControlLog},
      data() {
      return {
        printConfRow: null,
        reqUrl: "/pe/print/printConf/printConfManger",
        type: "add",
        dictMap: [],
        ifShowMore: false,
        isRequired: false,
        voucherTypeList: [],
        addOrEditWin: false,
        submitFlag: false,
        fileWin :false,
        fileSelectRow:[],
        formItem: {
          voucherType: null
        },
        addForm: {
          id: "",
          voucherType: "",
          custAppId: "",
          confContent: "",
          tempConfRemark: ""
        },
        columns: [
          {
            title: " ",
            type: "radio",
            width: 60,
            align: "center",
            hiddenCol: false
          }, {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.pc.voucherType"),
            key: "voucherType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "VoucherType", params.row.voucherType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          }, {
            title: this.$t("m.i.pe.creatorNo"),
            key: "creatorNo",
            hiddenCol: false
          }, {
            title: this.$t("m.i.pe.confContent"),
            key: "confContent",
            hiddenCol: false
          }, {
            title: this.$t("m.i.pe.tempConfRemark"),
            key: "tempConfRemark",
            hiddenCol: false
          }
        ],
        fileColumns: [
            {
                title: " ",
                type: "radio",
                width: 60,
                align: "center",
                hiddenCol: false
            }, {
                title: this.$t("m.i.common.index"),
                type: "index",
                width: 60,
                align: "center",
                hiddenCol: false
            },
            {
                title: this.$t("m.i.common.fileName"),
                key: "fileName",
                hiddenCol: false
            }
        ],
      };
    },
    methods: {
      // 选中一条记录
      handlelRowClick(arr) {
        this.printConfRow = arr;
      },
      //取消选中
      cancelSel() {
        this.printConfRow = null;
      },
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type == "edit" || this.type == "copy") {
          if (!this.printConfRow) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$nextTick(() => {
            this.addForm = {
              id: this.printConfRow.id,
              voucherType: this.printConfRow.voucherType,
              custAppId: this.printConfRow.custAppId,
              creatorNo: this.printConfRow.creatorNo,
              confContent: this.printConfRow.confContent,
              tempConfRemark: this.printConfRow.tempConfRemark
            };
          });
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      // 表单提交
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type == "add" ? this.reqUrl + "/addTempConf" : this.reqUrl + "/updatePrintConf";
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.printConfRow = null;
                  this.addFormReset();
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed") + res.data.retMsg });
                  this.$refs.datagrid.dataChange(pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
        // 选中一条记录
        handlelRowClickFile(arr) {
            this.fileSelectRow = arr;
        },
        //取消选中
        cancelSelFile() {
            this.fileSelectRow = null;
        },
        importConf(){
          if(this.addForm.voucherType == '' || this.addForm.voucherType == null){
              this.$msgTip.info(this, { info: '请先选择凭证类型！' });
              return
          }
          this.fileWin = true;
          this.$nextTick(() => {
            this.$refs.fileDatagrid.dataChange(1);
          });
        },
        importTemplate() {
            let url = this.reqUrl + "/importPrintConf";
            post({ fileName : this.fileSelectRow.fileName}, url).then(res => {
                if (res) {
                    let retData = res.data.retData;
                    if (res.data.retCode === "000000") {
                        this.$msgTip.success(this);
                        this.fileWin = false;
                        this.addForm.confContent = retData.confContent;
                    } else {
                        this.$msgTip.error(this, { info: this.$t("m.i.common.importFailed") + "," + res.data.retMsg });
                    }
                } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.importFailed") });
                }
                this.$refs.fileDatagrid.tData = [];
            });
        },
        closeWin(){
          this.fileWin = false;
          this.$refs.fileDatagrid.tData = [];
        },
      // 清空表单
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$nextTick(() => {
          this.$refs.formItem.resetFields();
        });
      },
      handleDelete() {
        if (!this.printConfRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let url = this.reqUrl + "/delPrintConf";
        this.$hMsgBox.confirm({
          title: "删除配置",
          content: "是否删除配置？",
          onOk: () => {
            post({ id: this.printConfRow.id }, url).then(res => {
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.printConfRow = null;
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed") + res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      }
    },
    mounted() {
      this.getDictListByGroups("VoucherType").then(res => {
        this.voucherTypeList = res.get("VoucherType");
        this.dictMap = res.get("map");
      });
    }

  };
</script>
