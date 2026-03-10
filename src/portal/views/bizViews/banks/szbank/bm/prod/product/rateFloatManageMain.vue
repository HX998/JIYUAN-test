<!--利率浮动管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="queryForm" :label-width="90" ref="queryForm" cols="4" class="h-form-search">
                <h-form-item prop="activeDt" :label="$t('m.i.common.activeDt')">
                  <h-date-picker type="date" v-model="queryForm.activeDt" placeholder=""
                                 @on-change="handleDateChange"
                                 showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">

                  <h-button type="primary" @click="handleSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid
                :columns="rateFloatColumns"
                highlightRow
                url="/banks/szbank/bm/prod/product/rateFloatManageMain/func_queryRateFloatInfo"
                :bindForm="queryForm"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="rateFloatOpenWin('add')">
                    {{ $t("m.i.common.add") }}
                  </h-button>
                  <h-button type="primary" @click="rateFloatOpenWin('modify')">
                    {{ $t("m.i.common.modify") }}
                  </h-button>
                  <h-button type="primary" @click="rateFloatDelete()">
                    {{ $t("m.i.common.delete") }}
                  </h-button>
                  <h-button type="primary" @click="rateFloatCheck()">
                    {{ $t("m.i.common.submitCheckAuth") }}
                  </h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>

    <h-msg-box v-model="rateFloatAddOrEditWin" :addForm="addForm" width="400" class="h-form-search-layer" :maximize="true"
               :mask-closable="false"
               @on-close="rateFloatAddOrEditWinClose">
      <p slot="header" v-if="addForm.optType=='modify'">{{ $t("m.i.common.modify") }}</p>
      <p slot="header" v-else>{{ $t("m.i.common.add") }}</p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.activeDt')" required prop="activeDt">
            <h-date-picker type="date" :disabled="addForm.optType=='modify'" v-model="addForm.activeDt"
                           placeholder=""
                           @on-change="handleAddDateChange"
                           showFormat :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.rateFloatAmt')" :required="true" :validRules="rateFloatRule" prop="rateFloat">
            <h-input v-model="addForm.rateFloat" placeholder=""></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="rateFloatAddOrEditWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" v-if="addForm.optType=='modify'" @click="infoAddOrModify(addForm.optType)">
          {{ $t("m.i.common.confirm") }}
        </h-button>
        <h-button type="primary" v-else @click="infoAddOrModify(addForm.optType)">{{ $t("m.i.common.confirm") }}
        </h-button>

      </div>
    </h-msg-box>
  </div>
</template>

