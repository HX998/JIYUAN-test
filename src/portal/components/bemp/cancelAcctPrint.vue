<template>
  <h-msg-box v-model="tempShowPrintWin" width="300" height="100" top="60" :maximize="true" @on-close="handleClose"
             :mask-closable="false">
    <p slot="header">
      <span>撤销记账凭证打印</span>
    </p>
    是否打印统一冲正业务凭证？
    <br>
    <div slot="footer">
      <span>
        <h-button type="ghost" @click="handleClose()">否</h-button>
      </span>
      <span>
        <h-button type="primary" @click="print()">是</h-button>
      </span>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off ,getUploadImgType,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name:"cancelAcctPrint",
    data(){
      return{
        canPrint:true,
      }
    },
    methods:{
      handleClose(){
        this.$emit("showCancelAcctPrintWinClose", "");
      },
      print(){
        post({frontFlowNos:this.frontFlowNos}, "/pe/print/voucherPrint/voucherPrintManger/cancelAcctPrintVoucher").then(res=>{
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$print.vouchTemplatePrint(this, {
              data:res.data.retData.printInfos,
              vochIds:res.data.retData.vochIds,
              callback: () => {
                this.handleClose();
              },
              errorCallback: () => {

              }
            });
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }).catch(reason => {
          this.$msgTip.error(this, {info: reason});
        })
       /* this.$print.vochPrint(this, {
          exitDataFlag: "cancelAcctPrint", params: {exitDataFlag:"cancelAcctPrint",voucherType: "PE040001", frontFlowNos:this.frontFlowNos.toString()},
          callback: () => {
            this.handleClose();
          },
          errorCallback: () => {

          }
        });*/
      },
    },
    computed:{
      tempShowPrintWin:{
        get(){
          return this.showCancelAcctPrintWin&&this.canPrint;
        },
        set() {
        }
      }
    },
    props:{
      showCancelAcctPrintWin:{
        type:Boolean,
        default(){
          return false
        }
      },
      frontFlowNos:{
        type:[Array,String],
        default(){
          return [];
        }
      }
    },
    watch:{
      showCancelAcctPrintWin(value){
        if (value===true){
          if (!this.canPrint) {
            this.handleClose();
          }
        }
      }
    },
    created() {
      //获取是否需要进行冲正打印
      getSingleParamValuesByKeys("pe.voch.print_model").then(res => {
        this.canPrint=res['pe.voch.print_model']!=="2"; //2-不打印,生成文件
      });
    }
  }
</script>
