<template>
  <div>
    <div class="close-window" @mouseleave="closeWindowList">
      <div class="close-window-btn-box">
          <span class="close-window-btn" :class="{'close-btn-on':ifShowWindowList}" @mouseover="showWindowList">
                      <i class="icon iconfont icon-dankuangshouna"></i>
                  </span>
      </div>
      <div class="window-title-box" v-show="ifShowWindowList">
        <ul>
          <li v-for="(item,index) in closeList" :key="index" @click="reshowLayer(item.id,index)">
            {{item.title}}
          </li>
        </ul>
      </div>
    </div>
    <div class="layout">
      <div class="window-operate" id="widowHeight">
        <!--窗口收起-->
        <div class="h-fly" :class="{'h-move':fly}" :style="{right: flyR + 'px', top: flyT + 'px'}"></div>
        <!--窗口内容区-->
        <div id="h-window-container" class="window-content" :class="{'window-layer-fix':!ifActive}">
          <!-- 报价申请界面-->
          <div class="window-layer" id="h-window1">
            <h-dragscalelayer :visible="windowList[0].visible" :title="windowList[0].title" :style="{zIndex:windowList[0].zIndex}" :index="1"
              wrapId="h-window-container" windowId="h-window1" @close="closeLayer($event,1)" @changePosition="layerChangePosition(1)"
              @flyPosition="setFlyPosition($event)" :windowListLength="windowList.length">
              <div class="h-form-table-window">
                <!-- 查询表单 加class h-form-search  label内容多行加class="h-form-long-label"-->
                <h-form :model="quoteAppItem" :label-width="90" ref="quoteAppItem" :rules="ruleValidate" cols="3" class="h-form-search">
                  <show-branch v-model="quoteAppItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                               v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="quoteAppItem.ownedBrchNos" :brchName.sync="quoteAppItem.ownedBrchNames"
                               :params="{authPath:this.$route.path}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                               queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>


                  <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                    <h-input v-model="quoteAppItem.batchNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.tradDir')" prop="trDir">
                    <h-select v-model="quoteAppItem.trDir" placeholder="">
                      <h-option v-for="item in trDirList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                    <h-select v-model="quoteAppItem.busiType" placeholder="">
                      <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <show-cpes-branch v-model="quoteAppItem.cpBrchName" :label="$t('m.i.be.otherBrchName')" prop="cpBrchName"
                                    :brchCode.sync="quoteAppItem.cpBrchCode" :cpesBrchName.sync="quoteAppItem.cpBrchName"
                                    datagridUrl="/cpes/branch/queryBranchList"
                                    queryUrl="/cpes/branch/queryBranchList" ></show-cpes-branch>
                  <h-form-item :label="$t('m.i.be.custTraderName')" prop="cpTraderName" class="h-form-long-label">
                    <h-input @on-click="showtrader = true" v-model="quoteAppItem.cpTraderName" icon="android-search" readonly
                             clearable @on-clear="clearVal('cpTraderName')">
                    </h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo"  :validRules="quoteNoRules">
                    <h-input v-model="quoteAppItem.quoteNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="this.$t('m.i.be.isCommit')" prop="isCommit" cols="2" >
                    <h-radio-group v-model="quoteAppItem.isCommit" >
                      <h-radio label="0" @on-click="noCommitButton">
                        <span>未提交</span>
                      </h-radio>
                      <h-radio label="1" @on-click="hasCommitButton">
                        <span>已提交</span>
                      </h-radio>
                    </h-radio-group>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleQuoteAppSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="resetQuoteAppSearch()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </h-form>
                <h-datagrid  :columns="quoteApplyColumns" url="/be/market/quote/quoteManager/func_queryQuoteBatchApply"
                             :hasPage="true" :highlight-row="true" :bindForm="quoteAppItem" showListCkeckBox :border="true" :auto-load="true"
                             size="default" stripe :showSizer="true" :showElevator="true" :onCurrentChangeCancel="cancelQuoteAppSelectClick" :onCurrentChange="quoteAppSelectClick"  ref="quoteAppDatagrid"
                             class="p-5" :customCalculateHeight="calculateHeight" customCalculateParams="h-window1">
                  <div slot="toolbar" class="pull-left">
                    <h-dropdown placement="bottom-start" @on-click="createQuote" >
                      <h-button type="primary" :disabled="hasCommit">
                        新增
                        <h-icon name="unfold"></h-icon>
                      </h-button>
                      <h-dropdown-menu slot="list" id="dropDownMenu">
                        <h-dropdown-item name="BT01" :disabled="hasCommit" v-if="bt01Button">转贴现</h-dropdown-item>
                        <h-dropdown-item name="BT02" :disabled="hasCommit" v-if="bt02Button">质押式回购</h-dropdown-item>
                        <h-dropdown-item name="BT03" :disabled="hasCommit" v-if="bt03Button">买断式回购</h-dropdown-item>
                      </h-dropdown-menu>
                    </h-dropdown>
                    <h-button type="primary" @click="editQuote()" :disabled="hasCommit">修改</h-button>
                    <h-button type="primary" @click="delQuoteAppl()" :disabled="hasCommit" v-if="quoteAppItem.trDir!=='TDD01'">删除</h-button>
                    <h-button type="primary" @click="refuseQuote()" :disabled="hasCommit">终止报价</h-button>
                    <h-button type="primary" @click="findQuoteHist()" :disabled="hasCommit">修改历史查看</h-button>
                    <h-button type="primary" @click="printing()" :disabled="hasCommit" v-if="childrenBtnAuth.quoteManagerPrinting === undefined ? true : childrenBtnAuth.quoteManagerPrinting.isShow">打印清单</h-button>
                    <h-button type="primary" @click="cancelAppl()" :disabled="noCommit">撤销</h-button>
                  </div>
                </h-datagrid>
              </div>
            </h-dragscalelayer>
          </div>

          <!--报价监控页面-->
          <div class="window-layer" id="h-window2">
            <h-dragscalelayer :visible="windowList[1].visible" :title="windowList[1].title" :style="{zIndex:windowList[1].zIndex}" :index="2"
                              wrapId="h-window-container" windowId="h-window2" @close="closeLayer($event,2)" @changePosition="layerChangePosition(2)"
                              @flyPosition="setFlyPosition($event)" :windowListLength="windowList.length">
              <div class="h-form-table-window">
                <!-- 查询表单 加class h-form-search-->
                <h-form :model="quoteMonitorItem" :label-width="90" ref="quoteMonitorItem" :rules="ruleValidate" cols="3" class="h-form-search">
                  <show-branch v-model="quoteMonitorItem.quoteMonitorbrchName"  :label="$t('m.i.be.transBrch')"  prop="quoteMonitorbrchName"
                               :showCheckBox="true" :brchNo.sync="quoteMonitorItem.transBrchNos" :brchName.sync="quoteMonitorItem.quoteMonitorbrchName"></show-branch>
                  <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                    <h-input v-model="quoteMonitorItem.batchNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billOrigin')"  prop="billOrigin">
                    <h-select v-model="quoteMonitorItem.billOrigin" placeholder="">
                      <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                    <h-input v-model="quoteMonitorItem.billNo" placeholder=""></h-input>
                  </h-form-item>
                  <!--子票区间-->
                  <bill-range :form-item="quoteMonitorItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo"  :validRules="quoteNoRules">
                    <h-input v-model="quoteMonitorItem.quoteNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                    <h-input v-model="quoteMonitorItem.dealNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.tradDir')" prop="trDir">
                    <h-select v-model="quoteMonitorItem.trDir" placeholder="">
                      <h-option v-for="item in trDirList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                    <h-select v-model="quoteMonitorItem.busiType" placeholder="">
                      <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                    <h-select v-model="quoteMonitorItem.billType" placeholder="">
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                    <h-select v-model="quoteMonitorItem.billClass" placeholder="">
                      <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.firstAcctStatus')" prop="acctStatus">
                    <h-select v-model="quoteMonitorItem.acctStatus" placeholder="">
                      <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.dealStatus')" prop="dealStatus">
                    <h-select v-model="quoteMonitorItem.dealStatus" placeholder="">
                      <h-option v-for="item in dealStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.firstClearStatus')"  prop="clearStatus">
                    <h-select v-model="quoteMonitorItem.clearStatus" placeholder="">
                      <h-option v-for="item in clearStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="firstSettleDate" :label="$t('m.i.be.firstSettleDate')">
                    <h-date-picker :value="firstSettleDate" format="yyyy-MM-dd" type="daterange" placeholder="" showFormat
                      :editable=false autoPlacement @on-change="handleFirstSettleDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="dueSettleDate" :label="$t('m.i.be.dueSettleDt')">
                    <h-date-picker :value="dueSettleDate" format="yyyy-MM-dd" type="daterange" placeholder="" showFormat
                      :editable=false autoPlacement @on-change="handleDueSettleDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleQuoteMonitorSearch()">查询</h-button>
                    <h-button type="ghost" @click="resetQuoteMonitorSearch()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </h-form>
                <h-datagrid :columns="quoteMonitorColumns" url="/be/market/quote/quoteManager/func_queryQuoteBatchMonitor" :hasPage="true" :highlight-row="true"
                            :auto-load="true" :bindForm="quoteMonitorItem"
                            :border="true" size="default" stripe :showSizer="true" :showElevator="true" ref="quoteMonitorDatagrid"
                            :row-select="true" :has-select="false"
                            class="p-5" :customCalculateHeight="calculateHeight" customCalculateParams="h-window2">
                  <div slot="toolbar" class="pull-left">
                    <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')">{{$t('m.i.common.exportData')}}</h-button>
                    <h-button type="primary" @click="exportTransSheet()">成交单导出</h-button>
                    <h-button type="primary" @click="exportBatchTransSheet()"
                              v-if="childrenBtnAuth.showBatchDealExportButton === undefined ? false : childrenBtnAuth.showBatchDealExportButton.isShow">成交单批量导出</h-button>
                    <h-button type="primary" @click="approvalPrint()" v-if="childrenBtnAuth.quoteManagerApprovalPrint === undefined ? true : childrenBtnAuth.quoteManagerApprovalPrint.isShow">审批单打印</h-button>
                  </div>
                </h-datagrid>
              </div>
            </h-dragscalelayer>
          </div>

        </div>
        <div v-if="true">
          <h-delay :delay='200'>
            <!-- 卖出报价单新增、修改 -->
            <quote-sale-change :dictMap="dictList" :trDir="trDir" :bt="busiType" :batchId="batchId" :title="title" @quoteSaleChangeWinClose="quoteSaleChangeWinClose"
                               ref="quoteSaleChage" :quoteSaleChangeWin="quoteSaleChangeWin" :licenseFlag="this.licenseFlag" :childrenBtnAuth="this.childrenBtnAuth"
                               :showNoticeFirstStationItem="this.showNoticeFirstStationItem" :isNoticeFirstAudit="this.isNoticeFirstAudit">
            </quote-sale-change>
          </h-delay>
          <h-delay :delay='300'>
            <!-- 买入报价单新增、修改 -->
            <quote-rebuy-change :dictMap="dictList" :trDir="trDir" :bt="busiType" :batchId="batchId" :title="title" @quoteRebuyChangeWinClose="quoteRebuyChangeWinClose"
                                ref="quoteRebuyChage" :quoteRebuyChangeWin="quoteRebuyChangeWin" :licenseFlag="this.licenseFlag"
                                :showNoticeFirstStationItem="this.showNoticeFirstStationItem" :isNoticeFirstAudit="this.isNoticeFirstAudit" :childrenBtnAuth="this.childrenBtnAuth">
            </quote-rebuy-change>
          </h-delay>
          <h-delay :delay='400'>
            <!--报价历史查看-->
            <quote-hist-change :dictMap="dictList" :trDir="trDir" :bt="busiType" :quoteNo="quoteNo" :isQuoteNew="isQuoteNew" :reqNum="reqNum"
                               :title="title" @quoteHistChangeWinClose="quoteHistChangeWinClose" ref="quoteHistChage" :quoteHistChangeWin="quoteHistChangeWin">
            </quote-hist-change>
          </h-delay>
          <h-delay :delay='500'>
            <sale-detail :batchId="theBatchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showSaleDetil" @closeMsgBox="closeDetil('sale')"></sale-detail>
          </h-delay>
          <h-delay :delay='600'>
            <rebuy-detail :batchId="theBatchId" :dictMap="dictMap" :busiType="busiType" :rebuyDetailWin="showRebuyDetil" @closeMsgBox="closeDetil('rebuy')"></rebuy-detail>
          </h-delay>
          <h-delay :delay='700'>
            <sale-detail-print :batchId="theBatchId" :dictMap="dictMap" :busiType="busiType" :saleDetailPrintWin="showSaleDetilPrint" @closeMsgBox="closeDetilPrint('sale')"></sale-detail-print>
          </h-delay>
          <h-delay :delay='800'>
            <rebuy-detail-print :batchId="theBatchId" :dictMap="dictMap" :busiType="busiType" :rebuyDetailPrintWin="showRebuyDetilPrint" @closeMsgBox="closeDetilPrint('rebuy')"></rebuy-detail-print>
          </h-delay>
          <h-delay :delay='1000'>
            <approval-print  :batchId="batchId" :dictMap="dictList"  :approvalPrintWin="approvalPrintWin"  @approvalPrintWinClose="approvalPrintWinClose" ></approval-print>
          </h-delay>
        </div>
        <trader-id-search :traderIdWin="showtrader" :brchCode="quoteAppItem.cpBrchCode" @traderIdWinClose="traderIdWinClose" @traderIdChange="traderIdChange"></trader-id-search>
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                               :rows="this.rows"></common-excel-download>

      </div>
    </div>
  </div>
