<!--承兑保证跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <show-branch v-model="formItem.rgstBrchName" :label="$t('m.i.ce.rgstBrchName')" prop="rgstBrchName"
                             v-if="!this.licenseFlag" required title="机构名称" :showCheckBox="false"  placeholder=""
                             :brchNo.sync="formItem.rgstBrchNo" :brchName.sync="formItem.rgstBrchName" >
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :validRules="billNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.rgstApplDt')" prop="rgstDt">
                  <h-date-picker :value="rgstDt" type="daterange" autoPlacement showFormat :editable=false
                                 placeholder="" @on-change="rgstDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.billMoney')" :prop="isMinBillMoney">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','min')" placeholder=""
                                   @on-focus="formatBillMoney('focus','min')"></h-typefield>
                    </h-col>
                    <h-col span="2"><span>至</span></h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','max')" placeholder=""
                                   @on-focus="formatBillMoney('focus','max')"></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.applStatus')" prop="applStatus">
                  <h-select v-model="formItem.applStatus" placeholder="" showTitle>
                    <h-option v-for="item in applStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
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
            url="/pb/guarntr/paperAcptGrnt/acptGuaranteeTrackQuery/func_list"
            :bindForm="formItem"
            :rowSelect="true"
            :has-select="hasSelect"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="acptGrntExport()" v-if="authObj.acptGrntExportAuth">{{$t('m.i.common.export')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { on, off,post, formatNumber, getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptGuaranteeTrackQuery",
    data() {
      return {
        tempShowExcelTemplateWin:false,
        param:"",
        rows:"",
        ifShowMore : false,
        //给按钮增加权限
        authObj : {
          acptGrntExportAuth: true        //导出
        },
        columns : [
          {
            type: "selection",
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.rgstBrchName"),
            key: "rgstBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.rgstDt"),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.rgstDt == null ? "" : this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.ce.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "openBankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.guarntrDt"),
            key: "guarnteeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.guarnteeDt == null ? "" : this.$moment(params.row.guarnteeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.guarantorBankName"),
            key: "acptGuarntrBankName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.failReason"),
            key: "applDraftErrorReason",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.applStatus"),
            key: "applStatus",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "GuarntrRgstStatus", params.row.applStatus);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
           title: this.$t("m.i.ce.acptSettleRgstRemark"),
            key: "guarntrApplRemark",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        formItem : {
          rgstBrchNo: "",
          rgstBrchName: "",
          billNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          rgstDtRange: "",
          applStatus: "",
          checkBrchNo:"",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:this.$store.getters.userInfo.brchName,
          ownedBrchNos:this.$store.getters.userInfo.brchNo,
          authPath: this.$route.path
        },
        rgstDt : [],
        guarnteeDt : [],
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        //区分最大和最小票据金额
        billMoneyType : "min",
        hasSelect : false,
        applStatusList : [],
        dictMap : new Map(),
        //showBranchWin : false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        auditMode: "1",  // 承兑保证登记单双岗模式：1-双岗（默认），0-单岗

      }
    },
    components: {

    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    methods: {
      formSearch() {
        this.hasSelect = true;
        let minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        let maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        if (parseFloat(minBillMoney) > parseFloat(maxBillMoney)) {
          this.$msgTip.info(this, { info: "票据金额区间输入有误" });
          return;
        }
        this.formItem.minBillMoney = minBillMoney;
        this.formItem.maxBillMoney = maxBillMoney;
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.rgstDtRange = "";
        this.rgstDt = [];
        this.$refs.formItem.resetFields();
         let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.rgstBrchNo = userInfo.brchNo;
        this.formItem.rgstBrchName = userInfo.brchName;
      },
      //导出
      acptGrntExport() {
        this.param = 'acptGuaranteeTrackQueryExport';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + '/pb/guarntr/paperAcptGrnt/acptGuaranteeTrackQuery/func_exportData';
        if(exportType === "1"){
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = { ids: this.$refs.datagrid.selectIds, field: field, exportType: exportType, excelName: this.param};
          }else {
            let formItem = this.formItem;
            formItem.rgstDt = null;
            params=Object.assign({ field: field, exportType: exportType, excelName: this.param},formItem)
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          if (this.$refs.datagrid.selectIds.length != 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      formatBillMoney(optType, itemType) {
        this.billMoneyType = itemType;
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
              this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
              this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      rgstDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.rgstDtRange = [arr[0].replace(/-/g, ""), arr[1].replace(/-/g, "")];
          this.dueDate = [arr[0],arr[1]];
        } else {
          this.formItem.rgstDtRange = "";
          this.dueDate = [];
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      // 查询业务参数：承兑保证登记单双岗模式：1-双岗（默认），0-单岗
      getBusinessParamValue() {
        return getSingleParamValuesByKeys("ce.guarntr.paper_acpt_rgst_audit_mode").then(res => {
          let auditMode = res['ce.guarntr.paper_acpt_rgst_audit_mode'];
          if (auditMode === "0") {
            this.auditMode = "0";
          }
        });
      }
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.rgstBrchNo = userInfo.brchNo;
      this.formItem.rgstBrchName = userInfo.brchName;
    },
    async mounted() {
      await this.getBusinessParamValue();
      this.getDictListByGroups("GuarntrRgstStatus,DraftTypeCode").then(res => {
        this.applStatusList = res.get("GuarntrRgstStatus");
        this.dictMap = res.get("map");
        this.applStatusList = this.applStatusList.filter(item => item.key !== "GR07");
        if (this.auditMode === "0") {
          this.applStatusList = this.applStatusList.filter(item => item.key !== "GR02" && item.key !== "GR06");
        }
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            this.licenseFlag = false;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
