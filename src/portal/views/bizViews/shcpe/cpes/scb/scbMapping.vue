<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--虚拟票据号码-->
                <h-form-item prop="virtualBillNoLike" :label="$t('m.i.shcpe.virtualBillNo')">
                  <h-input v-model="formItem.virtualBillNoLike" :maxlength="30" type="int"></h-input>
                </h-form-item>
                <!--票据(包)号码-->
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')">
                  <h-input v-model="formItem.billNoLike" :maxlength="30" type="int"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['billRangeStart','billRangeEnd']"></bill-range>
                <!--查询机构-->
                <show-branch v-model="formItem.transBrchNo" :label="$t('m.i.shcpe.transBrchNo')" prop="transBrchNo"
                             isNeedChecked url="/sm/auth/branch/queryAllBranchTree"
                             :showCheckBox="false" :brchNo.sync="formItem.transBrchNo"
                             :brchName.sync="formItem.transBrchName"></show-branch>

                <!--查询类型-->
                <h-form-item :label="$t('m.i.shcpe.queryMappingType')" prop="queryMappingType">
                  <h-select v-model="formItem.queryMappingType" placeholder="">
                    <h-option v-for="item in queryMappingTypeList" :value="item.key" :key="item.key">{{
                        item.value
                      }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <!--状态-->
                <h-form-item :label="$t('m.i.shcpe.busiStatus')" prop="busiStatus">
                  <h-select v-model="formItem.busiStatus" placeholder="">
                    <h-option v-for="item in busiStatusList" :value="item.key" :key="item.key">{{
                        item.value
                      }}
                    </h-option>
                  </h-select>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">
                    {{ $t('m.i.common.searchAdvanced') }}
                    <i class="icon iconfont"
                       :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i>
                  </span>
                  <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>

          <!--查询申请弹出框-->
          <h-msg-box v-model="showBox" @on-close="handleWinClose"
                     width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
            <p slot="header">
              <span v-if="applyByBillNo">{{$t("m.i.shcpe.typeQT01")}}</span>
              <span v-if="!applyByBillNo">{{$t("m.i.shcpe.typeQT02")}}</span>
            </p>
            <div>
              <h-form :model="applyForm" :label-width="130" ref="applyForm" cols="2" class="h-form-search">
                <!--业务类型-->
                <h-form-item :label="$t('m.i.shcpe.queryMappingType')" prop="queryMappingType">
                  <h-input v-model="selectType" readonly></h-input>
                </h-form-item>
                <!--查询机构-->
                <show-branch v-model="applyForm.transBrchNo" :label="$t('m.i.shcpe.transBrchNo')" prop="transBrchNo"
                             isNeedChecked url="/sm/auth/branch/queryAllBranchTree"
                             :showCheckBox="false" :brchNo.sync="applyForm.transBrchNo"
                             :brchName.sync="applyForm.transBrchName" required></show-branch>
                <!--票据(包)号码-->
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')" required v-if="applyByBillNo" :validRules="billNoRule">
                  <h-input v-model="applyForm.billNo" :maxlength="30" type="int"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="applyForm" :rangeProps="['billRangeStart','billRangeEnd']" required
                            v-if="applyByBillNo"></bill-range>

                <!--虚拟票据号码-->

                <h-form-item prop="virtualBillNo" :label="$t('m.i.shcpe.virtualBillNo')" required v-if="!applyByBillNo" :validRules="billNoRule">
                  <h-input v-model="applyForm.virtualBillNo" :maxlength="30" type="int"></h-input>
                </h-form-item>
              </h-form>
            </div>
            <div slot="footer">
              <div slot="footer">
                <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
                <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
                <h-button type="primary" v-else @click="confirmApply()">{{$t("m.i.common.commit")}}</h-button>
              </div>
            </div>
          </h-msg-box>

          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/shcpe/cpes/scb/scbMapping/func_queryScbMappingList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown trigger="click" @on-click="showApplyBox" placement="bottom-start">
                <h-button type="primary">{{ $t("m.i.shcpe.appl") }}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="QT01">{{ $t('m.i.shcpe.typeQT01') }}</h-dropdown-item>
                  <h-dropdown-item name="QT02">{{ $t('m.i.shcpe.typeQT02') }}</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {post, on, off, formatNumber, formatBillRange, getDictListByGroups} from "@/api/bizApi/commonUtil";
  import BillRange from "@/components/bemp/input/billRange";
  import store from "../../../../../store";

  export default {
    name: "scbMapping",
    components: {},
    data() {
      return {
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t('m.i.shcpe.queryMappingType'),
            key: "queryMappingType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "QryTp", params.row.queryMappingType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.virtualBillNo'),
            key: "virtualBillNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: "billRange",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = formatBillRange('CS03', params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.transBrchNo'),
            key: "transBrchNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getValueFromMap(this.branchMap, params.row.transBrchNo);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.busiStatus'),
            key: "busiStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.busiStatusDictMap, "busiStatus", params.row.busiStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.result'),
            key: "dealPrcMsg",
            sortable: true,
            hiddenCol: false
          }
        ],
        formItem: {
          virtualBillNoLike: "",
          queryMappingType: "",
          billNoLike: "",
          billRangeStart: "",
          billRangeEnd: "",
          dealPrcMsg: "",
          busiStatus: "",
          transBrchNo: "",
          transBrchCode: "",
          transBrchName: ""
        },
        submitFlag: false,
        selectType: "",
        applyByBillNo: false,
        showBox: false,
        ifShowMore: false,
        billNoRule: [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "输入数据不合法" }],
        busiStatusList: [
          {
            key: "QS01",
            value: "已发送",
          },
          {
            key: "QS02",
            value: "已回复",
          },
          {
            key: "QS03",
            value: "查询失败",
          }
        ],
        queryMappingTypeList: {},
        busiStatusDictMap: new Map([
          [
            'busiStatus', new Map(
            [
              ['QS01','已发送'],
              ['QS02','已回复'],
              ['QS03','查询失败']
            ]
          )
          ]
        ]),
        applyForm: {
          queryMappingType: "",
          transBrchNo: "",
          transBrchCode: "",
          billNo: "",
          billRangeStart: "",
          billRangeEnd: "",
          virtualBillNo: ""
        },
        dictMap: new Map,
        branchItem: {
          brchName: "",
          brchNo: "",
          cpesBrchCode: "",
          optType: "0"
        },
        branchMap: new Map,
        branchList: [],
      };
    },
    watch: {},
    computed: {},
    methods: {
      formSearch() {
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      showApplyBox(type) {
        if (type === "QT01") {
          this.applyForm.queryMappingType = "QT01";
          this.applyByBillNo = true;
        } else if (type === "QT02") {
          this.applyForm.queryMappingType = "QT02";
          this.applyByBillNo = false;
        }
        this.selectType = this.getDictValueFromMap(this.dictMap, "QryTp", this.applyForm.queryMappingType);
        this.applyForm.transBrchNo = store.getters.userInfo.brchNo;
        this.applyForm.transBrchName = store.getters.userInfo.brchName;
        this.showBox = true;
      },
      handleWinClose() {
        this.$refs.applyForm.resetFields();
        this.showBox = !this.showBox;
        this.selectType = "";
      },
      confirmApply() {
        this.$refs["applyForm"].validate(valid => {
          if (valid) {
            let url = "/shcpe/cpes/scb/scbMapping/func_sendScbMappingQuery";
            this.submitFlag = true;
            post(this.applyForm, url).then(res => {
              this.submitFlag = false;
              this.handleWinClose();
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, {info: this.$t("m.i.common.addSuccess")});
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.addFailed") + res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      getBranchList() {
        post(this.branchItem,"/sm/auth/branch/queryAllBranchTree").then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.branchList = res.data.retData;
              for (let i = 0; i < this.branchList.length; i++) {
                this.branchMap.set(this.branchList[i].id, this.branchList[i].title);
                let branchListChildList = this.branchList[i].children;
                if (branchListChildList) {
                  for (let j = 0 ;j < branchListChildList.length; j++) {
                    this.branchMap.set(branchListChildList[j].id, branchListChildList[j].title);
                  }
                }
              }
            } else {
              // 公共报错信息

            }
          } else {
            // 公共报错信息

          }
        });
      },
      getValueFromMap(map, key) {
        if (map == null || map.get(key) == null) {
          return key;
        }
        if (key == null || key === "") {
          return key;
        }
        return map.get(key);
      }
    },
    mounted() {
      this.getDictListByGroups("QryTp").then(res => {
        this.queryMappingTypeList = res.get("QryTp");
        this.dictMap = res.get("map");
      });
    },
    created() {
      this.getBranchList();
    }
  }
</script>

<style scoped>

</style>
