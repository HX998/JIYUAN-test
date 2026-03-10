<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterBack/func_pageQueryAcptCorpList"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="busiAcptRegisterBack" >{{$t('m.i.common.revocation')}}</h-button>
            </div>
          </h-datagrid>

          <!-- 退回原因录入弹窗 -->
          <h-msg-box v-model="rgstBackWin" width="400" @on-close="paymentBackWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
            <p slot="header">
              <span>撤销</span>
            </p>
            <div>
              <h-form :model="backForm" :label-width="115" ref="backForm" cols="1" class="h-form-search">
                <h-form-item prop="cancelType" :label="$t('m.i.common.cancelType')" required>
                  <h-select v-model="backForm.cancelType" placeholder="" type="textarea" :rows="3" :canResize="false" showTitle>
                    <h-option v-for="item in cancelTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="acptRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto" :validRules="acptRemarkCode">
                  <h-input type="textarea" :rows=3 v-model="backForm.acptRemark" :canResize="false"
                  ></h-input>
                </h-form-item>
              </h-form>
            </div>
            <div slot="footer">
              <div slot="footer">
                <h-button type="ghost" @click="paymentBackWinClose">{{$t("m.i.common.close")}}</h-button>
                <h-button type="primary" @click="paymentBackWinSubmit()">{{$t("m.i.common.cancel")}}</h-button>
              </div>
            </div>
          </h-msg-box>
        </div>
      </h-col>
    </h-row>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiAcptRegisterBack",
    data() {
      return {
        formItem: {
          billNo: '',
          acptRgstStatusList: ['BTA04','BTA11'],
          // 不能查询到已进行结清挑票的票据
          isSettlePick : '1',
          reverseBillNo : ''
        },
        backForm: {
          cancelType : '',
          acptRemark: '',
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
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
            title: this.$t("m.i.common.acptRgstDt"),
            key: 'acptRgstDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.acptRgstDt == null || params.row.acptRgstDt === ""){
                return "";
              }
              let acptRgstDt = this.$moment(params.row.acptRgstDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", acptRgstDt);
            },
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            sortable: true,
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
                      this.showBillInfo(params.row.billId)
                    }
                  }
                }, params.row.billNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.billInfo.drweBankName"),
            key: 'drweBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: 'drweBankName',

            hiddenCol: false
          },
        ],
        isList: [],
        corpScaleList: [],
        areaList: [],
        industryCategoryList: [],
        cancelTypeList: [],
        acptRemarkCode: [{test: this.validAcptRemarkCode, trigger:'blur,change'}],
        dictMap: new Map(),
        rgstBackWin: false,
        billId: '',
        showBillInfoWin: false
      }
    },
    components : {
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgMainStatus,DraftTypeCode,RgstRecallType").then(res => {
        this.corpScaleList = res.get("CorpScale");
        // 不需要这个，因为可选择的发起方，全部默认为企业
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.industryCategoryList = res.get("Industry");
        this.cancelTypeList = res.get("RgstRecallType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //撤回
      busiAcptRegisterBack() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length > 0) {
          this.rgstBackWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      handleBack() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids,cancelType : this.backForm.cancelType,acptRemark: this.backForm.acptRemark }, "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterBack/func_cancelAcptCorpAppl").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
              this.paymentBackWinClose();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //退回原因录入弹窗关闭
      paymentBackWinClose() {
        this.rgstBackWin = false;
        this.$refs.backForm.resetFields();
      },
      paymentBackWinSubmit(){
        this.$refs["backForm"].validate(valid => {
          if (valid) {
            if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length > 0) {
              this.$hMsgBox.confirm({
                title: "确认",
                content: "确定提交撤回申请吗？",
                onOk: () => {
                  this.handleBack();
                }
              });
            } else {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            }
          }});
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      validAcptRemarkCode(rule,val,callback) {
        if (val === null || val === '') {
          callback();
        } else {
          let value = val.toString();
          if (value.length > 150) {
            callback(new Error("备注字段输入不能超过150个文本"));
          } else {
            callback();
          }
        }
      },
    }
  };
</script>

<style scoped>

</style>
