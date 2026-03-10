<!-- 代开录票-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
<!--                <bill-origin v-model="formItem.billOrigin" :dictList="billOriginList"></bill-origin>-->
<!--                <pyee-name :formItem="formItem"></pyee-name>-->
<!--                <acpt-name :formItem="formItem"></acpt-name>-->
<!--                <remit-dt :formItem="formItem"></remit-dt>-->
<!--                <bill-money :formItem="formItem"></bill-money>-->
<!--                <due-dt :formItem="formItem"></due-dt>-->
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore"></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <div class="c-module-box">
            <h-datagrid :columns="columns"
                        highlightRow
                        url="/ce/acpt/elec/apply/replaceAcptBillMain/func_queryReplaceAcptBillMain"
                        :bindForm="formItem"
                        paramId="billId"
                        :rowClassName="className"
                        :hasSelect="false"
                        rowSelect
                        ref="datagrid">
              <div slot="toolbar" class="c-table-query-btns">
                <add-btn @handleForm="addOrEdit('add')"></add-btn>
<!--                <modify-btn @handleForm="addOrEdit('modify')"></modify-btn>-->
                <delete-btn @deleteData="deleteBill()"></delete-btn>
<!--                <batch-import-btn @batchImport="batchImport()"></batch-import-btn>-->
<!--                <export-temp-btn @exportTemplate="downloadTemplate()"></export-temp-btn>-->
<!--                <drwr-register-btn @drwrRegister="applyOperate"></drwr-register-btn>-->
              </div>
            </h-datagrid>
          </div>
        </div>
        <!-- 新增修改弹窗 -->
        <bill-main-add-or-edit-win :add-or-edit-win="addOrEditWin" :params="addOrEditParams"
                                   @addOrEditWinClose="addOrEditWinClose"
                                   @addOrEditWinSubmit="addOrEditWinSubmit"></bill-main-add-or-edit-win>


