<template>
    <div>
        <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" required class="h-form-three">
            <h-select v-model="formItem.busiType" placeholder="" readonly showTitle>
                <h-option v-for="item in dictMap['busiTypeList']" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
            </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.tradDir')" prop="trDir" required class="h-form-three">
            <h-select v-model="formItem.trDir" @on-change="getParameter" placeholder="" :readonly="isRedisc" showTitle>
                <h-option v-for="item in TdCrDirectionList" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
            </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.preAuditNo')" prop="preAuditNo" class="h-form-three">
            <h-input v-model="formItem.preAuditNo" placeholder="" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.brchName')" prop="brchName" required class="h-form-three">
            <h-input v-model="formItem.brchName" placeholder="" readonly :title="formItem.brchName"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.traderName')" prop="traderName" required class="h-form-three h-form-long-label">
            <h-input v-model="formItem.traderName" placeholder="" readonly></h-input>
        </h-form-item>
        <!--<h-form-item :label="$t('m.i.be.otherBrchName')" prop="custBrchName" required class="h-form-three">
            <h-input v-if="isRedisc" v-model="formItem.custBrchName" placeholder="" readonly ></h-input>
            <h-input v-else v-model="formItem.custBrchName" placeholder="" readonly icon="android-search"
                     @on-click="queryBranchName"></h-input>
        </h-form-item>-->

      <show-cpes-branch :label="$t('m.i.be.otherBrchName')" :required="true" class="h-form-three"
                        :brchCode.sync="formItem.custBrchCode"  :cpesBrchName.sync="formItem.custBrchName"
                        :filterable="!isRedisc" :clearable="false" :msgBoxWin="preAuditChangeWin"
                        @cpesBranchChange="custBrchNameChange($event)"
                        datagridUrl="/cpes/branch/queryBranchList" prop="custBrchName"
                        queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>



        <h-form-item :label="$t('m.i.be.custBrchCode')" prop="custBrchCode" required class="h-form-three">
            <h-input v-model="formItem.custBrchCode" placeholder="" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.custProductNo')" prop="custProductName" :required="brchType==='5'"
                     class="h-form-three"  :class="{'h-form-long-label':brchType==='5'}">
            <h-input v-if="brchType==='5'" v-model="formItem.custProductName" placeholder="" readonly icon="android-search"
                     @on-click="queryBranchName"></h-input>
            <h-input v-else v-model="formItem.custProductName" placeholder="" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.custTraderName')" prop="custTraderName" :required="!isRedisc" class="h-form-three h-form-long-label">
            <h-input v-if="isRedisc" v-model="formItem.custTraderName" placeholder="" disabled></h-input>
            <h-input v-else v-model="formItem.custTraderName" placeholder="" readonly icon="android-search"
                     @on-click="queryTrader"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.custTraderNo')" prop="custTraderNo" :required="!isRedisc" class="h-form-three h-form-long-label">
            <h-input v-model="formItem.custTraderNo" placeholder="" readonly :disabled="isRedisc"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.subDeal')" prop="subDeal" required class="h-form-three" >
            <h-select v-model="formItem.subDeal" placeholder="" setDefSelect :disabled="isRedisc" showTitle>
                <h-option v-for="item in dictMap['YonList']" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
            </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required class="h-form-three">
            <h-select v-model="formItem.billType" placeholder="" showTitle>
                <h-option v-for="item in dictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
            </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required class="h-form-three">
            <h-select v-model="formItem.billClass" placeholder="" showTitle>
                <h-option v-for="item in dictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
            </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" required class="h-form-three">
            <h-select v-model="formItem.settleMode" placeholder="" showTitle>
                <h-option v-for="item in dictMap['SettleType']" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
            </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" required class="h-form-three">
            <h-select v-model="formItem.clearSpeed" placeholder="" showTitle>
                <h-option v-for="item in dictMap['clearSpeed']" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
            </h-select>
        </h-form-item>
        <component :is="busiType" :formItem="formItem" :dictMap="dictMap">
        </component>
        <slot name="save"></slot>
        <!-- 查询票交机构代码 -->
        <show-cpes-branch-old :showCpesBranch="showCpesBranch" :memberId="unLeagelForm.memberId"
                          @showCpesBranchClose="showCpesBranchClose" :params="unLeagelForm"
                          @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch-old>
        <trader-user :userTraderWin="userTraderWin" :brchCode="custBrchCode" :memberId="memberId"
                     @userTraderChange="userTraderChange" @userTraderWinClose="userTraderWinClose">
        </trader-user>
    </div>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";
  import BT01 from "@/views/bizViews/be/market/preaudit/BT01";
  import BT02 from "@/views/bizViews/be/market/preaudit/BT02";
  import BT03 from "@/views/bizViews/be/market/preaudit/BT03";
  import RBT01 from "@/views/bizViews/be/market/preaudit/RBT01";
  import RBT02 from "@/views/bizViews/be/market/preaudit/RBT02";

  export default {
    name: "preAuditInput",
    data() {
      return {
        isCurChange: this.isChange,
        YonList: [],
        acptBankTypesList: [],
        billTypeList: [],
        showCpesBranch: false,
        userTraderWin: false,
        custBrchCode: "",
        memberId: "",
        TdCrDirectionList: "",
        firstTime: 1,
        unLeagelForm: {
          qryUnincorporatedProductFlag: "1",
          memberId: ""
        },
        isRedisc: false,
      };
    },
    components: {
      BT01,
      BT02,
      BT03,
      RBT01,
      RBT02,
      ShowCpesBranchOld:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      traderUser:()=>import(/* webpackChunkName: "sm/auth/branch/userTraderByBrchNoSearch" */`@/views/bizViews/sm/auth/branch/userTraderByBrchNoSearch`)
    },
    props: {
      busiType: {
        type: String,
        default: ""
      },
      brchType: {
        type: String,
        default: ""
      },
      formItem: {
        type: Object
      },
      dictMap: {
        type: Object,
      },
      isChange: {
        type: Boolean,
        default() {
          return false;
        }
      },
      preAuditChangeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isClose: Boolean,
    },
    watch: {
      isClose(val){
        this.firstTime = 1;
      },
      busiType(val) {
        this.isCurChange = this.isChange;
        this.formItem.busiType = val;
        if (val !== "BT01" && val !== "RBT01") {
          this.TdCrDirectionList = this.dictMap['CrDirectionList'];
        } else {
          this.TdCrDirectionList = this.dictMap['TdDirectionList'];
        }
        this.isRedisc = val === "RBT01" || val === "RBT02";
      }
    },
    methods: {
      showCpesBranchClose() {
        this.memberId = null;
        this.showCpesBranch = false;
      },
      //根据弹框所选数据进行赋值
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.custProductNo = info.brchCode;
        this.formItem.custProductName = info.brchFullNameZh;
        this.unLeagelForm.memberId = info.memberId;
        this.showCpesBranch = false;
        this.memberId = null;
        this.$parent.validateField('custProductNo');
        this.$parent.validateField('custProductName');
        // this.getParameter();
      },
      custBrchNameChange(info){
        if(info.length>0){
          this.formItem.custProductNo = null;
          this.formItem.custTraderNo = null;
          this.formItem.custTraderName = null;
          this.custBrchCode = this.formItem.custBrchCode;
          this.brchType = info[0].brchType;
          this.unLeagelForm.memberId = info[0].memberId;
          this.memberId = null;
          this.formItem.custProductNo = null;
          this.formItem.custProductName = null;
          this.$parent.validateField('custBrchName');
          this.$parent.validateField('custBrchCode');
          this.getParameter();
        }
      },
      // 挑选机构名称
      queryBranchName() {
        this.memberId = this.formItem.memberId;
        this.showCpesBranch = true;
      },
      // 挑选交易员
      queryTrader() {
        this.custBrchCode = this.formItem.custBrchCode;
        this.userTraderWin = true;
      },
      userTraderChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.custTraderNo = info.traderId;
        this.formItem.custTraderName = info.traderName;
        this.formItem.custBrchCode = info.brchCode;
        this.formItem.custBrchName = info.brchFullNameZh;
        this.brchType = info.brchType;
        this.userTraderWin = false;
        this.memberId = null;
        this.$parent.validateField('custTraderName');
        this.$parent.validateField('custTraderNo');
        this.getParameter();
      },
      userTraderWinClose() {
        this.memberId = null;
        this.userTraderWin = false;
      },
      getParameter() {
        if(this.firstTime === 1 && "BT01" === this.formItem.busiType){
          this.firstTime = this.firstTime + 1;
          return;
        }
        let busiType = this.formItem.busiType;
        let brchCode = this.formItem.brchCode;
        let custBrchCode = this.formItem.custBrchCode;
        let batchId = this.formItem.id;
        let trDir = this.formItem.trDir;
        if(busiType && brchCode && custBrchCode && trDir){
          let url = "/be/market/preaudit/preAuditMain/func_getParameterInfo";
          post({ busiType: busiType, brchCode: brchCode, custBrchCode: custBrchCode, trDir:trDir,batchId:batchId }, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              let obj = res.data.retData;
              if (retCode === "000000") {
                this.formItem.settleMode = obj.settleMode;
                this.formItem.prodNo = obj.prodNo;
                this.formItem.productMapDict = obj.productMap;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
    },
    created() {
      this.isCurChange = this.isChange;
      this.formItem.busiType = this.busiType;
      if (this.busiType !== "BT01" && this.busiType !== "RBT01") {
        this.TdCrDirectionList = this.dictMap['CrDirectionList'];
      } else {
        this.TdCrDirectionList = this.dictMap['TdDirectionList'];
      }
      this.isRedisc = this.busiType === "RBT01" || this.busiType === "RBT02";
    }

  };
</script>

