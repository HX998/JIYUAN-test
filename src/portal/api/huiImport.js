// import "h_ui/dist/h_ui.min.css";

import Alert from "h_ui/dist/lib/Alert.js";
import Breadcrumb from 'h_ui/dist/lib/Breadcrumb.js';
import Button from "h_ui/dist/lib/Button.js";
import Card from "h_ui/dist/lib/Card.js";
import Carousel from "h_ui/dist/lib/Carousel.js";
import Cascader from "h_ui/dist/lib/Cascader.js";
import Checkbox from "h_ui/dist/lib/Checkbox.js";
import Row from "h_ui/dist/lib/Row.js";
import Collapse from "h_ui/dist/lib/Collapse.js";
import DatePicker from "h_ui/dist/lib/DatePicker.js";
import Dropdown from "h_ui/dist/lib/Dropdown.js";
import Form from "h_ui/dist/lib/Form.js";
import Icon from "h_ui/dist/lib/Icon.js";
import Input from "h_ui/dist/lib/Input.js";
import InputNumber from "h_ui/dist/lib/InputNumber.js";
import LoadingBar from "h_ui/dist/lib/Loadingbar.js";
import Menu from "h_ui/dist/lib/Menu.js";
import Message from "h_ui/dist/lib/Message.js";
import MsgBox from "h_ui/dist/lib/MsgBox.js";
import Notice from "h_ui/dist/lib/Notice.js";
import Page from "h_ui/dist/lib/Page.js";
import Poptip from "h_ui/dist/lib/Poptip.js";
import Progress from "h_ui/dist/lib/Progress.js";
import Radio from "h_ui/dist/lib/Radio.js";
import Select from "h_ui/dist/lib/Select.js";
import SimpleSelect from "h_ui/dist/lib/SimpleSelect.js";
import FieldPanel from "h_ui/dist/lib//FieldPanel";
import Spin from "h_ui/dist/lib/Spin.js";
import Steps from "h_ui/dist/lib/Steps.js";
import Switch from "h_ui/dist/lib/Switch.js";
import Schedule from "h_ui/dist/lib/Schedule.js";
// import Table from "h_ui/dist/lib/Table.js";
import TableMin from "h_ui/dist/lib/TableMin.js";
import Tabs from "h_ui/dist/lib/Tabs.js";
import Timeline from "h_ui/dist/lib/Timeline.js";
import TimePicker from "h_ui/dist/lib/TimePicker.js";
import Tooltip from "h_ui/dist/lib/Tooltip.js";
import Transfer from "h_ui/dist/lib/Transfer.js";
import Tree from "h_ui/dist/lib/Tree.js";
import Typefield from "h_ui/dist/lib/Typefield.js";
import Upload from "h_ui/dist/lib/Upload.js";
import Tag from "h_ui/dist/lib/Tag.js";
import EditGird from "h_ui/dist/lib/EditGird.js"


let hui = {
  Alert,
  hAlert: Alert,
  Breadcrumb,
  hBreadcrumb: Breadcrumb,
  BreadcrumbItem: Breadcrumb.Item,
  hBreadcrumbItem:  Breadcrumb.Item,
  Button,
  hButton: Button,
  ButtonGroup: Button.Group,
  hButtonGroup: Button.Group,
  Card,
  hCard: Card,
  Carousel,
  hCarousel: Carousel,
  Carouselitem: Carousel.Item,
  hCarouselitem: Carousel.Item,
  Cascader,
  hCascader: Cascader,
  Checkbox,
  hCheckbox: Checkbox,
  CheckboxGroup: Checkbox.Group,
  hCheckboxGroup: Checkbox.Group,
  Checkbtn: Checkbox.Btn,
  hCheckbtn: Checkbox.Btn,
  Row,
  hRow: Row,
  Col: Row.Item,
  hCol: Row.Item,
  Collapse,
  hCollapse: Collapse,
  CollapsePanel: Collapse.Panel,
  hCollapsePanel: Collapse.Panel,
  DatePicker,
  hDatePicker: DatePicker,
  Dropdown,
  hDropdown: Dropdown,
  DropdownItem: Dropdown.Item,
  hDropdownItem: Dropdown.Item,
  DropdownMenu: Dropdown.Menu,
  hDropdownMenu: Dropdown.Menu,
  Form,
  hForm: Form,
  FormItem: Form.Item,
  hFormItem: Form.Item,
  Icon,
  hIcon: Icon,
  Input,
  hInput: Input,
  InputNumber,
  hInputNumber: InputNumber,
  LoadingBar,
  hLoadingBar: LoadingBar,
  Menu,
  hMenu: Menu,
  MenuGroup: Menu.Group,
  hMenuGroup: Menu.Group,
  MenuItem: Menu.Item,
  hMenuItem: Menu.Item,
  Submenu: Menu.Sub,
  hSubmenu: Menu.Sub,
  Message,
  hMessage: Message,
  MsgBox,
  // hMsgBox: MsgBox,
  Notice,
  hNotice: Notice,
  Page,
  hPage: Page,
  Poptip,
  hPoptip: Poptip,
  Progress,
  hProgress: Progress,
  Radio,
  hRadio: Radio,
  RadioGroup: Radio.Group,
  hRadioGroup: Radio.Group,
  Select,
  hSelect: Select,
  Option: Select.Option,
  hOption: Select.Option,
  SimpleSelect: SimpleSelect,
  hSimpleSelect: SimpleSelect,
  hSelectBlock: SimpleSelect.Block,
  FieldPanel,
  hFieldPanel: FieldPanel,
  Spin,
  hSpin: Spin,
  Steps,
  hSteps: Steps,
  Step: Steps.Step,
  hStep: Steps.Step,
  hSwitch: Switch,
  Schedule,
  hSchedule: Schedule,
  // Table,
  // hTable: Table,
  TableMin,
  hTableMin: TableMin,
  Tabs,
  hTabs: Tabs,
  TabPane: Tabs.Pane,
  hTabPane: Tabs.Pane,
  Timeline,
  hTimeline: Timeline,
  TimelineItem: Timeline.Item,
  hTimelineItem: Timeline.Item,
  TimePicker,
  hTimePicker: TimePicker,
  Tooltip,
  hTooltip: Tooltip,
  Transfer,
  hTransfer: Transfer,
  Tree,
  hTree: Tree,
  Typefield,
  hTypefield: Typefield,
  Upload,
  hUpload: Upload,
  Tag: Tag,
  hTag: Tag,
  EditGird: EditGird,
  hEditGird: EditGird
};
let install = function(Vue, opts = {}) {
  Object.keys(hui).forEach(key => {
    Vue.component(key, hui[key]);
  });
  Vue.prototype.$hLoading = LoadingBar;
  Vue.prototype.$hMessage = Message;
  Vue.prototype.$hMsgBox = MsgBox;
  Vue.prototype.$hNotice = Notice;
  Vue.prototype.$hSpin = Spin;
};
export default Object.assign(hui, { install });
