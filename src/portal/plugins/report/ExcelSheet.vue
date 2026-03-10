<template>
  <InnerSheet :spreadDiv="spreadDiv" ref="spread" @valuechanged="valuechanged" @datachanged="datachanged" :hotStyle="hotStyle"></InnerSheet>
</template>

<script>
  import InnerSheet from './InnerSheet'
  export default {
    components: {
      InnerSheet
    },
    props: {
      hotStyle: {
        type: Object,
        default: null
      },
      spreadDiv: {
        type: String,
        default: "spreadDiv"
      }
    },
    created () {

    },
    mounted () {
      this.loadApi()
    },
    methods: {
      loadApi: function () {
        if (!document.report) {
          document.report = {}
        }
        document.report.api = {}
        document.report.api.load = this.load
        document.report.api.save = this.save
        document.report.api.getChanged = this.getChanged
      },
      // loadDefaultPdfFont: function (font) {
      //   this.$refs.spread.defaultFont = font
      // },
      load: function (file, returnInfos) {
        if (file !== undefined && file !== null) {
          this.$refs.spread.load(file, returnInfos)
          this.vals = []
          this.datas = []
        }
      },
      valuechanged: function (args) {
        if (args !== undefined && args !== null) {
          if (this.vals === undefined || this.vals === null) {
            this.vals = []
          }
          for (var i = 0; i < args.length; i++) {
            this.vals.push(args[i])
          }
        }
      },
      datachanged: function (args) {
        if (args !== undefined && args !== null) {
          if (this.datas === undefined || this.datas === null) {
            this.datas = []
          }
          if (this.vals !== undefined && this.vals !== null && this.vals.length > 0) {
            var last = {}
            last.changedtype = 'value'
            last.changed = this.vals
            this.datas.push(last)
            this.vals = []
          }
          var changed = {}
          changed.changedtype = args.type
          var changeddata = {}
          changeddata.dataSource = args.dataSource
          changeddata.dataKey = args.dataKey
          changed.changed = changeddata
          this.datas.push(changed)
        }
      },
      getChanged: function () {
        if (this.datas === undefined || this.datas === null) {
          this.datas = []
        }
        if (this.vals !== undefined && this.vals !== null && this.vals.length > 0) {
          var last = {}
          last.changedtype = 'value'
          last.changed = this.vals
          return [].concat(this.datas, [last])
        } else {
          return this.datas
        }
      },
      save: function (fileName) {
        this.$refs.spread.save(fileName)
      },
      // savePdf: function () {
      //   this.$refs.spread.savePdf()
      // },
      getSpread: function () {
        return this.$refs.spread.spread
      }
    }
  }
</script>
