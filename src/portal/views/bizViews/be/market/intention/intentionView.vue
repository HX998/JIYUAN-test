<template>
  <h-msg-box v-model="tempIntentionView" @on-close="handleClose" width="1000"
             class="h-form-search-layer" :maximize="true" :footerHide="true">
    <p slot="header">
      <span v-if="isEdit">意向询价修改</span>
      <span v-else>意向询价新增</span>
    </p>
    <h-panel>
      <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search" onlyBlurRequire>
        <div class="h-search-form-row">
          <h-form-item prop="id" v-show="false">
            <h-input :value="addOrEditForm.id"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
            <h-select v-model="addOrEditForm.busiType" disabled>
              <h-option v-for="item in mapList['BusiTypeList']" :value="item.key" :key="item.key">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.intentionReqId')" prop="intentionReqId">
            <h-input v-model="addOrEditForm.intentionReqId" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.sendBrchName')" prop="sendBrchName" required>
            <h-input v-model="addOrEditForm.sendBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.sendProductName')" prop="sendProductName" :required="brchType==='5'||addOrEditForm.brchType==='5'"  class="h-form-long-label">
            <h-input  v-if="brchType!=='5' && addOrEditForm.brchType !== '5'" v-model="addOrEditForm.sendProductName" placeholder="" readonly></h-input>
            <h-input v-else v-model="addOrEditForm.sendProductName" placeholder="" readonly icon="android-search" @on-click="queryProductName"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.sendTraderName')" prop="sendTraderName" required>
            <h-input v-model="addOrEditForm.sendTraderName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.tradDir')" prop="trDir" required>
            <h-select v-model="addOrEditForm.trDir" :readonly="!canEdit"  @on-change="tradDirChange">
              <h-option v-for="item in TdCrDirectionList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.transmitRate')" prop="sendRange" required>
            <h-select v-model="addOrEditForm.sendRange" :readonly="!canEdit">
              <h-option v-for="item in SendRangeList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required>
            <h-select v-model="addOrEditForm.billType" :readonly="!canEdit">
              <h-option v-for="item in BillTypeList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required>
            <h-select v-model="addOrEditForm.billClass" :readonly="!canEdit">
              <h-option v-for="item in BillClassList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.totalAmtBillPackageByTenThousandUnit')" prop="totalAmt" v-show="intentionType !== 'BT02'" :validRules="amtRule">
            <h-typefield integerNum="12" suffixNum="2" type="money" placeholder="最多12位整数,2位小数"
                         v-model="addOrEditForm.totalAmt" ></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.buyBackTotalAmtByUnit')" prop="buyBackTotalAmt" v-show="intentionType === 'BT02'" :validRules="amtRule">
            <h-typefield integerNum="12" suffixNum="2" type="money" placeholder="最多12位整数,2位小数"
                         v-model="addOrEditForm.buyBackTotalAmt"  ></h-typefield>
          </h-form-item>
          <h-form-item :label="residualTermLabel" prop="residualTerm" :validRules="residualTerm">
            <h-row>
              <h-col span="11">
                <h-form-item prop="minResidualTerm">
                  <h-select v-model="addOrEditForm.minResidualTerm" filterable @on-blur="checkResidualTerm"
                            @on-change="checkResidualTerm">
                    <h-option v-for="item in TenorCodeList" :value="item.key" :key="item.value"
                    :disabled="(item.key === 'TM001' || item.key === 'TM007' || item.key === 'TM014') && addOrEditForm.busiType === 'BT01'">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
              </h-col>
              <h-col span="2" style="text-align: center">-</h-col>
              <h-col span="11">
                <h-form-item prop="maxResidualTerm">
                  <h-select v-model="addOrEditForm.maxResidualTerm" filterable @on-blur="checkResidualTerm"
                            @on-change="checkResidualTerm">
                    <h-option v-for="item in TenorCodeList" :value="item.key" :key="item.value"
                    :disabled="(item.key === 'TM001' || item.key === 'TM007' || item.key === 'TM014') && addOrEditForm.busiType === 'BT01'">{{ item.value}}
                    </h-option>
                  </h-select>
                </h-form-item>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item :label="rateLable" prop="rate" :validRules="ratePctRule">
            <h-typefield integerNum="3" suffixNum="4" type="money" placeholder="利率范围0~100，且小数位不超过四位"
                         v-model="addOrEditForm.rate" ></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.dueTransRate')" prop="dueRate" v-if="intentionType === 'BT03'" :validRules="ratePctRule">
            <h-typefield integerNum="3" suffixNum="4" type="money" placeholder="利率范围0~100，且小数位不超过四位"
                         v-model="addOrEditForm.dueRate" ></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.buyBackEarningRate')" prop="yieldRate" v-if="intentionType === 'BT03'" :validRules="ratePctRuleBt03">
            <h-typefield integerNum="3" suffixNum="4" type="money" placeholder="利率范围0~100，且小数位不超过四位"
                         v-model="addOrEditForm.yieldRate" ></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.billSelectType')" prop="selectType" required v-if="intentionType === 'BT02'">
            <h-select v-model="addOrEditForm.selectType" :readonly="!canEdit">
              <h-option v-for="item in CdSelectModeList" :value="item.key" :key="item.value">{{ item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.packetSeq')" prop="packetSeq" v-if="intentionType === 'BT02' && addOrEditForm.selectType === 'CSM02'">
            <h-input v-model="addOrEditForm.packetSeq" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.transCustType')" prop="transCustTypeList" cols="3" class="h-form-height-auto" required>
            <h-checkbox
                :indeterminate="indeterminate1"
                :value="checkAll1"
                @click.prevent.native="handleCheckAllTenor()">全选
            </h-checkbox>
            <h-checkbox-group v-model="addOrEditForm.transCustTypeList" @on-change="checkTransChange">
              <h-checkbox v-for="item in CreditCustTypeList" :label="item.key" :key="item.value"
                          @on-click="checkTrader">{{ item.value}}
              </h-checkbox>
            </h-checkbox-group>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.creditMainBankType')" prop="creditCustTypeList" cols="3" class="h-form-height-auto" required>
            <h-checkbox
                :indeterminate="indeterminate2"
                :value="checkAll2"
                @click.prevent.native="handleCheckAllCredit()">全选
            </h-checkbox>
            <h-checkbox-group v-model="addOrEditForm.creditCustTypeList" @on-change="checkCreditChange">
              <h-checkbox v-for="item in CreditCustTypeList" :label="item.key" :key="item.value">{{ item.value}}
              </h-checkbox>
            </h-checkbox-group>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.intentionRemark')" prop="intentionRemark" cols="3" :validRules="intentionRemarkRule">
            <h-input v-model="addOrEditForm.intentionRemark" :maxlength="100"></h-input>
          </h-form-item>
          <h-form-item prop="sendBrchCode" v-if="false">
            <h-input v-model="addOrEditForm.sendBrchCode"></h-input>
          </h-form-item>
          <h-form-item prop="sendProductNo" v-if="false">
            <h-input v-model="addOrEditForm.sendProductNo"></h-input>
          </h-form-item>
          <h-form-item prop="sendTraderNo" v-if="false">
            <h-input v-model="addOrEditForm.sendTraderNo"></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate two-form">
            <h-button type="primary" @click="saveIntentionBatch()">{{$t('m.i.common.save')}}</h-button>
          </h-form-item>
        </div>
      </h-form>
    </h-panel>
    <h-form :model="queryFormItem" ref="queryFormItem" v-show="false"></h-form>
    <h-datagrid
            :columns="columns"
            :auto-load="false"
            url="/be/market/intention/intentionMain/func_findIntentionBatchByBatchIdView"
            :bindForm="queryFormItem"
            :rowSelect="true"
            :hasSelect="hasSelect"
            ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @on-click="selectBill()" :disabled="!(addOrEditForm.trDir === 'TDD02' ||
                                                                    addOrEditForm.trDir === 'CRD02')"
                      v-if="addOrEditForm.selectType !== 'CSM02'">{{$t('m.i.common.pickBill')}}
            </h-button>
            <h-button type="primary" @on-click="deleteBill()" :disabled="!(addOrEditForm.trDir === 'TDD02' ||
                                                                    addOrEditForm.trDir === 'CRD02')"
                      v-if="addOrEditForm.selectType !== 'CSM02'">{{$t('m.i.be.deleteBill')}}
            </h-button>
            <h-button type="primary" @on-click="selectBillByPkg()" v-if="(addOrEditForm.trDir === 'TDD02' ||
                                                                         addOrEditForm.trDir === 'CRD02') &&
                                                                         addOrEditForm.selectType === 'CSM02'">
              {{$t('m.i.be.pickPacketBill')}}
            </h-button>
            <h-button type="primary" @on-click="deletePkg()" v-if="(addOrEditForm.trDir === 'TDD02' ||
                                                                   addOrEditForm.trDir === 'CRD02') &&
                                                                   addOrEditForm.selectType === 'CSM02'">
              {{$t('m.i.be.clearPacket')}}
            </h-button>
            <h-button type="primary" @on-click="templateDownload()" :disabled="!(addOrEditForm.trDir === 'TDD02' ||
                                                                    addOrEditForm.trDir === 'CRD02')"
                      v-if="addOrEditForm.selectType !== 'CSM02'">
              {{$t('m.i.common.templateDownload')}}
            </h-button>
            <h-button type="primary" @on-click="importBill()" :disabled="!(addOrEditForm.trDir === 'TDD02' ||
                                                                    addOrEditForm.trDir === 'CRD02')"
                      v-if="addOrEditForm.selectType !== 'CSM02'">
              {{$t('m.i.common.exportPickBill')}}
            </h-button>
            <h-button type="primary" @on-click="send()">{{$t('m.i.common.send')}}</h-button>
            <h-button type="primary" @on-click="seletTrader()" v-if="addOrEditForm.sendRange === '0' && canEdit">添加交易员
            </h-button>
          </div>
        </h-datagrid>
    <select-intention-trader :traderView="traderView"
                             :needBatchId="needThisBatchId"
                             :branchTypeInList="branchTypeInList"
                             @traderWinClose="traderWinClose"></select-intention-trader>
    <pick-bill :pickBillWin="pickBillWin"
               :batchId="needThisBatchId"
               :needPickBillObj="needPickBillObj"
               @pickBillWinClose="pickBillWinClose"
               @pickedBill="pickedBill"></pick-bill>
    <pick-pack-bill :pickPackBillWin="pickPackBillWin"
                    :needBillClass="addOrEditForm.billClass"
                    :needBillType="addOrEditForm.billType"
                    :packetSeqWithout="addOrEditForm.packetSeq"
                    @pickedPackBill="pickedPackBill"
                    @pickPackBillWinClose="pickPackBillWinClose"></pick-pack-bill>
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="brchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="billId" :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

    <!-- 批量导入-->
    <upload
      :uploadUrl="uploadUrl"
      :batchId="curBatchId"
      @uploadWinClose="uploadWinClose"
      :uploadWin="uploadWin"
      :importSelect="importSelect"
      :selectDataFirst="selectDataFirst">
    </upload>
  </h-msg-box>
