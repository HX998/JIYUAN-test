<template>
  <div v-if="billInfoIsShow">
    <!-- 数据展示表格 -->
        <h-datagrid :columns="columns"
                    highlightRow
                    url=""
                    :bindForm="formItem"
                    ref="billManagerDatagrid">
        </h-datagrid>
  </div>
</template>

<script>
  export default {
    name: "commonBillInfoDetail",
    data() {
      let options = {};
      options.formItem = {
        batchNo: ''
      };
      options.columns = [
        {
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: true,
          align: 'center'
        },
        {
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false
        },

        {
          title: this.$t('m.i.billInfo.billNo'),
          key: 'billNo',
          align: 'left',
          hiddenCol: true,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.flowStatus'),
          key: 'prodName',
          align: 'left',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          key: 'drwrName',
          sortable: true,
          align: 'left',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          key: 'pyeeName',
          sortable: true,
          align: 'left',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: 'acptName',
          align: 'left',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.billMoney'),
          key: 'billMoney',
          sortable: true,
          align: 'left',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
          key: 'remitDt',
          align: 'left',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
          key: 'dueDt',
          sortable: true,
          align: 'left',
          hiddenCol: false,
        }
      ];
      options.billInfoIsShow = false;
      return options;
    },
    watch:{
      prodNo(val) {
        if(val === "222") {
          this.billInfoIsShow = true;
        }else {
          this.billInfoIsShow = false;
        }
      }
    },

    props : {
      batchNo: "",
      prodNo: ""
    },
  };

</script>
