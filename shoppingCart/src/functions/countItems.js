export default function countItems(items) {
    // Initialize total sums for each quantity type
    let totalQuantity = 0;
    let totalDozenQuantity = 0;
    let totalHalfDozenQuantity = 0;

    // Iterate through each item and add its quantities to the totals
    items.forEach(item => {
        totalQuantity += item.quantity || 0; // Ensure undefined values are treated as 0
        totalDozenQuantity += item.dozenQuantity || 0; // Ensure undefined values are treated as 0
        totalHalfDozenQuantity += item.halfDozenQuantity || 0; // Ensure undefined values are treated as 0
    });

    // Return the sum of all quantities
    return totalQuantity + totalDozenQuantity + totalHalfDozenQuantity;
}
