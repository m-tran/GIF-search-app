$(document).ready(function () {
  // ---------- VARIABLES ----------

  var search = "";
  var title = "";
  var posterURL = "";
  var date = "";
  var recent = "";
  var imdbID = "";
  var oldSearch = "";

  // ---------- ON.CLICKS ----------

  // submit button
  $(document).on("click", "#btnSubmit", function (e) {
    e.preventDefault();
    search = $("#search").val();
    $("#pastSearches").append(
      `<button class="reSearch btn">${search}</button>`
    );
    renderResults(search);
  });

  // see more button

  // history
  $(document).on("click", ".reSearch", function () {
    oldSearch = $(this).text();
    renderResults(oldSearch);
  });

  // ---------- FUNCTIONS ----------

  function renderResults(str) {
    $("#results").html("");

    $.ajax({
      type: "GET",
      url: `http://www.omdbapi.com/?i=tt3896198&apikey=fe8b2a76&s=${str}&type=movie`,
      dataType: "json",
    }).then(function (response) {
      console.log(response);
      for (var i = 0; i < response.Search.length; i++) {
        title = response.Search[i].Title;
        posterURL = response.Search[i].Poster;
        date = response.Search[i].Year;
        imdbID = response.Search[i].imdbID;
        if (date < 2010) {
          recent = "classic";
        } else {
          recent = "recent";
        }
        $("#results")
          .append(`<div class="card col-sm-3 m-1" style="width: 18rem;">
        <img src="${posterURL}" class="card-img-top mt-3" style="width:auto; height:400px" />
        <div class="card-body">
        <div style="height:80px">
          <p class="card-text">
            <strong>Title:</strong> ${title} <br/>
            <strong>Release date:</strong> ${date + " - " + recent}
          </p>
          </div>
          <button id="${imdbID}" class="btn btn-primary">See More Info</button>
        </div>
      </div>`);
      }
    });
    $("#search").val("");
  }
});
