<template>
	<div>
		<h-button type="ghost" @click="layer1 = true">发票蓝色</h-button>
    <h-button type="ghost" @click="layer2 = true">发票绿色</h-button>
    <h-button type="ghost" @click="layer3 = true">发票粉色</h-button>
		<h-button type="ghost" @click="layer4 = true">发票橙色</h-button>
		<h-msg-box v-model="layer1" width="1000" height="400" class="h-ticket-layer" :maximize="true">
      <p slot="header">
        <span>纸票显示窗口</span>
      </p>
      <div>
				<h-tabs value="name1" @on-click="tabClick">
					<h-tab-pane label="票样正面" name="name1" class="h-ticket h-t_blue">
						<div>
							<h2 class="h-ticket-title">纸质银行承兑汇票</h2>
							<div class="h-ticket-table">
								<table>
                  <colgroup>
                    <col width="7%">
                    <col width="10%">
                    <col width="33%">
                    <col width="7%">
                    <col width="10%">
                    <col width="33%">
                  </colgroup>
									<tr>
										<td colspan="2" class="th">出票日期</td>
										<td>2019／10／28</td>
										<td colspan="2" class="th">票号</td>
										<td>1234 2345 3456 4567</td>
									</tr>
									<tr>
										<td rowspan="3" class="th tac">出票人</td>
										<td class="th">全称</td>
										<td>小鸭家居</td>
										<td rowspan="3" class="th tac">收款人</td>
										<td class="th">全称</td>
										<td>小鸭家居</td>
									</tr>
									<tr>
										<td class="th">账号</td>
										<td>1234 5678 9012</td>
										<td class="th">账号</td>
										<td>1234 5678 9012</td>
									</tr>
									<tr>
										<td class="th">付款行全称</td>
										<td>杭州银行</td>
										<td class="th">开户银行</td>
										<td>中国银行</td>
									</tr>
									<tr>
										<td colspan="2" class="th">票据金额（人民币）</td>
										<td colspan="3">叁万元整</td>
										<td class="h-money-cell">
											<div class="h-money-unit">
												<em>十</em>
												<em>亿</em>
												<em>千</em>
												<em>百</em>
												<em>十</em>
												<em>万</em>
												<em>千</em>
												<em>百</em>
												<em>十</em>
												<em>元</em>
												<em>角</em>
												<em class="h-last">分</em>
											</div>
											<div class="h-money-num">
												<span></span>
												<span></span>
												<span></span>
												<span></span>
												<span>￥</span>
												<span>3</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span class="h-last">0</span>
											</div>
										</td>
									</tr>
									<tr>
										<td colspan="2" class="th">汇票到期日</td>
										<td>2019／10／28</td>
										<td rowspan="2" class="th tac">付款行</td>
										<td class="th">行号</td>
										<td>1234 5678 9012</td>
									</tr>
									<tr>
										<td colspan="2" class="th">承兑协议编号</td>
										<td></td>
										<td class="th">地址</td>
										<td>江南大道3588号</td>
									</tr>
									<tr>
										<td colspan="2" class="th">承兑行全称</td>
										<td>杭州银行</td>
										<td colspan="2" class="th"></td>
										<td></td>
									</tr>
								</table>
							</div>
						</div>
					</h-tab-pane>
					<h-tab-pane label="票样背面" name="name2" class="h-ticket h-t_blue">
            <div>
              <h2 class="h-ticket-title">纸质银行承兑汇票</h2>
              <div class="h-ticket-table">
                <table>
                  <colgroup>
                    <col width="16%">
                    <col width="84%">
                  </colgroup>
                  <tr>
                    <td colspan="2" class="th tac h-fs14">贴现背书</td>
                  </tr>
                  <tr>
                    <td class="th">背书人名称</td>
                    <td>浙江大学建筑研究院</td>
                  </tr>
                  <tr>
                    <td class="th">被背书人名称</td>
                    <td>某某银行股份有限公司</td>
                  </tr>
                  <tr>
                    <td class="th">背书日期</td>
                    <td>2019／10／28</td>
                  </tr>
                  <tr >
                    <td colspan="2" class="th tac h-fs14 h-btw2">转让背书</td>
                  </tr>
                  <tr>
                    <td class="th">背书人名称</td>
                    <td>浙江大学建筑研究院</td>
                  </tr>
                  <tr>
                    <td class="th">被背书人名称</td>
                    <td>某某银行股份有限公司</td>
                  </tr>
                  <tr>
                    <td class="th">背书日期</td>
                    <td>2019／10／28</td>
                  </tr>
                </table>
              </div>
            </div>
          </h-tab-pane>
					<h-tab-pane label="交易信息" name="name3">标签三的内容</h-tab-pane>
					<h-tab-pane label="交易历史" name="name4">标签二的内容</h-tab-pane>
			</h-tabs>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="layer1 = false">取消</h-button>
        <h-button type="primary" @click="layer1 = false" v-if="ticketSide=='name1'">打印正面</h-button>
				<h-button type="primary" @click="layer1 = false" v-else-if="ticketSide=='name2'">打印反面</h-button> 
      </div>
    </h-msg-box>
    <h-msg-box v-model="layer2" width="1000" height="400" class="h-ticket-layer" :maximize="true">
      <p slot="header">
        <span>纸票显示窗口</span>
      </p>
      <div>
				<h-tabs value="name1">
					<h-tab-pane label="票样正面" name="name1" class="h-ticket h-t_green">
						<div>
							<h2 class="h-ticket-title">纸质银行承兑汇票</h2>
							<div class="h-ticket-table">
								<table>
                  <colgroup>
                    <col width="7%">
                    <col width="10%">
                    <col width="33%">
                    <col width="7%">
                    <col width="10%">
                    <col width="33%">
                  </colgroup>
									<tr>
										<td colspan="2" class="th">出票日期</td>
										<td>2019／10／28</td>
										<td colspan="2" class="th">票号</td>
										<td>1234 2345 3456 4567</td>
									</tr>
									<tr>
										<td rowspan="3" class="th tac">出票人</td>
										<td class="th">全称</td>
										<td>小鸭家居</td>
										<td rowspan="3" class="th tac">收款人</td>
										<td class="th">全称</td>
										<td>小鸭家居</td>
									</tr>
									<tr>
										<td class="th">账号</td>
										<td>1234 5678 9012</td>
										<td class="th">账号</td>
										<td>1234 5678 9012</td>
									</tr>
									<tr>
										<td class="th">付款行全称</td>
										<td>杭州银行</td>
										<td class="th">开户银行</td>
										<td>中国银行</td>
									</tr>
									<tr>
										<td colspan="2" class="th">票据金额（人民币）</td>
										<td colspan="3">叁万元整</td>
										<td class="h-money-cell">
											<div class="h-money-unit">
												<em>十</em>
												<em>亿</em>
												<em>千</em>
												<em>百</em>
												<em>十</em>
												<em>万</em>
												<em>千</em>
												<em>百</em>
												<em>十</em>
												<em>元</em>
												<em>角</em>
												<em class="h-last">分</em>
											</div>
											<div class="h-money-num">
												<span></span>
												<span></span>
												<span></span>
												<span></span>
												<span>￥</span>
												<span>3</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span class="h-last">0</span>
											</div>
										</td>
									</tr>
									<tr>
										<td colspan="2" class="th">汇票到期日</td>
										<td>2019／10／28</td>
										<td rowspan="2" class="th tac">付款行</td>
										<td class="th">行号</td>
										<td>1234 5678 9012</td>
									</tr>
									<tr>
										<td colspan="2" class="th">承兑协议编号</td>
										<td></td>
										<td class="th">地址</td>
										<td>江南大道3588号</td>
									</tr>
									<tr>
										<td colspan="2" class="th">承兑行全称</td>
										<td>杭州银行</td>
										<td colspan="2" class="th"></td>
										<td></td>
									</tr>
								</table>
							</div>
						</div>
					</h-tab-pane>
					<h-tab-pane label="票样背面" name="name2" class="h-ticket h-t_green">
						<div>
              <h2 class="h-ticket-title">纸质银行承兑汇票</h2>
              <div class="h-ticket-table">
                <table>
                  <colgroup>
                    <col width="16%">
                    <col width="84%">
                  </colgroup>
                  <tr>
                    <td colspan="2" class="th tac h-fs14">贴现背书</td>
                  </tr>
                  <tr>
                    <td class="th">背书人名称</td>
                    <td>浙江大学建筑研究院</td>
                  </tr>
                  <tr>
                    <td class="th">被背书人名称</td>
                    <td>某某银行股份有限公司</td>
                  </tr>
                  <tr>
                    <td class="th">背书日期</td>
                    <td>2019／10／28</td>
                  </tr>
                  <tr >
                    <td colspan="2" class="th tac h-fs14 h-btw2">转让背书</td>
                  </tr>
                  <tr>
                    <td class="th">背书人名称</td>
                    <td>浙江大学建筑研究院</td>
                  </tr>
                  <tr>
                    <td class="th">被背书人名称</td>
                    <td>某某银行股份有限公司</td>
                  </tr>
                  <tr>
                    <td class="th">背书日期</td>
                    <td>2019／10／28</td>
                  </tr>
                </table>
              </div>
            </div>
          </h-tab-pane>
					<h-tab-pane label="交易信息" name="name3">标签三的内容</h-tab-pane>
					<h-tab-pane label="交易历史" name="name4">标签二的内容</h-tab-pane>
			</h-tabs>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="layer2 = false">取消</h-button>
        <h-button type="primary" @click="layer2 = false">打印正面</h-button>
      </div>
    </h-msg-box>
    <h-msg-box v-model="layer3" width="1000" height="400" class="h-ticket-layer" :maximize="true">
      <p slot="header">
        <span>电票显示窗口</span>
      </p>
      <div>
				<h-tabs value="name1">
					<h-tab-pane label="票样正面" name="name1" class="h-ticket h-t_pink">
						<div>
							<h2 class="h-ticket-title">电子银行承兑汇票</h2>
              <div class="h-ticket-info clearfix">
                <ul>
                  <li>
                    <em>出 票 日 期：</em>
                    <span>2018-10-28</span>
                  </li>
                  <li>
                    <em>票据号码：</em>
                    <span>123456789123456789345678900</span>
                  </li>
                  <li>
                    <em>代理票据：</em>
                    <span>否</span>
                  </li>
                  <li>
                    <em>汇票到期日：</em>
                    <span>2019-10-28</span>
                  </li>
                  <li>
                    <em>票据状态：</em>
                    <span>提示付款待签收</span>
                  </li>
                </ul>
              </div>
							<div class="h-ticket-table">
								<table>
                  <colgroup>
                    <col width="10%">
                    <col width="10%">
                    <col width="30%">
                    <col width="9%">
                    <col width="9%">
                    <col width="32%">
                  </colgroup>
									<tr>
										<td rowspan="3" class="th tac">出票人</td>
										<td class="th">全称</td>
										<td>小鸭家居</td>
										<td rowspan="3" class="th tac">收款人</td>
										<td class="th">全称</td>
										<td>小鸭家居</td>
									</tr>
									<tr>
										<td class="th">账号</td>
										<td>1234 5678 9012</td>
										<td class="th">账号</td>
										<td>1234 5678 9012</td>
									</tr>
									<tr>
										<td class="th">付款行全称</td>
										<td>杭州银行</td>
										<td class="th">开户银行</td>
										<td>中国银行</td>
									</tr>
                  <tr>
                    <td colspan="2" class="th">出票保证信息</td>
                    <td colspan="4">
                      <span class="h-bz-l">
                        <em>保证人名称:</em>
                        <b></b>
                      </span>
                      <span class="h-bz-c">
                        <em>保证人地址:</em>
                        <b></b>
                      </span>
                      <span class="h-bz-r">
                        <em>保证日期:</em>
                        <b>2019-08-10</b>
                      </span>
                    </td>
                  </tr>
									<tr>
										<td colspan="2" class="th">票据金额（人民币）</td>
										<td colspan="3">叁万元整</td>
										<td class="h-money-cell">
											<div class="h-money-unit">
												<em>十</em>
												<em>亿</em>
												<em>千</em>
												<em>百</em>
												<em>十</em>
												<em>万</em>
												<em>千</em>
												<em>百</em>
												<em>十</em>
												<em>元</em>
												<em>角</em>
												<em class="h-last">分</em>
											</div>
											<div class="h-money-num">
												<span></span>
												<span></span>
												<span></span>
												<span></span>
												<span>￥</span>
												<span>3</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span class="h-last">0</span>
											</div>
										</td>
									</tr>
									<tr>
										<td rowspan="2" class="th tac">承兑人信息</td>
										<td class="th">全称</td>
										<td>某某银行股份有限公司</td>
										<td colspan="2" class="th">开户行行号</td>
										<td>1234 5678 9012</td>
									</tr>
									<tr>
										<td class="th">账号</td>
										<td>0</td>
										<td colspan="2" class="th">付款行名称</td>
										<td>恒丰银行</td>
									</tr>
									<tr>
										<td colspan="2" class="th">交易合同号</td>
										<td></td>
										<td rowspan="2" class="th tac">承兑信息</td>
										<td class="th">出票人承诺</td>
										<td>本汇票请予以承兑，到期无条件付款</td>
									</tr>
									<tr>
										<td colspan="2" class="th">能否转让</td>
										<td></td>
										<td class="th">承兑人承诺</td>
										<td>
											<span>本汇票请予以承兑，到期无条件付款</span>
											<a href="javascript:;" class="h-ticket-dq">2019-08-20</a>
										</td>
									</tr>
									<tr>
                    <td colspan="2" class="th">承兑保证信息</td>
                    <td colspan="4">
                      <span class="h-bz-l">
                        <em>保证人名称:</em>
                        <b></b>
                      </span>
                      <span class="h-bz-c">
                        <em>保证人地址:</em>
                        <b></b>
                      </span>
                      <span class="h-bz-r">
                        <em>保证日期:</em>
                        <b>2019-08-10</b>
                      </span>
                    </td>
                  </tr>
									<tr>
										<td rowspan="2" class="th">
											<span>评级信息</span>
											<em class="h-c6">(由出票人、承兑人记载，仅供参考)</em>
										</td>
										<td class="th">出票人</td>
										<td colspan="4">
											<span class="h-pj-l">
                        <em>评级主体:</em>
                        <b></b>
                      </span>
                      <span class="h-pj-c">
                        <em>信用等级:</em>
                        <b></b>
                      </span>
                      <span class="h-pj-r">
                        <em>评级到期日:</em>
                        <b>2019-08-10</b>
                      </span>
										</td>
									</tr>
									<tr>
										<td class="th">承兑人</td>
										<td colspan="4">
											<span class="h-pj-l">
                        <em>评级主体:</em>
                        <b></b>
                      </span>
                      <span class="h-pj-c">
                        <em>信用等级:</em>
                        <b></b>
                      </span>
                      <span class="h-pj-r">
                        <em>评级到期日:</em>
                        <b>2019-08-10</b>
                      </span>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</h-tab-pane>
					<h-tab-pane label="票样背面" name="name2" class="h-ticket h-t_pink">
						<div>
              <h2 class="h-ticket-title">纸质银行承兑汇票</h2>
              <div class="h-ticket-table">
                <table>
                  <colgroup>
                    <col width="16%">
                    <col width="84%">
                  </colgroup>
                  <tr>
                    <td colspan="2" class="th tac h-fs14">贴现背书</td>
                  </tr>
                  <tr>
                    <td class="th">背书人名称</td>
                    <td>浙江大学建筑研究院</td>
                  </tr>
                  <tr>
                    <td class="th">被背书人名称</td>
                    <td>某某银行股份有限公司</td>
                  </tr>
                  <tr>
                    <td class="th">背书日期</td>
                    <td>2019／10／28</td>
                  </tr>
                  <tr >
                    <td colspan="2" class="th tac h-fs14 h-btw2">转让背书</td>
                  </tr>
                  <tr>
                    <td class="th">背书人名称</td>
                    <td>浙江大学建筑研究院</td>
                  </tr>
                  <tr>
                    <td class="th">被背书人名称</td>
                    <td>某某银行股份有限公司</td>
                  </tr>
                  <tr>
                    <td class="th">背书日期</td>
                    <td>2019／10／28</td>
                  </tr>
                </table>
              </div>
            </div>
          </h-tab-pane>
					<h-tab-pane label="交易信息" name="name3">标签三的内容</h-tab-pane>
					<h-tab-pane label="交易历史" name="name4">标签二的内容</h-tab-pane>
			</h-tabs>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="layer3 = false">取消</h-button>
        <h-button type="primary" @click="layer3 = false">打印正面</h-button>
      </div>
    </h-msg-box>
		<h-msg-box v-model="layer4" width="1000" height="400" class="h-ticket-layer" :maximize="true">
      <p slot="header">
        <span>电票显示窗口</span>
      </p>
      <div>
				<h-tabs value="name1">
					<h-tab-pane label="票样正面" name="name1" class="h-ticket h-t_orange">
						<div>
							<h2 class="h-ticket-title">电子银行承兑汇票</h2>
              <div class="h-ticket-info clearfix">
                <ul>
                  <li>
                    <em>出 票 日 期：</em>
                    <span>2018-10-28</span>
                  </li>
                  <li>
                    <em>票据号码：</em>
                    <span>123456789123456789345678900</span>
                  </li>
                  <li>
                    <em>代理票据：</em>
                    <span>否</span>
                  </li>
                  <li>
                    <em>汇票到期日：</em>
                    <span>2019-10-28</span>
                  </li>
                  <li>
                    <em>票据状态：</em>
                    <span>提示付款待签收</span>
                  </li>
                </ul>
              </div>
							<div class="h-ticket-table">
								<table>
                  <colgroup>
                    <col width="10%">
                    <col width="10%">
                    <col width="30%">
                    <col width="9%">
                    <col width="9%">
                    <col width="32%">
                  </colgroup>
									<tr>
										<td rowspan="3" class="th tac">出票人</td>
										<td class="th">全称</td>
										<td>小鸭家居</td>
										<td rowspan="3" class="th tac">收款人</td>
										<td class="th">全称</td>
										<td>小鸭家居</td>
									</tr>
									<tr>
										<td class="th">账号</td>
										<td>1234 5678 9012</td>
										<td class="th">账号</td>
										<td>1234 5678 9012</td>
									</tr>
									<tr>
										<td class="th">付款行全称</td>
										<td>杭州银行</td>
										<td class="th">开户银行</td>
										<td>中国银行</td>
									</tr>
                  <tr>
                    <td colspan="2" class="th">出票保证信息</td>
                    <td colspan="4">
                      <span class="h-bz-l">
                        <em>保证人名称:</em>
                        <b></b>
                      </span>
                      <span class="h-bz-c">
                        <em>保证人地址:</em>
                        <b></b>
                      </span>
                      <span class="h-bz-r">
                        <em>保证日期:</em>
                        <b>2019-08-10</b>
                      </span>
                    </td>
                  </tr>
									<tr>
										<td colspan="2" class="th">票据金额（人民币）</td>
										<td colspan="3">叁万元整</td>
										<td class="h-money-cell">
											<div class="h-money-unit">
												<em>十</em>
												<em>亿</em>
												<em>千</em>
												<em>百</em>
												<em>十</em>
												<em>万</em>
												<em>千</em>
												<em>百</em>
												<em>十</em>
												<em>元</em>
												<em>角</em>
												<em class="h-last">分</em>
											</div>
											<div class="h-money-num">
												<span></span>
												<span></span>
												<span></span>
												<span></span>
												<span>￥</span>
												<span>3</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span>0</span>
												<span class="h-last">0</span>
											</div>
										</td>
									</tr>
									<tr>
										<td rowspan="2" class="th tac">承兑人信息</td>
										<td class="th">全称</td>
										<td>某某银行股份有限公司</td>
										<td colspan="2" class="th">开户行行号</td>
										<td>1234 5678 9012</td>
									</tr>
									<tr>
										<td class="th">账号</td>
										<td>0</td>
										<td colspan="2" class="th">付款行名称</td>
										<td>恒丰银行</td>
									</tr>
									<tr>
										<td colspan="2" class="th">交易合同号</td>
										<td></td>
										<td rowspan="2" class="th tac">承兑信息</td>
										<td class="th">出票人承诺</td>
										<td>本汇票请予以承兑，到期无条件付款</td>
									</tr>
									<tr>
										<td colspan="2" class="th">能否转让</td>
										<td></td>
										<td class="th">承兑人承诺</td>
										<td>
											<span>本汇票请予以承兑，到期无条件付款</span>
											<a href="javascript:;" class="h-ticket-dq">2019-08-20</a>
										</td>
									</tr>
									<tr>
                    <td colspan="2" class="th">承兑保证信息</td>
                    <td colspan="4">
                      <span class="h-bz-l">
                        <em>保证人名称:</em>
                        <b></b>
                      </span>
                      <span class="h-bz-c">
                        <em>保证人地址:</em>
                        <b></b>
                      </span>
                      <span class="h-bz-r">
                        <em>保证日期:</em>
                        <b>2019-08-10</b>
                      </span>
                    </td>
                  </tr>
									<tr>
										<td rowspan="2" class="th">
											<span>评级信息</span>
											<em class="h-c6">(由出票人、承兑人记载，仅供参考)</em>
										</td>
										<td class="th">出票人</td>
										<td colspan="4">
											<span class="h-pj-l">
                        <em>评级主体:</em>
                        <b></b>
                      </span>
                      <span class="h-pj-c">
                        <em>信用等级:</em>
                        <b></b>
                      </span>
                      <span class="h-pj-r">
                        <em>评级到期日:</em>
                        <b>2019-08-10</b>
                      </span>
										</td>
									</tr>
									<tr>
										<td class="th">承兑人</td>
										<td colspan="4">
											<span class="h-pj-l">
                        <em>评级主体:</em>
                        <b></b>
                      </span>
                      <span class="h-pj-c">
                        <em>信用等级:</em>
                        <b></b>
                      </span>
                      <span class="h-pj-r">
                        <em>评级到期日:</em>
                        <b>2019-08-10</b>
                      </span>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</h-tab-pane>
					<h-tab-pane label="票样背面" name="name2" class="h-ticket h-t_orange">
						<div>
              <h2 class="h-ticket-title">纸质银行承兑汇票</h2>
              <div class="h-ticket-table">
                <table>
                  <colgroup>
                    <col width="16%">
                    <col width="84%">
                  </colgroup>
                  <tr>
                    <td colspan="2" class="th tac h-fs14">贴现背书</td>
                  </tr>
                  <tr>
                    <td class="th">背书人名称</td>
                    <td>浙江大学建筑研究院</td>
                  </tr>
                  <tr>
                    <td class="th">被背书人名称</td>
                    <td>某某银行股份有限公司</td>
                  </tr>
                  <tr>
                    <td class="th">背书日期</td>
                    <td>2019／10／28</td>
                  </tr>
                  <tr >
                    <td colspan="2" class="th tac h-fs14 h-btw2">转让背书</td>
                  </tr>
                  <tr>
                    <td class="th">背书人名称</td>
                    <td>浙江大学建筑研究院</td>
                  </tr>
                  <tr>
                    <td class="th">被背书人名称</td>
                    <td>某某银行股份有限公司</td>
                  </tr>
                  <tr>
                    <td class="th">背书日期</td>
                    <td>2019／10／28</td>
                  </tr>
                </table>
              </div>
            </div>
          </h-tab-pane>
					<h-tab-pane label="交易信息" name="name3">标签三的内容</h-tab-pane>
					<h-tab-pane label="交易历史" name="name4">标签二的内容</h-tab-pane>
			</h-tabs>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="layer4 = false">取消</h-button>
        <h-button type="primary" @click="layer4 = false">打印正面</h-button>
      </div>
    </h-msg-box>
	</div>
</template>
<script>
	export default{
	 name : "layerTicket",
		data(){
	   return {
       layer1: false,
       layer2: false,
       layer3: false,
       layer4: false,
       ticketSide : "name1",
     };
		},
		methods:{
			tabClick(index){
				this.ticketSide=index;
			}
		}
	}
</script>
