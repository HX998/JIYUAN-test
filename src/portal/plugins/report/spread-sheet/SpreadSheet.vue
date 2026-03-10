<template>
  <div class="spread-wrapper">
    <gc-spread-sheets
      ref='spread'
      v-bind="$props"
      v-on="$listeners"
      @workbookInitialized="workbookInitialized($event)">
    </gc-spread-sheets>
    <h-spin size="large" fix v-show="loading"></h-spin>
  </div>
  
</template>
<script>
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013darkGray.css'
import '@grapecity/spread-sheets-vue'
import GC from '@grapecity/spread-sheets/dist/gc.spread.sheets.all.min.js'
import ExcelIO from '@grapecity/spread-excelio/dist/gc.spread.excelio.min.js'
import "@grapecity/spread-sheets-shapes/dist/gc.spread.sheets.shapes.min.js"
import "@grapecity/spread-sheets-resources-zh";

GC.Spread.Common.CultureManager.culture("zh-cn"); 
GC.Spread.Sheets.LicenseKey = "hundsun,324869615954743#B0cMuVzZ5Q6axInelN4NyoEa4g6cyQ6S9FEb9FleoZUSYFDaJxWeDtkdyoncZdXUrV6MmhFeL94K8ZXR7x6dxATQmVENRR6NGdEcvc4N8QDZSVFN8VjaSRGdIVmdEhXRxY5ZHVnQwRVcUJjRkFGN4VDaysUYMRXeRxGOhdTO646bNFlR9N5MYVGNrpVV5JzQnJjaihkZEFUVyRlTtdnb7klVY3mMxYmNpFUYaxmeCZGaJNDUQdlUXdnWxkUM5clUjlDeHNGex9mSMl7b4BlcqBlMy4mSR36YvFXeEpHaGpXaFF7NvZ5TjdlWiojITJCLiETQGBDN4QzMiojIIJCL4QTOxUTOxgTO0IicfJye#4Xfd5nIJZUOCJiOiMkIsIiMx8idgMlSgQWYlJHcTJiOi8kI1tlOiQmcQJCLigzM8UzNwACMyUDM9EDMyIiOiQncDJCLig1jlzahlDZmpnInm71ukHqgoDZrlXLln/JlnLZgmLiOiEmTDJCLiMDN7QTN9UTM6kjN8QjMzIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPntSa5c4V8EUcGlDTCpGen3yMqN7amlFMBJ5Z6hDV4dmWVlVa7J6MYV5RFdXTZRlMUlWVoJ6bnVGbwV4LGdmZKNzdsF7dH5EUIpXNBdHbjZkN5Fmcv86aPNGM9FjVHNjTQdUWTF5UnJTQz2ZZIN";
ExcelIO.LicenseKey = "hundsun,324869615954743#B0cMuVzZ5Q6axInelN4NyoEa4g6cyQ6S9FEb9FleoZUSYFDaJxWeDtkdyoncZdXUrV6MmhFeL94K8ZXR7x6dxATQmVENRR6NGdEcvc4N8QDZSVFN8VjaSRGdIVmdEhXRxY5ZHVnQwRVcUJjRkFGN4VDaysUYMRXeRxGOhdTO646bNFlR9N5MYVGNrpVV5JzQnJjaihkZEFUVyRlTtdnb7klVY3mMxYmNpFUYaxmeCZGaJNDUQdlUXdnWxkUM5clUjlDeHNGex9mSMl7b4BlcqBlMy4mSR36YvFXeEpHaGpXaFF7NvZ5TjdlWiojITJCLiETQGBDN4QzMiojIIJCL4QTOxUTOxgTO0IicfJye#4Xfd5nIJZUOCJiOiMkIsIiMx8idgMlSgQWYlJHcTJiOi8kI1tlOiQmcQJCLigzM8UzNwACMyUDM9EDMyIiOiQncDJCLig1jlzahlDZmpnInm71ukHqgoDZrlXLln/JlnLZgmLiOiEmTDJCLiMDN7QTN9UTM6kjN8QjMzIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPntSa5c4V8EUcGlDTCpGen3yMqN7amlFMBJ5Z6hDV4dmWVlVa7J6MYV5RFdXTZRlMUlWVoJ6bnVGbwV4LGdmZKNzdsF7dH5EUIpXNBdHbjZkN5Fmcv86aPNGM9FjVHNjTQdUWTF5UnJTQz2ZZIN";

import loadReturnInfo from './mixin/LoadReturnInfo'
import customContextMenu from './mixin/CustomContextMenu'
import * as FileSaver from 'file-saver'

