var User = require('../models/user.js');
// signup 注册
exports.signup = function(req, res) {
    // 路由里面的参数 /:userid          req.params.userid
    // 请求体里面的参数 {userid: 1234}  req.body.userid
    // 查询参数 ?userid = 1234         req.query.userid
    // req.param('userid') 会按照前面三个的优先级来获取
    var _user = req.body.user; //req.param('user')同样可以取到
    console.log(_user); // bodyParser将其转换为对象

    User.findOne({name: _user.name}, function(err, user) {
        if (err) console.log(err);
        if (user) {
            return res.redirect('/signin'); // 相当于当前的location.host
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) console.log(err);
                console.log(user);
                res.redirect('/admin/userlist');
            });
        }
    })
}
// app.post('/user/signup', )

// signin
exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name:name}, function(err, user) {
        if (err) console.log(err);

        if (!user) {
            return res.redirect('/signup');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) console.log(err);

            if(isMatch) {
                console.log('password is matched');
                req.session.user = user;
                return res.redirect('/');
            } else {
                console.log('password is not matched');
                return res.redirect('/signup');
            }
        })

    })
}
// app.post('/user/signin', )

// logout
exports.logout = function (req, res) {
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
}
// app.get('/logout', )

exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err) console.log(err);
        res.render('userlist', {
            title: '电影-用户列表',
            users: users
        })
    })
}

exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录'
    })
}

exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册'
    })
}

// middle ware
exports.signinRequired = function (req, res, next) {
    var user = req.session.user;
    if (!user) {
        console.log('没有登录');
        return res.redirect('/signin');
    }
    next();
}

exports.adminRequired = function (req, res, next) {
    var user = req.session.user;
    if (user.role <= 10) {
        console.log('权限不足');
        return res.redirect('/signin');
    }
    next();
}