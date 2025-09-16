const getFavorite = () => JSON.parse(localStorage.getItem("favorites")) || [];

const saveFavorite = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};
const handleFavoriteClick = (coinId) => {
  const favorites = toggleFavorite(coinId);
  saveFavorite(favorites);
  renderCoins(coins, currentPage, 25);
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
