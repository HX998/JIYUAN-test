<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-date-picker v-model="formItem.draftDtRang" :label="$t('s.i.odps.draftDt')" prop="draftDtRang" type="daterange" :rangeValue="['minDraftDt','maxDraftDt']"
                                    :minDraftDt.sync="formItem.minDraftDt" :maxDraftDt.sync="formItem.maxDraftDt" @on-change="handleDraftDtChange">
                </common-date-picker>
                <common-select v-model="formItem.brdcstLevel" :dictList="this.broadcastTypeCodeList" :label="$t('s.i.odps.brdcstLevel')" prop="brdcstLevel"></common-select>
                <common-select v-model="formItem.draftDir" :dictList="this.odpsDraftSendRecvMarkCode" :label="$t('s.i.odps.draftDir')" prop="draftDir"></common-select>
                <common-input v-model="formItem.msgId" :label="$t('s.i.odps.msgId')" prop="msgId"></common-input>
                <common-input v-model="formItem.sendBankNo" :label="$t('s.i.odps.sendBankNo')" prop="sendBankNo"></common-input>
                <common-input v-model="formItem.receiverBankNo" :label="$t('s.i.odps.receiverBankNoOrRcvrMeetCode')" prop="receiverBankNo" class="h-form-long-label"></common-input>
                <query-btn @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch" :advanceShow='true'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/odps/freedraft/freeDraftInfoMain/func_pageQueryFreeDraftInfo"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="addFreeDraft()">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @on-click="showDetail()">{{$t("m.i.common.showDetail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增弹出窗-->
    <h-msg-box v-model="addFreeDraftWin" width="600" class="h-form-search" :maximize="true" :mask-closable="false"
               @on-close="addFreeDraftWinClose">
      <p slot="header">
        <span>自由格式报文</span>
      </p>
      <h-form :model="addFreeDraftForm" :label-width="115" ref="addFreeDraftForm" cols="1" class="h-form-search">
        <common-select v-model="addFreeDraftForm.brdcstLevel" :dictList="this.broadcastTypeCodeList" :label="$t('s.i.odps.brdcstLevel')"
                       prop="brdcstLevel" :required="true"></common-select>
        <common-input v-model="addFreeDraftForm.sendBankNo" :label="$t('s.i.odps.sendBankNo')" prop="sendBankNo" :validRules="bankNoRule"
                     :required="true"></common-input>
        <common-input v-if="addFreeDraftForm.brdcstLevel==='BC00'" v-model="addFreeDraftForm.receiverBankNo" :label="$t('s.i.odps.receiverBankNo')" prop="receiverBankNo" :validRules="bankNoRule"
                      :required="true" :showIcon="true" @on-click="queryBankData" :clearable="true" key="receiverBankNo"></common-input>
        <common-input v-if="addFreeDraftForm.brdcstLevel==='BC02'" v-model="addFreeDraftForm.receiverBankNo" :label="$t('m.i.shcpe.rcvrMeetCode')" prop="receiverBankNo" :validRules="meetCodeRule"
                      :required="true" :clearable="true" key="rcvrMeetCode"></common-input>
        <common-input v-model="addFreeDraftForm.content" :label="$t('s.i.odps.content')" prop="content" class="h-form-height-auto"
                      :required="true" type="textarea" :autosize="{minRows: 10,maxRows: 40}" :canResize="false" :maxlength="2000"></common-input>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="addFreeDraftWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
    </h-msg-box>

    <!--点击查看详情弹出窗-->
    <h-msg-box v-model="draftInfoWin" width="600" class="h-form-search" :maximize="true" :mask-closable="false"
               @on-close="draftInfoWinClose">
      <p slot="header">
        <span>自由格式信息</span>
      </p>
      <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
        <common-input v-model="draftInfoForm.brdcstLevelName" :label="$t('s.i.odps.brdcstLevel')" prop="brdcstLevelName"
                      :readonly="true"></common-input>
        <common-input v-model="draftInfoForm.draftDt" :label="$t('s.i.odps.draftDt')" prop="draftDt" :readonly="true"></common-input>
        <common-input v-model="draftInfoForm.sendBankNo" :label="$t('s.i.odps.sendBankNo')" prop="sendBankNo"
                      :readonly="true"></common-input>
        <common-input v-if="draftInfoForm.brdcstLevel==='BC00'" v-model="draftInfoForm.receiverBankNo" :label="$t('s.i.odps.receiverBankNo')" prop="receiverBankNo"
                      :readonly="true"></common-input>
        <common-input v-if="draftInfoForm.brdcstLevel==='BC02'" v-model="draftInfoForm.receiverBankNo" :label="$t('m.i.shcpe.rcvrMeetCode')" prop="receiverBankNo"
                      :readonly="true"></common-input>
        <common-input v-model="draftInfoForm.draftDir" :label="$t('s.i.odps.draftDir')" prop="draftDir"
                      :readonly="true"></common-input>
        <common-input v-model="draftInfoForm.msgId" :label="$t('s.i.odps.msgId')" prop="msgId" :readonly="true"></common-input>
       <!-- <common-input v-model="draftInfoForm.sendStatus" :label="$t('s.i.odps.sendStatus')" prop="sendStatus" :readonly="true"></common-input>-->
        <!--<common-input v-model="draftInfoForm.dealPrcMsg" :label="$t('s.i.odps.dealPrcMsg')" prop="dealPrcMsg" :readonly="true"></common-input>-->
       <!-- <common-input v-model="draftInfoForm.createTime" :label="$t('s.i.odps.createTime')" prop="createTime" :readonly="true"></common-input>-->
        <common-input v-model="draftInfoForm.content" :label="$t('s.i.odps.content')" prop="content" class="h-form-height-auto"
                      :readonly="true" type="textarea" :autosize="{minRows: 10,maxRows: 40}" style="overflow-y:auto;overflow-x:auto;width: 100%"></common-input>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="draftInfoWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <h-msg-box v-model="tempShowBankDataSelectWin" width="1000" @on-close="bankDataSelectClose" class="h-form-table-layer"
               :maximize="true">
      <p slot="header">
        <span>选择接入行号</span>
      </p>
      <h-form :model="bankFormItem" :label-width="90" ref="bankFormItem" cols="4" class="h-form-search">
        <common-input v-model="bankFormItem.bankNo" :label="$t('m.i.common.bankNo')" prop="bankNo"></common-input>
        <common-input v-model="bankFormItem.actorFullCall" :label="$t('m.i.shcpe.actorFullCall')" prop="actorFullCall"></common-input>
        <query-btn :formSearch="bankDataHandleSearch" :formSearchReset="bankDataResetSearch" :advanceShow='false' formClassAdd="1"></query-btn>
      </h-form>
      <h-datagrid
        :columns="bankColumns"
        highlight-row
        :autoLoad=true
        url="/sm/odps/freedraft/freeDraftInfoMain/func_pageQueryEcdsBankData"
        :bindForm="bankFormItem"
        :onCurrentChange="bankhandleSelectClick"
        :onCurrentChangeCancel="bankhandleSelectCancel"
        ref="bankDatagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="bankDataSelectClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="bankDataSelectSubmit">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
import {getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
  name: "freeDraftInfoMain",
  data() {
    return {
      formItem: {
        msgId: "",
        draftDtRang: [],
        minDraftDt: "",
        maxDraftDt: "",
        brdcstLevel: "",
        draftDir: "",
        sendBankNo: "",
        receiverBankNo: ""
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
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('s.i.odps.brdcstLevel'),
            key: "brdcstLevel",
            hiddenCol: false,
            render: (h, params) => {
              let brdcstLevel = getDictValueFromMap(this.dictMap, "OdpsBroadcastTypeCode", params.row.brdcstLevel);
              return h("span",
                {
                  domProps: {
                    title: brdcstLevel
                  }
                }, brdcstLevel);
            }
          },
          {
            title: this.$t('s.i.odps.draftDt'),
            key: "draftDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let draftDt = params.row.draftDt == null ? "" : this.$moment(params.row.draftDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", draftDt);
            }
          },
          {
            title: this.$t('s.i.odps.sendBankNo'),
            key: "sendBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('s.i.odps.receiverBankNoOrRcvrMeetCode'),
            key: "receiverBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('s.i.odps.draftDir'),
            key: "draftDir",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let draftDir = getDictValueFromMap(this.dictMap, "OdpsDraftSendRecvMarkCode", params.row.draftDir);
              return h("span",
                {
                  domProps: {
                    title: draftDir
                  }
                }, draftDir);
            }
          },
          {
            title: this.$t('s.i.odps.msgId'),
            key: "msgId",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("s.i.odps.sendStatus"),
            key: "sendStatus",
            hiddenCol: false,
            render: (h, params) => {
              let sendStatus = this.formatSendStatus(params.row.sendStatus);
              return h("span",
                {
                  domProps: {
                    title: sendStatus
                  }
                }, sendStatus);
            }
          },
          {
            title: this.$t("s.i.odps.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false,
          },
          {
            title: this.$t('s.i.odps.createTime'),
            key: "createTime",
            hiddenCol: false,
            sortable: true,
            width: 150,
            render: (h, params) => {
              if (null != params.row.createTime && "" !== params.row.createTime) {
                let createTime = this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss:SSS").format("YYYY-MM-DD HH:mm:ss");
                return h("span", createTime);
              }
            }
          }
        ],
        dictMap: new Map(),
        broadcastTypeCodeList: [],
        odpsDraftSendRecvMarkCode: [],
        //自由格式报文详情页面
        draftInfoWin: false,
        draftInfoForm: {
          brdcstLevel:"",
          brdcstLevelName:"",
          draftDt:"",
          content:"",
          sendBankNo:"",
          receiverBankNo:"",
          draftDir:"",
          msgId:"",
          sendStatus:"",
          dealPrcMsg:"",
          createTime:""
        },
        ifShowMore: false,
        addFreeDraftWin: false,
        //新增自由格式报文表单
        addFreeDraftForm: {
          brdcstLevel: "",
          content: "",
          sendBankNo: this.$store.getters.userInfo.bankNo,
          sendBankName: this.$store.getters.userInfo.brchName,
          receiverBankNo: "",
          receiverBankName: ""
        },
        currentSelectRow: null,
        //接收接入行号界面
        tempShowBankDataSelectWin: false,
        bankCurrentSelectList: [],
        bankFormItem: {
          meetCode:"",
          actorFullCall: ""
        },
        bankColumns: [
          {
            type: "radio",
            title: " ",
            width: 60,
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
            title: "接入行号",
            key: "bankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: "接入行名",
            key: "actorFullCall",
            hiddenCol: false
          }
        ],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "行号由12位数字组成" }],
        meetCodeRule: [{ test: /^[0-9]{10,12}$/, trigger: "blur", message: "接入点号由10到12位的数字组成" }]
      };
    },
    mounted() {
      getDictListByGroups("OdpsBroadcastTypeCode,OdpsDraftSendRecvMarkCode").then(res => {
        this.broadcastTypeCodeList = res.get("OdpsBroadcastTypeCode");
        this.odpsDraftSendRecvMarkCode = res.get("OdpsDraftSendRecvMarkCode");
        this.dictMap = res.get("map");
      });
      this.getCurDate(res => {
        this.handleSearch();
      });
    },
    methods: {
      handleDraftDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minDraftDt = arr[0].replace(/-/g, "");
          this.formItem.maxDraftDt = arr[1].replace(/-/g, "");
          this.formItem.draftDtRang = [arr[0], arr[1]];
        } else {
          this.formItem.minDraftDt = "";
          this.formItem.maxDraftDt = "";
          this.formItem.draftDtRang = [];
        }
      },

      handleSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.draftDtRang = "";
        this.formItem.brdcstLevel = "";
        this.getCurDate();
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      showDetail() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.draftInfoForm.brdcstLevel = this.currentSelectRow.brdcstLevel;
        this.draftInfoForm.brdcstLevelName = getDictValueFromMap(this.dictMap, "OdpsBroadcastTypeCode", this.currentSelectRow.brdcstLevel);
        let draftDt = this.currentSelectRow.draftDt
        if (null != draftDt && "" !== draftDt) {
            draftDt = this.$moment(draftDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.draftInfoForm.draftDt = draftDt;
        this.draftInfoForm.content = this.currentSelectRow.content;
        this.draftInfoForm.sendBankNo = this.currentSelectRow.sendBankNo;
        this.draftInfoForm.receiverBankNo = this.currentSelectRow.receiverBankNo;
        this.draftInfoForm.draftDir = getDictValueFromMap(this.dictMap, "OdpsDraftSendRecvMarkCode", this.currentSelectRow.draftDir);
        this.draftInfoForm.msgId = this.currentSelectRow.msgId;
        this.draftInfoForm.sendStatus = this.formatSendStatus(this.currentSelectRow.sendStatus);
        this.draftInfoForm.dealPrcMsg = this.currentSelectRow.dealPrcMsg;
        let createTime = this.currentSelectRow.createTime
          this.draftInfoForm.createTime = this.currentSelectRow.createTime;
        if (null != createTime && "" !== createTime) {
           createTime = this.$moment(createTime, "YYYY-MM-DD HH:mm:ss:SSS").format("YYYY-MM-DD HH:mm:ss");
        }
        this.draftInfoForm.createTime = createTime;
        this.draftInfoWin = true;
      },
      draftInfoWinClose() {
        this.draftInfoForm.brdcstLevel = null;
        this.draftInfoForm.brdcstLevelName = null;
        this.draftInfoWin = false;
      },
      addFreeDraft() {
        this.addFreeDraftWin = true;
      },
      addFreeDraftWinClose() {
        this.$refs.addFreeDraftForm.resetFields();
        this.addFreeDraftForm.sendBankNo = this.$store.getters.userInfo.bankNo;
        this.addFreeDraftWin = false;
      },
      // 新增页面提交
      submitForm() {
        this.$refs["addFreeDraftForm"].validate(valid => {
          if (valid) {
            let url = "/sm/odps/freedraft/freeDraftInfoMain/func_freeDraftInfoApp";
            post(this.addFreeDraftForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                  this.addFreeDraftWinClose();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      //行信息子页面
      bankDataHandleSearch() {
        this.$refs.bankDatagrid.dataChange(1);
      },
      bankDataResetSearch() {
        this.$refs.bankFormItem.resetFields();
      },
      bankhandleSelectClick(arr) {
        this.bankCurrentSelectList = arr;
      },
      bankhandleSelectCancel() {
        this.bankCurrentSelectList = [];
      },
      queryBankData() {
        this.tempShowBankDataSelectWin = true;
        this.bankDataHandleSearch();
      },
      bankDataSelectSubmit() {
        if (this.bankCurrentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.bankCurrentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.addFreeDraftForm.receiverBankNo = this.bankCurrentSelectList.bankNo;
        this.addFreeDraftForm.receiverBankName = this.bankCurrentSelectList.actorFullCall;
        this.bankDataSelectClose();
      },
      bankDataSelectClose() {
        this.tempShowBankDataSelectWin = false;
        this.bankCurrentSelectList = [];
        this.$refs.bankFormItem.resetFields();
      },

      formatSendStatus(value) {
        if (value == null || value == "") {
          return "";
        }
        switch (value) {
          case "1":
            return "发送中";
          case "2":
            return "已发送";
          case "3":
            return "发送失败";
          case "4":
            return "已接收";
        }
      },

      getCurDate(callback) {
        post({}, "/sm/odps/mng/odpsStatus/func_getOdpsStatus.currentSysDt").then(res => {
          if (res) {
            let currentSysDt = this.$moment(res.data.retData.currentSysDt, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formItem.draftDtRang = [currentSysDt, currentSysDt];
              this.formItem.minDraftDt = currentSysDt.replace(/-/g, "");
              this.formItem.maxDraftDt = currentSysDt.replace(/-/g, "");
              callback();
            }
          }
        });
      }
    },
  };
</script>

<style scoped>

</style>
