var indexPage = (function($){

    var queryPosts;


    $(function(){




    });


    queryPosts = function(keyword) {

        $.get('/post-index.json', null, function(d){
            if(d && d.data){

                console.log(d.data);
            }

        });

    }






})(jQuery);


