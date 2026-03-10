<!--保证增信申请查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" placeholder=" ">
                  <h-select v-model="formItem.billType" placeholder=" ">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.ecdsBillStatus')" prop="billStatus" placeholder=" ">
                  <h-select v-model="formItem.billStatus" :label-width="90" placeholder=" ">
                    <h-option v-for="item in billStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo" placeholder=" " :maxlength="30"></h-input>
                </h-form-item>
                <show-cpes-branch v-model="formItem.guarntrTrustBrchCode" :label="$t('m.i.billInfo.guarntrTrustBankName')"  class="h-form-long-label"  prop="guarntrTrustBankName"
                                  :brchCode.sync="formItem.guarntrTrustBrchCode"  :cpesBrchName.sync="formItem.guarntrTrustBankName"
                                  datagridUrl="/cpes/branch/queryBranchList"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <bill-money :formItem="formItem"></bill-money>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="dueDt" format="yyyy-MM-dd" type="daterange" autoPlacement showFormat
                                 :editable=false
                                 @on-change="handleDueDtChange" placeholder=" "></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/be/barter/guarntrtrust/guarntrTrustAppl/func_queryPendingApplyBill"
            :bindForm="formItem"
            :hasSelect="hasSelect"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" :disabled="hasCommitDisabled"
                        v-if="authObj.bizSetRoleAdd">{{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="agreeClick()" :disabled="hasCommitDisabled" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" :disabled="hasCommitDisabled"
                        v-if="authObj.bizSetRoleDelete">{{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="applyComfirm()" :disabled="noCommitDisabled"
                        v-if="authObj.bizSetRoleDelete">{{$t("m.i.be.apply")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer" @on-close="handleWinClose"
               :maximize="true" @on-maximize="onMaximize" ref="addOrEditWinRef">
      <p slot="header">
        <span>保证增信申请挑票</span>
      </p>
      <div>
        <div class="text-wrap mb-10">
          <h-form :model="addForm" :label-width="80" ref="addForm" cols="4" class="h-form-search">
         <!--   <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" v-show="this.licenseFlag"
                         class="h-form-long-label" :required="this.licenseFlag === true? true : false">
              <h-input v-model="addForm.ownedBrchName" :icon="this.type==='add' ? 'android-search' : ''"
                       @on-click="brchNoWinOpen1"
                       readonly clearable @on-clear="clearVal1('license')" :title="addForm.ownedBrchName"></h-input>
            </h-form-item>-->
            <show-branch v-model="addForm.ownedBrchName"  :label="$t('m.i.common.ownedBrchNo')"  :required="this.licenseFlag === true? true : false"  prop="ownedBrchName"  class="h-form-long-label"
                         v-if="this.licenseFlag"    :showCheckBox="false"    :msgBoxWin="addOrEditWin"   @brchNoChange="licenseBrchNoChange($event)" :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName"
                         :params="{authPath:this.$route.path}" :filterable="this.type==='add'"
                         url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                         queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
            </show-branch>


           <!-- <h-form-item :label="$t('m.i.billInfo.guarntrTrustBankName')" prop="guarntrTrustBankName" required
                         class="h-form-long-label">
              <h-input v-model="addForm.guarntrTrustBankName" placeholder=" " readonly
                       icon="android-search" @on-click="queryCpesBrchCode('add')"></h-input>
            </h-form-item>-->
            <show-cpes-branch v-model="addForm.guarntrTrustBrchCode" :label="$t('m.i.billInfo.guarntrTrustBankName')"     required    class="h-form-long-label"  prop="guarntrTrustBankName"
                              :brchCode.sync="addForm.guarntrTrustBrchCode"  :cpesBrchName.sync="addForm.guarntrTrustBankName"      isInitValueClearable
                              datagridUrl="/cpes/branch/queryBranchList" :msgBoxWin="addOrEditWin"
                              queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
            <h-form-item :label="$t('m.i.common.remark')" prop="reqRemark">
              <h-input v-model="addForm.reqRemark" placeholder="" :maxlength=150 :lengthByByte="false"></h-input>
            </h-form-item>
          </h-form>
        </div>
        <hr/>
        <h-panel class="clearfix">
          <h-form :model="addSerchFrom" :label-width="80" ref="addSerchFrom" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
              <h-input v-model="addSerchFrom.likeBillNo" placeholder=" " :maxlength="60"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
              <h-select v-model="addSerchFrom.billType" placeholder=" ">
                <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="formAddSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="formAddSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>

        </h-panel>
      </div>
      <h-datagrid
        :columns="test.billColumns"
        highlight-row
        url="/be/barter/guarntrtrust/guarntrTrustAppl/func_queryPendingEnhancingTrustApply"
        :bindForm="addSerchFrom"
        :paramId="'stockHldrId'"
        :row-select="true"
        :has-select="hasBillSelect"
        ref="datagridbill">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="closeAddOrEditSubmit('close')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="closeAddOrEditSubmit('submit')">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>


    <!--编辑弹出框 -->
    <h-msg-box v-model="editWin" width="600" @on-close="editWinClose" class="h-form-table-layer"
               :maximize="true" ref="addOrEditWinRef">
      <p slot="header">
        <span>保证增信申请修改</span>
      </p>
      <h-panel>
        <h-form :model="editFrom" :label-width="90" ref="editFrom" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" v-show="this.licenseFlag">
            <h-input v-model="editFrom.ownedBrchName" readonly placeholder=" "
                     :title="editFrom.ownedBrchName"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
            <h-select v-model="editFrom.billType" placeholder=" " :readonly=true>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
            <h-input v-model="editFrom.billNo" :readonly=true placeholder=" "></h-input>
          </h-form-item>
          <common-type-field v-model="editFrom.billMoney" :label="$t('m.i.billInfo.billMoney')" prop="billMoney"
                             :readonly=true placeholder=" "></common-type-field>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt" class="h-form-long-label">
            <h-date-picker type="date" v-model="editFrom.applDt" :readonly=true :showFormat="true"
                           placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt" class="h-form-long-label">
            <h-date-picker type="date" v-model="editFrom.dueDt" :readonly=true :showFormat="true"
                           placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptBankNo')" prop="acptBankNo" class="h-form-long-label">
            <h-input v-model="editFrom.acptBankNo" :readonly=true placeholder=" "></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.discBankName')" prop="discBankName">
            <h-input v-model="editFrom.discBankName" :readonly=true placeholder=" "></h-input>
          </h-form-item>
<!--          <h-form-item :label="$t('m.i.billInfo.guarntrTrustBankName')" prop="guarntrTrustBankName"
                       class="h-form-long-label">
            <h-input v-model="editFrom.guarntrTrustBankName" placeholder=" " readonly
                     icon="android-search" @on-click="queryCpesBrchCode('edit')"></h-input>
          </h-form-item>-->
          <show-cpes-branch v-model="editFrom.guarntrTrustBrchCode" :label="$t('m.i.billInfo.guarntrTrustBankName')"     required class="h-form-long-label"  prop="guarntrTrustBankName"
                            :brchCode.sync="editFrom.guarntrTrustBrchCode"  :cpesBrchName.sync="editFrom.guarntrTrustBankName"
                            datagridUrl="/cpes/branch/queryBranchList" :msgBoxWin="editWin"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
          <h-form-item :label="$t('m.i.be.reqRemark')" prop="reqRemark">
            <h-input v-model="editFrom.reqRemark" placeholder="" :maxlength=150 :lengthByByte="false"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="agreeClickSubmit('close')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="agreeClickSubmit('submit')">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>
    <show-license-branch :showBranchWin="brchNoWin1" title="机构查询" @brchNoChange="licenseBrchNoChange"
                         :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose1" :ifcheck="false"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "guarntrTrustAppl",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
     // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
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
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            type: "money",
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.ecdsBillStatus"),
            key: "billStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.billStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.ownershipBrchName"),
            key: "ownershipBrchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "guarntrTrustBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.stockName"),
            key: "stockName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.reqRemark"),
            key: "reqRemark",
            hiddenCol: false,
            sortable: true
          }
        ],
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        billTypeList: [],
        billStatusList: [],
        cdMediaList: [],
        dictMap: null,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        uploadFileName: "",
        fileId: "",
        uploadWin: false,
        dueDt: [],
        formItem: {
          billType: "",
          billStatus: "",
          billNo: "",
          likeBillNo: "",
          guarntrTrustBrchCode: "",
          guarntrTrustBankName: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames: "",
          ownedBrchNos: "",
          licenseFlag: false,
          authPath: this.$route.path
        },
        addForm: {
          id: "",
          stockHldrId: "",
          billNo: "",
          billType: "",
          likeBillNo: "",
          guarntrTrustBrchCode: "",
          guarntrTrustBankName: "",
          reqRemark: "",

          memberId: "",
          transBrchNo: "",
          brchName: "",
          applBrchCode: "",
          billClass: "",
          busiBatchNo: "",
          transCtrctNo: "",
          trDir: "",
          custNo: "",
          custName: "",
          custBrchNo: "",
          custBrchCode: "",
          custBankNo: "",
          applDt: "",
          prodNo: "",
          acctTellerNo: "",
          checkTellerNo: "",
          applTellerName: "",
          checkTellerName: "",
          totalAmt: "",
          totalNum: "",
          createTime: "",
          updateTime: "",
          ownedBrchName: this.$store.getters.userInfo.brchName,
          ownedBrchNo: this.$store.getters.userInfo.brchNo,
          licenseFlag: false,
          ownedBrchNames: "",
          ownedBrchNos: "",
          authPath: this.$route.path
        },
        type: null,
        billId: null,
        showBillInfoWin: false,
        readonly: false,
        isRequired: true,
        hasCommitDisabled: false,
        noCommitDisabled: false,
        tableRef: "selfTable",
        submitFlag: false,
        copyWin: false,
        ifShowMore: false,
        showOptHistWin: false,
        custMgrNoWinOpen: false,
        //brchCodeWin: false,
        pickBillWin: false,
        id: "",
        batchIds: "",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        queryMemberId: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        //brchNoWin1: false,
        test: {
          billColumns: [
            {
              type: "selection",
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
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
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
              title: this.$t("m.i.billInfo.billMoney"),
              key: "billMoney",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                return h("span", formatNumber(params.row.billMoney, 2, ","));
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: "dueDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dueDt);
              }
            },
            {
              title: this.$t("m.i.billInfo.acptBankNo"),
              key: "acptBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptBankName"),
              key: "acptBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.discBankName"),
              key: "discBankName",
              hiddenCol: false,
              sortable: true
            }
          ],
          billId: null,
          showBillInfoWin: false
        },
        //新增
        editFrom: {
          id: "",
          billType: "",
          billNo: "",
          billMoney: "",
          applDt: "",
          dueDt: "",
          acptBankNo: "",
          discBankName: "",
          guarntrTrustBrchCode: "",
          guarntrTrustBankName: "",
          reqRemark: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames: "",
          ownedBrchNos: "",
          authPath: this.$route.path
        },
        addSerchFrom: {
          id: "",
          billType: "",
          billNo: "",
          licenseFlag: false,
          ownedBrchName: "",
          ownedBrchNo: "",
          likeBillNo: ""
        },
        pickForm: {
          guarntrTrustBrchCode: "",
          reqRemark: "",
          //票面信息
          list: []
        },
        editWin: false,
        hasSelect: false,
        hasBillSelect: false,
      };
    },

    watch: {},
    computed: {},
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagridbill.$refs.gridContent.handleResize();
        }, 100);
      },
