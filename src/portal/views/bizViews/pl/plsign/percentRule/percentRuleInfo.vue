<!--票据池签约管理-签约管理-设置打折比例-->
<template>
  <h-msg-box v-model="tempPercentRuleWin" width="1000" :mask-closable="false" @on-close="handleWinClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>设置打折比例</span>
    </p>
    <div>
      <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
        <h-form-item prop="isRecalculate" :label="$t('m.i.pl.isRecalculate')" :required="!percentRuleParams.isFirst"
                     class="h-form-long-label" v-if="!percentRuleParams.isFirst">
          <h-select v-model="addOrEditForm.isRecalculate" placeholder="">
            <h-option v-for="item in this.YonList" :value="item.key" :key="item.key">{{ item.value }}
            </h-option>
          </h-select>
        </h-form-item>
      </h-form>
      <h-datagrid :columns="percentRuleColumns"
                  :autoLoad="false"
                  :gridData="percentRuleData"
                  @on-page-change="handlePage"
                  highlight-row
                  ref="percentRuleDatagrid" class="pl-5 pr-5">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="exportPercentRule">{{$t('m.i.common.export')}}</h-button>
          <h-button type="primary" @click="importExcel()" >{{$t('m.i.common.import')}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
    <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
      @importSuccess="importSuccess"></common-file-upload-no-show>
  </h-msg-box>
</template>

<script>
  import {accDiv, accMul, formatNumber, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "percentRuleInfo",
    components: {},
    data() {
      let fileParams = {
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pl/plsign/percentRules/billAgreementMain/func_importPercentRule",  //excel数据导入接口
        //调用excel数据解析接口时附带的额外参数
        uploadParams: {
          code: ""
        }
      };
      return {
        percentRuleFormItem : {
          agreeId: "",
          agreementNo: "",
          saleOffMode: ""
        },
        percentRuleColumns : [],
        percentRuleData : {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        submitFlag : false,
        addOrEditForm : {
          isRecalculate: "0"
        },
        submitPercentRuleMap : new Map(),
        queryParam : {},
        cannotSubmit : false,
        cannotSecondSubmit : false,
        YonList : [],
        fileParams: fileParams,
        importWin: false,

      };
    },
    props: {
      percentRuleWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      percentRuleParams: {
        type: Object,
        default: {
          isFirst: true,
          agreeId: "",
          agreementNo: "",
          saleOffMode: "",
          custNo: "",
          dictMap: new Map(),
          YonList: ""
        }
      }
    },
    computed: {
      tempPercentRuleWin: {
        get() {
          return this.percentRuleWin;
        },
        set() {
        }
      }
    },
    watch: {
      percentRuleWin(val) {
        this.addOrEditForm.isRecalculate = "0";
        this.submitPercentRuleMap = new Map();
        if (val) {
          this.$nextTick(() => {
            if (this.percentRuleParams.isFirst) {
            this.queryUrl = "/pl/plsign/billAgreementMain/func_paginQueryRulesTemplateDtos";
            this.queryParam = {
              templateType: "2",
              custNo: this.percentRuleParams.custNo
            };
          }else {
              this.queryUrl = "/pl/plsign/percentRules/pagingQueryPercentRules";
            this.queryParam = {
              agreeId: this.percentRuleParams.agreeId,
              agreementNo: this.percentRuleParams.agreementNo
            };
          }
          this.percentRuleFormItem.agreeId = this.percentRuleParams.agreeId;
          this.percentRuleFormItem.agreementNo = this.percentRuleParams.agreementNo;
          this.percentRuleFormItem.saleOffMode = this.percentRuleParams.saleOffMode;
          this.YonList = this.percentRuleParams.YonList;
          this.getKpiView();
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.percentRuleDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      getKpiView() {
        this.percentRuleColumns = [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          }
        ];
        post({
          custNo: this.percentRuleParams.custNo,
          kpiScene:"2"
        }, "/pl/plsign/billAgreementMain/func_paginQueryCustRulesKpi").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let data = res.data.retData.list;
              for (let item of data) {
                if(item.kpiCodeArray != null) {
                  if (item.kpiCodeArray.indexOf("billClass") >= 0) {
                    this.percentRuleColumns.push({
                      title: this.$t("m.i.billInfo.billClass"),
                      key: "billClass",
                      hiddenCol: false,
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.percentRuleParams.dictMap, "CDMedia", params.row.billClass);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      }
                    });
                  }
                  if (item.kpiCodeArray.indexOf("billType") >= 0) {
                    this.percentRuleColumns.push({
                      title: this.$t("m.i.billInfo.billType"),
                      key: "billType",
                      hiddenCol: false,
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.percentRuleParams.dictMap, "DraftTypeCode", params.row.billType);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      }
                    });
                  }
                  if (item.kpiCodeArray.indexOf("billMoney") >= 0) {
                    this.percentRuleColumns.push({
                      title: this.$t("m.i.billInfo.minBillPackageMoney"),
                      key: "minBillAmt",
                      hiddenCol: false,
                      render: (h, params) => {
                        let billMoney = formatNumber(params.row.minBillAmt, 2, ",");
                        return h("span", {
                          domProps: {
                            title: billMoney
                          }
                        }, billMoney);
                      }
                    }, {
                      title: this.$t("m.i.billInfo.maxBillPackageMoney"),
                      key: "maxBillAmt",
                      hiddenCol: false,
                      render: (h, params) => {
                        let billMoney = formatNumber(params.row.maxBillAmt, 2, ",");
                        return h("span", {
                          domProps: {
                            title: billMoney
                          }
                        }, billMoney);
                      }
                    });
                  }
                  if (item.kpiCodeArray.indexOf("acptBankLevel") >= 0) {
                    this.percentRuleColumns.push({
                      title: this.$t("m.i.billInfo.acptTopBankLevel"),
                      hiddenCol: false,
                      key: "acptBankLevel",
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.percentRuleParams.dictMap, "bankLevel", params.row.acptBankLevel);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      }
                    });
                  }
                  if (item.kpiCodeArray.indexOf("acptBankType") >= 0) {
                    this.percentRuleColumns.push({
                      title: this.$t("m.i.billInfo.acptBankType"),
                      hiddenCol: false,
                      key: "acptBankType",
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.percentRuleParams.dictMap, "bankType", params.row.acptBankType);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      }
                    });
                  }
                  if (item.kpiCodeArray.indexOf("acptCustLevel") >= 0) {
                    this.percentRuleColumns.push({
                      title: this.$t("m.i.billInfo.acptCustLevel"),
                      hiddenCol: false,
                      key: "acptCustLevel",
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.percentRuleParams.dictMap, "custLevel", params.row.acptCustLevel);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      }
                    });
                  }
                  if (item.kpiCodeArray.indexOf("corpType") >= 0) {
                    this.percentRuleColumns.push({
                      title: this.$t("m.i.common.corpScale"),
                      hiddenCol: false,
                      key: "corpType",
                      render: (h, params) => {
                        let dictValue = this.getDictValueFromMap(this.percentRuleParams.dictMap, "CorpScale", params.row.corpType);
                        return h("span", {
                          domProps: {
                            title: dictValue
                          }
                        }, dictValue);
                      }
                    });
                  }
                  if (item.kpiCodeArray.indexOf("remainDays") >= 0) {
                    this.percentRuleColumns.push({
                      title: this.$t("m.i.pl.minResidualTerm"),
                      key: "minResidualTerm",
                      hiddenCol: false
                    }, {
                      title: this.$t("m.i.pl.maxResidualTerm"),
                      key: "maxResidualTerm",
                      hiddenCol: false
                    });
                  }
                  if (item.kpiCodeArray.indexOf("remainMonths") >= 0) {
                    this.percentRuleColumns.push({
                     title: this.$t("m.i.pl.minResidueMonthNum"),
                      key: "minRemainMonthNum",
                      hiddenCol: false
                    }, {
                      title: this.$t("m.i.pl.maxResidueMonthNum"),
                      key: "maxRemainMonthNum",
                      hiddenCol: false
                    });
                  }
                }
              }
              this.percentRuleColumns.push({
                title: this.$t("m.i.pl.discountPcet"),
                key: "discountPcet",
                hiddenCol: false,
                render: (h, params) => {
                  let inp = h("input",
                    {
                      domProps: {
                        name: "discountPcet",
                        value: accMul(params.row.discountPcet, 100),
                      },
                      on: {
                        blur: (event) => {
                          this.discountPcetChange(params.row, event.currentTarget.value);
                        }
                      }
                    });
                  return h("div", [inp]);
                }
              });
              this.getPercentRuleDataList();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        });
      },
      discountPcetChange(percentRule, discountPcet) {
        let tempPercentRule = this.deepClone(percentRule);
        if(this.submitPercentRuleMap.get(tempPercentRule.id) !== undefined) {
          this.submitPercentRuleMap.get(tempPercentRule.id).discountPcet=discountPcet;
        }else {
          tempPercentRule.agreeId = this.percentRuleParams.agreeId;
          tempPercentRule.agreementNo = this.percentRuleParams.agreementNo;
          tempPercentRule.discountPcet = discountPcet;
          this.submitPercentRuleMap.set(tempPercentRule.id,tempPercentRule)
        }
        let el = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100\.0|100\.00|0|0\.0|0\.00)$/;
        if (!(el.test(discountPcet) || discountPcet === "" || discountPcet === null || discountPcet === undefined)) {
          this.$msgTip.info(this, { info: "打折比例为0~100，小数位不超过2位!" });
          return;
        }
      },
      // 分页事件
      handlePage(pageNo, pageSize) {
        this.queryParam.pageNo = pageNo;
        this.queryParam.pageSize = pageSize;
        this.getPercentRuleDataList();
      },
      //获取打折比例指标
      getPercentRuleDataList() {
        post(this.queryParam, this.queryUrl).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData.list;
                if (data.length === 0) {
                  this.$msgTip.info(this, { info: "打折比例指标未设置，请先维护！" });
                  this.percentRuleData = null;
                  return;
                } else {
                  for (let i = 0; i < data.length; i++) {
                    if(this.submitPercentRuleMap.get(data[i].id) !== undefined) {
                      data[i].discountPcet = this.submitPercentRuleMap.get(data[i].id).discountPcet;
                      data[i].discountPcet = accDiv(data[i].discountPcet, 100);
                    }
                  }
                  this.percentRuleData = res.data.retData;
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      handleWinClose() {
        //this.$refs.percentRuleDatagrid.$refs.gridPage.clearElevator();
        this.$emit("percentRuleWinClose", "");
      },
      submitForm() {
        this.cannotSubmit = false;
        this.cannotSecondSubmit = false;
        if (this.percentRuleParams.isFirst) {
          this.submitPercentRuleMap.forEach((value,key)=>{
            let el = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100\.0|100\.00|0|0\.0|0\.00)$/;
            if (!(el.test(value.discountPcet) || value.discountPcet === "" || value.discountPcet === null || value.discountPcet === undefined)) {
              this.cannotSubmit = true;
            }
          });
          if (this.cannotSubmit) {
            this.$msgTip.info(this, { info: "打折比例为0~100，小数位不超过2位!" });
            return;
          }
          let count = 0;
          this.submitPercentRuleMap.forEach((value,key)=>{
            if (value.discountPcet !== "" && value.discountPcet !== null && value.discountPcet !== undefined) {
              count++;
            }
          });
          if (count < this.$refs.percentRuleDatagrid.total) {
            this.$msgTip.info(this, { info: "存在未输入打折比例的数据，请检查！" });
            return;
          }
        }else {
          this.submitPercentRuleMap.forEach((value,key)=>{
            let el = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100\.0|100\.00|0|0\.0|0\.00)$/;
            if (!(el.test(value.discountPcet))) {
              this.cannotSubmit = true;
            }
            if (value.discountPcet === "" || value.discountPcet === null || value.discountPcet === undefined) {
              this.cannotSecondSubmit = true;
            }
          });
          if (this.cannotSecondSubmit) {
            this.$msgTip.info(this, { info: "存在未输入打折比例的数据，请检查！" });
            return;
          }
          if (this.cannotSubmit) {
            this.$msgTip.info(this, { info: "打折比例为0~100，小数位不超过2位!" });
            return;
          }
        }
        if (!this.percentRuleParams.isFirst) {
          this.$refs["addOrEditForm"].validate(valid => {
            if (valid) {
              this.$emit("percentRuleSubmit", this.submitPercentRuleMap, this.addOrEditForm.isRecalculate,this.percentRuleParams.custNo);
            }
          });
        } else {
          this.$emit("percentRuleSubmit", this.submitPercentRuleMap);
        }
      },
      //模板下载
      exportPercentRule() {
        if (this.$refs.percentRuleDatagrid.total == 0) {
          this.$msgTip.info(this, { info: "打折比例指标未设置，请先维护！" });
          return;
        }
        let url = window.LOCAL_CONFIG.API_HOME + "/pl/plsign/percentRules/billAgreementMain/func_exportPercentRule";
        let form = document.createElement("form");
        form.innerHTML = `<input type="text" name="code" value="${this.percentRuleParams.custNo}"/>`
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //导入excel
      importExcel() {
        this.fileParams.uploadParams.code = this.percentRuleParams.custNo;
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.queryUrl = "/pl/plsign/percentRules/pagingQueryPercentRules";
        this.queryParam = {
          agreeId: this.percentRuleParams.agreeId,
          agreementNo: this.percentRuleParams.agreementNo
        };
        this.$refs.percentRuleDatagrid.dataChange(1);
        this.percentRuleParams.isFirst = false;
      },
    },
  };
</script>

<style scoped>

</style>
