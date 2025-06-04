const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        const response = await fetch('https://rest.gohighlevel.com/v1/products/', {
            headers: {
                'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
                'Version': '2021-07-28'
            }
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        const products = data.products.map(product => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price) || 0,
            image: product.imageUrl,
            customFields: {
                category: product.customField?.category || '',
                subcategory: product.customField?.subcategory || ''
            }
        }));
        return {
            statusCode: 200,
            body: JSON.stringify(products)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
