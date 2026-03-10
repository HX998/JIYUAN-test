<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pe.templateCnName')" prop="templateCnName">
                  <h-input v-model="formItem.templateCnName" :maxLength="30"></h-input>
                </h-form-item>
                <show-branch v-model="formItem.brchNo" :label="$t('m.i.common.brchName')" prop="brchNo" :showCheckBox="false"
                             title="机构名称" :brchNo.sync="formItem.brchNo" :brchName.sync="formItem.brchName">
                </show-branch>
                <h-form-item prop="voucherType" :label="$t('m.i.pc.voucherType')">
                  <h-select v-model="formItem.voucherType" placeholder="">
                    <h-option v-for="item in voucherTypeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-input v-model="formItem.prodNo" style="display:none"></h-input>
                <h-form-item :label="$t('m.i.common.prodName')" prop="prodName">
                  <h-input v-model="formItem.prodName" readonly icon="android-search"
                           @on-click="queryProductName('query')" clearable @on-clear="clearProdName('query')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                 <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                 :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>

                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pe/print/tempConf/tempConfManger/queryTempConfList"
            :bindForm="formItem"
            :onCurrentChange="handlelRowClick"
            :onCurrentChangeCancel="cancelSel"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handleAddForm('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleConfig()">{{$t("m.i.pe.templateDesign")}}</h-button>
              <h-button type="primary" @click="handleAddForm('edit')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="handleAddForm('copy')">{{$t("m.i.pc.copy")}}</h-button>
              <h-button type="primary" @click="handleDelete()">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="handleImport()">{{$t("m.i.pe.templateImport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--新增、编辑模板-->
    <h-msg-box v-model="addOrEditWin" width="400"  class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增模板</span>
        <span v-if="type=='edit'">修改模板</span>
        <span v-if="type=='copy'">复制模板</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" class="h-form-search">
          <h-form-item :label="$t('m.i.pe.templateCnName')" prop="templateCnName" :required="isRequired">
            <h-input :value="addForm.templateCnName" v-model="addForm.templateCnName"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.voucherType')" prop="voucherType" :required="isRequired">
            <h-select v-if="type=='edit'||type=='copy'" v-model="addForm.voucherType" readonly>
              <h-option v-for="item in voucherTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.voucherType">
              <h-option v-for="item in voucherTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-input v-model="addForm.prodNo" style="display:none"></h-input>
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodName">
            <h-input v-model="addForm.prodName" readonly icon="android-search"
                     @on-click="queryProductName('edit')" clearable @on-clear="clearProdName('edit')"></h-input>
          </h-form-item>
          <show-branch v-model="addForm.brchName" :label="$t('m.i.common.brchName')" prop="brchName" title="机构名称" v-if="this.userType == '4'" isInitValueClearable
                       :brchNo.sync="addForm.brchNo" :brchName.sync="addForm.brchName"    :showCheckBox="false" :msgBoxWin="addOrEditWin">
          </show-branch>
          <h-form-item label="模板打印方式" prop="tempPrintMode">
            <h-select v-model="addForm.tempPrintMode">
              <h-option value="0" key="0">明细打印</h-option>
              <h-option value="1" key="1">批次打印</h-option>
            </h-select>
          </h-form-item>
          <h-form-item label="是否打印印章" prop="tempPrintMode">
            <h-select v-model="addForm.isPrintSeal">
              <h-option value="0" key="0">否</h-option>
              <h-option value="1" key="1">是</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pe.templateRemark')" prop="tempConfRemark" class="h-form-height-auto">
            <h-input v-model="addForm.tempConfRemark" type="textarea" :maxlength="256" :canResize="false"></h-input>
          </h-form-item>
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
    <h-msg-box v-model="designWin" width="1000" :maximize="true" :mask-closable="false" ref="designRef" top="10" @on-maximize="getHeight">
      <p slot="header">
        <span>设计模板</span>
      </p>
      <h-panel>
        <div v-if="instantIE">
          <object id="LODOP2" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" :width=lodopWidth :height=lodopHeight
                  style="z-index:100">
            <param name="Caption" value="设计模板">
            <param name="Border" value="0">
            <embed id="LODOP_EM2" type="application/x-print-lodop" width=800 height=400 PLUGINSPAGE="install_lodop.exe">
          </object>
        </div>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="designWin=!designWin">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="designTemp()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <h-msg-box v-model="fileWin" width="1000" class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span>文件选择</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        :columns="fileColumns"
        :autoLoad="false"
        highlight-row
        url="/pe/print/tempConf/tempConfManger/findTemp"
        :bindForm="fileFormItem"
        :onCurrentChange="handlelRowClickFile"
        :onCurrentChangeCancel="cancelSelFile"
        ref="fileDatagrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="importTemplateClose()">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" @click="importTemplate()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 产品名称选择弹出框 -->
    <common-product-select :productSelectWin="prodNameSelectWin" @productSelectChange="prodNameSelect"
                           @productSelectWinClose="prodNameSelectWinClose"></common-product-select>
  </div>

</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "tempConfManger",
    data() {
      return {
        ifShowMore: false,
        dictMap: new Map(),
        voucherTypeList: [],
        fileFormItem: {
          id: null
        },
        formItem: {
          voucherType: null,
          legalNo: null,
          brchNo: null,
          prodNo: null,
          prodName: null,
          templateCnName: null,
          creatorNo: null,
          creatorName: null,
          tempConfRemark: null,
          tempContent: null,
          brchName: null
        },
        addForm: {
          id: "",
          voucherType: "",
          brchNo: "",
          prodNo: "",
          prodName: "",
          templateCnName: "",
          tempConfRemark: "",
          tempContent: "",
          brchName: "",
          tempPrintMode:"",
          isPrintSeal:""
        },
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
          }, {
            title: this.$t("m.i.pe.templateCnName"),
            key: "templateCnName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false
          }, {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            sortable: true,
            hiddenCol: false
          }, {
            title:  this.$t("m.i.pc.voucherType"),
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
            key: "creatorName",
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.createTime'),
            key: "createTime",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let date = this.$moment(params.row.createTime,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          }
        ],
        // 新增编辑弹框开关
        addOrEditWin: false,
        //操作类型，新增or修改
        type: "add",
        submitFlag: false,
        // 选择记录
        tempSelectRow: null,
        fileSelectRow: null,
        isRequired: false,
        fileWin: false,
        //请求
        reqUrl: "/pe/print/tempConf/tempConfManger",
        // 用户类型
        userType: 10,
        prodNameSelectWin: false,
        //设计模板窗开关
        designWin: false,
        instantIE: navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0,
        LODOP: null,
        lodopWidth: 950,
        lodopHeight: 460
      };
    },
    components: {
      CommonProductSelect: () => import(/* webpackChunkName: "bm/prod/product/commonProductSelect" */`@/views/bizViews/bm/prod/product/commonProductSelect`)
    },
    methods: {
      getHeight(isMax) {
        if(isMax) {
          this.lodopWidth = window.innerWidth - 100;
        } else {
          this.lodopWidth = 950;
        }
        let headerHeight = this.$refs.designRef.$el.getElementsByClassName('h-modal-header')[0].offsetHeight;
        let footerHeight = this.$refs.designRef.$el.getElementsByClassName('h-modal-footer')[0].offsetHeight;
        this.lodopHeight = window.innerHeight - headerHeight - footerHeight - 100;
      },
      getLodopObj() {
        if (this.instantIE) {
          this.LODOP = this.$print.getLodop(document.getElementById("LODOP2"), document.getElementById("LODOP_EM2"), this);
        }
        // else {
        //   this.LODOP = this.$print.getLodop(null, null, this);
        //   if (this.LODOP) {
        //     this.instantIE = !this.instantIE;
        //   }
        // }
      },
      //设计模板
      designTemp() {
        // this.getLodopObj();
        let tempContent = "";
        if (this.LODOP.CVERSION) this.LODOP.On_Return = function(TaskID, Value) {
          tempContent = Value;
        };
        tempContent = this.LODOP.GET_VALUE("ProgramCodes", 0);
        let url = this.reqUrl + "/designTemp";
        this.submitFlag = true;
        post( {id:  this.addForm.id, tempContent: tempContent}, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let return_code = res.data.return_code;
            if (res.data.retCode === "000000") {
              this.$msgTip.success(this);
              this.designWin = false;
              this.$refs.datagrid.dataChange(1);
              this.tempSelectRow = null;
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.actionFailed") + "," + res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      // 表单提交
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.reqUrl + "/saveOrEditTempConf";
            post(Object.assign(this.addForm, { optType: btnType }), url).then(res => {
              this.submitFlag = false;
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.tempSelectRow = null;
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.actionFailed") + "," + res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      // 选中一条记录
      handlelRowClick(arr) {
        this.tempSelectRow = arr;
      },
      //取消选中
      cancelSel() {
        this.tempSelectRow = null;
      },

      // 选中一条记录
      handlelRowClickFile(arr) {
        this.fileSelectRow = arr;
      },
      //取消选中
      cancelSelFile() {
        this.fileSelectRow = null;
      },
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type == "edit" || this.type == "copy") {
          if (!this.tempSelectRow) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$nextTick(() => {
            this.addForm = {
              id: this.tempSelectRow.id,
              voucherType: this.tempSelectRow.voucherType,
              brchNo: this.tempSelectRow.brchNo,
              prodNo: this.tempSelectRow.prodNo,
              prodName: this.tempSelectRow.prodName,
              templateCnName: this.tempSelectRow.templateCnName,
              tempConfRemark: this.tempSelectRow.tempConfRemark,
              tempPrintMode: this.tempSelectRow.tempPrintMode,
              isPrintSeal: this.tempSelectRow.isPrintSeal,
              brchName:""
            };
            if(this.tempSelectRow.brchNo!==null && this.tempSelectRow.brchNo!=="")
            {
              this.queryObjByBrchNo(this.tempSelectRow.brchNo);
            }
          });
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      queryObjByBrchNo(brchNo) {
        post({ brchNo: brchNo }, "sm/auth/branch/getBranchByBranchTreeNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              let bb = this.addForm
              this.addForm.brchNo = brchNo;
              this.addForm.brchName = res.data.retData.brchName;
            }
          }
        });
      },
      // 打开模板设计框
      handleConfig() {
        if (!this.instantIE) {
          this.$msgTip.info(this, { info: "请使用IE浏览器设计打印模板" });
          return;
        }
        if (!this.tempSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.addForm = {
          id: this.tempSelectRow.id
        };
        this.designWin = true;
        this.$nextTick(()=>{
          this.getHeight();
          this.getLodopObj();
          if ("undefined" != this.LODOP && this.LODOP != null) {
            this.LODOP.PRINT_INITA(0, 0, 800, 600, "designTemplate");
            let LODOP = this.LODOP;
            // var tempCont_Val = document.getElementById('tempCont').value;
            if (this.tempSelectRow.tempContent) {
              eval(this.tempSelectRow.tempContent);
              this.LODOP = LODOP;
              if (this.LODOP.CVERSION) CLODOP.On_Return = function(TaskID, Value) {
                this.tempSelectRow.tempContent = Value;
              };
            }
            this.LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_SETUP", 1);//关闭打印维护页面中打印按钮
            this.LODOP.SET_SHOW_MODE("SKIN_TYPE", 1);//设置操作背景色
            this.LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);//将控件页面嵌入主页面
            this.LODOP.PRINT_DESIGN();
          }
        });
      },
      handleDelete() {
        if (!this.tempSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let url = this.reqUrl + "/delTemp";
        this.$hMsgBox.confirm({
          title: "删除模板",
          content: "是否删除模板？",
          onOk: () => {
            post({ id: this.tempSelectRow.id }, url).then(res => {
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.tempSelectRow = null;
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + "," + res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleImport() {
        if (!this.tempSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.fileWin = true;
        this.$nextTick(() => {
          this.fileFormItem.id = this.tempSelectRow.id;
          this.$refs.fileDatagrid.dataChange(1);
        });

      },
      importTemplate() {
        if (!this.fileSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let url = this.reqUrl + "/importTemp";
        this.$hMsgBox.confirm({
          title: "导入模板",
          content: "导入模板后将覆盖原先内容，请确认？",
          onOk: () => {
            post({ id: this.tempSelectRow.id, fileName: this.fileSelectRow.fileName }, url).then(res => {
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.fileWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.tempSelectRow = null;
                  this.fileSelectRow = null;
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.importSuccess") + "," + res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.importFailed") });
              }
            });
          }
        });
      },
      importTemplateClose(){
        this.fileWin = false;
      },
      //选择产品名称
      queryProductName(optType) {
        this.optType = optType;
        this.prodNameSelectWin = true;
      },
      prodNameSelectWinClose() {
        this.prodNameSelectWin = false;
      },
      //选择产品名称弹出框确认
      prodNameSelect(info) {
        if (this.optType === "query") {
          this.formItem.prodName = info[0].title;
          this.formItem.prodNo = info[0].id;
        } else {
          this.addForm.prodName = info[0].title;
          this.addForm.prodNo = info[0].id;
        }
        this.prodNameSelectWin = false;
      },
      formSearch() {
        this.tempSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.brchNo = ""
        this.formItem.brchName = "";
        this.$nextTick(() => {
          this.tempSelectRow = null;
          this.$refs.formItem.resetFields();
        });
        this.formItem.prodNo = null;
      },
      // 清空表单
      addFormReset() {
        this.addForm.brchNo = "";
        this.addForm.brchName = "";
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      clearProdName(optType) {
        if (optType === "query") {
          this.formItem.prodName = "";
          this.formItem.prodNo = "";
        } else if (optType === "edit") {
          this.addForm.prodName = "";
          this.addForm.prodNo = "";
        }
      }
    },
    mounted() {
      this.getDictListByGroups("VoucherType").then(res => {
        this.voucherTypeList = res.get("VoucherType");
        this.dictMap = res.get("map");
      });
    },
    created() {
      let obj = window.sessionStorage.getItem("userInfo");
      let user = obj ? JSON.parse(window.sessionStorage.getItem("userInfo")) : {};
      this.userType = user["userType"];
    }
  };
</script>

