function resolveImageUrl (imageUrl) {
    const extensions = ['png', 'jpeg', 'svg', ];

    for (let ext of extensions) {
        return imageUrl ? `/images/${imageUrl}.${ext}`: '/images/defaultFood.jpeg'
    }
}
export default resolveImageUrl;

