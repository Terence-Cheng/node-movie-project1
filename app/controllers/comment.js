var Comment = require('../models/comment.js');

exports.save = function (req, res) {
    var _comment = req.body.comment,
        movieId = _comment.movie,
        comment = new Comment(_comment);

    // if reply
    if (_comment.cid) {
        Comment.findById(_comment.cid, function (err, comment) {
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }
            comment.reply.push(reply); // add the reply

            comment.save(function (err, comment) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movieId);
            })
        })
    } else {
        /*The down code is diffrent from the video,because the lecture put it in the else branch,and
         copy it in the if branch. I think this is the repeat work.*/
        //I make a error,because the comment varible is diffrent in the two branches
        comment.save(function (err, comment) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movieId);
        })
    }


}