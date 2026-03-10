<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <common-select v-model="formItem.prodNo" prop="prodNo" :dictList="dictList"
                               :label="$t('m.i.common.prodName')"></common-select>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" highlight-row url="/bm/valuate/assetCatTemplate/func_queryAssetCatKpi"
                          :bindForm="formItem"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          :onCurrentChange="onCurrentChange"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="addKpi()">{{$t("m.i.bm.addKpi")}}</h-button>
                  <h-button type="primary" @click="deleteKpi()">{{$t("m.i.bm.deleteKpi")}}</h-button>
                  <h-button type="primary" @click="createTemplate()">{{$t("m.i.bm.createTemplate")}}</h-button>
                  <h-button type="primary" @click="viewProductKpi()">{{$t("m.i.bm.viewProductKpi")}}</h-button>
                  <h-button type="primary" @click="viewTemplate()">{{$t("m.i.bm.viewTemplate")}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
          <ul style="color:red;padding-left:0px;">操作说明：
            <ul style="color:red;padding-left:0px;">1、请先新增指标分配，为产品指定指标，然后生成模板</ul>
            <ul style="color:red;padding-left:0px;">2、模板生成后就可以在 '资产分类管理' 界面设置对应产品的资产分类</ul>
            <ul style="color:red;padding-left:0px;">3、如果变更了指标，一定要再次生成模板，不然设置资产分类的时候，模板不一致</ul>
          </ul>
        </div>
      </h-col>
    </h-row>

    <!-- 新增指标分配弹出框 -->
    <h-msg-box v-model="addWin" width="800" @on-close="addFormReset" class="h-form-search-layer" :maximize="true"
               :mask-closable="false">
      <p slot="header">
        <span>产品资产分类分配</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="80" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodNo" required>
            <h-select v-model="addForm.prodNo" placeholder="" @on-change="prodNoSelect()">
              <h-option v-for="item in dictList" :value="item.key" :key="item.key">{{ item.value }}</h-option>

            </h-select>
          </h-form-item>
          <h-form-item label="指标名称" prop="kpiCodes">
            <h-select v-model="addForm.kpiCode" placeholder="" multiple showTitle>
              <h-option v-for="item in kpiList" :value="item.kpiCode" :key="item.kpiCode">{{item.kpiName}}
              </h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addWin=!addWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="addFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 生成模板弹出框 -->
    <h-msg-box v-model="createRateWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>生成模板</span>
      </p>
      <div>
        <h-form :model="createTempForm" :label-width="120" ref="createTempForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodName" required>
            <h-input v-model="createTempForm.prodName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required v-if="authObj.TemplateBillType">

            <h-select multiple showTitle v-model="createTempForm.billType">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required v-if="authObj.TemplateBillClass">
            <h-select multiple showTitle v-model="createTempForm.billClass">
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value}}
              </h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="closeCreate()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="createTempFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 查看产品指标弹出框 -->
    <h-msg-box v-model="showProductKpiWin" width="800" class="h-form-table-layer" :maximize="true"
               :mask-closable="false">
      <!--弹出框模式标题-->
      <p slot="header">
        <span>查看产品指标</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="showKpiColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/bm/valuate/assetCatTemplate/func_queryAssetCatKpiByPage"
                    :bindForm="showKpiFormItem"
                    ref="showKpiDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>

      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="showProductKpiWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 利率模板管理弹出框 -->
    <h-msg-box v-model="showTemplateWin" class="h-form-table-layer" width="800" :maximize="true"
               @on-close="showTemplateWinClose" :mask-closable="false">
      <p slot="header">
        <span>资产分类模板管理</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="showTemColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/bm/valuate/assetCatTemplate/func_queryAssetCatKpiTemplateManage"
                    :bindForm="showTemFormItem"
                    :paramId="'tempId'"
                    :hasSelect="false"
                    rowSelect
                    ref="showRateDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="deleteShowTem()">{{$t("m.i.common.delete")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="showTemplateWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>


  </div>
</template>

