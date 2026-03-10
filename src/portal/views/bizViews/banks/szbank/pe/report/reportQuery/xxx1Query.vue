<!--报表查询-利差报表-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :label-width="90" cols="4" class="h-form-search">
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
      </h-col>
    </h-row>
    <div>
      <iframe v-if="reloadIframe" ref="iframe" :src="src" width="100%" height="400px"></iframe>
    </div>
  </div>
</template>

<script>
  import { post, on, off, formatNumber ,exportList, formatBillRange,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "xxx1Query",
    components: {
    },
    data() {
      return{
        reportAcctNo:"0005032",
        src:"",
        reloadIframe:false
      }
    },
    computed: {

    },
    created() {

    },
    mounted() {
      const mapFrame = this.$refs.iframe;
    },
    methods: {
      returnMain() {
        this.resetSearch();
      },
      //表单查询
      handleSearch() {
        let userName = this.reportAcctNo;
        let issueTime = Date.now();
        userName = JSON.stringify({'username':userName,'issueTime':issueTime});
        this.reloadIframe = false;
        post({reportAcctNo:userName}, "pc/acct/reportQuery/func_xxx1Query").then(res=>{
          this.src = res.data.retData;
          this.reloadIframe = true;
        }).catch(reason => {
          this.$msgTip.error(this, {info: reason});
        })
      },

      //重置表单查询结果
      resetSearch() {
        this.reportAcctNo = "";
      },
    }
  };
</script>

<style scoped>

</style>
