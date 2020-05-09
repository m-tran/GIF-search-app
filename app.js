$(document).ready(function () {
  // ---------- VARIABLES ----------

  var search = "";
  var posterURL = "";
  var oldSearch = "";
  // add---------------------------------------
  var arrReddit;
  var arrPicture;
  var data;
  var toggleStatus;
  // ---------- ON.CLICKS ----------

  // submit button
  $(document).on("click", "#btnSubmit", function (e) {
    e.preventDefault();
    search = $("#search").val();
    $("#pastSearches").append(
      `<button class="reSearch btn">${search}</button>`
    );


    whiteModeDark(toggleStatus);
    $("#reddit").html("");
    renderGiphyResults(search);
    renderRedditResults(search, arrReddit, arrPicture);
  });

  // see more button

  // history
  $(document).on("click", ".reSearch", function () {
    oldSearch = $(this).text();
    whiteModeDark(toggleStatus);
    renderGiphyResults(oldSearch);
    renderRedditResults(oldSearch, arrReddit, arrPicture);
  });

  // ---------- FUNCTIONS ----------

  function renderGiphyResults(str) {
    $("#results").html("");

    $.ajax({
      type: "GET",
      url: `https://api.giphy.com/v1/gifs/search?api_key=07S9I5BCiB35dZ0afrPbtrBm9M9xMq49&q=${str}&limit=20`,
      dataType: "json",
    }).then(function (response) {
      for (var i = 0; i < response.data.length; i++) {
        posterURL = response.data[i].images.original.url;
        $("#results")
          .append(`<div class="card col-sm-2 m-1" style="height: 230px">
        <img src="${posterURL}" class="card-img-top mt-3 mx-auto" style="width:150px; height:150px" />
        <div>
          <a class="urltext" class="text-center smallest" href="${response.data[i].bitly_url}">
            ${response.data[i].bitly_url}
          </a>
        </div>
      </div>`);
      }
      // adding catch error from GET request
    }).catch(function (res) {

      $("#myModal").modal();

    });

    $("#search").val("");
  }

  function renderRedditResults(str, arrReddit, arrReddit) {
    // ----------------------------------------------------------------------------//
    var input = myTrim(str);
    arrReddit = [];
    arrPicture = [];
    $("#reddit").html("");
    $.ajax({

      type: "GET",
      url: `https://www.reddit.com/r/${input}/.json`,
      dataType: "json"

    }).then(function (res) {

      for (var i = 0; i < res.data.children.length; i++) {
        data = res.data.children[i].data
        var Reddit = {
          datalink: 'http://www.reddit.com/' + data.permalink,
          title: data.title,
          subreddit: data.subreddit,
          author: data.author
        };
        arrReddit.push(Reddit);

      }

      $.ajax({

        type: "GET",
        url: `https://www.reddit.com/r/pics/search.json?q=${input}&restrict_sr=on&include_over_18=on&sort=relevance&t=all`,
        dataType: "json"


      }).then(function (res) {

        for (var i = 0; i < res.data.children.length; i++) {

          arrPicture.push(res.data.children[i].data.thumbnail);
        }

        randomPictureAndComments(arrPicture, arrReddit);

      });
      // adding catch error from GET request
    }).catch(function (res) {

      $("#myModal").modal();

    });


  }

  // function deleting white spaeces for Reddit GET request
  function myTrim(str) {

    return str.replace(/\s/g, '');

  }

  function randomPictureAndComments(arrPicture, arrReddit) {

    for (var i = 0; i < 4; i++) {

      var x = Math.floor((Math.random() * arrPicture.length));
      var y = Math.floor((Math.random() * arrReddit.length));
      $("#reddit").append(`
        <div class="card">
          <img src="${arrPicture[x]}"
           class="card-img-top" alt="Picture not found" id="img">
          <div class="card-body">
            <p class="card-title font-weight-bold text-dark">Title:</br> ${arrReddit[y].title}</p>
            <p class="card-text font-weight-bold text-dark">Subreddit:</br>${arrReddit[y].subreddit}</p>
            <p class="card-text font-weight-bold text-dark">Author:</br> ${arrReddit[y].author}</p>
            <a href="${arrReddit[y].datalink}" class="font-weight-bold" style="text-decoration:underline ;
          }">
            Link Post</p>
          </div>
        </div>
      
          `)

    }

  }

  function whiteModeDark(toggleStatus) {

    toggleStatus = toggleDisplay.getAttribute("class");
    if (toggleStatus === "toggle toggleFalse") {

      toggleDisplay.setAttribute("class", " toggle toggleTrue");
      document.body.setAttribute("class", "darkMode");


    } else {

      toggleDisplay.setAttribute("class", "toggle toggleFalse");
      document.body.setAttribute("class", "lightMode");

    }
  }


  // ------------------------------------------------------------------------------------------------------------------------//

});












// $.ajax({
//   type: "GET",
//   url: `https://www.reddit.com/r/${str}/.json`,
//   dataType: "json",
// }).then(function (res) {
//   console.log(res);
//   console.log(res.data.children[0].data);
//   $("body").append(`<p>${res.data.children[0].data}</p>`);
// });