<!--        <ebank-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"-->
<!--                              :billId="this.billId" :billRangeStart="this.billRangeStart"-->
<!--                              :billRangeEnd="this.billRangeEnd"></ebank-bill-info-main>-->

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {
    post,
    on,
    off,
    formatNumber,
    formatBillRange,
    getDictValueFromMap,
    getDictListByGroups,
  }
    from "@/api/bizApi/commonUtil";

  export default {
    name: "replaceAcptBillMain",
    components: {
      BillMainAddOrEditWin: () => import(/* webpackChunkName: "ce/acpt/elec/replaceAcptMakeBill/billMainAddOrEditWin" */`@/views/bizViews/ce/acpt/elec/replaceAcptMakeBill/billMainAddOrEditWin`)
    },
    data() {
      return {
        checkShowInfoWin:false,
        passstr:'',
        checkotp:false,
        formItem: {
          billOrigin: "",
          pyeeName: "",
          acptName: "",
          remitDateRange: "",
          dueDateRange: "",
          minRemitDt: "",
          maxRemitDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          transNo:'',
          reverseBillNo:""
        },
        billOriginList: [{key: "CS01", value: "ECDS"}, {key: "CS02", value: "金融机构"}],
        ifShowMore: false,
        addOrEditWin: false,
        billRangeStart: "",
        billRangeEnd: "",
        importColumns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: "billOrigin",
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
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
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName"
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo"
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctName'),
            key: "pyeeAcctName"
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankName'),
            key: "pyeeBankName"
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: "pyeeBankNo"
          },
          {
            title: this.$t('m.i.billInfo.pyeeMemberId'),
            key: "pyeeMemberId"
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName"
          },
          {
            title: this.$t('m.i.billInfo.acptAcctNo'),
            key: "acptAcctNo"
          },
          {
            title: this.$t('m.i.billInfo.acptAcctName'),
            key: "acptAcctName"
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName"
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo"
          },
          {
            title: this.$t('m.i.billInfo.acptMemberId'),
            key: "acptMemberId"
          },
          {
            title: this.$t('m.i.billInfo.banEndrsmtMark'),
            key: "banEndrsmtMark",
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "BanEndorsementMarkCode", params.row.banEndrsmtMark);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.transCtrctNo'),
            key: "transCtrctNo"
          },
          {
            title: this.$t('m.i.billInfo.acptProtocalNo'),
            key: "acptProtocalNo",
          },
          {
            title: this.$t('m.i.billInfo.isAllowSplitBill'),
            key: "isAllowSplitBill",
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isAllowSplitBill);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.autoType'),
            key: "drwrAutoType"
          },
          {
            title: this.$t('m.i.billInfo.pyeeBusinessAddress'),
            key: "pyeeBusinessAddress"
          },

        ],
        addOrEditParams: {
          billOptType: "",
          selectRowList: [],
          ifAcptProtocalNo: false,
          ifShowPyeeBusinessAddress: false,
          ifShowDraweeBusinessAddress: false,
          isOpenReserveRegister: false,
          draweeBusinessAddressArr: [],
          ifAutoType: true,
          ifAutoQueryPyeeInfo: false,
          isPreservationComRoster4Pyee: true,
          isPreservationComRoster4Acpt: false,
        },

        dictMap: new Map(),
        billOptType: "",

        importWin: false,
        fileParams: {
          loadExcelUrl: "",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/makeBill/billMain/func_saveExcelData",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [],
          paramKey: "list"         //后台接收对应key
        },

        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t('m.i.common.index'),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: "billOrigin",
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = this.$t('m.i.common.showBillInfo');
              } else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    if (params.row.billRangeStart != null && params.row.billRangeEnd != null) {
                      this.showBillInfo(params.row.billId, params.row.billRangeStart.toString(), params.row.billRangeEnd.toString());
                    } else {
                      this.showBillInfo(params.row.billId, params.row.billRangeStart, params.row.billRangeEnd);
                    }
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
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
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            sortable: true,
            key: "drwrName"
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo"
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            sortable: true,
            key: "pyeeName"
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo"
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            sortable: true,
            key: "acptName"
          },
        ],
        addBillInfoForm: {},
        billId: "",
        haveAcptProtocalNo: "",
        ifAcptProtocalNo: false,
        ifAutoType: true,
        ifAutoQueryPyeeInfo: false,
        showBillInfoWin: false,
        showPyeeBusinessAddress: "",
        isOpenReserveRegister: false,
        boxParams: {},
        boxUrl: "",
      }
    },
    mounted() {
      this.getParams()
      this.handleResize();
      // this.getIsAcptProtocalNo();
      // this.getIfAutoType();

      on(window, "resize", this.handleResize);
      getDictListByGroups("DraftTypeCode,EcdsBillStatusCode,BillOrigin,Yon,CpesBillStatus,BanEndorsementMarkCode").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    beforeDestroy() {
      off(window, "resize", this.handleResize);
    },
    methods: {
      getParams(){
        if (this.$route.path === "/makeBill/billMain") {
          if (!!this.$route.query.transNo) {
            this.formItem.transNo = this.$route.query.transNo;
          }
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      },
      applyOperate() {
        let content = "", url = "/makeBill/billMain/func_batchComrclDrftApply", params = {};
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          //出票登记
          // content = "确定进行出票登记吗？";
          content = this.$t('m.i.makeBill.msg.applyMainRegister');
          params = this.initParams("NES.001.20.00P", this.$t('m.i.makeBill.drwrRegister'));
          this.handleValet(content, params, url);
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        }
      },
      initParams(transNo, transName) {
        let list = this.$refs.datagrid.selects;
        let requestDto = {};
        requestDto.custNo = this.formItem.custNo;
        requestDto.applAcctNo = this.formItem.custAcctNo;
        let reqInfoList = [];
        for (let i = 0, len = list.length; i < len; i++) {
          let reqInfo = {};
          let billInfo = {};
          billInfo = list[i];
          reqInfo.transNo = transNo;
          reqInfo.transName = transName;
          reqInfo.hldrId = list[i].hldrId;
          reqInfo.billId = list[i].billId;
          reqInfo.billOrigin = list[i].billOrigin;
          reqInfo.transAmt = list[i].transAmt;
          reqInfo.stdAmt = list[i].stdAmt;
          reqInfo.billRangeStart = list[i].billRangeStart;
          reqInfo.billRangeEnd = list[i].billRangeEnd;
          billInfo.id = list[i].billId;
          if (billInfo.extChnlData !== null && billInfo.extChnlData !== "") {
            if (typeof billInfo.extChnlData === 'string') {
              billInfo.extChnlData = JSON.parse(billInfo.extChnlData);
            }
          } else {
            billInfo.extChnlData = null;
          }
          reqInfo.billInfo = billInfo;
          reqInfoList.push(reqInfo);
        }
        requestDto.reqInfoList = reqInfoList;
        return requestDto;
      },
      handleValet(content, params, url) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          okText: this.$t('m.i.common.confirm'),
          onOk: () => {
            this.boxParams = params
            this.boxUrl = url
            this.passstr='getIfAutoType'
            this.checkotp=true
          }
        });
      },
      // otp校验
      pass(val1){
        if(val1=='getIfAutoType'){
          //出票登记
          this.getifAutotypeConfirm()
        }else {
          //删除票据
          this.deleteBillConfirm()
        }
        this.checkotp=false;
      },
      checkWinClose(){
        this.checkotp=false;
      },
      getifAutotypeConfirm(){
        console.log(this.boxParams, this.boxUrl)
        post(this.boxParams, this.boxUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retData = res.data.retData;
            let retMsg = null ? '' : res.data.retMsg;
            if (retCode === "000000") {
              let errMsg = "";
              if (retData !== null && retData !== undefined) {
                for (let i = 0; i < retData.length; i++) {
                  if (retData[i].retCode !== "000000") {
                    errMsg = errMsg + retData[i].retMsg + '<br>';
                  }
                }
              }
              if (errMsg === "") {
                this.$msgTip.success(this, {info: retMsg});
              } else {
                this.$msgTip.error(this, {info: errMsg});
              }
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$refs.datagrid.dataChange(1);
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.commonApi.netError")});
          }
        });

      },
      className(row, index) {
        if (row.disabled) {
          return 'h-table-info-row';
        }
      },
      getIfAutoType() {
        post({}, "/makeBill/billMain/getIfAutoType").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let autoType = res.data.retData.param;
              if (autoType === "0") {
                this.ifAutoType = false;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.commonApi.netError")});
          }
        });
      },
      getIsAcptProtocalNo() {
        post({}, "/makeBill/billMain/getIfAcptProtocalNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.haveAcptProtocalNo = res.data.retData.param;
              if (this.haveAcptProtocalNo === "1") {
                this.ifAcptProtocalNo = true;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.commonApi.netError")});
          }
        });
      },
      showBillInfo(billId, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showQry() {
        this.ifShowMore = !this.ifShowMore
      },
      /**
       * 列表搜索
       * */
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        /**清除选择的数据*/
        this.$refs.datagrid.selects = [];
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.billOrigin = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
      },
      handleResize() {
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
        });
      },
      //新增、修改
      addOrEdit(type) {
        this.billOptType = type;
        this.addOrEditParams.draweeBusinessAddressArr = [];
        this.addOrEditParams.pyeeBusinessAddress = [];
        if (this.billOptType === "add") {
          this.jumpToAddOrEditBillWin();
        }
        if (this.billOptType === "modify") {
          let list = this.$refs.datagrid.selects;
          if (list.length !== 1) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
            return;
          }
          if (this.ifShowDraweeBusinessAddress === true
            && list[0].draweeBusinessAddress != null
            && list[0].draweeBusinessAddress != undefined) {
            this.addOrEditParams.draweeBusinessAddressArr = list[0].draweeBusinessAddress.split(",");
            this.addOrEditParams.draweeBusinessAddressArr[0] = this.addOrEditParams.draweeBusinessAddressArr[0].trim();
            this.addOrEditParams.draweeBusinessAddressArr[1] = this.addOrEditParams.draweeBusinessAddressArr[1].trim();
          }
          if (this.ifShowPyeeBusinessAddress === true
            && list[0].pyeeBusinessAddress != null
            && list[0].pyeeBusinessAddress != undefined) {
            this.addOrEditParams.pyeeBusinessAddress = list[0].pyeeBusinessAddress.split(",");
          }
          this.addOrEditParams.selectRowList = list[0];
          this.jumpToAddOrEditBillWin();
        }
      },
      jumpToAddOrEditBillWin() {
        this.addOrEditParams.billOptType = this.billOptType;
        this.addOrEditParams.ifAcptProtocalNo = this.ifAcptProtocalNo;
        this.addOrEditParams.ifShowPyeeBusinessAddress = this.ifShowPyeeBusinessAddress;
        this.addOrEditParams.ifShowDraweeBusinessAddress = this.ifShowDraweeBusinessAddress;
        this.addOrEditParams.isOpenReserveRegister = this.isOpenReserveRegister;
        this.addOrEditParams.isPreservationComRoster4Pyee = false;
        this.addOrEditParams.isPreservationComRoster4Acpt = false;
        this.addOrEditParams.ifAutoType = this.ifAutoType;
        this.addOrEditParams.ifAutoQueryPyeeInfo = this.ifAutoQueryPyeeInfo;
        this.addOrEditWin = true;
      },

      //新增、修改弹窗关闭
      addOrEditWinClose() {
        this.addOrEditWin = false;

        this.addOrEditParams = {};
      },
      //新增、修改弹窗确定
      addOrEditWinSubmit(info) {
        this.addBillInfoForm = info;
        this.addBillInfoForm.remitDt = this.$moment(this.addBillInfoForm.remitDt).format("YYYYMMDD");
        this.addBillInfoForm.dueDt = this.$moment(this.addBillInfoForm.dueDt).format("YYYYMMDD");
        this.addBillInfoForm.billMoney = this.addBillInfoForm.billMoney.replace(/,/g, "");
        if (this.addBillInfoForm.remitDt >= this.addBillInfoForm.dueDt) {
          // this.$msgTip.info(this, {info: "出票日期必须小于汇票到期日"});
          this.$msgTip.info(this, {info: this.$t('m.i.makeBill.msg.info1')});
          return;
        }
        if (this.billOptType === "modify") {
          this.addBillInfoForm.id = this.$refs.datagrid.selects[0].billId;
          this.addBillInfoForm.hldrId = this.$refs.datagrid.selects[0].hldrId;
        } else {
          this.addBillInfoForm.hldrId = "";
        }
        this.addBillInfoForm.transNo = "CBS.000.20.02P";
        let url = this.billOptType === "add" ? "/ce/acpt/elec/apply/replaceAcptBillMain/func_addReplaceAcptBill" : "/makeBill/billMain/func_updateBillInfo";
        let params = this.addBillInfoForm;
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retData = res.data.retData;
            let retMsg = null ? '' : res.data.retMsg;
            if (retCode === "000000") {
              let errMsg = "";
              if (retData !== null && retData !== undefined) {
                for (let i = 0; i < retData.length; i++) {
                  if (retData[i].retCode !== "000000") {
                    errMsg = errMsg + retData[i].retMsg + '<br>';
                  }
                }
              }
              if (errMsg === "") {
                this.$msgTip.success(this, {info: retMsg});
              } else {
                this.$msgTip.error(this, {info: errMsg});
              }
              if (errMsg === ""){
                this.addOrEditWin = false;
                this.formSearch();
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.commonApi.netError")});
          }
        });
      },

      //删除
      deleteBill() {
        if (this.$refs.datagrid.selects === null || this.$refs.datagrid.selects === undefined || this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          okText: this.$t('m.i.common.confirm'),
          onOk: () => {
            this.deleteBillConfirm();
          }
        });
      },
      //删除确认
      deleteBillConfirm() {
        let reqList = [];
        let vo = {};
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < this.$refs.datagrid.selects.length; i++) {
          debugger
          let reqInfo = {};
          reqInfo.drwrAcctNo = list[i].drwrAcctNo;
          reqInfo.drwrCustNo = list[i].transFromCustNo;
          reqInfo.billId = list[i].billId;
          reqInfo.billNo = list[i].billNo;
          reqInfo.transNo = "CBS.000.20.02P";
          reqList.push(reqInfo);
        }
        vo.reqList = reqList;
        post(vo, "/ce/acpt/elec/apply/replaceAcptBillMain//func_deleteReplaceBillInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            let retData = res.data.retData;
            if (retCode === "000000") {
              let errMsg = "";
              if (retData !== null && retData !== undefined) {
                for (let i = 0; i < retData.length; i++) {
                  if (retData[i].retCode !== "000000") {
                    errMsg = errMsg + retData[i].retMsg + '<br>';
                  }
                }
              }
              if (errMsg === "") {
                this.$msgTip.success(this);
              } else {
                this.$msgTip.error(this, {info: errMsg});
              }
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, {info: msg});
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.commonApi.netError")});
          }
        });
      },

      //批量导入
      batchImport() {
        this.fileParams.extraGridDatas = {custAcctNo: this.formItem.applAcctNo};
        //页面表格渲染条件处理
        if (!this.ifAutoType) { //自动类型
          this.importColumns.forEach(element => {
            if (element.key === "drwrAutoType") {
              element.hiddenCol = true;
            }
          });
        }

        if (!this.ifAcptProtocalNo) { //承兑协议编号
          this.importColumns.forEach(element => {
            if (element.key === "acptProtocalNo") {
              element.hiddenCol = true;
            }
          });
        }

        if (!this.ifShowPyeeBusinessAddress) { //收款人地址
          this.importColumns.forEach(element => {
            if (element.key === "pyeeBusinessAddress") {
              element.hiddenCol = true;
            }
          });
        }

        if (!this.ifShowDraweeBusinessAddress) { //出票人地址
          this.importColumns.forEach(element => {
            if (element.key === "draweeBusinessAddress") {
              element.hiddenCol = true;
            }
          });
        }

        if (!this.isOpenReserveRegister) { //是否预约出票

          this.importColumns.forEach(element => {
            if (element.key === "rgstType") {
              element.hiddenCol = true;
            }
          });
        }
        this.fileParams.columns = this.importColumns;

        var isShowParam = {};
        var paramMap = {};
        // 后续添加属性只需要加相应的属性即可
        paramMap.ifAcptProtocalNo = this.ifAcptProtocalNo;
        paramMap.ifAutoType = this.ifAutoType;
        paramMap.ifShowPyeeBusinessAddress = this.ifShowPyeeBusinessAddress;
        paramMap.ifShowDraweeBusinessAddress = this.ifShowDraweeBusinessAddress;
        paramMap.isOpenReserveRegister = this.isOpenReserveRegister;

        isShowParam.paramMap = paramMap;
        this.fileParams.uploadParams.isShowParam = JSON.stringify(isShowParam);
        this.fileParams.loadExcelUrl = window.LOCAL_CONFIG.API_HOME + "/makeBill/billMain/func_validateExcelData";
        this.importWin = true;
      },

      importWinClose() {
        this.importWin = false;
      },
      importSuccess(isSuccess) {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },

      //导入模板下载
      downloadTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/makeBill/billMain/func_AdaptDownload";
        var isShowParam = {};
        var paramMap = {};
        // 后续添加属性只需要加相应的属性即可
        paramMap.ifAcptProtocalNo = this.ifAcptProtocalNo;
        paramMap.ifAutoType = this.ifAutoType;
        paramMap.ifShowPyeeBusinessAddress = this.ifShowPyeeBusinessAddress;
        paramMap.ifShowDraweeBusinessAddress = this.ifShowDraweeBusinessAddress;
        paramMap.isOpenReserveRegister = this.isOpenReserveRegister;
        isShowParam.paramMap = paramMap;

        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        let input = document.createElement('input')
        input.type = 'text'
        input.name = 'isShowParam';
        input.value = JSON.stringify(isShowParam);
        form.appendChild(input);
        document.body.appendChild(form);
        document.getElementById("formId").submit();
        document.getElementById("formId").remove();
      }

    }
  };
</script>
