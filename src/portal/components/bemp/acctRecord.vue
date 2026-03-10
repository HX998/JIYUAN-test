<template>
  <!-- 展示记账分录 -->
  <h-msg-box v-model="tempShowAcctRecordWin" width="800" height="400" top="60" :maximize="true" @on-close="handleClose"
             :mask-closable="false">
    <p slot="header">
      <span v-if="acctModel=='trans_data'">交易信息</span>
      <span v-if="acctModel=='record_data'">分录信息</span>
    </p>
    <div class="h-invoice-box" v-if="acctModel=='trans_data'">
      <ul>
        <li v-for="(value, key, index) in flowNoMap" v-if="ifShow(value)">
          <h2 class="h-invoice-title">{{test(value,index)}}</h2>

          <div class="h-invoice-content" v-for="item in value">

            <div>
              <strong>机构名称：{{item.transBrchName}} </strong>
              <strong>交易总金额(元)（￥）：{{formatNumber(item.amount, 2, ',')}} </strong>
              <strong>总笔数：{{item.totalNum}}</strong>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="h-invoice-box" v-if="acctModel=='record_data'">
      <ul>
        <li v-for="(value, key, index) in flowNoMap" v-if="ifShow(value)">
          <h2 class="h-invoice-title">{{test(value,index)}}</h2>
          <div class="h-invoice-top">
            <span>借贷方向</span>
            <span>机构编号</span>
            <span>科目-账号</span>
            <span>金额（￥）</span>
          </div>
          <div class="h-invoice-content" v-for="item in value">
            <div class="h-invoice-details">
              <strong>{{drCrValue(item.drCr)}}</strong>
            </div>
            <div class="h-invoice-details">
              <strong>{{item.accountBrchNo}}</strong>
            </div>
            <div class="h-invoice-details">
              <strong>{{item.acctNo}}</strong>
            </div>
            <div class="h-invoice-details">
              <strong>{{formatNumber(item.amount, 2, ',')}}</strong>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div slot="footer">
          <span>
             <h-button type="ghost" @click="handleClose()">关闭</h-button>
          </span>


      <span v-for="printData in this.printDataList" v-if="showPrintButtonTemp">
            <h-button type="primary" @click="printTemplate(null,null,printData)" v-if="isButtonShow(printData.voucherType)">{{testButtonName(printData.voucherName)}}</h-button>
            <span> </span>
          </span>
      <span v-if="!(showPrintButtonTemp || showAuthBtn) && !this.acctAuth">
             <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
             <h-button type="primary" v-else @click="acctSubmit()">{{$t("m.i.common.confirmAcct")}}</h-button>
          </span>
      <span v-if="!(showPrintButtonTemp || showAuthBtn) && this.acctAuth">
             <h-button type="primary" @click="acctAuthorize()">{{$t("m.i.common.acctAuthorize")}}</h-button>
          </span>
      <span v-if="showAuthBtn">
          <span v-if="authMode ==='2'">
              <h-dropdown placement="bottom-start" @on-click="acctToAuth">
                <h-button type="primary">{{$t("m.i.common.acctAuth")}}<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="psw">{{$t('m.i.common.pswAuth')}}</h-dropdown-item>
                  <h-dropdown-item name="fp">{{$t('m.i.common.fpAuth')}}</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
           </span>
          <span>
             <h-button type="primary" v-if="authMode ==='0' || authMode === null" @on-click="acctToAuth('psw')">{{$t('m.i.common.pswAuth')}}</h-button>
          </span>
          <span>
            <h-button type="primary" v-if="authMode ==='1'"
                      @on-click="acctToAuth('fp')">{{$t('m.i.common.fpAuth')}}</h-button>
          </span>
        </span>
    </div>
    <!--根据参数引入授权弹窗-->
    <span v-show="showAuthBtn">
           <!--指纹授权弹窗-->
          <span v-if="authMode ==='1' || authMode ==='2' ">
              <fp-empower-win :showFpEmpowerUserWin="showFpEmpowerUserWin" :brchNo="brchNo" :totalAmt="totalAmt"
                              @fpEmpowerUserWinClose="empowerWinClose"
                              @empowerSuccess="empowerSuccess"></fp-empower-win>
          </span>

      <!--密码授权弹窗-->
          <psw-empower-win :showPswEmpowerWin="showPswEmpowerWin" :brchNo="brchNo" :totalAmt="totalAmt"
                           @pswEmpowerWinClose="empowerWinClose" @empowerSuccess="empowerSuccess"></psw-empower-win>
    </span>
  </h-msg-box>
</template>

