<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="clearfix">
            <h-panel class="h-main-search h-form-search clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="3">
                <div class="h-search-form-row">
                  <h-form-item prop="settleDate" label="结算日期">
                    <h-date-picker v-model="formItem.settleDate" type="date" placeholder=""
                                   :options="disabledDateOption" format="yyyy-MM-dd" showFormat
                                   :editable=false></h-date-picker>
                  </h-form-item>
                  <!--<h-form-item prop="branchName" :label="$t('m.i.common.brchName')">
                    <h-input v-model="formItem.branchName" readonly icon="android-search"
                             @on-click="queryBranchCode()" placeholder="" :title="formItem.branchName" clearable @on-clear="clearBranchVal()"></h-input>
                  </h-form-item>-->

                  <show-cpes-branch  :label="$t('m.i.common.brchName')"
                                     :brchCode.sync="formItem.branchCode"  :cpesBrchName.sync="formItem.branchName"
                                     datagridUrl="/cpes/branch/queryBranchList" prop="branchName"
                                     queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                  <h-form-item prop="branchCode" v-show="false">
                    <h-input v-model="formItem.branchCode"></h-input>
                  </h-form-item>
                  <h-form-item class="no-label">
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 标签页 -->
          <h-tabs value="DVP">
            <h-tab-pane label="票款对付" name="DVP">
              <h-form :model="showDVPForm" :label-width="200" ref="showDVPForm" cols="2" class="h-form-search">
                <div class="h-search-form-row">
                  <h-form-item label="转贴现转入笔数:" prop="inRE1011Num">
                    <label>{{showDVPForm.inRE1011Num}}</label>
                  </h-form-item>
                  <h-form-item label="转贴现转入金额（元）:" prop="inRE1011Amt">
                    <label>{{formatAmt(showDVPForm.inRE1011Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="转贴现转出笔数:" prop="outRE1011Num">
                    <label>{{showDVPForm.outRE1011Num}}</label>
                  </h-form-item>
                  <h-form-item label="转贴现转出金额（元）:" prop="outRE1011Amt">
                    <label>{{formatAmt(showDVPForm.outRE1011Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购首期笔数:" prop="outRE1021Num">
                    <label>{{showDVPForm.outRE1021Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购首期金额（元）:" prop="outRE1021Amt">
                    <label>{{formatAmt(showDVPForm.outRE1021Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购到期笔数:" prop="inRE1022Num">
                    <label>{{showDVPForm.inRE1022Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购到期金额（元）:" prop="inRE1022Amt">
                    <label>{{formatAmt(showDVPForm.inRE1022Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购首期笔数:" prop="inRE1021Num">
                    <label>{{showDVPForm.inRE1021Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购首期金额（元）:" prop="inRE1021Amt">
                    <label>{{formatAmt(showDVPForm.inRE1021Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购到期笔数:" prop="outRE1022Num">
                    <label>{{showDVPForm.outRE1022Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购到期金额（元）:" prop="outRE1022Amt">
                    <label>{{formatAmt(showDVPForm.outRE1022Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="买断式正回购首期笔数:" prop="outRE1031Num">
                    <label>{{showDVPForm.outRE1031Num}}</label>
                  </h-form-item>
                  <h-form-item label="买断式正回购首期金额（元）:" prop="outRE1031Amt">
                    <label>{{formatAmt(showDVPForm.outRE1031Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="买断式正回购到期笔数:" prop="inRE1032Num">
                    <label>{{showDVPForm.inRE1032Num}}</label>
                  </h-form-item>
                  <h-form-item label="买断式正回购到期金额（元）:" prop="inRE1032Amt">
                    <label>{{formatAmt(showDVPForm.inRE1032Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="买断式逆回购首期笔数:" prop="inRE1031Num">
                    <label>{{showDVPForm.inRE1031Num}}</label>
                  </h-form-item>
                  <h-form-item label="买断式逆回购首期金额（元）:" prop="inRE1031Amt">
                    <label>{{formatAmt(showDVPForm.inRE1031Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="买断式逆回购到期笔数:" prop="outRE1032Num">
                    <label>{{showDVPForm.outRE1032Num}}</label>
                  </h-form-item>
                  <h-form-item label="买断式逆回购到期金额（元）:" prop="outRE1032Amt">
                    <label>{{formatAmt(showDVPForm.outRE1032Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现买断转出笔数:" prop="outRE3011Num">
                    <label>{{showDVPForm.outRE3011Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现买断转出金额（元）:" prop="outRE3011Amt">
                    <label>{{formatAmt(showDVPForm.outRE3011Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购首期笔数:" prop="outRE3021Num">
                    <label>{{showDVPForm.outRE3021Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购首期金额（元）:"  prop="outRE3021Amt">
                    <label>{{formatAmt(showDVPForm.outRE3021Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购到期笔数:"  prop="outRE3022Num">
                    <label>{{showDVPForm.outRE3022Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购到期金额（元）:" prop="outRE3022Amt">
                    <label>{{formatAmt(showDVPForm.outRE3022Amt)}}</label>
                  </h-form-item>
        <!--          <h-form-item label="再贴现质押式回购提前赎回笔数:" class="h-form-long-label" prop="outRE3023Num">
                    <label>{{showDVPForm.outRE3023Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购提前赎回金额（元）:" class="h-form-long-label" prop="outRE3023Amt">
                    <label>{{formatAmt(showDVPForm.outRE3023Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购逾期赎回笔:" class="h-form-long-label" prop="outRE3024Num">
                    <label>{{showDVPForm.outRE3024Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购逾期赎回金额（元）:" class="h-form-long-label" prop="outRE3024Amt">
                    <label>{{formatAmt(showDVPForm.outRE3024Amt)}}</label>
                  </h-form-item>-->
                  <h-form-item label="小计笔数:" prop="sumSettleNum">
                    <label>{{showDVPForm.sumSettleNum}}</label>
                  </h-form-item>
                  <h-form-item label="小计金额（元）:" prop="sumSettleMoney">
                    <label>{{formatAmt(showDVPForm.sumSettleMoney)}}</label>
                  </h-form-item>
                </div>
              </h-form>
            </h-tab-pane>
            <h-tab-pane label="纯票过户" name="FOP">
              <h-form :model="showFOPForm" :label-width="200" ref="showFOPForm" cols="2" class="h-form-search">
                <div class="h-search-form-row">
                  <h-form-item label="转贴现转入笔数:" prop="fopInRE1011Num">
                    <label>{{showFOPForm.fopInRE1011Num}}</label>
                  </h-form-item>
                  <h-form-item label="转贴现转入金额（元）:" prop="fopInRE1011Amt">
                    <label>{{formatAmt(showFOPForm.fopInRE1011Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="转贴现转出笔数:" prop="fopOutRE1011Num">
                    <label>{{showFOPForm.fopOutRE1011Num}}</label>
                  </h-form-item>
                  <h-form-item label="转贴现转出金额（元）:" prop="fopOutRE1011Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE1011Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购首期笔数:" prop="fopOutRE1021Num">
                    <label>{{showFOPForm.fopOutRE1021Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购首期金额（元）:" prop="fopOutRE1021Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE1021Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购到期笔数:" prop="fopInRE1022Num">
                    <label>{{showFOPForm.fopInRE1022Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购到期金额（元）:" prop="fopInRE1022Amt">
                    <label>{{formatAmt(showFOPForm.fopInRE1022Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购提前赎回笔数:" prop="fopInRE1023Num">
                    <label>{{showFOPForm.fopInRE1023Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购提前赎回金额（元）:" prop="fopInRE1023Amt">
                    <label>{{formatAmt(showFOPForm.fopInRE1023Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购逾期赎回笔数:" prop="fopInRE1024Num">
                    <label>{{showFOPForm.fopInRE1024Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式正回购逾期赎回金额（元）:" prop="fopInRE1024Amt">
                    <label>{{formatAmt(showFOPForm.fopInRE1024Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购首期笔数:" prop="fopInRE1021Num">
                    <label>{{showFOPForm.fopInRE1021Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购首期金额（元）:" prop="fopInRE1021Amt">
                    <label>{{formatAmt(showFOPForm.fopInRE1021Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购到期笔数:" prop="fopOutRE1022Num">
                    <label>{{showFOPForm.fopOutRE1022Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购到期金额（元）:" prop="fopOutRE1022Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE1022Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购提前赎回笔数:" prop="fopOutRE1023Num">
                    <label>{{showFOPForm.fopOutRE1023Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购提前赎回金额（元）:" prop="fopOutRE1023Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE1023Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购逾期赎回笔数:" prop="fopOutRE1024Num">
                    <label>{{showFOPForm.fopOutRE1024Num}}</label>
                  </h-form-item>
                  <h-form-item label="质押式逆回购逾期赎回金额（元）:" prop="fopOutRE1024Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE1024Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="买断式正回购首期笔数:" prop="fopOutRE1031Num">
                    <label>{{showFOPForm.fopOutRE1031Num}}</label>
                  </h-form-item>
                  <h-form-item label="买断式正回购首期金额（元）:" prop="fopOutRE1031Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE1031Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="买断式正回购到期笔数:" prop="fopInRE1032Num">
                    <label>{{showFOPForm.fopInRE1032Num}}</label>
                  </h-form-item>
                  <h-form-item label="买断式正回购到期金额（元）:" prop="fopInRE1032Amt">
                    <label>{{formatAmt(showFOPForm.fopInRE1032Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="买断式逆回购首期笔数:" prop="fopInRE1031Num">
                    <label>{{showFOPForm.fopInRE1031Num}}</label>
                  </h-form-item>
                  <h-form-item label="买断式逆回购首期金额（元）:" prop="fopInRE1031Amt">
                    <label>{{formatAmt(showFOPForm.fopInRE1031Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="买断式逆回购到期笔数:" prop="fopOutRE1032Num">
                    <label>{{showFOPForm.fopOutRE1032Num}}</label>
                  </h-form-item>
                  <h-form-item label="买断式逆回购到期金额（元）:" prop="fopOutRE1032Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE1032Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现买断转出笔数:" prop="fopOutRE3011Num">
                    <label>{{showFOPForm.fopOutRE3011Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现买断转出金额（元）:" prop="fopOutRE3011Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE3011Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购首期笔数:" prop="fopOutRE3021Num">
                    <label>{{showFOPForm.fopOutRE3021Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购首期金额（元）:"  prop="fopOutRE3021Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE3021Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购到期笔数:"  prop="fopOutRE3022Num">
                    <label>{{showFOPForm.fopOutRE3022Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购到期金额（元）:"  prop="fopOutRE3022Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE3022Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购提前赎回笔数:" prop="fopOutRE3023Num">
                    <label>{{showFOPForm.fopOutRE3023Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购提前赎回金额（元）:" class="h-form-long-label" prop="fopOutRE3023Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE3023Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购逾期赎回笔:"  prop="fopOutRE3024Num">
                    <label>{{showFOPForm.fopOutRE3024Num}}</label>
                  </h-form-item>
                  <h-form-item label="再贴现质押式回购逾期赎回金额（元）:" class="h-form-long-label" prop="fopOutRE3024Amt">
                    <label>{{formatAmt(showFOPForm.fopOutRE3024Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="小计笔数:" prop="sumBillNum">
                    <label>{{showFOPForm.sumBillNum}}</label>
                  </h-form-item>
                  <h-form-item label="小计金额（元）:" prop="sumBillAmt">
                    <label>{{formatAmt(showFOPForm.sumBillAmt)}}</label>
                  </h-form-item>
                </div>
              </h-form>
            </h-tab-pane>
            <h-tab-pane label="托收追偿" name="collection">
              <h-form :model="showCollectionForm" :label-width="200" ref="showCollectionForm" cols="2"
                      class="h-form-search">
                <div class="h-search-form-row">
                  <h-form-item label="发出托收笔数:" prop="outRE2011Num">
                    <label>{{showCollectionForm.outRE2011Num}}</label>
                  </h-form-item>
                  <h-form-item label="发出托收金额（元）:" prop="outRE2011Amt">
                    <label>{{formatAmt(showCollectionForm.outRE2011Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="托收付款笔数:" prop="inRE2011Num">
                    <label>{{showCollectionForm.inRE2011Num}}</label>
                  </h-form-item>
                  <h-form-item label="托收付款金额（元）:" prop="inRE2011Amt">
                    <label>{{formatAmt(showCollectionForm.inRE2011Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="发出追索笔数:" prop="outRE2021Num">
                    <label>{{showCollectionForm.outRE2021Num}}</label>
                  </h-form-item>
                  <h-form-item label="发出追索金额（元）:" prop="outRE2021Amt">
                    <label>{{formatAmt(showCollectionForm.outRE2021Amt)}}</label>
                  </h-form-item>
                  <h-form-item label="追索结清笔数:" prop="inRE2021Num">
                    <label>{{showCollectionForm.inRE2021Num}}</label>
                  </h-form-item>
                  <h-form-item label="追索结清金额（元）:" prop="inRE2021Amt">
                    <label>{{formatAmt(showCollectionForm.inRE2021Amt)}}</label>
                  </h-form-item>
                </div>
              </h-form>
            </h-tab-pane>
          </h-tabs>
        </div>
      </h-col>
    </h-row>
    <!--<show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>-->
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "settleSumMain",
    data() {
      let _this = this;
      return {
        formItem: {
          settleDate: window.sessionStorage.getItem("workDate"),
          branchCode: JSON.parse(window.sessionStorage.getItem("userInfo")).cepsBrchCode,
          branchName: JSON.parse(window.sessionStorage.getItem("userInfo")).brchName
        },
        showDVPForm: {
          inRE1011Num: "",
          inRE1011Amt: "",
          outRE1011Num: "",
          outRE1011Amt: "",
          inRE1021Num: "",
          inRE1021Amt: "",
          outRE1021Num: "",
          outRE1021Amt: "",
          inRE1022Num: "",
          inRE1022Amt: "",
          outRE1022Num: "",
          outRE1022Amt: "",
          inRE1031Num: "",
          inRE1031Amt: "",
          outRE1031Num: "",
          outRE1031Amt: "",
          inRE1032Num: "",
          inRE1032Amt: "",
          outRE1032Num: "",
          outRE1032Amt: "",
          outRE3011Num: "",
          outRE3011Amt: "",
          outRE3021Num: "",
          outRE3021Amt: "",
          outRE3022Num: "",
          outRE3022Amt: "",
          outRE3023Num: "",
          outRE3023Amt: "",
          outRE3024Num: "",
          outRE3024Amt: "",
          sumSettleNum: "",
          sumSettleMoney: ""
        },
        showFOPForm: {
          fopInRE1011Num: "",
          fopInRE1011Amt: "",
          fopOutRE1011Num: "",
          fopOutRE1011Amt: "",
          fopInRE1021Num: "",
          fopInRE1021Amt: "",
          fopOutRE1021Num: "",
          fopOutRE1021Amt: "",
          fopInRE1022Num: "",
          fopInRE1022Amt: "",
          fopOutRE1022Num: "",
          fopOutRE1022Amt: "",
          fopInRE1023Num: "",
          fopInRE1023Amt: "",
          fopOutRE1023Num: "",
          fopOutRE1023Amt: "",
          fopInRE1024Num: "",
          fopInRE1024Amt: "",
          fopOutRE1024Num: "",
          fopOutRE1024Amt: "",
          fopInRE1031Num: "",
          fopInRE1031Amt: "",
          fopOutRE1031Num: "",
          fopOutRE1031Amt: "",
          fopInRE1032Num: "",
          fopInRE1032Amt: "",
          fopOutRE1032Num: "",
          fopOutRE1032Amt: "",
          fopOutRE3011Num: "",
          fopOutRE3011Amt: "",
          fopOutRE3021Num: "",
          fopOutRE3021Amt: "",
          fopOutRE3022Num: "",
          fopOutRE3022Amt: "",
          fopOutRE3023Num: "",
          fopOutRE3023Amt: "",
          fopOutRE3024Num: "",
          fopOutRE3024Amt: "",
          sumBillNum: "",
          sumBillAmt: ""
        },
        showCollectionForm: {
          inRE2011Num: "",
          inRE2011Amt: "",
          outRE2011Num: "",
          outRE2011Amt: "",
          inRE2021Num: "",
          inRE2021Amt: "",
          outRE2021Num: "",
          outRE2021Amt: ""
        },
        //showCpesBranch: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        disabledDateOption: {
          disabledDate(date) {
            let workDate = window.sessionStorage.getItem("workDate");
            workDate = _this.$moment(workDate, "YYYY-MM-DD");
            return date > workDate;

          }
        }
      };
    },
    mounted() {
      this.handleSearch();
    },
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    methods: {
      formatAmt(money){
        return formatNumber(money, 2, ',');
      },
      handleSearch() {
        this.unDisabled();
        this.searchTab();
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      searchTab() {
        post(this.formItem, "/shcpe/cpes/settle/settleSumMain/func_findSumSettleInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.createDVPForm(retData);
              this.createFOPForm(retData);
              this.createCollectionForm(retData);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      createDVPForm(data) {
        this.showDVPForm.inRE1011Num = data.inRE1011Num;
        this.showDVPForm.inRE1011Amt = data.inRE1011Amt;
        this.showDVPForm.outRE1011Num = data.outRE1011Num;
        this.showDVPForm.outRE1011Amt = data.outRE1011Amt;
        this.showDVPForm.inRE1021Num = data.inRE1021Num;
        this.showDVPForm.inRE1021Amt = data.inRE1021Amt;
        this.showDVPForm.outRE1021Num = data.outRE1021Num;
        this.showDVPForm.outRE1021Amt = data.outRE1021Amt;
        this.showDVPForm.inRE1022Num = data.inRE1022Num;
        this.showDVPForm.inRE1022Amt = data.inRE1022Amt;
        this.showDVPForm.outRE1022Num = data.outRE1022Num;
        this.showDVPForm.outRE1022Amt = data.outRE1022Amt;
        this.showDVPForm.inRE1031Num = data.inRE1031Num;
        this.showDVPForm.inRE1031Amt = data.inRE1031Amt;
        this.showDVPForm.outRE1031Num = data.outRE1031Num;
        this.showDVPForm.outRE1031Amt = data.outRE1031Amt;
        this.showDVPForm.inRE1032Num = data.inRE1032Num;
        this.showDVPForm.inRE1032Amt = data.inRE1032Amt;
        this.showDVPForm.outRE1032Num = data.outRE1032Num;
        this.showDVPForm.outRE1032Amt = data.outRE1032Amt;
        this.showDVPForm.outRE3011Num = data.outRE3011Num;
        this.showDVPForm.outRE3011Amt = data.outRE3011Amt;
        this.showDVPForm.outRE3021Num = data.outRE3021Num;
        this.showDVPForm.outRE3021Amt = data.outRE3021Amt;
        this.showDVPForm.outRE3022Num = data.outRE3022Num;
        this.showDVPForm.outRE3022Amt = data.outRE3022Amt;
        this.showDVPForm.outRE3023Num = data.outRE3023Num;
        this.showDVPForm.outRE3023Amt = data.outRE3023Amt;
        this.showDVPForm.outRE3024Num = data.outRE3024Num;
        this.showDVPForm.outRE3024Amt = data.outRE3024Amt;
        this.showDVPForm.sumSettleNum = data.sumSettleNum;
        this.showDVPForm.sumSettleMoney = data.sumSettleMoney;
      },
      createFOPForm(data) {
        this.showFOPForm.fopInRE1011Num = data.fopInRE1011Num;
        this.showFOPForm.fopInRE1011Amt = data.fopInRE1011Amt;
        this.showFOPForm.fopOutRE1011Num = data.fopOutRE1011Num;
        this.showFOPForm.fopOutRE1011Amt = data.fopOutRE1011Amt;
        this.showFOPForm.fopInRE1021Num = data.fopInRE1021Num;
        this.showFOPForm.fopInRE1021Amt = data.fopInRE1021Amt;
        this.showFOPForm.fopOutRE1021Num = data.fopOutRE1021Num;
        this.showFOPForm.fopOutRE1021Amt = data.fopOutRE1021Amt;
        this.showFOPForm.fopInRE1022Num = data.fopInRE1022Num;
        this.showFOPForm.fopInRE1022Amt = data.fopInRE1022Amt;
        this.showFOPForm.fopOutRE1022Num = data.fopOutRE1022Num;
        this.showFOPForm.fopOutRE1022Amt = data.fopOutRE1022Amt;
        this.showFOPForm.fopInRE1023Num = data.fopInRE1023Num;
        this.showFOPForm.fopInRE1023Amt = data.fopInRE1023Amt;
        this.showFOPForm.fopOutRE1023Num = data.fopOutRE1023Num;
        this.showFOPForm.fopOutRE1023Amt = data.fopOutRE1023Amt;
        this.showFOPForm.fopInRE1024Num = data.fopInRE1024Num;
        this.showFOPForm.fopInRE1024Amt = data.fopInRE1024Amt;
        this.showFOPForm.fopOutRE1024Num = data.fopOutRE1024Num;
        this.showFOPForm.fopOutRE1024Amt = data.fopOutRE1024Amt;
        this.showFOPForm.fopInRE1031Num = data.fopInRE1031Num;
        this.showFOPForm.fopInRE1031Amt = data.fopInRE1031Amt;
        this.showFOPForm.fopOutRE1031Num = data.fopOutRE1031Num;
        this.showFOPForm.fopOutRE1031Amt = data.fopOutRE1031Amt;
        this.showFOPForm.fopInRE1032Num = data.fopInRE1032Num;
        this.showFOPForm.fopInRE1032Amt = data.fopInRE1032Amt;
        this.showFOPForm.fopOutRE1032Num = data.fopOutRE1032Num;
        this.showFOPForm.fopOutRE1032Amt = data.fopOutRE1032Amt;
        this.showFOPForm.fopOutRE3011Num = data.fopOutRE3011Num;
        this.showFOPForm.fopOutRE3011Amt = data.fopOutRE3011Amt;
        this.showFOPForm.fopOutRE3021Num = data.fopOutRE3021Num;
        this.showFOPForm.fopOutRE3021Amt = data.fopOutRE3021Amt;
        this.showFOPForm.fopOutRE3022Num = data.fopOutRE3022Num;
        this.showFOPForm.fopOutRE3022Amt = data.fopOutRE3022Amt;
        this.showFOPForm.fopOutRE3023Num = data.fopOutRE3023Num;
        this.showFOPForm.fopOutRE3023Amt = data.fopOutRE3023Amt;
        this.showFOPForm.fopOutRE3024Num = data.fopOutRE3024Num;
        this.showFOPForm.fopOutRE3024Amt = data.fopOutRE3024Amt;
        this.showFOPForm.sumBillNum = data.sumBillNum;
        this.showFOPForm.sumBillAmt = data.sumBillAmt;
      },
      createCollectionForm(data) {
        this.showCollectionForm.inRE2011Num = data.inRE2011Num;
        this.showCollectionForm.inRE2011Amt = data.inRE2011Amt;
        this.showCollectionForm.outRE2011Num = data.outRE2011Num;
        this.showCollectionForm.outRE2011Amt = data.outRE2011Amt;
        this.showCollectionForm.inRE2021Num = data.inRE2021Num;
        this.showCollectionForm.inRE2021Amt = data.inRE2021Amt;
        this.showCollectionForm.outRE2021Num = data.outRE2021Num;
        this.showCollectionForm.outRE2021Amt = data.outRE2021Amt;
      }
      /*queryBranchCode() {
        this.showCpesBranch = true;
      },*/
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.branchCode = info.brchCode;
        this.formItem.branchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/
      /*clearBranchVal() {
        this.formItem.branchCode = "";
        this.formItem.branchName = "";
      }*/
    }
  };
</script>

<style scoped>

</style>
