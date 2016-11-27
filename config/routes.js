var Index = require('../app/controllers/index.js'),
    User = require('../app/controllers/user.js'),
    Movie = require('../app/controllers/movie.js'),
    Comment = require('../app/controllers/comment.js');

module.exports = function (app) {
    app.use(function (req, res, next) {
        var _user = req.session.user;
        //挂到locals上面，就是程序的本地变量，可以在页面访问到
        app.locals.user = _user;
        next();
    })

    // index
    app.get('/', Index.index);

    // user
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
    app.get('/logout', User.logout);

    // movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
    app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.save);
    app.delete('/admin/movie/delete', User.signinRequired, User.adminRequired, Movie.delete);

    // comment
    app.post('/user/comment', User.signinRequired, Comment.save);

}