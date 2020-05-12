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
  var arrValueInput = [];
  var tempArray;
  var bitlyArr;
  var Bitly;



  // ---------- ON.CLICKS ----------

  if (localStorage) {
    tempArray = JSON.parse(window.localStorage.getItem("url"));
    bitlyArr = JSON.parse(window.localStorage.getItem("Bitly"));
    if (tempArray == null && bitlyArr == null) {
      var url = [];
      var bitlyShort = [];
      tempArray = [];
      bitlyArr = [];
      submitBtn();
    } else {
      url = tempArray;
      bitlyShort = bitlyArr;
      submitBtn();
    }
  }

  // submit button
  function submitBtn() {
    $(document).on("click", "#btnSubmit", function (e) {
      e.preventDefault();
      search = $("#search").val();
      $("#search").val("");
      isValidInput(search, arrValueInput);
    });
  }

  $(document).on("click", ".linkBtn", function () {
    var link = $(this).attr("data-url");
    var $textBox = $(`<input type='text' value=${link}>`);
    $("#temp").html($textBox);
    $textBox.select();
    console.log($textBox);
    document.execCommand("copy");

    $(this).removeClass("btn-secondary");
    $(this).addClass("btn-outline-success");
    $(this).text("Copied!");

    window.setTimeout(function () {
      $(".linkBtn").removeClass("btn-outline-success");
      $(".linkBtn").addClass("btn-secondary");
      $(".linkBtn").text("Copy Giphy URL");
    }, 3000);

    // console.error("error error");
    $textBox.remove();
  });

  // see more button

  // history
  $(document).on("click", ".reSearch", function () {
    oldSearch = $(this).text();
    whiteModeDark(toggleStatus);
    renderGiphyResults(oldSearch);
    renderRedditResults(oldSearch, arrReddit, arrPicture);
  });

  $("#deleteBtn").on("click", function (event) {
    event.preventDefault();
    $("#results").html("");
    $("#seeMoreAt").html("");
    $("#relevantReddit").html("");
    $("#reddit").html("");
    window.localStorage.clear();
    url = [];
  });

  $(document).on("click", ".cardGiphy", function () {

    console.log($(this));

    var icon = $(this)[0].children[0];
    icon.classList.add("yellow");
    Bitly = {

      src: $(this)[0].children[1].currentSrc,
      bit: $(this)[0].children[2].children[0].href,
    };
    url.push($(this)[0].children[1].currentSrc);
    bitlyShort.push(Bitly);

    window.localStorage.setItem("url", JSON.stringify(url));

    window.localStorage.setItem("Bitly", JSON.stringify(bitlyShort));



  });

  $("#localBtn").on("click", function (event) {
    event.preventDefault();
    $("#reddit").html("");
    $("#results").html("");
    $("#seeMoreAt").html("");
    $("#relevantReddit").html("");
    if (window.localStorage.getItem("url") && window.localStorage.getItem("Bitly")) {
      tempArray = JSON.parse(window.localStorage.getItem("url"));
      bitlyArr = JSON.parse(window.localStorage.getItem("Bitly"));
      renderLocalStorge(tempArray, bitlyArr);
    }
  });

  // ---------- FUNCTIONS ----------

  function renderLocalStorge(tempArray, bitlyArr) {
    let unique = [...new Set(tempArray)];
    let uniqueBitly = [...new Set(bitlyArr)];
    for (var i = 0; i < unique.length; i++) {
      posterURL = unique[i];
      $("#results")
        .append(`<div class="card col-sm-2 m-1" style="height: 230px">
    <img src="${posterURL}" class="card-img-top mt-3 mx-auto " style="width:150px; height:150px" />
    <a class="urltext" class="text-center smallest" href="${uniqueBitly[i].bit}">
    ${uniqueBitly[i].bit}</a>
    <div><button type="button" class="linkBtn btn btn-secondary btn-sm" data-url=${uniqueBitly[i].bit}>Copy Giphy URL</button></div>
    </div>
    </div>
  `);
    }
  }

  // input validation from user
  function isValidInput(search, arrValueInput) {
    var pattern = new RegExp(/^[a-zA-Z0-9- ]*$/);
    var hasNumber = /\d/;
    if (!arrValueInput.includes(search)) {
      if (search === "" || hasNumber.test(search) || !pattern.test(search)) {
        $("#myModal").modal();
        $("#myModal").addClass("lightMode");
      } else {
        arrValueInput.push(search.toLocaleLowerCase());
        $("#pastSearches").append(
          `<button class="reSearch btn mr-2">${search}</button>`
        );
        whiteModeDark(toggleStatus);
        renderGiphyResults(search);
        renderRedditResults(search, arrReddit, arrPicture);
        $("#reddit").html("");
      }
    } else {
      $("#myModalCheck").modal();
      $("#myModalCheck").addClass("lightMode");
    }
  }

  function renderGiphyResults(str) {
    $("#results").html("");

    $.ajax({
      type: "GET",
      url: `https://api.giphy.com/v1/gifs/search?api_key=07S9I5BCiB35dZ0afrPbtrBm9M9xMq49&q=${str}&limit=20`,
      dataType: "json",

    })
      .then(function (response) {

        for (var i = 0; i < response.data.length; i++) {
          posterURL = response.data[i].images.original.url;
          // bitlyArr.push(response.data[i].bitly_url);
          $("#results")
            .append(`<div class="card col-sm-2 m-1 cardGiphy" data-id=${i} style="height: 230px">

    }).then(function (response) {
      for (var i = 0; i < response.data.length; i++) {
        posterURL = response.data[i].images.original.url;
        $("#results")
          .append(`<div class="card col-sm-2 m-1 cardGiphy" data-id=${i} style="height: 230px">
           <i class="far fa-star icon"></i>

        <img src="${posterURL}"class="card-img-top mt-3 mx-auto" style="width:150px; height:150px" />
        <div>
          <a class="urltext" class="text-center smallest" href="${response.data[i].bitly_url}">
          ${response.data[i].bitly_url}
          </a>
          <div><button type="button" class="linkBtn btn btn-secondary btn-sm" data-url=${response.data[i].bitly_url}>Copy Giphy URL</button></div>
        </div>
        </div>
      </>`);
      }
    });

    $("#search").val("");
  }

  function renderRedditResults(str, arrReddit, arrPicture) {
    // ----------------------------------------------------------------------------//
    var input = myTrim(str);
    arrReddit = [];
    arrPicture = [];
    $("#reddit").html("");
    $.ajax({
      type: "GET",
      url: `https://www.reddit.com/r/${input}/.json`,
      dataType: "json",
    })
      .then(function (res) {
        for (var i = 0; i < res.data.children.length; i++) {
          data = res.data.children[i].data;
          var Reddit = {
            datalink: "http://www.reddit.com/" + data.permalink,
            title: data.title,
            subreddit: data.subreddit,
            author: data.author,
          };
          arrReddit.push(Reddit);
        }

        $.ajax({
          type: "GET",
          url: `https://www.reddit.com/r/pics/search.json?q=${input}&restrict_sr=on&include_over_18=on&sort=relevance&t=all`,
          dataType: "json",
        }).then(function (res) {
          for (var i = 0; i < res.data.children.length; i++) {
            arrPicture.push(res.data.children[i].data.thumbnail);
          }

          randomPictureAndComments(arrPicture, arrReddit);
        });
        // adding catch error from GET request
      })
      .catch(function (res) {
        $("#relevantReddit").text(
          res.responseJSON.message +
            " " +
            res.responseJSON.cod +
            " Error from GET Response Reddit"
        );
        $("#seeMoreAt").html("");
      });
    $("#relevantReddit").text(`Some relevant stuff on Reddit:`);
    $("#seeMoreAt").html(`See more at <a id="subredditLink" href=""></a>`);
  }

  // function deleting white spaeces for Reddit GET request
  function myTrim(str) {
    return str.replace(/\s/g, "");
  }

  function randomPictureAndComments(arrPicture, arrReddit) {
    $("#reddit").html("");
    for (var i = 0; i < 4; i++) {
      var x = Math.floor(Math.random() * arrPicture.length);
      var y = Math.floor(Math.random() * arrReddit.length);
      $("#reddit").append(`
        <div class="card">
          <img src="${arrPicture[x]}"
            class="card-img-top mt-3 mx-3" alt="Picture not found" style="width: auto">
          <div class="card-body">
          <a href="${arrReddit[y].datalink}" class="font-weight-bold" style="text-decoration:underline">${arrReddit[y].title}</a>
            <p class="card-text font-weight-bold text-dark">By: ${arrReddit[y].author}</p>
          </div>
        </div>`);
      $("#subredditLink").attr(
        "href",
        `http://reddit.com/r/${arrReddit[y].subreddit}`
      );
      $("#subredditLink").text(`r/${arrReddit[y].subreddit}`);
    }
  }

  //function adding style to Modal
  function modalSetClassDarkLightMode(toggleStatus) {
    toggleStatus = toggleDisplay.getAttribute("class");

    if (toggleStatus === "toggle toggleFalse") {
      toggleDisplay.setAttribute("class", "toggle toggleTrue");
      $("#myModal").addClass("darkMode");
    } else {
      toggleDisplay.setAttribute("class", "toggle toggleFalse");
      $("#myModal").addClass("lightMode");
    }
  }

  // function - white dark mode
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
