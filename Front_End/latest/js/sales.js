function removeChilds(parent) {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

async function makeCatMenu(){

    //Fetch categories data from sever
    const response = await fetch('/menu');
    let data = await response.json();
    //Append data to HTML
    const select = document.getElementById('cat_list');
        for(let i = 0; i < data.length; i++)
        {
            const categoryName = data[i].cat_name;
            const categoryId = data[i].cat_id;
            const option = document.createElement('option');
            option.setAttribute("value",categoryId);
            option.innerHTML = categoryName;
            select.appendChild(option);
        }
}   

async function makeSubcatMenu(cat_id){
    //Get subcategories data from server
    const response = await fetch('/menu/subcat?id='+cat_id);
    const data = await response.json();

    //Remove previous data and re-add title on subcat list
    const select = document.getElementById('subcat_list');
    removeChilds(select); 
    const option = document.createElement('option');
    option.setAttribute("value","");
    option.innerHTML = "Υποκατηγορίες";
    select.appendChild(option);

    //Remove previous data and re-add title on products list
    const select_prod = document.getElementById('prod_list');
    removeChilds(select_prod); 
    const option_prod = document.createElement('option');
    option_prod.setAttribute("value","");
    option_prod.innerHTML = "Προϊόντα";
    select_prod.appendChild(option_prod);

    //Append new data
        for(let i = 0; i < data.length; i++)
        {
            
            const categoryName = data[i].subcat_name;
            const categoryId = data[i].subcat_id;
            const option = document.createElement('option');
            option.setAttribute("value",categoryId);
            option.innerHTML = categoryName;
            select.appendChild(option);
            
        }
}

async function makeProductsMenu(subcat_id){
    //Get subcategories data from server
    const response = await fetch('/menu/products?id='+subcat_id);
    const data = await response.json();

    //Remove previous data and re-add title
    const select = document.getElementById('prod_list');
    removeChilds(select); 
    const option = document.createElement('option');
    option.setAttribute("value","");
    option.innerHTML = "Προϊόντα";
    select.appendChild(option);

    //Append new data
        for(let i = 0; i < data.length; i++)
        {
            
            const name = data[i].name;
            const id = data[i].product_id;
            const image = data[i].image
            const option = document.createElement('option');
            option.setAttribute("value",id);
            option.setAttribute("id",id);
            option.setAttribute("name",image);
            option.innerHTML = name;
            select.appendChild(option);
            
        }
}

function productClickHandler(id){
        //Show the selected product in the search box
        const option = document.getElementById(id)
        const autocomplete = document.getElementById('autocomplete-box');
        autocomplete.title = id;         
        autocomplete.value = option.innerHTML;
        autocomplete.class = option.getAttribute('name');
}

function suggestionClickHandler(name,id,image){
    //Set the values of the search box to be the same as the option selected
    const autocomplete = document.getElementById('autocomplete-box');
    autocomplete.value = name;
    autocomplete.title = id;
    autocomplete.class = image;
}

async function getProductSugg(text){
    

    //Get autocomplete data from server
    const response = await fetch('/menu/product?starts_with=' + text);
    const data = await response.json();

    document.getElementById('autocomplete-box').setAttribute('title','');

    const searchbox = document.getElementById('search-box');
    //Remove previous suggestions
    let sugg = document.getElementById('suggestion');
    while(sugg){
        sugg.remove();
        sugg = document.getElementById('suggestion');
    }

    //Append new suggestions
    for(let i = 0; i < data.length; i++){
        const ul = document.createElement('ul');
        ul.setAttribute('id','suggestion');
        ul.setAttribute('title',data[i].product_id);
        //Add click handler to suggestion
        ul.setAttribute('onclick', "suggestionClickHandler(this.innerHTML,this.title,'" + data[i].image + "')");
        ul.innerHTML = data[i].name;
        searchbox.appendChild(ul);
    }

}

function showForm(){
    //Get product name and id from the search box
    const product = document.getElementById('autocomplete-box');
    const name = product.value;
    const product_id = product.title;
    const product_image = product.class;

    //Get shop_id from url params
    const urlParams = new URLSearchParams(window.location.search);
    const shop_id = urlParams.get('shop_id');
    
    //If a legitimate product is entered, set submition form visibility true
    if(product_id !== "")
    {
        const prodName = document.getElementById('product-name');
        prodName.innerHTML = name;
        document.getElementById('sale-form-container').style.visibility='visible';
        document.getElementById('product-id').value = product_id;
        document.getElementById('shop-id').value = shop_id;
        document.getElementById('product-image').src = product_image;
    }
}

async function formsubmitHandler(e){
    e.preventDefault();

    const formdata = new FormData(this);
    const plainFormData = Object.fromEntries(formdata.entries());
	const formDataJsonString = JSON.stringify(plainFormData);

    fetch('/addSale',{
        method: 'POST',
        headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
        body: formDataJsonString
    }).then(async (response) => {
        const data = await response.json();

        const message1 = document.getElementById('success-message');
        const message2 = document.getElementById('failure-message');

        if(message1) {
            message1.remove();
        }
        else if(message2){
            message2.remove();
        }


        if (Object.keys(data).length === 0) 
        {
            const span = document.createElement('span');
            span.id = 'failure-message';
            span.innerHTML = 'Η προσφορά που υποβάλλατε δεν πληροί τα κριτήρια καταχώρησης!';
            document.getElementById('grid-container').appendChild(span);
        }
        else if (data[0].prop === 'daily')
        {
            const span = document.createElement('span');
            span.id = 'success-message';
            span.innerHTML = 'Η προσφορά που υποβάλλατε καταχωρήθηκε με επιτυχία, ήταν τουλάχιστον κάτα 20% φθηνότερη της μέσης τιμής της ημέρας και λάβατε '+data[0].score+' πόντους!';
            document.getElementById('grid-container').appendChild(span);
            
        }
        else if (data[0].prop === 'weekly')
        {
            const span = document.createElement('span');
            span.id = 'success-message';
            span.innerHTML = 'Η προσφορά που υποβάλλατε καταχωρήθηκε με επιτυχία, ήταν τουλάχιστον κάτα 20% φθηνότερη της μέσης τιμής της εβδομάδος και λάβατε '+data[0].score+' πόντους!';
            document.getElementById('grid-container').appendChild(span);
            
        }
        else if (data[0].prop === 'none')
        {
            const span = document.createElement('span');
            span.id = 'success-message';
            span.innerHTML = 'Η προσφορά που υποβάλλατε καταχωρήθηκε με επιτυχία, αλλά δεν πληροί τα κριτήρια λήψης πόντων.';
            document.getElementById('grid-container').appendChild(span);
            
        }
    })
}




makeCatMenu();
document.getElementById('sale-form').addEventListener('submit', formsubmitHandler);