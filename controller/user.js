'use strict';

var User     = require('../models/User');
var passport = require('passport');
var ccap     = require('ccap');

function is_wechat(req) {
    if (req.headers['user-agent']) {
        var ua = (req.headers['user-agent']).toLowerCase();
        return (ua.indexOf("micromessenger") > -1);
    } else {
        return false;
    }
}

/**
 * 注册
 */
exports.signUp = function (req, res) {
    var username   = req.body.username;
    var name       = req.body.name;
    var password   = req.body.password ? req.body.password : '123456';
    var repassword = req.body.repassword ? req.body.repassword : '123456';
    var role       = req.body.role;
    var parent     = req.body.parent;
    var gender     = req.body.gender;
    var mobile     = req.body.mobile;
    var qq         = req.body.qq ? req.body.qq : '';
    var comment    = req.body.comment ? req.body.comment : '';
    
    if (password != repassword) {
        return res.json({
            err: 1,
            msg: '重复密码不相等'
        });
    }
    
    var user = new User({
        username: username,
        name:     name,
        password: password,
        role:     role,
        parent:   parent,
        gender:   gender,
        mobile:   mobile,
        qq:       qq,
        comment:  comment
    });
    
    User.find({username: parent})
        .exec((err, p) => {
            if(err) {return res.json({err:1, msg:err});}
            user = new User({
                username: username,
                name:     name,
                password: password,
                role:     role,
                parent:   parent,
                parentId: !p ? '' : p._id,
                gender:   gender,
                mobile:   mobile,
                qq:       qq,
                comment:  comment
            });

            user.save(function (err) {
                if (err) {
                    if (err.code === 11000) {
                        return res.json({
                            err: 1,
                            msg: '此账户已被注册'
                        });
                    } else {
                        return res.json({
                            err: 1,
                            msg: err
                        });
                    }
                } else {
                    return res.json({
                        err: 0,
                        msg: '注册成功'
                    });
                }
            });
        })
};


/**
 * 用户登陆
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.login = function (req, res, next) {
    if(req.body.captcha != req.session.captcha) {
        return res.json({
            err: 1,
            msg: '验证码不正确'
        })
    }
    
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                err:      2,
                msg:      info.message,
                redirect: true,
                url:      '/'
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            } else {
                return res.json({
                    err:  0,
                    msg:  req.user.name + ' 登录成功',
                    user: user
                });
            }
        });
    })(req, res, next);
    
};

exports.logout = function (req, res) {
    req.logout();
    return res.json({
        err:      0,
        msg:      '退出登录',
        redirect: true,
        url:      '/'
    })
};

/**
 * 中间件: 判断是否登录
 */
exports.isLogined = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/');
    }
};


/**
 * 查看代理列表(只有管理员可以看)
 * @param req
 * @param res
 */
exports.allAgency = function (req, res) {
    var query = {role: 1};
    if(req.user.role == 0) {
        query = req.query.role ? {role: req.query.role} : {};
    } else {
        query = {parent: req.user.username};
    }
    
    User.find(query).populate('parentId')
        .exec((err, users) => {
            if (err) {
                return res.json({
                    err: 1,
                    msg: err
                });
            } else {
                return res.json({
                    err:   0,
                    users: users.filter(item => item.username != req.user.username)
                });
            }
        });
};


/**
 * 查找子代理
 * @param req
 * @param res
 */
exports.childAgency = function (req, res) {
    User.find({parentId: req.params.id}).populate('parentId')
        .exec((err, users) => {
            if (err) {
                return res.json({
                    err: 1,
                    msg: err
                });
            } else {
                console.log(users);
                return res.json({
                    err:   0,
                    users: users.filter(item => item.username != req.user.username)
                });
            }
        });
};


// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * GET: 生成验证码
 * @param req
 * @param res
 */
exports.getCaptcha = function (req, res) {
    var captcha = ccap({
        width:    180, //set width,default is 256
        height:   60,  //set height,default is 60
        offset:   40,  //set text spacing,default is 40
        quality:  60,  //set pic quality,default is 50
        fontsize: 50,  //set font size,default is 57
        generate: function () {  //Custom the function to generate captcha text
            //generate captcha text here
            var txt = '';
            for (var i = 0; i <= 3; i++) {
                txt += getRandomInt(0, 10).toString();
            }
            return txt;//return the captcha text
        }
    });
    
    var ary = captcha.get();
    var txt = ary[0];
    var buf = ary[1];
    
    req.session.captcha = txt;
    
    return res.end(buf);
};