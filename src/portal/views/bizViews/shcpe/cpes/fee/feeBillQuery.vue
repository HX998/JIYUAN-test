<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <h-form-item :label="$t('m.i.common.brchName')" prop="branchNos">
                    <h-input v-model="formItem.branchNos" placeholder="" readonly v-show="false"></h-input>
                    <h-input v-model="formItem.branchName" placeholder="" readonly :title="formItem.branchName"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.chargeMonth')" prop="chargeMonthRange">
                    <h-date-picker type="monthrange" v-model="formItem.chargeMonthRange" format="yyyy-MM"
                                   showFormat placeholder="" @on-change="handleChargeMonthChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.status')" prop="status">
                    <h-select v-model="formItem.status" placeholder="" showTitle>
                      <h-option  value="0">已申请</h-option>
                      <h-option  value="1">回复成功</h-option>
                      <h-option  value="2">回复失败</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            :hasSelect = false
            url="/shcpe/cpes/fee/queryfeeBillQuery"
            :rowSelect = true
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="apply()">申请</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch>
    <h-msg-box title="在线查询申请"
               width="800"
               v-model="applyWin"
               :mask-closable="maskclosable"
               :maximize="maximize">
      <!--表单主体-->
      <h-panel>
        <h-form :model="applyForm" :label-width="115" ref="applyForm" cols="2" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item :label="$t('m.i.common.brchName')" prop="branchName" required>
              <h-input v-model="applyForm.branchName" :maxlength=30 readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.shcpe.chargeMonth')" prop="chargeMonth" required>
              <h-date-picker type="month" v-model="applyForm.chargeMonth" format="yyyy-MM"
                             showFormat placeholder="" @on-change="handleChargeMonth"></h-date-picker>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="cancleWin()">{{$t("m.i.common.cancle")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
    import { post, on,off,formatNumber, accMul} from "@/api/bizApi/commonUtil";
    export default {
      name: "feeBillQuery",
      components: {
        ShowBranch:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
      },
      data() {
        return {
          showBranchWin:false,
          ifShowMore : false,
          dictMap : new Map(),
          applyWin:false,
          maximize: true,//是否允许最大化
          maskclosable: false,//是否允许点击遮罩层关闭
          //用于申请的表单
          applyForm: {
            branchName: "",
            chargeMonth: ""
          },
          formItem : {
            minChargeMonth:"",
            maxChargeMonth:"",
            chargeMonthRange:"",
            branchNos:"",
            branchName:"",
            status:""
          },

          columns : [
            {
              type: "selection",
              width: 60,
              align: "center",
              hiddenCol: true
            },
            {
              title: this.$t("m.i.common.index"),
              type: 'index',
              align: 'center',
              hiddenCol: false
            },
            {
              title: this.$t("m.i.common.brchName"),
              key: "branchName",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.common.brchCode"),
              key: "branchCode",
              hiddenCol: false
            },
            {
              title:this.$t("m.i.shcpe.chargeMonth"),
              key: "chargeMonth",
              hiddenCol:false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.chargeMonth == null ? "" : this.$moment(params.row.chargeMonth, "YYYY-MM").format("YYYY-MM");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.common.status"),
              key: "status",
              hiddenCol: false,
              render: (h, params) => {
                if(params.row.status==='0') return h('span','已申请')
                else if(params.row.status==='1') return h('span','回复成功')
                else if(params.row.status==='2') return h('span','回复失败')
              }
            },
            {
              title: this.$t("m.i.shcpe.totalFeeAmt"),
              key: "totalFeeAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalFeeAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.chargeResult"),
              key: "chargeResult",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "FeeChargeResult", params.row.chargeResult);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            }
          ],
        }
      },
      methods:{
        apply(){
          this.applyForm.branchName = this.formItem.branchName;
          this.applyWin = true;
        },
        handleChargeMonthChange(){
          if(this.formItem.chargeMonthRange.length > 0){
            let range = this.formItem.chargeMonthRange.replace(/-/g,"");
            let DateRange = range.split("  ");
            this.formItem.minChargeMonth=DateRange[0];
            this.formItem.maxChargeMonth=DateRange[1];
          }else{
            this.formItem.minChargeMonth = "";
            this.formItem.maxChargeMonth = "";
          }
        },
        handleChargeMonth(){
            let month = this.applyForm.chargeMonth.replace(/-/g,"");
            this.applyForm.chargeMonth = month;
        },
        submitForm() {
          this.$refs["applyForm"].validate(valid => {
            if (valid) {
              let url = "/shcpe/cpes/fee/sendFeeStatusQuery";
              post(this.applyForm, url).then(res => {
                if (res) {
                  if (res.data.retCode === "000000") {
                    this.$msgTip.success(this, { info: this.$t("m.i.common.commitSuccess") });
                    this.applyWin = false;
                    this.$refs.applyForm.resetFields();
                    this.$refs.datagrid.dataChange(1);
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.commitFailed") + res.data.retMsg });
                    this.$refs.datagrid.dataChange(1);
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        },
        cancleWin() {
          this.$refs.applyForm.resetFields();
          this.applyWin = false;
        },
        //查询机构弹出框
        queryBrchNo(optType) {
          this.showBranchWin = true;
          this.optType = optType;
        },
        showBranchWinClose() {
          this.showBranchWin = false;
        },
        //根据弹框所选数据进行赋值
        brchNoChange(info) {
          let objs = [];
          if(info instanceof Array){
            objs = info;
          } else {
            objs[0] = info;
          }
          let brchNos = "";
          let brchNames = "";
          for(var i=0;i<objs.length; i++){
            brchNos += objs[i].id + ',';
            brchNames += objs[i].title + ',';
          }
          this.formItem.branchNos = brchNos.substring(0,brchNos.length - 1);
          this.formItem.branchName = brchNames.substring(0,brchNames.length - 1);
          this.showBranchWin = false;
        },
        formSearch() {
          this.loading=true;
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.dataChange(1);
        },
        formSearchReset() {
          let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
          this.formItem.branchNos = userInfo.brchNo;
          this.formItem.branchName = userInfo.brchName;
          this.formItem.minChargeMonth = "";
          this.formItem.maxChargeMonth = "";
          this.$refs.formItem.resetFields();
        },
      },
      created() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.branchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
      },
      mounted() {
        this.getDictListByGroups("FeeChargeResult").then(res => {
          this.dictMap = res.get("map");
        });
      }
    }
</script>

<style scoped>

</style>