<script>
  import {post,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "acctRecord",
    components: {},
    data() {
      return {
        isSystemPrint:true,
        tempShowAcctRecordWin:false,
        recordInfo:null,
        isHasPrint:false,
        flowNoMap:new Map(),
        flowNoPrintMap:new Map(),
        printDataList:[],
        printKeyMap:new Map(),
        acctModel:null,
        showFpEmpowerUserWin:false,
        showPswEmpowerWin:false,
        showAuthBtn:false,
        authMode:"",
        acctAuth:false,
        totalAmt:"",
        brchNo:"",
        voucherObj:{}
      }
    },
    watch: {
      tempOpenMethod(val) {
        if (val === true) {
          this.getRecordInfo();
        }
        if (val === false) {
          this.tempShowAcctRecordWin = false;
        }
      }
    },
    computed: {
      tempOpenMethod: {
        get() {
          return this.showAcctRecordWin;
        },
        set() {
        }
      },
      test() {
        return function (value, index) {
          if (value instanceof Array) {
            return value.length === 0 ? "" : value[0].acctGroupName;
          } else {
            return "";
          }
        }
      },
      drCrValue() {
        return function (drCr) {
          if (drCr === "C") {
            return "贷";
          } else if (drCr === "D") {
            return "借";
          } else if (drCr === "P") {
            return "付";
          } else if (drCr === "S") {
            return "收";
          }
        }
      },
      testVoucherType() {
        return function (key) {
          return key.split(',')[0];
        }
      },
      testButtonName() {
        return function (key) {
          return "打印" + key + "凭证";
        }
      },
      isButtonShow() {
        return function(key) {
          if (key === "" || key === null || key === undefined) {
            return false;
          } else {
            return true;
          }
        }
      },
      ifShow() {
        return function (value) {
          if (value.length === 0) {
            return false;
          } else {
            return true;
          }
        }
      },
      showPrintButtonTemp:{
        get() {
          return this.showPrintButton&&this.isSystemPrint;
        },
        set() {
        }
      }
    },
    props: {
      title: "",
      url: "", //获取分录信息url
      isShowAcctAuth: {
        type: Boolean,
        default() {
          return false;
        }
      },
      param: Object, //获取分录信息传参
      showAcctRecordWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showPrintButton: {
        type: Boolean,
        default() {
          return false;
        }
      },
      submitFlag: {
        type: Boolean,
        default() {
          return false;
        }
      },
      licenseFlag:{//集中授权信息
        type:Boolean,
        default() {
          return false
        }
      },
      ownedBrchNo:"",//权属业务机构
    },
    methods: {
      formatNumber(num, precision, separator) {
        var parts;
        if (!isNaN(parseFloat(num)) && isFinite(num)) {
          num = Number(num);
          num = (typeof precision !== 'undefined' ? (Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision) : num).toString();
          parts = num.split('.');
          parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));
          return parts.join('.');
        }
        return '-';
      },
      //获取分录信息
      getRecordInfo() {
        this.$loadingbox.open({
          title: "获取分录信息中，请稍后..."
        });
        let params = this.param;
        let url = this.url;
        post(params, url).then(res => {
          if (res) {
            this.$loadingbox.close();
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.recordInfo = res.data.retData;
              this.flowNoMap = this.recordInfo.flowNoMap;
              this.acctModel = this.recordInfo.acctModel;
              this.flowNoPrintMap = this.recordInfo.flowNoPrintMap;
              this.printDataList = this.recordInfo.printDataDtoList;
              this.voucherObj = {};
              for (let vh in this.flowNoPrintMap) {
                let voucherKey = this.flowNoPrintMap[vh].voucherType + ',' + this.flowNoPrintMap[vh].voucherName;
                let voucherValue = this.voucherObj[voucherKey];
                if (voucherValue === "" || voucherValue === null || voucherValue === undefined) {
                  voucherValue = [];
                }
                voucherValue.push(this.flowNoPrintMap[vh].frontFlowNo);
                this.voucherObj[voucherKey] = voucherValue;
              }
              this.param.recordInfo = this.flowNoMap;
              //是否需要记账授权
              this.showAuthBtn = this.recordInfo.acctAuthority === "1";
              //授权方式
              this.authMode = this.recordInfo.acctAuthMode;
              this.acctAuth = this.recordInfo.acctAuth;
              if(this.isShowAcctAuth === true) {
                this.authMode = ""
              }
              if(this.authMode !== "3"){//非记账授权模式
                this.acctAuth = false;
              }
              //记账总金额
              this.totalAmt = this.recordInfo.totalAmt;
              //获取记账机构号
              this.brchNo = this.getAcctBrchNo();
              this.getIsHasPrint();
              //isShow：控制分录是否显示，1-显示，0-不显示
              if (this.recordInfo.isShow && this.recordInfo.isShow.toString() === "0") {
                this.acctSubmit(() => {
                  this.handleClose();
                });
                return;
              }
              this.tempShowAcctRecordWin = true;
            } else {
              this.handleClose();
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$loadingbox.close();
            this.handleClose();
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      getIsHasPrint() {
        if (this.printDataList != null && this.printDataList.length != 0) {
          this.isHasPrint = true;
        }
      },
      //获取记账机构号
      getAcctBrchNo() {
        for (let item in Object.keys(this.flowNoMap)) {
          if (this.flowNoMap[Object.keys(this.flowNoMap)[item]].length !== 0) {
            if (this.flowNoMap[Object.keys(this.flowNoMap)[item]][0].accountBrchNo === "" || this.flowNoMap[Object.keys(this.flowNoMap)[item]][0].accountBrchNo === null
              || this.flowNoMap[Object.keys(this.flowNoMap)[item]][0].accountBrchNo === undefined) {
            } else {
              return this.flowNoMap[Object.keys(this.flowNoMap)[item]][0].accountBrchNo;
            }
          }
        }
      },
      acctAuthorize(){
        this.$emit("acctAuthorize", this.param);
      },
      //确定记账
      acctSubmit(callBack) {
        this.param.isHasPrint = this.isHasPrint&&this.isSystemPrint;
        if (callBack) {
          this.param.isHasPrint = false
        }
        this.$emit("acctSubmitSure", this.param, callBack);
      },
      //记账授权
      acctToAuth(mode) {
        if (mode === "fp") {
          this.showFpEmpowerUserWin = true;
        } else {
          this.showPswEmpowerWin = true;
        }
      },
      empowerWinClose() {
        this.showFpEmpowerUserWin = false;
        this.showPswEmpowerWin = false;
      },
      //授权成功
      empowerSuccess() {
        this.showFpEmpowerUserWin = false;
        this.showPswEmpowerWin = false;
        this.showAuthBtn = false;
      },
      //关闭
      handleClose() {
        this.$emit("showAcctRecordWinClose", "");
      },
      //打印
      printTemplate(flowNoPrintList, voucherType,printData) { //通用记账凭证打印-手续费收取
        if (printData!== null && printData !==undefined)  {
          //采用模板引擎记账
          let params= {listIds:printData.listId,batchId:printData.batchId,prodNo:printData.prodNo};
          let param = {templateName:printData.voucherType,params:JSON.stringify(params),batchId:printData.batchId,batchNo:printData.batchNo,licenseFlag: this.licenseFlag,ownedBrchNo: this.ownedBrchNo};
          post(param, "/pe/print/voucherPrint/voucherPrintManger/func_queryAcctVoucherPrint").then(res=>{
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$print.vouchTemplatePrint(this, {
                data:res.data.retData.printInfos,
                vochIds:res.data.retData.vochIds,
                callback: () => {
                  var voucherType = this.printKeyMap.get(printData.voucherType);
                  if (voucherType ===null || voucherType === '' || typeof voucherType === 'undefined') {
                    this.printKeyMap.set(printData.voucherType, 1);
                  }
                  if (this.printKeyMap.size === this.printDataList.length) {
                    this.printKeyMap.clear();
                    this.$emit("printSuccessCallback", "");
                  }
                },
                errorCallback: () => {

                }
              });
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }).catch(reason => {

          })
          return;
        }
        if (voucherType === "PE030401" && (this.param.billInfoList !== undefined && this.param.billInfoList !== null)) {
          this.$print.vochPrint(this, {
            exitDataFlag: false,
            params: {voucherType: voucherType, flowNoPrintList: flowNoPrintList},
            billInfo: this.param.billInfoList,
            hasSeal: true,
            callback: () => {
              this.$emit("printSuccessCallback", "");
            },
            errorCallback: () => {

            }
          });
        }else if (voucherType === "PE030403" && (this.param.billInfoList !== undefined && this.param.billInfoList !== null)) {
          this.$print.vochPrint(this, {
            exitDataFlag: false,
            params: {voucherType: voucherType, flowNoPrintList: flowNoPrintList},
            billInfo: this.param.billInfoList,
            callback: () => {
              this.$emit("printSuccessCallback", "");
            },
            errorCallback: () => {

            }
          });
        } else if (voucherType === "PE031603" && (this.param.billInfoList !== undefined && this.param.billInfoList !== null)) {
          //托收手续费打印
          this.$print.vochPrint(this, {
            exitDataFlag: false,
            params: {voucherType: voucherType, flowNoPrintList: flowNoPrintList},
            billInfo: this.param.billInfoList,
            callback: () => {
              this.$emit("printSuccessCallback", "");
            },
            errorCallback: () => {

            }
          });
        } else {
          if(this.param.billInfoList !== undefined && this.param.billInfoList !== null){
            this.$print.vochPrint(this, {
              exitDataFlag: false,
              params: {voucherType: voucherType, flowNoPrintList: flowNoPrintList},
              billInfo: this.param.billInfoList,
              callback: () => {
                this.$emit("printSuccessCallback", "");
              },
              errorCallback: () => {

              }
            });
          }else {
            this.$print.vochPrint(this, {
              exitDataFlag: false, params: {voucherType: voucherType, flowNoPrintList: flowNoPrintList},
              callback: () => {
                this.$emit("printSuccessCallback", "");
              },
              errorCallback: () => {

              }
            });
          }
        }
      },
      //组装列表信息
      getBillInfoList(billInfoList) {
        this.param.billInfoList = billInfoList;
      }
    },
    created(){
      getSingleParamValuesByKeys("pe.voch.print_model").then(res => {
        this.isSystemPrint=res['pe.voch.print_model']!=="2"; //2-不打印,生成文件
        console.log(this.isSystemPrint)
      });
    }
  };
</script>

<style scoped>

</style>
