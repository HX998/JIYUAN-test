<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="bankNo" :label="$t('m.i.common.bankNo')">
                    <h-input v-model="formItem.bankNo"></h-input>
                  </h-form-item>
                  <h-form-item prop="actorFullCall" :label="$t('m.i.shcpe.actorFullCall')">
                    <h-input v-model="formItem.actorFullCall"></h-input>
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
            :highlightRow="true"
            url="/shcpe/ecds/basic/ecdsBankData/func_pageQueryEcdsBankData"
            :bindForm="formItem"
            :onCurrentChange="handlelRowClick"
            :onCurrentChangeCancel="handleCancelClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showBankInfo()">{{$t("m.i.shcpe.accesBank")}}</h-button>
              <h-button type="primary" @on-click="showApInfo()">{{$t("m.i.shcpe.accesPoint")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>


    <h-msg-box v-model="bankInfoWin" width="1000"  :maximize="true"
               @on-close="closeBankInfoForm">
      <p slot="header">
        <span>接入行信息</span>
      </p>
      <h-panel>
        <h-form :model="bankInfoForm" :label-width="130" ref="bankInfoForm" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.shcpe.bankNo')" prop="bankNo" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.bankNo" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.actorType')" prop="actorType" class="h-form-height-auto">
            <h-select v-model="bankInfoForm.actorType" placeholder="" readonly :rows="10">
              <h-option v-for="item in actorTypeList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.bankOtherCode')" prop="bankOtherCode" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.bankOtherCode" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.superActor')" prop="superActor" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.superActor" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.localNodeCode')" prop="localNodeCode" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.localNodeCode" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.rootSuperActor')" prop="rootSuperActor" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.rootSuperActor" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.catePeopleCode')" prop="catePeopleCode" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.catePeopleCode" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.theCityCode')" prop="cityCode" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.cityCode" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.actorFullCall')" prop="actorFullCall" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.actorFullCall" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.actorForShort')" prop="actorForShort" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.actorForShort" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.address')" prop="address" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.address" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.postCode')" prop="postCode" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.postCode" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.phoneCable')" prop="postCode" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.postCode" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.email')" prop="email" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.email" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.status')" prop="status" class="h-form-height-auto">
            <h-select v-model="bankInfoForm.status" placeholder="" readonly :rows="10">
              <h-option v-for="item in statusList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.activeDt')" prop="activeDt" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.activeDt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.logoutDt')" prop="logoutDt" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.logoutDt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.updateDt')" prop="updateGmt" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.updateGmt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.latelyUpdateWork')" prop="latelyUpdateWork" class="h-form-height-auto">
            <h-select v-model="bankInfoForm.latelyUpdateWork" placeholder="" readonly :rows="10">
              <h-option v-for="item in latelyUpdateWorkList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.logUpdateExpect')" prop="logUpdateExpect" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.logUpdateExpect" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.bankDataRemark')" prop="bankDataRemark" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.bankDataRemark" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.dnField')" prop="dnField" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.dnField" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.snField')" prop="snField" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.snField" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.certBindStatus')" prop="certBindStatus" class="h-form-height-auto">
            <h-select v-model="bankInfoForm.certBindStatus" placeholder="" readonly :rows="10">
              <h-option v-for="item in certBindStatusList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.meetIncomeCode')" prop="meetIncomeCode" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.meetIncomeCode" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.continueBankNo')" prop="continueBankNo" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.continueBankNo" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.continueMeetIncome')" prop="continueMeetIncome" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.continueMeetIncome" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.isContinue')" prop="isContinue" class="h-form-height-auto">
            <h-select v-model="bankInfoForm.isContinue" placeholder="" readonly :rows="10">
              <h-option v-for="item in isContinueList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.shcpe.historyContinueCon')" prop="historyContinueCon" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.historyContinueCon" readonly :rows="10"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.shcpe.clearAcctStatus')" prop="clearAcctStatus" class="h-form-height-auto">
            <h-select v-model="bankInfoForm.clearAcctStatus" placeholder="" readonly :rows="10">
              <h-option v-for="item in clearAcctStatusList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.shcpe.clearAcctDt')" prop="clearAcctDt" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.clearAcctDt" readonly :rows="10"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.shcpe.clearAcctTm')" prop="clearAcctTm" class="h-form-height-auto">
            <h-input v-model="bankInfoForm.clearAcctTm" readonly :rows="10"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer"></div>
    </h-msg-box>

    <h-msg-box v-model="apInfoWin" width="1000" :maximize="true"
               @on-close="closeApInfoForm">
      <p slot="header">
        <span>接入点信息</span>
      </p>
      <h-panel>
        <h-form :model="apInfoForm" :label-width="150" ref="apInfoForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.shcpe.meetCode')" prop="meetCode" class="h-form-height-auto">
            <h-input v-model="apInfoForm.meetCode" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.meetName')" prop="meetName" class="h-form-height-auto">
            <h-input v-model="apInfoForm.meetName" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.nonceCcpc')" prop="nonceCcpc" class="h-form-height-auto">
            <h-input v-model="apInfoForm.nonceCcpc" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.meetStatus')" prop="meetStatus" class="h-form-height-auto">
            <h-select v-model="apInfoForm.meetStatus" placeholder="" readonly :rows="10">
              <h-option v-for="item in meetStatusList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.activeDt')" prop="activeDt" class="h-form-height-auto">
            <h-input v-model="apInfoForm.activeDt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.logoutDt')" prop="logoutDt" class="h-form-height-auto">
            <h-input v-model="apInfoForm.logoutDt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.updateDt')" prop="updateGmt" class="h-form-height-auto">
            <h-input v-model="apInfoForm.updateGmt" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.latelyUpdateWork')" prop="latelyUpdateWork" class="h-form-height-auto">
            <h-select v-model="apInfoForm.latelyUpdateWork" placeholder="" readonly :rows="10">
              <h-option v-for="item in latelyUpdateWorkList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.meetEnterStatus')" prop="meetEnterStatus" class="h-form-height-auto">
            <h-select v-model="apInfoForm.meetEnterStatus" placeholder="" readonly :rows="10">
              <h-option v-for="item in meetEnterStatusList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.enterIdentify')" prop="enterIdentify" class="h-form-height-auto">
            <h-input v-model="apInfoForm.enterIdentify" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.thisMonthSetFirstTime')" prop="thisMonthSetFirstTime" class="h-form-height-auto">
            <h-input v-model="apInfoForm.thisMonthSetFirstTime" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.thisMonthSetSecond')" prop="thisMonthSetSecond" class="h-form-height-auto">
            <h-input v-model="apInfoForm.thisMonthSetSecond" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.thisMonthFirstLimited')" prop="thisMonthFirstLimited" class="h-form-height-auto">
            <h-input v-model="apInfoForm.thisMonthFirstLimited" readonly :rows="10"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.shcpe.thisMonthSecondLimited')" prop="thisMonthSecondLimited" class="h-form-height-auto">
            <h-input v-model="apInfoForm.thisMonthSecondLimited" readonly :rows="10"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer"></div>
    </h-msg-box>


    <h-msg-box v-model="bankAuthWin" width="1000"  :maximize="true"
               @on-close="closeBankAuthForm">
      <p slot="header">
        <span>查看接入行权限信息</span>
      </p>
      <div>
        <h-form :model="bankAuthForm" :label-width="115" ref="bankAuthForm" cols="1" class="h-form-search">
          <div class="h-search-form-row"><!--
            <h-form-item label="接收的报文号" prop="rcvPurviewList" class="h-form-height-auto">
              <div v-html="bankAuthForm.rcvPurviewList">{{bankAuthForm.rcvPurviewList}}</div>
            </h-form-item>-->
            <h-form-item :label="$t('m.i.common.bankNo')" prop="actorBankNo" class="h-form-height-auto">
              <div v-html="bankAuthForm.actorBankNo"></div>
            </h-form-item>
          </div>
          <h-row class="message-box">
            <h-col span="12" class="message-item">
              <label><span>*</span>{{$t('m.i.shcpe.receivedMsgId')}}</label>
              <div class="message-list" v-html="bankAuthForm.rcvPurviewList"></div>
            </h-col>
            <h-col span="12" class="message-item">
              <label><span>*</span>{{$t('m.i.shcpe.sendMsgId')}}</label>
              <div class="message-list" v-html="bankAuthForm.launchPurviewList"></div>
            </h-col>
          </h-row>
        </h-form>
      </div>
      <div slot="footer"></div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "ecdsBankData",
    data() {
      return {
        formItem: {
          bankNo: "",
          actorFullCall: ""
        },
        columns: [
          {
            title:" ",
            type: "radio",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.bankNo'),
            key: "bankNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.actorFullCall"),
            key: "actorFullCall",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.shcpe.meetCode"),
            key: "meetIncomeCode",
            hiddenCol: false

          },
          {
            title: this.$t('m.i.shcpe.businessPermissions'),
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showBankAuth(params.row.bankNo);
                    }
                  }
                }, this.$t('m.i.shcpe.permissions'))
              ]);
            }
          },
          {
            title: this.$t("m.i.shcpe.continueBankNo"),
            key: "continueBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.certBindStatus'),
            key: "certBindStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "EcdsCertBindStsCode", params.row.certBindStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.address'),
            key: "address",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.activeDt'),
            key: "activeDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dt =params.row.activeDt ? this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD") : ""
              return h('span', dt)
            }
          },
          {
            title: this.$t('m.i.shcpe.logoutDt'),
            key: "logoutDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dt =params.row.logoutDt ? this.$moment(params.row.logoutDt, "YYYY-MM-DD").format("YYYY-MM-DD") : ""
              return h('span', dt)
            }
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "bankDataRemark",
            hiddenCol: false
          }
        ],
        bankInfoWin: false,
        bankInfoForm: {
          bankNo: "",
          actorType: "",
          bankOtherCode: "",
          superActor: "",
          localNodeCode: "",
          rootSuperActor: "",
          catePeopleCode: "",
          cityCode: "",
          actorFullCall: "",
          actorForShort: "",
          address: "",
          postCode: "",
          phoneCable: "",
          email: "",
          status: "",
          activeDt: "",
          logoutDt: "",
          updateGmt: "",
          latelyUpdateWork: "",
          logUpdateExpect: "",
          bankDataRemark: "",
          dnField: "",
          snField: "",
          certBindStatus: "",
          meetIncomeCode: "",
          continueBankNo: "",
          continueMeetIncome: "",
          isContinue: "",
          historyContinueCon: "",
          clearAcctStatus: "",
          clearAcctDt: "",
          clearAcctTm: ""
        },

        apInfoWin: false,
        apInfoForm: {
          meetCode: "",
          meetName: "",
          nonceCcpc: "",
          meetStatus: "",
          activeDt: "",
          logoutDt: "",
          updateGmt: "",
          latelyUpdateWork: "",
          meetEnterStatus: "",
          enterIdentify: "",
          thisMonthSetFirstTime: "",
          thisMonthSetSecond: "",
          thisMonthFirstLimited: "",
          thisMonthSecondLimited: ""
        },

        bankAuthWin: false,
        bankAuthForm: {
          rcvPurviewList: "",
          launchPurviewList: ""
        },

        currentSelectRow: [],
        currentSelectList: [],
        dictMap: new Map(),
        actorTypeList: [],
        statusList: [],
        latelyUpdateWorkList: [],
        certBindStatusList: [],
        isContinueList: [
          {
            key: "00",
            value: "无"
          },
          {
            key: "01",
            value: "有"
          }
        ],
        clearAcctStatusList: [],
        meetStatusList:[],
        latelyUpdateWorkList:[],
        meetEnterStatusList:[]
      }
    },
    watch: {},

    computed: {},
    mounted() {
      getDictListByGroups("DraftDirection,EcdsCertBindStsCode,ActorBrchType,EcdsBkInfStsCode,EcdsBkInfLateUpWorkCode,EcdsBkInfClearAcctStsCode,EcdsAccssPtsInfStsCode,EcdsAccssPtsInfMeetEnterStsCode").then(res => {
        this.sendRcvFlagList = res.get("DraftDirection");
        this.actorTypeList=res.get("ActorBrchType");
        this.statusList=res.get("EcdsBkInfStsCode")
        this.latelyUpdateWorkList=res.get("EcdsBkInfLateUpWorkCode")
        this.certBindStatusList=res.get("EcdsCertBindStsCode")
        this.clearAcctStatusList=res.get("EcdsBkInfClearAcctStsCode")
        this.meetStatusList=res.get("EcdsAccssPtsInfStsCode")
        this.meetEnterStatusList=res.get("EcdsAccssPtsInfMeetEnterStsCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handlelRowClick(currentRow,oldCurrentRow,_index) {
        this.currentSelectRow[0]=currentRow;
      },
      handleCancelClick(currentRow, oldCurrentRow, _index){
        this.currentSelectRow=[]
      },

      showBankInfo() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        post({ id: this.currentSelectRow[0].id }, "/shcpe/ecds/basic/ecdsBankData/func_getEcdsBankData").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.bankInfoForm.bankNo = retData.bankNo;
              this.bankInfoForm.actorType = retData.actorType;
              this.bankInfoForm.bankOtherCode = retData.bankOtherCode;
              this.bankInfoForm.superActor = retData.superActor;
              this.bankInfoForm.localNodeCode = retData.localNodeCode;
              this.bankInfoForm.rootSuperActor = retData.rootSuperActor;
              this.bankInfoForm.catePeopleCode = retData.catePeopleCode;
              this.bankInfoForm.cityCode = retData.cityCode;
              this.bankInfoForm.actorFullCall = retData.actorFullCall;
              this.bankInfoForm.actorForShort = retData.actorForShort;
              this.bankInfoForm.address = retData.address;
              this.bankInfoForm.postCode = retData.postCode;
              this.bankInfoForm.phoneCable = retData.phoneCable;
              this.bankInfoForm.email = retData.email;
              this.bankInfoForm.status = retData.status;
              this.bankInfoForm.activeDt = retData.activeDt?this.$moment(retData.activeDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              this.bankInfoForm.logoutDt =  retData.logoutDt?this.$moment(retData.logoutDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              this.bankInfoForm.updateGmt = retData.updateGmt?this.$moment(retData.updateGmt, "YYYYMMDDHHmmssSSS").format("YYYY-MM-DD HH:mm:ss.SSS") : "";
              this.bankInfoForm.latelyUpdateWork = retData.latelyUpdateWork;
              this.bankInfoForm.logUpdateExpect = retData.logUpdateExpect;
              this.bankInfoForm.bankDataRemark = retData.bankDataRemark;
              this.bankInfoForm.dnField = retData.dnField;
              this.bankInfoForm.snField = retData.snField;
              this.bankInfoForm.certBindStatus = retData.certBindStatus;
              this.bankInfoForm.meetIncomeCode = retData.meetIncomeCode;
              this.bankInfoForm.continueBankNo = retData.continueBankNo;
              this.bankInfoForm.continueMeetIncome = retData.continueMeetIncome;
              this.bankInfoForm.isContinue = retData.isContinue;
              this.bankInfoForm.historyContinueCon = retData.historyContinueCon;
              this.bankInfoForm.clearAcctStatus = retData.clearAcctStatus;
              this.bankInfoForm.clearAcctDt = retData.clearAcctDt?this.$moment(retData.clearAcctDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              this.bankInfoForm.clearAcctTm = retData.clearAcctTm?this.$moment(retData.clearAcctTm, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss"):""

            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        this.bankInfoWin = true;
      },

      showApInfo() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        post({ meetCode: this.currentSelectRow[0].meetIncomeCode }, "/shcpe/ecds/basic/ecdsBankData/func_getEcdsApDataByMeetCode").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.apInfoForm.meetCode = retData.meetCode;
              this.apInfoForm.meetName = retData.meetName;

              this.apInfoForm.nonceCcpc = retData.nonceCcpc;
              this.apInfoForm.meetStatus = retData.meetStatus;
              this.apInfoForm.activeDt = retData.activeDt?this.$moment(retData.activeDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              this.apInfoForm.logoutDt = retData.logoutDt?this.$moment(retData.logoutDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              this.apInfoForm.updateGmt = retData.updateGmt?this.$moment(retData.updateGmt, "YYYYMMDDHHmmssSSS").format("YYYY-MM-DD HH:mm:ss.SSS"):"";
              this.apInfoForm.latelyUpdateWork = retData.latelyUpdateWork;
              this.apInfoForm.meetEnterStatus = retData.meetEnterStatus;
              this.apInfoForm.enterIdentify = retData.enterIdentify;
              this.apInfoForm.thisMonthSetFirstTime = retData.thisMonthSetFirstTime;
              this.apInfoForm.thisMonthSetSecond = retData.thisMonthSetSecond;
              this.apInfoForm.thisMonthFirstLimited = retData.thisMonthFirstLimited;
              this.apInfoForm.thisMonthSecondLimited = retData.thisMonthSecondLimited;
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        this.apInfoWin = true;
      },


      closeBankInfoForm() {
        this.$refs.bankInfoForm.resetFields();
        this.bankInfoWin = false;
      },

      closeApInfoForm() {
        this.$refs.apInfoForm.resetFields();
        this.apInfoWin = false;
      },

      showBankAuth(bankNo) {
        post({ actorBankNo: bankNo }, "/ecds/basic/ecdsBankData/func_getEcdsAuthListData").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.bankAuthForm.rcvPurviewList = retData.rcvPurviewList;
              this.bankAuthForm.launchPurviewList = retData.launchPurviewList;
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        this.bankAuthForm.actorBankNo = bankNo;
        this.bankAuthWin = true;
      },

      closeBankAuthForm() {
        this.bankAuthWin = false;
        this.bankAuthForm.actorBankNo = "";
        this.bankAuthForm.rcvPurviewList = "";
        this.bankAuthForm.launchPurviewList = "";
      }

    }
  };
</script>

<style scoped>

</style>
