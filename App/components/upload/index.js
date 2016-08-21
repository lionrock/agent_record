/**
 * Created by leo on 8/22/16.
 */
import React from 'react';
import { notification } from 'antd';

import InfoForm from './InfoForm';
import Attachment from './Attachment';
import Message from './Message';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as userActions from '../../action/user';

class UploadBox extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount() {
        var id = getUrlId('information');
        console.log(id);
        
        $.ajax({
            type: 'GET',
            url:  '/apiv1/information/' + id,
            success: (res) => {
                if(res.err == 0) {
                    notification.success({
                        message: 'Success',
                        description: res.msg
                    });
                } else {
                    notification.success({
                        message: 'Error',
                        description: res.msg
                    });
                }
            },
            error: (res) => {
                notification.error({
                    message: '网络错误',
                    description: '如果该问题重复出现请联系客服人员'
                });
            }
        })
    }
    
    render() {
        return (
            <div>
                <InfoForm/>
                <Attachment/>
                <Message/>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UploadBox);