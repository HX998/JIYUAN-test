<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="sspdStatus" :label="$t('m.i.ce.sspdStatus')">
                  <h-select v-model="formItem.sspdStatus" placeholder="">
                    <h-option value="3">已止付</h-option>
                   <!-- <h-option value="6">{{$t('m.i.ce.hasRelievePay')}}</h-option>-->
                    <!--<h-option v-for="item in sspdStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>-->
                  </h-select>
                </h-form-item>
                <!--<h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">-->
                  <!--<h-select v-model="formItem.billType" placeholder="">-->
                    <!--<h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>-->
                  <!--</h-select>-->
                <!--</h-form-item>-->
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterApply/func_querySspdRegister"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="register" >{{$t('m.i.ce.rgstApply')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :isReadonly="true"
          :isShowReset="false"
          :showImgPlat="true"
          @imageWinClose="uploadImageWinClose"></image-loading>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiStopPaymentRegisterApply",
    components: {
    },
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          sspdStatus: '',
          billType: '',
          billNo: '',
          acptProtocalNo: '',
          curFuncNo : 'PICE010830',
          reverseBillNo : ''
        },
        columns: [
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: false,
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.ce.sspdStatus"),
            key: 'sspdStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap,"SspdStatus",params.row.sspdStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
              title: this.$t("m.i.common.suspendImgStatus"),
            key: 'suspendImgStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap,"ImgStatus",params.row.suspendImgStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
              title: this.$t("m.i.ce.sspdImage"),
            key: 'sspdImage',
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openImgWin(params.row.id)
                    }
                  }
                }, '维护')
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.riskStatus"),
            key: 'riskStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
             title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
             title: this.$t("m.i.billInfo.acptDt"),
            key: 'acptDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.acptDt == null || params.row.acptDt === ""){
                return "";
              }
              let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.sspdName"),
            key: 'sspdName',
            sortable: true,
            hiddenCol: false,
          },
          {
             title: this.$t("m.i.billInfo.sspdDt"),
            key: 'sspdDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.sspdDt == null || params.row.sspdDt === ""){
                return "";
              }
              let date = this.$moment(params.row.sspdDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
             title: this.$t("m.i.billInfo.sspdReason"),
            key: 'sspdReason',
            hiddenCol: false,
          }
        ],
        sspdStatusList: [],
        billTypeList: [],
        dictMap: new Map(),
        currentSelectRow: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        //影像上传
        showUploadImageWin: false,
        id:"",
        imageParams: {
          listId: "",
          imgType: 'IM09',
          imgTypeList:[],
          imgBusiType:"2",
          imageUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterApply/func_imageListPage", //查询可查看影像url
          imageUploadUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterApply/func_uploadImage", //影像上传url
          imageRegisterUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterApply/func_rgstImage", //影像登记url
          imageDeleteUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterApply/func_deleteImage", //影像删除url
          imgShowUrl:"/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterApply/func_imageById?id=", //查看影像url
          busiType:"RI04"
        }
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,SspdStatus,ImgStatus,RiskStatus,AcptStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.sspdStatusList = res.get("SspdStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = '';
          this.formItem.drwrAcctNo = '';
          this.formItem.sspdStatus = '';
          this.formItem.billType = '';
          this.formItem.billNo = '';
          this.formItem.acptProtocalNo = "";
          this.formItem.reverseBillNo = '';
        });
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //登记
      register() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        let ids = "";
        let billIds = "";
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          billIds += list[i].billId;
          if(i<list.length-1) {
            ids += ",";
            billIds += ",";
          }
        }
        this.$loadingbox.open({
          title: "登记中，请稍后..."
        });
        post({idList: ids,billIdList:billIds, busiType: '1'}, "/ce/acpt/outerBusiBill/busiStopPayment/busiStopPaymentRegisterApply/func_register").then(res => {
          if(res) {
            this.$loadingbox.close();
            let msg = res.data.retMsg
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$loadingbox.close();
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //影像维护弹窗
      openImgWin(str) {
        this.imageParams.listId = str;
        this.imageParams.imgTypeList.push({key:"IM09",value:"止付"})
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList=[]
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        })
      }
    }
  };
</script>

<style scoped>

</style>
