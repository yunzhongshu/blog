var indexPage = (function($){

    var queryPosts;


    $(function(){


        $('pre').addClass('prettyprint');
        prettyPrint();

        $('table').each(function(){
           $(this).addClass('table');
        });

    });


    queryPosts = function(keyword) {

        $.get('/post-index.json', null, function(d){
            if(d && d.data){

                console.log(d.data);
            }

        });

    }






})(jQuery);