</template>
<script>
  import {cmycurd, formatNumber, post,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteManager",
    data() {
      return  {
        buttonAuth:{},
        quoteNoRules: [{
          test:  /^\w{0,20}$/,
          trigger: "blur",
          message: "长度不能超过20位字符"
        }],
        brchTreeData : [],
        ifShowWindowList : false,//是否显示关闭列表
        closeList : [],//记录关闭的弹窗s
        ifActive : false,//弹窗是否被激活
        fly : false,
        flyR : -20,
        flyT : -20,
        //brchNameSelectWin : false,
        quoteApplySelectList : [],
        quoteApplySelectRowInx : [],
        windowList : [//弹框数据格式
          {
            "title": "报价申请",
            "id": 1,
            "visible": true,
            "zIndex": 2
          }, {
            "title": "报价监控",
            "id": 2,
            "visible": true,
            "zIndex": 2
          }
        ],
        //表单数据
        quoteAppItem : {
          batchNo: '',
          trDir: '',
          busiType: '',
          cpBrchName:'',
          cpBrchCode:'',
          cpTraderName:'',
          cpTraderNo:"",
          isCommit:'0',
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          quoteNo:""
        },
        //集中授权管理
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag: false,
        authPath: this.$route.path ,
        quoteMonitorItem : {
          transBrchNos: '',
          batchNo: '',
          billNo:'',
          quoteNo: '',
          dealNo: '',
          trDir: '',
          busiType: '',
          billType: '',
          billClass: '',
          acctStatus: '',
          dealStatus: '',
          clearStatus: '',
          firstSettleDate: '',
          minFirstSettleDt: '',
          maxFirstSettleDt: '',
          dueSettleDate: '',
          minDueSettleDt: '',
          maxDueSettleDt: '',
          quoteMonitorbrchName: '',
          billOrigin:'',
          minBillRangeStart:'',
          maxBillRangeEnd:''
        },
        layerItem : {
        },
        //验证规则
        ruleValidate : {},
        firstSettleDate:[],
        dueSettleDate:[],
        // 报价申请列表展示的字
        quoteApplyColumns : [
          {
            type: 'radio',
            title:' ',
            width: 50,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: 'batchNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billDetail(params.row.id, params.row.busiType, params.row.trDir)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t('m.i.be.quoteNo'),
            key: 'quoteNo',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.tradDir'),
            key: 'trDir',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'TrDir', params.row.trDir);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: 'busiType',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.dealStatus'),
            key: 'dealStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.preTradeBhvr'),
            key: 'preTradeBhvr',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'PreTradeBhvr', params.row.preTradeBhvr);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: 'cpBrchName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.custTraderName'),
            key: 'cpTraderName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: 'billClass',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstTransRate'),
            key: 'ratePct',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dueTradRate'),
            key: 'dueRatePct',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: 'totalAmt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: 'totalNum',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.isSubDeal'),
            key: 'subDeal',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'Yon', params.row.subDeal);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.clearSpeed'),
            key: 'clearSpeed',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstSettleDate'),
            key: 'firstSettleDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.dueSettleDt'),
            key: 'dueSettleDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
            key: 'settleMode',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.clearType'),
            key: 'clearType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.clearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.effectiveQuoteTm'),
            key: 'quoteTm',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.setTm'),
            key: 'setTm',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: 'firstPayInterest',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: 'dueInterest',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.dueInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: 'firstSettleAmt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: 'dueSettleAmt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.dueSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.tenorDays'),
            key: 'tenorDays',
            sortable: true,
            hiddenCol: false
          }
        ],
        // 报价监控展示的字段
        quoteMonitorColumns : [
          {
            type: 'selection',
            width: 50,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: 'batchNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billDetail(params.row.id, params.row.busiType, params.row.trDir)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: 'batchStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteBatchStatus', params.row.batchStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.dealStatus'),
            key: 'dealStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstClearStatus'),
            key: 'clearStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'StlResult', params.row.clearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dueClearStatus'),
            key: 'dueClearStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'StlResult', params.row.dueClearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstAcctStatus'),
            key: 'acctStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dueAcctStatus'),
            key: 'dueAcctFlag',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.dueAcctFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.quoteNo'),
            key: 'quoteNo',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.tradDir'),
            key: 'trDir',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'TrDir', params.row.trDir);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: 'busiType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dealNo'),
            key: 'dealNo',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.preTradeBhvr'),
            key: 'preTradeBhvr',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'PreTradeBhvr', params.row.preTradeBhvr);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.dealDtTm'),
            key: 'dealDtTm',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
            }
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: 'cpBrchName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.custTraderName'),
            key: 'cpTraderName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: 'billClass',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstTransRate'),
            key: 'ratePct',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dueTradRate'),
            key: 'dueRatePct',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.isSubDeal'),
            key: 'subDeal',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'Yon', params.row.subDeal);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.clearSpeed'),
            key: 'clearSpeed',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstSettleDate'),
            key: 'firstSettleDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.dueSettleDt'),
            key: 'dueSettleDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
            key: 'settleMode',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.clearType'),
            key: 'clearType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.clearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.effectiveQuoteTm'),
            key: 'quoteTm',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.setTm'),
            key: 'setTm',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: 'totalAmt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            }
          },

          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: 'firstPayInterest',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: 'dueInterest',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.dueInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: 'firstSettleAmt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: 'dueSettleAmt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.dueSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.tenorDays'),
            key: 'tenorDays',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: 'totalNum',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.custProductNo'),
            key: 'cpProductName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: 'dealPrcMsg',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: 'reqBrchName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.traderName'),
            key: 'reqTraderName',
            sortable: true,
            hiddenCol: false
          }
        ],
        title: '',
        busiType: '',
        trDir: '',
        quoteSaleChangeWin: false,
        quoteRebuyChangeWin: false,
        busiTypeList: [],
        trDirList: [],
        billClassList: [],
        billTypeList: [],
        acctStatusList: [],
        dealStatusList: [],
        clearStatusList: [],
        preTradeBhvrList: [],
        quoteBatchStatusList: [],
        billSourceList: [],
        billOriginList: [],
        isDisabled: false,
        formItem: {},
        dictList: {},
        dictMap: new Map(),
        batchId: null,
        url: null,
        quoteNo: null,
        isQuoteNew: null,
        reqNum: null,
        quoteHistChangeWin: false,
        theBatchId: '',
        showSaleDetil: false,
        showRebuyDetil: false,
        hasCommit:false,
        noCommit:true,
        isDeleShow:true,
        showSaleDetilPrint: false,
        showRebuyDetilPrint: false,
        approvalPrintWin:false,
        bt01Button:false,
        bt02Button:false,
        bt03Button:false,
        moreComp:false,
        showBrchWin:false,
        showtrader:false,
        selectExportType: "",
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        mTreeHeight: 300,
        childrenBtnAuth: {},
        isNoticeFirstAudit:"0",
        showNoticeFirstStationItem:false
      };
    },
    components: {
      HDragscalelayer:()=>import(/* webpackChunkName: "components/dragscalelayer" */`@/components/dragscalelayer.vue`),
      QuoteSaleChange:()=>import(/* webpackChunkName: "banks/szbank/be/market/quote/sale/quoteSaleChange" */`@/views/bizViews/banks/szbank/be/market/quote/sale/quoteSaleChange`),
      QuoteRebuyChange:()=>import(/* webpackChunkName: "be/market/quote/rebuy/quoteRebuyChange" */`@/views/bizViews/be/market/quote/rebuy/quoteRebuyChange`),
      QuoteHistChange:()=>import(/* webpackChunkName: "be/market/quote/hist/quoteHistChange" */`@/views/bizViews/be/market/quote/hist/quoteHistChange`),
      RebuyDetail:()=>import(/* webpackChunkName: "be/market/quote/rebuy/rebuyDetail" */`@/views/bizViews/be/market/quote/rebuy/rebuyDetail`),
      SaleDetail:()=>import(/* webpackChunkName: "be/market/quote/sale/saleDetail" */`@/views/bizViews/be/market/quote/sale/saleDetail`),
      RebuyDetailPrint:()=>import(/* webpackChunkName: "be/market/quote/rebuy/rebuyDetailPrint" */`@/views/bizViews/be/market/quote/rebuy/rebuyDetailPrint`),
      SaleDetailPrint:()=>import(/* webpackChunkName: "be/market/quote/sale/saleDetailPrint" */`@/views/bizViews/be/market/quote/sale/saleDetailPrint`),
      ApprovalPrint:()=>import(/* webpackChunkName: "be/market/quote/print/approvalPrint" */`@/views/bizViews/be/market/quote/print/approvalPrint`),
      BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)
    },
    watch: {
      licenseFlag() {
        this.$nextTick(() => {
          if(this.$refs.quoteAppDatagrid) {
            this.$refs.quoteAppDatagrid.selfAdaption();
          }
        });
      }
    },
    methods: {
      getTreeHeight(isMax, msgRef) {
        this.$nextTick(() => {
          if(isMax) {
            let headerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header')[0].offsetHeight;
            let footerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-footer')[0].offsetHeight;
            let headerBtnHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header-wrapper')[0].offsetHeight;
            let mTreeHeight = window.innerHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
            if(window.sessionStorage.getItem("isTransfer") === "0") {
              let appObj = document.getElementsByClassName("app-main");
              let appOffsetHeight = appObj.length == 0 ? 0 : appObj[0].offsetHeight;
              mTreeHeight = appOffsetHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
            }
            this.mTreeHeight = mTreeHeight;
          } else {
            this.mTreeHeight = 300;
          }
        });
      },
      closeBranch(){
        this.showBrchWin=false
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.quoteAppItem.cpBrchCode=info.brchCode;
        this.quoteAppItem.cpBrchName = info.brchFullNameZh;
        this.showBrchWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "quoterManagerExportInfo";
        } else {
          return;
        }
        let selects=this.$refs.quoteMonitorDatagrid.selectIds;
        if (selects.length != 0) {
          this.rows = selects.length;
        } else {
          this.rows = this.$refs.quoteMonitorDatagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_exportQuoteBatchData";
        let options = {};
        if (this.$refs.quoteMonitorDatagrid.selectIds.length !== 0) {
          options.params = {
            batchIds: this.$refs.quoteMonitorDatagrid.selectIds
          };
          options.pageSize = this.$refs.quoteMonitorDatagrid.selectIds.length;
        } else {
          options.params = this.quoteMonitorItem;
          options.pageSize = this.$refs.quoteMonitorDatagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      exportBills() {
        let url = window.LOCAL_CONFIG.API_HOME + '/be/market/quote/quoteManager/func_exportQuoteBatchData'
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        let key;
        for (key in this.quoteMonitorItem) {
          if (this.quoteMonitorItem[key]) {
            let input = document.createElement('input')
            input.type = 'text'
            input.name = key
            input.value = this.quoteMonitorItem[key]
            form.appendChild(input);
          }
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      exportTransSheet() {
        let selects = this.$refs.quoteMonitorDatagrid.selects;
        if (selects.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return
        }
        if (selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return
        }
        if(selects[0].dealStatus!='QS06'){
          this.$msgTip.info(this, { info: "该记录不是成交状态，不能导出成交单" });
          return;
        }
        if (selects[0].trDir == "TDD01" || selects[0].trDir == "CRD01") {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_exportDeal";
          let form = document.createElement('form');
          form.setAttribute("id", "formId");
          form.setAttribute('action', url);
          form.setAttribute("method", "post");
          let input = document.createElement('input')
          input.type = 'text'
          input.name = 'id'
          input.value = selects[0].id
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
        if (selects[0].trDir == "TDD02" || selects[0].trDir == "CRD02") {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_exportDealSale";
          let form = document.createElement('form');
          form.setAttribute("id", "formId");
          form.setAttribute('action', url);
          form.setAttribute("method", "post");
          let input = document.createElement('input')
          input.type = 'text'
          input.name = 'id'
          input.value = selects[0].id
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      exportBatchTransSheet(){
        let selects = this.$refs.quoteMonitorDatagrid.selects;
        if (selects.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return
        }
        if (selects.length>200){
          this.$msgTip.info(this, { info: "批量成交单导出最大不能超过200笔" });
          return;
        }
        let flag=selects.some(child => {
          return child.dealStatus!='QS06';
        });
        if (flag) {
          this.$msgTip.info(this, { info: "存在记录不是成交状态，不能导出成交单" });
          return;
        }
        let trDir=selects[0].trDir;
        let sameTrDir;
        if (trDir == "TDD01" || trDir == "CRD01") {
          sameTrDir=selects.some(child => {
              return child.trDir!="TDD01"&&child.trDir!="CRD01";
          });
        }
        if (trDir == "TDD02" || trDir == "CRD02") {
          sameTrDir=selects.some(child => {
            return child.trDir!="TDD02"&&child.trDir!="CRD02";
          });
        }
        if (sameTrDir){
          this.$msgTip.info(this, { info: "请选择交易方向相同的数据!" });
          return;
        }

        if (trDir == "TDD01" || trDir == "CRD01") {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_exportBatchDeal";
          let form = document.createElement('form');
          form.setAttribute("id", "formId");
          form.setAttribute('action', url);
          form.setAttribute("method", "post");
          let input = document.createElement('input')
          input.type = 'text'
          input.name = 'batchIds'
          input.value = this.$refs.quoteMonitorDatagrid.selectIds
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
        if (trDir == "TDD02" || trDir == "CRD02") {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_exportBatchSaleDeal";
          let form = document.createElement('form');
          form.setAttribute("id", "formId");
          form.setAttribute('action', url);
          form.setAttribute("method", "post");
          let input = document.createElement('input')
          input.type = 'text'
          input.name = 'batchIds'
          input.value = this.$refs.quoteMonitorDatagrid.selectIds
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      billDetail(id, busiType, trans) {
        this.theBatchId = id
        this.busiType = busiType
        if (trans == "TDD01" || trans == "CRD01") {
          this.showRebuyDetil = true
        } else{
          this.showSaleDetil = true
        }
      },
      //明细窗口
      closeDetil(i) {
        if (i == 'rebuy') this.showRebuyDetil = false
        else if (i == 'sale') this.showSaleDetil = false
      },
      traderIdWinClose() {
        this.showtrader = false;
      },
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.quoteAppItem.cpTraderNo = info.traderId;
        this.quoteAppItem.cpTraderName = info.traderName;
        this.showtrader = false;
      },
      //关闭弹窗
      closeLayer(e, index) {
        this.windowList[index - 1].visible = false;
        this.closeList.push(this.windowList[index - 1]);
        this.fly = true;
      },
      //重新显示弹窗
      reshowLayer(id, index) {
        this.windowList[id - 1].visible = true;
        this.closeList.splice(index, 1);
        if (this.closeList.length == 0) {
          this.ifShowWindowList = false;
        }
        this.fly = false;
        this.layerChangePosition(id);
      },
      //改变层级
      layerChangePosition(id) {
        this.ifActive = true;
        this.fly = false;
        this.windowList.forEach((item, index) => {
          item.zIndex = 2;
        });
        this.windowList[id - 1].zIndex = 3;
        this.$nextTick(() => {
          if(id === 1) {
            this.$refs.quoteAppDatagrid.selfAdaption();
          } else if(id === 2) {
            this.$refs.quoteMonitorDatagrid.selfAdaption();
          }
        });
      },
      //鼠标进过收起的弹窗按钮
      showWindowList() {
        if (this.closeList.length > 0) {
          this.ifShowWindowList = true;
        }
      },
      //鼠标移出收起的弹窗框
      closeWindowList() {
        this.ifShowWindowList = false;
      },
      //关闭弹框效果
      setFlyPosition(e) {
        let totalWidth = document.documentElement.clientWidth || document.body.clientWidth;
        this.fly = false;
        this.flyR = totalWidth - e.clientX - 40;
        this.flyT = e.clientY - 20;
      },
      // 行选中
      quoteAppSelectClick(arr, selectInx) {
        let tmpArr = [];
        tmpArr.push(arr)
        this.quoteApplySelectList = tmpArr;
      },
      cancelQuoteAppSelectClick(){
        this.quoteApplySelectList=[]
      },

      //报价申请页面查询
      handleQuoteAppSearch() {
        this.$refs.quoteAppDatagrid.dataChange(1);
        this.quoteApplySelectList = [];
      },
      //报价申请页面重置查询条件
      resetQuoteAppSearch() {
        this.quoteAppItem.cpBrchCode='';
        this.quoteAppItem.cpTraderNo='';
        this.quoteAppItem.ownedBrchNo = "";
        this.quoteAppItem.ownedBrchName = "";
        this.quoteAppItem.ownedBrchNos = "";
        this.quoteAppItem.ownedBrchNames = "";
        this.$refs.quoteAppItem.resetFields();
        this.noCommitButton();
      },
      //未提交
      noCommitButton(){
        this.noCommit = true;
        this.hasCommit = false;
        this.quoteAppItem.isCommit='0';
        this.handleQuoteAppSearch();
      },
      //已提交
      hasCommitButton(){
        this.hasCommit = true;
        this.noCommit = false;
        this.quoteAppItem.isCommit='1';
        this.handleQuoteAppSearch();
      },
      //报价监控页面查询
      handleQuoteMonitorSearch() {
        this.$refs.quoteMonitorDatagrid.dataChange(1);
        this.$refs.quoteMonitorDatagrid.selectIds = [];
        this.$refs.quoteMonitorDatagrid.selects = [];
      },
      handleFirstSettleDateChange(arr){
        if (arr && arr.length >= 2) {
          this.quoteMonitorItem.minFirstSettleDt = arr[0].replace(/-/g, "");
          this.quoteMonitorItem.maxFirstSettleDt = arr[1].replace(/-/g, "");
          this.firstSettleDate = [arr[0],arr[1]];
        } else {
          this.quoteMonitorItem.minFirstSettleDt = "";
          this.quoteMonitorItem.maxFirstSettleDt = "";
          this.firstSettleDate = [];
        }
      },
      handleDueSettleDateChange(arr){
        if (arr && arr.length >= 2) {
          this.quoteMonitorItem.minDueSettleDt = arr[0].replace(/-/g, "");
          this.quoteMonitorItem.maxDueSettleDt = arr[1].replace(/-/g, "");
          this.dueSettleDate = [arr[0],arr[1]];
        } else {
          this.quoteMonitorItem.minDueSettleDt = "";
          this.quoteMonitorItem.maxDueSettleDt = "";
          this.dueSettleDate = [];
        }
      },
      //报价监控页面重置查询条件
      resetQuoteMonitorSearch() {
        this.firstSettleDate = [];
        this.dueSettleDate = [];
        this.$refs.quoteMonitorItem.resetFields();
        this.quoteMonitorItem.transBrchNos = [];
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = false;
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = true;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            this.$set(arr[i], "expand", isExpand);
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      //关闭买入报价修改页面
      quoteRebuyChangeWinClose() {
        this.quoteRebuyChangeWin = false;
        this.title = "";
        this.busiType = '';
        this.batchId = null;
        this.trDir = '';
        this.quoteApplySelectList = [];
        this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
      },
      // 关闭卖出报价新增、修改框
      quoteSaleChangeWinClose() {
        this.quoteSaleChangeWin = false;
        this.title = "";
        this.busiType = '';
        this.batchId = null;
        this.trDir = '';
        this.quoteApplySelectList = [];
        this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
      },
      //关闭报价历史页面
      quoteHistChangeWinClose() {
        this.trDir = null;
        this.quoteNo = null;
        this.isQuoteNew = null;
        this.reqNum = null;
        this.busiType = '';
        this.quoteHistChangeWin = false;
        this.title = "";
        this.quoteApplySelectList = [];
        this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
      },
      //新增报价
      createQuote(bt) {
        this.busiType = bt;
        this.quoteSaleChangeWin = true;
        this.title = "报价新增";
      },
      //修改报价
      editQuote() {
        let list = this.quoteApplySelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (list[0].trDir == 'TDD01' || list[0].trDir == 'CRD01') {
          //进入买入修改报价页面
          this.batchId = list[0].id;
          this.busiType = list[0].busiType;
          this.trDir = list[0].trDir;
          this.quoteSaleChangeWin = false;
          this.quoteRebuyChangeWin = true;
          this.title = "报价修改";
        } else {
          //进入卖出修改报价页面s
          this.batchId = list[0].id;
          this.busiType = list[0].busiType;
          this.trDir = list[0].trDir;
          this.quoteRebuyChangeWin = false;
          this.quoteSaleChangeWin = true;
          this.title = "报价修改";
        }
      },
      //删除报价
      delQuoteAppl() {
        let list = this.quoteApplySelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (list[0].trDir == 'TDD01' || list[0].trDir == 'CRD01') {
          //买入和逆回购
          this.$msgTip.info(this, { info: this.$t("买入和逆回购方向的不能删除报价") });
          return;
        }
        //卖出和正回购
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            let id = list[0].id;
            post({ id: id ,deleteFlag:"0" }, '/be/market/quote/quoteManager/func_deleteSaleBatch').then(res => {
              if (res) {
                let retCode = res.data.retCode;
                let retMsg = res.data.retMsg;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.quoteApplySelectList = [];
                } else if(retCode === "000002" && retMsg === "100001"){
                  this.continueApply(id);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.quoteApplySelectList = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },
      continueApply(id){
          let url= "/be/market/quote/quoteManager/func_deleteSaleBatch";
          let content ="批次下所有明细将同时删除，确认要删除吗？";
          this.$hMsgBox.confirm({
              title:"确认要继续提交申请吗?",
              content:content,
              onOk: () => {
                  post({ id: id ,deleteFlag:"1"}, url).then(res => {
                      if (res) {
                          if (res) {
                              let retCode = res.data.retCode;
                              if (retCode === "000000") {
                                  this.$msgTip.success(this);
                                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.pageInfo.pageNo);
                                  this.quoteApplySelectList = [];
                              } else {
                                  this.$msgTip.error(this, { info: res.data.retMsg });
                              }
                          } else {
                              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                          }
                      }
                  });
              }
          });
      },
      //终止报价
      refuseQuote() {
        let list = this.quoteApplySelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let url = '';
        if (list[0].trDir == 'TDD01' || list[0].trDir == 'CRD01') {
          //买入终止报价请求地址
          url = '/be/market/quote/quoteManager/func_refuseRebuyQuote';
        } else {
          //卖出终止报价地址
          url = '/be/market/quote/quoteManager/func_refuseSaleQuote';
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要终止报价吗") + "?",
          onOk: () => {
            let id = list[0].id;
            post({ id: id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.quoteApplySelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.quoteApplySelectList = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },
      //查看报价历史
      findQuoteHist() {
        let list = this.quoteApplySelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let obj = list[0];
        this.trDir = obj.trDir;
        this.quoteNo = obj.quoteNo;
        this.busiType = obj.busiType;
        this.isQuoteNew = '1';
        this.title = "修改历史查看";
        this.reqNum = null;
        if (this.quoteNo) {
          this.quoteHistChangeWin = true;
        } else {
          this.title = "";
          this.$msgTip.info(this, { info: this.$t("首次报价无修改历史数据") });
        }
      },
      //打印清单
      printing(){
        let list = this.quoteApplySelectList;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.billDetailPrint(list[0].id, list[0].busiType, list[0].trDir);
      },
      billDetailPrint(id, busiType, trans) {
        this.theBatchId = id;
        this.busiType = busiType;
        if (trans === "TDD01" || trans === "CRD01") {
          this.showRebuyDetilPrint = true;
        } else{
          this.showSaleDetilPrint = true;
        }
      },
      //关闭打印窗口
      closeDetilPrint(i) {
        if (i === 'rebuy') this.showRebuyDetilPrint = false;
        else if (i === 'sale') this.showSaleDetilPrint = false;
      },
      approvalPrint() {
        let list = this.$refs.quoteMonitorDatagrid.selects;
        if(null == list || list.length == 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        post({ id: list[0].id }, "/be/market/quote/quoteManager/func_busiApprovePrint").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.assembleDiscParams(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

      assembleDiscParams(discContract) {
        let vocherData = [];
        discContract.printObj = discContract.printDate;
        vocherData.push(JSON.parse(discContract.printObj));
        vocherData[0].capTotalAmt = cmycurd(vocherData[0].totalAmt);
        vocherData[0].totalAmt = formatNumber(vocherData[0].totalAmt,2,',');
        vocherData[0].ratePct = formatNumber(vocherData[0].ratePct,4,',') + "%";
        if (vocherData[0].dueSettleDt != null) {
          vocherData[0].formatDueSettleDt = this.transDtToDtFormat(vocherData[0].dueSettleDt.toString());
        }
        if (vocherData[0].workDate != null) {
          vocherData[0].formatWorkDate = this.transDtToDtFormat(vocherData[0].workDate.toString());
        }

        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE030707", vocherData: vocherData }, billInfo: "",
          callback: () => {
            this.$refs.quoteMonitorDatagrid.dataChange(this.$refs.quoteMonitorDatagrid.$refs.gridPage.currentPage);
            this.currentSelectList = [];
          },
          errorCallback: () => {
            this.$refs.quoteMonitorDatagrid.dataChange(this.$refs.quoteMonitorDatagrid.$refs.gridPage.currentPage);
            this.currentSelectList = [];
          }
        });
      },
      clearVal(type){
        if(type == 'cpBrchName'){
          this.quoteAppItem.cpBrchCode = '';
        }
        if(type == 'cpTraderName'){
          this.quoteAppItem.cpTraderNo = '';
        }
      },
      //审批单打印
      approvalPrintOld(){
        let list = this.$refs.quoteMonitorDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.batchId=list[0].id;
        this.approvalPrintWin=true;

      },
      approvalPrintWinClose(){
        this.batchId=null;
        this.approvalPrintWin=false;
      },
      cancelAppl(){
        let list = this.quoteApplySelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let url = '';
        if (list[0].trDir == 'TDD01' || list[0].trDir == 'CRD01') {
          //买入终止报价请求地址
          url = '/be/market/quote/quoteManager/func_cancelRebuyApply';
        } else {
          //卖出终止报价地址
          url = '/be/market/quote/quoteManager/func_cancelSaleApply';
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要撤销申请吗") + "?",
          onOk: () => {
            let id = list[0].id;
            post({ id: id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.quoteApplySelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.quoteApplySelectList = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },
      getButton(){
        let url ='/be/market/quote/quoteManager/func_getButton';
        post({loading:false},url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              let obj = res.data.retData;
              let bt01 = false;
              let bt02 = false;
              let bt03 = false;
              for (let i=0;i<obj.length;i++){
                if("BT01"==obj[i]){
                  bt01=true;
                }else if("BT02"==obj[i]){
                  bt02 =true;
                }else if("BT03"==obj[i]){
                  bt03=true;
                }
              }
              this.bt01Button=bt01;
              this.bt02Button=bt02;
              this.bt03Button=bt03;
            }else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
        });
      },

       getButtonAuth(){
         let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
         post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
           if (res) {
             let retCode = res.data.retCode;
             let retMsg = res.data.retMsg;
             if (retCode === "000000") {
               this.childrenBtnAuth =JSON.parse(res.data.retData);
             } else {
               this.$msgTip.error(this, { info: retMsg });
             }
           } else {
             this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
           }
         });
       },
      //根据弹框所选数据进行赋值
      /*brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.quoteAppItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.quoteAppItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
      //计算表格高度
      calculateHeight(windowId) {
        let appObj = document.getElementsByClassName("app-main");
        let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
        let objects = {
          formItemObj: this.$el.querySelector("#" + windowId + " .h-form"),
          titleObj: this.$el.querySelector("#" + windowId + " .h-datagrid-title"),
          toolbarObj: this.$el.querySelector("#" + windowId + " .h-datagrid-toolbar"),
          pageObj: this.$el.querySelector("#" + windowId + " .h-page")
        };
        let extralHeight = 0;
        Object.keys(objects).forEach(function(key, index) {
          if (objects[key] !== null) {
            extralHeight += objects[key].clientHeight;
          }
        });
        let windowHeight = window.innerHeight;
        let height = windowHeight - extralHeight - appOffsetTop - 76;
        objects = undefined;
        windowHeight = undefined;
        appObj = undefined;
        return height
      },
      //将XXXXXXXX格式日期转换为XXXX年XX月XX日
      transDtToDtFormat(date) {
        let dateFormat = new Date(date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"));
        let year = dateFormat.getFullYear();
        let month = dateFormat.getMonth() + 1;
        let day = dateFormat.getDate();
        return year + "年" + month + "月" + day + "日";
      }
    },
    created(){

    },
    mounted() {
      let appObj = document.getElementsByClassName("app-main");
      let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
      var oheight = document.documentElement.clientHeight - appOffsetTop || document.body.clientHeight - appOffsetTop;
      document.getElementById("widowHeight").style.height = oheight + "px";
      this.getButton();
      this.getButtonAuth();
      this.getDictListByGroups("TenorCode,bankLevel,BookType,AssetIndustryManage,AssetIndustry,CreditMajor,CreditDeductRule,QuoteBatchStatus,PreRelationFlag,PreTradeBhvr,CdSelectMode,ClearSpeed,SettleType,ClearType,Yon,QuoteBusiType,TrDir,CDMedia,DraftTypeCode,AcctFlag,QuoteStatus,StlResult,bankType,billSource,BillOrigin").then(res => {
        this.busiTypeList = res.get("QuoteBusiType");
        this.trDirList = res.get("TrDir");
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.acctStatusList = res.get("AcctFlag");
        this.dealStatusList = res.get("QuoteStatus");
        this.clearStatusList = res.get("StlResult");
        this.preTradeBhvrList = res.get("PreTradeBhvr");
        this.preRelationFlagList = res.get("PreRelationFlag");
        this.quoteBatchStatusList = res.get("QuoteBatchStatus");
        this.billSourceList = res.get("billSource");
        this.billOriginList = res.get("BillOrigin");
        this.dictList = {
          busiTypeList: this.busiTypeList,
          trDirList: this.trDirList,
          billClassList: this.billClassList,
          billTypeList: this.billTypeList,
          acctStatusList: this.acctStatusList,
          dealStatusList: this.dealStatusList,
          clearStatusList: this.clearStatusList,
          preTradeBhvrList: this.preTradeBhvrList,
          quoteBatchStatusList: this.quoteBatchStatusList,
          billSourceList:this.billSourceList,
          billOriginList:this.billOriginList,
          YonList: res.get('Yon'),
          ClearTypeList: res.get('ClearType'),
          SettleType: res.get('SettleType'),
          clearSpeed: res.get('ClearSpeed'),
          CdSelectMode: res.get('CdSelectMode'),
          creditDeductRuleList: res.get("CreditDeductRule"),
          assetIndustryListOne: res.get("AssetIndustryManage"),
          assetIndustryListAll: res.get("AssetIndustry"),
          bookTypeList: res.get("BookType"),
          bankLevelList:res.get("bankLevel"),
          TenorCodeList:res.get("TenorCode"),
          bankTypeList:res.get("bankType"),
          CreditMajorList:res.get("CreditMajor"),
          dictListMap: res.get("map")
        }
        this.dictMap = res.get("map");
        setTimeout(function(){
          this.moreComp = true;
        },3000)
      });

      //授权模式下显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              if(this.$refs.quoteAppDatagrid !== undefined) {
                this.$refs.quoteAppDatagrid.controlColumnsHidden("ownedBrchName", false);
              }
            }else {
              if(this.$refs.quoteAppDatagrid !== undefined) {
                this.$refs.quoteAppDatagrid.controlColumnsHidden("ownedBrchName", true);
              }
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

      //控制是否通知审批第一岗的显隐
      post({ paramKey: "pc.flow.is_show_notice_input_when_audit_appl" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.showNoticeFirstStationItem = res.data.retData === "1";
          } else {
            this.showNoticeFirstStationItem = false;
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
      //获取是否通知审批第一岗的默认值
      post({ paramKey: "pc.flow.default_notice_value_when_audit_appl" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
              this.isNoticeFirstAudit = res.data.retData?res.data.retData:"0";
          } else {
            this.isNoticeFirstAudit="0";
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

    }
  }

</script>
<style scoped lang="scss">

</style>
