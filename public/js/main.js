$( document ).ready(function(){

  //AJAX request to delete pokemon from favorites
  // $(".deleteBtn").on('click', function(e){
  //   e.preventDefault();
  //   console.log("you deleted a movie!");
  //   var element = $(this);
  //   var url = element.attr('href');
  //
  //   $.ajax({
  //     method: 'DELETE',
  //     url: url
  //     }).done(function(data){
  //       console.log("this is data that got deleted, sad:", data);
  //       window.location = '/user/profile';
  //     });
  //   });


  //AJAX to edit article (PUT)
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
