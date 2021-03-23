const proxy = `https://cors-anywhere.herokuapp.com/`;
//visit proxy first to activate access to server
const baseEndpointProduct = 'https://adorebeauty.com.au/api/ecommerce/catalog/products';
const baseEndpointCategories = 'https://adorebeauty.com.au/api/ecommerce/catalog/categories';
const tableRows = document.querySelector('.table.t-row');
const prodTable = document.querySelector('.product-table .t-row');
const itemDetail = document.querySelector('.item-detail');
const backBtn = document.querySelector('.back-btn')
const results = document.querySelector('.results');
const loader = document.querySelector('.lds-spinner');


const getProducts = async () => {
    const res = await fetch(`${proxy}${baseEndpointProduct}`);
    const data = await res.json();
    return data;
};

const getCategories = async () => {
    const res = await fetch(`${proxy}${baseEndpointCategories}`);
    const data = await res.json();
    return data;
};


const displayCategory = async () => {
    loader.classList.remove('hide');
    results.classList.add('hide');

    displayProducts();
    
    const categoryData = await getCategories();
    const products = await getProducts();
    const categoryIds = categoryData.data.map(item => item.id);
    let productCategoryIds =[];
    let printCatHeading = [];

    products.data.forEach(item => item.categories.forEach(el => !(categoryIds.includes(el))|| productCategoryIds.push(el)));
    categoryData.data.forEach(item => !(productCategoryIds.includes(item.id)) || printCatHeading.push(item.name))
    printCatHeading.map(item=>`${item.name}`);
    
    //not sure if getting the correct categories for the heading
    //to do: for the heading, check against all categories not just first 50
    //extra: use cat names for filtering display

    let h2 = document.createElement('h2');
    h2.innerHTML = printCatHeading.join(' | ');
    results.insertAdjacentElement('afterbegin', h2);

    loader.classList.add('hide');
    results.classList.remove('hide');
};


const displayProducts = async () => {
    const products = await getProducts();
    // const callCategories = await getCategories();

    const html = products.data.map(item =>
        `<div class="_${item.id}">${item.id} </div>
        <div class="_${item.id}">${item.name} </div>
        <div class="_${item.id} right ">${item.sku} </div>`
    );
    //to do: pagination

    tableRows.innerHTML = html.join('');
}



const showProduct = async (e) => {
    loader.classList.remove('hide');
    results.classList.add('hide');

    let id = e.target;
    id = parseInt(id.classList[0].slice(1));

    let x = await getProducts();
    x = x.data.filter(item => item.id === id);

    const html = x.map(item =>
        `<div class="data"><h3>${item.name} </h3>
        <p>Categories ${item.categories}</p>
        <p>SKU: ${item.sku}</p>
        <p>PRICE: ${item.price}</p>
        <p>Description: ${item.description}</p> </div>`
    );
    //to do: map category list names against ${item.categories} is just showing category numbers for now

    itemDetail.insertAdjacentHTML('beforeend', html.join(''));
    itemDetail.classList.remove('hide');
    loader.classList.add('hide');
};

const backToList = () =>{
    results.classList.remove('hide');
    itemDetail.classList.add('hide');
    !itemDetail.querySelector('.data') || itemDetail.querySelector('.data').remove()
};

displayCategory();

prodTable.addEventListener('click', showProduct);
backBtn.addEventListener('click', backToList);