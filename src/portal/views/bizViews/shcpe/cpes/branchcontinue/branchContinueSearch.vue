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
                <show-cpes-branch :label="this.$t('m.i.shcpe.byContinueBrchName')" className="h-form-long-label"
                                  :brchCode.sync="formItem.byContinueBrchCode"
                                  :cpesBrchName.sync="formItem.byContinueBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="byContinueBankName"
                                  :showEnable="false"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <show-cpes-branch :label="this.$t('m.i.shcpe.continueBrchName')"
                                  :brchCode.sync="formItem.continueBrchCode"
                                  :cpesBrchName.sync="formItem.continueBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="continueBankName"
                                  :showEnable="false"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="this.$t('m.i.shcpe.status')" prop="status">
                  <h-select v-model="formItem.status" placeholder="">
                    <h-option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch('1')">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" highlight-row :url="continueUrl" :bindForm="formItem"
                      :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="supplement()">
                补录
              </h-button>
              <h-button type="primary" @click="backups()">
                备份
              </h-button>
              <h-button type="primary" @click="addContinue()">
                承接
              </h-button>
              <h-button type="primary" @click="rollback()">
                恢复
              </h-button>
              <h-button type="primary" @click="show()">
                查看
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查看承接信息进度窗口-->
    <h-msg-box maximize v-model="showRecord" width="800" class="h-form-table-layer" @on-close="closeRecordWin"
               @on-maximize="onMaximize">
      <p slot="header">
        <span>查看承接信息进度</span>
      </p>
      <div>
        <div class="h-form-search-box">
          <h-form :model="recordFormItem" :label-width="90" ref="recordFormItem" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.shcpe.status')" prop="status">
              <h-select v-model="recordFormItem.status" placeholder="">
                <h-option v-for="item in brchContinueStatusList" :value="item.key" :key="item.key">{{ item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="formSearchRecord('1')">{{ $t("m.i.common.search") }}</h-button>
              <h-button type="ghost" @click="formSearchResetRecord()">{{ $t("m.i.common.reset") }}</h-button>
            </h-form-item>
          </h-form>
        </div>
        <h-datagrid :columns="recordColumns" :autoLoad="autoLoad" :url="findRecordUrl"
                    :bindForm="recordFormItem" ref="datagrid1" :row-select="false">
          <div slot="toolbar" class="pull-left"></div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="closeRecordWin()">{{ $t("m.i.common.close") }}</h-button>
      </div>
    </h-msg-box>
    <!--补录窗口-->
    <h-msg-box maximize v-model="showSupplement" width="800" @on-close="closeSupplement">
      <p slot="header">
        <span>行内机构承接关系补录</span>
      </p>
      <div>
        <h-form :model="supplementFormItem" :label-width="115" ref="supplementFormItem" cols="2" class="h-form-search">
          <h-form-item :label="this.$t('m.i.shcpe.byContinueBrchCode')" prop="byContinueBrchCode" required>
            <h-input v-model="supplementFormItem.byContinueBrchCode" readonly></h-input>
          </h-form-item>
          <h-form-item :label="this.$t('m.i.common.continueBrchCode')" prop="continueBrchCode" required>
            <h-input v-model="supplementFormItem.continueBrchCode" readonly></h-input>
          </h-form-item>
          <h-form-item :label="this.$t('m.i.shcpe.byContinueBrchName')" prop="byContinueBrchName" required>
            <h-input v-model="supplementFormItem.byContinueBrchName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="this.$t('m.i.shcpe.continueBrchName')" prop="continueBrchName" required>
            <h-input v-model="supplementFormItem.continueBrchName" readonly></h-input>
          </h-form-item>
          <h-datagrid :columns="supplementColumns" highlight-row :hasPage="false" :autoLoad="autoLoad"
                      :url="findDetailUrl"
                      :onCurrentChange="onSupplementCurrentChange"
                      :onCurrentChangeCancel="onSupplementCurrentChangeCancel"
                      :bindForm="supplementFormItem" ref="datagridSupplement">
            <div slot="toolbar" class="pull-left"></div>
          </h-datagrid>
        </h-form>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="primary" @click="bulu">{{ $t("m.i.common.commit") }}</h-button>
        <h-button type="ghost" @click="closeSupplement()">{{ $t("m.i.common.close") }}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
import {post, on, off, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "branchContinueSearch",
  components: {},
  data() {
    return {
      dictMap: new Map(),
      brchNameMap: new Map(),
      //场内承接信息进度URL
      findRecordUrl: "/cpes/branch/branchContinue/branchContinueSearch/func_queryContinueRecordByPage",
      // 查询承接明细
      findDetailUrl: "/cpes/branch/branchContinue/branchContinueSearch/func_queryContinueDetail",
      //场内承接信息查询url
      continueUrl: "/cpes/branch/branchContinue/branchContinueSearch/func_queryContinueInfoByPage",
      findContinueByIdUrl: "/cpes/branch/branchContinue/branchContinueSearch/func_findContinueById",
      findContinueNosUrl: "/cpes/branch/branchContinue/branchContinueSearch/func_getBrchNosByCodeList",
      formItem: {
        isPlatform: "",
        status: "",
        minActiveDt: "",
        maxActiveDt: "",
        continueBrchCode: "",
        continueBankName: "",
        byContinueBrchCode: "",
        byContinueBankName: ""
      },
      columns: [
        {
          type: "radio",
          key: "danxuan",
          title: "  ",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },

        {
          title: this.$t("m.i.shcpe.byContinueBrchCode"),
          key: "byContinueBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.byContinueBrchName"),
          key: "byContinueBrchName",
          hiddenCol: false
        }, {
          title: this.$t("m.i.common.continueBrchCode"),
          key: "continueBrchCode",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.continueBrchName"),
          key: "continueBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.status"),
          key: "status",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", this.getStatus(params.row.status));
          }
        },
        {
          title: this.$t("m.i.shcpe.operResult"),
          key: "operResult",
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "BrchContinueStatus", params.row.operResult);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        }
      ],
      supplementColumns: [
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.byContinueBrchNo"),
          key: "byContinueBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.shcpe.byContinueInnerBrchName"),
          key: "byContinueBrchName",
          hiddenCol: false
        }, {
          title: this.$t("m.i.shcpe.continueBrchNo"),
          key: "continueBrchNo",
          hiddenCol: false,
          render: (h, params) => {
            let options = this.continueBrchNoList.map(item => {
              return h("h-option", {
                props: {
                  value: item.brchNo,
                  key: item.brchNo
                }
              })
            });
            return h("h-select", {
              props: {
                showTitle: true,
                placeholder: "",
                clearable: false,
                value: params.row.continueBrchNo,
              },
              on: {
                'on-change': (currVal) => {
                  this.selectChange(params.index, currVal);
                },
              }
            }, options)
          }
        },
        {
          title: this.$t("m.i.shcpe.continueInnerBrchName"),
          key: "continueBrchName",
          hiddenCol: false,
          render: (h, params) => {
            return h("span",  this.dataList[params.index] ? this.dataList[params.index].brchName : params.row.continueBrchName);
          }
        },
      ],
      isPlatformList: [
        {
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "是"
        }
      ],
      showRecord: false,
      statusList: [
        {
          value: "0",
          label: "未处理"
        },
        {
          value: "1",
          label: "已处理"
        },
        {
          value: "2",
          label: "未补录"
        }
      ],
      ifShowMore: false,
      recordColumns: [
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          key: "sceneNo",
          title: this.$t("m.i.shcpe.sceneNo"),
          hiddenCol: false
        },
        {
          key: "sceneName",
          title: this.$t("m.i.shcpe.sceneName"),
          hiddenCol: false
        },
        {
          key: "sceneTableName",
          title: this.$t("m.i.shcpe.sceneTableName"),
          hiddenCol: false
        },
        {
          key: "dataSql",
          title: this.$t("m.i.shcpe.dataSql"),
          hiddenCol: false
        },
        {
          key: "beginGmt",
          title: this.$t("m.i.shcpe.beginGmt"),
          hiddenCol: false,
          render: (h, params) => {
            return h("span", params.row.beginGmt ? this.$moment(params.row.beginGmt, "YYYYMMDDHHmmssSSS").format("YYYY-MM-DD HH:mm:ss.SSS") : "-");
          }
        },
        {
          key: "endGmt",
          title: this.$t("m.i.shcpe.endGmt"),
          hiddenCol: false,
          render: (h, params) => {
            return h("span", params.row.endGmt ? this.$moment(params.row.endGmt, "YYYYMMDDHHmmssSSS").format("YYYY-MM-DD HH:mm:ss.SSS") : "-");
          }
        },
        {
          key: "status",
          title: this.$t("m.i.shcpe.status"),
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "BrchContinueStatus", params.row.status);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          key: "totalNum",
          title: this.$t("m.i.common.totalNum"),
          hiddenCol: false
        }
      ],
      recordFormItem: {
        status: "",
        continueId: ""
      },
      runTimeFlagList: {
        "1": "日终",
        "2": "日间"
      },
      supplementFormItem: {
        byContinueBrchCode: "",
        byContinueBankName: "",
        continueBrchCode: "",
        continueBankName: "",
        continueBrchNo: ""
      },
      continueBrchNoList: [],
      showSupplement: false,
      selectData: [],
      selectSupplementData: [],
      autoLoad: false,
      currentBrchNoList: [],
      brchContinueStatusList: [],
      dataList: [],
    };
  },
  mounted() {
    getDictListByGroups("BrchContinueStatus").then(res => {
      this.brchContinueStatusList = res.get("BrchContinueStatus");
      this.dictMap = res.get("map");
    });
  },
  methods: {
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid1.$refs.gridContent.handleResize();
      }, 100);
    },
    handleActiveDtStrChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minActiveDt = arr[0].replace(/-/g, "");
        this.formItem.maxActiveDt = arr[1].replace(/-/g, "");
      } else {
        this.formItem.minActiveDt = "";
        this.formItem.maxActiveDt = "";
      }
    },
    formSearch() {
      this.$refs.datagrid.dataChange(1);
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
      this.formItem.continueBrchNos = "";
      this.formItem.continueBankNames = "";
      this.formItem.byContinueBrchCode = "";
      this.formItem.continueBrchCode = "";
      this.formItem.byContinueBankName = "";
      this.formItem.continueBankName = "";
    },
    supplement() {
      let select = this.selectData;
      if (select.length == 1) {
        if (select[0].isPlatform === "0"){
          this.$msgTip.info(this, {info: this.$t("m.i.shcpe.notPlatformNoEdit")});
        }else if (select[0].status === "0" || select[0].operResult !== "BC00") {
          this.$msgTip.info(this, {info: this.$t("m.i.shcpe.failNotEdit")});
        } else {
          //返显承接机构和被承接机构名、代码
          post({id: select[0].id}, this.findContinueByIdUrl).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                if (res.data.retData != null) {
                  let resultData = res.data.retData;
                  this.supplementFormItem.id = resultData.id;
                  this.supplementFormItem.byContinueBrchCode = resultData.byContinueBrchCode;
                  this.supplementFormItem.byContinueBankName = resultData.byContinueBankName;
                  this.supplementFormItem.byContinueBrchName = resultData.byContinueBrchName;
                  this.supplementFormItem.continueBrchCode = resultData.continueBrchCode;
                  this.supplementFormItem.continueBankName = resultData.continueBankName;
                  this.supplementFormItem.continueBrchName = resultData.continueBrchName;
                  this.$refs.datagridSupplement.dataChange(1);
                  this.brchNameMap = new Map();
                  //获取承接机构号
                  let cpesBranchCodeList = [resultData.continueBrchCode, resultData.byContinueBrchCode];
                  post({cpesBranchCodeList: cpesBranchCodeList}, this.findContinueNosUrl).then(res => {
                    if (res) {
                      let retCode = res.data.retCode;
                      if (retCode === "000000") {
                        if (res.data.retData != null) {
                          this.continueBrchNoList = res.data.retData;
                          for (let i = 0; i < this.continueBrchNoList.length; i++) {
                            this.brchNameMap.set(this.continueBrchNoList[i].brchNo, this.continueBrchNoList[i].brchName);
                          }
                        }
                      } else {
                        this.$msgTip.error(this, {info: res.data.retMsg});
                      }
                    } else {
                      this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                    }
                  });
                }
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
          this.showSupplement = true;
        }
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }

    },
    onCurrentChange(data) {
      this.selectData[0] = data;
    },
    onCurrentChangeCancel() {
      this.selectData = [];
    },
    //承接按钮需写的方法
    addContinue() {
      let select = this.selectData;
      if (select.length == 1) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确定要承接吗") + "?",
          onOk: () => {
            post({id: select[0].id}, "/cpes/branch/branchContinue/branchContinueSearch/func_branchContinueExecute").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, {info: "正在承接中...,稍后刷新"});
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }
    },
    rollback() {
      if (this.selectData.length === 1) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确定要恢复吗") + "?",
          onOk: () => {
            post({id: this.selectData[0].id}, "/cpes/branch/branchContinue/branchContinueSearch/func_branchContinueRollback").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, {info: "正在恢复中...,稍后刷新"});
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }
    },
    show() {
      if (this.selectData.length == 1) {
        this.recordFormItem.continueId = this.selectData[0].id;
        this.showRecord = true;
        this.$nextTick(() => {
          this.$refs.datagrid1.dataChange(1);
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }
    },
    formSearchRecord() {
      this.$refs.datagrid1.dataChange(1);
    },
    formSearchResetRecord() {
      this.$refs.recordFormItem.resetFields();
    },
    //补录方法
    bulu() {
      this.$refs.supplementFormItem.validate((valid) => {
        if (valid) {
          let list = this.$refs.datagridSupplement.tData;
          for (let i = 0; i < list.length; i++) {
            if (this.dataList[i] && this.dataList[i].brchNo){
              list[i].continueBrchNo = this.dataList[i].brchNo;
              list[i].continueBrchName = this.dataList[i].brchName;
            }
          }
          post({id: this.supplementFormItem.id, branchContinueDetailDtos: list}, "/cpes/branch/branchContinue/branchContinueSearch/func_editBranchContinueInfo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: "补录完成"});
                this.closeSupplement();
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    },
    closeSupplement() {
      this.$refs.datagrid.dataChange(1);
      this.$refs.supplementFormItem.resetFields();
      this.dataList = [];
      this.showSupplement = false;
    },
    closeRecordWin() {
      this.$refs.recordFormItem.resetFields();
      this.showRecord = false;
    },
    //备份实现方法
    backups() {
      if (this.selectData.length === 1) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确定要备份吗") + "?",
          onOk: () => {
            post({id: this.selectData[0].id}, "/cpes/branch/branchContinue/branchContinueSearch/func_branchContinueAnalise").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, {info: "备份成功"});
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
                this.formSearch();
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
      }
    },
    getStatus(info) {
      switch (info) {
        case "0":
          return "未处理";
        case "1":
          return "已处理";
        case "2":
          return "未补录";
        default:
          return "-";
      }
    },
    onSupplementCurrentChange(data) {
      this.selectSupplementData[0] = data;
    },
    onSupplementCurrentChangeCancel() {
      this.selectSupplementData = [];
    },
    selectChange(index, value) {
      let brch = {brchNo: value, brchName: this.brchNameMap.get(value)};
      this.dataList[index] = brch;
      this.$set(this.dataList, index, brch);
    },
  }
};

</script>
