 
var last_anchor;
var loading = false;
 
$(function() {
  // The basic logic here is that if we are loading for the first (startup)
  // the the controller has populated the search field with where we should start...
  // we won't have a hash-location yet. But, if we are refreshing or going back/forward
  // then we will have a hash-location
  if(document.location.hash == "") {
    get(searchTermPath());
  } else {
    checkAnchor();
  }

  setInterval("checkAnchor()", 400)
  
  $("#clear_box")
    .click(function() {
      $("#search_term")
        .val("")
        .focus();
    });
})

var checkAnchor = function() {
  var current_anchor = document.location.hash; 
  if(!loading && (current_anchor != last_anchor)) {
    var term = current_anchor.substr(1, current_anchor.length);
    setSearchTerm(term);
    get("/wiki/" + term)
  }
}

 
var get = function(remote_path) {
  loading = true;
  $('#search_term').blur();

  // Strip out anchors in the URL, we can deal with these later.
  if(remote_path.indexOf("#") > 0) {
    remote_path = remote_path.substr(0, remote_path.indexOf("#"))
  }
  
  url = 'http://en.m.wikipedia.org' + remote_path;
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
  scroll(0,0);
  $("#loading").show();
  $("#content").hide();
  closeHistory();
}

var href;
var displayPage = function(articleData) {
  $("#content").html(articleData["html"]).show();
  $("#loading").hide();
  setSearchTerm(articleData["title"]);
  window.location = "#" + articleData["title"];
  last_anchor = document.location.hash;
  $.get("/app/WikipediaPage/page_loaded", {title: articleData["title"]});
  $("#content a").each(function() {
    $(this).click(function() {
      href = $(this).attr("href");
      if($(this).attr("href").indexOf("http://") == 0) {
        return true;
      } else {
        var path = $(this).attr("href")
        get(path) 
        return false;
      }
    })
  })
  activateButtons();
  loading = false;
}

var shouldOpenURLOnPhone = function(url) {
  return !((url.indexOf("localhost") > 0) || (url.indexOf("m.wikipedia.org") > 0))
}
 
var searchTermPath = function() {
  return "/wiki/" + $('#search_term').val();
}

var setSearchTerm = function(term) {
  $("#search_term").val(decodeURIComponent(term));
}

var showHistory = function() {
  $.get("/app/WikipediaPage/history?ajax=true", function(data) {
    $('#history_box').html(data)
    // We have to URI decode the listed links before we show it.
    $('#history_box li a').each(function() {
      $(this).html(decodeURIComponent($(this).html()))
    })
    $('#history_box').show();
    $('#wrapper').hide();
    scroll(0,0);
    return 'false';
  })
}

// This is the method that actually gets called, but we alias it.
var toolbarOptionalButton = showHistory;
 
var toolbarGoHome = function() {
  get("/wiki/::Home");
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

var activateButtons = function() {
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
};