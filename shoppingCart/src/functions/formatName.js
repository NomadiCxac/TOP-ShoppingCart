export default function formatName(item) {
    // Split the name at each uppercase letter, except the first one.
    let words = [item.charAt(0).toUpperCase()];
    for (let i = 1; i < item.length; i++) {
        if (item.charAt(i).toUpperCase() === item.charAt(i) && item.charAt(i) !== ' ') {
            words.push(' ');
        }
        words.push(item.charAt(i));
    }
    // Join all the characters and words back together.
    return words.join('');
}