</template>

<script>
  import { post, on, off,formatNumber ,getDictListByGroups,getDictValueFromMap, formatBillRange} from "@/api/bizApi/commonUtil";
  export default {
    name: "intentionView",
    data() {
      return {
        addOrEditForm : {
          id: "",
          busiType: "",
          intentionReqId: "",
          sendBrchName: "",
          sendProductName: "",
          sendTraderName: "",
          trDir: "",
          sendRange: "",
          billType: "",
          billClass: "",
          totalAmt: "",
          buyBackTotalAmt: "",
          rate: "",
          dueRate: "",
          yieldRate: "",
          selectType: "",
          transCustTypeList: [],
          transCustType: "",
          creditCustTypeList: [],
          creditCustType: [],
          intentionRemark: "",
          sendBrchCode: "",
          sendProductNo: "",
          sendTraderNo: "",
          minResidualTerm: "",
          maxResidualTerm: "",
          packetSeq:"",
          creditMainBrchCode:'',
          creditMainBankName:'',
          creditMainBankType:''
        },
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        ratePctRuleBt03 :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        amtRule :[{
          test: /^(\d{1,12}(\.\d{1,2})?)$/,
          trigger: "blur",
          message: "最多12位整数，2位小数"
        }],
        queryFormItem : {
          id: "",
          intentionReqId: ""
        },
        needPickBillObj : {
          creditCustTypeKeyList: [],
          busiType: "",
          billType: "",
          billClass: "",
          minResidualTerm: "",
          maxResidualTerm: ""
        },
        importBillForm : {
          attFile: ""
        },
        uploadUrl : window.LOCAL_CONFIG.API_HOME + "/be/market/intention/intentionMain/func_uploadFile",
        uploadWin:false,
        importSelect:false,
        selectDataFirst:false,
        curBatchId:null,
        needThisBatchId : "",
        notNull : false,
        indeterminate1 : false,
        checkAll1 : true,
        indeterminate2 : false,
        checkAll2 : true,
        importBillWin : false,
        pickPackBillWin : false,
        pickBillWin : false,
        traderView : false,
        isTraderView : false,
        unCheck : true,
        showCpesProductBranch : false,
        hasSelect : false,
        isFileUpdate : "0",
        packetSeqWithout : "0",
        brchType : "",
        memberId : "",
        uploadList : [],
        branchTypeInList : [],
        columns : [
          {
            type: "selection",
            hiddenCol: false,
            align: "center",
            width: 50
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false,
            width: 50
          },
          {
            title: this.$t('m.i.common.id'),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.be.preRelationFlag'),
            key: "preRelationFlag",
            align: "center",

            hiddenCol: false,
            render: (h, params) => {
          let dictValue = getDictValueFromMap(this.dictMap, 'PreRelationFlag', params.row.preRelationFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
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
            key: "cdNo",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(this.addOrEditForm.sendRcvFlag === "1"){
                return h("span",params.row.cdNo);
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.cdNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.cdNo);
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
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "cdAmt",
            hiddenCol: false,
            sortable: true,
            align: "center",
            render: (h, params) => {
              return h('span', formatNumber(params.row.cdAmt, 2, ','))
            }

          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "issDt",
            align: "center",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.issDt && "" !== params.row.issDt) {
                let dttm = this.$moment(params.row.issDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            align: "center",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.issDt && "" !== params.row.issDt) {
                let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: "matDt",
            align: "center",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.matDt && "" !== params.row.matDt) {
                let dttm = this.$moment(params.row.matDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.be.remainingPeriod'),
            key: "remainingPeriod",
            sortable: true,
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "dwrName",
            align: "center",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptSvcrBrId",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            align: "center",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "dsctBrId",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            align: "center",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "addGrntBrId",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.acptCfmBrCode'),
            key: "acptCfmBrId",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGrntBrId",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.dsctGrntBrCode'),
            key: "dsctGrntBrId",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'CreditMajor', params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        residualTermLabel : "剩余期限",
        rateLable : "交易利率(%)",
        BillClassList : [],
        BillTypeList : [],
        TdDirectionList : [],
        CrDirectionList : [],
        TdCrDirectionList : [],
        SendRangeList : [],
        CdSelectModeList : [],
        billOriginList: [],
        CreditCustTypeList : [],
        CreditCustTypeKeyList : [],
        TenorCodeList : [],
        BusiTypeList : [],
        dictMap : [],
        checkAllTenorGroup : [],
        checkAllCreditGroup : [],
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart: '',
        billRangeEnd: '',
        residualTerm : [{ test: this.validateResidualTerm, trigger: "blur,change" },
                          { test: this.validateResidualTermNull, trigger: "blur,change" }],
        intentionRemarkRule: [{ test: this.validateIntentionRemark, trigger: "blur" }],
      }
    },
    components: {
      Upload:()=>import(/* webpackChunkName: "be/market/quote/sale/upload" */`@/views/bizViews/be/market/quote/sale/upload`),
       SelectIntentionTrader:()=>import(/* webpackChunkName: "be/market/intention/selectIntentionTrader" */`@/views/bizViews/be/market/intention/selectIntentionTrader`),
      PickBill:()=>import(/* webpackChunkName: "be/market/intention/pickBill" */`@/views/bizViews/be/market/intention/pickBill`),
      PickPackBill:()=>import(/* webpackChunkName: "be/market/intention/pickPackBill" */`@/views/bizViews/be/market/intention/pickPackBill`),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    props: {
      intentionView: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isEdit: {
        type: Boolean,
        default() {
          return false;
        }
      },
      canEdit: {
        type: Boolean,
        default() {
          return true;
        }
      },
      intentionType: "",
      needBatchId: "",
      mapList:{
        type:Object,
      }
    },
    computed: {
      tempIntentionView: {
        get() {
          return this.intentionView;
        },
        set() {
        }
      }
    },
    mounted() {
      getDictListByGroups("CDMedia,DraftTypeCode,AssetIndustry,TdDirection,CrDirection,CreditMajor,TenorCode,SendRange,QuoteBusiType,CdSelectMode,PreRelationFlag,TrDir,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.BusiTypeList = res.get("QuoteBusiType");
        this.TdDirectionList = res.get("TdDirection");
        this.CrDirectionList = res.get("CrDirection");
        this.SendRangeList = res.get("SendRange");
        this.CreditCustTypeList = res.get("CreditMajor");
        this.AssetIndustryList = res.get("AssetIndustry");
        this.TenorCodeList = res.get("TenorCode");
        this.CdSelectModeList = res.get("CdSelectMode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
        this.dictList = {
          BusiTypeList:res.get("QuoteBusiType"),
        };
        this.CreditCustTypeKeyList = [];
        for (let item in this.CreditCustTypeList) {
          this.CreditCustTypeKeyList.push(this.CreditCustTypeList[item].key);
        }
      });
    },
    watch: {
      intentionView(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.resetView();
            if (this.intentionType !== "BT01") {
              this.residualTermLabel = "回购期限";
              this.TdCrDirectionList = this.CrDirectionList;
              if (this.intentionType === "BT02") {
                this.rateLable = "回购利率(%)";
              } else {
                this.rateLable = this.$t('m.i.be.firstTransRate');
              }
            } else {
              this.TdCrDirectionList = this.TdDirectionList;
              this.residualTermLabel = "剩余期限";
              this.rateLable = "交易利率(%)";
            }
            this.addOrEditForm.busiType = this.intentionType;
            this.addOrEditForm.transCustTypeList = this.CreditCustTypeKeyList;
            this.addOrEditForm.creditCustTypeList = this.CreditCustTypeKeyList;

            if (this.isEdit) {
              this.addOrEditForm.id = this.needBatchId;
              this.queryFormItem.id = this.needBatchId;
              this.createForm();
            }else{
              this.initForm();
              this.addOrEditForm.id = "";
            }
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      validateIntentionRemark(rule, value, callback) {
        if(value){
          if(value.length>50){
            callback(new Error("询价附言长度不能超过50个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validateResidualTermNull(rule, value, callback) {
        if ((this.addOrEditForm.minResidualTerm  && !this.addOrEditForm.maxResidualTerm)
          || (!this.addOrEditForm.minResidualTerm && this.addOrEditForm.maxResidualTerm)) {
          callback(new Error(this.residualTermLabel + "全为空或者全不为空"));
        } else {
          callback();
        }
      },
      validateResidualTerm(rule, value, callback){
          if (this.addOrEditForm.minResidualTerm
            && this.addOrEditForm.maxResidualTerm
            &&this.addOrEditForm.minResidualTerm >= this.addOrEditForm.maxResidualTerm) {
            callback(new Error("最小" + this.residualTermLabel + "不能大于或等于最大" + this.residualTermLabel));
          } else {
            callback();
          }
        },
      turnForm(formItem, obj, _this) {
        formItem.id = obj.id;
        formItem.busiType = obj.busiType;
        formItem.intentionReqId = obj.intentionReqId;
        formItem.sendBrchName = obj.sendBrchName;
        formItem.sendProductName = obj.sendProductName;
        formItem.sendTraderName = obj.sendTraderName;
        formItem.trDir = obj.trDir;
        formItem.sendRange = obj.sendRange;
        formItem.billType = obj.billType;
        formItem.billClass = obj.billClass;
        formItem.totalAmt = obj.totalAmt;
        formItem.buyBackTotalAmt = obj.buyBackTotalAmt;
        formItem.rate = obj.rate * 1;
        formItem.dueRate = obj.dueRate * 1;
        formItem.yieldRate = obj.yieldRate;
        formItem.selectType = obj.selectType;
        formItem.packetSeq = obj.packetSeq;
        formItem.sendRcvFlag = obj.sendRcvFlag;
        if (null != obj.transCustType && obj.transCustType !== "") {
          formItem.transCustTypeList = obj.transCustType.split(",");
        }
        if (null != obj.creditCustType && obj.creditCustType !== "") {
          formItem.creditCustTypeList = obj.creditCustType.split(",");
        }
        formItem.intentionRemark = obj.intentionRemark;
        formItem.sendBrchCode = obj.sendBrchCode;
        formItem.sendProductNo = obj.sendProductNo;
        formItem.sendTraderNo = obj.sendTraderNo;
        formItem.minResidualTerm = obj.minResidualTerm;
        formItem.maxResidualTerm = obj.maxResidualTerm;
        this.checkAllTransChange(_this.addOrEditForm.transCustTypeList, _this);
        this.checkAllCreditChange(_this.addOrEditForm.creditCustTypeList, _this);
      },

    checkAllTransChange(data, _this) {
      if (data.length === _this.CreditCustTypeList.length) {
        _this.indeterminate1 = false;
        _this.checkAll1 = true;
      } else if (data.length > 0) {
        _this.indeterminate1 = true;
        _this.checkAll1 = false;
      } else {
        _this.indeterminate1 = false;
        _this.checkAll1 = false;
      }
      },
      checkAllCreditChange(data, _this) {
        if (data.length === _this.CreditCustTypeList.length) {
          _this.indeterminate2 = false;
          _this.checkAll2 = true;
        } else if (data.length > 0) {
          _this.indeterminate2 = true;
          _this.checkAll2 = false;
        } else {
          _this.indeterminate2 = false;
          _this.checkAll2 = false;
        }
        },
      //1.重置表单
      resetView() {
        this.indeterminate1 = this.indeterminate2 = false;
        this.checkAll1 = this.checkAll2 = true;
        this.addOrEditForm.maxResidualTerm = "";
        this.addOrEditForm.minResidualTerm = "";
        this.addOrEditForm.selectType = "";
        this.$refs.addOrEditForm.resetFields();
      },
      //2.关闭页面
      handleClose() {
        this.resetView();
        this.addOrEditForm.id = "";
        this.queryFormItem.id = "";
        this.$emit("intentionViewClose", "");
      },
      //4
      billInfoWinClose(){
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      //5.交易对手复选框点击
      checkTransChange(data) {
        this.checkAllTransChange(data, this);
      },
      //6.信用主体复选框点击
      checkCreditChange(data) {
        this.checkAllCreditChange(data, this);
      },
      //7.交易对手全选
      handleCheckAllTenor() {
        if (this.indeterminate1) {
          this.checkAll1 = false;
        } else {
          this.checkAll1 = !this.checkAll1;
        }
        this.indeterminate1 = false;
        if (this.checkAll1) {
          this.addOrEditForm.transCustTypeList = this.CreditCustTypeKeyList;
        } else {
          this.addOrEditForm.transCustTypeList = [];
        }
      },
      //8.信用主体全选
      handleCheckAllCredit() {
        if (this.indeterminate2) {
          this.checkAll2 = false;
        } else {
          this.checkAll2 = !this.checkAll2;
        }
        this.indeterminate2 = false;
        if (this.checkAll2) {
          this.addOrEditForm.creditCustTypeList = this.CreditCustTypeKeyList;
        } else {
          this.addOrEditForm.creditCustTypeList = [];
        }
      },
      //9.初始化表单
      initForm() {
        post({}, "/be/market/intention/intentionMain/func_initForm").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addOrEditForm.sendBrchCode = retData.brchCode;
              this.addOrEditForm.sendBrchName = retData.brchName;
              this.addOrEditForm.sendTraderName = retData.traderName;
              this.addOrEditForm.sendTraderNo = retData.traderId;
              this.addOrEditForm.brchType = retData.brchType;
              this.brchType = retData.brchType
              this.memberId = retData.memberId;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //10.反显表单
      createForm() {
        post({ id: this.addOrEditForm.id }, "/be/market/intention/intentionMain/func_findIntentionBatchByIdView").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.turnForm(this.addOrEditForm, retData, this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //11.保存批次
      saveIntentionBatch() {
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定要保存吗？",
          onOk: () => {
            this.handleSaveIntentionBatch(this, res => {
              this.$msgTip.success(this);
            });
          }
        });
      },
      //12.挑票（入口）
      selectBill() {
        this.handleSaveIntentionBatch(this, res => {
          this.needThisBatchId = res;
          this.selectBillFunction(this);
        });
      },
      //13.票据包挑票（入口）
      selectBillByPkg() {
        this.handleSaveIntentionBatch(this, res => {
          this.addOrEditForm.id = res;
          this.selectBillByPkgFunction(this);
        });
      },
      //14.清除票据包（入口）
      deletePkg() {
        this.$hMsgBox.confirm({
          title: "票据包清除",
          content: "确定要清除票据包吗？",
          onOk: () => {
            this.handleSaveIntentionBatch(this, res => {
              this.deletePkgFunction(this, res);
            });
          }
        });
      },
      //15.挑票
      selectBillFunction(_this) {
        _this.needPickBillObj.creditCustTypeKeyList = _this.addOrEditForm.creditCustTypeList;
        _this.needPickBillObj.busiType = this.intentionType;
        _this.needPickBillObj.billType = _this.addOrEditForm.billType;
        _this.needPickBillObj.billClass = _this.addOrEditForm.billClass;
        _this.needPickBillObj.minResidualTerm = _this.addOrEditForm.minResidualTerm;
        _this.needPickBillObj.maxResidualTerm = _this.addOrEditForm.maxResidualTerm;
        _this.pickBillWin = true;
      },
      //16.票据包挑票
      selectBillByPkgFunction(_this) {
        this.pickPackBillWin = true;
      },
      //17.清除票据包 batchId：该批次ID
      deletePkgFunction(_this, batchId) {
        post({ id: batchId }, "/be/market/intention/intentionMain/func_delPackBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              _this.$msgTip.success(_this);
              this.addOrEditForm.packetSeq = "";
              this.$refs.datagrid.dataChange(1);
              this.createForm();
            } else {
              _this.$msgTip.error(_this, { info: msg });
            }
          } else {
            _this.$msgTip.error(_this, { info: _this.$t("m.i.common.netError") });
          }
        });
      },
      //18.模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/intention/intentionMain/func_modelDownload";
        let form = document.createElement("form");
        form.innerHTML = `<input type="text" name="code" value="2"/>`;
        form.setAttribute("id", "form1");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        document.getElementById("form1").submit();
        document.getElementById("form1").remove();
      },
      //19.导入清单
      importBill() {
        this.handleSaveIntentionBatch(this, res => {
          this.importBillWin = true;
          this.$nextTick(() => {
            this.addOrEditForm.id = res;
            this.uploadWin = true;
            this.uploadUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/intention/intentionMain/func_uploadFile";
            this.curBatchId = this.addOrEditForm.id;
            this.importSelect = true;
            this.selectDataFirst = false;
          });
        });
      },
      uploadWinClose() {
        this.uploadWin = false;
        this.uploadUrl = '';
        this.importSelect = false;
        this.selectDataFirst = false;
        this.createForm();
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      //20.删除票据
      deleteBill() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "删除确认",
          content: "确定要删除吗？",
          onOk: () => {
            let ids = "";
            for (var i = 0, count = list.length; i < count; i++) {
              ids += list[i].id;
              if (i < list.length - 1) {
                ids += ",";
              }
            }
            this.hasSelect = true;
            post({
              listIds: ids,
              batchId: this.addOrEditForm.id
            }, "/be/market/intention/intentionMain/func_delBill").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let data = res.data.retData;
                if (retCode === "000000") {
                  this.createForm();
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.hasSelect = false;
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //21.发送（入口）
      send() {
        let list=this.$refs.datagrid.tData;
        let flag=1;
        let billList=[];
        console.log(list)
        if(window.sessionStorage.getItem("isOpenI9")=="1"){
          for(let i=0;i<list.length;i++){
            if(list[i].assetIndustry=="1"){
              billList.push(list[i].cdNo)
              flag=0;
            }
          }
        }

        if(flag==0){
          this.$hMsgBox.confirm({
            title: "确认",
            content: "选中票据【"+billList.toString()+"】资产类型为持有-按摊余成本计量，请确定是否提交？",
            onOk: () => {
              this.handleSaveIntentionBatch(this, res => {
                this.sendFunction(this, res);
              });
            },
            onCancel: () =>{
              return;
            }
          });
        }else{
          this.handleSaveIntentionBatch(this, res => {
            this.sendFunction(this, res);
          });
        }

      },
      //22.发送 id：批次ID
      sendFunction(_this, id) {
        post({ id: id }, "/be/market/intention/intentionMain/func_sendIntentionApply").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            let data = res.data.retData;
            if (retCode === "000000") {
              _this.$msgTip.success(_this);
              _this.queryFormItem.id = "";
              _this.$emit("intentionViewSend", "");
            } else {
              _this.$msgTip.error(_this, { info: msg });
            }
          } else {
            _this.$msgTip.error(_this, { info: _this.$t("m.i.common.netError") });
          }
        });
      },
      //23.选择交易员
      seletTrader() {
        this.handleSaveIntentionBatch(this, res => {
          this.branchTypeInList = this.addOrEditForm.transCustTypeList;
          this.needThisBatchId = res;
          this.traderView = true;
        });
      },
      //24.交易员页面关闭
      traderWinClose() {
        this.traderView = false;
      },
      //25.保存批次 networkOk：回调函数 返回：批次ID
      handleSaveIntentionBatch(_this, networkOk) {
        _this.addOrEditForm.transCustType = _this.addOrEditForm.transCustTypeList.join(",");
        _this.addOrEditForm.creditCustType = _this.addOrEditForm.creditCustTypeList.join(",");
        let url = "/be/market/intention/intentionMain/func_createIntentionBatch";
        if (_this.isEdit && !_this.canEdit) {
          url = "/be/market/intention/intentionMain/func_editIntentionBatch";
        }
        _this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            post(_this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let data = res.data.retData;
                if (retCode === "000000") {
                  _this.addOrEditForm.id = data.id;
                  _this.queryFormItem.id = data.id;
                  _this.$emit("intentionViewSaveBatch", "");
                  networkOk(data.id);
                } else {
                  _this.$msgTip.error(_this, { info: msg });
                }
              } else {
                _this.$msgTip.error(_this, { info: _this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //26.校验剩余有效期限
      checkResidualTerm() {
        this.$refs.addOrEditForm.validateField("residualTerm", function() {
        });
      },
      //27.校验交易对手类型是否已选交易员
      checkTrader(e) {
        let key = e.target.defaultValue;
        let checked = e.target.checked;

        if (!checked && this.addOrEditForm.sendRange === "0") {
          post({ brchClass: key }, "/be/market/intention/intentionMain/func_checkTraderBrchClass").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode !== "000000") {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      //28.挑票页面关闭
      pickBillWinClose() {
        this.$refs.datagrid.dataChange(1);
        this.createForm();
        this.pickBillWin = false;
      },
      //29.选择票据回调方法
      pickedBill() {
        this.$refs.datagrid.dataChange(1);
        this.createForm();
        this.pickBillWin = false;
      },
      //30.选择票据包回调方法
      pickedPackBill(rebuyId) {
        post({
          rebuyId: rebuyId,
          batchId: this.addOrEditForm.id
        }, "/be/market/intention/intentionMain/func_pickPackBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.addOrEditForm.packetSeq = res.data.retMsg;
              this.packetSeqWithout = res.data.retMsg;
              this.pickPackBillWin = false;
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.createForm();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //31.选择票据包页面关闭
      pickPackBillWinClose() {
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.createForm();
        this.pickPackBillWin = false;
      },
      //32.导入票据页面关闭
      importBillWinClose() {
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.createForm();
        this.importBillWin = false;
      },
      //33.文件上传文件类型错误处理
      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确" });
      },
      //34.文件上传成功处理
      handleSucess(response, file, fileList) {
        if (response.retCode === "000000") {
          if(response.retMsg){
            this.$msgTip.error(this, { info: response.retMsg });
            this.$refs.upload.fileList = [];
            this.$nextTick(() => {
              this.$refs.upload.clearFiles();
              this.addOrEditForm.id = res;
            });
          }else{
            this.importBillWin = false;
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.createForm();
            this.$msgTip.success(this, { info: "票据导入成功" });
          }
        } else {
          this.$msgTip.error(this, { info: response.retMsg });
          this.$nextTick(() => {
            this.$refs.upload.clearFiles();
            this.addOrEditForm.id = res;
          });
        }
      },
      //35.文件上传失败处理
      handleFileError(error, file, fileList) {
        this.$msgTip.error(this, { info: error });
      },
      //36.只允许上传一个文件校验
      handleBeforeUpload() {
        this.uploadList = this.$refs.upload.fileList;
        const check = this.uploadList.length < 1;
        if (!check) {
          this.$msgTip.error(this, { info: "只能上传一个文件" });
        }
        return check;
      },
      //37.选择非法人产品
      queryProductName(){
        this.showCpesProductBranch = true;
      },
      //38.关闭非法人产品页面
      showCpesProductBranchClose(){
        this.showCpesProductBranch = false;
      },
      //39. 根据弹框所选数据进行赋值
      showCpesProductBranchSubmit(info){
        if (info === null) {
          this.$msgTip.error(this,{info:"请先选择记录！"});
          return;
        }
        this.addOrEditForm.sendProductNo=info.brchCode;
        this.addOrEditForm.sendProductName=info.brchFullNameZh;
        this.$refs.addOrEditForm.validateField('sendProductName');
        this.showCpesProductBranch = false;
      },
      //40
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      tradDirChange(value) {
        // if (value === 'CRD02' || value === "TDD02") {
        //   this.addOrEditForm.totalAmt = "";
        //   this.addOrEditForm.buyBackTotalAmt = "";
        // }
      }
    }
  };
</script>

<style scoped>

</style>
