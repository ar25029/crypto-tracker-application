// api request options
const options = {
  method: "GET",
  mode: "no-cors",
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
  currentPage = currentPage - 1;
  await fetchCoins(currentPage);
  renderCoins(coins, currentPage, 25);
  updatePaginationControls();
  selectedPageNo.textContent = `${currentPage}`;
};

// handle next button
const handleNextButtonClick = async () => {
  currentPage = currentPage + 1;
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
  // nextBtn.disabled = coins.length < 25;
};
document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  updatePaginationControls();
  selectedPageNo.textContent = `${currentPage}`;
});

preBtn.addEventListener("click", handlePreButtonClick);
nextBtn.addEventListener("click", handleNextButtonClick);