<script>
import {post, on, off, formatNumber, accMul, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "rateFloatManageMain",
  data() {


    return {
      dictMap : new Map(),
      isList: [],
      rateFloatRule: [{
        test: /^(((\d{1,3}|-\d{1,3})(\.\d{1,4})?)|1000|-1000)$/,
        trigger: 'blur',
        message: '利率浮动值为大于-1000且小等于1000之间的数，小数位不超过4位'
      }],
      addForm: {
        id: "",
        optType: this.optType,
        activeDt: "",
        rateFloat: "",
        /*ftpType: "",
        ftpTypeList: [],*/
      },

      currentSelectRow : [],
      rateFloatAddOrEditWin: false,
      ifShowMore: false,
     /* ftpTypeList: [],*/
      queryForm: {
        activeDt: ""
      },
      rateFloatColumns: [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        }, {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        }, {
          title: this.$t("m.i.common.activeDt"),
          key: "activeDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.activeDt == null || params.row.activeDt === "") {
              return "";
            }
            let date = this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        }, {
          title: this.$t("m.i.bm.rateFloatAmt"),
          key: "rateFloat",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let rateFloat = accMul(params.row.rateFloat, 1);
            return h("p", rateFloat);
          }
        }, {
          title: this.$t("m.i.common.createDt"),
          key: "createTime",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.createTime == null ? "" : this.$moment(params.row.createTime, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        }, {
          title: this.$t("m.i.common.createFtpTellerNo"),
          key: "createTellerName",
          hiddenCol: false
        }, {
          title: this.$t("m.i.common.createBrch"),
          key: "createBrchName",
          hiddenCol: false
        }, {
          title: this.$t('m.i.pl.updateTime'),
          key: "updateDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.updateDt == null ? "" : this.$moment(params.row.updateDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.common.updateFtpTellerNo"),
          key: "operTellerName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.activeFlag"),
          key: "activeFlag",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.activeFlag));
          }
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      getDictListByGroups("FtpType,Yon").then(res => {
        this.ftpTypeList = res.get("FtpType");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      this.getParams();
    });
  },
  methods: {
    handleDateChange(value) {
      this.queryForm.activeDt = value.replace(/-/g, "");
    },
    handleAddDateChange(value) {
      this.addForm.activeDt = value.replace(/-/g, "");
    },
    //表单查询
    handleSearch(pageNo) {
      this.currentSelectRow = [];
      this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
    },
    //重置表单查询结果
    resetSearch() {
      this.queryForm.drwrCustNo = "";
      this.$refs.queryForm.resetFields();
    },
    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = [];
    },
    //新增、修改
    rateFloatOpenWin(str) {
      if (str === "modify") {
        let x = this.currentSelectRow;
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        /** if("1" === this.currentSelectRow.activeFlag){
          this.$msgTip.info(this, { info: this.$t("已生效数据不允许修改!") });
          return;
        }**/
        this.addForm.id = this.currentSelectRow.id;
      } else {
        this.addForm.id = null;
      }
      this.assembleParams(str);
    },
    //关闭新增、修改弹窗
    rateFloatAddOrEditWinClose() {
      this.$refs.addForm.resetFields();
      this.addForm = {};
      this.rateFloatAddOrEditWin = false;
      let pageNo = this.addForm.optType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
      this.handleSearch(pageNo);
    },
    //删除
    rateFloatDelete() {
      if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }
    },
    infoAddOrModify(optType) {
      let url = this.optType === "add" ? "/banks/szbank/bm/prod/product/rateFloatManageMain/func_addRateFloatManageInfo" : "/banks/szbank/bm/prod/product/rateFloatManageMain/func_editRateFloatManageInfo";
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          if (optType === 'modify') {
            this.addForm.activeDt = this.$moment(this.addForm.activeDt).format("YYYYMMDD");
            post(this.addForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.rateFloatAddOrEditWin = false;
                  this.rateFloatAddOrEditWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              }
            });
          } else {
            post(this.addForm, url).then(res => {
              if (this.addForm.rateFloat === "") {
                this.$msgTip.info(this, {info: "利率为0到100的数字，小数位不超过4位！"});
              }
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.rateFloatAddOrEditWin = false;
                  this.rateFloatAddOrEditWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              }
            });
          }
        }
      });
    },
    handleDel() {
      let id = this.currentSelectRow.id;
      let url = "/banks/szbank/bm/prod/product/rateFloatManageMain/func_deleteRateFloatManageInfo";
      post({id: id, deleteFlag: "1"}, url).then(res => {
        if (res) {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        }
      });
    },
    rateFloatCheck(){
      if (this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      if(!this.currentSelectRow.operTellerNo && userInfo.userNo === this.currentSelectRow.createTellerNo){
        this.$msgTip.info(this, { info: this.$t("复核岗不可和经办岗为同一操作员!") });
        return;
      }
      if(this.currentSelectRow.operTellerNo && userInfo.userNo === this.currentSelectRow.operTellerNo){
        this.$msgTip.info(this, { info: this.$t("复核岗不可和经办岗为同一操作员!") });
        return;
      }
      if("1" === this.currentSelectRow.activeFlag){
        this.$msgTip.info(this, { info: this.$t("已生效数据不允许再次复核!") });
        return;
      }
      let id = this.currentSelectRow.id;
      let url = "/banks/szbank/bm/prod/product/rateFloatManageMain/func_checkRateFloatManageInfo";
      post({id: id}, url).then(res => {
        if (res) {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        }
      });
    },
    assembleParams(optType) {
      this.addForm.optType = optType;
      if (optType === 'modify') {
        this.addForm.id = this.currentSelectRow.id;
        this.addForm.activeDt = this.currentSelectRow.activeDt + "";
        /*this.addForm.ftpTypeList = this.currentSelectRow.ftpType;*/
        this.addForm.rateFloat = this.currentSelectRow.rateFloat;
      }
      this.rateFloatAddOrEditWin = true;
    }
  }
}
;
</script>

<style scoped>

</style>
