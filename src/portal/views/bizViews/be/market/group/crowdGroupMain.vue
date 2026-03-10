<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="3">
                <div class="h-search-form-row">
                  <h-form-item prop="groupNo" :label="$t('m.i.be.groupNo')">
                    <h-input v-model="formItem.groupNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="groupName" :label="$t('m.i.be.groupName')">
                    <h-input v-model="formItem.groupName" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate two-form">
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
              <h-datagrid
                  :columns="columns"
                  :minColWidth="minColWidth"
                  url="/be/market/group/crowdGroupMain/func_findCrowdGroupByPage"
                  :bindForm="formItem"
                  :hasSelect="hasSelect"
                  :rowSelect="true"
                  ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @on-click="editGroup('1')">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @on-click="editGroup('2')">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @on-click="delGroup()">{{$t('m.i.common.delete')}}</h-button>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box v-model="groupWin" width="850" @on-close="groupWinClose" class="h-form-table-layer" :maximize="true"
               :mask-closable="false" :footerHide="true">
      <p slot="header">
        <span v-if="type === '1'">添加群组</span>
        <span v-if="type === '2'">修改群组</span>
      </p>
      <h-form :model="groupQueryFormItem" ref="groupQueryFormItem">
      </h-form>
      <h-form :model="groupFormItem" :label-width="90" ref="groupFormItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.be.groupName')" prop="groupName" required >
          <h-input v-model="groupFormItem.groupName" :maxlength=50 :readonly="type === '2'" ></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate two-form">
          <h-button type="primary" @click="saveGroup()" v-if="type === '1'">{{$t('m.i.common.save')}}</h-button>
        </h-form-item>
      </h-form>
          <h-datagrid :columns="groupTraderColumns"
                      :autoLoad="false"
                      url="/cpes/trader/crowdGroupMain/func_queryGroupTrader"
                      :bindForm="groupQueryFormItem"
                      :rowSelect="true"
                      :hasSelect="groupHasSelect"
                      ref="groupDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="addTrader()">{{$t('m.i.be.addTrader')}}</h-button>
              <h-button type="primary" @on-click="delTrader()">{{$t('m.i.be.delTrader')}}</h-button>
            </div>
          </h-datagrid>
    </h-msg-box>

    <h-msg-box v-model="traderWin" width="850" @on-close="traderWinClose" class="h-form-table-layer" :maximize="true"
               :mask-closable="false" :footerHide="true">
      <p slot="header">
        <span>添加交易员</span>
      </p>
      <h-form :model="traderFormItem" :label-width="90" ref="traderFormItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
          <h-input v-model="traderFormItem.brchCode"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.traderId')" prop="traderId">
          <h-input v-model="traderFormItem.traderId"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.traderName')" prop="traderName">
          <h-input v-model="traderFormItem.traderName"></h-input>
        </h-form-item>
        <h-form-item prop="groupNo" v-show="false">
          <h-input v-model="traderFormItem.groupNo"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="handleSearch2">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="resetSearch2">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
          <h-datagrid :columns="traderColumns"
                      :autoLoad="false"
                      url="/cpes/trader/crowdGroupMain/func_queryGroupTrader"
                      :bindForm="traderFormItem"
                      :rowSelect="true"
                      :hasSelect="traderHasSelect"
                      ref="traderDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="addSelectTrader()">{{$t('m.i.common.addition')}}</h-button>
            </div>
          </h-datagrid>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "crowdGroupMain",
    data() {
      return {
          formItem : {
            groupNo: "",
            groupName: ""
          },
          groupFormItem : {
            groupName: "",
            groupNo: "",
            groupRemark: ""
          },
          traderFormItem : {
            brchCode: "",
            traderId: "",
            traderName: "",
            groupNo: "",
            type: "traderNotIn"
          },
          groupQueryFormItem : {
            groupNo: "",
            type: "traderIn"
          },
          columns : [
            {
              type: "selection",
              hiddenCol: false,
              align: "center",
              width: 50
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              align: "center",
              hiddenCol: false,
              width: 50
            },

            {
              title: this.$t('m.i.common.id'),
              key: "id",
              hiddenCol: true,
              align: "center"
            },
            {
              title: this.$t('m.i.be.groupNo'),
              key: "groupNo",
              align: "center",
              hiddenCol: false,
              sortable: true
            },
            {
              title: this.$t('m.i.be.groupName'),
              key: "groupName",
              hiddenCol: false,
              align: "center"
            },
            {
              title:  this.$t('m.i.common.applTellerNo'),
              key: "applTellerNo",
              hiddenCol: false,
              align: "center"
            },
            {
              title: this.$t('m.i.common.createTime'),
              key: "createTime",
              align: "center",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (null != params.row.createTime && "" !== params.row.createTime) {
                  let dttm = this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                  return h("span", dttm);
                }
              }
            }
          ],
          groupTraderColumns : [
            {
              type: "selection",
              hiddenCol: false,
              align: "center",
              width: 50
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              align: "center",
              width: 50,
              hiddenCol: false
            },

            {
              title: this.$t('m.i.common.id'),
              key: "id",
              hiddenCol: true,
              align: "center"
            },
            {
              title: this.$t('m.i.common.brchCode'),
              key: "brchCode",
              align: "center",
              hiddenCol: false,
              sortable: true
            },
            {
              title: this.$t('m.i.common.traderId'),
              key: "traderId",
              hiddenCol: false,
              align: "center"
            },
            {
              title: this.$t('m.i.common.traderName'),
              key: "traderName",
              align: "center",
              hiddenCol: false,
              ellipse: true
            },
            {
              title: this.$t('m.i.be.traderType'),
              key: "traderType",
              align: "center",
              hiddenCol: false,
              render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'TraderType', params.row.traderType);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t('m.i.be.traderStatus'),
              key: "traderStatus",
              align: "center",
              hiddenCol: false,
              render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'TraderStatus', params.row.traderStatus);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            }
          ],
          traderColumns : [
            {
              type: "selection",
              hiddenCol: false,
              align: "center",
              width: 50
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              align: "center",
              width: 50,
              hiddenCol: false
            },

            {
              title: this.$t('m.i.common.id'),
              key: "id",
              hiddenCol: true,
              align: "center"
            },
            {
              title: this.$t('m.i.common.brchCode'),
              key: "brchCode",
              hiddenCol: false,
              align: "center"
            },
            {
              title: this.$t('m.i.common.traderId'),
              key: "traderId",
              hiddenCol: false,
              align: "center"
            },
            {
              title: this.$t('m.i.common.traderName'),
              key: "traderName",
              align: "center",
              hiddenCol: false,
              ellipse: true
            },
            {
              title: this.$t('m.i.be.traderType'),
              key: "traderType",
              align: "center",
              hiddenCol: false,
              render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'TraderType', params.row.traderType);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t('m.i.be.traderStatus'),
              key: "traderStatus",
              align: "center",
              hiddenCol: false,
              render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, 'TraderStatus', params.row.traderStatus);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            }
          ],
          type : "1",
          thisGroupNo : "",
          traderWin : false,
          isSave : false,
          moveUpDisabled : false,
          moveDownDisabled : false,
          groupWin : false,
          traderHasSelect : false,
          groupHasSelect : false,
          hasSelect : false,
          minColWidth: 90
      }
    },
    created() {
      this.$nextTick(() => {
        let sidebarObj = document.getElementsByClassName("h-sidebar-wrapper");
        let sidebarOffsetWidth = sidebarObj.length == 0 ? 0 : sidebarObj[0].offsetWidth;
        this.minColWidth = (window.innerWidth - sidebarOffsetWidth) / (this.columns.length-2);
      });
    },
    mounted() {
      getDictListByGroups("TraderStatus,TraderType").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      handleSearch2() {
        this.$refs.traderDatagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      resetSearch2() {
        this.$refs.traderFormItem.resetFields();
      },
      editGroup(type) {
        let list = this.$refs.datagrid.selects;
        this.hasSelect = true;
        this.type = type;
        this.groupQueryFormItem.groupNo = "";
        if (type === "2" && list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (type === "2" && list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }

        if (type === "2") {
          this.$nextTick(() => {
            this.isSave = true;
            this.groupFormItem.groupName = list[0].groupName;
            this.groupQueryFormItem.groupNo = list[0].groupNo;
            this.thisGroupNo = list[0].groupNo;
          });
        }
        this.groupWin = true;
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.groupDatagrid.dataChange(1);
        });
      },
      delGroup() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.hasSelect = true;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定删除选中数据?",
          onOk: () => {
            post({ ids: ids }, "/be/market/group/crowdGroupMain/func_delCrowdGroup").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.hasSelect = false;
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      groupWinClose() {
        this.thisGroupNo = "";
        this.type = "";
        this.isSave = false;
        this.$refs["groupQueryFormItem"].resetFields();
        this.$refs["groupFormItem"].resetFields();
        this.groupWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      saveGroup() {
        this.$refs["groupFormItem"].validate(valid => {
          if (valid) {
            post(this.groupFormItem, "/be/market/group/crowdGroupMain/func_createCrowdGroup").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let data = res.data.retData;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.isSave = true;
                  this.thisGroupNo = data.groupNo;
                  this.groupQueryFormItem.groupNo = this.thisGroupNo;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      addTrader() {
        this.traderHasSelect = false;
        if (!this.isSave) {
          this.$refs["groupFormItem"].validate(valid => {
            if (valid) {
              post(this.groupFormItem, "/be/market/group/crowdGroupMain/func_createCrowdGroup").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  let data = res.data.retData;
                  if (retCode === "000000") {
                    this.isSave = true;
                    this.thisGroupNo = data.groupNo;
                    this.traderFormItem.groupNo = this.thisGroupNo;
                    this.traderWin = true;
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                  this.$nextTick(() => {
                    this.$refs.datagrid.dataChange(1);
                    this.$refs.traderDatagrid.dataChange(1);
                  });
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        } else {
          this.traderFormItem.groupNo = this.thisGroupNo;
          this.traderWin = true;
          this.$nextTick(() => {
            this.$refs.traderDatagrid.dataChange(1);
          });
        }
      },
      delTrader() {
        let list = this.$refs.groupDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].traderId;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.groupHasSelect = true;
        post({
          ids: ids,
          groupNo: this.thisGroupNo
        }, "/be/market/group/crowdGroupMain/func_deleteCrowdGroupTrader").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
            this.groupHasSelect = false;
            this.$refs.groupDatagrid.dataChange(1);
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      traderWinClose() {
        this.traderHasSelect = true;
        this.$refs.traderFormItem.resetFields();
        this.traderWin = false;
        this.$refs.traderDatagrid.selects = [];
        this.$refs.traderDatagrid.selectIds = [];
      },
      addSelectTrader() {
        let list = this.$refs.traderDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
      
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].traderId;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids, groupNo: this.thisGroupNo }, "/be/market/group/crowdGroupMain/func_addCrowdGroupTrader").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.groupQueryFormItem.groupNo = this.thisGroupNo;
              this.isSave = true;
              this.traderWinClose();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
            this.$refs.groupDatagrid.dataChange(1);
            this.$refs.traderDatagrid.dataChange(1);
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
