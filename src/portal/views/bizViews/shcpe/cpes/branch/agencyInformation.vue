<!--机构信息查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item label="机构全称" prop="brchFullNameZh">
                  <h-input v-model="formItem.brchFullNameZh" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
                  <h-input v-model="formItem.brchCode" :maxlength="9" placeholder=""></h-input>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNo" class="h-form-long-label">
                  <h-input v-model="formItem.transBrchBankNo" :maxlength="12"
                           :placeholder="$t('m.i.common.transBrchBankNo')"></h-input>
                </h-form-item>-->
                <h-form-item :label="$t('m.i.common.brchType')" prop="brchType">
                  <h-select v-model="formItem.brchType" placeholder="">
                    <h-option v-for="item in brchTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
                  <h-input v-model="formItem.memberName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.brchStatus')" prop="brchStatus">
                  <h-select v-model="formItem.brchStatus" placeholder="">
                    <h-option v-for="item in brchStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.bankProv')" prop="transProvinceCode">
                  <h-select v-model="formItem.transProvinceCode" placeholder="">
                    <h-option v-for="item in provinceCodeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.shcpe.custNo')" prop="custNo">
                  <h-input v-model="formItem.custNo" :maxlength="20"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch('1')">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/branch/agencyInformation/func_queryBranchs"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="branchDetail()">{{$t("m.i.common.viewDatail")}}</h-button>
              <h-button type="primary" @click="handleAgencyForm()" v-if="this.btnAuth.agencyFormBtn === undefined ? true : this.btnAuth.agencyFormBtn.isShow">{{$t("m.i.shcpe.supplement")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击查看详情弹出窗-->
    <h-msg-box v-model="viewDatailWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               :maximize="true">
      <p slot="header">
        <span>机构详情</span>
      </p>
      <h-tabs value="viewDatail" :model="viewDatailForm">
        <h-tab-pane label="机构信息" name="branchInfo">
          <h-form>
            <div class="text-wrap mb-10">
              <div class="text-body">
                <h-row :gutter="12">
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.common.brchFullNameZh")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchFullNameZh}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.common.brchShortNameZh")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchShortNameZh}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.socCode')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.socCode}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.bankProv')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transProvince}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.brchType')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchTypeName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.transBrchClass')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transBrchClassName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.brchLegalLevel')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transCorpClassName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.prodFirstDate')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.prodBeginDt}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.undertakeBrch')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.continueBranchName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.brchStatus')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchStatusName}}</h-col>
                    </h-row>
                  </h-col>

                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.brchFullNameEn')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchFullNameEn}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.brchShortNameEn')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchShortNameEn}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.brchCode')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchCode}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.bankProvCode')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transProvinceCode}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.brchTypeCode')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchType}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">机构类型代码:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transBrchClass}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.brchNum')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.brchNum}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.prodEndDate')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.prodEndDt}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.continueBrchCode')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.continueBrchCode}}</h-col>
                    </h-row>
                  </h-col>
                </h-row>

              </div>
            </div>
          </h-form>
        </h-tab-pane>
        <h-tab-pane label="账户信息" name="acctInfo">
          <h-form>
            <div class="text-wrap mb-10">
              <div class="text-body">
                <h-row :gutter="12">
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.transAcctStatus')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transAcctStatusName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.transBrchBankNo')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transBrchBankNo}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.ecdsAcctNo')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.ecdsAcctNo}}</h-col>
                    </h-row>
                  </h-col>

                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.regAcctStatus')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.regAcctStatusName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.eAgentBankNo')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.eAgentBankNo}}</h-col>
                    </h-row>
                  </h-col>
                </h-row>

              </div>
            </div>
          </h-form>
        </h-tab-pane>
        <h-tab-pane label="管理员信息" name="adminInfo">
          <h-form>
            <div class="text-wrap mb-10">
              <div class="text-body">
                <h-row :gutter="12">
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.firstAdminId')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.firstAdminId}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.firstAdminStatus')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.firstAdminStatus}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.secondAdminName')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.secondAdminName}}</h-col>
                    </h-row>
                  </h-col>

                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.firstAdminName')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.firstAdminName}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.secondAdminId')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.secondAdminId}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.shcpe.secondAdminStatus')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.secondAdminStatus}}</h-col>
                    </h-row>
                  </h-col>
                </h-row>

              </div>
            </div>
          </h-form>
        </h-tab-pane>
        <h-tab-pane label="其他信息" name="otherInfo">
          <h-form>
            <div class="text-wrap mb-10">
              <div class="text-body">
                <h-row :gutter="12">
                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.transCorpReg")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transCorpReg}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.common.address")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.address}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.common.phone")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.phone}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.common.postCode")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.postCode}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.custNo")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.custNo}}</h-col>
                    </h-row>
                  </h-col>

                  <h-col span="12">
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.transRegistCapital")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.transRegistCapital}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.shcpe.linkMan")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.linkMan}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.common.fax')}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.custFax}}</h-col>
                    </h-row>
                    <h-row>
                      <h-col span="9" class="label">{{$t("m.i.common.remark")}}:</h-col>
                      <h-col span="15" class="val">{{viewDatailForm.cpesBrchRemark}}</h-col>
                    </h-row>
                  </h-col>
                </h-row>

              </div>
            </div>
          </h-form>
        </h-tab-pane>
      </h-tabs>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="viewDatailWin =! viewDatailWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--点击补录弹出窗-->
    <h-msg-box v-model="agencyWin" width="400" :mask-closable="false" @on-close="agencyWinClose"
               :maximize="true">
      <p slot="header">
        <span>补录同业客户信息</span>
      </p>
      <h-form :model="agencyForm" :label-width="80" ref="agencyForm" cols="2" class="h-form-search">
        <h-form-item :label="$t('m.i.shcpe.custNo')" prop="custNo" cols="2" style="height: 46px"
                     :validRules="custNoRule">
          <h-row>
            <h-col span="17">
              <h-input v-model="agencyForm.custNo" :maxlength="20" type="text"></h-input>
            </h-col>
            <h-col span="4" offset="1">
              <h-button type="ghost" @click="agencySupply()" class="pull-left">{{$t("m.i.common.synch")}}</h-button>
            </h-col>
          </h-row>
        </h-form-item>

        <h-form-item :label="$t('m.i.common.remark')" prop="cpesBrchRemark" cols="2"
                     class="h-form-height-auto">
          <h-input v-model="agencyForm.cpesBrchRemark" :rows=3 type="textarea" :maxlength="250"></h-input>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="agencyWin=!agencyWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "agencyInformation",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          transBrchBankNo: "",
          brchType: "",
          memberName: "",
          brchStatus: "",
          continueBranchName: "",
          custNo: "",
          transProvinceCode: ""
        },
        editForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchNum: "",
          brchType: "",
          transBrchClass: "",
          brchFullNameZh: "",
          brchFullNameEn: "",
          brchShortNameZh: "",
          brchShortNameEn: "",
          socCode: "",
          transProvinceCode: "",
          transCorpClass: "",
          prodBeginDt: "",
          prodEndDt: "",
          brchStatus: "",
          transAcctStatus: "",
          regAcctStatus: "",
          transCorpReg: "",
          transRegistCapital: "",
          address: "",
          linkMan: "",
          phone: "",
          custFax: "",
          postCode: "",
          transBrchBankNo: "",
          brchBankName: "",
          eAgentBankNo: "",
          ecdsAcctNo: "",
          cpesBrchRemark: "",
          operTm: "",
          brLv: "",
          operType: "",
          brchInternalAcctNo: "",
          brchInternalAcctName: "",
          memberTxAcctNo: "",
          memberRegAcctNo: "",
          cpesAcctNo: "",
          outAcctBankNo: "",
          outAcctNo: "",
          outAcctName: "",
          firstAdminId: "",
          firstAdminName: "",
          firstAdminStatus: "",
          secondAdminId: "",
          secondAdminName: "",
          secondAdminStatus: "",
          continueBrchCode: "",
          createTime: "",
          updateTime: "",
          custNo: "",
          reserve1: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          isPlatform: "",
          continueBranchName: ""
        },
        agencyForm: {
          id: "",
          brchCode: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          cpesBrchRemark: "",
          custNo: "",
          checkType: ""
        },
        checkForm: {
          socCode: "",
          bankNo: "",
          custNo: "",
          custName: "",
          brchCode: "",
          certifyType: "",
          certifyNo: ""
        },
        viewDatailForm: {
          id: "",
          memberId: "",
          memberName: "",
          brchCode: "",
          brchNum: "",
          brchType: "",
          brchTypeName: "",
          transBrchClass: "",
          transBrchClassName: "",
          brchFullNameZh: "",
          brchFullNameEn: "",
          brchShortNameZh: "",
          brchShortNameEn: "",
          socCode: "",
          transProvinceCode: "",
          transProvince: "",
          transCorpClass: "",
          transCorpClassName: "",
          prodBeginDt: "",
          prodEndDt: "",
          brchStatus: "",
          brchStatusName: "",
          transAcctStatus: "",
          transAcctStatusName: "",
          regAcctStatus: "",
          regAcctStatusName: "",
          transCorpReg: "",
          transRegistCapital: "",
          address: "",
          linkMan: "",
          phone: "",
          custFax: "",
          postCode: "",
          transBrchBankNo: "",
          brchBankName: "",
          eAgentBankNo: "",
          ecdsAcctNo: "",
          cpesBrchRemark: "",
          operTm: "",
          brLv: "",
          operType: "",
          brchInternalAcctNo: "",
          brchInternalAcctName: "",
          memberTxAcctNo: "",
          memberRegAcctNo: "",
          cpesAcctNo: "",
          outAcctBankNo: "",
          outAcctNo: "",
          outAcctName: "",
          firstAdminId: "",
          firstAdminName: "",
          firstAdminStatus: "",
          secondAdminId: "",
          secondAdminName: "",
          secondAdminStatus: "",
          continueBrchCode: "",
          createTime: "",
          updateTime: "",
          custNo: "",
          reserve1: "",
          customerName: "",
          certifyType: "",
          certifyNo: "",
          isPlatform: "",
          continueBranchName: ""
        },

        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        socCodeRule: [{ test: /^[A-Za-z0-9\-]{18}$/, trigger: "blur", message: "统一社会信用代码为18位只含a-z,A-Z,0-9,-字符" }],
        custNoRule: [{ test: /^[a-zA-Z0-9#]{0,20}$/, trigger: "blur", message: "同业客户号为20位只含a-z,A-Z,0-9字符" }],
        spanLeft: 4,
        spanRight: 20,
        tableRef: "selfTable",
        //给按钮增加权限
        authObj: {
          viewDatail: true //查看详情
        },
        columns: [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: " ",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: "机构全称（中文）",
            key: "brchFullNameZh",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchType"),
            key: "brchType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BrchType", params.row.brchType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.bankProv"),
            key: "transProvinceCode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Province", params.row.transProvinceCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.brchStatus"),
            key: "brchStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UserBrchStatus", params.row.brchStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          //新增承接机构全称
          /*{
            title: "承接机构全称",
            key: "continueBranchName",
            hiddenCol: false,
            ellipsis: false
          },*/
          //新增同业客户号
          {
            title: this.$t("m.i.shcpe.custNo"),
            key: "custNo",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        brchTypeList: [],
        brchStatusList: [],
        provinceCodeList: [],
        type: null,
        isRequired: true,
        editWin: false,
        agencyWin: false,
        viewDatailWin: false,
        ifShowMore: false,
        submitFlag: false,
        id: null,
        btnAuth:"",
      };
    },
    components: {},
    watch: {},

    computed: {},
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = [];
      },
      submitForm() {
        this.$refs["agencyForm"].validate(valid => {
          if (valid) {
            if (this.checkForm === null) {
              this.submit();
              return;
            }
            let checkType = this.agencyForm.checkType;
            let coreCustName = this.checkForm.custName;
            let custName = this.currentSelectRow.brchFullNameZh;
            if ("1" === checkType) {
              if (coreCustName !== custName) {
                this.$msgTip.error(this, { info: "直连系统客户名称：" + custName + " 与核心客户名称：" + coreCustName + " 不一致，不允许保存。" });
              } else {
                this.submit();
              }
            } else if ("2" === checkType) {
              if (coreCustName !== custName) {
                this.$hMsgBox.confirm({
                  title: "核心校验",
                  content: "直连系统客户名称：" + custName + "与核心客户名称：" + coreCustName + "不一致，是否提交?",
                  onOk: () => {
                    this.submit();
                  }
                });
              } else {
                this.submit();
              }
            } else {
              this.submit();
            }
          }
        });
      },
      submit() {
        this.submitFlag = true;
        let url = "/cpes/branch/branchManage/func_updateBranchInfo";
        let msg = this.$t("m.i.common.modifySuccess");
        post(this.agencyForm, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$hMessage.success(msg);
              this.agencyWin = false;
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
            } else {
              let msg = this.$t("m.i.common.modifyFailed");
              this.$hMessage.error(msg + ":" + res.data.retMsg);
            }
          } else {
            this.$hMessage.error(this.$t("m.i.common.netError"));
          }
        });
      },
      // 查看详情
      branchDetail() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/cpes/branch/agencyInformation/func_agencyDetail").then(res => {
          if (res.data.retCode === "000000") {
            this.viewDatailForm = res.data.retData;
            this.viewDatailForm.transProvince = formatterProvinceCode(res.data.retData.transProvinceCode);
            this.viewDatailForm.brchTypeName = formatterBrchType(res.data.retData.brchType);
            this.viewDatailForm.transBrchClassName = formatterTransBrchClass(res.data.retData.transBrchClass);
            this.viewDatailForm.transCorpClassName = formatterTransCorpClass(res.data.retData.transCorpClass);
            this.viewDatailForm.brchStatusName = formatterStatus(res.data.retData.brchStatus);
            this.viewDatailForm.transAcctStatusName = formatterStatus(res.data.retData.transAcctStatus);
          }
          this.viewDatailWin = true;
        }).catch(error => {
          this.$hMessage.error({
            content: this.$t("m.i.common.netError") + error,
            duration: 5,
            closable: true
          });
        });
        this.viewDatailWin = true;
      },
      //补录同业客户信息
      handleAgencyForm() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/cpes/branch/branchManage/func_agencyInformationSupply").then(res => {
          if (res.data.retCode === "000000") {
            this.agencyForm = res.data.retData;
            this.checkForm = null;
          }
        }).catch(error => {
          this.$hMessage.error({
            content: this.$t("m.i.common.netError") + error,
            duration: 5,
            closable: true
          });
        });
        this.agencyWin = true;
      },
      //同步
      agencySupply() {
        let brchCode = this.agencyForm.brchCode;
        post({ brchCode: brchCode }, "/cpes/branch/branchManage/func_queryMemberCustomerNo").then(res => {
          if (res.data.retCode === "000000") {
            this.agencyForm.custNo = res.data.retData.custNo;
            this.agencyForm.customerName = res.data.retData.custName;
            // this.agencyForm.certifyType = res.data.retData.certifyType;
            // this.agencyForm.certifyNo = res.data.retData.certifyNo;
            this.checkForm = res.data.retData;
            this.checkForm.custName = res.data.retData.custName;
          }
        }).catch(error => {
          this.$hMessage.error({
            content: this.$t("m.i.common.netError") + error,
            duration: 5,
            closable: true
          });
        });
      },
      handleWinClose() {
        this.$refs.editForm.resetFields();
      },
      agencyWinClose() {
        this.$refs.agencyForm.resetFields();
      }
    },
    mounted() {
      this.getDictListByGroups("BrchType,UserBrchStatus,Province").then(res => {
        this.brchTypeList = res.get("BrchType");
        this.brchStatusList = res.get("UserBrchStatus");
        this.provinceCodeList = res.get("Province");
        this.dictMap = res.get("map");
      });
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };


  function formatterStatus(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"ST01":
        return "活动";
      case"ST02":
        return "禁用";
    }
  }

  function formatterTransCorpClass(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"CC00":
        return "法人（含虚拟资管参与者）";
      case"CC01":
        return "分支机构";
      case"CC02":
        return "非法人产品";
    }
  }

  function formatterTransBrchClass(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"101":
        return "中国人民银行";
      case"201":
        return "政策性银行";
      case"202":
        return "国有商业银行";
      case"203":
        return "股份制商业银行";
      case"204":
        return "外资银行";
      case"205":
        return "城市商业银行";
      case"206":
        return "农商行和农合行";
      case"207":
        return "村镇银行";
      case"208":
        return "农村信用社";
      case"209":
        return "民营银行";
      case"301":
        return "财务公司";
      case"302":
        return "信托投资公司";
      case"303":
        return "保险公司";
      case"304":
        return "证券公司";
      case"305":
        return "基金公司";
      case"306":
        return "金融资产管理公司";
      case"307":
        return "私募基金公司";
      case"308":
        return "汽车金融公司";
      case"309":
        return "保险公司的资产管理公司";
      case"310":
        return "证券公司的资产管理公司";
      case"311":
        return "基金公司的资产管理公司";
      case"401":
        return "商业银行理财产品";
      case"402":
        return "证券公司的资产管理产品";
      case"403":
        return "信托公司金融产品";
      case"404":
        return "保险公司的保险产品";
      case"405":
        return "保险资产管理公司的资管产品";
      case"406":
        return "基金";
      case"407":
        return "私募基金";
      case"408":
        return "基金公司的特定客户资产管理业务";
      case"409":
        return "社保基金";
      case"410":
        return "其他基金";
      case"411":
        return "其他非法人产品";
      case"412":
        return "证券资管公司的资管产品";
      case"413":
        return "基金资管公司的资管产品";
      case"501":
        return "商业银行资管";
      case"502":
        return "证券公司资管";
      case"503":
        return "基金公司资管";
      case"504":
        return "基金子公司资管";
      case"505":
        return "私募基金公司资管";
      case"506":
        return "信托资管";
      case"507":
        return "保险公司资管";
      case"508":
        return "保险资管公司资管";
      case"509":
        return "社保基金资管";
      case"510":
        return "其他资管";
      case"511":
        return "证券资管公司资管";
      case"601":
        return "社保基金理事会";
      case"602":
        return "公积金中心";
      case"603":
        return "小额贷款公司";
      case"604":
        return "融资租赁公司";
      case"605":
        return "其他非金融机构";
      case"701":
        return "国有商业银行存托产品";
      case"702":
        return "股份制商业银行存托产品";
      case"703":
        return "外资银行存托产品";
      case"704":
        return "城市商业银行存托产品";
      case"705":
        return "民营银行存托产品";
      case"706":
        return "农商行和农合行存托产品";
      case"707":
        return "其他农村金融机构存托产品";
      case"708":
        return "证券公司存托产品";
      case"709":
        return "其他存托产品";
      case"801":
        return "国有商业银行存托";
      case"802":
        return "股份制商业银行存托";
      case"803":
        return "外资银行存托";
      case"804":
        return "城市商业银行存托";
      case"805":
        return "民营银行存托";
      case"806":
        return "农商行和农合行存托";
      case"807":
        return "其他农村金融机构存托";
      case"808":
        return "证券公司存托";
      case"809":
        return "其他存托";
    }
  }

  function formatterProvinceCode(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case "11":
        return "北京";
      case "12":
        return "天津";
      case "31":
        return "上海";
      case "50":
        return "重庆";
      case "13":
        return "河北";
      case "14":
        return "山西";
      case "21":
        return "辽宁";
      case "22":
        return "吉林";
      case "23":
        return "黑龙江";
      case "32":
        return "江苏";
      case "33":
        return "浙江";
      case "34":
        return "安徽";
      case "35":
        return "福建";
      case "36":
        return "江西";
      case "37":
        return "山东";
      case "41":
        return "河南";
      case "42":
        return "湖北";
      case "43":
        return "湖南";
      case "44":
        return "广东";
      case "46":
        return "海南";
      case "51":
        return "四川";
      case "52":
        return "贵州";
      case "53":
        return "云南";
      case "61":
        return "陕西";
      case "62":
        return "甘肃";
      case "63":
        return "青海";
      case "15":
        return "内蒙古";
      case "45":
        return "广西";
      case "54":
        return "西藏";
      case "64":
        return "宁夏";
      case "65":
        return "新疆";
      case "81":
        return "香港";
      case "82":
        return "澳门";
      case "71":
        return "台湾";
    }
  }

  function formatterBrchType(value) {
    if (value == null || value == "") {
      return "";
    }
    switch (value) {
      case"1":
        return "中央银行";
      case"2":
        return "银行业机构";
      case"3":
        return "非银行金融机构";
      case"4":
        return "非法人产品  ";
      case"5":
        return "虚拟资管参与者";
      case"6":
        return "非金融机构";
      case"7":
        return "存托类非法人产品";
      case"8":
        return "存托类虚拟系统参与者";
    }
  }
</script>
