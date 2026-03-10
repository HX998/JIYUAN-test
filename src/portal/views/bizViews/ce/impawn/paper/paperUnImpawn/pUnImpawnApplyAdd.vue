<!--解质押申请-新增/修改申请-->
<template>
  <div>
    <h-msg-box v-model="tempImpawnAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" :footerHide="true" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'noCommit'">修改申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'hasCommit'">撤销申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <show-branch v-model="addOrEditForm.ownedBrchNo" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" title="机构名称"
                         :filterable="batchParams.batchType==='add'" :showCheckBox="false" v-show="this.licenseFlag" :msgBoxWin="tempImpawnAddOrEditWin"
                         :brchNo.sync="addOrEditForm.ownedBrchNo" :brchName.sync="addOrEditForm.ownedBrchName" :params="{authPath: this.$route.path}"
                         url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
            </show-branch>
            <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
              <h-input v-model="addOrEditForm.custNo" placeholder=""
                       :icon="batchParams.batchType==='add' ? 'android-search' : ''" @on-click="queryCustName()"
                       readonly></h-input>
            </h-form-item>
            <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
              <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required>
              <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly
                       :icon="batchParams.batchType==='add' ? 'android-search' : ''"
                       @on-click="queryCustAcctNo()"></h-input>
            </h-form-item>
            <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
              <h-select v-model="addOrEditForm.billType" placeholder="" :readonly="batchParams.batchType==='modify'" showTitle>
                <h-option v-for="item in batchParams.billTypeList" :value="item.key" :key="item.key">{{ item.value
                  }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="unimpawnDt" :label="$t('m.i.common.unImpawnDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.unimpawnDt" placeholder=""
                             @on-change="handleImpawnDtChange" showFormat :editable=false></h-date-picker>
            </h-form-item>
            <h-form-item prop="getWay" :label="$t('m.i.ce.releaseUse')" v-if="this.batchParams.billClass === 'ME01'">
              <h-input  v-model="addOrEditForm.getWay" placeholder=""  :canResize="false" :maxlength="100" :lengthByByte="false"></h-input>
            </h-form-item>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()" v-if="this.batchParams.isCommit === 'noCommit'">保存</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_billlist"
          :bindForm="formItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="impawnPickBill">挑票
            </h-button>
            <h-dropdown placement="bottom-start" @on-click="impawnBillDelete" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary" >{{$t('m.i.common.delete')}}<h-icon name="unfold"></h-icon></h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="selectDelete">{{$t('m.i.be.chooseDelete')}}</h-dropdown-item>
                <h-dropdown-item name="listDelete">{{$t('m.i.be.batchListDelete')}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t("m.i.common.submit")}}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">{{$t('m.i.ce.selectSubmit')}}</h-dropdown-item>
                <h-dropdown-item name="batch">{{$t("m.i.ce.batchSubmit")}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="impawnBillCancel">{{$t("m.i.common.cancel")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit" :licenseFlag="this.licenseFlag" :ownedBrchNo="this.addOrEditForm.ownedBrchNo"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.addOrEditForm.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--挑票窗口-->
    <p-un-impawn-pick-bill :unImpawnPickBillWin="unImpawnPickBillWin" @unImpawnPickBillChange="unImpawnPickBillChange"
                         :unImpawnPickBillParams="unImpawnPickBillParams"
                         @unImpawnPickBillWinClose="unImpawnPickBillWinClose"></p-un-impawn-pick-bill>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pUnImpawnApplyAdd",
    components: {
      PUnImpawnPickBill:()=>import(/* webpackChunkName: "ce/impawn/paper/paperUnImpawn/pUnImpawnPickBill" */`@/views/bizViews/ce/impawn/paper/paperUnImpawn/pUnImpawnPickBill`),
    },
    data() {
      return {
        batchId: "",
        addOrEditForm: {
          id: "",
          billClass: "",
          billType: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          unimpawnDt: "",
          getWay: "",
          ownedBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchName:this.$store.getters.userInfo.brchName,
          licenseFlag:false,
        },
        formItem: {
          batchId: "",
          funcNo: "",
          billClass: ""
        },
        addForm: {
          batchId: "",
          unImpawnPbApplDtos:[{
            billId:"",
            hldrId:"",
          }],
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
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
           title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            ellipsis: false,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          }
        ],
        //授权机构
        // brchNoWin:false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        //记录批次是否已保存
        hadBatchSave: false,
        //解质押挑票窗口
        unImpawnPickBillWin: false,
        unImpawnPickBillParams: {},
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        submitType : ""
      }
    },
    props: {
      licenseFlag:"",
      authPath:"",
      impawnAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          billTypeList: [],
          impawnBatchId: "",
          batchType: "",
          isCommit: "",
          funcNo: "",
          billClass: ""
        }
      }
    },
    computed: {
      tempImpawnAddOrEditWin: {
        get() {
          return this.impawnAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      impawnAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.impawnBatchId;
            this.addOrEditForm.billClass = this.batchParams.billClass;
            this.formItem.batchId = this.batchId;
            this.formItem.funcNo = this.batchParams.funcNo;
            this.formItem.billClass = this.batchParams.billClass;
            if (this.batchParams.batchType === "modify") {
              this.queryObjById();
              this.handleSearch();
            }
            if (this.batchParams.batchType === "add") {
              this.$refs.datagrid.tData = [];
              this.addOrEditForm.ownedBrchNo = this.$store.getters.userInfo.brchNo,
                this.addOrEditForm.ownedBrchName = this.$store.getters.userInfo.brchName,
                this.addOrEditForm.unimpawnDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //关闭弹窗
      handleClose() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.addOrEditForm.ownedBrchNo = userInfo.brchNo;
        this.addOrEditForm.ownedBrchName = userInfo.brchName;
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.addOrEditForm.getWay = "";
        this.hadBatchSave = false;
        this.$emit("impawnAddOrEditWinClose", "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //修改时根据票据批次Id查询票据批次信息
      queryObjById() {
        let params = { id: this.batchId, billClass: this.batchParams.billClass, funcNo: this.batchParams.funcNo };
        post(params, "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_getUnImpawnBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.custNo = obj.custNo;
              this.addOrEditForm.custName = obj.custName;
              this.addOrEditForm.custAcctNo = obj.custAcctNo;
              this.addOrEditForm.ownedBrchNo = obj.ownedBrchNo;
              this.addOrEditForm.ownedBrchName = obj.ownedBrchName;
              if (!!obj.unimpawnDt) {
                this.addOrEditForm.unimpawnDt = this.$moment(obj.unimpawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              if (this.batchParams.billClass === "ME01") {
                this.addOrEditForm.getWay = obj.getWay;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //查询客户信息
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.addOrEditForm.custName = info.custName;
        this.addOrEditForm.custNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.addOrEditForm.custAcctNo = info.custAcctNo;
        } else {
          this.addOrEditForm.custAcctNo = "";
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      handleImpawnDtChange(value) {
        this.addOrEditForm.unimpawnDt = value.replace(/-/g, "");
      },
      //保存批次信息
      formSave() {
        if(this.batchParams.batchType === "add"){
          if (this.$refs.datagrid.tData.length > 0) {
            this.$msgTip.info(this, { info: "该批次下已存在票据明细，不允许修改批次信息！" });
            return;
          }
        }
        this.addOrEditForm.unimpawnDt = this.addOrEditForm.unimpawnDt.replace(/-/g, "");
        if (this.addOrEditForm.unimpawnDt < window.sessionStorage.getItem("workDate")) {
          this.$msgTip.info(this, { info: "解质押日期必须大于或等于当前营业日期" });
          return;
        }
        //往后台传授权标志
        this.addOrEditForm.licenseFlag = this.licenseFlag;
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.batchParams.batchType === "add" ? "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_addBatch" : "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_updateBatch";
            if (this.hadBatchSave) {
              url = "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_updateBatch";
            }
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                    this.batchId = res.data.retData.id;
                    this.formItem.batchId = res.data.retData.id;
                    this.addOrEditForm.id = res.data.retData.id;
                  }
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.hadBatchSave = true;
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
      //弹出挑票窗口
      impawnPickBill() {
        if (this.batchParams.batchType === "add") {
          if (this.hadBatchSave) {
            this.jumpToPickBillWin();
          } else {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
        }
        if (this.batchParams.batchType === "modify") {
          this.jumpToPickBillWin();
        }
      },
      //跳转到挑票界面
      jumpToPickBillWin() {
        this.unImpawnPickBillParams.dictMap = this.batchParams.dictMap;
        this.unImpawnPickBillParams.billClass = this.batchParams.billClass;
        this.unImpawnPickBillParams.billType = this.addOrEditForm.billType;
        this.unImpawnPickBillParams.licenseFlag = this.licenseFlag;
        this.unImpawnPickBillParams.ownedBrchNo = this.addOrEditForm.ownedBrchNo;
        if (this.batchParams.billClass === "ME01") {
          this.unImpawnPickBillParams.custNo = this.addOrEditForm.custNo;
          this.unImpawnPickBillParams.custName = this.addOrEditForm.custName;
          this.unImpawnPickBillParams.custAcctNo = this.addOrEditForm.custAcctNo;
        }
        this.unImpawnPickBillWin = true;
      },
      //挑票界面根据弹框所选票进行赋值
      unImpawnPickBillChange(info) {
        let listIds = [];
        let unImpawnPbApplDtos = [];
        for (let i = 0; i < info.length; i++) {
          //listIds.push(info[i].listId);
          let ids = info[i].billId ;
          let hldrId = info[i].hldrId;
          let param = {billId:ids,hldrId: hldrId};
          unImpawnPbApplDtos.push(param);
        }
        this.addForm.unImpawnPbApplDtos = unImpawnPbApplDtos;
        this.addForm.batchId = this.batchId;
        //let params = { batchId: this.batchId, listIds: listIds };
        post(this.addForm, "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_addBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.unImpawnPickBillWin = false;
              this.$refs.datagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //挑票界面取消按钮
      unImpawnPickBillWinClose() {
        this.unImpawnPickBillParams = {};
        this.unImpawnPickBillWin = false;
      },
      //删除解质押明细
      impawnBillDelete(type) {
        if(type === "selectDelete"){
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let list = this.$refs.datagrid.selects;
          let unImpawnIds = [];
          for (let i = 0; i < list.length; i++) {
            unImpawnIds.push(list[i].id);
          }
          let params = {
            unImpawnIds: unImpawnIds.join(","),
            batchId: this.batchId,
          };
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.be.confirmDelBill") + "?",
            onOk: () => {
              this.handleDelete(params);
            }
          });
        } else if (type === "listDelete"){
          if (this.batchId === "") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if (this.$refs.datagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = {
            batchId: this.batchId,
          };
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.be.confirmDelBill") + "?",
            onOk: () => {
              this.handleDeleteBatch(params);
            }
          });
        }
      },
      handleDelete(params) {
        post(params, "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_deleteBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleDeleteBatch(params) {
        post(params, "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_deleteBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //批次提交或选择提交
      submit(type) {
        this.submitType = type;
        if (type === "select") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let unImpawnIds = [];
          for (let i = 0; i < list.length; i++) {
            unImpawnIds.push(list[i].id);
          }
          let params = {
            batchId: this.batchId,
            unImpawnIds: unImpawnIds.join(","),
            ownedBrchNo : this.addOrEditForm.ownedBrchNo,
            licenseFlag : this.licenseFlag,};
          this.handleSubmit(params);
        } else if (type === "batch") {
          if (this.batchId === "") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if(this.$refs.datagrid.tData.length === 0){
            this.$msgTip.info(this,{info:"该批次下无数据"});
            return;
          }
          let params = {
            batchId: this.batchId ,
            ownedBrchNo : this.addOrEditForm.ownedBrchNo,
            licenseFlag : this.licenseFlag,};
          this.handleSubmit(params);
        }
      },
      handleSubmit(params) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交申请吗?",
          onOk: () => {
            post(params, "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_submitApply").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.submitType === "batch") {
                    this.handleClose();
                  } else if (this.submitType === "select") {
                    if (this.$refs.datagrid.total === this.$refs.datagrid.selects.length) {
                      this.handleClose();
                    } else {
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.$refs.datagrid.selects = [];
                    }
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //撤销申请
      impawnBillCancel() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      handleCancelApplyBatch() {
        post({ id: this.batchId,ownedBrchNo : this.addOrEditForm.ownedBrchNo,
          licenseFlag : this.licenseFlag, }, "/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_cancelApply").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleClose();
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
