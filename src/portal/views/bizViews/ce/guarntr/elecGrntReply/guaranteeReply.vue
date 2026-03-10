<!--保证回复-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-show="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>

                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>

                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo" :maxlength="30"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>

                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/bp/guaranty/sign/func_querySigningBillInfo"
            :bindForm="formItem"
            highlightRow
            :paramId="'transId'"
            :has-select="false"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="guaranteeReply()" v-if="authObj.replyAuth">应答</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--应答弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>保证应答</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.respResult')" prop="signFlag" :required="isRequired">
            <h-select v-model="addForm.signFlag" placeholder="" showTitle>
              <h-option value="SU01">拒绝</h-option>
              <h-option value="SU00">签收</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.respRemark')" prop="guarntrCfmRemark" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addForm.guarntrCfmRemark" :canResize="false"
                     :maxlength="150" :lengthByByte="false"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { on, off, post, formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "guaranteeReply",
    data() {
      return {
        //给按钮增加权限
        authObj : {
          replyAuth: true           //保证应答
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
            key: 'numOrder',
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
            key: "transToName",
            hiddenCol: false
          },
          //票据来源列
          //票据来源列
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: 'billOrigin',
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = params.row.billNo;
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
            }
          },
          //子票区间列
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
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
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              if(!params.row.drweBankNo){
                return h("span", params.row.acptBankNo);
              } else {
                return h("span", params.row.drweBankNo);
              }
            }
          },
          {
             title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false,
            ellipsis: false
          }
        ],
        formItem : {
          billSource:"",
          billNo: "",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          billType: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          reverseBillNo:"",
          authPath: this.$route.path
        },
        addForm : {
          idList: [],
          transIds: [],
          billIds:[],
          signFlag: "",
          guarntrCfmRemark: "",
          ownedBrchNo: "",
          funcNo:"PIPB010201",
          licenseFlag: false
        },
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        billTypeList : [],
        billOriginList : [],
        dictMap : new Map(),
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
        //  票据来源list
        billSourceInit: [{key: 1, value: "普通票据"}, {key: 2, value: "供应链票据"}, {key: 3, value: "等分化票据"}],
      }
    },
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    methods: {
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.billSource="";
        this.formItem.billRangeStart="";
        this.formItem.billRangeEnd="";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos =  "";
        this.formItem.ownedBrchNames =  "";
        this.$refs.formItem.resetFields();
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addForm.transId = "";
        this.addForm.idList = [];
        this.$refs.addForm.resetFields();
      },
      // 保证回复
      guaranteeReply() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length !== 0) {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.isRequired = true;
            this.$refs.addForm.resetFields();
            this.addForm.transIds = [];
            this.addForm.billIds = [];
            for(let i=0;i<list.length;i++){
              this.addForm.transIds.push(list[i].transId);
              this.addForm.billIds.push(list[i].billId);
              this.addForm.ownedBrchNo = list[i].ownedBrchNo;
            }
            this.addForm.licenseFlag = this.licenseFlag;
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/bp/guaranty/sign/func_sendSignMsg";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
     /* //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      }*/
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("transToName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("transToName", true);
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