/*      clearVal(type) {
        if (type == "move") {
          this.formItem.guarntrTrustBrchCode = "";
          this.formItem.guarntrTrustBankName = "";
        }

      },*/

      /**
       *修改弹出框
       * **/
      agreeClick() {
        if (this.$refs.datagrid.selects.length === 1) {
          let id = this.$refs.datagrid.selects[0].id;
          post({ id: id }, "/be/barter/guarntrtrust/guarntrTrustAppl/func_editEnhancingtrustApply").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.editFrom.billType = res.data.retData.billType;
                this.editFrom.id = res.data.retData.id;
                this.editFrom.billNo = res.data.retData.billNo;
                this.editFrom.billMoney = formatNumber(res.data.retData.billMoney, 2, ",");
                if (res.data.retData.applDt) {
                  this.editFrom.applDt = this.$moment(res.data.retData.applDt, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                  this.editFrom.applDt = null;
                }
                if (res.data.retData.dueDt) {
                  this.editFrom.dueDt = this.$moment(res.data.retData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                  this.editFrom.dueDt = null;
                }
                this.editFrom.acptBankNo = res.data.retData.acptBankNo;
                this.editFrom.discBankName = res.data.retData.discBankName;
                this.editFrom.guarntrTrustBrchCode = res.data.retData.guarntrTrustBrchCode;
                this.editFrom.guarntrTrustBankName = res.data.retData.guarntrTrustBankName;
                this.editFrom.reqRemark = res.data.retData.reqRemark;
                this.editFrom.ownedBrchNo = res.data.retData.applBrchNo;
                this.editFrom.ownedBrchName = res.data.retData.applBrchName;
                this.editWin = true;
              } else {
                this.$msgTip.error(this, { info: msg });
                this.refreshDatagrid();
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },

      //刷新明细展示页面
      refreshDatagrid() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },

      /**
       * 修改提交
       * */
      agreeClickSubmit(str) {
        if ("close" == str) {
          this.editWin = false;
          this.editWinClose();
        } else if ("submit" == str) {
          this.editFrom.applDt = this.$moment(this.editFrom.applDt).format("YYYYMMDD");
          this.editFrom.dueDt = this.$moment(this.editFrom.dueDt).format("YYYYMMDD");
          let url = "/be/barter/guarntrtrust/guarntrTrustAppl/func_updateEnhancingtrustApply";
          let pageNo = this.addOrEditType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
          post(this.editFrom, url).then(res => {
            if (res) {
              let return_code = res.data.retCode;
              if (return_code === "000000") {
                this.$msgTip.success(this);
                this.$refs.datagrid.dataChange(pageNo);
                /**清除多页选择的数据*/
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
                this.editWin = false;
                this.editWinClose();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
                this.$refs.datagrid.dataChange(pageNo);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },

      editWinClose() {
        this.$refs.editFrom.resetFields();
      },

      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.schemeId = "";
        this.addForm.schemeName = "";
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.$refs.datagridbill.dataChange(1);
        });
      },

      /**
       * 挑票提交保存
       * */
      closeAddOrEditSubmit(str) {
        if ("close" == str) {
          this.formAddSearchReset();
          this.closeAddOrEditWin();
        } else if ("submit" == str) {
          let list = this.$refs.datagridbill.selects;
          if (list != null && list.length > 0) {
            let url = "/be/barter/guarntrtrust/guarntrTrustAppl/func_submitEnhancingtrustApply";
            let ids = "";
            let stockIds = "";
            for (let i = 0, count = list.length; i < count; i++) {
              ids += list[i].billId;
              stockIds += list[i].stockHldrId;
              if (i < list.length - 1) {
                ids += ",";
                stockIds += ",";
              }
            }
            this.$refs["addForm"].validate(valid => {
              if (valid) {
                post({
                  billIdList: ids,
                  stockIdList: stockIds,
                  guarntrTrustBankName: this.addForm.guarntrTrustBankName,
                  guarntrTrustBrchCode: this.addForm.guarntrTrustBrchCode,
                  reqRemark: this.addForm.reqRemark,
                  licenseFlag: this.licenseFlag,
                  ownedBrchNo: this.addForm.ownedBrchNo,
                  ownedBrchName: this.addForm.ownedBrchName
                }, url).then(res => {
                  if (res) {
                    let retCode = res.data.retCode;
                    let msg = res.data.retMsg;
                    if (retCode == "000000") {
                      this.$msgTip.success(this);
                      this.formAddSearchReset();
                      this.closeAddOrEditWin();
                      this.$refs.datagrid.dataChange(1);
                    } else {
                      this.$msgTip.error(this, { info: msg });
                    }
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                  }
                });
              }
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        }
      },


      noCommitButton() {
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
      },

      hasCommitButton() {
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
      },

      formSearch() {
        this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
        this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },

      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.formItem.guarntrTrustBrchCode = "";
        this.hasCommitDisabled = false;
        this.noCommitDisabled = false;
        this.dueDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
      },

      formAddSearch(ownedBrchNo, licenseFlag) {
        if (ownedBrchNo && licenseFlag) {
          this.addSerchFrom.ownedBrchNo = ownedBrchNo;
          this.addSerchFrom.licenseFlag = licenseFlag;
        }
        this.$refs.datagridbill.selects = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.dataChange(1);
      },

      formAddSearchReset() {
        this.$refs.addSerchFrom.resetFields();
        this.hasCommitDisabled = false;
        this.noCommitDisabled = false;
      },

      //删除按钮
      handleComfirm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },

      handledel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ idList: ids }, "be/barter/guarntrtrust/guarntrTrustAppl/func_deleteEnhancingTrust").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let msg = res.data.retMsg;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //申请按钮
      applyComfirm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("确定要提交申请") + "?",
            onOk: () => {
              this.apply();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },

      /**申请具体操作**/
      apply() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ idList: ids }, "be/barter/guarntrtrust/guarntrTrustAppl/func_sendEnhancingTrust").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let msg = res.data.retMsg;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

     /* brchCodeWinOpen() {
        this.brchCodeWin = true;
      },

      brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/

      pickBillWinOpen() {
        this.pickBillWin = true;
      },
      pickBillWinClose() {
        this.pickBillWin = false;
      },

     /* //票交机构弹出框
      queryCpesBrchCode(str) {
        this.brchType = str;
        this.brchCodeWin = true;
      },*/

      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        if (this.brchType === "ownership") {
          this.formItem.ownershipBrchCode = info.brchCode;
          this.formItem.ownershipBrchName = info.brchFullNameZh;
        }
        if (this.brchType === "move") {
          this.formItem.guarntrTrustBrchCode = info.brchCode;
          this.formItem.guarntrTrustBankName = info.brchFullNameZh;
        }
        if (this.brchType === "add") {
          this.addForm.guarntrTrustBrchCode = info.brchCode;
          this.addForm.guarntrTrustBankName = info.brchFullNameZh;
        }
        if (this.brchType === "edit") {
          this.editFrom.guarntrTrustBrchCode = info.brchCode;
          this.editFrom.guarntrTrustBankName = info.brchFullNameZh;
        }
        this.brchCodeWin = false;
      },*/

      handleWinClose() {
        this.formAddSearchReset();
        this.$refs.addForm.resetFields();
        this.addForm.guarntrTrustBrchCode = "";
        this.addForm.guarntrTrustBankName = "";
        this.$refs.datagridbill.selects = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },

      closeAddOrEditWin() {
        this.$refs.datagridbill.selects = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.addForm.resetFields();
        this.addForm.guarntrTrustBrchCode = "";
        this.addForm.guarntrTrustBankName = "";
        this.addOrEditWin = false;
      },

      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },

     /* //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },

      brchNoWinOpen() {
        this.brchNoWin = true;
      },

      brchNoWinClose() {
        this.brchNoWin = false;
      },*/

      licenseBrchNoChange(info) {
         if(info.length>0){
             this.formAddSearch(this.addForm.ownedBrchNo, this.licenseFlag);
         }
      },

 /*     //根据弹框所选数据进行赋值
      brchNoWinOpen1() {
        this.brchNoWin1 = true;
      },

      brchNoWinClose1() {
        this.brchNoWin1 = false;
      },*/

      handleDueDtChange(arr) {
        if (arr && arr.length == 2) {
          this.dueDt = [arr[0], arr[1]];
          this.formItem.minDueDt = arr[0].toString().replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].toString().replace(/-/g, "");
        } else {
          this.dueDt = [];
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
        }
      }
    },


    mounted() {
      this.getDictListByGroups("DraftTypeCode,BarterTrustStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billStatusList = res.get("BarterTrustStatus");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
