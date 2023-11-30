export default function getItemBaseName(item) {


    for (let i = item.length; i > 0; i--) {
        
        if (item[i] === " ") {
            let firstSpaceIndex = -(item.length - i);
            let newBaseName = item.slice(firstSpaceIndex + 1)
            return newBaseName;
            }
        }
    }
