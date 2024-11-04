async function getItems() {
    try {
        const response = await fetch('https://api-rho-smoky.vercel.app/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Новый элемент', value: 10 })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Item added:', data);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

async function fetchItems() {
    try {
        const response = await fetch('https://api-rho-smoky.vercel.app/api/items');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const items = await response.json();
        console.log('Fetched items:', items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Вызов функций
getItems();
fetchItems();
