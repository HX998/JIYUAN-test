<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.batchStatus')">
                  <h-radio-group v-model="formItem.batchStatus">
                    <h-radio label="1" @on-click="noIssueButton">未提交</h-radio>
                    <h-radio label="2" @on-click="hasIssueButton">已提交</h-radio>
                  </h-radio-group>
                </h-form-item>
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
                  <h-input v-model="formItem.busiBatchNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
                  <h-input v-model="formItem.buyBrchName" :title="formItem.buyBrchName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select  v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select  v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.applDt')" prop="applDtStr">
                  <h-date-picker :value="applDt" format="yyyy-MM-dd" type="daterange" placeholder=""
                                 showFormat :editable=false @on-change="handleApplDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
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
            hasPage
            url="/be/trust/transfer/transferSaleApplyMain/func_queryTransferSaleTrack"
            :bindForm="formItem"
            :hasSelect=false
            :rowSelect=true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="opernForm('add')" :disabled="hasCommitDisabled">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="opernForm('modify')" :disabled="hasCommitDisabled">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" :disabled="hasCommitDisabled">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="rollbackComfirm()" :disabled="noCommitDisabled">{{$t('m.i.be.cacelAppl')}}</h-button>
              <h-button type="primary" @click="opernForm('view')">{{$t('m.i.be.billDetail')}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')">{{$t('m.i.common.exportExcel')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改/票据明细弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增转让申请</span>
        <span v-if="type=='modify'">修改转让申请</span>
        <span v-if="type=='view'">票据明细</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.batchNo')" prop="busiBatchNo">
            <h-input v-if="type=='view'" :value="addForm.busiBatchNo"  readonly></h-input>
            <h-input v-else v-model="addForm.busiBatchNo" :maxlength=60 readonly></h-input>
          </h-form-item>
          <show-branch v-model="addForm.saleBrchName"  :label="$t('m.i.be.brchName')" prop="saleBrchName"       :required="isRequired"
                       :filterable="type=='add' && this.licenseFlag===true"     :showCheckBox="false"   :msgBoxWin="addOrEditWin"  @brchNoChange="licenseBrchNoChange($event)"    :brchNo.sync="addForm.transBrchNo" :brchName.sync="addForm.saleBrchName"
                       :params="{authPath:this.$route.path}"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                       queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>

          <show-cpes-branch  :label="$t('m.i.be.otherBrchName')"  :required="isRequired"
                             :brchCode.sync="addForm.buyBrchCode"  :cpesBrchName.sync="addForm.buyBrchName"
                             :msgBoxWin="addOrEditWin"  :clearable="false" :filterable="type!=='view'"
                             datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                             queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.be.custBrchCode')" prop="buyBrchCode">
            <h-input v-if="type=='view'" :value="addForm.buyBrchCode"  readonly></h-input>
            <h-input v-else v-model="addForm.buyBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt" :required="isRequired">
            <h-date-picker v-if="type=='view'" :value="addForm.applDt" type="date" readonly
                           placeholder=""></h-date-picker>
            <h-date-picker v-else v-model="addForm.applDt" :maxlength=60 type="date" placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.billType" readonly placeholder="">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billType" placeholder="" :readonly="readonly">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.billClass" readonly placeholder="">
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billClass" placeholder="" :readonly="readonly">
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.transferReason')" prop="transferReason" :required="isRequired" :validRules="validRules">
            <h-input v-if="type=='view'" :value="addForm.transferReason"  readonly></h-input>
            <h-input v-else v-model="addForm.transferReason" :maxlength=300></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="reqRemark" class="h-form-height-auto" :validRules="validRules">
            <h-input type="textarea" :autosize="{minRows: 2,maxRows: 4}" v-if="type=='view'" :value="addForm.reqRemark"  readonly></h-input>
            <h-input type="textarea" :autosize="{minRows: 2,maxRows: 4}" v-else v-model="addForm.reqRemark" :maxlength=300></h-input>
          </h-form-item>
          <h-form-item>
            <h-button type="primary" style="" v-model="addFormConfim" @click="addFormSave()"
                      v-if="authObj.bizSetRoleAdd">{{$t("m.i.common.save")}}
            </h-button>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid
        :columns="billColumns"
        :bindForm="billItem"
        :hasSelect=false
        :rowSelect=true
        :gridData="billList"
        @on-page-change="handleBillPage"
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" v-if="authObj.bizSetRoleAdd" @click="pickBillWinOpen">{{$t('m.i.common.pickBill')}}</h-button>
          <h-button type="primary" v-if="authObj.bizSetRoleAdd" @click="deleteBillBtn">{{$t('m.i.common.delete')}}</h-button>
          <!--<h-button type="primary" v-if="authObj.bizSetRoleORight" @click="imgWinOpen">{{$t('m.i.common.image')}}</h-button>-->
          <h-dropdown trigger="click" @on-click="submitBatch" v-if="authObj.bizSetRoleAdd">
            <h-button type="primary">{{$t('m.i.be.submission')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectSubmit">选择提交</h-dropdown-item>
              <h-dropdown-item name="listSubmit">批次提交</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="primary" @click="tempShowExcelTemplateWinOpen('billDetail')" v-if="authObj.bizSetRoleAdd">{{$t('m.i.common.exportExcel')}}</h-button>
          <!--<h-button type="primary"  v-if="authObj.bizSetRoleAdd" @click="updateBillBtn">{{$t('m.i.be.editRemark')}}</h-button>-->
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
      </div>
    </h-msg-box>

    <!--影像弹出框-->
    <image-loading
      :imageWin="imageWin"
      :imageParams="imageParams"
      :isReadonly="true"
      :showImgPlat="true"
      @imageWinClose="imageWinClose"></image-loading>

    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->

    <pick-bill :pickBillWin="pickBillWin" @pickBillWinClose="pickBillWinClose"
               @pickBillChange="pickBillChange" :billType="addForm.billType" :billClass="addForm.billClass"
               :ownedBrchNo="addForm.ownedBrchNo" :licenseFlag="this.licenseFlag"
               :hiddenBillOriginSelect="this.hiddenBillOriginSelect"></pick-bill>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
<!--
    <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->
<!--    <show-license-branch :showBranchWin="brchNoWin1" title="机构查询" @brchNoChange="licenseBrchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose1" :ifcheck="false"
                         :checkStrictly="true"></show-license-branch>-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"
                    :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferSaleApplyMain",
    components: {
      //BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      PickBill: () => import(/* webpackChunkName: "be/trust/transfer/transferSalePickBill" */`@/views/bizViews/be/trust/transfer/transferSalePickBill`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

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
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "busiBatchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillList(params.row);
                  }
                }
              }, params.row.busiBatchNo);
            }
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", applDt);
            }
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.totalCount'),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.sumMoney'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.transferReason'),
            key: "transferReason",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "reqRemark",
            hiddenCol: false
          }
        ],
        billColumns: [
          {
            type: "selection",
            key: "selection",
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
            title: this.$t("m.i.common.image"),
            key: "viewImage",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.imgWinOpen(params.row);
                    }
                  }
                }, this.$t("m.i.common.showImg"))
              ]);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "deleteFlag",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.deleteFlag === "0" ? "正常" : "异常");
            }
          },
          {
            title: this.$t('m.i.be.transferStatus'),
            key: "transferStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TransferSaleBillStatus", params.row.transferStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart, params.row.billRangeEnd)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
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
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBrchCode'),
            key: "cfmAppBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dsctGrntBrCode'),
            key: "discGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        applDt:[],
        billItem: {
          id: "",
          busiBatchId: "",
          hldrIdsStr: "",
          billIdsStr: ""
        },
        formItem: {
          billNo: "",
          billType: "",
          billClass: "",
          busiBatchNo: "",
          buyBrchName: "",
          saleBrchName: "",
          buyBrchCode: "",
          applDt: "",
          transferReason: "",
          reqRemark: "",
          respRemark: "",
          batchStatus: "1",
          applDtStr: "",
          minApplDt: "",
          maxApplDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
        },
        addForm: {
          id: "",
          legalNo: "",
          memberId: "",
          isCommit: "",
          buyBrchName: "",
          saleBrchName: "",
          buyBrchCode: "",
          transferReason: "",
          reqRemark: "",
          transBrchNo: "",
          brchName: "",
          applBrchCode: "",
          busiBatchNo: "",
          transCtrctNo: "",
          custNo: "",
          custName: "",
          custBrchNo: "",
          custBrchCode: "",
          custBankNo: "",
          applDt: "",
          createTime: "",
          updateTime: "",
          billNo: "",
          billClass: "",
          billType: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          drwrName: "",
          acptName: "",
          billIdsStr: "",
          hldrIdsStr: "",
          billIds: "",
          busiBatchId: "",
          batchStatus: "",
          respRemark: "",
          ownedBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchName:this.$store.getters.userInfo.brchName,
          licenseFlag:false,
        },
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
        imageParams: {
          busiBatchId: "",
          listId: "",
          imgTypeList:[],
          imgType: "IM11",
          imgBusiType: "transfersaleFile",
          imageUrl:"/be/trust/transfer/func_queryTransferSaleImagePage", //查询可查看影像url
          imageUploadUrl:"/be/trust/transfer/func_addTransferSaleImage", //影像上传url
          imageRegisterUrl:"/be/trust/transfer/func_uploadTransferSaleImage", //影像登记url
          imageDeleteUrl:"/be/trust/transfer/func_deleteTransferSaleImage", //影像删除url
          imgShowUrl:"/be/trust/transfer/transferSaleImage/func_showImg?id=", //查看影像url
          busiType:"RI11",
          billRangeStart: "",
          billRangeEnd: "",
          billNo:""
        },
        currentSelectBillList: [],
        billTypeList: [],
        cdMediaList: [],
        billClassList: [],
        transferStatusList: [],
        validRules: [{ test: this.validNote, trigger: "blur,change" }],
        dictMap: null,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        type: null,
        readonly: false,
        isRequired: true,
        hasCommitDisabled: false,
        noCommitDisabled: true,
        imageWin: false,
        importWin: false,
        ifShowMore: false,
        //brchCodeWin: false,
        pickBillWin: false,
        hiddenBillOriginSelect: true,
        currentSelectRow: [],
        currentSelectList: [],
        addFormConfim: false,
        selectExportType: "",
        param: null,
        rows: null,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
       // brchNoWin1:false,
        tempShowExcelTemplateWin: false,
        id: "",
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        busiBatchId: null,
        showBillInfoWin:false,
        billId:"",
        billRangeStart:"",
        billRangeEnd:"",
        billNo:"",
        operType:"",
        tempList:null
      };
    },
    watch:{
      addOrEditWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.addFormReset();
            if (this.operType === "modify") {
              this.readonly = true;
              this.addForm.busiBatchId = this.tempList.id;//业务批次id
              this.currentSelectRow = this.tempList;
              this.addForm.id = this.tempList.id;
              this.addForm.billType = this.tempList.billType;
              this.addForm.billClass = this.tempList.billClass;
              this.addForm.busiBatchNo = this.tempList.busiBatchNo;
              this.addForm.buyBrchName = this.tempList.buyBrchName;
              this.addForm.saleBrchName = this.tempList.saleBrchName;
              this.addForm.buyBrchCode = this.tempList.buyBrchCode;
              this.addForm.transferReason = this.tempList.transferReason;
              this.addForm.reqRemark = this.tempList.reqRemark;
              if (this.tempList.applDt) {
                this.addForm.applDt = this.$moment(this.tempList.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              } else {
                this.addForm.applDt = this.tempList.applDt;
              }
              if (this.formItem.batchStatus === "2") {
                let obj = Object.assign({}, this.billItem, {busiBatchId: this.tempList.id});
                this.queryApprovalObjById(obj);
                this.authObj.bizSetRoleAdd = false;
              } else {
                let obj = Object.assign({}, this.billItem, {busiBatchId: this.tempList.id});
                this.queryInitialObjById(obj);
                this.authObj.bizSetRoleAdd = true;
              }
              this.isRequired = false;
              this.readonly = true;
              this.selectionHiddenCol();
            }
            if(this.type === "modify" || this.type === "view" || this.type === "add"){
              this.handleAddForm();
            }
          });
        }
      },
    },
    methods: {
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.billRangeStart=null;
        this.billRangeEnd=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,billRangeStart,billRangeEnd){
        this.billId=billId;
        this.billNo=billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin=true;
      },
      /* 保存批次 */
      addFormSave() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定要保存批次吗？",
          onOk: () => {
            this.addFormConfim = true;
            this.addFormSave1();
          }
        });
      },
      addFormSave1(str) {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let btnType = this.type;
            let msg = this.$t("m.i.common.saveSuccess");
            let url = "/be/trust/transfer/transferSaleApplyMain/func_submitAddTransferSaleApply";
            this.addForm.applDt = this.$moment(this.addForm.applDt).format("YYYYMMDD");
            let addBoolen=this.addForm.id&&this.addForm.id!=="";
            post(this.addForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.addForm.busiBatchId = res.data.retData.id;
                  this.addForm.id = res.data.retData.id;
                  this.addForm.busiBatchNo = res.data.retData.busiBatchNo;
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.readonly = true;
                  if(str != '1'){
                    if (str != '2') {
                      this.$msgTip.success(this, { info: msg });
                    }
                  }else{
                    this.pickBillWin = true;
                    if (res.data.retData.billClass === 'ME01') {
                      this.hiddenBillOriginSelect = true;
                    }
                    else {
                      this.hiddenBillOriginSelect = false;
                    }
                  }
                }else{
                  if(!addBoolen){
                    this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed")+"，" + res.data.retMsg });
                  }else{
                    this.$msgTip.error(this, { info: this.$t("m.i.common.modifyFailed")+"，" + res.data.retMsg });
                  }
                  this.$refs.datagrid.dataChange(1)
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //新增/修改
      opernForm(str) {
        this.addOrEditWin = true;
        this.type = str;
      },
      handleAddForm(){
        this.readonly = false;
        this.isRequired = true;
        this.addForm.licenseFlag = this.licenseFlag;
        if (this.type == "modify" || this.type == "view") {
          this.currentSelectList = this.$refs.datagrid.selects;
          if (this.currentSelectList != null && this.currentSelectList.length > 0) {
            if (this.currentSelectList.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            } else {
              this.$nextTick(() => {
                this.currentSelectRow = this.currentSelectList[0];
                //从页面拿值
                this.addForm.busiBatchId = this.currentSelectRow.id;//业务批次id
                this.addForm.id = this.currentSelectRow.id;
                this.addForm.billType = this.currentSelectRow.billType;
                this.addForm.billClass = this.currentSelectRow.billClass;
                this.addForm.busiBatchNo = this.currentSelectRow.busiBatchNo;
                this.addForm.buyBrchName = this.currentSelectRow.buyBrchName;
                this.addForm.transBrchNo = this.currentSelectRow.transBrchNo;
                this.addForm.saleBrchName = this.currentSelectRow.saleBrchName;
                this.addForm.buyBrchCode = this.currentSelectRow.buyBrchCode;
                this.addForm.transferReason = this.currentSelectRow.transferReason;
                this.addForm.reqRemark = this.currentSelectRow.reqRemark;
                this.addForm.ownedBrchNo = this.currentSelectRow.transBrchNo;
                this.addForm.ownedBrchName = this.currentSelectRow.saleBrchName;
                if (this.currentSelectRow.applDt) {
                  this.addForm.applDt = this.$moment(this.currentSelectRow.applDt, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                  this.addForm.applDt = this.currentSelectRow.applDt;
                }
                if (this.type == "view" && this.formItem.batchStatus === "2") {
                  let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id });
                  this.queryApprovalObjById(obj);
                } else {
                  let obj = Object.assign({}, this.billItem, { busiBatchId: this.currentSelectRow.id });
                  this.queryInitialObjById(obj);
                }
              });
              if (this.type == "modify") {
                this.authObj.bizSetRoleAdd = true;
                this.authObj.bizSetRoleORight = true;
                this.readonly = true;
              }
              if (this.type == "view") {
                this.authObj.bizSetRoleAdd = false;
                this.isRequired = false;
                this.readonly = true;
              }
            }
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
        } else {
          this.$nextTick(() => {
            this.readonly = false;
            this.addForm.id = "";
            this.isRequired = true;
            this.authObj.bizSetRoleAdd = true;
            this.authObj.bizSetRoleORight = true;
            this.addFormReset();
            this.billList = {
              list: [],
              pageInfo: {
                count: 0,
                pageNo: 1,
                pageSize: 10
              }
            };
            post({}, "/be/trust/transfer/transferSaleApplyMain/func_getCurUserInfo").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let data = res.data.retData;
                  this.addForm.saleBrchName = data.saleBrchName;
                  this.addForm.transBrchNo =data.transBrchNo;
                  this.addForm.applDt = this.$moment(data.applDt, "YYYYMMDD").format("YYYY-MM-DD");
                } else {
                  this.$msgTip.error(this, { info: "初始化数据查询失败:" + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                return;
              }
            });
          });
        }
        this.selectionHiddenCol();
      },
      selectionHiddenCol(){
        const columns = this.billColumns;
        let selection=null;
        for (let column of columns) {
          if (column.key === 'selection') {
            selection = column;
            break;
          }
        }
        if (selection != null) {
          selection.hiddenCol = this.type === "view" ? true : false;
        }
      },
      imageWinClose() {
        this.imageWin = false;
        this.imageParams.busiBatchId = "";
        this.imageParams.listId = "";
        this.imageParams.billNo ="";
        this.imageParams.billRangeStart ="";
        this.imageParams.billRangeEnd ="";
        this.imageParams.imgTypeList=[];
      },
      addFormReset() {
        this.addForm.id = null;
        this.$refs.addForm.resetFields();
      },
      //批次清单导出
      batchListDownClick() {
        if (this.$refs.datagrid.selectIds.length != 0) {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleApplyMain/func_exportExcelTrack";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");

          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "ids";
          input1.value = this.$refs.datagrid.selectIds;
          form.appendChild(input1);
          let input2 = document.createElement("input");
          input2.type = "text";
          input2.name = "pageSize";
          input2.value = this.$refs.datagrid.selectIds.length;
          form.appendChild(input2);
          let input3 = document.createElement("input");
          input3.type = "text";
          input3.name = "batchStatus";
          input3.value = this.formItem.batchStatus;
          form.appendChild(input3);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleApplyMain/func_exportExcelTrack";
          let form = document.createElement("form");
          for (let obj in this.formItem) {
            if (this.formItem.hasOwnProperty(obj)) {
              let input = document.createElement("input");
              input.type = "text";
              input.name = obj;
              input.value = this.formItem[obj];
              form.appendChild(input);
            }
          }
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          if (this.$refs.datagrid.total > 0) {
            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "pageSize";
            input1.value = this.$refs.datagrid.total;
            form.appendChild(input1);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      //明细清单导出
      billListDownClick() {
        if (this.$refs.datagridbill.selectIds.length != 0) {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleApplyMain/func_exportExcelBill";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");

          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "ids";
          input1.value = this.$refs.datagridbill.selectIds;
          form.appendChild(input1);
          let input2 = document.createElement("input");
          input2.type = "text";
          input2.name = "pageSize";
          input2.value = this.$refs.datagridbill.selectIds.length;
          form.appendChild(input2);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleApplyMain/func_exportExcelBill";
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          if (this.$refs.datagridbill.total > 0) {
            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "pageSize";
            input1.value = this.$refs.datagridbill.total;
            form.appendChild(input1);
          }
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      //明细、批次导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "transfersaleBatch";
        } else {
          this.param = "transfersaleBillInfo";
        }
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType){
        debugger;
        //exportType: 0-同步 1-异步
        let url;
       // let paramName =  "";
        if (this.selectExportType === "batch") {
          url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleApplyMain/func_exportExcelTrack";
          //paramName = "ids";

        } else {
          url = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleApplyMain/func_exportExcelBill";
          //paramName = "busiBatchId";
        }
        if(exportType === "1"){
          let params = null;
          if (this.selectExportType === "batch" ? this.$refs.datagrid.selectIds.length !== 0 : this.$refs.datagridbill.selectIds.length !== 0) {
            params = {
              ids:this.selectExportType === "batch" ? this.$refs.datagrid.selectIds : this.$refs.datagridbill.selectIds,
              busiBatchId:this.selectExportType === "batch" ? "" : this.$refs.datagrid.selectIds,
              pageSize: this.selectExportType === "batch" ? this.$refs.datagrid.selectIds.length : this.$refs.datagridbill.selectIds.length,
              field: field,
              batchStatus: this.formItem.batchStatus,
              exportType: exportType,
              excelName: this.param,
              authPath: this.formItem.authPath
            };
          }else {
            params = {
              busiBatchId:this.selectExportType === "batch" ? "" : this.$refs.datagrid.selectIds,
              billType: this.formItem.billType,
              billClass:this.formItem.billClass,
              busiBatchNo: this.formItem.busiBatchNo,
              buyBrchName: this.formItem.buyBrchName,
              applDt:this.formItem.applDt,
              batchStatus: this.formItem.batchStatus,
              field: field,
              exportType: exportType,
              excelName: this.param,
              authPath: this.formItem.authPath,
              pageSize: this.selectExportType === "batch" ? this.$refs.datagrid.total : this.$refs.datagridbill.total
            };
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          if (this.selectExportType === "batch" ? this.$refs.datagrid.selectIds.length !== 0 : this.$refs.datagridbill.selectIds.length !==0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = this.selectExportType === "batch" ? 'Ids' : 'busiBatchId';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);

            if (this.selectExportType !== "batch") {
              let input7 = document.createElement('input')
              input7.type = 'text'
              input7.name = 'Ids';
              input7.value = this.$refs.datagridbill.selectIds;
              form.appendChild(input7);
            }

            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.selectExportType === "batch" ? this.$refs.datagrid.selectIds.length : this.$refs.datagridbill.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            let input6 = document.createElement('input')
            input6.type = 'text'
            input6.name = 'batchStatus';
            input6.value = this.formItem.batchStatus;
            form.appendChild(input6)

            let input8 = document.createElement('input')
            input8.type = 'text'
            input8.name = 'authPath';
            input8.value = this.formItem.authPath
            form.appendChild(input8)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.selectExportType === "batch" ? this.$refs.datagrid.total > 0 : this.$refs.datagridbill.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = this.selectExportType === "batch" ? this.$refs.datagrid.total : this.$refs.datagridbill.total;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            if (this.selectExportType !== "batch") {
              let input6 = document.createElement('input')
              input6.type = 'text'
              input6.name = 'busiBatchId';
              input6.value = this.addForm.busiBatchId;
              form.appendChild(input6);
            }

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      // 表格导出功能
      exportCsv(params) {
        /* {
          filename:  '' // 文件名
          columns: []// 导出表格列
          data: [] // 导出表格数据
          noHeader: false //是否导出表格头
        } */
        this.$refs.gridContent.exportCsv(params);
      },
      handleBillPage(pageNo, pageSize) {
        let busiBatchId = this.addForm.id;
        if(busiBatchId == null || busiBatchId == '' || busiBatchId == undefined){
          return ;
        }
        let obj = Object.assign({}, this.billItem, {
          busiBatchId: busiBatchId,
          pageNo: pageNo,
          pageSize: pageSize
        });
        if (this.type === "view" && this.formItem.batchStatus === "2") {
          this.queryApprovalObjById(obj);
        } else {
          this.queryInitialObjById(obj);
        }
      },
      //查询未提交批次下明细
      queryInitialObjById(obj) {
        post(obj, "/be/trust/transfer/transferSaleApplyMain/func_queryTransferSaleBillInitial").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;

            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询失败";
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          } else {
            this.submitMsg = "查询失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.submitWin = true;
          }
        });
      },
      //查询已经交批次下明细
      queryApprovalObjById(obj) {
        post(obj, "/be/trust/transfer/transferSaleApplyMain/func_queryTransferSaleBillSubmit").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;

            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询失败";
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          } else {
            this.submitMsg = "查询失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.submitWin = true;
          }
        });
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
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];

        this.currentSelectRow = [];
        this.currentSelectList = [];

        if(this.formItem.batchStatus === "1"){
          this.noCommitButton()
        }else{
          this.hasCommitButton()
        }
        this.$refs.datagrid.dataChange(1);
        this.$nextTick(()=>{
          this.$refs.datagridbill.selects = [];
          this.$refs.datagridbill.selectIds = [];
        })
      },
      handleApplDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDt = [arr[0],arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDt = [];
        }
      },
      noIssueButton() {
        this.noCommitButton();
        this.formItem.batchStatus = "1";
        this.formSearch();
      },
      hasIssueButton() {
        this.hasCommitButton();
        this.formItem.batchStatus = "2";
        this.formSearch();
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.applDt = [];
        this.$refs.formItem.resetFields();
        if (this.formItem.batchStatus === "2") {
          this.noIssueButton();
        }
      },
      //删除
      handleComfirm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          if (this.currentSelectList.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
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
      /*删除*/
      handledel() {
        let busiBatchId = this.currentSelectList[0].id;
        post({ id: busiBatchId ,deleteFlag:"0" }, "/be/trust/transfer/transferSaleApplyMain/func_submitTransferSaleDel").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else if(retCode === "000002" && retMsg === "100001"){
                this.continueApply(busiBatchId);
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      continueApply(id){
          let url= "/be/trust/transfer/transferSaleApplyMain/func_submitTransferSaleDel";
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
                                  this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                                  this.$refs.datagrid.dataChange(1);
                                  this.currentSelectRow = [];
                                  this.currentSelectList = [];
                                  this.$refs.datagrid.selectIds = [];
                                  this.$refs.datagrid.selects = [];
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
      //撤销申请
      rollbackComfirm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          if (this.currentSelectList.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmRollBack") + "?",
            onOk: () => {
              this.rollback();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      /**撤销**/
      rollback() {
        if (this.currentSelectList == null || this.currentSelectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        } else if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let rollId = this.currentSelectList[0].id;
        post({ id: rollId }, "/be/trust/transfer/transferSaleApplyMain/func_cancelTransferSaleApply").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "撤销成功" });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: "撤销失败" + res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //点击挑票，打开弹框
      pickBillWinOpen(){
        this.addFormSave1('1');
      },
      pickBillWinClose() {
        this.pickBillWin = false;
      },
      //根据弹框所选票进行赋值
      pickBillChange(info) {
        this.addFormSave1('2');
        let ids = [];
        let hIds = [];
        for (let i = 0, len = info.length; i < len; i++) {
          ids.push(info[i].billId);
          hIds.push(info[i].hldrId);
        }
        this.addForm.billIdsStr = ids.join(",");
        this.addForm.hldrIdsStr = hIds.join(",");
        post({
          busiBatchId: this.addForm.id,
          billIdsStr: ids.join(","),
          hldrIdsStr: hIds.join(",")
        }, "/be/trust/transfer/transferSaleApplyMain/func_addTransferSaleApplyBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.pickBillWin = false;
              let obj = Object.assign({}, this.billItem, { busiBatchId: this.addForm.id });
              this.queryInitialObjById(obj);
              this.$refs.datagridbill.dataChange(1);
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagridbill.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: "m.i.common.netError" });
          }
        });
      },
      //票据影像
      imgWinOpen(list) {
        this.imageParams.busiBatchId = this.addForm.id;
        this.imageParams.listId = list.id;
        this.imageParams.imgTypeList.push({key: 'IM11', value: '非交易过户'});
        this.imageParams.billNo=list.billNo;
        this.imageParams.billRangeStart=list.billRangeStart;
        this.imageParams.billRangeEnd=list.billRangeEnd;
        this.imageWin = true;
      },
      //删除票据
      deleteBillBtn() {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (this.currentSelectBillList != null && this.currentSelectBillList.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.be.confirmDelBill") + "?",
            onOk: () => {
              this.handleDelBill();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //删除票据
      handleDelBill() {
        let list = this.currentSelectBillList;
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        this.addForm.billIdsStr = ids.join(",");
        post(this.addForm, "be/trust/transfer/transferSaleApplyMain/func_submittransferSaleApplyBillDel").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              let obj = Object.assign({}, this.billItem, { busiBatchId: this.addForm.id });
              this.queryInitialObjById(obj);
              this.$refs.datagridbill.dataChange(1);
              this.$refs.datagrid.dataChange(1);
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.currentSelectBillList = [];
              this.$refs.datagridbill.selectIds = [];
              this.$refs.datagridbill.selects = [];
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //超链接点击批次号弹出票据明细
      showBillList(list) {
        this.operType = "modify";
        this.addOrEditWin = true;
        this.tempList = this.deepClone(list);
      },
      /* 提交批次到审批流 */
      submitBatch(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSubmit" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "提交信息",
          content: "确定要提交吗?",
          onOk: () => {
            this.submitBatchConfirm(obj);
          }
        });
      },
      submitBatchConfirm(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSubmit" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          //选择提交
          if (obj == "selectSubmit") {
            let ids = [];
            for (let i = 0, len = this.currentSelectBillList.length; i < len; i++) {
              ids.push(this.currentSelectBillList[i].id);
            }
            this.addForm.billIdsStr = ids.join(",");
            post(this.addForm, "/be/trust/transfer/transferSaleApplyMain/func_submitTransferSaleBills").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.commitSuccess") });
                  this.currentSelectBillList = [];
                  this.handleWinClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.currentSelectBillList = [];
                  // this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagridbill.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            //批次提交
            let id = null;
            id = this.addForm.busiBatchId;
            post({ id: id }, "/be/trust/transfer/transferSaleApplyMain/func_submitTransferSaleBatch").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.commitSuccess") });
                  this.currentSelectBillList = [];
                  this.handleWinClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagridbill.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        }
      },
      handleWinClose() {
        this.$refs.datagridbill.pageInfo.pageNo = 1;
        this.$refs.datagridbill.pageInfo.pageSize = 10;
        this.$refs.datagridbill.selects = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectBillList = [];
        this.currentSelectList = [];
        this.busiBatchId = null;
        this.addForm.id = null;
        this.$refs.datagrid.dataChange(1);
        this.$refs.addForm.resetFields();
        this.addForm.buyBrchCode = "";
        this.addForm.buyBrchName = "";
        this.tempList = null;
        this.operType = "";
        this.type = "";
        this.addOrEditWin = false;
      },
      clearVal(optType) {
        if (optType === "buyBrchName") {
          this.addForm.buyBrchCode = "";
          this.addForm.buyBrchName = "";
        }
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
      },
*/

      //新增修改界面
      licenseBrchNoChange(info) {
        /*this.addForm.transBrchNo = info[0].id;
        this.addForm.saleBrchName = info[0].title;
        this.addForm.ownedBrchNo = info[0].id;
        this.addForm.ownedBrchName = info[0].title;
        this.brchNoWin1 = false;*/
          if(info.length>0 && this.licenseFlag===true){
              this.addForm.ownedBrchNo = info[0].brchNo;
              this.addForm.ownedBrchName = info[0].brchName;
          }
      },
     /* brchNoWinOpen1() {
        this.brchNoWin1 = true;
      },
      brchNoWinClose1() {
        this.brchNoWin1 = false;
      },*/
      validNote(rule, val, callback){
        if(val === null || val === ""){
          callback();
          return;
        }
        let value = val.toString();
        if(value.length > 150){
          callback(new Error("字段输入不能超过150个文本"));
        }else{
          callback();
        }
      },
      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      }
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,TransferSaleBillStatus").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.transferStatusList = res.get("TransferSaleBillStatus");
        this.dictMap = res.get("map");
      });

    },

    mounted(){
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
