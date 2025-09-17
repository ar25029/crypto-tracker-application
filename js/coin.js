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

  const shimmerContainer = document.querySelector(".shimmer-container");
  const coinContainer = document.getElementById("coin-container");
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
    showShimmer();
    try {
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

  const getFavorite = () => JSON.parse(localStorage.getItem("favorites")) || [];

  const saveFavorite = (favorites) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };
  const handleFavoriteClick = (coinId) => {
    const favorites = toggleFavorite(coinId);
    saveFavorite(favorites);
    addfavBtn.textContent = favorites.includes(coinId)
      ? "Remove from favorite"
      : "Add to favorite";
  };

  const toggleFavorite = (coinId) => {
    let favorites = getFavorite();
    if (favorites.includes(coinId)) {
      favorites = favorites.filter((id) => id !== coinId);
    } else {
      favorites.push(coinId);
    }
    return favorites;
  };

  function displayCoinData(coin) {
    coinImage.src = coin.image.large;
    coinImage.alt = coin.name;
    coinName.textContent = coin.name;
    coinDescription.textContent = coin.description.en.split(". ")[0] + ".";
    coinRank.textContent = coin.market_cap_rank;
    coinPrice.textContent =
      "$" + coin.market_data.current_price.usd.toLocaleString();
    coinMarketCap.textContent =
      "$" + coin.market_data.market_cap.usd.toLocaleString();

    const favorites = [];
    if (favorites.includes(coinId)) {
      addfavBtn.textContent = "Remove from Favorite";
    } else {
      addfavBtn.textContent = "Add To Favorite";
    }
  }

  await fetchCoinData();

  const ctx = document.getElementById("coinChart").getContext("2d");
  const coinChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "price (USD)",
          data: [],
          borderColor: "#229ef1",
          full: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
        },
        y: {
          display: true,
          beginAtZero: false,
          ticks: {
            callback: function (value) {
              return `$${value}`;
            },
          },
        },
      },
      plugins: {
        tooltips: {
          callbacks: {
            label: function (context) {
              return `$${context.parsed.y}`;
            },
          },
        },
      },
    },
  });

  async function fetchChartData(days) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();
      updataChart(data.prices);
    } catch (err) {
      console.log("No such values", err);
    }
  }

  function updataChart(prices) {
    const labels = prices.map((price) => {
      let date = new Date(price[0]);
      return date.toLocaleDateString();
    });
    const data = prices.map((price) => price[1]);
    coinChart.data.labels = labels;
    coinChart.data.datasets[0].data = data;
    coinChart.update();
  }
  const buttons = document.querySelectorAll(".btn-container button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      event.target.classList.add("active");
      const days =
        event.target.id === "24h" ? 1 : event.target.id === "30d" ? 30 : 90;
      fetchChartData(days);
    });
  });
  document.getElementById("24h").click();
  addfavBtn.addEventListener("click", handleFavoriteClick);
});
