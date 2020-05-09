$(document).ready(function () {
  // ---------- VARIABLES ----------

  var search = "";
  var title = "";
  var posterURL = "";
  var oldSearch = "";

  // ---------- ON.CLICKS ----------

  // submit button
  $(document).on("click", "#btnSubmit", function (e) {
    e.preventDefault();
    search = $("#search").val();
    $("#pastSearches").append(
      `<button class="reSearch btn">${search}</button>`
    );
    renderGiphyResults(search);
    renderRedditResults(search);
  });

  // see more button

  // history
  $(document).on("click", ".reSearch", function () {
    oldSearch = $(this).text();
    renderGiphyResults(oldSearch);
    renderRedditResults(search);
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
    });
    $("#search").val("");
  }

  function renderRedditResults(str) {
    $.ajax({
      type: "GET",
      url: `https://www.reddit.com/r/${str}/.json`,
      dataType: "json",
    }).then(function (res) {
      console.log(res);
      console.log(res.data.children[0].data);
      $("body").append(`<p>${res.data.children[0].data}</p>`);
    });
  }
});

//Good job keep it up. Stay coding.
