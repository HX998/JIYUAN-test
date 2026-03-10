<!-- 营业日期管理-->
<template>
  <div :style="{height: getHeight + 'px'}">
    <div>
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="3" class="h-form-search">
        <h-form-item prop="workday"  :label="$t('m.i.common.busiDt')" required>
          <h-date-picker type="date" :value="formItem.workday":editable="false" v-model="formItem.workday" placeholder=" " :showFormat=true></h-date-picker>
        </h-form-item>
        <h-form-item prop="sysStatus" :label="$t('m.i.common.sysStatus')" required>
          <h-select v-model="formItem.sysStatus" placeholder=" ">
            <!--<h-option value="1">系统日间营业</h-option>
            <h-option value="1">系统日间营业</h-option>
            <h-option value="2">系统日终状态</h-option>
            <h-option value="3">系统维护期</h-option>-->
            <h-option v-for="item in sysStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
          </h-select>
        </h-form-item>
      </h-form>
    </div>
    <div >
      <h-button type="primary" @click="formSave()">{{$t("m.i.common.save")}}</h-button>
    </div>
  </div >
</template>

<script>
  import { post, getDictListByGroups } from "@/api/bizApi/commonUtil";
  export default {
    name: "busiDateMain",
    data() {
      return {
        getDateUrl:'/sm/oper/busiDate/viewBusiDate',
        updateUrl :'/sm/oper/busiDate/updateWorkday',
        formItem : {
          id:'',
          workday:'',
          sysStatus: ''
        },
        submitFlag : false,
        readonly : false,
        currentSelectRow : [],
        currentSelectRowInx : [],
        sysStatusList : [],
        type : '',
        //是否显示更多查询项
        ifShowMore : false,
      }
    },
    computed: {
      getHeight() {
        let appObj = document.getElementsByClassName("app-main");
        let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
        return window.innerHeight - appOffsetTop;
      }
    },
    mounted() {
      this.getDate();
      getDictListByGroups("SysStatusCode").then(res => {
        if (res) {
          this.sysStatusList = res.get("SysStatusCode");
        }
      });
    },
    methods: {
      getDate(){
        post({},this.getDateUrl).then(res => {
          if(res){
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.formItem.id=res.data.retData.id;
              this.formItem.workday = res.data.retData.workday+"";//将int类型转化成日期类型
              this.formItem.sysStatus=res.data.retData.sysStatus;
            }else{
              this.$msgTip.error(this, { info: msg });
            }
          }else{
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },
      // 保存提交
      formSave() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确认修改营业日期相关信息吗?",
          onOk: () => {
            this.updateConfirm();
          }
        });
      },
      /**
       * 修改具体操作
       */
      updateConfirm(){
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            this.formItem.workday = this.$moment(this.formItem.workday).format("YYYYMMDD");
            post(this.formItem,this.updateUrl).then(res => {
              this.submitFlag = false
              if(res){
                let msg = res.data.retMsg;
                let retCode = res.data.retCode
                if(retCode=="000000"){
                  this.$msgTip.success(this);
                }else{
                  this.$msgTip.error(this, { info: msg });
                }
              }else{
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      }
    },
  };
</script>

<style scoped>

</style>
