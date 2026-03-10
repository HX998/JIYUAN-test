<template>
  <div>
    <h-form :model="formItem" :label-width="90" ref="formItem" cols="1" class="h-form-search">
        <h-button type="primary" @click="memberDataImport('acct')">{{$t("m.i.config.acctImport")}}</h-button>
    </h-form>
  </div >
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "acctConfigImport",
    data() {
      return {
        formItem : {
          code:'',
          loginStatus:'',
          remark:'',
          curSysDate: '',
          curSysStatus: '',
          sysCtrlPauseCpesKey:''
        },
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        addOrEditWin : false,
        readonly : false,
        moveUpDisabled : false,
        moveDownDisabled : false,
        tableRef : "selfTable",
        currentSelectRow : [],
        currentSelectRowInx : [],
        type : '',
        //是否显示更多查询项
        ifShowMore : false,
      };
    },
    components: {

    },
    mounted() {

    },
    methods: {
      memberDataImport(type){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.config.acctImport"),
          content: this.$t("m.i.common.confirm") + "?",

          onOk: () => {
            this.type = type;
            this.importData();
          }
        });
      },

      importData(){
        let a=this.type;
        post({code:this.type},'/pc/acct/acctConfig/imporAcct').then(res => {
          if(res){
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.$msgTip.success(this);
              this.type=" ";
            }else{
              this.$msgTip.error(this, { info: msg });
            }
          }else{
            this.$msgTip.error(this.$t('m.i.common.netError'));
          }
        });
      }
    },
  };
</script>

<style scoped>

</style>
