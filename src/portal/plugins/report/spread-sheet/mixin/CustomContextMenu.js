import GC from '@grapecity/spread-sheets'
import juicer from "juicer"
export default {
  props: {
    customContextMenus: {
      type: Array,
      default: () => ["operatorRecords"]
    }
  },
  mounted() {
    
    if (this.allowContextMenu) {
      this.initContextMenus();
    }
    
  },
  methods: {
    isMenuItemExist(menuData, menuItemName) {
      return menuData.some(item => menuItemName === item.name)
    },
    initContextMenus() {
      const contextMenus = {
        operatorRecords: this.initOperatorRecords
      }
      let menuData = this.getSpread().contextMenu.menuData;

      this.customContextMenus.forEach(contextMenu => {
        if (!this.isMenuItemExist(menuData, contextMenu)) {
          contextMenus[contextMenu]();
        }
      })
    },
    initOperatorRecords() {
      const spread = this.getSpread();
      const queryOperatorRecords = {
          text: "操作记录",
          name: "operator",
          workArea: "viewport",
          subMenu: [
              {
                name: "operatorRecords"
              }
          ]
      }; 
      spread.contextMenu.menuData.push(queryOperatorRecords);
      this.createRecordsMenuView();
    },
    createRecordsMenuView() {
      const _this = this;
      const spread = this.getSpread();
      function CustomMenuView(){};
      CustomMenuView.prototype = new GC.Spread.Sheets.ContextMenu.MenuView();
      CustomMenuView.prototype.createMenuItemElement = function (menuItemData) {
        const self = this;
        if (menuItemData.name === "operatorRecords") {
            const containers = GC.Spread.Sheets.ContextMenu.MenuView.prototype.createMenuItemElement.call(self, menuItemData);
            const supMenuItemContainer = containers[0];
            while (supMenuItemContainer.firstChild) {
              supMenuItemContainer.removeChild(supMenuItemContainer.firstChild);
            }
            const recordsTable = _this.createRecordsTable();
            console.log(recordsTable)
            supMenuItemContainer.appendChild(recordsTable);

            return supMenuItemContainer;
        } else {
            const menuItemView = GC.Spread.Sheets.ContextMenu.MenuView.prototype.createMenuItemElement.call(self, menuItemData);
            return menuItemView;
        }
      };
      spread.contextMenu.menuView = new CustomMenuView();
    },
    createRecordsTable() {
      const tpl = [
        "<ul>",
          "{@each list as it,index}",
            "<li>${it.name} (index: ${index})</li>",
          "{@/each}",
        "</ul>"
      ].join('');
      let data = {
        list: [
          {name:' guokai', show: true},
          {name:' benben', show: false},
          {name:' dierbaby', show: true}
        ]
      };
      const ulContainer = document.createElement("div");
      ulContainer.innerHTML = juicer(tpl, data);
      return ulContainer;
    }
  }
}