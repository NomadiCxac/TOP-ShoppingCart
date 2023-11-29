function fetchImage(imageUrl) {
    const extensions = ['jpeg', 'svg', 'png'];

    for (let ext of extensions) {
        if ((`/images/${imageUrl}.${ext}`)) {
            return imageUrl ? `/images/${imageUrl}.${ext}`: '/images/defaultFood.jpeg'
        }
    }
}
export default fetchImage;