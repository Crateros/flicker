$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
    $("#success-alert").slideUp(500);
});

$("#danger-aler").fadeTo(2000, 500).slideUp(500, function(){
    $("#danger-alert").slideUp(500);
});

$(".saveMovieBtn").click(function() {
    console.log("I was clicked!");
    $(this .glyphicon).addClass('glyphicon-ok').removeClass('glyphicon-plus');
    $(this).addClass('btn-success').removeClass('btn-primary');
});
