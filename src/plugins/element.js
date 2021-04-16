import Vue from 'vue'
import {
    Container, Header, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, Row, Col,
    Upload, Form, FormItem, Button, Input, Select, Message, MessageBox, Dialog, Tooltip,
    Breadcrumb, BreadcrumbItem, Card, Link, Table, TableColumn, Option, Popover, Tree, 
    Dropdown, DropdownMenu, DropdownItem
} from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Input)
Vue.use(Select)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Link)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Option)
Vue.use(Popover)
Vue.use(Tree)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)