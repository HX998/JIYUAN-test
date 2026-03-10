<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNo" :label="$t('m.i.common.brchName')" prop="brchNo"
                             title="机构名称" :brchNo.sync="formItem.brchNo" :showCheckBox="false">
                </show-branch>
                <show-product v-model="formItem.prodName" @productSelectedChange="productSelectedChange($event, 'query')"
                              :clearProduct="clearProductName" clearValTag="query"></show-product>
                <query-btn :advanceShow='false' :formSearch='handleSearch' :formSearchReset='resetSearch' formClassAdd="2"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/bm/prod/rate/billAccessMain/func_queryProductRateByPage"
                      :bindForm="formItem"
                      :rowSelect="true"
                      :hasSelect="hasSelect"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <add-btn @handleForm="handleForm"></add-btn>
              <modify-btn @handleForm="handleForm"></modify-btn>
              <delete-btn @deleteData="deleteData"></delete-btn>
              <batch-import-btn @batchImport="batchImport"></batch-import-btn>
              <export-temp-btn @exportTemplate="exportTemplate"></export-temp-btn>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增弹出框 -->
    <h-msg-box v-model="addWin" width="1000" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="addClose">
      <p slot="header">
        <span>新增参数</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="140" ref="addForm" cols="6" class="h-form-search">
          <show-branch v-model="addForm.brchName" :showCheckBox="false" :required="isRequired"
                       :brchNo.sync="addForm.brchNo" :brchName.sync="addForm.brchName" className="h-form-three">
          </show-branch>
          <show-product v-model="addForm.prodName" @productSelectedChange="productSelectedChange($event, 'add')" :required="isRequired"
                        :clearProduct="clearProductName" clearValTag="add" className="h-form-three"></show-product>
          <bill-type v-model="addForm.billType" :dictList="billTypeList" :required="isRequired" :readOnly="readonlyByProdNo"
                     className="h-form-three"></bill-type>
          <is-rate-control :required="isRequired" :formObj="addForm" :YonList="YonList" className="h-form-three"
                           @changeByRateControlAdd="changeByRateControlAdd"></is-rate-control>
          <min-rate-pct :formObj="addForm" :controlRequiredAdd="rateControlRequiredAdd"></min-rate-pct>
          <max-rate-pct :formObj="addForm" :controlRequiredAdd="rateControlRequiredAdd"></max-rate-pct>
          <is-amt-control :required="isRequired" :formObj="addForm" :YonList="YonList" className="h-form-three"
                          @changeByAmtControlAdd="changeByAmtControlAdd"></is-amt-control>
          <common-type-field v-model="addForm.minBillAmt" :label="$t('m.i.billInfo.minBillMoneyByUnit')" prop="minBillAmt" :bigTips="false"
                             :required="amtControlRequiredAdd" className="h-form-three" :readonly="!amtControlRequiredAdd"  :validRules="minBillAmtRule"></common-type-field>
          <common-type-field v-model="addForm.maxBillAmt" :label="$t('m.i.billInfo.maxBillMoneyByUnit')" prop="maxBillAmt" :bigTips="false"
                             :required="amtControlRequiredAdd" className="h-form-three" :readonly="!amtControlRequiredAdd"  :validRules="maxBillAmtRule"></common-type-field>
          <is-control-acpt-type :required="isRequired" :formObj="addForm" :YonList="YonList"
                                @changeByAcptTypeAdd="changeByAcptTypeAdd"></is-control-acpt-type>
          <acpt-bank-types :formObj="addForm" :acptBankTypesList="acptBankTypesList"
                           :acptControlRequired="acptBankTypeRequiredAdd"></acpt-bank-types>
          <is-control-acpt-level :required="isRequired" :formObj="addForm" :YonList="YonList"
                                 @changeByAcptLevelAdd="changeByAcptLevelAdd"></is-control-acpt-level>
          <acpt-bank-levels :formObj="addForm" :acptBankLevelsList="acptBankLevelsList"
                            :levelControlRequired="acptBankLevelRequiredAdd"></acpt-bank-levels>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 点击修改弹出框 -->
    <h-msg-box v-model="editWin" width="1000" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editClose">
      <p slot="header">
        <span>修改参数</span>
      </p>
      <div>
        <h-form :model="editForm" :label-width="140" ref="editForm" cols="6" class="h-form-search">
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName" required class="h-form-three">
            <h-input v-model="editForm.brchName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodName" required class="h-form-three">
            <h-input v-model="editForm.prodName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required class="h-form-three">
            <h-select v-model="editForm.billType" placeholder="" :readonly="readonlyByProdNo">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.isRateControl')" prop="isRateControl" required class="h-form-three">
            <h-select v-model="editForm.isRateControl" placeholder="" >
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.minRatePct')" prop="minRatePct" :required="rateControlRequiredEdit" class="h-form-three"
                       :validRules="minRateRule">
            <h-input v-model="editForm.minRatePct" placeholder="利率范围0~100"
                     :readonly="!rateControlRequiredEdit"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.maxRatePct')" prop="maxRatePct" :required="rateControlRequiredEdit" class="h-form-three"
                       :validRules="maxRateRule">
            <h-input v-model="editForm.maxRatePct" placeholder="利率范围0~100"
                     :readonly="!rateControlRequiredEdit"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.isAmtControl')" prop="isAmtControl" required class="h-form-three">
            <h-select v-model="editForm.isAmtControl" placeholder="">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.minBillMoneyByUnit')" prop="minBillAmt" :required="amtControlRequiredEdit" class="h-form-three"
                       :validRules="minBillAmtRule">
            <h-typefield v-model="editForm.minBillAmt" type="money" placeholder="" integerNum="12"
                         :readonly="!amtControlRequiredEdit"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.maxBillMoneyByUnit')" prop="maxBillAmt" :required="amtControlRequiredEdit" class="h-form-three"
                       :validRules="maxBillAmtRule">
            <h-typefield v-model="editForm.maxBillAmt" type="money" placeholder="" integerNum="12"
                         :readonly="!amtControlRequiredEdit"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.isControlAcptType')" prop="isControlAcptType" required cols="3">
            <h-select v-model="editForm.isControlAcptType" placeholder="">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptBankType')" prop="acptBankTypes" :required="acptBankTypeRequiredEdit" cols="3">
            <h-select v-model="editForm.acptBankTypes" placeholder="" multiple :readonly="!acptBankTypeRequiredEdit" showTitle>
              <h-option v-for="item in acptBankTypesList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.isControlAcptLevel')" prop="isControlAcptLevel" required cols="3">
            <h-select v-model="editForm.isControlAcptLevel" placeholder="">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptTopBankLevel')" prop="acptBankLevels" :required="acptBankLevelRequiredEdit" cols="3">
            <h-select v-model="editForm.acptBankLevels" placeholder="" multiple :readonly="!acptBankLevelRequiredEdit" showTitle>
              <h-option v-for="item in acptBankLevelsList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="editClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formEdit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 机构名称选择弹窗框 -->
    <h-msg-box v-model="brchNameSelectWin" width="400" class="h-form-search-layer" :maximize="true"
               :mask-closable="false">
      <p slot="header">
        <span>机构号选择</span>
      </p>
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(brchTreeData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(brchTreeData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;height:300px">
          <h-tree :data="brchTreeData" ref='brchTreeData' class='h-tree-self' @on-toggle-expand="toggleExpand"></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="brchNameSelectWin=!brchNameSelectWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="brchNameAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 批量导入 -->
    <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "billAccessMain",
    data() {
      let formItem = {
        brchName: "",
        brchNo: "",
        prodName: ""
      };
      let addForm = {
        brchName: "",
        brchNo: "",
        billType: "",
        prodNo: "",
        prodName: "",
        isRateControl: "",
        minRatePct: "",
        maxRatePct: "",
        isAmtControl: "",
        minBillAmt: "",
        maxBillAmt: "",
        isControlAcptType: "",
        acptBankTypes: [],
        isControlAcptLevel: "",
        acptBankLevels: []
      };
      let editForm = {
        brchName: "",
        brchNo: "",
        billType: "",
        prodName: "",
        prodNo: "",
        isRateControl: "",
        minRatePct: "",
        maxRatePct: "",
        isAmtControl: "",
        minBillAmt: "",
        maxBillAmt: "",
        isControlAcptType: "",
        acptBankTypes: [],
        isControlAcptLevel: "",
        acptBankLevels: []
      };
      let columns = [
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: false,
          align: "center"
        },
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.id'),
          key: "id",
          hiddenCol: true
        },
        {
          title: this.$t('m.i.common.brchNo'),
          key: "brchNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "brchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
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
          title: this.$t('m.i.bm.isRateControl'),
          key: "isRateControl",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isRateControl);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.bm.minRatePct'),
          key: "minRatePct",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.maxRatePct'),
          key: "maxRatePct",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.isAmtControl'),
          key: "isAmtControl",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isAmtControl);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.minBillMoney'),
          key: "minBillAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.minBillAmt === "" || params.row.minBillAmt === null) {
              return h("span", "");
            }
            let money = formatNumber(params.row.minBillAmt, 2, ",");
            return h("span", {
              domProps: {
                title: money
              }
            }, money);
          }
        },
        {
          title: this.$t('m.i.billInfo.maxBillMoney'),
          key: "maxBillAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.maxBillAmt === "" || params.row.maxBillAmt === null) {
              return h("span", "");
            }
            let money = formatNumber(params.row.maxBillAmt, 2, ",");
            return h("span", {
              domProps: {
                title: money
              }
            }, money);
          }
        },
        {
          title: this.$t('m.i.bm.isControlAcptType'),
          key: "isControlAcptType",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isControlAcptType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.acptBankType'),
          key: "acptBankTypes",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "bankType", params.row.acptBankTypes);
            return h("span", {
              domProps: {
                title: list
              }
            }, list);
          }
        },
        {
          title: this.$t('m.i.bm.isControlAcptLevel'),
          key: "isControlAcptLevel",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isControlAcptLevel);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.billInfo.acptTopBankLevel'),
          key: "acptBankLevels",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevels);
            return h("span", {
              domProps: {
                title: list
              }
            }, list);
          }
        }
      ];
      let pageInfo = {
        pageNo: 1,
        pageSize: 10
      };
      //按钮权限
      let authObj = {
        billAccessAdd: true,
        billAccessModify: true,
        billAccessDel: true,
        billAccessExport: true,
        billAccessImport: true
      };
      return {
        formItem: formItem,
        addForm: addForm,
        editForm: editForm,
        columns: columns,
        pageInfo: pageInfo,
        authObj: authObj,
        hasSelect: false,
        readonlyByProdNo: false,
        minRateRule: [{
          test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率为0~100之间的数，小数位不超过4位"
        }],
        maxRateRule: [{
          test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率为0~100之间的数，小数位不超过4位"
        }],
        minBillAmtRule: [{
          test: /^([1-9]\d{0,19}|0)([.]?|(\.\d{1,2})?)$/,
          trigger: "blur",
          message: "金额为大于等于0的不超过20位的数字，且小数位不超过两位"
        }],
        maxBillAmtRule: [{
          test: /^([1-9]\d{0,19}|0)([.]?|(\.\d{1,2})?)$/,
          trigger: "blur",
          message: "金额为大于等于0的不超过20位的数字，且小数位不超过两位"
        }],
        isDisabled: true,
        isExpandDisabled: true,
        isNotExpandDisabled: false,
        flag: false,
        brchNameSelectWin: false,
        brchTreeData: [],
        importWin: false,
        productTreeData: [],
        type: null,
        addWin: false,
        editWin: false,
        submitFlag: false,
        readonly: false,
        rateControlRequiredAdd: true,
        amtControlRequiredAdd: true,
        acptBankTypeRequiredAdd: true,
        acptBankLevelRequiredAdd: true,
        rateControlRequiredEdit: true,
        amtControlRequiredEdit: true,
        acptBankTypeRequiredEdit: true,
        acptBankLevelRequiredEdit: true,
        uploadFileName: "",
        fileId: "",
        formType: "addForm",
        isRequired: true,
        dictMap: new Map(),
        billTypeList: [],
        YonList: [],
        acptBankTypesList: [],
        acptBankLevelsList: [],
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/bm/prod/rate/billAccessMain/func_batchAddProductRate",  //excel数据导入接口
          uploadParams: {}       //调用excel数据解析接口时附带的额外参数
        },
        branchType: ""
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,bankType,Yon,bankLevel").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.YonList = res.get("Yon");
        this.acptBankTypesList = res.get("bankType");
        this.acptBankLevelsList = res.get("bankLevel");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      changeByRateControlAdd() {
        if (this.addForm.isRateControl === "0") {
          this.rateControlRequiredAdd = false;
          this.addForm.minRatePct = "";
          this.addForm.maxRatePct = "";
        } else {
          this.rateControlRequiredAdd = true;
        }
      },
      changeByAmtControlAdd() {
        if (this.addForm.isAmtControl === "0") {
          this.amtControlRequiredAdd = false;
          this.addForm.minBillAmt = "";
          this.addForm.maxBillAmt = "";
        } else {
          this.amtControlRequiredAdd = true;
        }
      },
      changeByAcptTypeAdd() {
        if (this.addForm.isControlAcptType === "0") {
          this.acptBankTypeRequiredAdd = false;
          this.addForm.acptBankTypes = [];
        } else {
          this.acptBankTypeRequiredAdd = true;
        }
      },
      changeByAcptLevelAdd() {
        if (this.addForm.isControlAcptLevel === "0") {
          this.acptBankLevelRequiredAdd = false;
          this.addForm.acptBankLevels = [];
        } else {
          this.acptBankLevelRequiredAdd = true;
        }
      },
      changeByRateControlEdit(val) {
        if (val === "0") {
          this.rateControlRequiredEdit = false;
          this.editForm.minRatePct = "";
          this.editForm.maxRatePct = "";
        } else {
          this.rateControlRequiredEdit = true;
        }
      },
      changeByAmtControlEdit(val) {
        if (val === "0") {
          this.amtControlRequiredEdit = false;
          this.editForm.minBillAmt = "";
          this.editForm.maxBillAmt = "";
        } else {
          this.amtControlRequiredEdit = true;
        }
      },
      changeByAcptTypeEdit(val) {
        if (val === "0") {
          this.acptBankTypeRequiredEdit = false;
          this.editForm.acptBankTypes = [];
        } else {
          this.acptBankTypeRequiredEdit = true;
        }
      },
      changeByAcptLevelEdit(val) {
        if (val === "0") {
          this.acptBankLevelRequiredEdit = false;
          this.editForm.acptBankLevels = [];
        } else {
          this.acptBankLevelRequiredEdit = true;
        }
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = false;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = true;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
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
      //查询
      handleSearch() {
        this.hasSelect = true;
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.brchNo = "";
        this.formItem.brchName = "";
        this.$refs.formItem.resetFields();
      },
      //选择机构名称弹出框确认
      brchNameAdd() {
        let arr = this.$refs["brchTreeData"].getSelectedNodes();
        if (arr.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.branchType === "add") {
          this.addForm.brchName = arr[0].title;
          this.addForm.brchNo = arr[0].id;
        } else if (this.branchType === "query") {
          this.formItem.brchName = arr[0].title;
          this.formItem.brchNo = arr[0].id;
        }
        this.brchNameSelectWin = false;
      },
      clearProductName(str) {
        if (str === "query") {
          this.formItem.prodName = "";
        } else if (str === "add") {
          this.addForm.prodName = "";
          this.addForm.prodNo = "";
          this.addForm.billType = "";
        }
      },
      //选择产品名称弹出框确认
      productSelectedChange(arr, str) {
        if (str === "query") {
          this.formItem.prodName = arr[0].title;
        } else if (str === "add") {
          this.addForm.prodName = arr[0].title;
          this.addForm.prodNo = arr[0].id;
          let prodNo = this.addForm.prodNo.toString();
          if (prodNo.length === 8 && prodNo.substring(0, 2) === "01" && prodNo.charAt(prodNo.length - 1) === "1") {
            this.readonlyByProdNo = true;
            this.addForm.billType = "AC01";
          } else if (prodNo.length === 8 && prodNo.substring(0, 2) === "01" && prodNo.charAt(prodNo.length - 1) === "2") {
            this.readonlyByProdNo = true;
            this.addForm.billType = "AC02";
          } else {
            this.readonlyByProdNo = false;
            this.addForm.billType = "";
          }
        }
      },
      //新增、修改
      handleForm(type) {
        this.type = type;
        let selects = this.$refs.datagrid.selects;
        if (this.type === "modify" && selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.type === "modify" && selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.type === "modify") {
          let id = selects[0].id;
          post({ id: id }, "/bm/prod/rate/billAccessMain/func_findProductRate").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.editWin = true;
                this.$nextTick(() => {
                  this.editForm.id = res.data.retData.id;
                  this.editForm.brchNo = res.data.retData.brchNo;
                  this.editForm.brchName = res.data.retData.brchName;
                  this.editForm.prodNo = res.data.retData.prodNo;
                  this.editForm.prodName = res.data.retData.prodName;
                  this.editForm.billType = res.data.retData.billType;
                  this.editForm.isRateControl = res.data.retData.isRateControl;
                  this.editForm.minRatePct = res.data.retData.minRatePct;
                  this.editForm.maxRatePct = res.data.retData.maxRatePct;
                  this.editForm.isAmtControl = res.data.retData.isAmtControl;
                  this.editForm.minBillAmt = res.data.retData.minBillAmt;
                  this.editForm.maxBillAmt = res.data.retData.maxBillAmt;
                  this.editForm.isControlAcptType = res.data.retData.isControlAcptType;
                  this.editForm.isControlAcptLevel = res.data.retData.isControlAcptLevel;
                  if (res.data.retData.acptBankTypes === "" || res.data.retData.acptBankTypes === null) {
                    this.editForm.acptBankTypes = [];
                  } else {
                    this.editForm.acptBankTypes = res.data.retData.acptBankTypes.split(",");
                  }
                  if (res.data.retData.acptBankLevels === "" || res.data.retData.acptBankLevels === null) {
                    this.editForm.acptBankLevels = "";
                  } else {
                    this.editForm.acptBankLevels = res.data.retData.acptBankLevels.split(",");
                  }
                  let prodNo = this.editForm.prodNo.toString();
                  if (prodNo.length === 8 && prodNo.substring(0, 2) === "01" && prodNo.charAt(prodNo.length - 1) === "1") {
                    this.readonlyByProdNo = true;
                  } else if (prodNo.length === 8 && prodNo.substring(0, 2) === "01" && prodNo.charAt(prodNo.length - 1) === "2") {
                    this.readonlyByProdNo = true;
                  } else {
                    this.readonlyByProdNo = false;
                  }
                });
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.addWin = true;
          this.addReset();
        }
      },
      //新增关闭
      addClose() {
        this.addWin = false;
        this.$refs.addForm.resetFields();
        this.handleSearch();
      },
      // 新增页面提交
      formAdd() {
        if ((this.addForm.isAmtControl === "1") && (Number(this.addForm.minBillAmt) >= Number(this.addForm.maxBillAmt))) {
          this.$msgTip.info(this, { info: this.$t("最小票据金额必须小于最大票据金额!") });
          return;
        }
        if ((this.addForm.isRateControl === "1") && (Number(this.addForm.minRatePct) >= Number(this.addForm.maxRatePct))) {
          this.$msgTip.info(this, { info: this.$t("最小年利率必须小于最大年利率!") });
          return;
        }
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = "/bm/prod/rate/billAccessMain/func_addProductRate";
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.addClose();
                  this.hasSelect = true;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
      //修改关闭
      editClose() {
        this.editWin = false;
        this.$refs.editForm.resetFields();
        this.handleSearch();
      },
      // 修改页面提交
      formEdit() {
        if (this.editForm.minBillAmt === 0) {
          this.editForm.minBillAmt = "0";
        }
        if ((this.editForm.isAmtControl === "1") && (Number(this.editForm.minBillAmt) >= Number(this.editForm.maxBillAmt))) {
          this.$msgTip.info(this, { info: this.$t("最小票据金额必须小于最大票据金额!") });
          return;
        }
        if ((this.editForm.isRateControl === "1") && (Number(this.editForm.minRatePct) >= Number(this.editForm.maxRatePct))) {
          this.$msgTip.info(this, { info: this.$t("最小年利率必须小于最大年利率!") });
          return;
        }
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            let url = "/bm/prod/rate/billAccessMain/func_updateProductRate";
            this.submitFlag = true;
            post(this.editForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.editWin = false;
                  this.hasSelect = true;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
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
      //重置新增窗口
      addReset() {
        this.rateControlRequiredAdd = true;
        this.amtControlRequiredAdd = true;
        this.acptBankTypeRequiredAdd = true;
        this.acptBankLevelRequiredAdd = true;
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.id = "";
        });
      },
      //删除
      deleteData() {
        if (this.$refs.datagrid.selects.length == 0) {
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
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ idList: ids }, "/bm/prod/rate/billAccessMain/func_delProductRate").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.hasSelect = true;
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //导出模板
      exportTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/bm/prod/rate/billAccessMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },

      //批量导入
      batchImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      recursiveAssigNode(menuTreeData, arr) {
        this.flag = false;
        for (let i = 0; i < menuTreeData.length; i++) {
          if (this.flag) {
            break;
          }
          if (menuTreeData[i].id === arr.id) {
            menuTreeData[i] = arr;
            this.flag = true;
            break;
          }
          if (menuTreeData[i].children) {
            this.recursiveAssigNode(menuTreeData[i].children, arr)
          }
        }
      },
      isAllExpand(arr) {
        this.flag = true;
        for (let i = 0; i < arr.length; i++) {
          if (!this.flag) {
            break;
          }
          if (arr[i].expand === false && arr[i].children) {
            this.flag = false;
            break;
          }
          if (arr[i].children) {
            this.isAllExpand(arr[i].children)
          }
        }
      },
      toggleExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.brchTreeData, arr);
        this.isAllExpand(this.brchTreeData);
        // 完全收缩
        for (let i = 0; i < this.brchTreeData.length; i++) {
          if (this.brchTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.brchTreeData.length) {
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
          return;
        }
        if(!this.flag){
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = false;
        }else{
          this.isExpandDisabled = true;
          this.isNotExpandDisabled = false;
        }

      },
    },
    watch:{
      'editForm.isRateControl'(val){
        this.changeByRateControlEdit(val);
      },
      'editForm.isAmtControl'(val){
        this.changeByAmtControlEdit(val);
      },
      'editForm.isControlAcptType'(val){
        this.changeByAcptTypeEdit(val);
      },
      'editForm.isControlAcptLevel'(val){
        this.changeByAcptLevelEdit(val)
      }
    }
  };
</script>

