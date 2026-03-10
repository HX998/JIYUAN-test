<style>

</style>
<!--计提信息查询 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <h-form-item :label="$t('m.i.pc.date')" prop="startDt">
                    <h-date-picker type="date" :value="formItem.startDt" :editable=false :showFormat=true placeholder="" @on-change="handleDateChange" :clearable="false"></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.subjectNumber')" prop="subjectNo">
                    <h-input v-model="formItem.subjectNo" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.subjectName')" prop="subjectName">
                    <h-input v-model="formItem.subjectName" :maxLength="20"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.auth.brchRange')" prop="brchRange">
                    <h-select v-model="formItem.brchRange" placeholder="" showTitle :clearable="false">
                      <h-option value="1">本机构</h-option>
                      <h-option value="2">辖属</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.busiType')" prop="provisionType">
                    <h-select v-model="formItem.provisionType" placeholder="" showTitle>
                      <h-option value="1">贴现</h-option>
                      <h-option value="2">转贴现买入（买断式）</h-option>
                      <h-option value="3">转贴现买入（回购式）</h-option>
                      <h-option value="4">转贴现卖出（回购式）</h-option>
                      <h-option value="5">再贴现</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.pc.billType')" prop="billType">
                    <h-select v-model="formItem.billType" placeholder=" ">
                      <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item :label="$t('m.i.pc.hlrdType')" prop="status">
                    <h-select v-model="formItem.status" placeholder="" showTitle :clearable="false">
                      <h-option value="1">持有</h-option>
                      <h-option value="2">已转出</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
            highlightRow
            url="/pc/acct/subjectbalance/func_quertProvisionInfo"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>
<script>
  import { post, on,off,getDictValueFromMap,formatNumber,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: 'quertProvisionInfo',
    data() {
      let formItem = {
        subjectNo: "",
        subjectName: "",
        brchRange:"1",
        billType:"",
        startDt:window.sessionStorage.getItem("workDate"),
        provisionType:"",
        status:"1",
      };
      return {
        formItem : formItem,

        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 60
          },
          {
            title: this.$t("m.i.pc.subjectNumber"),
            key: "subjectNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.subjectName"),
            key: "subjectName",
            hiddenCol: false,
            sortable: true
          },

          {
            title: this.$t("m.i.pc.provisionAmt"),
            key: "provInterest",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.provInterest, 2, ","));
            }
          },
          {
            title:  this.$t("m.i.pc.noProvisionAmt"),
            key: "remaInterest",
            hiddenCol:false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.remaInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.pc.sProvisionAmt"),
            key: "interest",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.interest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.pc.proInterest"),
            key: "provisionAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.provisionAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "provisionType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.provisionType==='1'){
                return h('span','贴现')
              } else if(params.row.provisionType==='2'){
                return h('span','转贴现买入（买断式）')
              } else if(params.row.provisionType==='3' || params.row.provisionType==='4'){
                return h('span','转贴现买入（回购式）')
              } else if(params.row.provisionType==='5' || params.row.provisionType==='6'){
                return h('span','转贴现卖出（回购式）')
              } else if(params.row.provisionType==='8'){
                return h('span','再贴现')
              }
          }
          },
          {
            title: this.$t("m.i.pc.billType"),
            key: "billType",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.hlrdType"),
            key: "status",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.status==='1' || params.row.status==='2') return h('span','持有')
              else if(params.row.status==='3' || params.row.status==='4') return h('span','已转出')
            }
          },
        ],
        currentSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        billTypeList: [],
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        dictMap : new Map(),
        ifShowMore :false,
      };
    },
    components: {

    },
    created() {
      this.formItem.startDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      listExport() {
        this.param = "subjectProvisionInfoExport";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      handleDateChange(value) {
        this.formItem.startDt = value.replace(/-/g, "");
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.brchNos ="";
        this.formItem.brchNames = "";
        this.$refs.formItem.resetFields();
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/pc/acct/subjectbalance/provisionQuery/func_downloadProvisionInfoQuery";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      }
    }
  };
</script>
