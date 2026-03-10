<!--承兑保证登记复核-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.rangeApplDt')" prop="guarnteeDt">
                  <h-date-picker v-model="formItem.guarnteeDt" type="date" showFormat :editable=false placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">查询</h-button>
                  <h-button type="ghost" @click="formSearchReset()">重置</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pb/guarntr/paperAcptGrnt/acptGuaranteeRecheck/func_list"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            :has-select="false"
            :auto-load="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="acptGrntRecheck('pass')" v-if="authObj.acptGrntPass">通过</h-button>
              <h-button type="primary" @click="acptGrntRecheck('refuse')" v-if="authObj.acptGrntRefuse">驳回
              </h-button>
              <h-button type="primary" @click="acptGrntDetail" v-if="authObj.acptGrntDetailAuth">详情信息</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--详情信息弹出窗-->
    <h-msg-box v-model="detailWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>详情信息展示</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <show-branch v-model="addForm.ownedBrchNo" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" title="机构名称"
                       :filterable="this.type==='add'" :required="isRequired" :showCheckBox="false" v-if="this.licenseFlag" :msgBoxWin="addOrEditWin"
                       :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName" :params="{authPath: this.authPath}" @brchNoChange="licenseBrchNoChange"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
            <h-select v-model="addForm.billType" placeholder="" readonly showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
            <h-input v-model="addForm.billNo" :maxlength="16" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.billMoney')" prop="billMoney">
            <h-input v-model="addForm.billMoney" :maxlength="20" placeholder="数字，小数位最多2位" readonly></h-input>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
            <h-date-picker v-model="addForm.dueDt" type="date" showFormat :editable=false readonly placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item prop="openBankNo" :label="$t('m.i.billInfo.acptBankNo')">
            <h-input v-model="addForm.openBankNo" :maxlength="12" placeholder="12位数字" readonly></h-input>
          </h-form-item>
          <h-form-item prop="guarnteeDt" :label="$t('m.i.be.rangeApplDt')">
            <h-date-picker v-model="addForm.guarnteeDt" type="date" showFormat :editable=false readonly placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.guarantorBankNo')" prop="acptGuarntrBankNo">
            <h-input v-model="addForm.acptGuarntrBankNo" :maxlength="12" placeholder="12位数字" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptGuarntrBankName" :label="$t('m.i.ce.guarantorBankName')">
            <h-input v-model="addForm.acptGuarntrBankName" :maxlength="126" readonly></h-input>
          </h-form-item>
          <h-form-item prop="guarntrApplRemark" :label="$t('m.i.common.remark')">
            <h-input type="textarea" :rows=3 v-model="addForm.guarntrApplRemark" :canResize="false" :maxlength="500" readonly></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptGuaranteeRecheck",
    data() {
      return {
        //给按钮增加权限
        authObj : {
          acptGrntPass: true,           //通过
          acptGrntRefuse: true,         //驳回
          acptGrntDetailAuth: true      //详情信息
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",
            ellipsis:false,
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            key: "ownedBrchNo",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
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
            title: this.$t("m.i.billInfo.transToBankName"),
            key: "acptGuarntrBankName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
          }
        ],
        formItem : {
          billNo: "",
          guarnteeDt: "",
          applStatusList : ['GR02','GR05'],
          applTellerNoNotEqual : this.$store.getters.userInfo.userNo,
          auditModeKey : 'ce.guarntr.paper_acpt_is_rgst_check_exclude',
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          operSite: "2", //复核
          authPath: this.$route.path
        },
        addForm : {
          id: "",
          billId: "",
          billType: "",
          billNo: "",
          billMoney: "",
          dueDt: "",
          openBankNo: "",
          guarnteeDt: "",
          acptGuarntrBankNo: "",
          acptGuarntrBankName: "",
          guarntrApplRemark: "",
          ownedBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchName:this.$store.getters.userInfo.brchName,
          licenseFlag:false,
        },
        currentSelectRow : null,
        billTypeList : [],
        dictMap : new Map(),
        detailWin : false,
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
        //授权机构
        //brchNoAddFormWin:false,
      }
    },
    components: {

    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.formItem.guarnteeDt = this.formItem.guarnteeDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //通过/驳回承兑保证登记申请
      acptGrntRecheck(str) {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          let content = str === "pass" ? "确定要通过吗?" : "确定要驳回吗?";
          let checkFlag = str === "pass" ? "1" : "2";
          let url = "";
          if (str === "pass") {
              url = "/pb/guarntr/paperAcptGrnt/acptGuaranteeRecheck/func_checkPass";
          } else {
              url = "/pb/guarntr/paperAcptGrnt/acptGuaranteeRecheck/func_checkBack";
          }
          let ids = Array();
          for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
            ids.push(this.$refs.datagrid.selects[i].id);
          }
          this.$hMsgBox.confirm({
            title: "确认",
            content: content,
            onOk: () => {
              post({ ids: ids, checkFlag : checkFlag ,licenseFlag:this.licenseFlag}, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //详情信息
      acptGrntDetail() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length == 1) {
          this.detailWin = true;
          this.addForm.id = this.$refs.datagrid.selects[0].id;
          this.addForm.billId = this.$refs.datagrid.selects[0].billId;
          this.addForm.billType = this.$refs.datagrid.selects[0].billType;
          this.addForm.billNo = this.$refs.datagrid.selects[0].billNo;
          this.addForm.billMoney = this.$refs.datagrid.selects[0].billMoney == null ? "0.00" : formatNumber(this.$refs.datagrid.selects[0].billMoney, 2, ",");
          if (this.$refs.datagrid.selects[0].dueDt != null && this.$refs.datagrid.selects[0].dueDt !== "") {
            this.addForm.dueDt = this.$moment(this.$refs.datagrid.selects[0].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          this.addForm.openBankNo = this.$refs.datagrid.selects[0].openBankNo;
          if (this.$refs.datagrid.selects[0].guarnteeDt != null && this.$refs.datagrid.selects[0].guarnteeDt !== "") {
            this.addForm.guarnteeDt = this.$moment(this.$refs.datagrid.selects[0].guarnteeDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          this.addForm.acptGuarntrBankNo = this.$refs.datagrid.selects[0].acptGuarntrBankNo;
          this.addForm.acptGuarntrBankName = this.$refs.datagrid.selects[0].acptGuarntrBankName;
          this.addForm.guarntrApplRemark = this.$refs.datagrid.selects[0].guarntrApplRemark;
          this.addForm.ownedBrchNo = this.$refs.datagrid.selects[0].ownedBrchNo;
          this.addForm.ownedBrchName = this.$refs.datagrid.selects[0].ownedBrchName;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleWinClose() {
        this.detailWin = false;
        this.addForm.id = "";
        this.addForm.billId = "";
        this.$refs.addForm.resetFields();
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
      licenseBrchNoChange(info) {
        this.addForm.ownedBrchNo = info[0].brchNo;
        this.addForm.ownedBrchName = info[0].brchName;
        this.addForm.custNo = '';
        this.addForm.custName = '';
      },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
      post({ paramKey: "ce.guarntr.paper_acpt_rgst_audit_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let auditMode = res.data.retData;
            if(auditMode == '0'){
              this.formItem.applStatusList =  ["GR02"];
            }
          }
        }
        this.formSearch();
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
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
