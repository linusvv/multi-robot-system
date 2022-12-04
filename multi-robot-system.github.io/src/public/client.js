//client side Javascript code for the three selection Pages --> Additional Client JS Code is implemented in HTML-Files

//alert("Client-side code running");
const button = document.getElementById("A");
const button2 = document.getElementById("B");
const button3 = document.getElementById("C");
const button4 = document.getElementById("D");

// ----------------------------------------------------------------   [A]

button.addEventListener("click", function (e) {
  //alert("button was clicked");

  button.style.backgroundColor = "#2366b1";
  button2.style.backgroundColor = "#555";
  button3.style.backgroundColor = "#555";
  button4.style.backgroundColor = "#555";

  document.getElementById("inf").innerHTML = "333, 316";

  fetch("/clicked", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: String(window.location.href),
      button: String(button.id),
    }),
  })
    .then(function (response) {
      if (response.ok) {
        //alert("click was recorded");
        return;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      alert(error);
    });
});
// ----------------------------------------------------------------   [B]

button2.addEventListener("click", function (e) {
  //alert("button was clicked");

  button2.style.backgroundColor = "#2366b1";
  button.style.backgroundColor = "#555";
  button3.style.backgroundColor = "#555";
  button4.style.backgroundColor = "#555";

  document.getElementById("inf").innerHTML = "344, 543";

  fetch("/clicked", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: String(window.location.href),
      button: String(button2.id),
    }),
  })
    .then(function (response) {
      if (response.ok) {
        //alert("click was recorded");
        return;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      alert(error);
    });
});
// ----------------------------------------------------------------   [C]

button3.addEventListener("click", function (e) {
  //alert("button was clicked");

  button3.style.backgroundColor = "#2366b1";
  button2.style.backgroundColor = "#555";
  button.style.backgroundColor = "#555";
  button4.style.backgroundColor = "#555";

  document.getElementById("inf").innerHTML = "473, 755";

  fetch("/clicked", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: String(window.location.href),
      button: String(button3.id),
    }),
  })
    .then(function (response) {
      if (response.ok) {
        //alert("click was recorded");
        return;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      alert(error);
    });
});
// ----------------------------------------------------------------   [D]

button4.addEventListener("click", function (e) {
  //alert("button was clicked");

  button4.style.backgroundColor = "#2366b1";
  button2.style.backgroundColor = "#555";
  button3.style.backgroundColor = "#555";
  button.style.backgroundColor = "#555";

  document.getElementById("inf").innerHTML = "532, 687";

  fetch("/clicked", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: String(window.location.href),
      button: String(button4.id),
    }),
  })
    .then(function (response) {
      if (response.ok) {
        //alert("click was recorded");
        return;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      alert(error);
    });
});

//----------------------------------------------------------------------------------------[reset]

//============================================================================================ [get Points]
//-------------------------------------------------------------------------------------------- [start]
setInterval(function () {
  //console.log("hi")

  fetch("/istart", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      if (response.ok) return response.json();
      throw new Error("Request failed.");
    })
    .then(function (data) {
      console.log(data);
      if (data != undefined) {
        document.getElementById("istart").innerHTML = `Start: ${data}`;
      }
    })
    .catch(function (error) {
      alert(error);
    });
}, 100);

setInterval(function () {
  //alert("hello");
  fetch("/iexchange", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      if (response.ok) return response.json();
      throw new Error("Request failed.");
    })
    .then(function (data) {
      if (data != undefined) {
        document.getElementById("iexchange").innerHTML = `Exchange: ${data}`;
        console.log("iexchange");
      }
    })
    .catch(function (error) {
      alert(error);
    });
}, 100);

setInterval(function () {
  //alert("hello");
  fetch("/iend", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      if (response.ok) return response.json();
      throw new Error("Request failed.");
    })
    .then(function (data) {
      if (data != undefined) {
        document.getElementById("iend").innerHTML = `End: ${data}`;
      }
      //alert(data.LOC);
    })
    .catch(function (error) {
      alert(error);
    });
}, 100);
