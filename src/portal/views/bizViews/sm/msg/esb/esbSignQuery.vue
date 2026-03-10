<!--公告查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.userNo')" prop="signUserNo">
                  <h-input v-model="formItem.signUserNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.signTime')" prop="minSignTime">
                  <h-date-picker :value="signDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDiscDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.signStatus')" prop="signStatus">
                  <h-select v-model="formItem.signStatus" placeholder="">
                    <h-option value="0">失败</h-option>
                    <h-option value="1">成功</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/sm/EsbSign/func_getEsbSignData"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="sign()">{{$t('m.i.common.sign')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>


  </div>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "onlineTransQuery",
    components: {

    },
    data(){
      return {
        formItem : {
          signUserNo:"",
          minSignTime:"",
          maxSignTime:"",
          signStatus:"",
        },
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.signUser"),
            key: "signUserNo",
            align: "center",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.signStatus"),
            key: "signStatus",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.signStatus==='0') return h('span','失败')
              else if(params.row.signStatus==='1') return h('span','成功')
            }
          },
          {
            title: this.$t("m.i.common.signTime"),
            key: "createTime",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let date = this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          },
        ],
        currentSelectRow:[],
        dictMap : new Map(),
        signDt: [],
      }
    },
    created(){
    },
    mounted() {
      this.getDictListByGroups("").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods :{
      sign(){
        post({ signUserNo: window.sessionStorage.getItem("userName") }, "sm/EsbSign/func_addEsbSignData").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.sign") + res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        })
      },
      handleDiscDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minSignTime = arr[0].replace(/-/g, "");
          this.formItem.maxSignTime = arr[1].replace(/-/g, "");
          this.signDt = [arr[0], arr[1]];
        } else {
          this.formItem.minSignTime = "";
          this.formItem.maxSignTime = "";
          this.signDt = [];
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },

      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
        this.currentSelectList=[];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.signUserNo = "";
        this.formItem.minSignTime = "";
        this.formItem.maxSignTime = "";
        this.formItem.signStatus = "";
        this.signDt = [];
      },
    }

  };
</script>

<style scoped>

</style>
