<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="busiType" :label="$t('m.i.common.busiType')">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/prod/interest/delayRuleMain/func_queryDelayRuleByPage"
                      :bindForm="formItem"
                      :hasSelect="false"
                      rowSelect
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleFormAdd()">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleFormEdit()">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="deleteDelayRule()">{{$t("m.i.common.delete")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增弹出框 -->
    <h-msg-box v-model="addWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="addClose">
      <p slot="header">
        <span>新增计息规则</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="100" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" required>
            <h-select v-model="addForm.busiType" placeholder="" @on-change="changeByBusiTypeAdd()">
              <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="billClassRequired">
            <h-select v-model="addForm.billClass" placeholder="" @on-change="changeByBillClassAdd()"
                      :readonly="billClassReadonly">
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required>
            <h-select v-model="addForm.billType" placeholder="">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.executeMode')" prop="executeMode" required>
            <h-select v-model="addForm.executeMode" placeholder="" disabled>
              <h-option v-for="item in executeModeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.delayKind')" prop="delayKind" required>
            <h-select v-model="addForm.delayKind" placeholder="" @on-change="changeByDelayKindAdd()">
              <h-option value="0" v-show="delayKindTrans">不顺延</h-option>
              <h-option value="1">只顺延节假日</h-option>
              <h-option value="2" v-show="delayKindBillClass">只顺延异地</h-option>
              <h-option value="3" v-show="delayKindBillClass">先节假日后异地</h-option>
              <h-option value="4" v-show="delayKindBillClass">先异地后节假日</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.offsiteDelayDays')" prop="offsiteDelayDays" required v-if="offsiteDelayDaysShow">
            <h-typefield v-model="addForm.offsiteDelayDays" placeholder="" integerNum="8" suffixNum="0" nonNegative :divided="false"></h-typefield>
          </h-form-item>
          <show-branch v-model="addForm.belongBrchNo" :label="$t('m.i.bm.belongBrchName')" prop="belongBrchNo" required :showCheckBox="false"
                       title="所属机构" :brchNo.sync="addForm.belongBrchNo" :brchName.sync="addForm.belongBrchName" :msgBoxWin="addWin">
          </show-branch>
          <h-form-item :label="$t('m.i.bm.ruleDesc')" prop="ruleDesc"  class="h-form-height-auto" :validRules="ruleDescRule">
            <h-input v-model="addForm.ruleDesc" placeholder="" type="textarea"  :autosize="{minRows:2,maxRows:3}"  :canResize="false"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="delayRuleSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 点击修改弹出框 -->
    <h-msg-box v-model="editWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editClose">
      <p slot="header">
        <span>修改计息规则</span>
      </p>
      <div>
        <h-form :model="editForm" :label-width="100" ref="editForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" required>
            <h-select v-model="editForm.busiType" placeholder="" @on-change="changeByBusiTypeEdit()" readonly>
              <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="billClassRequired">
            <h-select v-model="editForm.billClass" placeholder="" @on-change="changeByBillClassEdit()" readonly>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required>
            <h-select v-model="editForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.executeMode')" prop="executeMode" required>
            <h-select v-model="editForm.executeMode" placeholder="" disabled>
              <h-option v-for="item in executeModeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.delayKind')" prop="delayKind" required>
            <h-select v-model="editForm.delayKind" placeholder="" @on-change="changeByDelayKindEdit()">
              <h-option value="0" v-show="delayKindTrans">不顺延</h-option>
              <h-option value="1">只顺延节假日</h-option>
              <h-option value="2" v-show="delayKindBillClass">只顺延异地</h-option>
              <h-option value="3" v-show="delayKindBillClass">先节假日后异地</h-option>
              <h-option value="4" v-show="delayKindBillClass">先异地后节假日</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.offsiteDelayDays')" prop="offsiteDelayDays" required v-if="offsiteDelayDaysShow">
            <h-typefield v-model="editForm.offsiteDelayDays" placeholder="" integerNum="8" suffixNum="0" nonNegative :divided="false"></h-typefield>
          </h-form-item>
          <show-branch v-model="editForm.belongBrchNo" :label="$t('m.i.bm.belongBrchName')" prop="belongBrchNo" required :showCheckBox="false"
                       title="所属机构" :brchNo.sync="editForm.belongBrchNo" :brchName.sync="editForm.belongBrchName" :msgBoxWin="editWin" :clearable="false">
          </show-branch>
          <h-form-item :label="$t('m.i.bm.ruleDesc')" prop="ruleDesc" class="h-form-height-auto" :validRules="ruleDescRule">
            <h-input v-model="editForm.ruleDesc" placeholder="" type="textarea" :autosize="{minRows:2,maxRows:3}"  :canResize="false"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="editClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="delayRuleSubmitEdit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "delayRuleMain",
    data() {
      return {
        formItem: {
          busiType: "",
          billClass: "",
          billType: ""
        },
        addForm: {
          busiType: "",
          billClass: "",
          billType: "",
          executeMode: "0",
          delayKind: "",
          offsiteDelayDays: "3",
          belongBrchNo: "",
          belongBrchName: "",
          ruleDesc: ""
        },
        editForm: {
          id: "",
          busiType: "",
          billClass: "",
          billType: "",
          executeMode: "",
          delayKind: "",
          offsiteDelayDays: "3",
          belongBrchNo: "",
          belongBrchName: "",
          ruleDesc: ""
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            align: "center",
            hiddenCol: false
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
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "delayBusiType", params.row.busiType);
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
            sortable: true,
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
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            sortable: true,
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
            title: this.$t('m.i.bm.executeMode'),
            key: "executeMode",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", this.getDictValueFromMap(this.dictMap, "executeMode", params.row.executeMode));
            }
          },
          {
            title: this.$t('m.i.bm.delayKind'),
            key: "delayKind",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "delayKind", params.row.delayKind);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.bm.offsiteDelayDays'),
            key: "offsiteDelayDays",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.belongBrchName'),
            key: "belongBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.ruleDesc'),
            key: "ruleDesc",
            hiddenCol: false
          }
        ],
        ruleDescRule: [{ test: /^.{0,80}$/, trigger: "blur", message: "规则描述长度不能超过80位" }],
        billClassRequired: true,
        delayKindBillClass: true,
        delayKindTrans: true,
        offsiteDelayDaysShow: false,
        billClassReadonly: false,
        isDisabled: true,
        type: null,
        addWin: false,
        editWin: false,
        submitFlag: false,
        dictMap: new Map(),
        busiTypeList: [],
        billClassList: [],
        billTypeList: [],
        executeModeList: [],
        mTreeHeight: 300
      };
    },
    components: {},
    mounted() {
      this.getDictListByGroups("delayBusiType,CDMedia,DraftTypeCode,executeMode,delayKind").then(res => {
        this.busiTypeList = res.get("delayBusiType");
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.executeModeList = res.get("executeMode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      changeByBillClassAdd() {
        if (this.addForm.billClass === "ME02") {
          this.delayKindBillClass = false;
        }
        if (this.addForm.billClass === "ME01") {
          this.delayKindBillClass = true;
        }
        if (this.addForm.billClass === "ME02") {
          if (this.addForm.delayKind === "2" || this.addForm.delayKind === "3" || this.addForm.delayKind === "4") {
            this.addForm.delayKind = "";
          }
        }
      },
      changeByBillClassEdit() {
        if (this.editForm.billClass === "ME02") {
          this.delayKindBillClass = false;
        }
        if (this.editForm.billClass === "ME01") {
          this.delayKindBillClass = true;
        }
        if (this.editForm.billClass === "ME02") {
          if (this.editForm.delayKind === "2" || this.editForm.delayKind === "3" || this.editForm.delayKind === "4") {
            this.editForm.delayKind = "";
          }
        }
      },
      changeByBusiTypeAdd() {
        if (this.addForm.busiType === "TRANS" || this.addForm.busiType === "CBST") {
          this.billClassRequired = false;
          this.addForm.delayKind = "";
          this.addForm.billClass = "";
          this.billClassReadonly = true;
          this.delayKindBillClass = false;
          this.delayKindTrans = false;
        } else {
          this.billClassRequired = true;
          this.billClassReadonly = false;
          this.delayKindBillClass = true;
          this.delayKindTrans = true;
        }
      },
      changeByBusiTypeEdit() {
        if (this.editForm.busiType === "TRANS" || this.editForm.busiType === "CBST") {
          this.billClassRequired = false;
          this.editForm.delayKind = "1";
          this.editForm.billClass = "";
          this.billClassReadonly = true;
          this.delayKindBillClass = false;
          this.delayKindTrans = false;
        } else {
          this.billClassRequired = true;
          this.billClassReadonly = false;
          this.delayKindBillClass = true;
          this.delayKindTrans = true;
        }
      },
      changeByDelayKindAdd() {
        if (this.addForm.delayKind === "2" || this.addForm.delayKind === "3" || this.addForm.delayKind === "4") {
          this.offsiteDelayDaysShow = true;
          this.addForm.offsiteDelayDays = "3";
        } else {
          this.offsiteDelayDaysShow = false;
        }
      },
      changeByDelayKindEdit() {
        if (this.editForm.delayKind === "2" || this.editForm.delayKind === "3" || this.editForm.delayKind === "4") {
          this.offsiteDelayDaysShow = true;
        } else {
          this.offsiteDelayDaysShow = false;
        }
      },
      //新增
      handleFormAdd() {
        this.type = "add";
        this.addWin = true;
        this.$nextTick(() => {
          this.addReset();
        });
      },
      //关闭
      addClose() {
        this.addWin = false;
        this.$refs.addForm.resetFields();
      },
      // 新增页面提交
      delayRuleSubmit() {
        if (this.addForm.delayKind === "0" || this.addForm.delayKind === "1") {
          this.addForm.offsiteDelayDays = "";
        }
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = "/bm/prod/interest/delayRuleMain/func_addDelayRule";
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.addClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
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
        this.billClassRequired = true;
        this.delayKindBillClass = true;
        this.delayKindTrans = true;
        this.offsiteDelayDaysShow = false;
        this.billClassReadonly = false;
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
        this.addForm.belongBrchNo = "";
        this.addForm.belongBrchName = "";
      },
      //修改
      handleFormEdit() {
        let list = this.$refs.datagrid.selectIds;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.type = "modify";
        this.delayKindBillClass = true;
        this.delayKindTrans = true;
        post({ id: list[0] }, "/bm/prod/interest/delayRuleMain/func_findDelayRuleById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.editForm.id = res.data.retData.id;
              this.editForm.busiType = res.data.retData.busiType;
              this.editForm.billClass = res.data.retData.billClass;
              this.editForm.billType = res.data.retData.billType;
              this.editForm.executeMode = res.data.retData.executeMode;
              this.editForm.delayKind = res.data.retData.delayKind;
              if (res.data.retData.offsiteDelayDays === "" || res.data.retData.offsiteDelayDays === null) {
                this.editForm.offsiteDelayDays = "3";
              } else {
                this.editForm.offsiteDelayDays = res.data.retData.offsiteDelayDays;
              }
              this.editForm.belongBrchName = res.data.retData.belongBrchName;
              this.editForm.belongBrchNo = res.data.retData.belongBrchNo;
              this.editForm.ruleDesc = res.data.retData.ruleDesc;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        this.editWin = true;
      },
      //修改提交
      delayRuleSubmitEdit() {
        if (this.editForm.delayKind === "0" || this.editForm.delayKind === "1") {
          this.editForm.offsiteDelayDays = "";
        }
        this.$refs["editForm"].validate(valid => {
          if (valid) {
            let url = "/bm/prod/interest/delayRuleMain/func_updateDelayRule";
            this.submitFlag = true;
            post(this.editForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.editClose();
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
      },
      //删除
      deleteDelayRule() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
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
        post({ ids: this.$refs.datagrid.selectIds }, "/bm/prod/interest/delayRuleMain/func_delDelayRule").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
