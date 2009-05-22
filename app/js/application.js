 
var last_anchor;
var loading = false;
 
$(function() {
  setInterval("checkAnchor()", 300)
  alert("page loaded");
  get(searchTermPath());
  alert("loading")
})

var alert = function(message) {
  document.write(message)
}
 
var checkAnchor = function() {
  var current_anchor = document.location.hash; 
  if(!loading && (current_anchor != last_anchor)) {
    var term = current_anchor.substr(1, current_anchor.length);
    setSearchTerm(term);
    get("/wiki/" + term)
    alert("checkAnchor")
  }
}
 
var toolbarOptionalButton = function() {
  $.get("/app/WikipediaPage/history?ajax=true", function(data) {
    $('#history_box').html(data).show();
    $('#wrapper').hide();
    scroll(0,0);
    return 'false';
  })
}
 
var get = function(remote_path) {
  loading = true;
  $("#loading").show();
  $("#content").hide();
  url = 'http://en.m.wikitest.org:4000/' + remote_path;
  // If we already have a query string... using the index.php style links
  if(remote_path.indexOf("index.php") >= 0) {
    url = url + "&"
  } else {
    url = url + "?"
  }
  url = url + "format=json&callback=displayPage"
  aObj = new JSONscriptRequest(url);
  aObj.buildScriptTag();
  aObj.addScriptTag();
}
 
var displayPage = function(articleData) {
  $("#content").html(articleData["html"]).show();
  $("#loading").hide();
  setSearchTerm(articleData["title"]);
  
  window.location = "#" + articleData["title"];
  last_anchor = document.location.hash;
  $.get("/app/WikipediaPage/page_loaded", {title: articleData["title"]});
  $("#content a").each(function() {
    $(this).click(function() {
      var path = $(this).attr("href")
      get(path)
      return false;
    })
  })
  loading = false;
}
 
var searchTermPath = function() {
  return "/wiki/" + $('#search_term').val();
}

var setSearchTerm = function(term) {
  $("#search_term").val(decodeURIComponent(term));
}
 
var clearHistory = function() {
  $.get("/app/WikipediaPage/history?clear=true&ajax=true", function(data) {
    $('#history_box').html(data)
  })
}
 
var closeHistory = function() {
  if($('#wrapper').size() > 0) {
    $('#history_box').hide();
    $('#wrapper').show();
  } else {
    window.location = '/app/WikipediaPage';
  }
}