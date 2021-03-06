/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import dateformat from 'dateformat';
import { Table, Form, Input, Button, Checkbox, Select, Row, Col, message, notification } from 'antd';
import classNames from 'classnames';
import styles from './styles.scss';
let cx = classNames.bind(styles);
const FormItem = Form.Item;

const columns = [{
    title: '提交人',
    dataIndex: 'ownerName',
    key: 'ownerName',
    render: (v, r) => {
        if(r.ownerId.status == -1) {
            return <span>{r.ownerId.name} (已注销)</span>
        } else {
            return <span>{r.ownerId.name}</span>
        }
    }
}, {
    title:     '时间',
    dataIndex: 'updateAt',
    key:       'updateAt',
    render:    (value, record) => <span>{dateformat(value, 'yyyy-mm-dd HH:MM:ss')}</span>
}, {
    title: '操作',
    dataIndex: 'status',
    key: 'status',
    render: (value, record) => {
        let status = '';
        switch(value) {
            case 0:
                status = '提交审核';
                break;
            case 1:
                status = '通过';
                break;
            case 2:
                status = '否决';
                break;
            case 3:
                status = '退回';
                break;
            default:
                status = '无';
        }
        return <span>{status}</span>;
    }
}, {
    title: '备注',
    dataIndex: 'content',
    key: 'content'
}];


class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            messages: []
        }
    }
    
    componentWillMount() {
        var id = getUrlId('information');
        $.ajax({
            type: 'GET',
            url: '/apiv1/information/' + id + '/messages',
            success: (res) => {
                if(res.err == 0) {
                    this.setState({
                        loading: false,
                        messages: res.messages
                    })
                } else {
                    notification.error({
                        message: 'Error',
                        description: res.msg
                    });
                }
            },
            error: (res) => {
                notification.error({
                    message: 'Error',
                    description: res.msg
                });
            }
        })
    }
    
    render() {
        const {getFieldProps} = this.props.form;
        
        let style = {
            preWrap: cx({
                'preWrap': true
            }),
            borderBox: cx({
                'border-container': true
            })
        };
    
        const commentFormLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
        };
        
        var status = this.props.information.status;
        
        return (
            <div>
                <div style={{ marginTop: 36 }}>
                    <h2 style={{marginBottom: 10}}>审核信息记录</h2>
                    <Table dataSource={this.state.messages} columns={columns} />
                </div>
                {
                    (() => {
                        if(sessionStorage.userRole == 0) {
                            if(status == -1 || status == 1 || status == 2) {
                                {/*return <div></div>*/}
                            }
                            
                            return (
                                <div style={{padding: '20px 15px 1px', backgroundColor: '#f7f7f7', borderRadius: 15}}>
                                    <h2 style={{marginBottom: 10}}>发布审核信息</h2>
                                    <Form horizontal>
                                        <FormItem
                                            id="select"
                                            label="操作"
                                            {...commentFormLayout}
                                        >
                                            <Select
                                                id="status" size="large" style={{ width: 200 }}
                                                placeholder='请选择'
                                                {...getFieldProps('status', {rules: [{ required: true, message: '请选择' }]})}
                                            >
                                                <Select.Option value="1">通过</Select.Option>
                                                <Select.Option value="2">否决</Select.Option>
                                                <Select.Option value="3">退回</Select.Option>
                                            </Select>
                                        </FormItem>
            
                                        <FormItem
                                            id="control-textarea"
                                            label="备注"
                                            {...commentFormLayout}
                                        >
                                            <Input
                                                type="textarea" id="content" rows="3"
                                                {...getFieldProps('content', {rules: [{ required: true, message: '请填写' }]})}
                                            />
                                        </FormItem>
            
                                        <FormItem wrapperCol={{ span: 16, offset: 2 }} style={{ marginTop: 0 }}>
                                            <Button type="primary" onClick={this.submitMsg}>提交</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            );
                        }
                    })()
                }
            </div>
        );
    }
    
    submitMsg = () => {
        let id = getUrlId('information');
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
    
            $.ajax({
                type: 'POST',
                url: '/apiv1/information/new_message',
                data: {
                    id: id,
                    status: values.status,
                    content: values.content,
                },
                success: (res) => {
                    if(res.err == 0) {
                        notification.success({
                            message: 'Success',
                            description: res.msg
                        });
                        window.location.hash = '/client/all';
                    }
                }
            })
        });
    };
}


Message = Form.create()(Message);

export default Message;