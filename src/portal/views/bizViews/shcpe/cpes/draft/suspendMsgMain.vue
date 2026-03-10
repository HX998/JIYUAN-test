<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="draftDate" label="报文日期">
                    <h-date-picker v-model="formItem.draftDate" format="yyyy-MM-dd" type="daterange" placeholder=""
                                   showFormat :editable=false @on-change="handleDraftDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="draftNo" label="报文编号">
                    <h-input v-model="formItem.draftNo" placeholder="" :maxlength="6"></h-input>
                  </h-form-item>
                  <h-form-item prop="msgId" :label="$t('m.i.common.msgId')">
                    <h-input v-model="formItem.msgId" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                    <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                  </h-form-item>
                  <h-form-item prop="dealNo" label="成交单编号">
                    <h-input v-model="formItem.dealNo" placeholder="" :maxlength="16"></h-input>
                  </h-form-item>
                  <h-form-item prop="busiNo" label="业务单编号">
                    <h-input v-model="formItem.busiNo" placeholder="" :maxlength="20"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                        class="icon iconfont"
                        :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
              highlight-row
              url="/shcpe/cpes/draft/check/suspendMsgMain/func_querySuspendMsgLog"
              :bindForm="formItem"
              :hasSelect="false"
              rowSelect
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showInfo()">{{$t("m.i.common.viewDatail")}}</h-button>
              <h-button type="primary" @on-click="batchAddSubMsg()">{{$t("m.i.shcpe.batchAddSubMsg")}}</h-button>
              <h-button type="primary" @on-click="openConfigForm()">{{$t("m.i.shcpe.ruleConfig")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box v-model="draftInfoWin" width="1000"  :mask-closable="false" :maximize="true"
               @on-close="closeForm">
      <p slot="header">
        <span>报文详情</span>
      </p>
      <h-panel>
        <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item label="报文内容" prop="draftContent" class="h-form-height-auto">
              <textarea id="cpesDraftContentId" readonly rows="20"
                        style="overflow-y:auto;overflow-x:auto;width:100%"></textarea>
              <!--<h-input v-model="draftInfoForm.draftContent" readonly type="textarea" :rows="10"></h-input>-->
            </h-form-item>
            <h-form-item label="报文时间" prop="creDtTm">
              <label>{{draftInfoForm.creDtTm}}</label>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closeForm">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <h-msg-box v-model="configWin" width="800"  :mask-closable="false" :maximize="true"
               @on-close="closeConfigForm">
      <p slot="header">
        <span>报文暂停处理规则配置</span>
      </p>
      <h-panel>
        <h-form :model="configForm" :label-width="115" ref="configForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item label="暂停规则" prop="config" class="h-form-height-auto">
              <h-input v-model="configForm.config" type="textarea" :rows="3" :maxlength="3000"></h-input>
            </h-form-item>
          </div>
          <div>
            <h3>注：</h3>
            <p>1.	若对于某个报文，所有该报文均需暂停，则只需配置该报文号，如：CIM003；</p>
            <p>2.	若对于某个报文，需根据原报文类型暂停该报文，则需配置原报文编号，如：CIM001.CPR005；</p>
            <p>3.	若对于某个报文，需根据报文中字段判断是否需要暂停处理，则需配置报文对应标签及内容，如：CPR006(RqBusiTp= AIT002)，</p>
            <p>   若只需判断标签存在，则配置报文标签，如：CIM003(CPR005)；</p>
            <p>4.	表达式大小写不敏感，但须用英文符号，存在多个配置报文时，以英文逗号“,”分隔。</p>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="commitConfigForm()">{{$t("m.i.common.commit")}}</h-button>
        <h-button type="ghost" @click="closeConfigForm()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "suspendMsgMain",
    data() {
      return {
        billId: "",
        billNo: "",
        formItem: {
          draftNo: "",
          draftDate: "",
          billNo: "",
          dealNo: "",
          busiNo: "",
          sendRcvFlag: ""
        },
        draftInfoForm: {
          draftContent: "",
          creDtTm: ""
        },
        configForm: {
          config: ""
        },
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.msgId"),
            key: "msgId",
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.draftNo"),
            key: "draftNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: "报文时间",
            key: "createDtTm",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.createDtTm && "" !== params.row.createDtTm) {
                let dttm = this.$moment(params.row.createDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            align: "center",
            hiddenCol: false,
            sortable: true
          },
          {
            title: "业务单编号",
            key: "busiNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            align: "center",
            hiddenCol: false
          },
          {
            title: "发起会员名称",
            key: "aplMemberName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "发起机构名称",
            key: "aplBranchName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "接收会员名称",
            key: "rcvMemberName",
            align: "center",
            hiddenCol: false

          },
          {
            title: "接收机构名称",
            key: "rcvBranchName",
            align: "center",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.shcpe.sendRcvFlag"),
            key: "sendRcvFlag",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "DraftDirection", params.row.sendRcvFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        dictMap: [],
        sendRcvFlagList: [],
        draftInfoWin: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        ifShowMore: false,
        configWin: false,
        submitFlag: false,
        tableRef: "selfTable"
      };
    },
    computed: {},
    mounted() {
      getDictListByGroups("DraftDirection").then(res => {
        this.sendRcvFlagList = res.get("DraftDirection");
        this.dictMap = res.get("map");
      });
      this.getCurDate();
    },
    methods: {
      handleDraftDateChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minTransDate = arr[0].replace(/-/g, "");
          this.formItem.maxTransDate = arr[1].replace(/-/g, "");
        } else {
          this.formItem.minTransDate = "";
          this.formItem.maxTransDate = "";
        }
      },
      handleSearch() {
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.getCurDate();
      },
      showInfo() {
        let list = this.$refs.datagrid.selectIds;
        if (!list || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.draftInfoWin = true;
        post({ id: list[0] }, "/shcpe/cpes/draft/check/msgLogMain/func_detailMessageInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                document.getElementById("cpesDraftContentId").innerHTML = retData == null ? "" : retData.draftContent;
                this.draftInfoForm.creDtTm = this.$moment(retData.creDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              });
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      closeForm() {
        this.draftInfoForm.draftContent = "";
        this.draftInfoForm.creDtTm = "";
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.draftInfoWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      getCurDate() {
        post({}, "/shcpe/cpes/draft/msgSendAgain/func_getCurDate").then(res => {
          if (res) {
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formItem.draftDate = [retData, retData];
            }
          }
        });
      },
      batchAddSubMsg() {
        if (this.$refs.datagrid.selectIds && this.$refs.datagrid.selectIds.length > 0) {
          this.$hMsgBox.confirm({
            title: "批量补收信息",
            content: "确定要批量补收吗？",
            onOk: () => {
              this.batchAddSubMsgFunc();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      batchAddSubMsgFunc() {
        let list = this.listSort(this.$refs.datagrid.selectIds);
        post({ ids: list }, "/shcpe/cpes/draft/check/suspendMsgMain/func_batchAddSubMessage").then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.handleSearch();
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      commitConfigForm() {
        this.submitFlag = true;
        post({ config: this.configForm.config }, "/shcpe/cpes/draft/check/suspendMsgMain/func_changeSuspendProcessingKey").then(res => {
          this.submitFlag = false;
          if (res) {
            if (res.data.retCode === "000000") {
              //this.configForm.config = res.data.retMsg;
              this.$msgTip.success(this);
              this.closeConfigForm();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      closeConfigForm() {
        this.$refs["configForm"].resetFields();
        this.configWin = false;
        this.handleSearch();
      },
      openConfigForm() {
        post({}, "/shcpe/cpes/draft/check/suspendMsgMain/func_getSuspendProcessingKey").then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.configForm.config = res.data.retMsg;
              this.configWin = true;
            } else {
              this.$msgTip.error(this, { info: "获取配置规则错误" });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      mergeArray(arr, first, mid, last, temp) {
        let i = first;
        let m = mid;
        let j = mid + 1;
        let n = last;
        let k = 0;
        while (i <= m && j <= n) {
          if (arr[i] < arr[j]) {
            temp[k++] = arr[i++];
          } else {
            temp[k++] = arr[j++];
          }
        }
        while (i <= m) {
          temp[k++] = arr[i++];
        }
        while (j <= n) {
          temp[k++] = arr[j++];
        }
        for (let l = 0; l < k; l++) {
          arr[first + l] = temp[l];
        }
        return arr;
      },
      mergeSort(arr, first, last, temp) {
        if (first < last) {
          let mid = Math.floor((first + last) / 2);
          this.mergeSort(arr, first, mid, temp);    // 左子数组有序
          this.mergeSort(arr, mid + 1, last, temp);   // 右子数组有序
          arr = this.mergeArray(arr, first, mid, last, temp);
        }
        return arr;
      },
      listSort(arr) {
        return this.mergeSort(arr, 0, arr.length - 1, []);
      }
    }
  };
</script>

<style scoped>

</style>
