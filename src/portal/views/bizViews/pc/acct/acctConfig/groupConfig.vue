<template>
  <h-msg-box v-model="tempGroupWin" :mask-closable="false" @on-close="handleClose" width="1000"
             class="h-form-search-layer"
             :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div class="layout">
      <h-row name="flex" class="layout-menu-wrapper">
        <!-- 左侧树 -->
        <h-col span="4" class="layout-menu-left">
          <div>
            <div class="h-sidebar-menutree-body">
              <h-tree :data="recordTreeData" highlight-row ref="recordTreeData"
                      @on-select-change="treeChange()"></h-tree>
            </div>
          </div>
        </h-col>
        <!--内容管理-->
        <h-col span="20" class="layout-menu-right">
          <div v-show="acctType=='acctScene'">
            <!--数据展示表格-->
            <h-datagrid
              :columns="columns"
              highlight-row
              :autoLoad="false"
              url="/pc/acct/acctConfig/queryAcctConfigGroup"
              :gridData="groupData"
              :bindForm="formItem"
              :onRowClick="handlelRowClick"
              ref="recordDatagrid">
              <div slot="toolbar" class='pull-left'>
                <h-button type="primary" @click="handleAddForm('add')">{{$t("m.i.common.add")}}</h-button>
                <h-button type="primary" @click="handleAddForm('modify')">{{$t("m.i.common.modify")}}</h-button>
                <h-button type="primary" @click="deleteGroup()">{{$t("m.i.common.delete")}}</h-button>
                <h-button type="primary" @click="copyGroup()">{{$t("m.i.pc.copy")}}</h-button>
              </div>
            </h-datagrid>
          </div>
          <div v-show="acctType=='acctTrade'">
            <!--数据展示表格-->
            <h-datagrid
              :columns="tradeColumns"
              :autoLoad="false"
              highlight-row
              url="/pc/acct/acctConfig/queryAcctConfigRow"
              :bindForm="formParm"
              :onRowClick="tradeRowClick"
              ref="tradeDatagrid">
              <div slot="toolbar" class='pull-left'>
                <h-button type="primary" @click="tradeAddForm('add')">{{$t("m.i.common.add")}}</h-button>
                <h-button type="primary" @click="tradeAddForm('modify')">{{$t("m.i.common.modify")}}</h-button>
                <h-button type="primary" @click="deleteItem()">{{$t("m.i.common.delete")}}</h-button>
                <h-button type="primary" @click="copyRow()">{{$t("m.i.pc.copy")}}</h-button>
              </div>
            </h-datagrid>
          </div>
        </h-col>
      </h-row>
      <!--点击新增/修改弹出窗 记账场景-->
      <h-msg-box v-model="recordAddWin" width="800"  :zIndex="1002">
        <p slot="header">
          <span v-if="type=='add'">{{$t("m.i.common.add")}}</span>
          <span v-if="type=='modify'">{{$t("m.i.common.modify")}}</span>
        </p>
        <h-panel>
          <h-form :model="recordForm" :label-width="115" ref="recordForm" cols="2" class="h-form-search">

            <h-form-item :label="$t('m.i.pc.groupType')" prop="groupType" :required="isRequired">
              <h-select v-model="recordForm.groupType">
                <h-option v-for="item in groupTypes" :value="item.value" :key="item.value">{{ item.label }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.acctGroupName')" prop="acctGroupName" :required="isRequired">
              <h-input v-if="type=='view'" v-model="recordForm.acctGroupName" class="input-boder-0"
                       :title="addForm.userName"></h-input>
              <h-input v-else v-model="recordForm.acctGroupName" :maxlength=16></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.isBatchAcct')" prop="isBatchAcct" :required="isRequired">
              <h-select v-model="recordForm.isBatchAcct">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.isSyncAcct')" prop="isSyncAcct" :required="isRequired">
              <h-select v-model="recordForm.isSyncAcct">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
                </h-option>
              </h-select>
            </h-form-item>


            <h-form-item :label="$t('m.i.pc.balanceFlag')" prop="balanceFlag" :required="isRequired">
              <h-select v-model="recordForm.balanceFlag">
                <h-option v-for="item in balanceFlags" :value="item.value" :key="item.value">{{ item.label }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.itemExplain')" prop="itemExplain" :required="isRequired">
              <h-select v-model="recordForm.itemExplain" multiple>
                <h-option v-for="item in itemExplains" :value="item.value" :key="item.value">{{ item.label }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.isIgnoreAcctFlag')" prop="isIgnoreAcctFlag">
              <h-select v-model="recordForm.isIgnoreAcctFlag">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.coreTransNo')" prop="coreTransNo">
              <h-input v-if="type=='view'" v-model="recordForm.coreTransNo" class="input-boder-0"
                       :title="addForm.userName"></h-input>
              <h-input v-else v-model="recordForm.coreTransNo" :maxlength=16></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.voucherType')" prop="voucherType"
                         v-if="scenesType.indexOf('voucherType') > -1">
              　
              <h-select v-model="recordForm.voucherType">
                <h-option v-for="item in voucherTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.voucherName')" prop="voucherName"
                         v-if="scenesType.indexOf('voucherType') > -1">
              <h-input v-if="type=='view'" v-model="recordForm.voucherName" class="input-boder-0"
                       :title="addForm.userName"></h-input>
              <h-input v-else v-model="recordForm.voucherName" :maxlength=16></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClassScene"
                         v-if="scenesType.indexOf('billClass') > -1">
              <h-select v-model="recordForm.billClassScene">
                <h-option v-for="item in CDMediaList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billType')" prop="billTypeScene"
                         v-if="scenesType.indexOf('billType') > -1">
              <h-select v-model="recordForm.billTypeScene">
                <h-option v-for="item in DraftTypeList" :value="item.key" :key="item.key">{{ item.key+"."+item.value
                  }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.isInnerScene')" prop="isInnerScene"
                         v-if="scenesType.indexOf('isInner') > -1">
              <h-select v-model="recordForm.isInnerScene">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.orgnlSourceProdScene')" prop="orgnlSourceProdScene"
                         v-if="scenesType.indexOf('orgnlSourceProd') > -1">
              <h-select v-model="recordForm.orgnlSourceProdScene">
                <h-option v-for="item in billSourceProdScenes" :value="item.value" :key="item.value">{{ item.label }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.lastSourceProdScene')" prop="lastSourceProdScene"
                         v-if="scenesType.indexOf('lastSourceProd') > -1">
              <h-select v-model="recordForm.lastSourceProdScene">
                <h-option v-for="item in billSourceProdScenes" :value="item.value" :key="item.value">{{ item.label }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.profitFlagScene')" prop="profitFlagScene"
                         v-if="scenesType.indexOf('profitFlag') > -1">
              <h-select v-model="recordForm.profitFlagScene">
                <h-option v-for="item in profitFlagScenes" :value="item.value" :key="item.value">{{ item.label }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.busiType')" prop="busiTypeScene"
                         v-if="scenesType.indexOf('busiType') > -1">
              <h-input v-model="recordForm.busiTypeScene"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.extBusiTypeScene')" prop="extBusiTypeScene"
                         v-if="scenesType.indexOf('extBusiType') > -1">
              <h-input v-model="recordForm.extBusiTypeScene"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.transplantFlagScene')" prop="transplantFlagScene"
                         v-if="scenesType.indexOf('transplantFlag') > -1">
              <h-select v-model="recordForm.transplantFlagScene">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.key+"."+item.value }}
                </h-option>
              </h-select>
            </h-form-item>

          </h-form>
        </h-panel>
        <div slot="footer">
          <h-button type="ghost" style="margin:0 8px" @click="recordAddWin=!recordAddWin">{{$t("m.i.common.close")}}
          </h-button>
          <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>

        </div>
      </h-msg-box>

      <!--点击新增/修改弹出窗 记账交易-->
      <h-msg-box v-model="tradeAddWin" width="800" class="h-form-search" :zIndex="1002">
        <p slot="header">
          <span v-if="type=='add'">{{$t("m.i.common.add")}}</span>
          <span v-if="type=='modify'">{{$t("m.i.common.modify")}}</span>
        </p>
        <h-panel>
          <h-form :model="tradeForm" :label-width="115" ref="tradeForm" cols="2" class="h-form-search">
            <h-form-item :label="$t('m.i.pc.drCr')" prop="drCr" v-if="itemType.indexOf('drCr') > -1"
                         :required="isRequired">
              <h-select v-model="tradeForm.drCr">
                <h-option v-for="item in drcrs" :value="item.value" :key="item.value">{{ item.label }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.acctNo')" prop="acctNo" v-if="itemType.indexOf('acctNo') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.acctNo" class="input-boder-0"
                       :title="addForm.acctNo"></h-input>
              <h-input v-else v-model="tradeForm.acctNo" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.rowAt')" prop="rowAt" v-if="itemType.indexOf('rowAt') > -1"
                         :required="isRequired">
              <h-select v-model="tradeForm.rowAt">
                <h-option v-for="item in rowAts" :value="item.value" :key="item.value">{{ item.label }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.rowAtExpression')" prop="rowAtExpression"
                         v-if="itemType.indexOf('rowAtExpression') > -1" :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.rowAtExpression" class="input-boder-0"
                       :title="addForm.rowAtExpression"></h-input>
              <h-input v-else v-model="tradeForm.rowAtExpression" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.crSubjectNo')" prop="crSubjectNo"
                         v-if="itemType.indexOf('crSubjectNo') > -1" :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.crSubjectNo" class="input-boder-0"
                       :title="addForm.crSubjectNo"></h-input>
              <h-input v-else v-model="tradeForm.crSubjectNo" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.drSubjectNo')" prop="drSubjectNo"
                         v-if="itemType.indexOf('drSubjectNo') > -1" :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.drSubjectNo" class="input-boder-0"
                       :title="addForm.drSubjectNo"></h-input>
              <h-input v-else v-model="tradeForm.drSubjectNo" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.transActionNo')" prop="transActionNo"
                         v-if="itemType.indexOf('transActionNo') > -1" :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.transActionNo" class="input-boder-0"
                       :title="addForm.transActionNo"></h-input>
              <h-input v-else v-model="tradeForm.transActionNo" :maxlength=40></h-input>
            </h-form-item>

            <h-form-item :label="$t('m.i.pc.debtBrch')" prop="debtBrch" v-if="itemType.indexOf('debtBrch') > -1">
              <h-input v-model="tradeForm.debtBrch" readonly value="$:billInfo.debtBrch"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.sellAcctNo')" prop="sellAcctNo" v-if="itemType.indexOf('sellAcctNo') > -1">
              <h-input v-model="tradeForm.sellAcctNo" readonly value="$:billInfo.sellAcctNo"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.buyAcctNo')" prop="buyAcctNo" v-if="itemType.indexOf('buyAcctNo') > -1">
              <h-input v-model="tradeForm.buyAcctNo" readonly value="$:billInfo.buyAcctNo"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.dealPcet')" prop="dealPcet" v-if="itemType.indexOf('dealPcet') > -1">

              <h-input v-model="tradeForm.dealPcet" readonly value="$:billInfo.dealPcet"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.transDesc')" prop="transDesc" v-if="itemType.indexOf('transDesc') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.transDesc" class="input-boder-0"
                       :title="addForm.transDesc"></h-input>
              <h-input v-else v-model="tradeForm.transDesc" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.feeItem')" prop="feeItem" v-if="itemType.indexOf('feeItem') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.feeItem" class="input-boder-0"
                       :title="addForm.feeItem"></h-input>
              <h-input v-else v-model="tradeForm.feeItem" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.amtType')" prop="amtType" v-if="itemType.indexOf('amtType') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.amtType" class="input-boder-0"
                       :title="addForm.amtType"></h-input>
              <h-input v-else v-model="tradeForm.amtType" :maxlength=40></h-input>
            </h-form-item>

            <h-form-item :label="$t('m.i.pc.item1')" prop="item1" v-if="itemType.indexOf('item1') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item1" class="input-boder-0"
                       :title="addForm.item1"></h-input>
              <h-input v-else v-model="tradeForm.item1" :maxlength=40></h-input>
            </h-form-item>

            <h-form-item :label="$t('m.i.pc.item2')" prop="item2" v-if="itemType.indexOf('item2') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item2" class="input-boder-0"
                       :title="addForm.item2"></h-input>
              <h-input v-else v-model="tradeForm.item2" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.item3')" prop="item3" v-if="itemType.indexOf('item3') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item3" class="input-boder-0"
                       :title="addForm.item3"></h-input>
              <h-input v-else v-model="tradeForm.item3" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.item4')" prop="item4" v-if="itemType.indexOf('item4') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item4" class="input-boder-0"
                       :title="addForm.item4"></h-input>
              <h-input v-else v-model="tradeForm.item4" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.item5')" prop="item5" v-if="itemType.indexOf('item5') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item5" class="input-boder-0"
                       :title="addForm.item5"></h-input>
              <h-input v-else v-model="tradeForm.item5" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.item6')" prop="item6" v-if="itemType.indexOf('item6') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item6" class="input-boder-0"
                       :title="addForm.item6"></h-input>
              <h-input v-else v-model="tradeForm.item6" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.item7')" prop="item7" v-if="itemType.indexOf('item7') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item7" class="input-boder-0"
                       :title="addForm.item7"></h-input>
              <h-input v-else v-model="tradeForm.item7" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.item8')" prop="item8" v-if="itemType.indexOf('item8') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item8" class="input-boder-0"
                       :title="addForm.item8"></h-input>
              <h-input v-else v-model="tradeForm.item8" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.item9')" prop="item9" v-if="itemType.indexOf('item9') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item9" class="input-boder-0"
                       :title="addForm.item9"></h-input>
              <h-input v-else v-model="tradeForm.item9" :maxlength=40></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pc.item10')" prop="item10" v-if="itemType.indexOf('item10') > -1"
                         :required="isRequired">
              <h-input v-if="type=='view'" v-model="tradeForm.item10" class="input-boder-0"
                       :title="addForm.item10"></h-input>
              <h-input v-else v-model="tradeForm.item10" :maxlength=40></h-input>
            </h-form-item>
          </h-form>
        </h-panel>
        <div slot="footer">
          <h-button type="ghost" style="margin:0 8px" @click="tradeAddWin=!tradeAddWin">{{$t("m.i.common.close")}}
          </h-button>
          <h-button type="primary" @click="tradeSub()">{{$t("m.i.common.commit")}}</h-button>

        </div>
      </h-msg-box>

    </div>
    <!-- 弹出框模式底部按钮  -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>

</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "groupConfig",
    data() {
      return {
        recordData: {},
        acctType: "acctScene",
        formItem: { tranId: this.acctRecordId },
        tableRef: "selfTable",
        recordAddWin: false,
        type: "add",
        tradeForm: {
          "debtBrch": "$:billInfo.debtBrch",
          "sellAcctNo": "$:billInfo.sellAcctNo",
          "buyAcctNo": "$:billInfo.buyAcctNo",
          "dealPcet": "$:billInfo.dealPcet",
          prodNo: "",
          groupId: "",
          rowId: "",
          rowType: "",
          rowAt: "",
          rowAtExpression: "",
          subjectType: "",
          drCr: "",
          acctNo: "",
          crSubjectNo: "",
          drSubjectNo: "",
          transActionNo: "",
          /*sellAcctNo : "",
          buyAcctNo : "",
          debtBrch : "",*/
          feeItem: "",
          transDesc: "",
          amtType: "",
          item1: "",
          item2: "",
          item3: "",
          item4: "",
          item5: "",
          item6: "",
          item7: "",
          item8: "",
          item9: "",
          item10: ""
        },
        isRequired: true,
        tradeAddWin: false,
        acctItemAddWin: false,
        groupId: "",
        groupSelectRow: [],
        rowsSelectRow: [],
        scenesType: [],
        itemType: [],
        itemExplains: [
          {
            value: "drCr",
            label: "借贷方向"
          },
          {
            value: "acctNo",
            label: "科目-账号"
          },
          {
            value: "rowAt",
            label: "金额"
          },
          {
            value: "rowAtExpression",
            label: "金额（表达式）"
          },
          {
            value: "transActionNo",
            label: "交易行为编码"
          },
          {
            value: "drSubjectNo",
            label: "借方科目"
          },
          {
            value: "crSubjectNo",
            label: "贷方科目"
          },
          {
            value: "debtBrch",
            label: "负债（销记）机构"
          },
          {
            value: "sellAcctNo",
            label: "卖方账号"
          },
          {
            value: "buyAcctNo",
            label: "买方账号"
          },
          {
            value: "dealPcet",
            label: "比例"
          },
          {
            value: "transDesc",
            label: "交易摘要"
          },
          {
            value: "amtType",
            label: "币种"
          },
          {
            value: "feeItem",
            label: "收费项目编码"
          },
          {
            value: "item1",
            label: "分录项1"
          },
          {
            value: "item2",
            label: "分录项2"
          },
          {
            value: "item3",
            label: "分录项3"
          },
          {
            value: "item4",
            label: "分录项4"
          },
          {
            value: "item5",
            label: "分录项5"
          },
          {
            value: "item6",
            label: "分录项6"
          },
          {
            value: "item7",
            label: "分录项7"
          },
          {
            value: "item8",
            label: "分录项8"
          },
          {
            value: "item9",
            label: "分录项9"
          },
          {
            value: "item10",
            label: "分录项10"
          }
        ],
        groupTypes: [
          {
            value: "group_record",
            label: "实时调用场景"
          },
          {
            value: "group_record_inner",
            label: "日终调用场景"
          },
          {
            value: "group_record_jiti_start",
            label: "记提场景开启"
          },
          {
            value: "group_record_jiti_end",
            label: "记提场景结束"
          }
        ],
        yon: [
          {
            value: "0",
            label: "是"
          },
          {
            value: "1",
            label: "否"
          }
        ],
        drcrs: [
          {
            value: "D",
            label: "借"
          },
          {
            value: "C",
            label: "贷"
          },
          {
            value: "S",
            label: "收"
          },
          {
            value: "P",
            label: "付"
          }
        ],
        rowAts: [
          {
            value: "$:billInfo.billMoney",
            label: "票面金额"
          },
          {
            value: "$:billInfo.settleAmt",
            label: "结算金额"
          },
          {
            value: "$:billInfo.interest",
            label: "总利息"
          },
          {
            value: "$:billInfo.buyInterest",
            label: "卖方利息"
          },
          {
            value: "$:billInfo.saleInterest",
            label: "卖方利息"
          },
          {
            value: "$:billInfo.dueSettleAmt",
            label: "到期结算金额"
          },
          {
            value: "$:billInfo.remaInterest",
            label: "剩余未计提利息"
          },
          {
            value: "$:billInfo.profitInterest",
            label: "利息损益"
          }
        ],
        balanceFlags: [
          {
            value: "0",
            label: "无余额"
          },
          {
            value: "1",
            label: "余额开启"
          },
          {
            value: "2",
            label: "余额结束"
          }
        ],
        profitFlagScenes: [
          {
            value: "0",
            label: "无损益"
          },
          {
            value: "1",
            label: "收入"
          },
          {
            value: "2",
            label: "支出"
          }
        ],
        billSourceProdScenes: [
          {
            value: "1",
            label: "贴现来源"
          },
          {
            value: "2",
            label: "转贴现来源"
          },
          {
            value: "3",
            label: "系统内转贴现来源"
          },
          {
            value: "4",
            label: "买断式回购买入来源"
          },
          {
            value: "5",
            label: "质押式回购买入来源"
          },
          {
            value: "6",
            label: "同业质押来源"
          },
          {
            value: "7",
            label: "对公质押来源"
          },
          {
            value: "8",
            label: "代保管来源"
          },
          {
            value: "9",
            label: "票据池"
          }
        ],
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center"
          },
          {
            title: this.$t("m.i.common.acctGroupName"),
            key: "acctGroupName",
            hiddenCol: false,
            sortable: true
          }, {
            title: this.$t("m.i.pc.balanceFlag"),
            key: "balanceFlag",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", formatterbalanceFlag(params.row.balanceFlag, params.row, params.row.index))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.coreTransNo"),
            key: "coreTransNo",
            hiddenCol: false,
            sortable: true
          }, {
            title: this.$t("m.i.pc.isBatchAcct"),
            key: "isBatchAcct",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.yonMap, "Yon", params.row.isBatchAcct);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.pc.isSyncAcct"),
            key: "isSyncAcct",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.yonMap, "Yon", params.row.isSyncAcct);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.pc.isIgnoreAcctFlag"),
            key: "isIgnoreAcctFlag",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.yonMap, "Yon", params.row.isIgnoreAcctFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t("m.i.pc.groupType"),
            key: "groupType",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", formattergroupType(params.row.groupType, params.row, params.row.index))
              ]);
            }
          }],
        tradeColumns: [
          {
            title: this.$t("m.i.common.index"),
            key: "rowNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.drCr"),
            key: "drCr",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", formatterdrcrs(params.row.drCr, params.row, params.row.index))
              ]);
            }
          },
          {
            title: this.$t("m.i.common.acctNo"),
            key: "acctNo",
            hiddenCol: false,
            sortable: true
          }, {
            title: this.$t("m.i.pc.rowAt"),
            key: "rowAt",
            hiddenCol: false,
            sortable: true
          }],
        itemColumns: [{
          title: this.$t("m.i.common.index"),
          type: "index",
          align: "center"
        }],
        recordTreeData: [
          {
            id: "acctScene",
            title: "创建业务类别细项",
            selected: true,
            expand: true,
            children: [{
              id: "acctTrade",
              expand: false,
              parentId: "acctScene",
              children: null,
              title: "创建借贷科目细项"
            }]
          }
        ],
        reqUrl: "/pc/acct/acctConfig",
        formParm: {},
        isList: [],
        voucherTypeList: [],
        CDMediaList: [],
        DraftTypeList: [],
        recordForm: {
          acctGroupName: "",
          coreTransNo: "",
          voucherType: "",
          voucherName: "",
          isBatchAcct: "",
          isSyncAcct: "",
          isIgnoreAcctFlag: "",
          groupType: "",
          balanceFlag: "",
          isBillClass: "",
          itemExplain: [],
          billClassScene: "",
          billTypeScene: "",
          isInnerScene: "",
          orgnlSourceProdScene: "",
          lastSourceProdScene: "",
          profitFlagScene: "",
          busiTypeScene: "",
          extBusiTypeScene: "",
          transplantFlagScene: ""
        },
        groupData: {
          rows: [],
          total: 1
        }
      };

      function formatterbalanceFlag(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "0":
              return "无余额";
            case "1":
              return "余额开启";
            case "2":
              return "余额结束";
          }
        } else {
          return "";
        }
      }

      function formattergroupType(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "group_record":
              return "实时调用场景";
            case "group_record_inner":
              return "日终调用场景";
            case "group_record_jiti_start":
              return "记提场景开启";
            case "group_record_jiti_end":
              return "记提场景结束";
          }
        } else {
          return "";
        }
      }

      function formatterdrcrs(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "D":
              return "借";
            case "C":
              return "贷";
            case "S":
              return "收";
            case "P":
              return "付";

          }
        } else {
          return "";
        }
      }
    },
    props: {
      title: String,
      showGroupWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      prodNo: "",
      acctRecordId: "",
      tranRow: {
        type: Array,
        default() {
          return [];
        }
      },
      ifcheck: {
        default() {
          return false;
        }
      }
    },
    watch: {
      showGroupWin(val) {
        if (val == true) {
          if (this.acctTempRecordId) { //第一次不刷新
            this.$nextTick(() => {
              this.formItem.tranId = this.acctRecordId;
              this.$refs.recordDatagrid.dataChange(1);
              if (this.tranRow[0].sceneExplain != null) {
                this.scenesType = this.tranRow[0].sceneExplain;
              }
            });
          }
        }
      }
    },

    computed: {
      tempGroupWin: {
        get() {
          return this.showGroupWin;
        },
        set() {
        }
      },
      acctTempRecordId: {
        get() {
          return this.acctRecordId;
        },
        set() {
        }
      }
    },
    methods: {
      treeChange() {
        let arr = this.$refs["recordTreeData"].getSelectedNodes();
        if (arr.length !== 0) {
          let id = arr[0].id;
          if (id == "acctScene") {
            this.$refs.recordDatagrid.dataChange(1);
            this.acctType = id;
            // table 切换后清空选中的记录
            this.groupSelectRow = [];
          } else {
            if (this.groupSelectRow.length > 0) {

              // 帮到添加表单
              this.tradeForm.groupId = this.groupSelectRow[0].id;
              //绑定 查询表单
              this.formParm.groupId = this.groupSelectRow[0].id;
              this.groupId = this.formParm.groupId;
              this.$refs.tradeDatagrid.dataChange(1);
              this.acctType = id;
              this.itemType = this.groupSelectRow[0].itemExplain;
            } else {
              arr[0].selected = false;
              this.$hMessage.info("请选择一条记账场景组记录后操作记账行配置！");
            }
          }
        }
      },
      handleClose() {
        this.$emit("showGroupWinClose", "");
        //回到初始状态
        this.acctType = "acctScene";
        this.groupSelectRow = [];
        let arr = this.$refs["recordTreeData"].getSelectedNodes();
        if (arr.length > 0) {
          arr[0].selected = false;
        }
        this.acctTempRecordId = null;
        this.recordForm.tranId = null;
        this.scenesType = [];
        this.itemType = [];
        this.$refs.tradeForm.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["recordForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? this.reqUrl + "/saveAcctConfigGroup" : this.reqUrl + "/updateAcctConfigGroup";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            this.submitFlag = true;
            post(this.recordForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$hMessage.success(msg);
                  this.recordAddWin = false;
                  this.$refs.recordDatagrid.dataChange(1);
                  this.groupSelectRow = [];

                } else {
                  this.$hMessage.error(this.$t("m.i.common.addFailed") + res.data.retMsg);
                  this.$refs.recordDatagrid.dataChange(1);

                }
              } else {
                this.$hMessage.error(this.$t("m.i.common.netError"));
              }
              this.$refs.recordForm.resetFields();
            });
          }
        });
      },

      copyGroup() {
        if (this.groupSelectRow.length == 0) {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmCopy") + "?",
          onOk: () => {
            this.handlecopy();
          }
        });
      },
      handlecopy() {
        let id = this.groupSelectRow[0].id;

        post({ id: id }, "/pc/acct/acctConfig/copyAcctConfigGroup").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$hMessage.success(msg);
              this.$refs.recordDatagrid.dataChange(1);
              this.groupSelectRow = [];
            } else {
              this.$hMessage.error({
                content: msg,
                duration: 5,
                closable: true
              });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$hMessage.error(this.$t("m.i.common.netError"));
          }
        });
      },
      //删除
      deleteGroup() {
        if (this.groupSelectRow.length == 0) {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let id = this.groupSelectRow[0].id;

        post({ id: id }, "/pc/acct/acctConfig/deleteAcctConfigGroup").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$hMessage.success(msg);
              this.$refs.recordDatagrid.dataChange(1);
              this.groupSelectRow = [];
            } else {
              this.$hMessage.error({
                content: msg,
                duration: 5,
                closable: true
              });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$hMessage.error(this.$t("m.i.common.netError"));
          }
        });
      },

      // 记账  组选择
      handlelRowClick(arr) {
        if (arr && this.groupSelectRow) {
          if (this.groupSelectRow.length > 0 && arr[0].id === this.groupSelectRow[0].id) {
            this.groupSelectRow = [];
            return;
          }
        }
        this.groupSelectRow = arr;
      },
      // 记账  行选择
      tradeRowClick(arr) {
        if (arr && this.rowsSelectRow) {
          if (this.rowsSelectRow.length > 0 && arr[0].id === this.rowsSelectRow[0].id) {
            this.rowsSelectRow = [];
            return;
          }
        }
        this.rowsSelectRow = arr;
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          if (this.groupSelectRow.length === 0) {
            this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
            return;
          }
          this.$nextTick(() => {
            let newRow = this.groupSelectRow[0];
            this.recordForm.prodNo = this.prodNo;
            this.recordForm.itemType = this.itemType;
            this.recordForm.tranId = this.acctRecordId;
            this.recordForm.id = newRow.id;
            this.recordForm.acctGroupName = newRow.acctGroupName;
            this.recordForm.acctGroupNo = newRow.acctGroupNo;
            this.recordForm.balanceFlag = newRow.balanceFlag;
            this.recordForm.acctScene = newRow.acctScene;
            this.recordForm.coreTransNo = newRow.coreTransNo;
            this.recordForm.voucherType = newRow.voucherType;
            this.recordForm.voucherName = newRow.voucherName;
            this.recordForm.isBatchAcct = newRow.isBatchAcct;
            this.recordForm.isSyncAcct = newRow.isSyncAcct;
            this.recordForm.itemExplain = newRow.itemExplain;
            this.recordForm.isIgnoreAcctFlag = newRow.isIgnoreAcctFlag;
            this.recordForm.groupType = newRow.groupType;
            this.recordForm.billClassScene = newRow.acctScene.indexOf("ME01") > -1 ? "ME01" : newRow.acctScene.indexOf("ME02") > -1 ? "ME02" : "";
            this.recordForm.billTypeScene = newRow.acctScene.indexOf("AC01") > -1 ? "AC01" : newRow.acctScene.indexOf("AC02") > -1 ? "AC02" : "";
            this.recordForm.isInnerScene = newRow.isInnerScene;
            this.recordForm.orgnlSourceProdScene = newRow.orgnlSourceProdScene;
            this.recordForm.lastSourceProdScene = newRow.lastSourceProdScene;
            this.recordForm.profitFlagScene = newRow.profitFlagScene;
            this.recordForm.busiTypeScene = newRow.busiTypeScene;
            this.recordForm.extBusiTypeScene = newRow.extBusiTypeScene;
            this.recordForm.transplantFlagScene = newRow.transplantFlagScene;
          });
        } else {
          this.$nextTick(() => {
            this.$refs.recordForm.resetFields();
            this.recordForm.prodNo = this.prodNo;
            this.recordForm.itemType = this.itemType;
            this.recordForm.tranId = this.acctRecordId;
          });
        }
        this.recordAddWin = true;
      },
      //记账行 新增
      tradeAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          if (this.rowsSelectRow.length === 0) {
            this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
            return;
          }
          this.$nextTick(() => {
            let newRow = this.rowsSelectRow[0];
            this.tradeForm.prodNo = this.prodNo;
            this.recordForm.groupId = this.groupId;
            this.tradeForm.rowId = newRow.id;
            this.tradeForm.rowType = newRow.rowType;
            this.tradeForm.rowAt = newRow.rowAt;
            this.tradeForm.rowAtExpression = newRow.rowAtExpression;
            this.tradeForm.subjectType = newRow.subjectType;
            this.tradeForm.drCr = newRow.drCr;
            this.tradeForm.acctNo = newRow.acctNo;
            this.tradeForm.crSubjectNo = newRow.crSubjectNo;
            this.tradeForm.drSubjectNo = newRow.drSubjectNo;
            this.tradeForm.transActionNo = newRow.transActionNo;
            this.tradeForm.sellAcctNo = newRow.sellAcctNo;
            this.tradeForm.buyAcctNo = newRow.buyAcctNo;
            this.tradeForm.debtBrch = newRow.debtBrch;
            this.tradeForm.feeItem = newRow.feeItem;
            this.tradeForm.transDesc = newRow.transDesc;
            this.tradeForm.amtType = newRow.amtType;
            this.tradeForm.item1 = newRow.item1;
            this.tradeForm.item2 = newRow.item2;
            this.tradeForm.item3 = newRow.item3;
            this.tradeForm.item4 = newRow.item4;
            this.tradeForm.item5 = newRow.item5;
            this.tradeForm.item6 = newRow.item6;
            this.tradeForm.item7 = newRow.item7;
            this.tradeForm.item8 = newRow.item8;
            this.tradeForm.item9 = newRow.item9;
            this.tradeForm.item10 = newRow.item10;
          });
        } else {
          this.$nextTick(() => {
            this.$refs.tradeForm.resetFields();
            this.tradeForm.prodNo = this.prodNo;
            this.recordForm.groupId = this.groupId;
          });
          // this.tradeForm.groupId = this.rowsSelectRow[0].id;
        }
        this.tradeAddWin = true;
      },

      //删除
      deleteItem() {
        if (this.rowsSelectRow.length == 0) {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.rowDel();
          }
        });
      },
      rowDel() {
        let id = this.rowsSelectRow[0].id;

        post({ id: id }, "/pc/acct/acctConfig/deleteAcctConfigRow").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$hMessage.success(msg);
              this.$refs.tradeDatagrid.dataChange(1);
              this.rowsSelectRow = [];
            } else {
              this.$hMessage.error({
                content: msg,
                duration: 5,
                closable: true
              });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$hMessage.error(this.$t("m.i.common.netError"));
          }
        });
      },
      //复制
      copyRow() {
        if (this.rowsSelectRow.length == 0) {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmCopy") + "?",
          onOk: () => {
            this.rowCopy();
          }
        });
      },
      rowCopy() {
        let id = this.rowsSelectRow[0].id;
        post({ id: id }, "/pc/acct/acctConfig/copyAcctConfigRow").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$hMessage.success(msg);
              this.$refs.tradeDatagrid.dataChange(1);
              this.rowsSelectRow = [];
            } else {
              this.$hMessage.error({
                content: msg,
                duration: 5,
                closable: true
              });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$hMessage.error(this.$t("m.i.common.netError"));
          }
        });
      },
      getRow(obj) {
        post(obj, this.reqUrl + "/queryAcctConfigRow").then(res => {
          if (res.data.retCode === "000000") {
            this.groupData = { list: res.data.retData, pageInfo: { total: 1, pageNo: 1 } };
          } else {
            this.$hMessage.error("操作失败:" + res.data.retMsg);
          }
        });
      },

      // 交易行提交
      tradeSub() {
        let btnType = this.type;
        this.$refs["tradeForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? this.reqUrl + "/saveAcctConfigRow" : this.reqUrl + "/updateAcctConfigRow";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");

            this.submitFlag = true;
            post(this.tradeForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  this.$hMessage.success(msg);
                  this.tradeAddWin = false;
                  this.$refs.tradeDatagrid.dataChange(1);
                  this.rowsSelectRow = [];
                } else {
                  this.$hMessage.error(this.$t("m.i.common.addFailed") + res.data.retMsg);
                  this.$refs.tradeDatagrid.dataChange(1);
                }
              } else {
                this.$hMessage.error(this.$t("m.i.common.netError"));
              }
            });
          }
        });
      }

    },

    mounted() {
      this.getDictListByGroups("Yon,CDMedia,DraftTypeCode,VoucherType").then(res => {
        this.CDMediaList = res.get("CDMedia");
        this.DraftTypeList = res.get("DraftTypeCode");
        this.voucherTypeList = res.get("VoucherType");
        this.isList = res.get("Yon");
        this.yonMap = res.get("map");
      });
    }
  };
</script>
