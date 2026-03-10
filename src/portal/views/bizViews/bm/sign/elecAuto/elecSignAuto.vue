<template>
  <div class="layout">
    <div v-if="signManageMain">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                    <h-input v-model="formItem.custNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                    <h-input v-model="formItem.custName" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.bm.signStatus')" prop="signStatus">
                    <h-select v-model="formItem.signStatus" placeholder="" @on-change="changeStatus()"
                              :clearable="false" showTitle>
                      <h-option value="1">已签约</h-option>
                      <h-option value="0">已解约</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
            </div>
            <!--数据展示表格-->
            <h-datagrid :columns="columns"
                        highlight-row
                        :bindForm="formItem"
                        url="/bm/sign/elecAuto/elecSignAuto/func_pageQueryCustElecSignDistinctCustNo"
                        :onCurrentChange="onCurrentCustCorpChange"
                        :onCurrentChangeCancel="onCurrentCustCorpChangeCancel"
                        ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="custCorpSearch()">{{$t('m.i.bm.showSignDetail')}}</h-button>
                <h-button type="primary" v-if="formItem.signStatus==='1'" @click="elecCustCorp()">{{$t('m.i.bm.elecCustCorp')}}</h-button>
              </div>
            </h-datagrid>
            <!--查看签约明细界面-->
            <h-msg-box v-model="custCorpSearchWin" width="800" @on-close="custCorpFormSearch" class="h-form-table-layer"
                       :maximize="true">
              <p slot="header">
                <span>查看签约明细信息</span>
              </p>
              <h-datagrid :columns="custCorpColumns"
                          highlight-row
                          :autoLoad=false
                          :height="350"
                          url="/bm/sign/elecAuto/elecSignAuto/func_queryPageElecSignAuto"
                          :bindForm="viewFormItem"
                          ref="custCorpDatagrid">
              </h-datagrid>
              <!-- 弹出框模式底部按钮 -->
              <div slot="footer" class="pull-right">
                <h-button type="ghost" @click="custCorpClose">{{$t("m.i.common.close")}}</h-button>
              </div>
            </h-msg-box>
          </div>
        </h-col>
      </h-row>
    </div>

    <!--电票签约配置-->
    <div v-if="custCropSign">
      <div class="h-form-search-box">
        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
          <h-form :model="elecCustCorpFormItem" :label-width="90" ref="elecCustCorpFormItem" cols="2"
                  class="h-form-search">
            <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
              <h-input v-model="elecCustCorpFormItem.custNo" disabled></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.custName')" prop="custName">
              <h-input v-model="elecCustCorpFormItem.custName" disabled></h-input>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <h-datagrid :columns="elecCustCorpColumns"
                  highlight-row
                  :autoLoad=false
                  url="/bm/sign/elecAuto/elecSignAuto/func_queryPageElecSignAuto"
                  :hasSelect="false"
                  :bindForm="elecCustCorpFormItem"
                  :row-select="true"
                  ref="elecCustCorpDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="handleAddForm">{{$t("m.i.common.add")}}</h-button>
          <h-button type="primary" @click="handleEditForm">{{$t("m.i.common.modify")}}</h-button>
          <h-button type="primary" @click="deleteRoute()">{{$t("m.i.common.delete")}}</h-button>
          <h-button type="primary" @click="back">{{$t('m.i.common.goBack')}}</h-button>
        </div>
      </h-datagrid>

    </div>

    <!-- 新增弹出框 -->
    <h-msg-box v-model="addWin" width="400" class="h-form-search-layer" :maximize="true" @on-close="addWinClose">
      <p slot="header">
        <span>新增电票自动化签约</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="addForm.billType" placeholder="" @on-change="billTypeChange">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.custSignKindList')" prop="custSignKindList" required>
            <h-select v-model="addForm.custSignKindList" placeholder="" multiple showTitle>
              <h-option v-for="item in custSignKindList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.custSignMode')" prop="custSignMode" required>
            <h-select v-model="addForm.custSignMode" placeholder="" @on-change="addFormCustSignModeChange">
              <h-option value="1">客户号</h-option>
              <h-option value="2">账号</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.custAcctNo')" prop="custAcctNo" required v-if="addForm.custSignMode==='2'">
            <h-input v-model="addForm.custAcctNo" placeholder="" icon="android-search"
                     @on-click="queryCustElecSign()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.signStartDt')" prop="signStartDt" required>
            <h-date-picker type="date" v-model="addForm.signStartDt" placeholder=""
                           @on-change="handleAddSignStartDtChange" :options="signOptions"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.signEndDt')" prop="signEndDt">
            <h-date-picker type="date" v-model="addForm.signEndDt" placeholder=""
                           @on-change="handleAddSignEndDtChange"></h-date-picker>
          </h-form-item>
          <show-branch v-model="addForm.pawneeName" :label="$t('m.i.pe.pledgeeName')" prop="pawneeName"
                       :required="isRequired" :showCheckBox="false" :msgBoxWin="brchNoWin"
                       :textShow="'brchName'" @brchNoChange="brchNoChange" readonly  v-if="addForm.custSignKindList.indexOf('14')!==-1"
                       title="机构名称"  :brchNo.sync="addForm.pawneeBrchNo"
                       :brchName.sync="addForm.pawneeName" >
          </show-branch>
          <h-form-item prop="pawneeBankNo" :label="$t('m.i.pe.pledgeeBankNo')" required
                       v-if="addForm.custSignKindList.indexOf('14')!==-1">
            <h-input v-model="addForm.pawneeBankNo"  readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="addWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="addFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 修改弹出框 -->
    <h-msg-box v-model="editWin" width="400" class="h-form-search-layer" :maximize="true" @on-close="editWinClose">
      <p slot="header">
        <span>修改电票自动化签约</span>
      </p>
      <h-panel>
        <h-form :model="editForm" :label-width="115" ref="editForm" cols="1" class="h-form-search">
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="editForm.billType" placeholder="" @on-change="billTypeChange" readonly showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.custSignKindList')" prop="custSignKindList" required>
            <h-select v-model="editForm.custSignKindList" placeholder="" readonly showTitle>
              <h-option v-for="item in custSignKindList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.signStartDt')" prop="signStartDt" required>
            <h-date-picker type="date" v-model="editForm.signStartDt" placeholder=""
                           :options="signOptions"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.signEndDt')" prop="signEndDt">
            <h-date-picker type="date" v-model="editForm.signEndDt" placeholder=""></h-date-picker>
          </h-form-item>
          <show-branch v-model="editForm.pawneeName" :label="$t('m.i.pe.pledgeeName')" prop="pawneeName"
                       :required="isRequired" :showCheckBox="false" :msgBoxWin="brchNoWin"
                       :textShow="'brchName'" @brchNoChange="brchNoChange" readonly v-if="editForm.custSignKindList==='14'"
                       title="机构名称"  :brchNo.sync="editForm.pawneeBrchNo"
                       :brchName.sync="editForm.pawneeName" >
          </show-branch>
          <h-form-item prop="pawneeBankNo" :label="$t('m.i.pe.pledgeeBankNo')"  required
                       v-if="editForm.custSignKindList==='14'">
            <h-input v-model="editForm.pawneeBankNo"  readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="editWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="editFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 客户账号查询 -->
    <h-msg-box v-model="custElecSignWin" width="800" class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>客户账号查询</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid :columns="custElecSignColumns"
                  highlight-row
                  :auto-load="false"
                  :height="350"
                  :bindForm="custAcctFormItem"
                  url="/bm/sign/elecAuto/elecSignAuto/func_pageQueryCustElecNotSignAuto"
                  :onCurrentChange="onCurrentCustElecSignChange"
                  :onCurrentChangeCancel="onCurrentCustElecSignChangeCancel"
                  ref="custElecSignDatagrid">
      </h-datagrid>

      <div slot="footer">
        <h-button type="ghost" @click="custElecSignWin=!custElecSignWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="custElecSignCommit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查看账号明细信息 -->
    <h-msg-box v-model="custAcctNoWin" width="800" class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>查看账号明细信息</span>
      </p>
      <!--数据展示表格-->
      <h-row>
        <h-col span="24">
          <h-datagrid :columns="custAcctNoColumns"
                      highlight-row
                      :auto-load="false"
                      :height="350"
                      :bindForm="custAcctNoFormItem"
                      url="/bm/sign/pageQueryCustElecSign"
                      ref="custAcctNoDatagrid">
          </h-datagrid>
        </h-col>
      </h-row>
      <div slot="footer">
        <h-button type="ghost" @click="custAcctNoWin=!custAcctNoWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "elecSignAuto",
    data() {
      let _this = this;
      return {
        custAcctNoColumns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.custNo'),
            key: "custNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.custAcctNo'),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.eleSignStatus'),
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.signStatus === "" || params.row.signStatus == null) {
                return "";
              }
              switch (params.row.signStatus) {
                case "1":
                  return h("span", "已签约");
                case "0":
                  return h("span", "已解约");
              }
            }
          },
          {
            title: this.$t('m.i.bm.eSignStartDt'),
            key: "eSignStartDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.eSignStartDt == null || params.row.eSignStartDt === "") {
                return "---";
              }
              let date = this.$moment(params.row.eSignStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.bm.eSignCancelDt'),
            key: "eSignCancelDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.eSignCancelDt === "" || params.row.eSignCancelDt == null || params.row.eSignCancelDt === 0) {
                return h("span", "---");
              } else {
                let date = this.$moment(params.row.eSignCancelDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            }
          }
        ],
        custAcctNoFormItem:  {
          custNo: "",
          signStatus: ""
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.custNo'),
            key: "custNo",
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
                      this.viewCustAcctNo(params.row.custNo);
                    }
                  }
                }, params.row.custNo)
              ]);
            }
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.eleSignStatus'),
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.signStatus === "" || params.row.signStatus == null) {
                return "";
              }
              switch (params.row.signStatus) {
                case "1":
                  return h("span", "已签约");
                case "0":
                  return h("span", "已解约");
              }
            }
          },
          {
            title: this.$t('m.i.bm.eSignStartDt'),
            key: "eSignStartDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.eSignStartDt == null || params.row.eSignStartDt === "") {
                return "---";
              }
              let date = this.$moment(params.row.eSignStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.bm.eSignCancelDt'),
            key: "eSignCancelDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.eSignCancelDt === "" || params.row.eSignCancelDt == null || params.row.eSignCancelDt === 0) {
                return h("span", "---");
              } else {
                let date = this.$moment(params.row.eSignCancelDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            }
          },
          {
            title: this.$t('m.i.common.operBrchNo'),
            key: "operBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operBrchName'),
            key: "operBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operTellerNo'),
            key: "operTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operTellerName'),
            key: "operTellerName",
            sortable: true,
            hiddenCol: false
          }
        ],
        formItem: {
          custNo: "",
          custName: "",
          signStatus: "1"
        },
        elecCustCorpFormItem: {
          custNo: "",
          custName: "",
          custAcctNo: ""
        },
        custAcctFormItem: {
          custNo: "",
          billType: "",
          custSignKindList: "",
          signStatus: "1"
        },
        custCorpColumns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AuditDraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: "签约类型",
            key: "custSignKind",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(new Map().set("ElecSignAutoKind", this.custSignKindMap), "ElecSignAutoKind", params.row.custSignKind);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: "签约模式",
            key: "custSignMode",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.custSignMode === "" || params.row.custSignMode == null) {
                return "";
              }
              switch (params.row.custSignMode) {
                case "1":
                  return h("span", "客户号");
                case "2":
                  return h("span", "账号");
              }
            }
          },
          {
            title: this.$t('m.i.bm.custAcctNo'),
            key: "custAcctNo",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.custAcctNo === "" || params.row.custAcctNo == null) {
                return h("span", "---");
              } else {
                return h("span", params.row.custAcctNo);
              }
            }
          },
          {
            title: "签约起始日",
            key: "signStartDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.signStartDt == null || params.row.signStartDt === "") {
                return "---";
              }
              let date = this.$moment(params.row.signStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: "签约到期日",
            key: "signEndDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.signEndDt == null || params.row.signEndDt === "") {
                return "---";
              }
              let date = this.$moment(params.row.signEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        elecCustCorpColumns: [
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
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AuditDraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: "签约类型",
            key: "custSignKind",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(new Map().set("ElecSignAutoKind", this.custSignKindMap), "ElecSignAutoKind", params.row.custSignKind);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t('m.i.bm.custAcctNo'),
            key: "custAcctNo",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.custAcctNo === "" || params.row.custAcctNo == null) {
                return h("span", "---");
              } else {
                return h("span", params.row.custAcctNo);
              }
            }
          },
          {
            title: "签约起始日",
            key: "signStartDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.signStartDt == null || params.row.signStartDt === "") {
                return "---";
              }
              let date = this.$moment(params.row.signStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: "签约到期日",
            key: "signEndDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.signEndDt == null || params.row.signEndDt === "") {
                return "---";
              }
              let date = this.$moment(params.row.signEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        addForm: {
          billType: "",
          custSignKindList: [],
          custSignMode: "",
          signStartDt: "",
          signEndDt: "",
          custAcctNo: "",
          custNo: "",
          custName: "",
          pawneeName: "",
          pawneeBankNo: "",
          pawneeBrchNo: "",
        },
        editForm: {
          id: "",
          billType: "",
          custSignKindList: "",
          custSignMode: "",
          signStartDt: "",
          signEndDt: "",
          custAcctNo: "",
          custNo: "",
          custName: "",
          pawneeName: "",
          pawneeBankNo: "",
          pawneeBrchNo: "",
        },
        viewFormItem: {
          id: "",
          custNo: "",
          custAcctNo: ""
        },
        custElecSignColumns: [
          {
            type: "radio",
            width: 60,
            title: " ",
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
            title: this.$t('m.i.common.custNo'),
            key: "custNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.custAcctNo'),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.eleSignStatus'),
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.signStatus === "" || params.row.signStatus == null) {
                return "";
              }
              switch (params.row.signStatus) {
                case "1":
                  return h("span", "已签约");
                case "0":
                  return h("span", "已解约");
              }
            }
          },
          {
            title: this.$t('m.i.bm.eSignStartDt'),
            key: "eSignStartDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.eSignStartDt == null || params.row.eSignStartDt === "") {
                return "---";
              }
              let date = this.$moment(params.row.eSignStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.bm.eSignCancelDt'),
            key: "eSignCancelDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.eSignCancelDt === "" || params.row.eSignCancelDt == null || params.row.eSignCancelDt === 0) {
                return h("span", "---");
              } else {
                let date = this.$moment(params.row.eSignCancelDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            }
          },
          {
            title: this.$t('m.i.common.operBrchNo'),
            key: "operBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operBrchName'),
            key: "operBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operTellerNo'),
            key: "operTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operTellerName'),
            key: "operTellerName",
            sortable: true,
            hiddenCol: false
          }
        ],
        custAcctNoWin: false,
        addWin: false,
        editWin: false,
        custNo: "",
        custElecSignWin: false,
        billTypeList: [],
        custSignKindList: [],
        custSignKindBCList: [],
        custSignKindBankList: [],
        custSignKindCorpList: [],
        dictMap: new Map(),
        custSignKindMap: new Map(),
        selectCustCorp: null,
        selectCustElecSign:null,
        custCorpSearchWin: false,
        submitFlag: false,
        ifShowMore: false,
        signManageMain: true,
        custCropSign: false,
        brchNoWin: false,
        isRequired: true,
        signOptions: {
          disabledDate(date) {
            return date && date.valueOf() < _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
          }
        },
        selectUrl : '/sm/auth/branch/getBranchByBranchTreeNo',
      };
    },
    mounted() {
      this.getDictListByGroups("ElecSignAutoKindBC,ElecSignAutoKindCorp,ElecSignAutoKindBank,AuditDraftTypeCode").then(res => {
        this.custSignKindBCList = res.get("ElecSignAutoKindBC");
        this.custSignKindCorpList = res.get("ElecSignAutoKindCorp");
        this.custSignKindBankList = res.get("ElecSignAutoKindBank");
        this.billTypeList = res.get("AuditDraftTypeCode");
        this.dictMap = res.get("map");
        let elecSignAutoKindBCMap = this.dictMap.get("ElecSignAutoKindBC");
        let elecSignAutoKindCorpMap = this.dictMap.get("ElecSignAutoKindCorp");
        let elecSignAutoKindBankMap = this.dictMap.get("ElecSignAutoKindBank");
        let custSignKindMap = Array.from(elecSignAutoKindBCMap).concat(Array.from(elecSignAutoKindCorpMap)).concat(Array.from(elecSignAutoKindBankMap));
        this.custSignKindMap = new Map(custSignKindMap);
      });
    },
    methods: {
      onCurrentCustCorpChange(currentRow, oldCurrentRow, _index){
        this.selectCustCorp = currentRow;
      },
      onCurrentCustCorpChangeCancel(currentRow, oldCurrentRow, _index){
        this.selectCustCorp = null;
      },

      onCurrentCustElecSignChange(currentRow, oldCurrentRow, _index){
        this.selectCustElecSign = currentRow;
      },
      onCurrentCustElecSignChangeCancel(currentRow, oldCurrentRow, _index){
        this.selectCustElecSign = null;
      },
      addFormCustSignModeChange() {
        if (this.addForm.custSignMode === "1") {
          this.addForm.custAcctNo = "";
        }
      },
      //查看签约明细
      custCorpSearch() {
        if (!this.selectCustCorp) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.viewFormItem.custNo = this.selectCustCorp.custNo;
        this.custCorpSearchWin = true;
        this.$nextTick(() => {
          this.custCorpFormSearch();
        });
      },
      //签约明细查询
      custCorpFormSearch() {
        this.$refs.custCorpDatagrid.dataChange(1);
      },
      //签约明细界面关闭
      custCorpClose() {
        this.currentSelectRow = [];
        this.custCorpSearchWin = false;
      },
      //电票签约配置按钮
      elecCustCorp() {
        if (!this.selectCustCorp) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.elecCustCorpFormItem.custNo = this.selectCustCorp.custNo;
        this.elecCustCorpFormItem.custName = this.selectCustCorp.custName;
        this.custNo = this.selectCustCorp.custNo;
        this.signManageMain = false;
        this.custCropSign = true;
        this.$nextTick(() => {
          this.$refs.elecCustCorpDatagrid.dataChange(1);
          this.$refs.elecCustCorpDatagrid.selfAdaption();
        });
      },
      //电票签约配置查询
      elecCustCorpSearch() {
        this.$refs.elecCustCorpDatagrid.dataChange(1);
      },
      //自动化签约搜索
      formSearch() {
        this.selectCustCorp = null;
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //自动化签约界面重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      changeStatus() {
        this.formSearch();
      },
      //新增
      handleAddForm() {
        this.addWin = true;
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.custName = this.elecCustCorpFormItem.custName;
          this.addForm.custNo = this.custNo;
          this.addForm.signStartDt = window.sessionStorage.getItem("workDate");
        });
      },
      handleAddSignStartDtChange(value) {
        this.addForm.signStartDt = value.replace(/-/g, "");
      },
      handleAddSignEndDtChange(value) {
        this.addForm.signEndDt = value.replace(/-/g, "");
      },
      //新增关闭
      addWinClose() {
        this.addWin = false;
        this.$refs.addForm.resetFields();
        this.addForm.pawneeBrchNo="";
      },
      //新增提交
      addFormSubmit() {
        if (this.addForm.signStartDt !== "" && this.addForm.signStartDt != null) {
          let signStartDtFormat = this.$moment(this.addForm.signStartDt).format("YYYYMMDD");
          this.addForm.signStartDt = signStartDtFormat;
        }
        if(this.addForm.custSignKindList.indexOf('14')===-1){
          this.addForm.pawneeName="";
          this.addForm.pawneeBankNo="";
          this.addForm.pawneeBrchNo="";
        }
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = "/bm/sign/elecAuto/elecSignAuto/func_saveElecSignAuto";
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.addWinClose();
                  this.$refs.elecCustCorpDatagrid.dataChange(this.$refs.elecCustCorpDatagrid.pageInfo.pageNo);
                  this.$refs.elecCustCorpDatagrid.selects = [];
                  this.$refs.elecCustCorpDatagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      //修改
      handleEditForm() {
        let list = this.$refs.elecCustCorpDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.editForm.custName = this.elecCustCorpFormItem.custName;
        this.editForm.custNo = this.custNo;
        let id = list[0].id;
        this.editWin = true;
        this.$nextTick(() => {
          post({ id: id }, "/bm/sign/elecAuto/elecSignAuto/func_getElecSignAutoById").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.editForm.id = res.data.retData.id;
                this.editForm.billType = res.data.retData.billType;
                this.editForm.custSignKindList = res.data.retData.custSignKind;
                this.editForm.signStartDt = res.data.retData.signStartDt + "";
                this.editForm.signEndDt = res.data.retData.signEndDt + "";
                this.editForm.custSignMode = res.data.retData.custSignMode;
                this.editForm.custAcctNo = res.data.retData.custAcctNo;
                this.editForm.pawneeName = res.data.retData.pawneeName;
                this.editForm.pawneeBankNo = res.data.retData.pawneeBankNo;
                this.editForm.pawneeBrchNo = res.data.retData.pawneeBrchNo;
                // this.billTypeChange(this.editForm.billType);
                // this.editWin = true;
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        });
      },
      //修改关闭
      editWinClose() {
        this.$refs.editForm.resetFields();
        this.editForm.id = "";
        this.editForm.pawneeBrchNo="";
        this.editWin = false;
      },
      //修改提交
      editFormSubmit() {
        if (this.editForm.signStartDt !== "" && this.editForm.signStartDt != null) {
          let signStartDtFormat = this.$moment(this.editForm.signStartDt).format("YYYYMMDD");
          this.editForm.signStartDt = signStartDtFormat;
        }
        if (this.editForm.signEndDt !== "" && this.editForm.signEndDt != null) {
          let signEndDtFormat = this.$moment(this.editForm.signEndDt).format("YYYYMMDD");
          this.editForm.signEndDt = signEndDtFormat;
        }
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            let url = "/bm/sign/elecAuto/elecSignAuto/func_updateElecSignAuto";
            this.submitFlag = true;
            post(this.editForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.editWinClose();
                  this.$refs.elecCustCorpDatagrid.dataChange(this.$refs.elecCustCorpDatagrid.pageInfo.pageNo);
                  this.$refs.elecCustCorpDatagrid.selects = [];
                  this.$refs.elecCustCorpDatagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //删除
      deleteRoute() {
        if (this.$refs.elecCustCorpDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let list = this.$refs.elecCustCorpDatagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/bm/sign/elecAuto/elecSignAuto/func_delElecSignAuto").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.elecCustCorpDatagrid.dataChange(this.$refs.elecCustCorpDatagrid.pageInfo.pageNo);
              this.$refs.elecCustCorpDatagrid.selects = [];
              this.$refs.elecCustCorpDatagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.elecCustCorpDatagrid.dataChange(this.$refs.elecCustCorpDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //返回
      back() {
        this.$refs.elecCustCorpDatagrid.selects = [];
        this.$refs.elecCustCorpDatagrid.selectIds = [];
        this.selectCustCorp = null;
        this.custCropSign = false;
        this.signManageMain = true;
      },
      //客户账号弹出框
      queryCustElecSign() {
        if (this.addForm.custSignKindList.length === 0) {
          this.$msgTip.info(this, { info: "请先选择签约类型！" });
          return;
        }
        this.custElecSignWin = true;
        this.$nextTick(() => {
          this.custAcctFormItem.custNo = this.custNo;
          this.custAcctFormItem.billType = this.addForm.billType;
          this.custAcctFormItem.custSignKindList = this.addForm.custSignKindList;
          this.custElecSignSearch();
        });
      },
      //客户账号弹出框界面查询
      custElecSignSearch() {
        this.$refs.custElecSignDatagrid.dataChange(1);
      },
      //客户账号弹出框提交按钮
      custElecSignCommit() {
        if (!this.selectCustElecSign) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.addForm.custAcctNo = this.selectCustElecSign.custAcctNo;
        this.custElecSignWin = false;
        this.$nextTick(() => {
          this.$refs.custElecSignDatagrid.dataChange(1);
          this.$refs.custElecSignDatagrid.selfAdaption();
        });
      },
      //超链接查看账号明细
      viewCustAcctNo(custNo) {
        this.custAcctNoWin = true;
        this.$nextTick(() => {
          this.custAcctNoFormItem.custNo = custNo;
          this.custAcctNoFormItem.signStatus = this.formItem.signStatus;
          this.$refs.custAcctNoDatagrid.dataChange(1);
        });
      },
      billTypeChange(currentValue) {
        if (currentValue === "AC00") {
          this.custSignKindList = this.custSignKindBCList;
        } else if (currentValue === "AC01") {
          this.custSignKindList = this.custSignKindBankList;
        } else if (currentValue === "AC02") {
          this.custSignKindList = this.custSignKindCorpList;
        } else {
          this.custSignKindList = [];
        }
      },
      brchNoChange(info){
        post({brchNo: this.addForm.pawneeBrchNo}, this.selectUrl).then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.addForm.pawneeBankNo=res.data.retData.ecdsBankNo;
            }else{
            }
          }else{
          }
        });
        this.brchNoWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
