// api request options
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
  },
};

// show shimmer effect during loading
const showShimmer = () => {
  document.querySelector(".shimmer-container").style.display = "flex";
};

// hide shimmer effect after loading
const hideShimmer = () => {
  document.querySelector(".shimmer-container").style.display = "none";
};

// state variable
let coins = [];
let currentPage = 1;

// initalize the page
const initializePage = async () => {
  await fetchCoins(currentPage);
  renderCoins(coins, currentPage, 25);
  // updatePaginationControls();
};

// fetch coin from api
const fetchCoins = async (page = 1) => {
  try {
    showShimmer();
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}`,
      options
    );
    coins = await response.json();
  } catch (err) {
    console.log(err);
  } finally {
    hideShimmer();
  }
  return coins;
};

function renderCoins(coinsToDisplay, page, itemPerPage) {
  const start = (page - 1) * itemPerPage + 1;
  const tableBody = document.querySelector("#crypto-table tbody");
  tableBody.innerHTML = ``;

  coinsToDisplay.forEach((coin, index) => {
    const row = renderCoinRow(coin, index, start);
    tableBody.appendChild(row);
  });
}

const renderCoinRow = (coin, index, start) => {
  const isFavorite = false;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${start + index}</td>
    <td><img src = ${coin.image} alt=${coin.name} width="24" height="24" /></td>
    <td>${coin.name}</td>
    <td>$${coin.current_price.toLocaleString()}</td>
    <td>$${coin.total_volume.toLocaleString()}</td>
    <td>$${coin.market_cap.toLocaleString()}</td>
    <td>
    <i class="fas fa-star favorite-icon ${
      isFavorite ? "favorite" : ""
    }" data-id="${coin.id}"></i>
    </td>
  `;
  return row;
};

// handle previous button
const handlePreButtonClick = async () => {
  if (currentPage > 1) {
    currentPage--;
    await fetchCoins(currentPage);
    renderCoins(coins, currentPage, 25);
    updatePaginationControls();
    selectedPageNo.textContent = `${currentPage}`;
  }
};

// handle next button
const handleNextButtonClick = async () => {
  currentPage++;
  await fetchCoins(currentPage);
  renderCoins(coins, currentPage, 25);
  updatePaginationControls();
  selectedPageNo.textContent = `${currentPage}`;
};

const preBtn = document.querySelector(".pre-btn");
const nextBtn = document.querySelector(".next-btn");
const selectedPageNo = document.querySelector(".selected-page");

const updatePaginationControls = () => {
  preBtn.disabled = currentPage === 1;
  preBtn.style.backgroundColor = `${currentPage === 1 ? "grey" : ""}`;
  // nextBtn.disabled = coins.length < 25;
};
document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  updatePaginationControls();
  selectedPageNo.textContent = `${currentPage}`;
});

preBtn.addEventListener("click", handlePreButtonClick);
nextBtn.addEventListener("click", handleNextButtonClick);

// this theree function is just an example already created a single function for all three
// const sortCoinByPrice = (order) => {
//   coins.sort((a, b) => {
//     order === "asc"
//       ? a.current_price - b.current_price
//       : b.current_price - a.current_price;
//   });
//   renderCoins(coins, currentPage, 25);
// };
// const sortCoinByVolume = (order) => {
//   coins.sort((a, b) => {
//     order === "asc"
//       ? a.total_volume - b.total_volume
//       : b.total_volume - a.total_volume;
//   });
//   renderCoins(coins, currentPage, 25);
// };
// const sortCoinByMarket = (order) => {
//   coins.sort((a, b) => {
//     order === "asc" ? a.market_cap - b.market_cap : b.market_cap - a.market_cap;
//   });
//   renderCoins(coins, currentPage, 25);
// };

// instead of creating separate function for sorting we created generic function for all
const sortCoinByField = (field, order) => {
  coins.sort((a, b) =>
    order === "asc" ? a[field] - b[field] : b[field] - a[field]
  );
  renderCoins(coins, currentPage, 25);
};

document
  .querySelector("#sort-price-asc")
  .addEventListener("click", () => sortCoinByField("current_price", "asc"));
document
  .querySelector("#sort-price-dsc")
  .addEventListener("click", () => sortCoinByField("current_price", "dsc"));
document
  .querySelector("#sort-volume-asc")
  .addEventListener("click", () => sortCoinByField("total_volume", "asc"));
document
  .querySelector("#sort-volume-dsc")
  .addEventListener("click", () => sortCoinByField("total_volume", "dsc"));
document
  .querySelector("#sort-market-asc")
  .addEventListener("click", () => sortCoinByField("market_cap", "asc"));
document
  .querySelector("#sort-market-dsc")
  .addEventListener("click", () => sortCoinByField("market_cap", "dsc"));
