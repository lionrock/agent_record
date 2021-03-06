import React from 'react';
import classNames from 'classnames';
import { Select, Menu, Row, Col, Icon, Button } from 'antd';

import styles from './styles.scss';
let cx = classNames.bind(styles);
import configs from '../../configs';

class HeaderBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let style = {
            title: cx({
                title: true
            })
        };
        return (
            <header id="header">
                <Row style={{backgroundColor: '#3A99D8', height: 80}}>
                    <Col lg={4} md={6} sm={7} xs={7}>
                        {/*<img src="/public/images/slogan.png" alt="" style={{height: 60}}/>*/}
                        <a href="/#/client/all"><h1 className={style.title}>{configs.sitename}</h1></a>
                    </Col>
                    <Col className={`nav nav-show`}
                         lg={20} md={18} sm={17} xs={17} style={{display: 'block'}}
                    >
                        <Button
                            type="primary"
                            icon="poweroff"
                            style={{
                                height: 36,
                                backgroundColor: '#EB5768',
                                float: 'right',
                                marginTop: 22,
                                marginRight: 22
                            }}
                            onClick={this.logout.bind(this)}
                        >
                            退出
                        </Button>
                    </Col>
                </Row>
            </header>
        );
    }

    logout() {
        $.ajax({
            type: 'POST',
            url: '/user/logout',
            success: function (res) {
                if (res.err == 0) {
                    sessionStorage.userId = '';
                    sessionStorage.userRole = '';
                    sessionStorage.username = '';
                    
                    window.location.hash = 'login';
                }
            },
            error: function (err) {
            }
        })
    }
}

export default HeaderBox;