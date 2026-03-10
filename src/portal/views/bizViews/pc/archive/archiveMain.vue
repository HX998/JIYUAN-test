<!--额度流水查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.archiveDt')" prop="batchDt">
                  <h-date-picker v-model="formItem.batchDt" type="date" :editable=false
                                 :showFormat=true placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.status')" prop="status">
                  <h-select v-model="formItem.status" placeholder="">
                    <h-option v-for="item in statusList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/archive/archiveMain/func_pagingQueryArchiveList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="detailWinOpen()">
                {{$t('m.i.common.searchDetail')}}
              </h-button>

              <h-button type="primary" @click="batchRollback()">
                {{$t('m.i.common.batchRollback')}}
              </h-button>
              <!--              <h-button type="primary" @on-click="tempShowExcelTemplateWinOpen" >{{$t('m.i.common.listExport')}}</h-button>-->
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box v-model="showDetailWin" width="1000" class="h-form-table-layer" :maximize="true" :mask-closable="false"
               @on-close="detailWinClose"
               :z-index="1002">
      <p slot="header">
        <span>归档明细</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="detailForm" :label-width="90" ref="detailForm" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.status')" prop="status">
            <h-select v-model="detailForm.status" placeholder="">
              <h-option v-for="item in statusList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="detailSearch()">{{$t('m.i.common.search')}}</h-button>
            <h-button type="ghost" @click="detailFormSearchReset()">{{$t('m.i.common.reset')}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <h-datagrid :columns="detailColumns"
                  highlight-row
                  url="/pc/archive/archiveMain/func_pagingQueryArchiveDetailList"
                  :bindForm="detailForm"
                  :onCurrentChange="handleDetailCurrentChange"
                  :onCurrentChangeCancel="handleDetailCurrentChangeCancel"
                  ref="detailDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @on-click="detailRollback()">{{$t("m.i.common.detailRollback")}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="detailWinClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
<!--        <h-button type="primary" v-else @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>-->
      </div>

    </h-msg-box>

  </div>
</template>

<script>
  import {on, off, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "archiveMain",
    data() {
      let _this = this;
      return {
        pageSizeParamValue: "",
        ifShowMore: false,
        //给按钮增加权限
        authObj: {
          collcetAuth: true,      //选择汇总
          queryLogAuth: true          //查询历史
        },
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.archiveDt"),
            key: "batchDt",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.archiveTaskNums'),
            key: "totalNum",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.successArchiveTaskNums"),
            key: "sucessNum",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.processMsg"),
            key: "processMsg",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.beginGmt'),
            key: "beginGmt",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.endGmt'),
            key: "endGmt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.status'),
            key: "status",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ArchiveStatus", params.row.status);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }, {
            title: this.$t('m.i.common.backStatus'),
            key: "backStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ArchiveBackStatus", params.row.backStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        detailColumns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.archiveDt"),
            key: "transDt",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.tableName"),
            key: "tableName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.taskName"),
            key: "taskName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.status'),
            key: "status",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ArchiveStatus", params.row.status);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.backStatus'),
            key: "backStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ArchiveBackStatus", params.row.backStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.archiveNum"),
            key: "totalNum",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.taskRunTime"),
            key: "taskRunTime",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.errorMsg"),
            key: "errorMsg",
            hiddenCol: false,
            sortable: true
          },

        ],
        formItem: {
          batchDt: "",
          status: "2",
        },
        detailForm: {
          status: "2",
        },
        type: null,
        isRequired: true,
        submitFlag: false,
        currentSelectList: [],
        currentSelectRowInx: [],
        currentDetailSelectList: [],
        currentDetailSelectRowInx: [],
        statusList: [],
        dictMap: new Map(),
        controlLogForm: {},
        showDetailWin: false,
        param: null,
        rows: null,
        selectFailureDt: {
          disabledDate(date) {
            let start = _this.$moment(formItem.activeDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0;
          }
        },
      };
    },
    components: {},
    methods: {
      formatTwoNumber(num) {
        debugger
        if (num) {
          let newNum = num + "";
          if (newNum.indexOf(".") != -1) {
            return num;
          } else {
            return num + (".00");
          }
        } else {
          return "0.00";
        }
      },

      formSearch() {
        this.currentSelectRow = [];
        this.formItem.batchDt = this.formItem.batchDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.batchDt = "";
        this.formItem.brchName = "";
        this.$refs.formItem.resetFields();
        this.formItem.status = "2";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },

      handleDetailCurrentChange(currentRow) {
        this.currentDetailSelectRow = currentRow;
      },
      handleDetailCurrentChangeCancel() {
        this.currentDetailSelectRow = [];
      },

      detailSearch() {
        this.currentDetailSelectRow = [];
        this.$refs.detailDatagrid.dataChange(1);
      },
      detailFormSearchReset() {
        this.detailForm.status = null;
      },

      batchRollback() {
        let list = this.currentSelectRow;
        if (list != null && list.length !== 0) {
            post({id: list.id}, "/pc/archive/archiveMain/func_rollbackByBatch").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.deleteFailed") + res.data.retMsg});
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
      },
      // 明细回滚
      detailRollback() {
        let list = this.currentDetailSelectRow;
        if (list != null && list.length !== 0) {
          if(list.status != "处理成功"){
            this.$msgTip.error(this, {info: this.$t("m.i.common.detailRollBackFailed")});
            return;
          }
          if (list.backStatus == "回退成功") {
            this.$msgTip.error(this, {info: this.$t("m.i.common.detailAlreadyRollBackFailed")});
          } else {
            post({id: list.id}, "/pc/archive/archiveMain/func_rollbackByDetail").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.detailDatagrid.dataChange(1);
                  this.currentDetailSelectRow = [];
                  this.currentDetailSelectList = [];
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.deleteFailed") + res.data.retMsg});
                  this.$refs.detailDatagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        // todo
      },
      //查询明细
      detailWinOpen() {
        let list = this.currentSelectRow;
        if (list != null && list.length !== 0) {
          this.detailForm.status = null;
          this.detailForm.batchId = list.id;
          this.showDetailWin = true;
          this.$nextTick(() => {
            this.detailSearch();
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
      },
      detailWinClose() {
        this.showDetailWin = false;
      },
      pickBillStock() {
        this.showDetailWin = false;
      }
    },
   /* created() {
      this.getDictListByGroups("ArchiveStatus").then(res => {
        this.statusList = res.get("ArchiveStatus");
        this.dictMap = res.get("map");
        this.formSearch();
      });
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    },*/
    mounted() {
      this.getDictListByGroups("ArchiveStatus").then(res => {
        this.statusList = res.get("ArchiveStatus");
        this.dictMap = res.get("map");
        this.formSearch();
      });
      this.pageSizeParamValue = parseInt(window.sessionStorage.getItem("pageSize"));
    }
  };
</script>

<style scoped>

</style>
