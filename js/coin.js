// https://api.coingecko.com/api/v3/coins/${coinId}
// https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const coinId = urlParams.get("id");
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
    },
  };

  const coinContainer = document.getElementById("coin-container");
  const shimmerContainer = document.querySelector("shimmer-container");
  const coinImage = document.getElementById("coin-image");
  const coinName = document.getElementById("coin-name");
  const coinDescription = document.getElementById("coin-description");
  const coinRank = document.getElementById("coin-rank");
  const coinPrice = document.getElementById("coin-price");
  const coinMarketCap = document.getElementById("coin-market-cap");
  const addfavBtn = document.querySelector(".add-to-fav-btn");

  const h24 = document.getElementById("24h");
  const d30 = document.getElementById("30d");
  const m3 = document.getElementById("3m");

  // show shimmer effect during loading
  const showShimmer = () => {
    shimmerContainer.style.display = "flex";
    // coinContainer.style.display = "none";
  };

  // hide shimmer effect after loading
  const hideShimmer = () => {
    // coinContainer.style.display = "flex";
    shimmerContainer.style.display = "none";
  };

  async function fetchCoinData() {
    try {
      showShimmer();
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        options
      );
      const data = await response.json();
      displayCoinData(data);
    } catch (error) {
      console.log(error);
    } finally {
      hideShimmer();
    }
  }

  function displayCoinData(coin) {
    coinImage.src = coin.image.large;
    coinImage.alt = coin.name;
    coinName.textContent = coin.name;
    coinDescription.textContent = coin.description.en.split(". ")[0] + ".";
    coinRank.textContent = coin.market_cap_rank;
    coinPrice.textContent = coin.market_data.current_price.usd.toLocaleString();
    coinMarketCap.textContent =
      coin.market_data.market_cap.usd.toLocaleString();

    const favorites = [];
    if (favorites.includes(coinId)) {
      addfavBtn.textContent = "Remove from Favorite";
    } else {
      addfavBtn.textContent = "Add To Favorite";
    }
  }

  await fetchCoinData();
});
