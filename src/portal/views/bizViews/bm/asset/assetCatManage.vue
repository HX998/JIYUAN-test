<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.prodNo" prop="prodNo" :dictList="prodList"
                               :label="$t('m.i.common.prodName')"></common-select>
                <common-select v-model="formItem.status" prop="status" :dictList="dictList"
                               :label="$t('m.i.common.operStatus')"></common-select>
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
              <h-datagrid :columns="columns" highlight-row url="/bm/valuate/AssetCatManage/func_queryAssetCatManage"
                          :bindForm="formItem"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          :onCurrentChange="onCurrentChange"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="addOrEditAssetCat('add')">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="addOrEditAssetCat('edit')">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="deleteAssetCat()">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="submitCheck()">{{$t('m.i.common.submitCheck')}}</h-button>
                  <h-button type="primary" @click="withdraw()">{{$t('m.i.be.withdraw')}}</h-button>
                  <h-button type="primary" @click="addOrEditAssetCat('view')">{{$t('m.i.be.queryAssetIndustry')}}
                  </h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" caddlass="h-form-table-layer" top="10" @on-close="handleClose()">
      <p slot="header">
        <span v-if="type === 'add'">新增资产分类</span>
        <span v-else-if="type === 'edit'">修改资产分类</span>
        <span v-else>查看资产分类明细</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="90" ref="addOrEditForm" cols="4" class="h-form-search"
                v-if="type === 'add'">
          <h-form-item :label="$t('m.i.common.prodName')" v-if="type=='add'" prop="prodNo">
            <h-select v-model="addOrEditForm.prodNo"  @on-change="prodNoChange()">
              <h-option v-for="item in prodList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate two-form" v-if="type=='add'">
            <h-button type="primary" @click="addHandleSearch()" :disabled="searchDisabled">{{$t("m.i.common.search")}}
            </h-button>
          </h-form-item>
        </h-form>
        <h-datagrid :columns="addOrEditColumns"
                    highlight-row
                    :grid-data="addOrEditGridData"
                    :autoLoad="false"
                    ref="editOrCopyDatagrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="this.submitFlag && type !== 'view'" disabled>{{$t("m.i.common.submiting")}}
        </h-button>
        <h-button type="primary" v-if="type !== 'view'" @click="formSubmit()">{{$t("m.i.common.commit")}}
        </h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post} from "@/api/bizApi/commonUtil";

  export default {
    name: "assetCatManage",
    data() {
      let columns = [
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
          title: this.$t('m.i.common.prodName'),
          key: "prodName",
          hiddenCol: false,
        }, {
          title: this.$t('m.i.common.createDt'),
          key: "createTime",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.createTime == null || params.row.createTime === "") {
              return "";
            }
            let date = this.$moment(params.row.createTime, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        }, {
          title: this.$t("m.i.common.operStatus"),
          key: "status",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, 'RiskOperStatus', params.row.status);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        }
      ]
      return {
        addOrEditWin: false,
        ifShowMore: false,
        addOrEditForm: {
          prodNo: "",
          assetIndustry: "1",
        },
        assetIndustryList: [],
        searchOpen: "0",
        addOrEditGridData: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        addOrEditColumns: [],
        showTemColumns: [{
          type: "index",
          title: this.$t("m.i.common.index"),
          key: "numOrder",
          width: 60,
          align: "center",
          hiddenCol: false
        }, {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          hiddenCol: false
        }],
        dataList: [],
        selectData: null,
        type: "",
        viewAssetList: [],
        searchTrue: false,
        submitFlag: false,
        dictMap: new Map(),
        prodList: [],
        dictList: [],
        formItem: {
          status: "",
          prodNo: "",
        },
        columns: columns
      };
    },
    mounted() {
      this.getDictListByGroups("RiskOperStatus,AssetCatProduct,AssetIndustry,SetAssetIndustry,DraftTypeCode,CDMedia").then(res => {
        this.prodList = res.get("AssetCatProduct");
        this.dictList = res.get("RiskOperStatus");
        this.dictMap = res.get("map");
        this.assetIndustryList = res.get("SetAssetIndustry");
        this.addOrEditForm.assetIndustry=this.assetIndustryList[0].key;
      })
    },
    computed: {
      searchDisabled() {
        return this.searchOpen == "1" ? false : true;
      },
    },
    methods: {
      selectChange(index, value) {
        if (this.type == "add") {
          this.dataList[index].assetIndustry = value;
        } else {
          this.viewAssetList[index].assetIndustry = value;
        }
      },
      handleClose() {
        this.addOrEditWin = false;
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //查询
      formSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      onCurrentChange(arr, selectInx) {
        this.selectData = arr;
      },
      onCurrentChangeCancel() {
        this.selectData = null;
      },
      prodNoChange() {
        this.searchOpen = "0";
        this.searchTrue = false;
        if (this.addOrEditForm.prodNo != "" && this.addOrEditForm.prodNo != null) {
          this.searchOpen = "1";
        }
      },
      addOrEditAssetCat(optType) {
        this.type = optType;
        if (this.type === "edit" || this.type === "view") {
          if (this.selectData == null) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          }
          if (this.type === "edit") {
            if (this.selectData.status == "12" || this.selectData.status == "22" || this.selectData.status == "32") {
              this.$msgTip.info(this, {info: "该数据正在提交复核中，不允许修改"});
              return;
            }
          }
        }
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.addOrEditReset();
          this.addOrEditColumns = this.deepClone(this.showTemColumns);
          if (this.type === "edit" || this.type === "view") {
            this.getAssetCatManageDetail();
          }
        });
      },
      addOrEditReset() {
        if (this.type === "add") {
          this.$refs.addOrEditForm.resetFields();
          this.addOrEditForm.prodNo="";
        }
        this.showTemColumns = [{
          type: "index",
          title: this.$t("m.i.common.index"),
          key: "numOrder",
          width: 60,
          align: "center",
          hiddenCol: false
        }, {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          hiddenCol: false
        }];
        this.viewAssetList = [];
        this.dataList = [];
        this.addOrEditGridData = {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        };
      },
      addHandleSearch() {
        this.addOrEditColumns = this.deepClone(this.showTemColumns);
        this.getAssetCatManageDetail();
      },
      formSubmit() {
        let url = this.type === "add" ? "/bm/valuate/AssetCatManage/func_addAssetCatManage" : "/bm/valuate/AssetCatManage/func_updateAssetCatManage";
        if (this.type === "add") {
          if (this.dataList == null || this.dataList.length <= 0) {
            this.$msgTip.error(this, {info: "请设置资产分类后在提交！"});
            return;
          }
        }
        let params = {};
        if (this.type === "add") {
          params = {
            "prodNo": this.dataList[0].prodNo,
            "prodName": this.dataList[0].prodName,
            'createTime': '',
            'status': '',
            "list": this.dataList,
          }
        }
        if (this.type != "add") {
          params.createTime = this.viewAssetList[0].createTime;
          params.status = this.viewAssetList[0].status;
          params.prodNo = this.viewAssetList[0].prodNo;
          params.prodName = this.viewAssetList[0].prodName;
          params.createBrchNo = this.viewAssetList[0].createBrchNo;
          params.createTellerNo = this.viewAssetList[0].createTellerNo;
          params.list = this.viewAssetList;
        }
        post(params, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                let data = res.data.retData;
                this.$msgTip.success(this);
                this.addOrEditWin = false;
                this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                this.selectData = null;
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          }
        );
      },
      //删除
      deleteAssetCat() {
        if (this.selectData === null) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (this.selectData.status == "12" || this.selectData.status == "22" || this.selectData.status == "32") {
          this.$msgTip.info(this, {info: "该数据正在提交复核中，不允许删除"});
          return;
        }
        if (this.selectData.status == "33") {
          this.$msgTip.info(this, {info: "该数据已被删除，不允许重复删除"});
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
        post({prodNo: this.selectData.prodNo}, "/bm/valuate/AssetCatManage/func_deleteAssetCatManage").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //提交复核
      submitCheck() {
        if (this.selectData === null) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (this.selectData.status == "12" || this.selectData.status == "22" || this.selectData.status == "32") {
          this.$msgTip.info(this, {info: "该数据正在提交复核中，不允许重复提交"});
          return;
        }
        if (this.selectData.status == "13" || this.selectData.status == "23" || this.selectData.status == "33") {
          this.$msgTip.info(this, {info: "该数据已复核通过，不允许提交"});
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定提交复核吗？",
          onOk: () => {
            post({prodNo: this.selectData.prodNo}, "/bm/valuate/AssetCatManage/func_submitAssetCatManage").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = null;
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //撤回
      withdraw() {
        if (this.selectData === null) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (this.selectData.status != "12" && this.selectData.status != "22" && this.selectData.status != "32") {
          this.$msgTip.info(this, {info: "该数据未提交复核，不允许撤回"});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤回待复核数据吗？",
          onOk: () => {
            post({prodNo: this.selectData.prodNo}, "/bm/valuate/AssetCatManage/func_rollbackAssetCatManage").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = null;
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      getAssetCatManageDetail() {
        let url = this.type === "add" ? "/bm/valuate/assetCatTemplate/func_queryAssetCatKpiTemplateManage" : "/bm/valuate/AssetCatManage/func_queryAssetCatManageDetail";
        let params = this.type === "add" ? {prodNo: this.addOrEditForm.prodNo} : {prodNo: this.selectData.prodNo};
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              if (this.type === "add" && res.data.retData == null) {
                this.$msgTip.error(this, {info: "请先设置资产分类模板"});
                return;
              }
              let list = res.data.retData.list;
              this.addOrEditGridData = {
                list: this.deepClone(list),
                pageInfo: res.data.retData.pageInfo
              };
              if (this.type === "add") {
                this.dataList = list;
                for (let i = 0; i < this.dataList.length; i++) {
                  this.dataList[i].assetIndustry = this.addOrEditForm.assetIndustry;
                }
              } else {
                this.viewAssetList = list;
                this.viewAssetList[0].status = res.data.retData.status;
                this.viewAssetList[0].createTime = res.data.retData.createTime;
                this.viewAssetList[0].prodName = res.data.retData.prodName;
                this.viewAssetList[0].createBrchNo = res.data.retData.createBrchNo;
                this.viewAssetList[0].createTellerNo = res.data.retData.createTellerNo;
              }
              let billTypeFlag = "0";
              let billClassFlag = "0";
              for (let i = 0; i < list.length; i++) {
                if (list[i].billType != null && list[i].billType != "") {
                  billTypeFlag = "1";
                }
                if (list[i].billClass != null && list[i].billClass != "") {
                  billClassFlag = "1";
                }
              }
              if (billTypeFlag === "1") {
                this.addOrEditColumns.push({
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
              if (billClassFlag === "1") {
                this.addOrEditColumns.push({
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
              if (this.type === "view") {
                this.addOrEditColumns.push({
                  title: this.$t('m.i.be.assetIndustry'),
                  key: "assetIndustry",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("div", [
                      h("span", this.getDictValueFromMap(this.dictMap, "AssetIndustry", params.row.assetIndustry))
                    ]);
                  }
                })
              } else {
                this.addOrEditColumns.push({
                  title: this.$t('m.i.be.assetIndustry'),
                  key: "assetIndustry",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("h-select",
                      {
                        props: {
                          showTitle: true,
                          placeholder: "",
                          clearable: false,
                          // value: params.row.assetIndustry
                          value: this.type === "add" ? this.addOrEditForm.assetIndustry : params.row.assetIndustry
                        },
                        on: {
                          'on-change': (currVal) => {
                            this.selectChange(params.index, currVal);
                          },
                        }
                      },
                      [
                        this.assetIndustryList.map((item) => {
                          return h('h-option',
                            {
                              props: {value: item.key, label: item.value, key: item.key}
                            })
                        })
                      ]);
                  }
                })
              }
              this.$nextTick(() => {
                this.$refs.editOrCopyDatagrid.createColumns(this.addOrEditColumns);
              });
            } else {
              if(this.type="add"){
                this.$msgTip.error(this, {info: "请先设置该产品的指标和模板"});
              }else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            }
          }
        });
      },

    }
  }
</script>

<style scoped>

</style>
