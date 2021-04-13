const axios = require('axios');
const proxy = `https://cors-anywhere.herokuapp.com/`;
//visit proxy first to activate access to server
const categoriesCalll = 'https://www.adorebeauty.com.au/api/ecommerce/catalog/categories';
const productsCall = 'https://adorebeauty.com.au/api/ecommerce/catalog/products';
const tableRows = document.querySelector('.table.t-row');
const prodTable = document.querySelector('.product-table .t-row');
const itemDetail = document.querySelector('.item-detail');
const backBtn = document.querySelector('.back-btn')
const results = document.querySelector('.results');
const loader = document.querySelector('.lds-spinner');

const getUniqueListBy = (arr, key)=> [...new Map(arr.map(item => [item[key], item])).values()]
let commonCategories = [];



const apiCall = async (url1, url2) => {
    try {
        axios.all([
            axios.get(url1),
            axios.get(url2)
        ]).then(axios.spread((categoryData, productData) => {

            productData = productData.data.data.map(item => {
                let { name, id, sku, description, categories, price } = item;
                let trimmedProducts = { name, id, sku, description, categories, price };
                return trimmedProducts
            })

            categoryData = categoryData.data.data.map(item => {
                let { name, id } = item;
                let trimmedCategories = { name, id };
                return trimmedCategories
            })
            

            displayCategory(productData, categoryData);
            displayProducts(productData);
            prodTable.addEventListener('click', (e) => showProduct(e, productData, categoryData));
            
        }))
    } catch(err) {
        console.log(err);
    }
   
}


const displayCategory = (productData, categoryData) => {
    loader.classList.remove('hide');
    results.classList.add('hide');
    
    productData.forEach(item => item.categories.forEach(el => categoryData.reduce((acc, x) => !(x.id === el) || commonCategories.push({ id: x.id, name: x.name }), [])) );
    commonCategories = getUniqueListBy(commonCategories, 'id');
    //not sure if getting the correct categories for the heading
    //to do: for the heading, check against all categories not just first 50 // extra: use category names for filtering display
    
    let h2 = document.createElement('h2');
    h2.innerHTML = commonCategories.map(item=>`<a href="#">${item.name}</a>`).join(' | ');
    results.insertAdjacentElement('afterbegin', h2);

    loader.classList.add('hide');
    results.classList.remove('hide');
};


const displayProducts = (productData) => {
    const html = productData.map(item =>`
        <div class="_${item.id}">${item.id} </div>
        <div class="_${item.id}">${item.name} <br></div>
        <div class="_${item.id} right ">${item.sku} </div>`);

    tableRows.innerHTML = html.join('');
    loader.classList.add('hide');
    results.classList.remove('hide');
}


const showProduct = (e, productData, categoryData) => {
    loader.classList.remove('hide');
    results.classList.add('hide');
    
    let id = e.target;
    id = parseInt(id.classList[0].slice(1));

    let openedProduct = productData.filter(item => item.id === id);
    let catIDs = openedProduct[0].categories;

/* reworking - start */
    console.log(openedProduct);
    console.log(commonCategories)
    console.log(catIDs)
    
    catIDs.forEach(item => commonCategories.map(el => el.id === item ?(el.name) : (item.categories) )       )
    

    //NOTE TO SELF: checker only shows one category in old code, could try using commonCategories against catIDs, then make checker redundant
    // maybe break this part out as a seperate function to get correct categories
    // let checker =[]
    // commonCategories.filter(item => catIDs.forEach(el=> el === item.id ? checker.push({id: item.id, name: item.name}) : ''));

/* reworking - end */

    const html = openedProduct.map(item =>
        `<div class="data"><h3>${item.name} </h3>
        <p>Categories: ${(item.categories).join(', ')}</p>
        <p>SKU: ${item.sku}</p>
        <p>PRICE: $${(item.price).toFixed(2)}</p>
        <p>Description: ${item.description}</p> </div>`
    );


/* ** old code ** currently displays only category name, not all of them... */
    // checking categories on the opened product, fallback is category number.. not sure if this is displaying correct info
    
    // let checker =[]
    // categoryData.forEach(cat => x[0].categories.forEach(el=> (el === cat.id) ? checker = [...[cat.id, cat.name]] : ''));
    
    // console.log(checker)
    // const html = x.map(item =>
    //     `<div class="data"><h3>${item.name} </h3>
    //     <p>Categories: ${checker[1] ? ((checker[1] + (item.categories.filter(el=> el !== checker[0]).length>0? ', ': ' ')  +  (item.categories.filter(el=> el !== checker[0]).join(', ')))) : (item.categories).join(', ')}</p>
    //     <p>SKU: ${item.sku}</p>
    //     <p>PRICE: $${(item.price).toFixed(2)}</p>
    //     <p>Description: ${item.description}</p> </div>`
    // );
/* end  */
    
    itemDetail.insertAdjacentHTML('beforeend', html.join(''));
    itemDetail.classList.remove('hide');
    loader.classList.add('hide');
};


const backToList = () => {
    results.classList.remove('hide');
    itemDetail.classList.add('hide');
    !itemDetail.querySelector('.data') || itemDetail.querySelector('.data').remove()
};


backBtn.addEventListener('click', backToList);
apiCall(proxy+categoriesCalll, proxy+productsCall);