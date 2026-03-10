<!--投资管理-授信准备-新增、修改、查看弹出框-->
<template>
    <div>
        <h-msg-box v-model="tempstdCreditGrantAddOrEditWin" :mask-closable="false" @on-close="handleClose"
                   width="1000" class="h-form-search-layer" :footerHide="true">
            <p slot="header">
                <span>授信释放</span>
            <div>
                <h-form :model="releaseForm" :label-width="115" ref="releaseForm" cols="3" class="h-form-search">
                    <!--标票产品名称-->
                    <common-input v-model="releaseForm.stdProductName" :label="$t('m.i.bs.stdProductName')"
                                  prop="stdProductName"     :maxlength="60"  :readonly="true"></common-input>
                    <!-- 标票产品代码 -->
                    <common-input v-model="releaseForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo"     :readonly="true"   :maxlength="9"></common-input>

                    <!-- 产品规模 -->
                    <common-type-field v-model="releaseForm.creationAmt" :label="$t('m.i.bs.investManage.creationAmt')"    :readonly="true"     prop="creationAmt"

                                       :bigTips="false"></common-type-field>

                    <!-- 投资金额 -->
                    <common-type-field v-model="releaseForm.investPayAmt" :label="$t('m.i.bs.investManage.investPayAmt')"  :readonly="true" prop="investPayAmt"
                                       :validRules="investPayAmtRule" :required="true" :bigTips="false"></common-type-field>

                    <!--投资日期-->
                    <common-date-picker v-model="releaseForm.investDt" :label="$t('m.i.bs.investManage.investDt')" prop="investDt"    :readonly="true"></common-date-picker>
                    <!--占用状态-->
                    <common-select v-model="releaseForm.occupyStatus" :label="$t('m.i.bs.investManage.occupyStatus')"  :readonly="true"    prop="occupyStatus"
                                   :dictList="batchParams.occupyStatusList"></common-select>

                    <!-- 本次释放金额 -->
                    <common-type-field v-model="releaseForm.thisReleaseAmt" :label="$t('m.i.bs.investManage.thisReleaseAmt')"  :readonly="false" prop="thisReleaseAmt"
                                       :validRules="thisReleaseAmtRule" :required="true" :bigTips="false"></common-type-field>
                </h-form>
            </div>
            <!-- 数据展示表格 -->
            <h-datagrid
                    :columns="columns"
                    highlightRow
                    :autoLoad=false
                    url="/bs/investmanage/creditgrant/stdCreditGrantApply/func_queryStdCreditDetailPage"
                    :bindForm="detailFormItem"
                    :has-select="false"
                    rowSelect
                    ref="datagrid">
                <div slot="toolbar" class="pull-left">
                    <h-button type="primary" @click="adjustReleaseCreditGrantObj()">
                        {{$t('m.i.common.adjustRelease')}}
                    </h-button>
                    <h-button type="primary" @click="releaseCreditGrantObj()">
                        {{$t('m.i.common.release')}}
                    </h-button>
                </div>
            </h-datagrid>
        </h-msg-box>

    </div>
</template>

