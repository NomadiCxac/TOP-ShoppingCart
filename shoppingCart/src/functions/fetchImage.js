function fetchImage(imageUrl) {
    const extensions = ['jpeg', 'svg', 'png'];

    for (let ext of extensions) {
        if ((`/images/${imageUrl}.${ext}`)) {
            console.log(imageUrl);
            return imageUrl ? `/images/${imageUrl}.${ext}`: '/images/defaultFood.jpeg'
        }
    }
}
export default fetchImage;

