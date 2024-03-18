function retrieveImageUrl(itemId) {
  const imageUrlMap = {
    chocolateCake: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FchocolateCake.png?alt=media&token=0493b02d-07e4-4807-b867-07e0d49e7cee",
    chocolateCrinkleCookies: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FchocolateCrinkleCookies.png?alt=media&token=b19ff1f3-2949-4ad9-9548-b529b0beeb03",
    ensaymada: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2Fensaymada.png?alt=media&token=f5b20a2d-913b-4cba-9bd5-cc71a4498127",
    redVelvetCupcakes: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FredVelvetCupcakes.png?alt=media&token=f8385bed-66bd-4e3a-b915-b3956f2a18ef",
    walnutAndChocolateChipBananaCake: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FwalnutAndChocolateChipBananaCake.png?alt=media&token=e51ac38e-31d4-49f3-b34c-f314d447c810",
  };

  // Return the URL if found, or a placeholder/fallback URL if the ID does not exist in the map
  return imageUrlMap[itemId] || "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FdefaultFood.jpeg?alt=media&token=9f76128c-2ba3-4bb7-87eb-c38f58ed7eeb";
}

module.exports = {retrieveImageUrl};
