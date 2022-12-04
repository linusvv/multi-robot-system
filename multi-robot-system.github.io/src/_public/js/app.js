///--------------------------------- Ancient piece of Code --> Not necessary -------------------

let data = {};
function getData(type, x, y) {
  let start_value;
  let exchange_value;
  let final_value;

  if (type == 0) {
    localStorage.setItem("start_value", x + y);
  } else if (type == 1) {
    localStorage.setItem("exchange_value", x + y);
  } else if (type == 2) {
    localStorage.setItem("final_value", x + y);
  } else {
    console.log("nope");
  }

  if (
    localStorage.getItem("start_value") != null &&
    localStorage.getItem("exchange_value") != null &&
    localStorage.getItem("final_value") != null
  ) {
    start_value = localStorage.getItem("start_value");
    exchange_value = localStorage.getItem("exchange_value");
    final_value = localStorage.getItem("final_value");
    data = { start_value, exchange_value, final_value };
    console.log(data);
    localStorage.clear();
  }

  return true;
}

async function submitFunction(e) {
  e.preventDefault();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch("/api", options);
  const jsonRes = await response.json();
  console.log(jsonRes);
  return false;
}