export default {
  name: "spreadSheet",
  mixins: [customContextMenu],
  props: {
    name: String,
    allowUserZoom: Boolean,
    allowUserResize: Boolean,
    tabStripVisible: {
      type: Boolean,
      default: true
    },
    tabEditable: Boolean,
    newTabVisible: {
      type: Boolean,
      default: true
    },
    allowUserEditFormula: Boolean,
    autoFitType: Object,
    allowUserDragFill: Boolean,
    allowUserDragDrop: Boolean,
    highlightInvalidData: Boolean,
    referenceStyle: Object,
    backColor: String,
    grayAreaBackColor: String,
    backgroundImage: String,
    backgroundImageLayout: Object,
    showVerticalScrollbar: {
      type: Boolean,
      default: true
    },
    showHorizontalScrollbar: {
      type: Boolean,
      default: true
    },
    showScrollTip: Object,
    showResizeTip: Object,
    showDragDropTip: Boolean,
    showDragFillTip: Boolean,
    hostStyle: Object,
    hostClass: {
      type: String,
      default: "spreadHost"
    },
    //加载动效
    loading: {
      type: Boolean,
      default: false
    },
    allowContextMenu: {
      type: Boolean,
      default: true
    },
    rowCount: {
      type: Number,
      default: 200
    },
    colCount: {
      type: Number,
      default: 60
    },
    isProtected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      infos: []
    }
  },
  mounted() {
    this.$refs.spread.spread.bind(GC.Spread.Sheets.Events.ShapeSelectionChanged, (e, args) => {
      this.$emit("shapeSelectionChanged", e, args)
    });

    this.$refs.spread.spread.bind(GC.Spread.Sheets.Events.PictureSelectionChanged, (e, args) => {
      this.$emit("pictureSelectionChanged", e, args)
    })

    this.getSpread().options.allowContextMenu = this.allowContextMenu;
  },
  methods: {
    getSpread() {
      return this.$refs.spread.spread
    },
    getHost() {
      return this.$refs.spread.spread.getHost();
    },
    refresh() {
      this.$refs.spread.spread.refresh();
    },
    getSheet(index) {
      const spread = this.$refs.spread.spread;
      return spread.getSheet(index);
    },
    getSheetIndex(sheet) {
      return this.$refs.spread.spread.sheets.indexOf(sheet);
    },
    getActiveSheet() {
      const spread = this.$refs.spread.spread;
      return spread.getActiveSheet();
    },
    getActiveSheetIndex() {
      const spread = this.$refs.spread.spread;
      return spread.getActiveSheetIndex();
    },
    lineBorder(color="black", style) {
      return new GC.Spread.Sheets.LineBorder(color, this.lineStyle(style));
    },
    lineStyle(type) {
      return GC.Spread.Sheets.LineStyle[type];
    },
    shapes() {
      return GC.Spread.Sheets.Shapes;
    },
    floatingObjects(name) {
      const spreadNS = GC.Spread.Sheets;
      return new spreadNS.FloatingObjects.FloatingObject(name);
    },
    horizontalAlign(type) {
      return GC.Spread.Sheets.HorizontalAlign;
    },
    verticalAlign(type) {
      return GC.Spread.Sheets.VerticalAlign;
    },
    cellRange(sheet, row, col, rowCount, colCount, sheetArea) {
      return new GC.Spread.Sheets.CellRange(sheet, row, col, rowCount, colCount, sheetArea);
    },
    open(excel, infos) {
      const excelIo = new ExcelIO.IO();
      return new Promise((resolve, reject) => {
        excelIo.open(excel, (json) => {
          const workbookObj = json;
          this.$refs.spread.spread.fromJSON(workbookObj);
          this.initializeProps();
          this.setSheetOptions();

          this.openReturnInfo(infos);
          resolve();
        }, (error) => {
          reject(error)
        })
      })
    },
    //open excel完之后spread的option会重置,options....重新设置,巨坑
    initializeProps() {
      for(let key in this.$props) {
        this.getSpread().options[key] = this.$props[key];
      }
    },
    save(fileName="download", type="xlsx") {
      return new Promise((resolve, reject) => {
        const json = this.$refs.spread.spread.toJSON();
        const excelIo = new ExcelIO.IO()
        excelIo.save(json, (blob) => {
          FileSaver.saveAs(blob, `${fileName}.${type}`);
          resolve();
        }, (error) => {
          reject(error)
        })
      })
    },
    destroy() {
      this.getSpread().destroy();
    },
    //初始化excel
    initializeSheet() {
      const spread = this.getSpread();
      spread.clearSheets();
      const sheet = new GC.Spread.Sheets.Worksheet('Sheet1');
      spread.addSheet(0, sheet);
      this.setSheetOptions();
    },
    //重置表单,index:表单序号
    resetSheet(index) {
      const spread = this.getSpread();
      const sheet = this.getSheet(index);
      sheet.reset();
    },
    //加载回填信息
    openReturnInfo(infos) {
      this.infos = []
      if (infos !== undefined && infos !== null) {
        for (var i = 0; i < infos.length; i++) {
          var info = infos[i]
          var sheet = this.getSheet(info.sheetIndex)
          var columnCount = sheet.getColumnCount()
          var rowCount = sheet.getRowCount()
          if (info.row + info.rowSpan - 1 > rowCount) {
            sheet.setRowCount(info.row + info.rowSpan - 1)
          }
          if (info.column + info.columnSpan - 1 > columnCount) {
            sheet.setColumnCount(info.column + info.columnSpan - 1)
          }
          info.indexCode = i
          info.addIndex = 0
          this.infos.push(info)
        }
      }
    },
    workbookInitialized() {
      this.initializeSheet()
    },
    setSheetOptions() {
      const activeSheet = this.getActiveSheet();
      activeSheet.setRowCount(this.rowCount);
      activeSheet.setColumnCount(this.colCount);
      activeSheet.options.isProtected = this.isProtected;
    }
  },
  beforeDestroy() {
    this.getSpread().unbindAll();
    this.destroy();
  }
}
</script>
<style lang="scss" scoped>
.spread-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  .spreadHost {
    width: 100%;
    height: 100%;
  }
}

</style>

