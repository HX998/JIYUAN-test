<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!-- 左侧树 -->
      <h-col :span="spanLeft" class="layout-menu-left">
        <div>
          <div class="h-modal-header-btn">
            <h-button type="primary" @click="handleExpandTree(productTreeData)" :disabled="isExpandDisabled">
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" @click="handleUnExpandTree(productTreeData)" :disabled="isNotExpandDisabled">
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
          <div class="h-sidebar-menutree-body">
            <h-tree :data="productTreeData" highlight-row ref="productTreeData" @on-select-change="queryByProdNo()"
                    :style="{height: mBarHeight-153 + 'px',overflow: 'auto'}" @on-toggle-expand="toggleExpand"></h-tree>
          </div>
        </div>
      </h-col>
      <h-col :span="spanRight" class="layout-menu-right">
        <div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :autoLoad="false"
            highlight-row
            :gridData="recordData"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handleAddForm('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="handleComfirm()">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="handleConfig()">{{$t("m.i.pc.configure")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800">
      <p slot="header">
        <span v-if="type=='add'">{{$t("m.i.common.add")}}</span>
        <span v-if="type=='modify'">{{$t("m.i.common.modify")}}</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.transName')" prop="transName" :required="isRequired">

            <h-input v-model="addForm.transName" :maxlength=16></h-input>

          </h-form-item>
          <h-form-item :label="$t('m.i.config.eventNo')" prop="eventNo" :required="isRequired">
            <h-select v-model="addForm.eventNo">
              <h-option v-for="item in eventNos" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.config.acctModel')" prop="acctMode" :required="isRequired">
            <h-select v-model="addForm.acctMode">
              <h-option v-for="item in acctModes" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.balanceFlag')" prop="balanceFlag" :required="isRequired">
            <h-select v-model="addForm.balanceFlag">
              <h-option v-for="item in balanceFlags" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.sceneExplain')" prop="sceneExplain">
            <h-select v-model="addForm.sceneExplain" multiple>
              <h-option v-for="item in sceneExplains" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <group-config :showGroupWin="showGroupWin" :prodNo="prodNo" :acctRecordId="id" :tranRow="currentSelectRow"
                  title="分录配置"
                  @showGroupWinClose="showGroupWinClose"></group-config>

  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexAcctRecord",
    data() {
      let reqUrl = "/pc/acct/acctConfig";
      return {
        formItem: {
          transEventNo: "",
          prodNo: "",
          eventNo: "",
          balanceFlag: "",
          acctMode: "",
          transName: "",
          id: "",
          sceneExplain: []
        },
        type: null,
        addOrEditWin: false,
        readonly: false,
        isRequired: true,
        addForm: {
          transEventNo: "",
          prodNo: "",
          eventNo: "",
          balanceFlag: "",
          acctMode: "",
          transName: "",
          id: "",
          sceneExplain: []
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center"
          }, {
            title: this.$t("m.i.pc.transEventNo"),
            key: "transEventNo",
            hiddenCol: false,

            sortable: true
          }, {
            title: this.$t("m.i.common.transName"),
            key: "transName",

            hiddenCol: false,
            sortable: true
          }, {
            title: this.$t("m.i.common.prodNo"),
            key: "prodNo",
            hiddenCol: false,
            sortable: true
          }, {
            title: this.$t("m.i.pc.eventNo"),
            key: "eventNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", formatteracctEvent(params.row.eventNo, params.row, params.row.index))
              ]);
            }
          }, {
            title: this.$t("m.i.config.acctModel"),
            key: "acctMode",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", formatteracctMode(params.row.acctMode, params.row, params.row.index))
              ]);
            }
          }, {
            title: this.$t("m.i.pc.balanceFlag"),
            key: "balanceFlag",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", formatterbalanceFlags(params.row.balanceFlag, params.row, params.row.index))
              ]);
            }

          }, {
            title: this.$t("m.i.pc.sceneExplain"),
            key: "sceneExplain",
            hiddenCol: true
          }

        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        tempInx: 0,
        showBranchWin: false,
        brchRoleDistributeWin: false,
        userHistWin: false,
        brchNo: false,
        defaultTraderNo: null,
        userNo: "123",
        showBranchMenuWin: false,
        ifShowMore: false,
        spanRight: 19,
        spanLeft: 5,
        productTreeData: [],
        isDisabled: true,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        prodNo: null,
        eventNos: [
          {
            value: "1100",
            label: "普通记账"
          },
          {
            value: "1200",
            label: "手续费"
          },
          {
            value: "1300",
            label: "撤销记账"
          },
          {
            value: "1400",
            label: "对方应答"
          },
          {
            value: "1500",
            label: "对方拒绝"
          }
        ],
        acctModes: [
          {
            value: "trans_data",
            label: "交易记账"
          },
          {
            value: "record_data",
            label: "分录记账"
          }
        ],
        sceneExplains: [
          {
            value: "billClass",
            label: "票据介质"
          },
          {
            value: "billType",
            label: "票据类型"
          },
          {
            value: "isInner",
            label: "是否系统内"
          },
          {
            value: "orgnlSourceProd",
            label: "最初来源"
          },
          {
            value: "lastSourceProd",
            label: "最近来源"
          },
          {
            value: "profitFlag",
            label: "损益"
          },
          {
            value: "transplantFlag",
            label: "是否迁移数据"
          },
          {
            value: "busiType",
            label: "业务类型"
          },
          {
            value: "extBusiType",
            label: "扩展业务类型"
          },
          {
            value: "voucherType",
            label: "凭证类型"
          }
        ],
        balanceFlags: [
          {
            value: "0",
            label: "无余额"
          },
          {
            value: "1",
            label: "余额开启"
          },
          {
            value: "2",
            label: "余额结束"
          }
        ],
        recordData: {
          rows: [],
          total: 1
        },
        showGroupWin: false,
        id: "",
        reqUrl: reqUrl,
        gridUrl: reqUrl + "/queryAcctConfigTran",
        mBarHeight: 0
      };

      function validUserNo(rule, val, callback) {
        let re = /^[a-zA-Z0-9]{1,20}$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，只能输入英文、数字"));
        }
      }

      function validRoleCode(rule, val, callback) {
        let re = /^\w+$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，只能输入英文、下划线和数字"));
        }
      }

      function validRoleName(rule, val, callback) {
        let re = /^[\w\u4e00-\u9fa5\（\）\(\)\-\s]*$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，只能输入中文、英文、数字、小括号和下划线"));
        }
      }

      function formatterbalanceFlags(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "0":
              return "无余额";
            case "1":
              return "余额开启";
            case "2":
              return "余额结束";
          }
        } else {
          return "";
        }
      }

      function formatteracctMode(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "trans_data":
              return "交易记账";
            case "record_data":
              return "分录记账";

          }
        } else {
          return "";
        }
      }

      function formatteracctEvent(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "1100":
              return "普通记账";
            case "1200":
              return "手续费";
            case "1300":
              return "撤销记账";
            case "1400":
              return "对方应答";
            case "对方拒绝":
              return "对方拒绝";

          }
        } else {
          return "";
        }
      }
    },
    components: {
      GroupConfig: () => import(/* webpackChunkName: "pc/acct/acctConfig/groupConfig" */`@/views/bizViews/pc/acct/acctConfig/groupConfig`)
    },
    mounted() {
      this.handleResize();
      on(window, "resize", this.handleResize);
    },
    methods: {
      handleResize() {
        this.$nextTick(() => {
          this.mBarHeight = window.innerHeight;
        });
      },
      // 获取左边树结构
      getLeftTreeList() {
        post({ optType: "0" }, "/bm/prod/product/queryProductMaintenanceTree").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.productTreeData = data;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //收拢左侧树
      handleUnExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      handleExpandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            arr[i].expand = isExpand;
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      getRecord(obj) {
        post(obj, this.reqUrl + "/queryAcctConfigTran").then(res => {
          if (res.data.retCode === "000000") {
            this.recordData = { list: res.data.retData, pageInfo: { total: 1, pageNo: 1 } };
          } else {
            this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
          }
        });
      },
      //产品树点击查询分录
      queryByProdNo() {
        let arr = this.$refs["productTreeData"].getSelectedNodes();
        if (arr.length !== 0) {
          let id = arr[0].id;
          if (id.length === 8) {
            this.prodNo = id;
            let obj = { prodNo: this.prodNo };
            this.getRecord(obj);
          }
        }
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      // 配置分录详情
      handleConfig() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          return;
        }
        this.id = this.currentSelectRow[0].id;
        this.showGroupWin = true;
      },

      showGroupWinClose() {
        this.showGroupWin = false;
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (!this.prodNo) {
          this.$msgTip.info(this,{info:"请选择产品后再操作"});
          return;
        }
        if (this.type == "modify" || this.type == "view") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
            return;
          }
          this.$nextTick(() => {
            let newRow = this.currentSelectRow[0];
            this.addForm.prodNo = this.prodNo;
            this.addForm.transName = newRow.transName;
            this.addForm.acctMode = newRow.acctMode;
            this.addForm.balanceFlag = newRow.balanceFlag;
            this.addForm.eventNo = newRow.eventNo;
            if (newRow.sceneExplain != null) {
              this.addForm.sceneExplain = newRow.sceneExplain;
            }
            this.addForm.id = newRow.id;
          });
        } else {
          this.$nextTick(() => {
            this.addForm.prodNo = this.prodNo;
            this.$refs.addForm.resetFields();
          });
        }
        this.addOrEditWin = true;
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
        if (arr[0].role_code == "admin") {
          this.deletDisabled = true;
        }
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      handlelRowClick(arr) {
        if (arr && this.currentSelectRow) {
          if (this.currentSelectRow.length > 0 && arr[0].id === this.currentSelectRow[0].id) {
            this.currentSelectRow = [];
            return;
          }
        }
        this.currentSelectRow = arr;
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? this.reqUrl + "/saveAcctConfigTran" : this.reqUrl + "/updateAcctConfigTran";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this,{info:msg});
                  this.addOrEditWin = false;
                  let obj = { prodNo: this.prodNo };
                  this.getRecord(obj);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this,{info:this.$t("m.i.common.addFailed") + res.data.retMsg});
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      handleComfirm() {
        let list = this.currentSelectRow;
        let recordObj = {};
        if (list.length > 0) {
          recordObj = list[0];
        }
        let options = {
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?"
        };
        if (list.length > 0) {
          this.$hMsgBox.confirm({
            title: options.title,
            content: options.content,
            onOk: () => {
              post({ id: recordObj.id }, this.reqUrl + "/deleteAcctConfigTran").then(res => {
                if (res) {
                  let return_code = res.data.retCode;
                  if (return_code === "000000") {
                    this.$msgTip.success(this,{info:"操作成功"});
                    let obj = { prodNo: this.prodNo };
                    this.getRecord(obj);
                    this.currentSelectRow = [];
                    this.currentSelectList = [];
                  } else {
                    this.$msgTip.error(this,{info:"操作失败:" + res.data.retMsg});
                    this.$refs.datagrid.dataChange(1);
                  }
                } else {
                  this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
                }
              });
            }
          });
        } else {
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }

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
    },
    created() {
      this.getLeftTreeList();
    },
    beforeDestroy() {
      off(window, "resize", this.handleResize);
    }
  };
</script>
