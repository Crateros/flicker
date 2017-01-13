$( document ).ready(function(){

  $(".flexboxChild").hover(
    function() {
    $(this).find(".innerBox").css("visibility", "visible")
  }, function() {
    $(this).find(".innerBox").css("visibility", "hidden")
  }
  );

$('#editBtn').click(function() {
  $(this).find('#checkmark').css("visibility", "visible")
});






});
