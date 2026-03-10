<template>
  <h-dropdown placement="bottom-start" trigger="click" @on-click="voucherPrinting"  v-if="btnAuth.print ===undefined?true:btnAuth.print.isShow">
    <h-button type="primary">{{$t("m.i.common.proofPrint")}}<h-icon name="unfold"></h-icon></h-button>
    <h-dropdown-menu slot="list"  >
      <h-dropdown-item name="select">{{$t("m.i.common.selectPrinting")}}</h-dropdown-item>
      <h-dropdown-item name="batch">{{$t("m.i.common.batchPrinting")}}</h-dropdown-item>
    </h-dropdown-menu>
  </h-dropdown>
</template>
<script>
  export default {
    name : "proofPrintBtn",
    data() {
      return {

      }
    },
    props:{
      btnAuth:{
        type: Object,
        default(){
          return {
            print:{
              isShow:true
            }
          }
        }
      }
    },
    methods:{
      voucherPrinting(submitType){
        this.$emit('voucherPrinting',submitType);
      }

    }
  }
</script>
