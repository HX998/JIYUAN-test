<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="sspdType" :label="$t('m.i.billInfo.sspdAndRelieveType')" class="h-form-long-label">
                  <h-select v-model="formItem.sspdType" placeholder="">
                    <h-option v-for="item in doubleTypeList" :value="item.key" :key="item.key" @on-change="handleTypeChange">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNo" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/paper/stopPayment/stopPaymentRecheck/func_waitCheckList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass" >{{$t('m.i.common.recheckPass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.common.recheckReturn')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!-- 影像信息界面-->
        <show-image-info
          :show-upload-image-win="showUploadImageWin"
          :params="imageParams"
          :isShow="false"
          @uploadImageWinClose="uploadImageWinClose"></show-image-info>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "stopPaymentRecheck",
    components: {
    },
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        licenseFlag:false,
        authPath: this.$route.path ,
        ownedBrchNo:"",
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          sspdType: '',
          relieveType: '',
          billNo: '',
          acptProtocalNo: '',
          curFuncNo : 'PICE010826',
          licenseFlag:this.licenseFlag,
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
          reverseBillNo: '',
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.sspdAndRelieveType"),
            key: 'sspdAndRelieveType',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.common.showImg"),
            key: "showImg",
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.openImgWin(params.row.id,params.row.status)
                  }
                }
              }, "查看");
            }
          }
        ],
        dictMap: new Map(),
        sspdStatusList: [],
        sspdTypeList: [],
        relieveTypeList: [],
        doubleTypeList: [],
        currentSelectList: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        //分录
        acctRecordUrl : "",
        acctRecordParam : {},
        showAcctRecordWin : false,
        batchId : "",
        ids : "",
        acctSubmitFlag : false,
        showPrintButton : false,
        //查看影像
        showUploadImageWin: false,
        imageParams: {
          listId: '',
          imgBusiType: '',
          pageSearchUrl:"/ce/acpt/paper/stopPayment/stopPaymentRecheck/func_imageListPage",
          //查看
          imgShowUrl:"/ce/acpt/paper/stopPayment/stopPaymentRecheck/func_imageById?id="
        }
      }
    },
    mounted() {
      this.doubleTypeList = [];
      getDictListByGroups("DraftTypeCode,SspdStatus,SspdType,AnlgSspdType,AcptStatus").then(res => {
        this.sspdStatusList = res.get("SspdStatus");
        this.sspdTypeList = res.get("SspdType");
        this.relieveTypeList = res.get("AnlgSspdType");
        this.dictMap = res.get("map");
        let sspdList = this.sspdTypeList;
        let relieveList = this.relieveTypeList;
        for(let i=0; i<sspdList.length; i++) {
          this.doubleTypeList.push(
            {
              key: sspdList[i].key,
              value: sspdList[i].value
            }
          )
        }
        for(let i=0; i<relieveList.length; i++) {
          this.doubleTypeList.push(
            {
              key: relieveList[i].key,
              value: relieveList[i].value
            }
          )
        }
      });
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            this.formItem.licenseFlag = this.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleTypeChange(value) {
        if(value === "ST01") {
          this.formItem.sspdType = "ST01";
        }else if(value === "ST02") {
          this.formItem.sspdType = "ST02";
        }else if(value === "ST03") {
          this.formItem.sspdType = "ST03";
        }else if(value === "RT01") {
          this.formItem.relieveType = "RT01";
          this.formItem.sspdType = "";
        }else if(value === "RT02") {
          this.formItem.relieveType = "RT02";
          this.formItem.sspdType = "";
        }else if(value === "RT03") {
          this.formItem.relieveType = "RT03";
          this.formItem.sspdType = "";
        }else if(value === "RT04") {
          this.formItem.relieveType = "RT04";
          this.formItem.sspdType = "";
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = '';
          this.formItem.drwrAcctNo = '';
          this.formItem.sspdType = '';
          this.formItem.relieveType = '';
          this.formItem.billNo = '';
          this.formItem.acptProtocalNo = '';
          this.formItem.ownedBrchNames = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.reverseBillNo = '';
        });
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      //复核通过
      recheckPass() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        let ids = "";
        let acptIds = "";
        let ownedBrchNo=list[0].ownedBrchNo;
        let flag=false;
        let billNos = [];
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          acptIds += list[i].acptId;
          if(list[i].isInnerAcct === "0" && (list[i].sspdAndRelieveType === "挂失止付"|| list[i].sspdAndRelieveType === "公示催告")) {
            billNos.push(list[i].billNo);
          }
          if(i < list.length - 1) {
            ids += ",";
            acptIds += ",";
          }
          if (list[i].ownedBrchNo!==ownedBrchNo) {
            flag=true;
            break;
          }
        }
        if (flag) {
          this.$msgTip.info(this, { info: "请选择相同的机构下的票据" });
          return;
        }
        this.ids = this.$refs.datagrid.selectIds;
        this.acptIds = acptIds;
        let param = {ids:this.ids,licenseFlag:this.licenseFlag,ownedBrchNo:this.$refs.datagrid.selects[0].ownedBrchNo};
        if(billNos.length === 0) {
          this.$loadingbox.open({
            title: "提交中，请稍后..."
          });
          this.stopRecheck(param);
        } else {
          let billNosShow = "";
          for(let i=0; i<billNos.length; i++) {
            billNosShow += billNos[i];
            if(i<billNos.length - 1) {
              billNosShow += ",";
            }
          }
          this.$hMsgBox.confirm({
              title: '确认',
              content: '票号为【'+ billNosShow +'】的止付人非我行客户，请确认是否已收取手续费？',
              onOk: () => {
                this.$loadingbox.open({
                  title: "提交中，请稍后..."
                });
                this.stopRecheck(param);
              },
          })
        }
      },
      //止付复核
      stopRecheck(param){
        post(param, "/ce/acpt/paper/stopPayment/stopPaymentRecheck/func_updateAcptSspdAcct").then(res => {
          if(res) {
            this.$loadingbox.close();
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(msg === ""){
                this.$msgTip.success(this);
              }else{
                this.$msgTip.error(this, { info: msg });
              }
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$refs.datagrid.selects = [];
              this.ids = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$loadingbox.close();
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //复核退回
      recheckBack() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        let ids = "";
        let ownedBrchNo=list[0].ownedBrchNo;
        let flag=false;
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i < list.length - 1) {
            ids += ",";
          }
          if (list[i].ownedBrchNo!==ownedBrchNo) {
            flag=true;
            break;
          }
        }
        if (flag) {
          this.$msgTip.info(this, { info: "请选择相同的机构下的票据" });
          return;
        }
        this.$loadingbox.open({
          title: "提交中，请稍后..."
        });
        post({code:ids,licenseFlag:this.licenseFlag,ownedBrchNo:this.$refs.datagrid.selects[0].ownedBrchNo}, "/ce/acpt/paper/stopPayment/stopPaymentRecheck/func_checkBack").then(res => {
          if(res) {
            this.$loadingbox.close();
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$loadingbox.close();
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //影像弹窗
      openImgWin(id,status) {
        this.imageParams.listId = id;
        if(status === "止付待复核") {
          this.imageParams.imgBusiType = "0";
        }else if(status === "解除止付待复核") {
          this.imageParams.imgBusiType = "1";
        }
        this.showUploadImageWin = true;
      },
      //影像关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.handleSearch();
      },
    }
  };
</script>

<style scoped>

</style>
