/**
 * Created by leo on 9/1/16.
 */
import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col, notification, Spin, Select, Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    
    render() {
        if(this.state.loading) {
            return <Spin />
        }
        
        const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
        const formItemLayout = {
            labelCol:   {span: 7},
            wrapperCol: {span: 12},
        };
    
        const nameProps = getFieldProps('name', {
            rules:   [
                {required: true, min: 2, message: '姓名名至少为 2 个字符'},
            ],
            initialValue: this.state.user.name
        });
    
        const mobileProps = getFieldProps('mobile', {
            rules: [
                {required: true, len: 11, message: '手机号必须为11位'},
            ],
            initialValue: this.state.user.mobile
        });
    
        const qqProps = getFieldProps('qq', {
            initialValue: this.state.user.qq
        });
    
        const commentProps = getFieldProps('comment', {
            initialValue: this.state.user.comment
        });
        
        return (
            <div style={{marginTop: 40}}>
                <h2>修改信息</h2>
                <Button type="default" onClick={() => {history.back()}} icon="rollback">返回</Button>
                <Form horizontal>
                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                        hasFeedback
                        help={isFieldValidating('username') ? '校验中...' : (getFieldError('username') || []).join(', ')}
                    >
                        <Input
                            disabled
                            defaultValue={this.state.user.username}
                            placeholder="帐号/用户名"
                        />
                    </FormItem>
        
                    <FormItem
                        label='真实姓名'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
                    >
                        <Input
                            {...nameProps}
                            placeholder='请输入真实姓名'
                        />
                    </FormItem>
        
                    <FormItem
                        {...formItemLayout}
                        label="手机号"
                        hasFeedback
                        help={isFieldValidating('mobile') ? '校验中...' : (getFieldError('mobile') || []).join(', ')}
                    >
                        <Input
                            {...mobileProps}
                            placeholder="手机号"
                        />
                    </FormItem>
    
                    <FormItem
                        label='代理类型'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('role') ? '校验中...' : (getFieldError('role') || []).join(', ')}
                    >
                        <Select
                            disabled
                            defaultValue={this.state.user.role.toString()}
                            placeholder='请选择代理类型'
                        >
                            <Select.Option value="0" diabled>管理员</Select.Option>
                            <Select.Option value="1">一级代理</Select.Option>
                            <Select.Option value="2">二级代理</Select.Option>
                            <Select.Option value="3">三级代理</Select.Option>
                        </Select>
                    </FormItem>
    
                    <FormItem
                        label='父级代理'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('parent') ? '校验中...' : (getFieldError('parent') || []).join(', ')}
                    >
                        <Input
                            disabled
                            defaultValue={this.state.user.parent}
                            id='parent' placeholder='请输入父级代理帐号'
                        />
                    </FormItem>
    
                    <FormItem
                        label='性别'
                        hasFeedback
                        {...formItemLayout}
                        help={isFieldValidating('gender') ? '校验中...' : (getFieldError('gender') || []).join(', ')}
                    >
                        <RadioGroup
                            {...getFieldProps('gender', { initialValue: this.state.user.gender.toString() })}
                        >
                            <Radio value="0">男</Radio>
                            <Radio value="1">女</Radio>
                        </RadioGroup>
                    </FormItem>
    
                    <FormItem
                        label='QQ号'
                        {...formItemLayout}
                    >
                        <Input
                            {...qqProps}
                            placeholder='请输入QQ号'
                        />
                    </FormItem>
        
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        <Input
                            {...commentProps}
                            type="textarea"
                            name="comment"/>
                    </FormItem>
                </Form>
                
                {
                    sessionStorage.userRole == 0 ?
                        <Button
                            icon="delete"
                            style={{
                                height: 36,
                                backgroundColor: '#EB5768',
                                color: '#fff',
                                float: 'right',
                                marginTop: 22,
                                marginRight: 22
                            }}
                            onClick={this.handleDelete.bind(this)}
                        >
                            删除该用户
                        </Button> : null
                }
                {
                    sessionStorage.userRole == 0 ?
                        <Button
                            type='primary'
                            icon="edit"
                            style={{
                                height: 36,
                                float: 'right',
                                marginTop: 22,
                                marginRight: 22
                            }}
                            onClick={this._handleSubmit.bind(this)}
                        >
                            确认修改
                        </Button> : null
                }
            </div>
        )
    }
    
    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: '/apiv1/user/' + getUrlId('user'),
            success: (res) => {
                if(res.err == 0) {
                    this.setState({user: res.user, loading: false});
                } else {
                    notification.error({
                        message:     'Error',
                        description: res.msg
                    });
                }
            }, error: (res) => {
                console.error(res);
            }
        })
    }
    
    
    /**
     * 删除用户
     */
    handleDelete() {
        $.ajax({
            type: 'POST',
            url: '/apiv1/user/delete',
            data: {
                id: getUrlId('user')
            },
            success: (res) => {
                if(res.err == 0) {
                    notification.success({
                        message: 'Success',
                        description: res.msg
                    });
                    window.location.hash = '/agency/all';
                } else {
                    notification.error({
                        message: 'Error',
                        description: res.msg
                    });
                }
            },
            error: (err) => {
                console.error(err);
            }
        })
    }
    
    /**
     * 修改
     * @private
     */
    _handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
    
            $.ajax({
                type: 'POST',
                url: '/apiv1/user/update_info',
                data: {
                    id:   getUrlId('user'),
                    name: values.name,
                    mobile: values.mobile,
                    gender: values.gender,
                    qq: values.qq,
                    comment: values.comment
                },
                success: (res) => {
                    if (res.err == 0) {
                        notification.success({
                            message:     'Success',
                            description: res.msg
                        });
                        window.location.hash = '/agency/all';
                    } else {
                        notification.error({
                            message:     'Error',
                            description: res.msg
                        });
                    }
                },
                error: (res) => {
                    console.error(res.msg);
                }
            })
        })
    }
}

UserDetail = Form.create()(UserDetail);
export default UserDetail;