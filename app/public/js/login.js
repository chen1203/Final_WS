/**
 * Created by Tom on 06/07/2015.
 */
$("#loginButton").change(function(){
    readURL(this);
});

$("#loginSectionButton").click(function () {
    $("#loginButton").trigger('click');
});