/**
 * Created by leo on 8/30/16.
 */
import React from 'react';
import classNames from 'classnames';
import { Table, Button, Input, Spin, Icon } from 'antd';
import SearchInput from '../SearchInput';
const InputGroup = Input.Group;

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile'
}, {
    title: '代理级别',
    dataIndex: 'role',
    key: 'role',
    render: (v, r) => {
        var roleType = '';
        switch(r.role) {
            case 0: roleType='风控'; break;
            case 1: roleType='一级代理'; break;
            case 2: roleType='二级代理'; break;
            case 3: roleType='三级代理'; break;
            default: break;
        }
        return <span>{roleType}</span>;
    }
}, {
    title: '上级代理',
    dataIndex: 'parent',
    key: 'parent',
    render: (value, record) => record.role !=0 ? <span>{record.parentId.name}</span> : <span>无</span>
}, {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment'
}, {
    title: '编辑',
    key: 'edit',
    render: (value, record) => {
        if(record.status == -1) {
            // 已注销
            return <span>{'(不可编辑)'}</span>;
        } else {
            return <a href={'/#/user/' + record._id}>编辑</a>;
        }
    }
}];


class AgentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            agent: []
        }
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/' + getUrlId('agency') + '/child',
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        loading: false,
                        agent: res.users
                    })
                } else {
                    console.error(res.msg);
                }
            },
            error: (res) => {
                console.error(res);
            },
            complete: () => {
                this.setState({loading: false});
            }
        
        })
    }
    
    render() {
        if(this.state.loading) {
            return <Spin />;
        }
        
        return (
            <div>
                <div>
                    <Button type="default" onClick={this.back} icon="rollback">返回</Button>
                    <SearchInput
                        placeholder="输入姓名查询代理"
                        style={{ width: 200, marginLeft: 10 }}
                        onSearch={value => {
                            this.setState({
                                agent: this.state.agent.filter(item => item.name.indexOf(value) >= 0)
                            });
                        }}
                    />
                </div>
                <div style={{marginTop: 20}}>
                    <Table dataSource={this.state.agent} columns={columns} />
                </div>
            </div>
        )
    }
    
    back = () => {
        history.back();
    }
    
}

export default AgentBox;