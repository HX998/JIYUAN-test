
<template>
  <div>
  <div class="h-ticket h-t_white">
    <div class="space">
      <div ref="approvalHead" id="approvalHead">
      <h2 class="h-ticket-title">{{formItem.custName}}票据转贴现业务审批表</h2>
      <div class="h-ticket-info clearfix">
        <ul>
          <li>
            <em>申报机构：</em>
            <span>{{formItem.reqBrchName}}</span>
          </li>
          <li>
            <em>申报日期：</em>
            <span>{{formItem.workDate}}</span>
          </li>
          <li>
            <em>编号：</em>
            <span>{{formItem.batchNo}}</span>
          </li>
        </ul>
      </div>
      </div>
      <div class="h-ticket-table">
        <table>
          <colgroup>
            <col width="15%">
            <col width="15%">
            <col width="25%">
            <col width="15%">
            <col width="30%">
          </colgroup>
          <tr>
            <td rowspan="4" class="th">交易对手信息</td>
            <td class="th">名称</td>
            <td colspan="3">{{formItem.cpBrchName}}</td>
          </tr>
          <tr>
            <td class="th">开户行行号</td>
            <td colspan="3">{{formItem.cpBankNo}}</td>
          </tr>
          <tr>
            <td class="th">联系人</td>
            <td>{{formItem.linkMan}}</td>
            <td class="th">联系电话</td>
            <td>{{formItem.phone}}</td>
          </tr>
          <tr>
            <td class="th">是否首次合作</td>
            <td colspan="3">
              <label>是<input id="isFirstIssueYes" class="check" type="checkbox" checked="true" disabled="true"></label>
              <label>否<input id="isFirstIssueNo" class="check" type="checkbox" disabled="true"></label>
            </td>
          </tr>
          <tr>
            <td rowspan="6" class="th">业务信息</td>
            <td class="th">业务方向</td>
            <td colspan="3">
              <label>买断<input id="TDD01" class="check" type="checkbox" checked="true" disabled="true"></label>
              <label>卖断<input id="TDD02" class="check" type="checkbox" disabled="true"></label>
              <label>买入返售<input id="CRD01"  class="check" type="checkbox" disabled="true"></label>
              <label>卖出回购<input id="CRD02" class="check" type="checkbox" disabled="true"></label>
            </td>
          </tr>
          <tr>
            <td class="th">金额</td>
            <td colspan="3">
              <p>大写：<span class="money">{{formItem.totalAmtCap}}</span></p>
              <p>（小写：￥<span class="money">{{formItem.totalAmt}}</span>元）</p>
            </td>
          </tr>
          <tr>
            <td class="th">汇票类型</td>
            <td>
              <label>银票<input id="ME01AC01" class="check" type="checkbox" checked="true" disabled="true"></label>
              <label>商票<input id="ME01AC02" class="check" type="checkbox" disabled="true"></label>
              <label>电银<input id="ME02AC01" class="check" type="checkbox" disabled="true"></label>
              <label>电商<input id="ME02AC02" class="check" type="checkbox" disabled="true"></label>
            </td>
            <td class="th">汇票总张数</td>
            <td>{{formItem.totalNum}}</td>
          </tr>
          <tr>
            <td class="th">期限（天）</td>
            <td>{{formItem.tenorDays}}</td>
            <td class="th">利率（%）</td>
            <td>{{formItem.ratePct}}%</td>
          </tr>
          <tr>
            <td class="th">起息日</td>
            <td>{{formItem.firstSettleDt}}</td>
            <td class="th">到期日</td>
            <td>{{formItem.dueSettleDt}}</td>
          </tr>
          <tr>
            <td class="th">清算方式</td>
            <td colspan="3">
              <label>线上清算<input id="ST01" class="check" type="checkbox" checked="true" disabled="true"></label>
              <label>线下清算<input id="ST02" class="check" type="checkbox" disabled="true"></label>
            </td>
          </tr>
          <tr>
            <td class="th">经办人意见</td>
            <td colspan="2">
              <div class="h-idea-box">
                <p class="idea"></p>
                <p class="date">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</p>
              </div>
            </td>
            <td class="th">业务负责人意见</td>
            <td>
              <div class="h-idea-box">
                <p class="idea"></p>
                <p class="date">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="th">票据中心负责人意见</td>
            <td colspan="4">
              <div class="h-idea-box">
                <p class="idea"></p>
                <p class="date">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="th">风险管理部意见</td>
            <td colspan="4">
              <div class="h-idea-box">
                <p class="idea"></p>
                <p class="date">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="th">资金业务分管行长最终意见</td>
            <td colspan="4">
              <div class="h-idea-box">
                <p class="idea"></p>
                <p class="date">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</p>
              </div>
            </td>
          </tr>
        </table>
      </div >
      <div  ref="approvalFoot" id="approvalFoot">
        <p class="table-record">注：此审批表传真件与原件具有同等效力，业务操作部门可据此进行业务操作。</p>
      </div>

    </div>
  </div>
  </div>
</template>
<script>
  export default {
    name: "approvalPrint000000",
    data(){
      return { }
    },
    props:{
      formItem:{
        type: Object,
        default() {
          return {};
        }
      },
      dictMap:{
        type:Object
      }
    }
  }
</script>

