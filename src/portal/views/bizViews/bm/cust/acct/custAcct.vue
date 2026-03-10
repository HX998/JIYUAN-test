<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                  <select-cust-corp v-model="formItem.custNo" :custNo="formItem.custNo"
                                    :value.sync="formItem.custNo"></select-cust-corp>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.activeFlag')" prop="activeFlag">
                  <h-select v-model="formItem.activeFlag" :clearable="false" :value="1" placeholder="">
                    <h-option v-for="item in isOffList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.custAcctNo')" prop="custAcctNoLike">
                  <h-input v-model="formItem.custAcctNoLike" :maxlength=32></h-input>
                </h-form-item>
                <show-branch v-model="formItem.createBrchNo" :label="$t('m.i.common.createBrchName')" prop="createBrchNo"
                             title="机构名称" :brchNo.sync="formItem.createBrchNo" :showCheckBox="false">
                </show-branch>
                <show-branch v-model="formItem.openBrchNo" :label="$t('m.i.common.openBrchName')" prop="openBrchNo"
                             title="机构名称" :brchNo.sync="formItem.openBrchNo" :showCheckBox="false">
                </show-branch>
                <h-form-item :label="$t('m.i.bm.openDts')" prop="openDts">
                  <h-date-picker type="daterange" placement="bottom-start" v-model="formItem.openDts" :editable=false
                                 format="yyyy-MM-dd" showFormat placeholder="" @on-change="handleOpenDtsChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custAcctKind')" prop="custAcctKind">
                  <h-select v-model="formItem.custAcctKind" placeholder="">
                    <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <show-branch v-model="formItem.busiOwnBrchNo" :label="$t('m.i.common.busiOwnBrch')" prop="busiOwnBrchNo" v-if="isAddBusiOwnBrch == '1'"
                             title="机构名称" url="/sm/auth/branch/queryAllBranchTree" :brchNo.sync="formItem.busiOwnBrchNo" :showCheckBox="false" class="h-form-long-label">
                </show-branch>
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
            highlight-row
            url="/bm/cust/acct/custAcct/func_pageQueryCustAcctList"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left" v-if="this.isShowToolbar">
              <h-button type="primary" @click="operForm()" v-if="authObj.bizSetRoleAdd && (this.btnAuth.synch === undefined ? true : this.btnAuth.synch.isShow)" :disabled="this.disabledFlag">{{$t("m.i.common.synch")}}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd && (this.btnAuth.modify === undefined ? true : this.btnAuth.modify.isShow)"
                        :disabled="this.isLogOn">{{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm('logoff')" v-if="authObj.bizSetRoleDelete && (this.btnAuth.loginOut === undefined ? true : this.btnAuth.loginOut.isShow)"
                        :disabled="this.isLogOn">{{$t("m.i.common.loginOut")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm('logon')" v-if="authObj.bizSetRoleDelete && (this.btnAuth.cacelOut === undefined ? true : this.btnAuth.cacelOut.isShow)"
                        :disabled="this.isLogOff">{{$t("m.i.bm.cacelOut")}}
              </h-button>
            </div>
          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="addOrEditWinClose">
      <p slot="header">
        <span v-if="type=='add'">新增账户信息</span>
        <span v-if="type=='modify'">修改账户信息</span>
        <span v-if="type=='view'">查看账户信息</span>
        <span v-if="type=='coll'">同步账户信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search" onlyBlurRequire>
          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" :required="isRequired">
            <h-input v-if="type=='add'" v-model="addForm.custNo" :placeholder="''" readonly
                     icon="android-search" @on-click="queryCustNo" clearable @on-clear="clearCustNo"></h-input>
            <h-input v-else-if="type=='modify'" v-model="addForm.custNo" :placeholder="''" readonly></h-input>
            <h-input v-else v-model="addForm.custNo" readonly
                     icon="android-search" @on-click="queryCustNo" :placeholder="''" clearable @on-clear="clearCustNo"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custName')" prop="custName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.custName" class="input-boder-0" :title="addForm.custName"
                     readonly></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>

          <show-branch v-model="addForm.openBrchNo" :label="$t('m.i.bm.openBrchNo')" prop="openBrchNo" :required="isRequired"
                       :brchNo.sync="addForm.openBrchNo" :brchName.sync="addForm.openBrchName" showValue
                       @brchNoChange="brchNoChange" :showCheckBox="false" :msgBoxWin="addOrEditWin" :filterable="type=='add'">
          </show-branch>

          <h-form-item :label="$t('m.i.common.openBrchName')" prop="openBrchName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.openBrchName" class="input-boder-0"
                     :title="addForm.openBrchName" readonly></h-input>
            <h-input v-else v-model="addForm.openBrchName" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.openBankNo')" prop="openBankNo" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.openBankNo" class="input-boder-0" :title="addForm.openBankNo"
                     readonly></h-input>
            <h-input v-else v-model="addForm.openBankNo" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctNo')" prop="custAcctNo" :required="isRequired" :validRules="custAcctNoRule">
            <h-input v-if="type=='view'" :value="addForm.custAcctNo" class="input-boder-0"
                     :title="addForm.custAcctNo"></h-input>
            <h-input v-if="type=='modify'" :value="addForm.custAcctNo" :title="addForm.custAcctNo" readonly></h-input>
            <h-input v-else v-model="addForm.custAcctNo" :maxlength=32 :placeholder="'32位以下字母或数字'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctName')" prop="acctName" :required="isRequired">
            <h-input v-model="addForm.acctName" :maxlength=80 :lengthByByte="false" :readonly="type=='view'" placeholder=""></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custAcctKind')" prop="custAcctKind" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.custAcctKind" class="input-boder-0"
                      :title="addForm.custAcctKind" placeholder="">
              <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.custAcctKind" :maxlength=60 placeholder="" @on-change="custAcctKindChange"
                      :readonly="type==='modify'">
              <h-option v-for="item in custAcctKindList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.subAcctSrlNo')" prop="subAcctSrlNo" :required="isRequired" :validRules="custAcctNoRule"  v-if="!(isSubAcctWorks == '0')">
            <h-input v-if="type=='modify'" :value="addForm.subAcctSrlNo" :title="addForm.subAcctSrlNo"
                     readonly></h-input>
            <h-input v-else v-model="addForm.subAcctSrlNo" :maxlength=8 :placeholder="'8位以下字母或数字'"></h-input>
          </h-form-item>
          <show-branch v-model="addForm.busiOwnBrchNo" :label="$t('m.i.common.busiOwnBrchNo')" prop="busiOwnBrchNo" :required="isRequired"  v-if="isAddBusiOwnBrch == '1'"
                       :brchNo.sync="addForm.busiOwnBrchNo" :brchName.sync="addForm.busiOwnBrchName" showValue url="/sm/auth/branch/queryAllBranchTree"
                       :showCheckBox="false" :msgBoxWin="addOrEditWin">
          </show-branch>
          <h-form-item :label="$t('m.i.common.bailType')" prop="bailType" v-if="addForm.custAcctKind=='2'">
            <h-select v-if="type=='view'" :value="addForm.bailType" class="input-boder-0" :title="addForm.bailType"
                      placeholder="">
              <h-option v-for="item in bailTypeList"
                        v-if="item.key == '01' ||item.key == '02' ||item.key == '03' ||item.key == '10'"
                        :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
            <h-select v-else v-model="addForm.bailType" :maxlength=60 placeholder="" :readonly="type==='modify'">
              <h-option v-for="item in bailTypeList"
                        v-if="item.key == '01' ||item.key == '02' ||item.key == '03' ||item.key == '10'"
                        :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custAcctType')" prop="custAcctType">
            <h-select v-if="type=='view'" :value="addForm.custAcctType" class="input-boder-0"
                      :title="addForm.custAcctType" placeholder="">
              <h-option v-for="item in custAcctTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.custAcctType" :maxlength=60 placeholder="">
              <h-option v-for="item in custAcctTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.busiOwnBrch')" prop="busiOwnBrchName" :required="isRequired"  v-if="isAddBusiOwnBrch == '1'">
            <h-input v-if="type=='view'" :value="addForm.busiOwnBrchName" class="input-boder-0"
                     :title="addForm.busiOwnBrchName" readonly></h-input>
            <h-input v-else v-model="addForm.busiOwnBrchName" :maxlength=60 readonly :placeholder="''"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.depositStyle')" prop="depositStyle">
            <h-select v-if="type=='view'" :value="addForm.depositStyle" class="input-boder-0"
                      :title="addForm.depositStyle" placeholder="">
              <h-option v-for="item in depositStyleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.depositStyle" :maxlength=60 placeholder="" :readonly="type==='modify'">
              <h-option v-for="item in depositStyleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <!--是否存托账户-->
          <common-select v-model="addForm.isDpst" :label="$t('m.i.bs.isDpst')"
                         prop="isDpst" :dictList="isList" v-if="isOnlineStdBill==='1'" :required="true" ></common-select>


          <!--账户类型-->
          <common-select v-model="addForm.cpesAcctType" :label="$t('m.i.common.cpesAcctType')"
                         prop="cpesAcctType" :dictList="cpesAcctTypeList" ></common-select>

          <!--账户有效期至-->
          <common-date-picker :label="$t('m.i.common.acctEffectiveDt')" type="date" prop="acctEffectiveDt" v-model="addForm.acctEffectiveDt" placeholder="" showFormat :editable=false :readonly="type==='view'"></common-date-picker>

          <!--授权代理人姓名-->
          <h-form-item :label="$t('m.i.common.agencyName')" prop="agencyName" >
            <h-input v-if="type==='view'" :value="addForm.agencyName" class="input-boder-0"
                     :title="addForm.agencyName" :maxlength=200 :lengthByByte="false" readonly></h-input>
            <h-input v-else-if="type==='coll'" v-model="addForm.agencyName"  :title="addForm.agencyName" :maxlength=200 :lengthByByte="false"></h-input>
            <h-input v-else v-model="addForm.agencyName" :maxlength=200 :lengthByByte="false"></h-input>
          </h-form-item>

          <!--授权代理人电话-->
          <h-form-item :label="$t('m.i.common.agencyPhone')" prop="agencyPhone" >
            <h-input v-if="type==='view'" :value="addForm.agencyPhone" class="input-boder-0"
                     :title="addForm.agencyPhone" :maxlength=20 :lengthByByte="false" readonly></h-input>
            <h-input v-else v-model="addForm.agencyPhone" :maxlength=20 :lengthByByte="false"></h-input>
          </h-form-item>

          <!--授权代理人证件类型-->
          <h-form-item :label="$t('m.i.common.agencyCertType')" prop="agencyCertType" >
            <h-select v-if="type==='view'" v-model="addForm.agencyCertType" :maxlength=60 placeholder="">
              <h-option v-for="item in corpLegalCertTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.agencyCertType" :maxlength=60 placeholder="">
              <h-option v-for="item in corpLegalCertTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!--授权代理人证件号码-->
          <h-form-item v-if="addForm.agencyCertType==='DC01'" :key="addForm.agencyCertType" :validRules="certNoRule" :label="$t('m.i.common.agencyCertNo')" prop="agencyCertNo" >
            <h-input v-if="type==='view'" :value="addForm.agencyCertNo" class="input-boder-0"
                     :title="addForm.agencyCertNo" :maxlength=18 :lengthByByte="false" readonly></h-input>
            <h-input v-else v-model="addForm.agencyCertNo" :maxlength=18 :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item v-else :label="$t('m.i.common.agencyCertNo')" prop="agencyCertNo" >
            <h-input v-if="type==='view'" :value="addForm.agencyCertNo" class="input-boder-0"
                     :title="addForm.agencyCertNo" :maxlength=20 :lengthByByte="false" readonly></h-input>
            <h-input v-else v-model="addForm.agencyCertNo" :maxlength=20 :lengthByByte="false"></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <!--<h-button type="ghost" style="margin:0 8px"  @click="addFormReset()">{{$t('m.i.common.reset')}}</h-button>-->
        <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="'查看企业客户'" @showCustCorpWinClose="showCustCorpWinClose"
                    @custSelect="custSelect"></show-cust-corp>

    <show-cust-acct :showCustAcctWin="showCustAcctWin" selectType="coll" :title="'同步账户'"
                    @showCustAcctWinClose="showCustAcctWinClose"></show-cust-acct>

  </div>
</template>

<script>
  import { post, on, off ,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";
  export default {
    name: "custAcct",
    components: {
      ShowCustCorp:()=>import(/* webpackChunkName: "bm/cust/corp/showCustCorp"*/"@/views/bizViews/bm/cust/corp/showCustCorp.vue"),
      ShowCustAcct:()=>import(/* webpackChunkName: "bm/cust/acct/showCustAcct"*/"@/views/bizViews/bm/cust/acct/showCustAcct.vue"),
    },
    data() {
      let columns = [
        {
          type: "selection",
          key: "duoxuan",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          key: "xuhao",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custNo'),
          key: "custNo",

          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.acctName'),
          key: "acctName",
          /*hiddenCol: this.isOnlineStdBill != "1",*/
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.bm.custAcctNo'),
          key: "custAcctNo",

          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.subAcctSrlNo'),
          key: "subAcctSrlNo",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custAcctType'),
          key: "custAcctType",

          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "custAcctType", params.row.custAcctType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.common.custAcctKind'),
          key: "custAcctKind",

          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "custAcctKind", params.row.custAcctKind);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.common.depositStyle'),
          key: "depositStyle",

          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "depositStyle", params.row.depositStyle);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.common.bailType'),
          key: "bailType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "bailType", params.row.bailType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.bm.setActiveFlag'),
          key: "activeFlag",
          sortable: true,
          hiddenCol: true,
          render: (h, params) => {
            let flag = "";
            if (params.row.activeFlag === "0") {
              flag = "已注销";
            } else if (params.row.activeFlag === "1") {
              flag = "生效中";
            } else if (params.row.activeFlag === "2") {
              flag = "已冻结";
            }
            return h("span", { domProps: { title: flag } }, flag);
          }
        },
        {
          title: this.$t('m.i.bm.openDts'),
          key: "openDt",

          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.openDt == null || params.row.openDt === "") {
              return "";
            }
            let openDt = this.$moment(params.row.openDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", { domProps: { title: openDt } }, openDt);
          }
        },
        {
          title: this.$t('m.i.common.openBankNo'),
          key: "openBankNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.openBrchNo'),
          key: "openBrchNo",
          sortable: true,

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.openBrchName'),
          key: "openBrchName",

          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchNo'),
          key: "createBrchNo",

          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.createBrchName'),
          key: "createBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.busiOwnBrchNo'),
          key: "busiOwnBrchNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.busiOwnBrch'),
          key: "busiOwnBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.operBrchNo'),
          key: "operBrchNo",

          hiddenCol: true
        },
        {
          title: this.$t('m.i.common.operBrchName'),
          key: "operBrchName",
          sortable: true,
          hiddenCol: true
        },
        {
          title: this.$t('m.i.common.operTellerNo'),
          key: "operTellerNo",
          hiddenCol: true
        },
        {
          title: this.$t('m.i.common.operTellerName'),
          key: "operTellerName",
          sortable: true,
          hiddenCol: true
        }
      ];
      let formItem = {
        custNo: "",
        activeFlag: "1",
        custAcctKind: "",
        custName: "",
        custAcctNo: "",
        openBankNo: "",
        openDt: null,
        openDts: [],
        createBrchNo: "",
        openBrchNo: "",
        isOtherBankAcct: "0",
        subAcctSrlNo: "",
        busiOwnBrchNo:"",
        custAcctNoLike: ""
      };
      let addForm = {
        id: "",
        custId: "",
        custNo: "",
        custName: "",
        activeFlag: "",
        custAcctNo: "",
        custAcctType: "",
        custAcctKind: "",
        depositStyle: "",
        bailType: "",
        openBankNo: "",
        openBrchId: "",
        openBrchNo: "",
        openBrchName: "",
        openDt: null,
        createBrchNo: "",
        createBrchName: "",
        operBrchNo: "",
        operBrchName: "",
        operTellerNo: "",
        operTellerName: "",
        transplantFlag: "",
        reserve1: "",
        reserve2: "",
        reserve3: "",
        createTime: "",
        updateTime: "",
        subAcctSrlNo: "",
        busiOwnBrchNo:"",
        busiOwnBrchName:"",
        isDpst:"",
        cpesAcctType:"",
        acctEffectiveDt:"",
        agencyName:"",
        agencyPhone:"",
        agencyCertType:"",
        agencyCertNo:""
      };
      //给按钮增加权限
      let authObj = {
        bizSetRoleAdd: true, //角色添加
        bizSetRoleDelete: true, //角色删除
        bizSetRoleORight: true, //角色操作权限
        bizSetRoleARight: true, //角色授权权限
        bizRoleRightSet: true, //角色权限处理
        bizRoleRightCopy: true, //角色权限复制
        bizSetRoleDownload: true //角色信息下载
      };

      function validcustAcctNo(rule,val,callback){
        let re = /^[a-zA-Z0-9]{1,32}$/;
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，只能输入英文、数字"))
        }
      }

      return {
        isShowToolbar: false,
        btnAuth: {},
        columns: columns,
        formItem: formItem,
        authObj: authObj,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        addForm: addForm,
        type: null,
        readonly: false,
        isRequired: true,
        submitFlag: false,
        // 字典相关静态数据
        custAcctTypeList: [],
        custAcctKindList: [],
        corpLegalCertTypeList:[],
        isList: [],
        isOffList: [],
        depositStyleList: [],
        cpesAcctTypeList:[],
        bailTypeList: [],
        // 机构，客户选择界面
        showCustCorpWin: false,
        brchNoWin: false,
        // 提交结果界面相关
        submitWin: false,
        submitMsg: "",
        retMsg: "",
        custAcctNoRule: [{ test: validcustAcctNo, trigger: "blur" }],
        showCustAcctWin: false,
        ifShowMore: false,
        isLogOff: false,
        isLogOn: false,
        disabledFlag: false,
        dictMap: new Map(),
        isSubAcctWorks: "",
        isAddBusiOwnBrch:"",
        isOnlineStdBill:"",
        isDpstReadonly:false,
        certNoRule: [{
          test: /(^[0-9A-Z]{18}$)|(^$)/,
          trigger: "blur",
          message: "身份证为18位"
        }]
      };
    },
    methods: {
      //日期选择框
      handleOpenDtsChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.openDts = [arr[0], arr[1]];
        }else{
          this.formItem.openDts = [];
        }
      },
      getButtonAuth(){
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id, loading: false }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
              this.isShowToolbar = true;
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }

        });
      },
      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.id = "";
        });
      },
      async handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          let list = this.$refs.datagrid.selects;
          if (!list || list.length !== 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.addFormReset();
          if (this.type == "modify") {
            let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
            if (userInfo.brchNo != list[0].createBrchNo && userInfo.brchNo != list[0].openBrchNo) {
              this.$msgTip.info(this, { info: "只有开户/创建机构能进行此操作" });
              return;
            }
            // let errorMsg = await this.validIfSigned("修改");
            // if (errorMsg != "" && errorMsg != null) {
            //   this.$msgTip.error(this, { info: errorMsg });
            //   return;
            // }
          }
          this.$nextTick(() => {
            this.queryObjById(list[0].id);
            if (this.type == "modify") {
              this.readonly = true;
            }
            if (this.type == "view") {
              this.isRequired = false;
            }
          });
        } else {
          this.addFormReset();
        }
        this.addOrEditWin = true;
      },
      addOrEditWinClose(){
        this.addOrEditWin = false;
        this.isDpstReadonly=false;
      },
      queryObjById(id) {
        post({ id: id }, "/bm/cust/acct/custAcct/func_queryCustAcctById").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.custId = res.data.retData.custId;
              this.addForm.custNo = res.data.retData.custNo;
              this.addForm.custName = res.data.retData.custName;
              this.addForm.acctName = res.data.retData.acctName;
              this.addForm.activeFlag = res.data.retData.activeFlag;
              this.addForm.custAcctNo = res.data.retData.custAcctNo;
              this.addForm.custAcctType = res.data.retData.custAcctType;
              this.addForm.custAcctKind = res.data.retData.custAcctKind;
              this.addForm.depositStyle = res.data.retData.depositStyle;
              if (res.data.retData.bailType == "00") {
                this.addForm.bailType = "";
              } else {
                this.addForm.bailType = res.data.retData.bailType;
              }
              this.addForm.openBankNo = res.data.retData.openBankNo;
              this.addForm.openBrchId = res.data.retData.openBrchId;
              this.addForm.openBrchNo = res.data.retData.openBrchNo;
              this.addForm.openBrchName = res.data.retData.openBrchName;
              this.addForm.openDt = res.data.retData.openDt;
              this.addForm.createBrchNo = res.data.retData.createBrchNo;
              this.addForm.createBrchName = res.data.retData.createBrchName;
              this.addForm.operBrchNo = res.data.retData.operBrchNo;
              this.addForm.operBrchName = res.data.retData.operBrchName;
              this.addForm.operTellerNo = res.data.retData.operTellerNo;
              this.addForm.operTellerName = res.data.retData.operTellerName;
              this.addForm.transplantFlag = res.data.retData.transplantFlag;
              this.addForm.subAcctSrlNo = res.data.retData.subAcctSrlNo;
              this.addForm.reserve1 = res.data.retData.reserve1;
              this.addForm.reserve2 = res.data.retData.reserve2;
              this.addForm.reserve3 = res.data.retData.reserve3;
              this.addForm.createTime = res.data.retData.createTime;
              this.addForm.updateTime = res.data.retData.updateTime;
              this.addForm.busiOwnBrchNo = res.data.retData.busiOwnBrchNo;
              this.addForm.busiOwnBrchName = res.data.retData.busiOwnBrchName;
              this.addForm.isDpst = res.data.retData.isDpst;
              if(this.addForm.isDpst&&this.type == "modify" ){
                this.isDpstReadonly=true;
              }
              this.addForm.acctEffectiveDt = res.data.retData.acctEffectiveDt=== null ? "" : res.data.retData.acctEffectiveDt.toString();
              this.addForm.agencyName = res.data.retData.agencyName;
              this.addForm.agencyPhone = res.data.retData.agencyPhone;
              this.addForm.agencyCertType = res.data.retData.agencyCertType;
              this.addForm.agencyCertNo = res.data.retData.agencyCertNo;
              this.addForm.cpesAcctType = res.data.retData.cpesAcctType;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      activeFlagChange() {
        if (this.formItem.activeFlag === "1") {
          this.isLogOff = false;
          this.isLogOn = true;
        } else if (this.formItem.activeFlag === "0") {
          this.isLogOff = true;
          this.isLogOn = false;
        } else if (this.formItem.activeFlag === "2") {
          this.isLogOff = false;
          this.isLogOn = false;
        }
      },
      handleSelectClick(arr, selectInx) {
        let array = this.$refs.datagrid.selects;
        if (array.length === 0) {
          this.isLogOn = false;
          this.isLogOff = false;
          this.disabledFlag = false;
          return false;
        }
        let activeFlag = array[0].activeFlag;
        for(let i = 1; i < array.length; i++) {
          if (activeFlag !== array[i].activeFlag) {
            this.isLogOn = true;
            this.isLogOff = true;
            this.disabledFlag = true;
            return true;
          }
        }
        this.disabledFlag = false;
        if (activeFlag === "1") {
          this.isLogOff = true;
          this.isLogOn = false;
        } else if (activeFlag === "0") {
          this.isLogOff = false;
          this.isLogOn = true;
        } else if (activeFlag === "2") {
          this.isLogOff = true;
          this.isLogOn = true;
        }
        return true;
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.isLogOn = false;
        this.isLogOff = false;
        this.disabledFlag = false;
      },
      formSearchReset() {
        this.formItem.createBrchNo = "";
        this.formItem.openBrchNo = "";
        this.formItem.busiOwnBrchNo = "";
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type == "add" ? "/bm/cust/acct/custAcct/func_insertCustAcct" : "/bm/cust/acct/custAcct/func_updateCustAcct";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;

            // 若是保证金账户，且保证金类型为空，则默认设为00
            if (this.addForm.custAcctKind == "2" && (this.addForm.bailType == null || this.addForm.bailType == "")) {
              this.addForm.bailType == "00";
            }
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this. addOrEditWinClose();
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = []
                } else {
                  // this.$hMessage.error(this.$t('m.i.common.addFailed')+res.data.retMsg);
                  let msg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                  this.submitFailed(msg, res.data.retMsg);
                }
              } else {
                // this.$hMessage.error(this.$t('m.i.common.netError'))
                let msg = this.type == "add" ? this.$t("m.i.common.addFailed") : this.$t("m.i.common.modifyFailed");
                this.submitFailed(msg, this.$t("m.i.common.netError"));
              }

            });
          }
        });

      },
      async handleComfirm(oper) {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          // if (list.length > 1) {
          //   this.$msgTip.info(this,{info:this.$t('m.i.common.onlyChooseOneData')});
          //   return
          // }
          let errorCurp = "";
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          for (let i = 0; i < list.length; i++) {
            if (userInfo.brchNo !== list[i].createBrchNo && userInfo.brchNo !== list[i].openBrchNo) {
              errorCurp += list[i].custAcctNo + ",";
            }
          }
          if (errorCurp !== "") {
            this.$msgTip.info(this, { info: "账户号：" + errorCurp + "的账户开户/创建机构不是本机构，只有开户/创建机构能进行此操作" });
            return;
          }


          let content = "";
          let url = "";
          if (oper == "logoff") {
            let errorMsg = await this.validIfSigned("注销");
            if (errorMsg != "" && errorMsg != null) {
              this.$msgTip.error(this, { info: errorMsg });
              return;
            }
            content = "注销";
            url = "/bm/cust/acct/custAcct/func_deleteCustAcct";
          } else if (oper == "logon") {
            content = "撤销注销";
            url = "/bm/cust/acct/custAcct/func_logonCustAcct";
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "是否要" + content + "?",
            onOk: () => {
              this.handlelog(url, content);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }

      },
      async validIfSigned(content) {
        //
        let list = this.$refs.datagrid.selects;

        let validAcctNos = [];
        for (let i = 0; i < list.length; i++) {
          validAcctNos.push(list[i].custAcctNo);
        }
        return post({ custAcctNoColls: validAcctNos }, "/bm/cust/acct/custAcct/func_queryAcctAndSigned").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              let resultList = [];
              resultList = res.data.retData;
              if (resultList == null || resultList == undefined || resultList.length == 0) {
                return "";
              } else {
                let acctNos = "";
                for (let i = 0; i < resultList.length; i++) {
                  acctNos += resultList[i].custAcctNo + ",";
                }
                return "客户账号：" + acctNos.substring(0, acctNos.length - 1) + "，已签约，不允许" + content;
              }
            } else {
              // this.$refs.datagrid.dataChange(1)
              // this.submitMsg = '检验账户是否签约失败';
              // this.retMsg = res.data.retMsg;
              // this.submitWin = true;
              return "检验账户是否签约失败" + res.data.retMsg;
            }
          } else {
            // this.retMsg = this.$t('m.i.common.netError');
            // this.submitWin = true;
            return this.$t("m.i.common.netError");
          }
        });
      },
      handlelog(url, content) {
        let list = this.$refs.datagrid.selects;

        let delId = [];
        for (let i = 0; i < list.length; i++) {
          delId.push(list[i].id);
        }
        post({ ids: delId }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              // this.$hMessage.success(content+'成功')
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = []
            } else {
              // this.submitMsg = content+'失败';
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryCustNo() {
        this.showCustCorpWin = true;
      },
      clearCustNo(){
        this.addForm.custNo = "";
        this.addForm.custName = "";
        this.addForm.custId = "";
        this.$refs.addForm.validateField('custNo');
        this.$refs.addForm.validateField('custName');
      },
      showCustCorpWinClose() {
        this.showCustCorpWin = false;
      },
      custSelect(info) {
        this.addForm.custNo = info.custNo;
        this.addForm.custName = info.custName;
        this.addForm.custId = info.id;
        this.showCustCorpWin = false;
        this.$refs.addForm.validateField('custNo');
        this.$refs.addForm.validateField('custName');
      },
      queryBrchNos() {
        this.brchNoWin = true;
      },
      clearBrchNos(){
        this.addForm.openBrchNo = "";
        this.addForm.openBrchName = "";
        this.addForm.openBrchId = "";
        this.addForm.openBankNo = "";
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        if(info.length > 0) {
          this.getBranchByBranchTreeNo(info[0].brchNo);
          this.$refs.addForm.validateField('openBrchNo');
          this.$refs.addForm.validateField('openBrchName');
        } else {
          this.addForm.openBankNo = "";
          this.addForm.openBrchNo = "";
          this.addForm.openBrchName = "";
          this.$refs.addForm.validateField('openBrchNo');
          this.$refs.addForm.validateField('openBrchName');
          this.$refs.addForm.validateField('openBankNo');
        }
      },
      // 根据brchNo反查获得行号和id
      getBranchByBranchTreeNo(brchNo) {
        post({ brchNo: brchNo }, "/sm/auth/branch/getBranchByBranchTreeNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.openBrchId = res.data.retData.id;
              this.addForm.openBankNo = res.data.retData.bankNo;
              this.$refs.addForm.validateField('openBankNo');
            } else {
              // this.submitMsg = '获取行号失败';
              // this.retMsg = res.data.retMsg;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            // this.retMsg = this.$t('m.i.common.netError');
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      operForm() {
        this.showCustAcctWin = true;
      },
      showCustAcctWinClose(updateFlag) {
        if (updateFlag == "1") {
          this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        }
        this.showCustAcctWin = false;
      },

      submitFailed(title, retMsg) {
        this.$msgTip.error(this, { info: retMsg });
      },

      custAcctKindChange() {
        if (this.addForm.custAcctKind != "2") {
          this.addForm.bailType = "";
        } else {
          // if(this.addForm.bailType == ""){
          //   this.addForm.bailType = "00";
          // }
        }
      }

    },

    mounted() {
      this.getDictListByGroups("bailType,depositStyle,custAcctKind,custAcctType,Yon,CustAcctStatus,CertType,CpesAcctType").then(res => {
        this.bailTypeList = res.get("bailType");
        this.depositStyleList = res.get("depositStyle");
        this.custAcctKindList = res.get("custAcctKind");
        this.custAcctTypeList = res.get("custAcctType");
        this.isOffList = res.get("CustAcctStatus");
        this.corpLegalCertTypeList = res.get("CertType");
        this.isList = res.get("Yon");
        this.cpesAcctTypeList = res.get("CpesAcctType");
        this.dictMap = res.get("map");
      });
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works,pc.is_marketing_bank_mode,bs.corpstdbill.is_online_std_bill").then(res => {
        let isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        let isMarketingBankMode = res["pc.is_marketing_bank_mode"];
        let isOnlineStdBill = res["bs.corpstdbill.is_online_std_bill"];
        if(isMarketingBankMode === '1'){
          this.$refs.datagrid.controlColumnsHidden("busiOwnBrchNo", false);
          this.$refs.datagrid.controlColumnsHidden("busiOwnBrchName", false);
          this.addForm.busiOwnBrchNo = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
          this.addForm.busiOwnBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
        } else {
          this.$refs.datagrid.controlColumnsHidden("busiOwnBrchNo", true);
          this.$refs.datagrid.controlColumnsHidden("busiOwnBrchName", true);
        }

       /* if(isOnlineStdBill === '1'){
          this.$refs.datagrid.controlColumnsHidden("acctName", false);
        } else {
          this.$refs.datagrid.controlColumnsHidden("acctName", true);
        }*/

        if(isSubAcctWorks === '0'){
          this.$refs.datagrid.controlColumnsHidden("subAcctSrlNo", true);
        } else {
          this.$refs.datagrid.controlColumnsHidden("subAcctSrlNo", false);
        }

        this.isSubAcctWorks = isSubAcctWorks;
        this.isAddBusiOwnBrch = isMarketingBankMode;
        this.isOnlineStdBill=isOnlineStdBill;
      });

    },
    created(){
      this.getButtonAuth();
    }
  };
</script>

<style scoped>

</style>
