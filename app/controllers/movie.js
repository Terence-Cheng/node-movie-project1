var Movie = require('../models/movie.js'),
    _ = require('underscore'),
    Comment = require('../models/comment.js');
// detail page
exports.detail = function (req, res) {
    var id = req.params.id;
    Movie.findById(id ,function (err, movie) {
        Comment
            .find({movie: id})
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comments) {
                console.log('comments' + comments);
                if (err) {
                    console.log(err);
                }
                res.render('detail', {
                    title: 'movie 详情' + movie.title,
                    movie: movie,
                    comments: comments
                });
            })

    });

}
// app.get('/movie/:id', );

// admin 录入 page
exports.new = function (req, res) {
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
}
// app.get('/admin/movie', );

// admin update movie page
exports.update = function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
}
// app.get('/admin/update/:id', )

// admin list page
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) console.log(err);
        res.render('list', {
            title: 'movie 列表页',
            movies: movies
        });
    })
}
// app.get('/admin/list', );

// admin post 接口  新增or 修改 电影请求接口
exports.save = function (req, res) {
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

}
// app.post('/admin/movie/new', )

// list delete movie 接口
exports.delete = function (req, res) {
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
}
// app.delete('/admin/control/delete', )