<template>
  <div
    :id="spreadDiv"
    class="spreadDivClass"
    :style="{
      height: hotStyle && hotStyle.height? `${hotStyle.height}px` : null
    }"></div>
</template>
<script>
  import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css'
  import '@grapecity/spread-sheets-vue'
  import GC from '@grapecity/spread-sheets'
  import '@grapecity/spread-sheets-charts'
  // import '@grapecity/spread-sheets-print'
  // import '@grapecity/spread-sheets-pdf'
  import '@grapecity/spread-sheets-resources-zh'
  import * as ExcelIO from '@grapecity/spread-excelio'
  import * as FileSaver from 'file-saver'
  GC.Spread.Common.CultureManager.culture('zh-cn')
  GC.Spread.Sheets.LicenseKey = "hundsun,324869615954743#B0cMuVzZ5Q6axInelN4NyoEa4g6cyQ6S9FEb9FleoZUSYFDaJxWeDtkdyoncZdXUrV6MmhFeL94K8ZXR7x6dxATQmVENRR6NGdEcvc4N8QDZSVFN8VjaSRGdIVmdEhXRxY5ZHVnQwRVcUJjRkFGN4VDaysUYMRXeRxGOhdTO646bNFlR9N5MYVGNrpVV5JzQnJjaihkZEFUVyRlTtdnb7klVY3mMxYmNpFUYaxmeCZGaJNDUQdlUXdnWxkUM5clUjlDeHNGex9mSMl7b4BlcqBlMy4mSR36YvFXeEpHaGpXaFF7NvZ5TjdlWiojITJCLiETQGBDN4QzMiojIIJCL4QTOxUTOxgTO0IicfJye#4Xfd5nIJZUOCJiOiMkIsIiMx8idgMlSgQWYlJHcTJiOi8kI1tlOiQmcQJCLigzM8UzNwACMyUDM9EDMyIiOiQncDJCLig1jlzahlDZmpnInm71ukHqgoDZrlXLln/JlnLZgmLiOiEmTDJCLiMDN7QTN9UTM6kjN8QjMzIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPntSa5c4V8EUcGlDTCpGen3yMqN7amlFMBJ5Z6hDV4dmWVlVa7J6MYV5RFdXTZRlMUlWVoJ6bnVGbwV4LGdmZKNzdsF7dH5EUIpXNBdHbjZkN5Fmcv86aPNGM9FjVHNjTQdUWTF5UnJTQz2ZZIN";
  ExcelIO.LicenseKey = "hundsun,324869615954743#B0cMuVzZ5Q6axInelN4NyoEa4g6cyQ6S9FEb9FleoZUSYFDaJxWeDtkdyoncZdXUrV6MmhFeL94K8ZXR7x6dxATQmVENRR6NGdEcvc4N8QDZSVFN8VjaSRGdIVmdEhXRxY5ZHVnQwRVcUJjRkFGN4VDaysUYMRXeRxGOhdTO646bNFlR9N5MYVGNrpVV5JzQnJjaihkZEFUVyRlTtdnb7klVY3mMxYmNpFUYaxmeCZGaJNDUQdlUXdnWxkUM5clUjlDeHNGex9mSMl7b4BlcqBlMy4mSR36YvFXeEpHaGpXaFF7NvZ5TjdlWiojITJCLiETQGBDN4QzMiojIIJCL4QTOxUTOxgTO0IicfJye#4Xfd5nIJZUOCJiOiMkIsIiMx8idgMlSgQWYlJHcTJiOi8kI1tlOiQmcQJCLigzM8UzNwACMyUDM9EDMyIiOiQncDJCLig1jlzahlDZmpnInm71ukHqgoDZrlXLln/JlnLZgmLiOiEmTDJCLiMDN7QTN9UTM6kjN8QjMzIiOiQWSiwSflNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPntSa5c4V8EUcGlDTCpGen3yMqN7amlFMBJ5Z6hDV4dmWVlVa7J6MYV5RFdXTZRlMUlWVoJ6bnVGbwV4LGdmZKNzdsF7dH5EUIpXNBdHbjZkN5Fmcv86aPNGM9FjVHNjTQdUWTF5UnJTQz2ZZIN";
  // GC.Spread.Sheets.LicenseKey = "HengSheng,717449494783634#B05Y4UGdjhHMMFzTtxWbQVUT9hXZzAVSuNGduZnY83kQw4mZRdlY0dFcIdDR5g4Sx9kYjdHRM5GWolFWrIWNyI6N4lDcMBzN63kNpNVOjZGe8V5cyg5QwN4a9sUZsBXd846VhZ4LQFTb7oGdwR4dphneyN5U9oWcJNTUSJXavVWcTJFbBp4VyY6UvY6VnNmY8M7d8cFVKhTUyo7c9EnZ7oHVmp4KD5EcPFFbzNlVuZHer8kemF6MiNnMUhFRxZFR7lkbHhEckRjWLJ5apVlNvd6TZNzdjJXOtJUa5pGNRdlT7UmSK5WQ55EVWZWcJNjWmRkI0IyUiwiIzEUO9QjNCZjI0ICSiwCN5ADOyADO4ETM0IicfJye#4Xfd5nIJZUOCJiOiMkIsIiMx8idgMlSgQWYlJHcTJiOi8kI1tlOiQmcQJCLiATN8AjMwAiNxUDM9EDMyIiOiQncDJCLiUTM6ATOxAjMiojIwhXRiwiI8+Y9sWY9QmZ0Jyp93uL9hKI0Q6a95S99fS99SGo9iojIh94QiwiI4MjNzgzN4kDN9QDN7EzNiojIklkIs4XZzxWYmpjIyNHZisnOiwmbBJye0ICRiwiI34zd5MUURlESz8UURNVUJFnZ5hUcZdTTP5WbqJUexIja7Q7STpmUwEGZ6F4SKRWT9InMLlDWvc5cpdGOUJHeCdFeHN4VhB5b7JjTXV4V09kQP9kMZdma9YVMmVmZph7L0lUT5gWaJF";
  // ExcelIO.LicenseKey = "HengSheng,717449494783634#B05Y4UGdjhHMMFzTtxWbQVUT9hXZzAVSuNGduZnY83kQw4mZRdlY0dFcIdDR5g4Sx9kYjdHRM5GWolFWrIWNyI6N4lDcMBzN63kNpNVOjZGe8V5cyg5QwN4a9sUZsBXd846VhZ4LQFTb7oGdwR4dphneyN5U9oWcJNTUSJXavVWcTJFbBp4VyY6UvY6VnNmY8M7d8cFVKhTUyo7c9EnZ7oHVmp4KD5EcPFFbzNlVuZHer8kemF6MiNnMUhFRxZFR7lkbHhEckRjWLJ5apVlNvd6TZNzdjJXOtJUa5pGNRdlT7UmSK5WQ55EVWZWcJNjWmRkI0IyUiwiIzEUO9QjNCZjI0ICSiwCN5ADOyADO4ETM0IicfJye#4Xfd5nIJZUOCJiOiMkIsIiMx8idgMlSgQWYlJHcTJiOi8kI1tlOiQmcQJCLiATN8AjMwAiNxUDM9EDMyIiOiQncDJCLiUTM6ATOxAjMiojIwhXRiwiI8+Y9sWY9QmZ0Jyp93uL9hKI0Q6a95S99fS99SGo9iojIh94QiwiI4MjNzgzN4kDN9QDN7EzNiojIklkIs4XZzxWYmpjIyNHZisnOiwmbBJye0ICRiwiI34zd5MUURlESz8UURNVUJFnZ5hUcZdTTP5WbqJUexIja7Q7STpmUwEGZ6F4SKRWT9InMLlDWvc5cpdGOUJHeCdFeHN4VhB5b7JjTXV4V09kQP9kMZdma9YVMmVmZph7L0lUT5gWaJF";

  export default {
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
    data () {
      return {}
    },
    // watch: {
    //   hotStyle: {
    //     deep: true,
    //     handler(val) {
    //       document.getElementById('spreadDiv').style.width = val.width;
    //       document.getElementById('spreadDiv').style.height = val.height;
    //     }
    //   }
    // },
    mounted: function () {
      var com = this
      var gcSS = GC.Spread.Sheets
      com.spread = new gcSS.Workbook(document.getElementById(this.spreadDiv))
      com.spread.options.allowExtendPasteRange = true
      com.spread.suspendPaint()
      var VC = gcSS.Events.ValueChanged
      var dealOtherReturnInfo = function (sheetIndex, args) {
        var dataValue = com.getDataValue(sheetIndex, args.row + 1, args.col + 1)
        if (dataValue !== undefined) {
          var val = {}
          val.newValue = args.newValue
          val.oldValue = args.oldValue
          val.dataSource = dataValue.dataSource
          com.$emit('valuechanged', val)
        }
      }
      var dealDynamicReportReturnInfo = function (group, args) {
        if (group.reportDirection === 'Vertical') {
          (function () {
            var val = {}
            val.newValue = args.newValue
            val.oldValue = args.oldValue
            var index = args.col + 1 - group.extendColumn
            var di = group.dataItems[index]
            if (di !== undefined && di !== null) {
              val.dataSource = di.dataSource
              val.dataItem = di.dataItem
              var num = args.row + 1 - group.extendRow
              if (typeof di.dataKeyMappingIndex === 'number' && di.dataKeyMappingIndex >= 0) {
                val.dataKey = args.sheet.getValue(args.row, group.column + di.dataKeyMappingIndex - 1)
              } else {
                val.dataKey = (num + (typeof di.dataKeyDeviation === 'number' ? di.dataKeyDeviation : 0))
              }
              if (val.dataKey !== undefined && val.dataKey !== null && val.dataKey !== '') {
                var sps = args.sheet.getSpans(new gcSS.Range(args.row, args.col, 1, 1))
                if (sps !== undefined && sps !== null && sps.length > 0 && sps[0].rowCount > 1) {
                  var len = sps[0].rowCount
                  var vals = []
                  for (var i = 0; i < len; i++) {
                    var temp = {}
                    temp.newValue = val.newValue
                    temp.oldValue = val.oldValue
                    temp.dataSource = val.dataSource
                    temp.dataItem = val.dataItem
                    if (typeof di.dataKeyMappingIndex === 'number' && di.dataKeyMappingIndex >= 0) {
                      temp.dataKey = args.sheet.getValue(args.row + i, group.row + di.dataKeyMappingIndex - 1)
                    } else {
                      temp.dataKey = (num + i + (typeof di.dataKeyDeviation === 'number' ? di.dataKeyDeviation : 0))
                    }
                    vals.push(temp)
                  }
                  com.$emit('valuechanged', vals)
                } else {
                  com.$emit('valuechanged', [val])
                }
              }
            }
          })()
        } else if (group.reportDirection === 'Horizontal') {
          (function () {
            var val = {}
            val.newValue = args.newValue
            val.oldValue = args.oldValue
            val.dataSource = group.dataSource
            var index = args.row + 1 - group.extendRow
            var di = group.dataItems[index]
            if (di !== undefined && di !== null) {
              val.dataSource = di.dataSource
              val.dataItem = di.dataItem
              var num = args.col + 1 - group.extendColumn
              if (typeof di.dataKeyMappingIndex === 'number' && di.dataKeyMappingIndex >= 0) {
                val.dataKey = args.sheet.getValue(group.row + di.dataKeyMappingIndex - 1, args.col)
              } else {
                val.dataKey = (num + (typeof di.dataKeyDeviation === 'number' ? di.dataKeyDeviation : 0))
              }
              if (val.dataKey !== undefined && val.dataKey !== null && val.dataKey !== '') {
                var sps = args.sheet.getSpan(new gcSS.Range(args.row, args.col, 1, 1))
                if (sps !== undefined && sps !== null && sps.length > 0 && sps[0].colCount > 1) {
                  var len = sps[0].colCount
                  var vals = []
                  for (var i = 0; i < len; i++) {
                    var temp = {}
                    temp.newValue = val.newValue
                    temp.oldValue = val.oldValue
                    temp.dataSource = val.dataSource
                    temp.dataItem = val.dataItem
                    if (typeof di.dataKeyMappingIndex === 'number' && di.dataKeyMappingIndex >= 0) {
                      temp.dataKey = args.sheet.getValue(group.row + di.dataKeyMappingIndex - 1, args.col)
                    } else {
                      temp.dataKey = (num + i + (typeof di.dataKeyDeviation === 'number' ? di.dataKeyDeviation : 0))
                    }
                    vals.push(temp)
                  }
                  com.$emit('valuechanged', vals)
                } else {
                  com.$emit('valuechanged', [val])
                }
              }
            }
          })()
        }
      }
      com.spread.bind(VC, function (e, args) {
        var sheetIndex = com.getSheetIndex(args.sheet)
        var group = com.getGroup(sheetIndex, args.row + 1, args.col + 1)
        if (group) {
          dealDynamicReportReturnInfo(group, args)
        } else {
          dealOtherReturnInfo(sheetIndex, args)
        }
      })
      com.spread.bind(gcSS.Events.InvalidOperation, function (e, info) {
        console.log(e, info)
      })
      var commandManager = com.spread.commandManager()
      var insertRowMenuItemCommand = {
        canUndo: false,
        execute: function (spread, options) {
          if (options.commandOptions) {
            spread.suspendPaint()
            var info = options.commandOptions
            var group = com.infos[info.groupIndex]
            var sheet = spread.getActiveSheet()
            var flag = false
            if (sheet.options.isProtected) {
              flag = true
              sheet.options.isProtected = false
            }
            com.insertGroupRow(sheet, group, info.row)
            if (flag) {
              sheet.options.isProtected = true
            }
            spread.resumePaint()
          }
        }
      }
      var addRowMenuItemCommand = {
        canUndo: false,
        execute: function (spread, options) {
          if (options.commandOptions) {
            spread.suspendPaint()
            var info = options.commandOptions
            var group = com.infos[info.groupIndex]
            var sheet = spread.getActiveSheet()
            var flag = false
            if (sheet.options.isProtected) {
              flag = true
              sheet.options.isProtected = false
            }
            com.appendGroupRow(sheet, group)
            if (flag) {
              sheet.options.isProtected = true
            }
            spread.resumePaint()
          }
        }
      }
      var insertColumnMenuItemCommand = {
        canUndo: false,
        execute: function (spread, options) {
          if (options.commandOptions) {
            spread.suspendPaint()
            var info = options.commandOptions
            var group = com.infos[info.groupIndex]
            var sheet = spread.getActiveSheet()
            var flag = false
            if (sheet.options.isProtected) {
              flag = true
              sheet.options.isProtected = false
            }
            com.insertGroupColumn(sheet, group, info.column)
            if (flag) {
              sheet.options.isProtected = true
            }
            spread.resumePaint()
          }
        }
      }
      var addColumnMenuItemCommand = {
        canUndo: false,
        execute: function (spread, options) {
          if (options.commandOptions) {
            spread.suspendPaint()
            var info = options.commandOptions
            var group = com.infos[info.groupIndex]
            var sheet = spread.getActiveSheet()
            var flag = false
            if (sheet.options.isProtected) {
              flag = true
              sheet.options.isProtected = false
            }
            com.appendGroupColumn(sheet, group)
            if (flag) {
              sheet.options.isProtected = true
            }
            spread.resumePaint()
          }
        }
      }
      var deleteRowMenuItemCommand = {
        canUndo: false,
        execute: function (spread, options) {
          if (options.commandOptions) {
            spread.suspendPaint()
            var info = options.commandOptions
            var group = com.infos[info.groupIndex]
            var sheet = spread.getActiveSheet()
            var flag = false
            if (sheet.options.isProtected) {
              flag = true
              sheet.options.isProtected = false
            }
            com.removeGroupRow(sheet, group, info.row)
            if (flag) {
              sheet.options.isProtected = true
            }
            spread.resumePaint()
          }
        }
      }
      var deleteColumnMenuItemCommand = {
        canUndo: false,
        execute: function (spread, options) {
          if (options.commandOptions) {
            spread.suspendPaint()
            var info = options.commandOptions
            var group = com.infos[info.groupIndex]
            var sheet = spread.getActiveSheet()
            var flag = false
            if (sheet.options.isProtected) {
              flag = true
              sheet.options.isProtected = false
            }
            com.removeGroupColumn(sheet, group, info.column)
            if (flag) {
              sheet.options.isProtected = true
            }
            spread.resumePaint()
          }
        }
      }
      commandManager.register('addGroupRow', addRowMenuItemCommand, null, false, false, false, false)
      commandManager.register('addGroupColumn', addColumnMenuItemCommand, null, false, false, false, false)
      commandManager.register('insertGroupRow', insertRowMenuItemCommand, null, false, false, false, false)
      commandManager.register('insertGroupColumn', insertColumnMenuItemCommand, null, false, false, false, false)
      commandManager.register('delGroupRow', deleteRowMenuItemCommand, null, false, false, false, false)
      commandManager.register('delGroupColumn', deleteColumnMenuItemCommand, null, false, false, false, false)
      function DiyContextMenu () {}
      DiyContextMenu.prototype = new gcSS.ContextMenu.ContextMenu(com.spread)
      DiyContextMenu.prototype.commandOptions = {}
      DiyContextMenu.prototype.onOpenMenu = function (menuData, itemsDataForShown, hitInfo, spread) {
        spread.suspendPaint()
        var mindex = 0
        if (hitInfo && hitInfo.worksheetHitInfo) {
          var worksheetHitInfo = hitInfo.worksheetHitInfo
          if (worksheetHitInfo.hitTestType === 3) {
            var group = com.getGroup(com.getSheetIndex(spread.getActiveSheet()), worksheetHitInfo.row + 1, worksheetHitInfo.col + 1)
            if (group && group.reportType === 'Dynamic') {
              this.commandOptions.row = worksheetHitInfo.row + 1
              this.commandOptions.column = worksheetHitInfo.col + 1
              this.commandOptions.groupIndex = group.indexCode
              if (group.reportDirection === 'Vertical') {
                if (this.commandOptions.row === group.extendRow + group.extendRowSpan - 1) {
                  itemsDataForShown[mindex] = this.addRowMenuItem
                  mindex++
                }
                itemsDataForShown[mindex] = this.insertRowMenuItem
                mindex++
                itemsDataForShown[mindex] = this.delRowMenuItem
                mindex++
              } else if (group.reportDirection === 'Horizontal') {
                if (this.commandOptions.column === group.extendColumn + group.extendColumnSpan - 1) {
                  itemsDataForShown[mindex] = this.addColumnMenuItem
                  mindex++
                }
                itemsDataForShown[mindex] = this.insertColumnMenuItem
                mindex++
                itemsDataForShown[mindex] = this.delColumnMenuItem
                mindex++
              }
            }
          }
        }
        if (itemsDataForShown.length >= mindex) {
          itemsDataForShown.splice(mindex)
        }
        spread.resumePaint()
      }
      var cm = new DiyContextMenu()
      cm.addRowMenuItem = {
        text: '新增行',
        name: 'addRow',
        workArea: 'viewport',
        command: 'addGroupRow',
        commandOptions: (cm.commandOptions)
      }
      cm.insertRowMenuItem = {
        text: '插入行',
        name: 'insertRow',
        workArea: 'viewport',
        command: 'insertGroupRow',
        commandOptions: (cm.commandOptions)
      }
      cm.delRowMenuItem = {
        text: '删除行',
        name: 'delRow',
        workArea: 'viewport',
        command: 'delGroupRow',
        commandOptions: (cm.commandOptions)
      }
      cm.addColumnMenuItem = {
        text: '新增列',
        name: 'addColumn',
        workArea: 'viewport',
        command: 'addGroupColumn',
        commandOptions: (cm.commandOptions)
      }
      cm.insertColumnMenuItem = {
        text: '插入列',
        name: 'insertColumn',
        workArea: 'viewport',
        command: 'insertGroupColumn',
        commandOptions: (cm.commandOptions)
      }
      cm.delColumnMenuItem = {
        text: '删除列',
        name: 'delColumn',
        workArea: 'viewport',
        command: 'delGroupColumn',
        commandOptions: (cm.commandOptions)
      }
      cm.menuView.getCommandOptions = function (menuItemData, host, event) {
        return menuItemData.commandOptions
      }
      com.spread.contextMenu = cm
      com.spread.resumePaint()
    },
    methods: {
      getGroup (sheetIndex, row, col) {
        if (this.infos === undefined || this.infos === null) {
          return undefined
        } else {
          for (var i = 0; i < this.infos.length; i++) {
            var info = this.infos[i]
            if (info.sheetIndex === sheetIndex) {
              if (row >= info.extendRow && row < info.extendRow + info.extendRowSpan &&
                col >= info.extendColumn && col < info.extendColumn + info.extendColumnSpan) {
                return info
              }
            }
          }
          return undefined
        }
      },
      getDataValue (sheetIndex, row, col) {
        if (this.infos === undefined || this.infos === null) {
          return undefined
        } else {
          for (var i = 0; i < this.infos.length; i++) {
            var info = this.infos[i]
            if (info.sheetIndex === sheetIndex && info.dataValues !== undefined && info.dataValues !== null) {
              for (var j = 0; j < info.dataValues.length; j++) {
                var value = info.dataValues[j]
                if (value.row === row && value.column === col) {
                  return value
                }
              }
            }
          }
          return undefined
        }
      },
      getSheetIndex: function (sheet) {
        var index = this.spread.sheets.indexOf(sheet)
        return GC.Spread.Sheets.LicenseKey === undefined ? index - 1 : index
      },
      getIndexSheet: function (index) {
        return this.spread.getSheet(GC.Spread.Sheets.LicenseKey === undefined ? index + 1 : index)
      },
      // 加载excel文件
      load (file, infos) {
        console.log(file)
        var com = this
        var sp = com.spread
        var excelIo = new ExcelIO.IO()
        console.log(excelIo)
        excelIo.open(file, function (json) {
          // 加载回填信息
          var loadReturnInfo = function (infos) {
            com.infos = []
            if (infos !== undefined && infos !== null) {
              for (var i = 0; i < infos.length; i++) {
                var info = infos[i]
                var sheet = com.getIndexSheet(info.sheetIndex)
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
                com.infos.push(info)
              }
            }
          }
          var workbookObj = json
          sp.fromJSON(workbookObj)
          // sp.getActiveSheet().options.rowHeaderVisible = false
          loadReturnInfo(infos)
        }, function (e) {
          console.log(e)
        })
      },
      save (fileName) {
        var sp = this.spread
        var excelIo = new ExcelIO.IO()
        excelIo.save(sp.toJSON(), function (blob) {
          FileSaver.saveAs(blob, fileName+ '.xlsx')
        }, function (e) {
          console.log(e)
        })
      },
      // savePdf () {
      //   var com = this
      //   var gcSS = GC.Spread.Sheets
      //   var sp = this.spread
      //   if (com.isLoadTTF) {
      //     sp.savePDF(function (blob) {
      //       FileSaver.saveAs(blob, 'download.pdf')
      //     }, function (e) {
      //       console.log(e)
      //     })
      //   } else if (com.defaultFont) {
      //     var reader = new FileReader()
      //     reader.onload = function (e) {
      //       var fontrrayBuffer = reader.result
      //       var fs = ['宋体', 'Tahoma', 'Calibri']
      //       for (var i = 0; i < fs.length; i++) {
      //         var name = fs[i]
      //         var fonts = gcSS.PDF.PDFFontsManager.getFont(name) || {}
      //         fonts['normal'] = fontrrayBuffer
      //         gcSS.PDF.PDFFontsManager.registerFont(name, fonts)
      //       }
      //       com.isLoadTTF = true
      //       sp.savePDF(function (blob) {
      //         FileSaver.saveAs(blob, 'download.pdf')
      //       }, function (e) {
      //         console.log(e)
      //       })
      //     }
      //     reader.readAsArrayBuffer(com.defaultFont)
      //   }
      // },
      insertGroupRow (sheet, group, row) {
        var gcSS = GC.Spread.Sheets
        if (group.addIndex >= 0) {
          this.validAddRowGroup(sheet, group)
        } else {
          group.addIndex++
        }
        this.moveTo(sheet, row - 1, group.column - 1, row, group.column - 1, group.rowSpan - (row - group.row), group.columnSpan, gcSS.CopyToOptions.all)
        if (group.dataValues) {
          for (var i = 0; i < group.dataValues; i++) {
            var dataValue = group.dataValues[i]
            if (dataValue.row > group.extendRow + group.extendRowSpan - 1) {
              dataValue.row++
            }
          }
        }
        group.rowSpan++
        group.extendRowSpan++
        sheet.copyTo(row, group.column - 1, row - 1, group.column - 1, 1, group.columnSpan, gcSS.CopyToOptions.all & (~gcSS.CopyToOptions.value))
        var val = {}
        val.dataSource = this.getDataSource(group.dataItems)
        val.dataKey = row - group.extendRow
        val.type = 'add'
        this.$emit('datachanged', val)
      },
      appendGroupRow (sheet, group) {
        var gcSS = GC.Spread.Sheets
        if (group.addIndex >= 0) {
          this.validAddRowGroup(sheet, group)
        } else {
          group.addIndex++
        }
        if (group.row + group.rowSpan > group.extendRow + group.extendRowSpan) {
          this.moveTo(sheet,
            group.extendRow + group.extendRowSpan - 1,
            group.column - 1,
            group.extendRow + group.extendRowSpan,
            group.column - 1,
            group.row + group.rowSpan - group.extendRow - group.extendRowSpan,
            group.columnSpan,
            gcSS.CopyToOptions.all)
          if (group.dataValues) {
            for (var i = 0; i < group.dataValues; i++) {
              var dataValue = group.dataValues[i]
              if (dataValue.row > group.extendRow + group.extendRowSpan - 1) {
                dataValue.row++
              }
            }
          }
        }
        group.rowSpan++
        group.extendRowSpan++
        sheet.copyTo(group.extendRow + group.extendRowSpan - 3, group.column - 1, group.extendRow + group.extendRowSpan - 2, group.column - 1, 1, group.columnSpan, gcSS.CopyToOptions.all & (~gcSS.CopyToOptions.value))
        var val = {}
        val.dataSource = this.getDataSource(group.dataItems)
        val.dataKey = group.extendRowSpan - 1
        val.type = 'add'
        this.$emit('datachanged', val)
      },
      getDataSource (items) {
        if (items) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i]
            if (item && item.dataSource) {
              return item.dataSource
            }
          }
        }
        return null
      },
      insertGroupColumn (sheet, group, column) {
        var gcSS = GC.Spread.Sheets
        if (group.addIndex >= 0) {
          this.validAddColumnGroup(sheet, group)
        } else {
          group.addIndex++
        }
        this.moveTo(sheet, group.row - 1, column - 1, group.row - 1, column, group.rowSpan, group.columnSpan - (column - group.column), gcSS.CopyToOptions.all)
        if (group.dataValues) {
          for (var i = 0; i < group.dataValues; i++) {
            var dataValue = group.dataValues[i]
            if (dataValue.column > group.extendColumn + group.extendColumnSpan - 1) {
              dataValue.column++
            }
          }
        }
        group.columnSpan++
        group.extendColumnSpan++
        sheet.copyTo(group.row - 1, column, group.row - 1, column - 1, group.rowSpan, 1, gcSS.CopyToOptions.all & (~gcSS.CopyToOptions.value))
        var val = {}
        val.dataSource = this.getDataSource(group.dataItems)
        val.dataKey = column - group.extendColumn
        val.type = 'add'
        this.$emit('datachanged', val)
      },
      appendGroupColumn (sheet, group) {
        var gcSS = GC.Spread.Sheets
        if (group.addIndex >= 0) {
          this.validAddColumnGroup(sheet, group)
        } else {
          group.addIndex++
        }
        if (group.column + group.columnSpan > group.extendColumn + group.extendColumnSpan) {
          this.moveTo(sheet,
            group.row - 1,
            group.extendColumn + group.extendColumnSpan - 1,
            group.row - 1,
            group.extendColumn + group.extendColumnSpan,
            group.rowSpan,
            group.column + group.columnSpan - group.extendColumn - group.extendColumnSpan,
            gcSS.CopyToOptions.all)
          if (group.dataValues) {
            for (var i = 0; i < group.dataValues; i++) {
              var dataValue = group.dataValues[i]
              if (dataValue.column > group.extendColumn + group.extendColumnSpan - 1) {
                dataValue.column++
              }
            }
          }
        }
        group.columnSpan++
        group.extendColumnSpan++
        sheet.copyTo(group.row - 1, group.extendColumn + group.extendColumnSpan - 3, group.row - 1, group.extendColumn + group.extendColumnSpan - 2, group.rowSpan, 1, gcSS.CopyToOptions.all & (~gcSS.CopyToOptions.value))
        var val = {}
        val.dataSource = this.getDataSource(group.dataItems)
        val.dataKey = group.extendColumnSpan - 1
        val.type = 'add'
        this.$emit('datachanged', val)
      },
      validAddRowGroup (sheet, group) {
        var com = this
        var gcSS = GC.Spread.Sheets
        var changedGroup = []
        var addOnly = function (group) {
          var add = true
          changedGroup.forEach(function (g) {
            if (group.indexCode === g.indexCode) {
              add = false
            }
          })
          if (add) {
            changedGroup.push(group)
          }
        }
        var validDeep = function (group) {
          if (com.infos) {
            com.infos.forEach(function (item) {
              if (item.row >= group.row + group.rowSpan &&
                (!(item.column + item.columnSpan - 1 < group.column || item.column > group.column + group.columnSpan - 1))) {
                addOnly(item)
                validDeep(item)
              }
            })
          }
        }
        var moveGroup = function (group) {
          com.moveTo(sheet, group.row - 1, group.column - 1, group.row, group.column - 1, group.rowSpan, group.columnSpan, gcSS.CopyToOptions.all)
          group.row++
          group.extendRow++
          if (group.dataValues) {
            for (var i = 0; i < group.dataValues; i++) {
              var dataValue = group.dataValues[i]
              dataValue.row++
            }
          }
        }
        validDeep(group)
        if (changedGroup.length > 0) {
          changedGroup.sort(function (x, y) {
            return y.row - x.row
          })
          changedGroup.forEach(function (gr) {
            moveGroup(gr)
          })
        }
      },
      validAddColumnGroup (sheet, group) {
        var com = this
        var gcSS = GC.Spread.Sheets
        var changedGroup = []
        var addOnly = function (group) {
          var add = true
          changedGroup.forEach(function (g) {
            if (group.indexCode === g.indexCode) {
              add = false
            }
          })
          if (add) {
            changedGroup.push(group)
          }
        }
        var validDeep = function (group) {
          if (com.infos) {
            com.infos.forEach(function (item) {
              if (item.column >= group.column + group.columnSpan &&
                (!(item.row + item.rowSpan - 1 < group.row || item.row > group.row + group.rowSpan - 1))) {
                addOnly(item)
                validDeep(item)
              }
            })
          }
        }
        var moveGroup = function (group) {
          com.moveTo(sheet, group.row - 1, group.column - 1, group.row - 1, group.column, group.rowSpan, group.columnSpan, gcSS.CopyToOptions.all)
          group.column++
          group.extendColumn++
          if (group.dataValues) {
            for (var i = 0; i < group.dataValues; i++) {
              var dataValue = group.dataValues[i]
              dataValue.column++
            }
          }
        }
        validDeep(group)
        if (changedGroup.length > 0) {
          changedGroup.sort(function (x, y) {
            return y.column - x.column
          })
          changedGroup.forEach(function (gr) {
            moveGroup(gr)
          })
        }
      },
      moveTo (sheet, fromRow, fromColumn, toRow, toColumn, rowCount, columnCount, opts) {
        var sheetRowCount = sheet.getRowCount()
        var sheetColumnCount = sheet.getColumnCount()
        var toRowCount = toRow + rowCount
        var toColumnCount = toColumn + columnCount
        if (toRowCount > sheetRowCount) {
          sheet.setRowCount(toRowCount)
        }
        if (toColumnCount > sheetColumnCount) {
          sheet.setColumnCount(toColumnCount)
        }
        sheet.moveTo(fromRow, fromColumn, toRow, toColumn, rowCount, columnCount, opts)
      },
      clear (sheet, row, column, rowCount, columnCount) {
        sheet.clear(row, column, rowCount, columnCount, GC.Spread.Sheets.SheetArea.viewport, 127)
        // sheet.clear(row, column, rowCount, columnCount, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.data)
        // sheet.clear(row, column, rowCount, columnCount, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.style)
      },
      removeGroupRow (sheet, group, row) {
        var gcSS = GC.Spread.Sheets
        group.addIndex--
        if (row === group.row + group.rowSpan - 1) {
          this.clear(sheet, row - 1, group.column - 1, 1, group.columnSpan)
        } else {
          this.moveTo(sheet, row, group.column - 1, row - 1, group.column - 1, group.rowSpan - (row - group.row) - 1, group.columnSpan, gcSS.CopyToOptions.all)
          if (group.dataValues) {
            for (var i = 0; i < group.dataValues; i++) {
              var dataValue = group.dataValues[i]
              if (dataValue.row > group.extendRow + group.extendRowSpan - 1) {
                dataValue.row--
              }
            }
          }
        }
        group.rowSpan--
        group.extendRowSpan--
        var val = {}
        val.dataSource = this.getDataSource(group.dataItems)
        val.dataKey = row - group.extendRow
        val.type = 'remove'
        this.$emit('datachanged', val)
      },
      removeGroupColumn (sheet, group, column) {
        var gcSS = GC.Spread.Sheets
        group.addIndex--
        if (column === group.column + group.columnSpan - 1) {
          this.clear(sheet, group.row - 1, column - 1, group.rowSpan, 1)
        } else {
          this.moveTo(sheet, group.row - 1, column, group.row - 1, column - 1, group.rowSpan, group.columnSpan - (column - group.column) - 1, gcSS.CopyToOptions.all)
          if (group.dataValues) {
            for (var i = 0; i < group.dataValues; i++) {
              var dataValue = group.dataValues[i]
              if (dataValue.column > group.extendColumn + group.extendColumnSpan - 1) {
                dataValue.column--
              }
            }
          }
        }
        group.columnSpan--
        group.extendColumnSpan--
        var val = {}
        val.dataSource = this.getDataSource(group.dataItems)
        val.dataKey = column - group.extendColumn
        val.type = 'remove'
        this.$emit('datachanged', val)
      }
    }
  }

</script>
<style>
  .spreadDivClass {
    width: 100%;
    height: 100%;
  }
</style>
