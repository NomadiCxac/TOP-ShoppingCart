function resolveImageUrl (imageUrl) {
    const extensions = ['jpeg', 'svg', 'png'];

    for (let ext of extensions) {
        return imageUrl ? `/images/${imageUrl}.${ext}`: '/images/defaultFood.jpeg'
    }
}
export default resolveImageUrl;

