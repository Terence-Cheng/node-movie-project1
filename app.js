var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('underscore');
var routes = require('./routes/index');
var users = require('./routes/users');

var session = require('express-session');
var port = process.env.PORT || 3000;
var app = express();
app.locals.moment = require('moment');

app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true
}))

// Models
var Movie = require('./models/movie.js');
var User = require('./models/user.js');

mongoose.connect('mongodb://localhost/immoc');

// view engine setup
app.set('views', path.join(__dirname, './views/pages'));
app.set('view engine', 'jade');
app.listen(port);
console.log('movie nodejs started on port: ' + port);

// static file path
app.use(express.static(path.join(__dirname, 'public')));

// form data seralize
app.use(bodyParser());

// routes
// index page
app.get('/', function (req, res) {
    console.log('user in session');
    console.log(req.session.user);
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'movie 首页',
            movies: movies
        });
    })
});

// signup
app.post('/user/signup', function(req, res) {
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
})

// signin
app.post('/user/signin', function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name:name}, function(err, user) {
        if (err) console.log(err);

        if (!user) {
            return res.redirect('/');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) console.log(err);

            if(isMatch) {
                console.log('password is matched');
                req.session.user = user;
                return res.redirect('/');
            } else {
                console.log('password is not matched');
            }
        })

    })
})

app.get('/admin/userlist', function(req, res) {
    User.fetch(function(err, users) {
        if (err) console.log(err);
        res.render('userlist', {
            title: '电影-用户列表',
            users: users
        })
    })
})

// detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;
    Movie.findById(id ,function (err, movie) {
        if (err) {
            console.log(err);
        }
        res.render('detail', {
            title: 'movie 详情' + movie.title,
            movie: movie
        });
    });

});

// admin 录入 page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: 'movie 后台录入页',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
});

// admin update movie page
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
})

// admin list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) console.log(err);
        res.render('list', {
            title: 'movie 列表页',
            movies: movies
        });
    })
});

// admin post 接口  新增or 修改 电影请求接口
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }

})

// list delete movie 接口
app.delete('/admin/control/delete', function (req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: true});
            }
        })
    }
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/*app.use(logger('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));

 app.use('/', routes);
 app.use('/users', users);*/

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
 });*/

// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
 message: err.message,
 error: err
 });
 });
 }*/

// production error handler
// no stacktraces leaked to user
/*
 app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
 message: err.message,
 error: {}
 });
 });
 */


module.exports = app;
