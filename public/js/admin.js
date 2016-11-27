$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE',
            url: '/admin/movie/delete?id=' + id,
            dataType: 'json',
            success:function (results) {
                if (results.success) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            },
            error: function (err) {
                console.log(err);
            }
        });

    });
});