<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.toRecName')" prop="rcvgName">
                  <h-input v-model="formItem.rcvgName" placeholder="" :maxlength=60 :lengthByByte="false"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoneyByUnit')" prop="billMoney">
                  <h-row>
                    <h-col span="11">
                      <h-form-item prop="minBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-form-item prop="maxBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                  </h-row>
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
            url="/pb/recourse/recourseRgst/func_queryCheckRecourseBill"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            :notSetWidth="true"
            showListCkeckBox
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="viewDatail()">{{$t('m.i.be.viewDetail')}}</h-button>
              <h-button type="primary" @click="recoursePass()">{{$t('m.i.be.recoursePass')}}</h-button>
              <h-button type="primary" @click="recourseRefuse()">{{$t('m.i.be.recourseRefuse')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击查看详情弹出窗-->
    <h-msg-box v-model="viewDatailWin" width="800" :mask-closable="false" :maximize="true">
      <p slot="header">
        <span>详细信息展示</span>
      </p>
      <h-panel>
        <h-form :model="viewDatail" :label-width="115" ref="viewDatailForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
            <h-input v-if="type=='view'" :value="viewDatailForm.billNo" class="input-boder-0"
                     :title="viewDatailForm.billNo"></h-input>
            <h-input v-else v-model="viewDatailForm.billNo" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billMoneyByUnit')" prop="billMoney">
            <h-typefield v-if="type=='view'" :value="viewDatailForm.billMoney" class="input-boder-0"
                     :title="viewDatailForm.billMoney"></h-typefield>
            <h-typefield v-else v-model="viewDatailForm.billMoney" readonly></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
            <h-input v-if="type=='view'" :value="viewDatailForm.billType" class="input-boder-0"
                     :title="viewDatailForm.billType"></h-input>
            <h-input v-else v-model="viewDatailForm.billType" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
            <h-input v-if="type=='view'" :value="viewDatailForm.billClass" class="input-boder-0"
                     :title="viewDatailForm.billClass"></h-input>
            <h-input v-else v-model="viewDatailForm.billClass" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
            <h-input v-if="type=='view'" :value="viewDatailForm.dueDt" class="input-boder-0"
                     :title="viewDatailForm.dueDt"></h-input>
            <h-input v-else v-model="viewDatailForm.dueDt" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.recRepDate')" prop="recRepDt">
            <h-input v-if="type=='view'" :value="viewDatailForm.recRepDt" class="input-boder-0"
                     :title="viewDatailForm.recRepDt"></h-input>
            <h-input v-else v-model="viewDatailForm.recRepDt" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.offLineRecType')" prop="offLineRecType">
            <h-input v-if="type=='view'" :value="viewDatailForm.offLineRecType" class="input-boder-0"
                     :title="viewDatailForm.offLineRecType"></h-input>
            <h-input v-else v-model="viewDatailForm.offLineRecType" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.toRecName')" prop="rcvgName">
            <h-input v-if="type=='view'" :value="viewDatailForm.rcvgName" class="input-boder-0"
                     :title="viewDatailForm.rcvgName"></h-input>
            <h-input v-else v-model="viewDatailForm.rcvgName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="this.$t('m.i.billInfo.acptBankName')" prop="acptBankName">
            <h-input v-if="type=='view'" :value="viewDatailForm.acptBankName" class="input-boder-0"
                     :title="viewDatailForm.acptBankName"></h-input>
            <h-input v-else v-model="viewDatailForm.acptBankName" readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="viewDatailWin =! viewDatailWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "checkRecourseRgstBill",
    components: {
    },
    data() {
      return {
        viewDatailForm: {
          id: "",
          legalNo: "",
          memberId: "",
          brchNo: "",
          brchName: "",
          rgstBrchCode: "",
          billId: "",
          billNo: "",
          billMoney: "",
          billType: "",
          billClass: "",
          dueDt: "",
          recourseDt: "",
          recRepDt: "",
          recPayDt: "",
          acctTellerNo: "",
          applTellerNo: "",
          checkTellerNo: "",
          acctDt: "",
          billStatus: "",
          offLineRecType: "",
          recourseRemark: "",
          rcvgName: "",
          rcvgAcctNo: "",
          rcvgBankNo: "",
          rcvgSocCode: "",
          acptBankNo: "",
          acptBankName: "",
          acctFlowId: "",
          acctStatus: "",
          msgId: "",
          busiFlowNo: "",
          createTime: "",
          updateTime: "",
          reserve1: "",
          reserve2: "",
          reserve3: ""
        },
        formItem: {
          billNo: "",
          billClass: "",
          billType: "",
          rcvgName: "",
          billMoney: "",
          minBillMoney: "",
          maxBillMoney: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
        },
        columns: [
          {
            type: "selection",
            width: 50,
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.rgstApplDt'),
            key: "recourseDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let recourseDt = params.row.recourseDt == null ? "" :this.$moment(params.row.recourseDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", recourseDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = params.row.dueDt == null ? "" :this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.be.recRepDate'),
            key: "recRepDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let recRepDt = params.row.recRepDt == null ? "" :this.$moment(params.row.recRepDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", recRepDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.toRecName'),
            key: "rcvgName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.toRecAcctNo'),
            key: "rcvgAcctNo",
            hiddenCol: false
          }
        ],
        showBillInfoWin: false,
        type: null,
        viewDatailWin: false,
        billClassList: [],
        billTypeList: [],
        dictMap: new Map(),
        billNo: "",
        billRangeStart:"",
        billRangeEnd:"",
        billId: "",
        ifShowMore: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
      };
    },
    methods: {
      showBillInfo(params){
        this.billId = params.row.billId;
        this.billNo = params.row.billNo;
        this.billRangeStart = params.row.billRangeStart;
        this.billRangeEnd = params.row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
      },
      viewDatail() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (list != null && list.length > 0) {
          let id = list[0].id;
          post({ id: id }, "/pb/recourse/recourseRgst/func_queryRecourseBillDetail").then(res => {
            if (res.data.retCode === "000000") {
              this.viewDatailForm = res.data.retData;
              this.viewDatailForm.billClass = formatterisBillClass(res.data.retData.billClass);
              this.viewDatailForm.billType = formatterisBillType(res.data.retData.billType);
              this.viewDatailForm.offLineRecType = formatterisOffLineRecType(res.data.retData.offLineRecType);
              this.viewDatailWin = true;
            } else {
              this.$msgTip.error("操作失败:" + res.data.retMsg);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      recoursePass() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: "通过",
            content: "确定要通过吗？",
            onOk: () => {
              let ids = "";
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({
                ids: ids
              }, "/pb/recourse/recourseRgst/func_sendRecourseBillRgst").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this, { info: "操作成功" });
                    this.$refs.datagrid.dataChange(1);
                    this.$refs.datagrid.selectIds = [];
                    this.$refs.datagrid.selects = [];
                  } else {
                    this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
                  }
                }
              }).catch(error => {
                this.$msgTip.error(this.$t("m.i.common.netError") + error);
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      recourseRefuse() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: "驳回",
            content: "确定要驳回吗？",
            onOk: () => {
              let ids = [];
              for (let i = 0; i < list.length; i++) {
                ids += list[i].id;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({
                ids: ids
              }, "/pb/recourse/recourseRgst/func_refuseRecourseBillRgst").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this, { info: "操作成功" });
                    this.$refs.datagrid.dataChange(1);
                    this.$refs.datagrid.selectIds = [];
                    this.$refs.datagrid.selects = [];
                  } else {
                    this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
                  }
                }
              }).catch(error => {
                this.$msgTip.error(this.$t("m.i.common.netError") + error);
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
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

  function formatterisBillClass(value) {
    if (value != null && value != "") {
      switch (value) {
        case "ME01":
          return "纸票";
        case "ME02":
          return "电票";

      }
    } else {
      return "";
    }
  }

  function formatterisBillType(value) {
    if (value != null && value != "") {
      switch (value) {
        case "AC01":
          return "银票";
        case "AC02":
          return "商票";
      }
    } else {
      return "";
    }
  }

  function formatterisOffLineRecType(value) {
    if (value != null && value != "") {
      switch (value) {
        case "OLRT01":
          return "追偿发起登记";
        case "OLRT02":
          return "追偿偿付登记";
      }
    } else {
      return "";
    }
  }
</script>

<style scoped>

</style>
