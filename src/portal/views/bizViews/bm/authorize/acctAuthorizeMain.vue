<template>
  <div class="layout">
    <!-- 主页面 -->
    <div v-if="mainVue">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <div class="h-form-search-box">
              <!-- 查询表单 -->
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <show-branch v-model="formItem.createBrchNameList" :label="$t('m.i.common.flowStartBrch')" prop="createBrchNameList"
                               title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.createBrchNoList" :brchName.sync="formItem.createBrchNameList" >
                  </show-branch>
                  <h-form-item prop="prodName" :label="$t('m.i.common.prodName')">
                    <h-input v-model="formItem.prodName" placeholder="" icon="android-search"
                             @on-click="queryProductName()" readonly clearable @on-clear="clearProductName()"></h-input>
                  </h-form-item>
                  <h-form-item prop="createTellerName" :label="$t('m.i.bm.createTellerName')">
                    <h-input v-model="formItem.createTellerName" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="operDt" :label="$t('m.i.common.operDt')">
                    <h-date-picker type="date" v-model="formItem.operDt" placeholder="" showFormat
                                   @on-change="handleDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
            </div>
            <!-- 数据展示表格 -->
            <h-datagrid :columns="columns"
                        :autoLoad="false"
                        highlightRow
                        url="/pc/acct/authorize/func_pageQueryAcctAuthorizeList"
                        :bindForm="formItem"
                        :onCurrentChange="onCurrentChange"
                        :onCurrentChangeCancel="onCurrentChangeCancel"
                        :auto-load="false"
                        ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="showDetails()">{{$t("m.i.common.view")}}</h-button>
              </div>
            </h-datagrid>

            <!-- 产品名称选择弹窗框 -->
            <h-msg-box v-model="prodNameSelectWin" width="400" class="h-form-search-layer" :maximize="true"
                       :mask-closable="false" @on-maximize="getTreeHeight($event, 'prodNameSelectMsg')" ref="prodNameSelectMsg">
              <p slot="header">
                <span>产品号选择</span>
              </p>
              <div class="h-tree-search">
                <div class="h-modal-header-wrapper">
                  <div class="h-modal-header-btn">
                    <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(productTreeData)'>
                      {{$t("m.i.common.expand")}}
                    </h-button>
                    <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(productTreeData)'>
                      {{$t("m.i.common.noExpand")}}
                    </h-button>
                  </div>
                </div>
                <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
                  <h-tree :data="productTreeData" ref='productTreeData' class='h-tree-self' @on-toggle-expand="toggleExpand"></h-tree>
                </div>
              </div>
              <!-- 弹出框模式底部按钮 -->
              <div slot="footer">
                <h-button type="ghost" @click="prodNameSelectWin=!prodNameSelectWin">{{$t("m.i.common.close")}}
                </h-button>
                <h-button type="primary" @click="productNameAdd()">{{$t("m.i.common.commit")}}</h-button>
              </div>
            </h-msg-box>
          </div>
        </h-col>
      </h-row>
    </div>
    <!-- 子页面 -->
    <div v-if="billManagerVue">
      <div class="text-wrap mb-10">
      </div>
      <component :is="batchAndBillInfo" :listIds="this.listIds" :batchId="this.batchId" :authorizeAmt="this.authorizeAmt" :id="this.id" :acctType="this.acctType" :isShow="infoShow" :billClass="billClass" @returnMain="returnMain"></component>
    </div>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,formatTime } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "acctAuthorizeMain",
    components: {
    },
    data() {
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
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
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.bm.flowNumber"),
          key: "id",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.acctType"),
          key: "acctType",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.acctType==='1') return h('span','记账')
            else if(params.row.acctType==='2') return h('span','冲正')
          }
        },
        {
          title: this.$t("m.i.common.operDt"),
          key: "operDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.operDt == null || params.row.operDt === "") {
              return "";
            }
            let date = this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.authorizeAmt"),
          key: "authorizeAmt",
          hiddenCol: false,
          render: (h, params) => {
            let authorizeAmt = formatNumber(params.row.authorizeAmt, 2, ",");
            return h("span", {
              domProps: {
                title: authorizeAmt
              }
            }, authorizeAmt);
          }
        },
        {
          title: this.$t("m.i.bm.createTellerName"),
          key: "createTellerName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.flowStartBrch"),
          key: "createBrchName",
          hiddenCol: false,
          sortable: true
        },
      ];
      return {
        formItem: {
          prodName: "",
          prodNo: "",
          createTellerName: "",
          operDt: "",
          createBrchNoList:JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          createBrchNameList:JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        },
        columns: columns,
        productTreeData: [],
        prodNameList: "",
        prodNameSelectWin: false,
        isDisabled: true,
        isExpandDisabled: true,
        isNotExpandDisabled: false,
        flag:false,
        infoShow: false,
        dictMap: new Map(),
        viewCurrentSelectList: [],
        batchAndBillInfoUrl: "",
        mainVue: true,
        billManagerVue: false,
        batchAndBillInfo: "",
        auditList: [],
        auditWin: false,
        id: "",
        acctType:"",
        batchId: "",
        authorizeAmt:"",
        listIds: "",
        billClass:"",
        showUser: false,
        selectData: null,
        syncOperMode:"",
        selectUserData: null,
        showAttachWin: false,
        attachId: "",
        mTreeHeight: 300,
        ifShowMore: false,
        temp: deepClone(columns),
      };
    },
    computed: {
      valueOperTm() {
        return function(value) {
          if (value.toString().length < 6) {
            let operTm = value + "";
            for (let i = 0; i < (6 - value.toString().length); i++) {
              operTm = "0" + operTm;
            }
            let date = this.$moment(operTm, "HH:mm:ss").format("HH:mm:ss");
            return date;
          } else {
            let date = this.$moment(value, "HH:mm:ss").format("HH:mm:ss");
            return date;
          }
        };
      },
      valueOperDt() {
        return function(value) {
          let month = value.toString().substring(4, 6);
          let day = value.toString().substring(6, 8);
          return month + "-" + day;
        };

      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getDictListByGroups("AuditFlow,AcctAuthorize,AuditStatus,AuditStationType").then(res => {
          this.dictMap = res.get("map");
        });
        this.formItem.prodNo = this.$route.query.prodNo;
        this.formItem.prodName = this.$route.query.prodName;
        this.$refs.datagrid.dataChange(1);
      });
    },
    watch: {
      "$route.path": function(val) {
        if (val === "/bm/audit/prodAuditMain") {
          if (this.$route.query.prodNo) {
            this.formItem.prodNo = this.$route.query.prodNo;
            this.formItem.prodName = this.$route.query.prodName;
            this.$refs.datagrid.dataChange(1);
          }
        }
      }
    },
    methods: {
      getTreeHeight(isMax, msgRef) {
        this.$nextTick(() => {
          if(isMax) {
            let headerHeight = this.$refs[msgRef].$refs.msgHeader.offsetHeight;
            let footerHeight = this.$refs[msgRef].$refs.msgFooter.offsetHeight;
            let headerBtnHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header-wrapper')[0].offsetHeight;
            this.mTreeHeight = window.innerHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
          } else {
            this.mTreeHeight = 300;
          }
        });
      },
      handleDateChange(value) {
        this.formItem.operDt = value.replace(/-/g, "");
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
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.prodName = "";
        this.formItem.prodNo = "";
        this.formItem.createTellerName = "";
        this.formItem.operDt = "";
        this.formItem.createBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.createBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel() {
        this.selectData = null;
      },
      onCurrentUserChange(currentRow, oldCurrentRow, _index) {
        this.selectUserData = currentRow;
      },
      onCurrentUserChangeCancel() {
        this.selectUserData = null;
      },
      //选择产品名称
      queryProductName() {
        post({}, "/bm/prod/product/queryProductMaintenanceTree").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.productTreeData = data;
            this.expandTree(this.productTreeData);
          }
          this.prodNameSelectWin = true;
        }).catch(error => {
          this.$hMessage.error(this.$t("m.i.common.netError") + error);
        });
      },
      clearProductName() {
        this.formItem.prodName = "";
        this.formItem.prodNo = "";
      },
      //选择产品名称弹出框确认
      productNameAdd() {
        let arr = this.$refs["productTreeData"].getSelectedNodes();
        if (arr.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.prodName = arr[0].title;
        this.formItem.prodNo = arr[0].id;
        this.prodNameSelectWin = false;
      },
      //查看
      showDetails() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
        let lockUserNo = this.selectData.lockUserNo;
        if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
          if (lockUserNo !== userNo ) {
            this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
            return;
          }
        }
        this.id = this.selectData.id;
        this.acctType = this.selectData.acctType;
        this.authorizeAmt = this.selectData.authorizeAmt;//授权金额
        post({
          id: this.id,
          queryType: "1"
        }, "/pc/acct/authorize/func_getAcctAuthDataByAuthorizeId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.batchId = res.data.retData.batchId;
              let ids = "";
              for (let i = 0; i < res.data.retData.ids.length; i++) {
                ids += res.data.retData.ids[i];
                if (i < res.data.retData.ids.length - 1) {
                  ids += ",";
                }
              }
              this.listIds = res.data.retData.ids;
              this.billClass= res.data.retData.billClass;
              let flowFuncNo = this.selectData.flowFuncNo + "-" + this.selectData.billClass;
              this.batchAndBillInfoUrl = this.getDictValueFromMap(this.dictMap, "AcctAuthorize", flowFuncNo);
              this.openBatchAndBillInfo();
              this.mainVue = false;
              this.billManagerVue = true;
              this.infoShow = true;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      openBatchAndBillInfo() {
        this.batchAndBillInfo = this._getAuditComponentByUrl(this.batchAndBillInfoUrl);
      },
      //查看子页面功能逻辑
      //返回
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.selectData = null;
        this.resetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.dataChange(1);
        });
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
        this.recursiveAssigNode(this.productTreeData, arr);
        this.isAllExpand(this.productTreeData);
        // 完全收缩
        for (let i = 0; i < this.productTreeData.length; i++) {
          if (this.productTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.productTreeData.length) {
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
    }
  };
</script>

<style scoped>

</style>
