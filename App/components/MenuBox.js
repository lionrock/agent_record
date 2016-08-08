import React, {Component} from 'react';
import { Router, Route, Link } from 'react-router'
import 'antd/dist/antd.css';

import {
    Menu,
    Button,
    Table,
    Spin,
    Form,
    Input,
    Row,
    Col,
    Icon,
    DatePicker
} from 'antd';

const FormItem = Form.Item;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class MenuBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount() {}

    render() {
        if (this.state.loading) {
            // return (
            //     <Spin />
            // );
        }

        return (
            <Menu
                onClick={this.handleClick}
                style={{ width: 240 }}
                defaultOpenKeys={['sub1', 'sub2']}
                selectedKeys={[this.state.current]}
                mode="inline"
            >
                <SubMenu key="sub1" title={<span><Icon type="mail"/> <span> 客户 </span></span>}>
                    <Menu.Item key='1-0'>客户列表</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span> <Icon type="appstore"/> <span> 代理 </span></span>}>
                    <Menu.Item key="2-0"><Link to='/client/new'>新增代理</Link></Menu.Item>
                    <Menu.Item key="2-1"><Link to='/client/show'>代理列表</Link></Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default MenuBox;
