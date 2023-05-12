export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const idrFormat = (price) => {
  const formattedPrice = price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return formattedPrice;
};
