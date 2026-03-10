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
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid :columns="columns" highlight-row
                          url="/bm/valuate/AssetCatManage/func_queryAssetCatManageCheckPage"
                          :bindForm="formItem"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          :onCurrentChange="onCurrentChange"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="pass">{{$t('m.i.common.pass')}}</h-button>
                  <h-button type="primary" @click="refuse">{{$t('m.i.common.refuse')}}</h-button>
                  <h-button type="primary" @click="viewAssetCat()">{{$t('m.i.be.queryAssetIndustry')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--查看明细-->
    <h-msg-box v-model="viewAssetWin" width="1000" caddlass="h-form-table-layer" :maximize="true" :mask-closable="false"
               top="10">
      <p slot="header">
        <span>查看资产分类明细</span>
      </p>
      <div>
        <h-datagrid :columns="showTemColumns"
                    highlight-row
                    getDataFunc
                    :grid-data="editOrCopyProductRateData"
                    :autoLoad="false"
                    ref="editOrCopyDatagrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="viewAssetWin=!viewAssetWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>


  </div>
</template>

<script>
  import {post} from "@/api/bizApi/commonUtil";

  export default {
    name: "assetCatReview",
    data() {
      return {
        url: null,
        title: '',
        addForm: "",
        addOrEditWin: false,
        ifShowMore: false,
        addOrEditForm: {
          prodNo: "",
          assetIndustry:"1",
        },
        list:[],
        searchOpen: "0",
        viewColumns:[],
        viewAssetWin:false,
        dataList:[],
        showTemColumns:[],
        editOrCopyColumns: [],
        editOrCopyProductRateData: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        selectData: [],
        dictMap: new Map(),
        type: "",
        viewAssetList:[],
        searchTrue: false,
        submitFlag:false,
        prodList: [],
        formItem: {
          status: "",
          prodNo:"",
        },
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
            title: this.$t('m.i.common.operStatus'),
            key: "status",
            sortable: true,
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
        ],
      };
    },
    mounted() {
      this.getDictListByGroups("RiskOperStatus,AssetCatProduct,AssetIndustry,DraftTypeCode,CDMedia").then(res => {
        this.prodList = res.get("AssetCatProduct");
        this.map = res.get("AssetIndustry");
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
      //审核通过
      pass() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定复核通过吗？",
          onOk: () => {
            let prodNo = list[0].prodNo;
            let url = "/bm/valuate/AssetCatManage/func_passAssetCatManageCheck"
            post({prodNo: prodNo}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //审核驳回
      refuse() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定拒绝待复核数据吗？",
          onOk: () => {
            let prodNo = list[0].prodNo;
            let url = "/bm/valuate/AssetCatManage/func_rejectAssetCatManageCheck"
            post({prodNo: prodNo}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      viewAssetCat(str) {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }

        this.showTemColumns = [];
        this.viewAssetList = [];
        post({prodNo: this.selectData[0].prodNo,"reFlag": "1"}, "/bm/valuate/AssetCatManage/func_queryAssetCatManageDetail").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.viewAssetWin = true;
              let list = res.data.retData.list;
              this.editOrCopyProductRateData = {
                list: this.deepClone(res.data.retData.list),
                pageInfo: res.data.retData.pageInfo
              };
              this.viewAssetList = res.data.retData.list;
              this.viewAssetList[0].status = res.data.retData.status;
              this.viewAssetList[0].createTime = res.data.retData.createTime;
              this.showTemColumns.push(
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
              if (billClassFlag === "1") {
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
                this.showTemColumns.push({
                  title: this.$t('m.i.be.assetIndustry'),
                  key: "assetIndustry",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("div", [
                      h("span", this.getDictValueFromMap(this.dictMap, "AssetIndustry", params.row.assetIndustry))
                    ]);
                  }
                })
              this.$nextTick(() => {
                this.$refs.editOrCopyDatagrid.dataChange(1);
                this.$refs.editOrCopyDatagrid.createColumns(this.showTemColumns);
              });
            } else {
              this.viewAssetWin = false;
              this.$msgTip.error(this, {info: msg});
            }
          }
        });

      },

    }
  }
</script>

<style scoped>

</style>
