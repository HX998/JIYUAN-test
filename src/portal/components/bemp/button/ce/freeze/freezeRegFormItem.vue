<!--司法冻结-冻结申请-冻结详情-->
<template>
  <div>
    <h-msg-box v-model="tempFreezeRegFormItemWinWin" :maximize="true" :mask-closable="false" @on-close="freezeRegFormItemWinClose"
               width="1000" class="h-form-search-layer">
      <p slot="header">
        <span v-if="this.freezeRgstType==='ST01'">冻结申请详情</span>
        <span v-else>解除冻结申请详情</span>
      </p>
      <div>
        <h-form :model="freezeRegForm" :label-width="115" ref="freezeRegForm" cols="3" class="h-form-search">
          <!--票据（包）号码-->
          <common-input v-if="this.freezeRgstType==='ST01'" v-model="freezeRegForm.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" readonly required
                        :showIcon="true" @on-click="queryAcptBillInfo"></common-input>
          <common-input v-else  v-model="freezeRegForm.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" readonly></common-input>
          <!--子票区间-->
          <common-input v-model="freezeRegForm.billRange" :label="$t('m.i.billInfo.billRange')" prop="billRange" readonly></common-input>
          <bill-range :form-item="freezeRegForm" :range-props="['sspdBillRangeStart','sspdBillRangeEnd']" required :label="$t('m.i.billInfo.sspdBillRange')"
                       @on-blur="onSspdBillRangeBlur" :readonly="this.freezeRgstType==='ST02'"></bill-range>
          <!--冻结/解冻日期-->
          <common-date-picker v-if="this.freezeRgstType==='ST01'" v-model="freezeRegForm.sspdDt" :label="$t('m.i.ce.freezeDt')" prop="sspdDt" :required="true"></common-date-picker>
          <common-date-picker v-else v-model="freezeRegForm.anlgSspdDt" :label="$t('m.i.ce.unFreezeDt')" prop="anlgSspdDt" :required="true"></common-date-picker>
          <!--登记类型-->
          <common-select v-model="freezeRegForm.freezeRgstType" :label="$t('m.i.ce.freezeRgstType')" prop="rgstType"
                         :dictList="freezeRegParams.freezeRgstTypeList" readonly></common-select>
          <!--承兑协议编号-->
          <common-input v-if="this.billType === 'AC01'" v-model="freezeRegForm.acptProtocalNo" :label="$t('m.i.billInfo.acptProtocalNo')" prop="acptProtocalNo" readonly></common-input>
          <!--票据种类-->
          <common-select v-model="freezeRegForm.billType" :label="$t('m.i.billInfo.billType')" prop="billType"
                         :dictList="freezeRegParams.billTypeList"  readonly></common-select>
          <!--票据（包）金额（元）-->
          <common-type-field v-model="freezeRegForm.billMoney" :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" readonly></common-type-field>
          <!--收款人全称-->
          <common-input v-model="freezeRegForm.pyeeName" :label="$t('m.i.billInfo.pyeeName')" prop="pyeeName" readonly></common-input>
          <!--出票人全称-->
          <common-input v-model="freezeRegForm.drwrName" :label="$t('m.i.billInfo.drwrName')" prop="drwrName" readonly></common-input>
          <!--出票人账号-->
          <common-input v-model="freezeRegForm.drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo" readonly></common-input>
          <!--出票日期-->
          <common-date-picker v-model="freezeRegForm.remitDt" :label="$t('m.i.billInfo.remitDt')" prop="remitDt" readonly></common-date-picker>
          <!--汇票到期日-->
          <common-date-picker v-model="freezeRegForm.dueDt" :label="$t('m.i.billInfo.dueDt')" prop="dueDt" readonly></common-date-picker>
          <!--冻结/解冻备注-->
          <common-input v-if="this.freezeRgstType==='ST01'" v-model="freezeRegForm.sspdRemark" :label="$t('m.i.common.remark')"
                        prop="sspdRemark" :maxlength="150" :lengthByByte="false"></common-input>
          <common-input v-else v-model="freezeRegForm.relieveRemark" :label="$t('m.i.common.remark')" prop="relieveRemark" :maxlength="150" :lengthByByte="false"></common-input>
          <!--业务办理机构名称-->
          <common-input v-model="freezeRegForm.busiBrchName" :label="$t('m.i.ce.busiHandleBrchName')" prop="busiBrchName" readonly></common-input>
          <!--业务办理机构代码-->
          <common-input v-model="freezeRegForm.busiBrchCode" :label="$t('m.i.ce.busiHandleBrchCode')" prop="busiBrchCode" readonly></common-input>
          <!--申请日期-->
          <common-date-picker v-if="this.freezeRgstType==='ST01'" v-model="freezeRegForm.sspdRgstDt" :label="$t('m.i.common.applDt')" prop="sspdRgstDt" readonly></common-date-picker>
          <common-date-picker v-else v-model="freezeRegForm.relieveRgstDt" :label="$t('m.i.common.applDt')" prop="relieveRgstDt" readonly></common-date-picker>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="freezeRegFormItemWinClose()" >{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" @click="fileManage()"  >{{$t('m.i.common.fileManage')}}</h-button>
        <h-button type="primary" @click="save()"  >{{$t('m.i.common.save')}}</h-button>
      </div>
    </h-msg-box>
    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" :dictMap="dictMap" :filePathUrl="filePathUrl" @showFileWinClose="showFileWinClose"></show-file-win>
    <show-acpt-bill-win :showAcptBillWin="showAcptBillWin" :acptBillParams="this.acptBillParams" :queryUrl="this.queryAcptBillUrl" @showAcptBillInfoWinClose="showAcptBillInfoWinClose"
                        @acptBillInfoSelectSubmit="acptBillInfoSelectSubmit"></show-acpt-bill-win>
  </div>
</template>

<script>
  import { post, formatBillRange, accAdd, accMul, accSub } from "@/api/bizApi/commonUtil";

  export default {
    name: "freezeRegFormItem",
    components: {
      ShowFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */`@/views/bizViews/pc/img/showFileWin`),
    },
    data() {
      return {
        // 登记类型
        freezeRgstType:"",
        billType:"",
        // 附件管理
        showFileWin: false,
        busiId:"",
        busiNo: "",
        busiType : "",
        fileType: "",
        fileMaxSize: 2.0*1024,
        fileSuffix:"jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,bmp,BMP,xls,XLS,xlsx,XLSX,et,ET,doc,DOC,docx,DOCX,WPS,wps,ppt,PPT,pps,PPS,dps,DPS,pdf,PDF,zip,rar,ZIP,RAR,pptx,PPTX",
        filePathUrl: "/ce/acpt/elec/freeze/freezeRegApply/",
        fileBatchParams: {},
        acptId:"",
        dictMap: new Map(),
        workDate: window.sessionStorage.getItem("workDate"),
        busiBrchName: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        busiBrchCode: JSON.parse(window.sessionStorage.getItem('userInfo')).cepsBrchCode,
        freezeRegForm: {
          acptId:"",
          billNo:"",
          billOrigin:"",
          billRangeStart:"",
          billRangeEnd:"",
          sspdBillRangeStart:"",
          sspdBillRangeEnd:"",
          stdAmt:"",
          billRange:"",
          acptProtocalNo:"",
          billType:"",
          billMoney:"",
          pyeeName:"",
          drwrName:"",
          drwrAcctNo:"",
          remitDt:"",
          dueDt:"",
          acptDt:"",
          busiBrchName:"",
          busiBrchCode:"",
          sspdDt:"",
          sspdRgstDt:"",
          freezeRgstType:"",
          id:"",
          anlgSspdDt:"",
          relieveRgstDt:"",
          sspdRemark:"",
          relieveRemark:""
        },
        showAcptBillWin: false,
        queryAcptBillUrl: "/ce/acpt/elec/freeze/freezeRegApply/func_queryAcptBillByPage",
        acptBillParams: {},
      };
    },
    props: {
      freezeRegFormItemWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      freezeRegParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    computed: {
      tempFreezeRegFormItemWinWin: {
        get() {
          return this.freezeRegFormItemWin;
        },
        set() {
        }
      }
    },
    watch: {
      freezeRegFormItemWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.freezeRgstType = this.freezeRegParams.freezeRgstType;
            this.billType = this.freezeRegParams.billType;
            if (this.billType && this.billType === 'AC02') {
              this.queryAcptBillUrl = "/ce/acpt/outerBusiBill/busiFreeze/freezeRegApply/func_queryAcptBillByPage";
            }
            this.dictMap = this.freezeRegParams.dictMap;
            this.initFreezeRgstInfo();
          });
        }
      }
    },
    methods: {
      onSspdBillRangeBlur(){
        if (!(this.freezeRegForm.sspdBillRangeStart || this.freezeRegForm.sspdBillRangeStart === 0)) {
          this.$msgTip.error(this, {info: this.$t("冻结子票区间起始不能为空")});
          return;
        }
        if (!(this.freezeRegForm.sspdBillRangeEnd || this.freezeRegForm.sspdBillRangeEnd === 0)) {
          this.$msgTip.error(this, {info: this.$t("冻结子票区间截止不能为空")});
          return;
        }
        this.freezeRegForm.sspdBillRangeStart = parseInt(this.freezeRegForm.sspdBillRangeStart);
        this.freezeRegForm.sspdBillRangeEnd = parseInt(this.freezeRegForm.sspdBillRangeEnd);
        if (this.freezeRegForm.sspdBillRangeStart < this.freezeRegForm.billRangeStart) {
          this.$msgTip.error(this, {info: this.$t("冻结子票区间起始必须大于等于原子票区间起始")});
          return;
        }
        if (this.freezeRegForm.sspdBillRangeEnd > this.freezeRegForm.billRangeEnd) {
          this.$msgTip.error(this, {info: this.$t("冻结子票区间截止必须小于等于原子票区间截止")});
          return;
        }
        if (this.freezeRegForm.sspdBillRangeStart !==0 && this.freezeRegForm.sspdBillRangeStart >= this.freezeRegForm.sspdBillRangeEnd) {
          this.$msgTip.error(this, {info: this.$t("冻结子票区间起始必须小于冻结子票区间截止")});
          return;
        }
        if (this.freezeRegForm.sspdBillRangeStart > 0){
          // 拆分，计算票据金额：票据金额=(截止-起始+1)*标准金额
          this.freezeRegForm.billMoney = accMul(accAdd(accSub(this.freezeRegForm.sspdBillRangeEnd,this.freezeRegForm.sspdBillRangeStart),1),this.freezeRegForm.stdAmt);
        }
      },
      //根据承兑Id查询票据明细信息
      queryAcptBillById() {
        let params = { acptId: this.acptId, billType: this.billType };
        let url = "/ce/acpt/elec/freeze/freezeRegApply/func_queryAcptBillById";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.freezeRegForm.acptId = obj.id;
              this.freezeRegForm.billNo = obj.billNo;
              this.freezeRegForm.billOrigin = obj.billOrigin;
              this.freezeRegForm.billRangeStart = obj.billRangeStart;
              this.freezeRegForm.billRangeEnd = obj.billRangeEnd;
              this.freezeRegForm.originBillRange = formatBillRange(obj.billOrigin, obj.billRangeStart, obj.billRangeEnd);
              this.freezeRegForm.acptProtocalNo = obj.acptProtocalNo;
              this.freezeRegForm.billType = obj.billType;
              this.freezeRegForm.billMoney = obj.billMoney;
              this.freezeRegForm.pyeeName = obj.pyeeName;
              this.freezeRegForm.drwrName = obj.drwrName;
              this.freezeRegForm.drwrAcctNo = obj.drwrAcctNo;
              if (obj.remitDt != null) {
                this.freezeRegForm.remitDt = this.$moment(obj.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              if (obj.dueDt != null) {
                this.freezeRegForm.dueDt = this.$moment(obj.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              if (obj.acptDt != null) {
                this.freezeRegForm.acptDt = this.$moment(obj.acptDt, "YYYYMMDD").format("YYYYMMDD");
              }
              this.freezeRegForm.busiBrchName = this.busiBrchName;
              this.freezeRegForm.busiBrchCode = this.busiBrchCode;
              // 冻结信息组装
              if (this.freezeRgstType === 'ST01') {
                this.freezeRegForm.sspdDt = this.workDate;
                this.freezeRegForm.sspdRgstDt = this.workDate;
                this.freezeRegForm.freezeRgstType = "ST01";
                if (obj.sspdId !== null && obj.sspdId !== "" && obj.sspdStatus == '8'
                  && (obj.flowStatus == "PICE01090101-PICE01090001" || obj.flowStatus == "PICE01090201-PICE01090102")) {
                  // 当sspdId不为空，冻结状态为已冻结，且冻结流程状态为冻结申请登记失败和冻结申请复核驳回时，把sspdId作为附件的业务ID
                  this.freezeRegForm.id = obj.sspdId;
                  this.busiId = obj.sspdId;
                } else if (obj.sspdId !== null && obj.sspdId !== "" && obj.sspdStatus != '8') {
                  // 当sspdId不为空，且冻结状态不为已解除冻结时，把sspdId作为附件的业务ID
                  this.freezeRegForm.id = obj.sspdId;
                  this.busiId = obj.sspdId;
                } else {
                  // 当sspdId为空，或sspdId不为空且冻结状态为已解除冻结时，把ID把sspdId置为null，作为附件的业务ID，在提交申请时把它更新成sspdId
                  this.freezeRegForm.id = null;
                  this.busiId = obj.id;
                }
              } else {
                this.freezeRegForm.anlgSspdDt = this.workDate;
                this.freezeRegForm.relieveRgstDt = this.workDate;
                this.freezeRegForm.freezeRgstType = "ST02";
                this.freezeRegForm.id = obj.sspdId;
                this.busiId = obj.sspdId;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      initFreezeRgstInfo() {
        this.freezeRegForm.busiBrchName = this.busiBrchName;
        this.freezeRegForm.busiBrchCode = this.busiBrchCode;
        this.freezeRegForm.billType = this.billType;
        this.freezeRegForm.freezeRgstType = this.freezeRgstType;
        if (this.freezeRgstType === 'ST01') {
          this.freezeRegForm.sspdDt = this.workDate;
          this.freezeRegForm.sspdRgstDt = this.workDate;
          this.freezeRegForm.freezeRgstType = "ST01";
          let freezeRegInfo = this.freezeRegParams.freezeRegInfo
          if (freezeRegInfo){
            this.busiId = freezeRegInfo.id;
            this.freezeRegForm.id = freezeRegInfo.id;
            this.freezeRegForm.acptId = freezeRegInfo.acptId;
            this.freezeRegForm.billNo = freezeRegInfo.billNo;
            this.freezeRegForm.billOrigin = freezeRegInfo.billOrigin;
            this.freezeRegForm.billRangeStart = freezeRegInfo.billRangeStart;
            this.freezeRegForm.billRangeEnd = freezeRegInfo.billRangeEnd;
            this.freezeRegForm.billRange = formatBillRange(freezeRegInfo.billOrigin, freezeRegInfo.billRangeStart, freezeRegInfo.billRangeEnd);
            this.freezeRegForm.sspdBillRangeStart = freezeRegInfo.sspdBillRangeStart;
            this.freezeRegForm.sspdBillRangeEnd = freezeRegInfo.sspdBillRangeEnd;
            this.freezeRegForm.acptProtocalNo = freezeRegInfo.acptProtocalNo;
            this.freezeRegForm.pyeeName = freezeRegInfo.pyeeName;
            this.freezeRegForm.drwrName = freezeRegInfo.drwrName;
            this.freezeRegForm.drwrAcctNo = freezeRegInfo.drwrAcctNo;
            this.freezeRegForm.billMoney = freezeRegInfo.billMoney;
            this.freezeRegForm.stdAmt = freezeRegInfo.stdAmt;
            if (freezeRegInfo.remitDt != null) {
              this.freezeRegForm.remitDt = this.$moment(freezeRegInfo.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            if (freezeRegInfo.dueDt != null) {
              this.freezeRegForm.dueDt = this.$moment(freezeRegInfo.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            if (freezeRegInfo.acptDt != null) {
              this.freezeRegForm.acptDt = this.$moment(freezeRegInfo.acptDt, "YYYYMMDD").format("YYYYMMDD");
            }
            if (freezeRegInfo.sspdAndRelieveDt != null) {
              this.freezeRegForm.sspdDt = this.$moment(freezeRegInfo.sspdAndRelieveDt, "YYYYMMDD").format("YYYYMMDD");
            }
            this.freezeRegForm.sspdRemark = freezeRegInfo.sspdRemark;
          }
        } else {
          this.freezeRegForm.anlgSspdDt = this.workDate;
          this.freezeRegForm.relieveRgstDt = this.workDate;
          this.freezeRegForm.freezeRgstType = "ST02";
          let unFreezeRegInfo = this.freezeRegParams.unFreezeRegInfo;
          this.freezeRegForm.id = unFreezeRegInfo.id;
          this.busiId =  unFreezeRegInfo.id;
          this.freezeRegForm.acptId = unFreezeRegInfo.acptId;
          this.freezeRegForm.billNo = unFreezeRegInfo.billNo;
          this.freezeRegForm.billOrigin = unFreezeRegInfo.billOrigin;
          this.freezeRegForm.billRangeStart = unFreezeRegInfo.billRangeStart;
          this.freezeRegForm.billRangeEnd = unFreezeRegInfo.billRangeEnd;
          this.freezeRegForm.billRange = formatBillRange(unFreezeRegInfo.billOrigin, unFreezeRegInfo.billRangeStart, unFreezeRegInfo.billRangeEnd);
          this.freezeRegForm.sspdBillRangeStart = unFreezeRegInfo.sspdBillRangeStart;
          this.freezeRegForm.sspdBillRangeEnd = unFreezeRegInfo.sspdBillRangeEnd;
          this.freezeRegForm.acptProtocalNo = unFreezeRegInfo.acptProtocalNo;
          this.freezeRegForm.pyeeName = unFreezeRegInfo.pyeeName;
          this.freezeRegForm.drwrName = unFreezeRegInfo.drwrName;
          this.freezeRegForm.drwrAcctNo = unFreezeRegInfo.drwrAcctNo;
          this.freezeRegForm.billMoney = unFreezeRegInfo.billMoney;
          this.freezeRegForm.stdAmt = unFreezeRegInfo.stdAmt;
          if (unFreezeRegInfo.remitDt != null) {
            this.freezeRegForm.remitDt = this.$moment(unFreezeRegInfo.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (unFreezeRegInfo.dueDt != null) {
            this.freezeRegForm.dueDt = this.$moment(unFreezeRegInfo.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (unFreezeRegInfo.acptDt != null) {
            this.freezeRegForm.acptDt = this.$moment(unFreezeRegInfo.acptDt, "YYYYMMDD").format("YYYYMMDD");
          }
          if (unFreezeRegInfo.sspdAndRelieveDt != null) {
            this.freezeRegForm.anlgSspdDt = this.$moment(unFreezeRegInfo.sspdAndRelieveDt, "YYYYMMDD").format("YYYYMMDD");
          }
          this.freezeRegForm.relieveRemark = unFreezeRegInfo.relieveRemark;
        }
      },

      //关闭弹窗
      freezeRegFormItemWinClose() {
        this.freezeRgstType = "";
        this.billType = "";
        this.acptId = "";
        this.freezeRegForm = {};
        this.$emit("freezeRegFormItemWinClose", "");
      },
      // 附件管理
      fileManage(){
        if (!this.busiId){
          this.$msgTip.error(this, {info: this.$t("请先导入票据信息")});
          return;
        }
        this.fileBatchParams.operType = "upload";
        this.fileBatchParams.busiId = this.busiId;
        this.fileBatchParams.fileSuffix = this.fileSuffix;
        this.fileBatchParams.filePathUrl = this.filePathUrl;
        this.fileBatchParams.maxSize = this.fileMaxSize;
        if (this.freezeRgstType === 'ST02'){
          this.fileBatchParams.attachBusiType = "unFreezeRegFile";
          this.fileBatchParams.fileType = "FT10";
          this.fileBatchParams.attTypeCodeList = [{ key: "FT10", value: "冻结解除" }];
        }else {
          this.fileBatchParams.attachBusiType = "freezeRegFile";
          this.fileBatchParams.fileType = "FT09";
          this.fileBatchParams.attTypeCodeList = [{ key: "FT09", value: "冻结" }];
        }
        this.fileBatchParams.fileDetailStatusList = [{ key: "FD00", value: "初始" },{ key: "FD01", value: "上传中" },
          { key: "FD02", value: "已上传" },{ key: "FD06", value: "登记失败" }];
        this.showFileWin = true;
      },
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      },
      //查询承兑票据信息
      queryAcptBillInfo() {
        this.acptBillParams = {};
        this.acptBillParams.billType = this.billType;
        this.showAcptBillWin = true;
      },
      showAcptBillInfoWinClose(){
        this.queryAcptBillUrl = "/ce/acpt/elec/freeze/freezeRegApply/func_queryAcptBillByPage";
        this.acptBillParams = {};
        this.showAcptBillWin = false;
      },
      //赋值
      acptBillInfoSelectSubmit(info) {
        this.acptBillInfoReset();
        this.busiId = info.id;
        this.freezeRegForm.acptId = info.id;
        this.freezeRegForm.billNo = info.billNo;
        this.freezeRegForm.billOrigin = info.billOrigin;
        this.freezeRegForm.billRangeStart = info.originBillRangeStart;
        this.freezeRegForm.billRangeEnd = info.originBillRangeEnd;
        this.freezeRegForm.sspdBillRangeStart = info.billRangeStart;
        this.freezeRegForm.sspdBillRangeEnd = info.billRangeEnd;
        this.freezeRegForm.billRange = formatBillRange(info.billOrigin, info.originBillRangeStart, info.originBillRangeEnd);
        this.freezeRegForm.acptProtocalNo = info.acptProtocalNo;
        this.freezeRegForm.billType = info.billType;
        this.freezeRegForm.billMoney = info.billMoney;
        this.freezeRegForm.stdAmt = info.stdAmt;
        this.freezeRegForm.pyeeName = info.pyeeName;
        this.freezeRegForm.drwrName = info.drwrName;
        this.freezeRegForm.drwrAcctNo = info.drwrAcctNo;
        if (info.remitDt != null) {
          this.freezeRegForm.remitDt = this.$moment(info.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        if (info.dueDt != null) {
          this.freezeRegForm.dueDt = this.$moment(info.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        if (info.acptDt != null) {
          this.freezeRegForm.acptDt = this.$moment(info.acptDt, "YYYYMMDD").format("YYYYMMDD");
        }
        this.freezeRegForm.busiBrchName = this.busiBrchName;
        this.freezeRegForm.busiBrchCode = this.busiBrchCode;
        this.showAcptBillInfoWinClose();
      },
      acptBillInfoReset() {
        this.freezeRegForm.acptId = "";
        this.freezeRegForm.billNo = "";
        this.freezeRegForm.billOrigin = "";
        this.freezeRegForm.billRangeStart = "";
        this.freezeRegForm.billRangeEnd = "";
        this.freezeRegForm.sspdBillRangeStart = "";
        this.freezeRegForm.sspdBillRangeEnd = "";
        this.freezeRegForm.stdAmt = "";
        this.freezeRegForm.billRange = "";
        this.freezeRegForm.acptProtocalNo = "";
        this.freezeRegForm.billType = "";
        this.freezeRegForm.billMoney = "";
        this.freezeRegForm.pyeeName = "";
        this.freezeRegForm.drwrName = "";
        this.freezeRegForm.drwrAcctNo = "";
        this.freezeRegForm.remitDt = "";
        this.freezeRegForm.dueDt = "";
        this.freezeRegForm.acptDt = "";
      },
      //提交信息
      save() {
        this.$refs["freezeRegForm"].validate(valid => {
          if (valid) {
            let url = "";
            this.freezeRegForm.rgstType = this.freezeRgstType;
            //冻结
            if(this.freezeRgstType==='ST01'){
              if(this.freezeRegForm.sspdDt == null){
                this.$msgTip.error(this, { info: "冻结日期不能为空"});
              }
              this.freezeRegForm.sspdDt = this.freezeRegForm.sspdDt.replace(/-/g, "");
              url = "/ce/acpt/elec/freeze/freezeRegApply/func_saveFreezeRegApply";
            }else {
              if(this.freezeRegForm.anlgSspdDt == null){
                this.$msgTip.error(this, { info: "解冻日期不能为空"});
              }
              this.freezeRegForm.anlgSspdDt = this.freezeRegForm.anlgSspdDt.replace(/-/g, "");
              url = "/ce/acpt/elec/freeze/freezeRegApply/func_saveUnFreezeRegApply";
            }
            if (this.freezeRegForm.dueDt){
              this.freezeRegForm.dueDt = this.freezeRegForm.dueDt.replace(/-/g, "");
            }
            if (this.freezeRegForm.remitDt){
              this.freezeRegForm.remitDt = this.freezeRegForm.remitDt.replace(/-/g, "");
            }
            if (this.freezeRegForm.acptDt){
              this.freezeRegForm.acptDt = this.freezeRegForm.acptDt.replace(/-/g, "");
            }
            this.sendPost(this.freezeRegForm, url);
          }
        })
      },
      //提交请求
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.freezeRegFormItemWinClose();
            }else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