<script>
  import {post, on, off, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "assetCatTemplate",
    data() {
      let addForm = {
        prodNo: "",
        kpiCode: []
      };
      let showKpiFormItem = {
        prodNo: ""
      };
      let createTempForm = {
        prodNo: "",
        prodName: "",
        billType: [],
        billClass: [],
      };
      let authObj = {
        TemplateBillType: false,
        TemplateBillClass: false,
      };
      let showTemFormItem = {
        prodNo: ""
      };
      let showKpiColumns = [
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: true
        },
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodNo"),
          key: "prodNo",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.kpiName'),
          key: "kpiName",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.kpiScope'),
          key: "kpiScope",

          hiddenCol: false,
          render: (h, params) => {
            let kpiScope = params.row.kpiScope;
            switch (kpiScope) {
              case "1":
                return h("span", "必须");
              case "2":
                return h("span", "非必须");
            }
          }
        },
      ];
      return {
        url: null,
        title: '',
        addForm: addForm,
        authObj: authObj,
        addOrEditWin: false,
        createRateWin: false,
        ifShowMore: false,
        createTempForm: createTempForm,
        selectData: [],
        showTemColumns: [],
        showTemFormItem: showTemFormItem,
        showTemplateWin: false,
        showProductKpiWin: false,
        showKpiFormItem: showKpiFormItem,
        type: "",
        showKpiColumns: showKpiColumns,
        billTypeList: [{key: "AC01", value: "银票"}, {key: "AC02", value: "商票"}],
        billClassList: [{key: "ME01", value: "纸票"}, {key: "ME02", value: "电票"}],
        dictList:[],
        kpiList: [],
        submitFlag: false,
        formItem: {
          prodName: "",
          prodNo:"",
        },
        addWin: false,
        columns: [
          {
            type: "radio",
            width: 50,
            title: " ",
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.prodNo'),
            key: "prodNo",
            hiddenCol: false,
          }, {
            title: this.$t('m.i.common.prodName'),
            key: "prodName",
            hiddenCol: false
          }, {
            title: this.$t("m.i.bm.kpiCount"),
            key: "kpiCount",
            hiddenCol: false,
          }
        ],
      };
    },
    mounted() {
      this.getDictListByGroups("AssetCatProduct,DraftTypeCode,CDMedia").then(res => {
        this.dictList = res.get("AssetCatProduct");
        this.dictMap = res.get("map");
      })
    },
    methods: {
      //重置
      formSearchReset() {
        this.formItem = [];

      },
      //查询
      formSearch() {
        this.selectData = []
        this.$refs.datagrid.dataChange(1);
      },

      onCurrentChange(arr, selectInx) {
        let tmpArr = [];
        tmpArr.push(arr);
        this.selectData = tmpArr;
      },
      onCurrentChangeCancel() {
        this.selectData = [];
      },


      addKpi() {
        this.$hMsgBox.confirm({
          title: "确认",
          content: "分配相同指标会覆盖，分配之后请进行生成模板操作！",
          onOk: () => {
            this.addWin = true;
            this.$nextTick(() => {
              this.addFormReset();
              this.addForm.kpiCode = [];
              this.addForm.prodNo = "";
              this.getKpi();
            });
          }
        });
      },
      //查询指标
      getKpi() {
        post({}, "/bm/valuate/assetCatTemplate/func_queryAssetCatKpiDict").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.kpiList = data;
            let list = this.kpiList;
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      // 新增指标分配弹出框提交
      addFormSubmit() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = "/bm/valuate/assetCatTemplate/func_addAssetCatKpi";
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.addWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, {info: msg});
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      // 删除
      deleteKpi() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定删除吗？",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let list = this.selectData;
        let delProdNo = list[0].prodNo;
        post({prodNo: delProdNo}, "/bm/valuate/assetCatTemplate/func_deleteAssetCatKpi").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = [];
            } else {
              this.$msgTip.error(this, {info: msg});
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      //查看产品指标
      viewProductKpi() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.showProductKpiWin = true;
        this.$nextTick(() => {
          let list = this.selectData;
          this.showKpiFormItem.prodNo = list[0].prodNo;
          this.$refs.showKpiDatagrid.dataChange(1);
        });
      },
      showProductKpiWinClose() {
        this.showProductKpiWin = false;
      },

      //生成利率模板
      createTemplate() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.createTempForm = {
          prodNo: "",
          prodName: "",
          billType: [],
          billClass: [],
        };
        //this.createTempFormRest();
        this.authObj.TemplateBillType = false;
        this.authObj.TemplateBillClass = false;
        this.$hMsgBox.confirm({
          title: "确认",
          content: "生成模板会将原先产品[ " + list[0].prodName + " ]对应的指标模板数据全部清除，是否确认生成？",
          onOk: () => {
            post({prodNo: list[0].prodNo}, "/bm/valuate/assetCatTemplate/func_queryAssetCatKpiToTemp").then(res => {
              if (res && res.data) {
                let retCode = res.data.retCode;
                let msg = res.data.retMsg;
                if (retCode == "000000") {
                  this.createTempForm.prodName = list[0].prodName;
                  this.createTempForm.prodNo = list[0].prodNo;
                  let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
                  for (let item of data) {
                    let itemList = item.list
                    for (let i = 0; i < itemList.length; i++) {
                      if (itemList[i].kpiCode === "BillType") {
                        this.authObj.TemplateBillType = true;
                      }
                      if (itemList[i].kpiCode === "BillClass") {
                        this.authObj.TemplateBillClass = true;
                      }
                    }
                  }
                  this.createRateWin = true;
                }else {
                  this.$msgTip.error(this, {info: msg});
                }
              }

            })
          }
        });
      },

      createTempFormSubmit() {
        this.$refs["createTempForm"].validate(valid => {
          if (valid) {
            let url = "/bm/valuate/assetCatTemplate/func_buildAssetCatKpiTemplate";
            this.submitFlag = true;
            post(this.createTempForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.createRateWin = false;
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      //模板管理
      viewTemplate() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.showTemplateWin = true;
        this.$nextTick(() => {
          this.$refs.showRateDatagrid.tData = [];
          this.showTemColumns = [];
          this.showTemFormItem.prodNo = list[0].prodNo;
          let showTemProdNo = list[0].prodNo;
          post({prodNo: showTemProdNo}, "/bm/valuate/assetCatTemplate/func_queryAssetCatKpiByPage").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                let list = res.data.retData.list;
                this.showTemColumns.push(
                  {
                    type: "selection",
                    width: 60,
                    hiddenCol: false,
                    align: "center"
                  },
                  {
                    type: "index",
                    title: this.$t("m.i.common.index"),
                    key: "numOrder",
                    width: 60,
                    align: "center",
                    hiddenCol: false
                  },
                  {
                    title: this.$t("m.i.common.prodName"),
                    key: "prodName",
                    hiddenCol: false
                  },
                );
                for (let i = 0; i < list.length; i++) {
                  if(list[i].kpiCode ==="BillType"){
                    this.showTemColumns.push({
                      title: this.$t('m.i.billInfo.billType'),
                      key: "billType",
                      hiddenCol: false,
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      },
                    });
                  }
                  if(list[i].kpiCode ==="BillClass"){
                    this.showTemColumns.push({
                      title: this.$t('m.i.billInfo.billClass'),
                      key: "billClass",
                      hiddenCol: false,
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      }
                    });
                  }
                }

                this.showTemplateWin = true;
                this.$nextTick(() => {
                  this.$refs.showRateDatagrid.dataChange(1);
                  this.$refs.showRateDatagrid.createShowCol(this.showTemColumns);
                });
              } else {
                this.$msgTip.error(this, {info: msg});
                this.showTemplateWin = false;
              }
            }
          });
        });
      },
      deleteShowTem() {
        let list = this.$refs.showRateDatagrid.selects;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDelShowTem();
          }
        });
      },

      handleDelShowTem() {
        let list = this.$refs.showRateDatagrid.selects;
        let ids = [];
        for (let i = 0, count = list.length; i < count; i++) {
          ids.push(list[i].tempId)
        }
        post({ ids: ids,prodNo: list[0].prodNo}, "/bm/valuate/assetCatTemplate/func_deleteAssetCatKpiTemplateManage").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.showRateDatagrid.dataChange(this.$refs.showRateDatagrid.$refs.gridPage.currentPage);
              this.$refs.showRateDatagrid.selects = [];
              this.$refs.showRateDatagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.showRateDatagrid.dataChange(this.$refs.showRateDatagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      closeCreate() {
        this.createRateWin = false;
      },

      //重置新增/修改窗口
      addFormReset() {
        this.$refs.addForm.resetFields();
      },
      // createTempFormRest() {
      //   this.$refs.createTempForm.resetFields();
      // },
      showTemplateWinClose() {
        this.showTemplateWin = false;
      },

    }
  }
</script>

<style scoped>

</style>
