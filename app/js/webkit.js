$(function() {
  var buttons = document.getElementsByTagName("button");
  for (i in buttons) {
    var button = buttons[i];
    if(button.className =="section_heading show"){
      button.addEventListener("click", function(e) {
        var section_id = this.getAttribute("section_id");
        document.getElementById("content_" + section_id).style.display = "";
        this.style.display = "none";
        this.nextSibling.style.display = "";
      }, false);
    } else if(button.className =="section_heading hide"){
      button.addEventListener("click", function(e) {
        var section_id = this.getAttribute("section_id");
        document.getElementById("content_" + section_id).style.display = "none";
        this.style.display = "none"; 
        this.previousSibling.style.display = "";
      }, false);
    }
  }
});