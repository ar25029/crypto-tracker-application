let coin = [];
let currPage = 1;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
  },
};

const getFavorite = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

const fetchFavoriteCoins = async (ids) => {
  try {
    showShimmer();
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(
        ","
      )}&page=1`,
      options
    );
    const fetchCoins = await response.json();
    hideShimmer();
    return fetchCoins;
  } catch (err) {
    console.log(err);
    hideShimmer();
  }
};

const renderFavorites = (coins) => {
  const tableBody = document.querySelector("#favorite-table tbody");
  const noFavMessage = document.querySelector("#no-favorites");
  tableBody.innerHTML = "";
  if (coins.length === 0) {
    noFavMessage.style.display = "block";
    return;
  } else {
    noFavMessage.style.display = "none";
  }

  coins.forEach((coin, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${idx + 1}</td>
          <td><img src="${coin.image}" alt="${
      coin.name
    }" width="24" height="24" /></td>
          <td>${coin.name}</td>
          <td>${coin.current_price.toLocaleString()}</td>
          <td>${coin.total_volume.toLocaleString()}</td>
            <td>${coin.market_cap.toLocaleString()}</td>
    `;

    row.addEventListener("click", () => {
      window.location.href = `coin.html?id=${coin.id}`;
    });
    tableBody.appendChild(row);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const favorites = getFavorite();

  if (favorites.length == 0) {
    renderFavorites([]);
  } else {
    coin = await fetchFavoriteCoins(favorites);
    renderFavorites(coin);
  }
});
