<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-product v-model="formItem.prodName" @productSelectedChange="productSelectedChange"></show-product>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/prod/guideRate/rateTemplate/func_queryProductGuideRateHisByGroup"
                      :bindForm="formItem"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pass()" v-if="authObj.guideRecheckPass">{{$t('m.i.common.pass')}}</h-button>
              <h-button type="primary" @click="refuse()" v-if="authObj.guideRecheckRefuse">{{$t('m.i.common.refuse')}}</h-button>
              <h-button type="primary" @click="viewRateDetails()" v-if="authObj.guideRecheckView">{{$t('m.i.bm.viewRateDetails')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查看利率明细弹出框 -->
    <h-msg-box v-model="showRateDetailWin" width="800" class="h-form-table-layer" :maximize="true"
               :mask-closable="false">
      <!--弹出框模式标题-->
      <p slot="header">
        <span>查看利率明细</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="showRateColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/bm/prod/guideRate/guideRateMain/func_queryProductGuideRateHisByPage"
                    :bindForm="showRateFormItem"
                    :height="350"
                    ref="showRateDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="showRateDetailsWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "guideRateRecheck",
    data() {
      let formItem = {
        prodName: "",
        qryType: "1" //0-指导利率设置页面、1-指导利率复核页面、2-指导利率跟踪查询页面
      };
      let showRateFormItem = {
        prodNo: "",
        activeDt: "",
        operDtTm: "",
        operStatus: ""
      };
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
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
          hiddenCol: true,
          sortable: true
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.channelNameArray"),
          key: "channelNameArray",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.activeDt'),
          key: "activeDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.activeDt == null || params.row.activeDt === "") {
              return "";
            }
            let date = this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.common.createDt'),
          key: "operDtTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.operDtTm == null || params.row.operDtTm === "") {
              return "";
            }
            let date = this.$moment(params.row.operDtTm, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "operStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "AuditStatusCode", params.row.operStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        }
      ];
      let authObj = {
        guideRecheckPass: true,
        guideRecheckRefuse: true,
        guideRecheckView: true
      };
      return {
        formItem: formItem,
        showRateFormItem: showRateFormItem,
        columns: columns,
        authObj: authObj,
        showRateColumns: [],
        showRateDetailWin: false,
        selectData: null,
        dictMap: new Map(),
        prodMap: new Map()
      };
    },
    mounted() {
      this.getDictListByGroups("AuditStatusCode,DraftTypeCode,CDMedia,bankLevel,bankType,CorpScale,Yon").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      //选择产品名称弹出框确认
      productSelectedChange(arr) {
        this.formItem.prodName = arr[0].title;
      },
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //通过
      pass() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确认审核通过吗？",
          onOk: () => {
            this.passSubmit();
          }
        });
      },
      passSubmit() {
        let operDtTm = this.selectData.operDtTm;
        let operStatus = this.selectData.operStatus;
        let activeDt = this.selectData.activeDt;
        let prodNo = this.selectData.prodNo;
        let channelNoArray = this.selectData.channelNoArray;
        post({
          prodNo: prodNo,
          activeDt: activeDt,
          operStatus: operStatus,
          operDtTm: operDtTm,
          channelNoArray : channelNoArray
        }, "/bm/prod/guideRate/guideRateRecheck/func_passProductGuideRate").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //拒绝
      refuse() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定拒绝待审核数据吗？",
          onOk: () => {
            this.refuseSubmit();
          }
        });
      },
      refuseSubmit() {
        let operDtTm = this.selectData.operDtTm;
        let operStatus = this.selectData.operStatus;
        let activeDt = this.selectData.activeDt;
        let prodNo = this.selectData.prodNo;
        post({
          prodNo: prodNo,
          activeDt: activeDt,
          operStatus: operStatus,
          operDtTm: operDtTm
        }, "/bm/prod/guideRate/guideRateRecheck/func_refuseProductGuideRate").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //查看利率明细
      viewRateDetails() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.showRateDetailWin = true;
        this.$nextTick(async () => {
          await this.getKpiShowRateDetail();
          await this.getSysParamShowRateDetail();
          this.showRateFormItem.prodNo = this.selectData.prodNo;
          this.showRateFormItem.activeDt = this.selectData.activeDt;
          this.showRateFormItem.operDtTm = this.selectData.operDtTm;
          this.showRateFormItem.operStatus = this.selectData.operStatus;
          this.$refs.showRateDatagrid.dataChange(1);
        });
      },
      //查看利率明细关闭
      showRateDetailsWinClose() {
        this.showRateDetailWin = false;
      },
      getKpiShowRateDetail() {
        this.showRateColumns = [];
        let selectProductNo = this.selectData.prodNo;
        let channelNoArray = this.selectData.channelNoArray;
        return post({ prodNo: selectProductNo,channelNoArray:channelNoArray }, "/bm/prod/guideRate/guideRateRecheck/func_queryProductRateKpi").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.showRateColumns.push(
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
                align: "left",
                hiddenCol: false
              },
              {
                title: this.$t("m.i.common.channelNameArray"),
                key: "channelNameArray",
                sortable: true,
                hiddenCol: true
              },
              {
                title: this.$t('m.i.billInfo.billType'),
                key: "billType",
                align: "left",
                hiddenCol: false,
                render: (h, params) => {
                  return h("span", getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
                }
              }
            );
            for (let item of data) {
              if (item.kpiCode === "isGreenCorp") {
                this.showRateColumns.push({
                  title: this.$t('m.i.common.isGreenCorpFdisc'),
                  key: "isGreenCorp",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp));
                  }
                });
              }
              if (item.kpiCode === "isArc") {
                this.showRateColumns.push({
                  title: this.$t('m.i.common.isArcFdisc'),
                  key: "isArc",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isArc));
                  }
                });
              }
              if (item.kpiCode === "billClass") {
                this.showRateColumns.push({
                  title: this.$t('m.i.billInfo.billClass'),
                  key: "billClass",
                  align: "left",
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass));
                  }
                });
              }
              ;
              if (item.kpiCode === "acptBankLevel") {
                this.showRateColumns.push({
                  title: this.$t('m.i.billInfo.acptTopBankLevel'),
                  key: "acptBankLevel",
                  align: "left",
                  ellipsis: false,
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevel));
                  }
                });
              } else if (item.kpiCode === "acptBankType") {
                this.showRateColumns.push({
                  title: "承兑行类型",
                  key: "acptBankType",
                  align: "left",
                  ellipsis: false,
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankType", params.row.acptBankType));
                  }
                });
              } else if (item.kpiCode === "discBankLevel") {
                this.showRateColumns.push({
                  title: "贴现行级别",
                  key: "discBankLevel",
                  align: "left",
                  ellipsis: false,
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.discBankLevel));
                  }
                });
              }else if (item.kpiCode === "discBankType") {
                this.showRateColumns.push({
                  title: "贴现行类型",
                  key: "discBankType",
                  align: "left",
                  ellipsis: false,
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "bankType", params.row.discBankType));
                  }
                });
              } else if (item.kpiCode === "corpType") {
                this.showRateColumns.push({
                  title: this.$t('m.i.common.corpScale'),
                  key: "corpType",
                  align: "left",
                  ellipsis: false,
                  hiddenCol: false,
                  render: (h, params) => {
                    return h("span", getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpType));
                  }
                });
              } else if (item.kpiCode === "billMoney") {
                this.showRateColumns.push({
                  title: "最小票面金额(元)",
                  key: "minBillAmt",
                  align: "left",
                  hiddenCol: false
                }, {
                  title: "最大票面金额(元)",
                  key: "maxBillAmt",
                  align: "left",
                  hiddenCol: false
                });
              } else if (item.kpiCode === "remainDays") {
                this.showRateColumns.push({
                  title: "最小剩余期限(天)",
                  key: "minResidualTerm",
                  align: "left",
                  hiddenCol: false
                }, {
                  title: "最大剩余期限(天)",
                  key: "maxResidualTerm",
                  align: "left",
                  ellipsis: false,
                  hiddenCol: false
                });
              } else if (item.kpiCode === "remainMonths") {
                this.showRateColumns.push({
                  title: "最小剩余跨月数量(月)",
                  key: "minResidueMonthNum",
                  align: "left",
                  hiddenCol: false
                }, {
                  title: "最大剩余跨月数量(月)",
                  key: "maxResidueMonthNum",
                  align: "left",
                  hiddenCol: false
                });
              }
            }
            this.showRateColumns.push({
              title: "指导利率(%)",
              key: "ratePct",
              sortable: true,
              align: "left",
              hiddenCol: false
            });
          }
          //判断是否添加渠道字段
          this.showRateColumns.splice(3,0,{
            title: this.$t("m.i.common.channelNameArray"),
            key: "channelNameArray",
            sortable: true,
            hiddenCol: !this.isChannelMode(selectProductNo)
          });
        });
      },
      getSysParamShowRateDetail() {
        return post({}, "/bm/prod/guideRate/getParamValues").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let list = res.data.retData;
              if (list.costRateBoolean === true) {
                this.showRateColumns.push(
                  {
                    title: "成本利率(%)",
                    key: "costRatePct",
                    hiddenCol: false,
                    align: "left"
                  }
                );
              }
              this.$nextTick(() => {
                this.$refs.showRateDatagrid.createShowCol(this.showRateColumns);
              });
            }
          }
        });
      },

      //判断是否是渠道模式
      isChannelMode(prod){
        this.prodMap.set("010612",true);
        return this.prodMap.get(prod);
      },
    }
  };
</script>

<style scoped>

</style>
