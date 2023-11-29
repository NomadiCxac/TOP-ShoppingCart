async function fetchItems (jsonName)  {

    try {
        let response = await fetch(`/data/${jsonName}.json`)

        if (response.ok) {
            return await response.json();
        } else {
            // Handle HTTP errors
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching items:", error);
        // Optionally re-throw the error if you want calling code to handle it
        throw error;
    }
}


export default fetchItems