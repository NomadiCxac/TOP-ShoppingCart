function formatName(item) {
  const words = [item.charAt(0).toUpperCase()];
  for (let i = 1; i < item.length; i++) {
  if (item.charAt(i).toUpperCase() == item.charAt(i) && item.charAt(i) !== " ") {
      words.push(" ");
    }
    words.push(item.charAt(i));
  }
  return words.join("");
}

module.exports = { formatName };