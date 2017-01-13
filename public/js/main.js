$( document ).ready(function(){


  //AJAX to edit watched status (PUT)
  // $(".editBtn").on('submit', function(e){
  //   e.preventDefault();
  //   console.log("Edit submit just got clicked...");
  //   var id = $(this).data('movieId');
  //
  //   $.ajax({
  //     method: 'PUT',
  //     url: '/edit/' + id;,
  //   }).done(function(data){
  //     console.log(data);
  //     window.location = '/user/profile';
  //   })
  // });


  $(".flexboxChild").hover(
    function() {
    $(this).find(".innerBox").css("visibility", "visible")
    console.log($(this));
  }, function() {
    $(this).find(".innerBox").css("visibility", "hidden")
  }
  );

});