<script>
    import {formatNumber, post} from "@/api/bizApi/commonUtil";

    export default {
        name: "stdCreditGrantRelease",

        data() {
            return {
                batchId: "",
                editFlag: false,
                releaseForm: {
                    id: "",
                    legalNo: "",
                    memberId: "",
                    batchNo: "",
                    stdProductName: "",
                    stdProductNo: "",
                    creationAmt: "",
                    investPayAmt: "",
                    thisReleaseAmt: "",
                    investDt: "",
                    occupyStatus: "",
                    isDelete: ""
                },
                detailFormItem: {batchId: this.batchId},

                columns: [
                    {
                        type: 'selection',
                        width: 50,
                        hiddenCol: false,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        title: this.$t("m.i.common.index"),
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: this.$t('m.i.bs.investManage.custType'),
                        key: 'custType',
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, 'CreditCustType', params.row.custType);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }

                    },
                    {
                        title: this.$t('m.i.bs.investManage.custNo'),
                        key: 'custNo',
                        sortable: true,
                        hiddenCol: false,
                    },
                    {
                        title: this.$t('m.i.bs.investManage.custName'),
                        key: 'custName',
                        sortable: true,
                        hiddenCol: false,
                    },
                    {
                        title: this.$t('m.i.bs.investManage.creditAmt'),
                        key: 'release-creditAmt',
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.creditAmt, 2, ','))
                        }
                    },
                    {
                        title: this.$t('m.i.bs.investManage.releasedAmt'),
                        key: 'releasedAmt',
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.releasedAmt, 2, ','))
                        }
                    },
                    {
                        title: this.$t('m.i.bs.investManage.releasableAmt'),
                        key: 'releasableAmt',
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                            return h('span', formatNumber(params.row.releasableAmt, 2, ','))
                        }
                    },
                    {
                        title: this.$t('m.i.bs.investManage.thisReleaseAmt'),
                        key: 'thisReleaseAmt',
                        sortable: true,
                        hiddenCol: false,
                        render: (h, params) => {
                          let isShow = false;
                          if(params.row.occupyStatus==="2" || params.row.occupyStatus==="0"){
                            isShow=true;
                          }
                          let inp = h("input",
                            {
                              domProps: {
                                name: "thisReleaseAmt",
                                value:  formatNumber(params.row.thisReleaseAmt, 2, ','),
                                readOnly: isShow,
                                disabled:isShow
                              },
                              on: {
                                focus:(event) => {
                                  event.target.value=this.formatNumberRelease(params.row.thisReleaseAmt, 2, '');
                                },
                                blur:(event) => {
                                  event.target.value=formatNumber(event.target.value, 2, ',');
                                },
                                change: (event) => {
                                  this.regulateInfo(event,params.row.id,params.row.thisReleaseAmt, params.row.releasableAmt,event.currentTarget.value);
                                }
                              }
                            });
                          return h("div", [inp]);
                        }
                    },
                    {
                        title: this.$t('m.i.bs.investManage.occupyStatus'),
                        key: "occupyStatus",
                        hiddenCol: false,
                        sortable: true,
                        render: (h, params) => {
                            let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, 'DetailOccupyStatus', params.row.occupyStatus);
                            return h("span", {
                                domProps: {
                                    title: dictValue
                                }
                            }, dictValue);
                        }
                    }
                ],


                cpesProductBranchSubmit(info) {
                    if (info === null) {
                        this.$msgTip.error(this, {info: "请先选择记录！"});
                        return;
                    }
                    this.releaseForm.stdProductNo = info.brchCode;
                    this.releaseForm.stdProductName = info.brchFullNameZh;
                    this.releaseForm.stdProductShortName = info.brchShortNameZh;
                    this.cpesProductBranch = false;
                },
                options3: {
                    disabledDate (date) {
                        return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
                    }
                },
                creationAmtRule: [{
                    test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
                    trigger: "blur",
                    message: "产品规模(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
                }],
                investPayAmtRule: [{
                    test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
                    trigger: "blur",
                    message: "投资金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
                }],
                thisReleaseAmtRule: [{
                  test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
                  trigger: "blur",
                  message: "本次释放金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
                }],
                validateStdProductNo(rule, value, callback) {
                    if (value) {
                            let leg = this.getLength(value);
                        if (leg !== 9) {
                           callback(new Error("标票产品代码必须是9位数字"));
                        } else {
                         callback();
                        }
                    } else {
                        callback();
                    }
                },
                stdProductNoRule: [{test: this.validateStdProductNo, trigger: "blur"}],
                addObjOrEditObjWin: false,
                creditDetailParams: {},
                productBrchType: "7",
                cpesProductBranch: false
            };
        },


        props: {
            stdCreditGrantReleaseWin: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            batchParams: {
                type: Object,
                default() {
                    return {};
                }
            }

        },
        computed: {
            tempstdCreditGrantAddOrEditWin: {
                get() {
                    return this.stdCreditGrantReleaseWin;
                },
                set() {
                }
            }
        },
        watch: {
            stdCreditGrantReleaseWin(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.batchId = this.batchParams.batchId;
                        this.editFlag = this.batchParams.editFlag;
                        this.queryObjById();

                    });
                }
            },
            batchId(val) {
                this.batchId = val;
            }
        },
        methods: {
          formatNumberRelease(num, precision, separator) {
            var parts;
            // 判断是否为数字
            if (!isNaN(parseFloat(num)) && isFinite(num)) {
              // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
              // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
              // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
              // 的值变成了 12312312.123456713
              num = Number(num);
              // 处理小数点位数
              num = (typeof precision !== "undefined" ? (Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision) : num).toString();
              // 分离数字的小数部分和整数部分
              parts = num.split(".");
              // 整数部分加[separator]分隔, 借用一个著名的正则表达式
              parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + separator);

              return parts.join(".");
            }
            return !!num ? num : "-";
          },
          //释放
          releaseCreditGrantObj() {
            let listIds=this.$refs.datagrid.selectIds;
            let thisReleaseAmt = Number(this.releaseForm.thisReleaseAmt);
            if(thisReleaseAmt>0 && thisReleaseAmt!= null){
              let params = {id: this.batchId,listIds:listIds,thisReleaseAmt:thisReleaseAmt};
              let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_releaseStdInvestCredit";
              post(params, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.queryObjById(this.$refs.datagrid.pageInfo.pageNo);
                  } else {
                    if (res.data.retData && res.data.retData.erroMsg) {
                      this.$msgTip.error(this, {info: res.data.retData.erroMsg});
                    } else {
                      this.$msgTip.error(this, {info: res.data.retMsg});
                    }
                    this.queryObjById(this.$refs.datagrid.pageInfo.pageNo);
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }
              });
            } else {
              this.$msgTip.error(this, {info: "请输入本次释放金额(元)"});
            }

          },

          //调整释放
          adjustReleaseCreditGrantObj() {
            let listIds=this.$refs.datagrid.selectIds;
            let thisReleaseAmt = Number(this.releaseForm.thisReleaseAmt);
            if(thisReleaseAmt>0 && thisReleaseAmt!= null){
              let params = {id: this.batchId,listIds:listIds,thisReleaseAmt:thisReleaseAmt};
              let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_adjustReleaseStdInvestCredit";
              post(params, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.queryObjById(this.$refs.datagrid.pageInfo.pageNo);
                  } else {
                    if (res.data.retData && res.data.retData.erroMsg) {
                      this.$msgTip.error(this, {info: res.data.retData.erroMsg});
                    } else {
                      this.$msgTip.error(this, {info: res.data.retMsg});
                    }
                    this.queryObjById(this.$refs.datagrid.pageInfo.pageNo);
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }
              });
            } else {
              this.$msgTip.error(this, {info: "请输入本次释放金额(元)"});
            }

          },

          regulateInfo(event,listId,thisReleaseAmt, releasableAmt,newThisReleaseAmt) {
              newThisReleaseAmt=newThisReleaseAmt.replace(",","");
              let numReg = /^(?:[1-9]\d{0,15})(?:\.\d{1,2})?$/;
              let numRe = new RegExp(numReg);
              if (!numRe.test(newThisReleaseAmt)) {
                this.$msgTip.error(this, {info: "释放额度必须是大于0的数字，最多16位整数且小数位不超过两位"});
                event.target.value = formatNumber(thisReleaseAmt, 2, ',');
                return;
              }
              if (newThisReleaseAmt > releasableAmt){
                  event.target.value = formatNumber(thisReleaseAmt, 2, ',');
                  this.$msgTip.error(this, {info: "释放额度必须小于等于可释放额度"});
                  return;
              }
              let params = {batchId: this.batchId,id:listId,thisReleaseAmt:newThisReleaseAmt};
              let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_adjustmentReleaseAtm";
              this.sendPost(params, url, res => {
                this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
              });
          },
          //根据批次Id查询批次信息
          queryObjById(pageNo) {
              let params = {id: this.batchId};
              let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_getStdCreditBatchById";
              post(params, url).then(res => {
                  if (res) {
                      let retCode = res.data.retCode;
                      if (retCode === "000000") {
                          let  obj = res.data.retData;
                          this.releaseForm.id = obj.id;
                          this.releaseForm.legalNo = obj.legalNo;
                          this.releaseForm.memberId = obj.memberId;
                          this.releaseForm.batchNo = obj.batchNo;
                          this.releaseForm.occupyStatus = obj.occupyStatus;
                          if (obj.stdProductName) {
                              this.releaseForm.stdProductName = obj.stdProductName;
                          }
                          if (obj.stdProductShortName) {
                              this.releaseForm.stdProductShortName = obj.stdProductShortName;
                          }
                          if (obj.stdProductNo) {
                              this.releaseForm.stdProductNo = obj.stdProductNo;
                          }
                          if (obj.creationAmt) {
                              this.releaseForm.creationAmt = obj.creationAmt === null ? "" : obj.creationAmt.toString();
                          }
                          if (obj.investPayAmt) {
                              this.releaseForm.investPayAmt = obj.investPayAmt === null ? "" : obj.investPayAmt.toString();

                          }
                          if (obj.thisReleaseAmt) {
                            this.releaseForm.thisReleaseAmt = obj.thisReleaseAmt === null ? "" : obj.thisReleaseAmt.toString();

                          }
                          this.releaseForm.investDt = obj.investDt === null ? "" : obj.investDt.toString();
                          this.detailFormItem.batchId = obj.id;
                          this.handleSearch(pageNo);
                      } else {
                          this.$msgTip.error(this, {info: res.data.retMsg});
                      }
                  } else {
                      this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                  }
              });
          },
          handleSearch(pageNo) {
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
          },
          //关闭弹窗
          handleClose() {
              this.$refs.releaseForm.resetFields();
              this.releaseForm.id = "";
              this.batchId = "";
              this.$refs.datagrid.tData=[];
              this.$emit("stdCreditGrantReleaseOpenClose", "");
          },
          sendPost(params, url, callback) {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  callback();
                } else {
                  if (res.data.retData && res.data.retData.erroMsg) {
                    this.$msgTip.error(this, {info: res.data.retData.erroMsg});
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }

                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }

        }
    };
</script>

<style scoped>

</style>
