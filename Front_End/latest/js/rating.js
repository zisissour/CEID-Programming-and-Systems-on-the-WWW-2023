async function salesList(id){
  const response = await fetch('/stores/getSalesData' + id); //Fetching data from the server
  let data = await response.json(); 
  displaySalesList(data);
  disableRating();
 }
 
 function displaySalesList(data)
 {
  const salesDiv = document.getElementById('salesList');
  salesDiv.setAttribute('class','grid-container');
  for(let i = 0; i < data.length; i++)
  {
     const sale = document.createElement('div');
     sale.setAttribute('class','container');
     sale.setAttribute('id','sale');
     const dataName = data[i].name;
     const dataPrice = data[i].price;
     const dataLikes = data[i].likes;
     const dataDislikes = data[i].dislikes;
     const dataStock = data[i].in_stock;
     const dataDLower= data[i].DailyLower;
     const dataWLower= data[i].WeeklyLower;
     const dataUsername = data[i].username;
     const dataTotScore = data[i].total_score;
     const dataDate = data[i].upl_date;
     //const hiddenDiv = document.createElement('div');
     //hiddenDiv.setAttribute('id', 'hiddenDiv');
     const link = document.createElement('a');
     const image =document.createElement('img');
     const imageDiv = document.createElement('div');
     const stockSelect = document.createElement('select');
     stockSelect.setAttribute('id','stock-select-'+ data[i].sale_id);
     stockSelect.setAttribute('class','stock-select');
     stockSelect.setAttribute('name','stock');
     stockSelect.setAttribute('onchange','stockUpdate(' + data[i].sale_id + ',this.value)');
     const option1 = document.createElement('option');
     const option2 = document.createElement('option');
     const option3 = document.createElement('option');
     option1.innerHTML = "stock";
     option2.setAttribute('value', '');
     option2.innerHTML = "in-stock";
     option2.setAttribute('value', 'yes');
     option3.innerHTML = "out-of-stock";
     option3.setAttribute('value', 'no');
     stockSelect.appendChild(option1);
     stockSelect.appendChild(option2);
     stockSelect.appendChild(option3);
     image.setAttribute('id', 'product-image' );
     imageDiv.setAttribute('id' ,'img-div-'+ data[i].sale_id);
     imageDiv.setAttribute('class','img-div');
     image.setAttribute('src', 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png');
     link.appendChild(image);
     imageDiv.appendChild(link);
     
     const dateP = document.createElement('p');
     dateP.innerHTML = 'Ημερομηνία υποβολής: '+ dataDate;
     dateP.setAttribute('id', 'sale-date');
     const usernameSpan = document.createElement('p');
     usernameSpan.innerHTML = dataUsername + '(Συνολικό score:' +dataTotScore + ')';
     usernameSpan.setAttribute('id','username');
     usernameSpan.setAttribute('href','/rating');
     const nameSpan = document.createElement('p');
     nameSpan.innerHTML = 'Προϊόν: ' +dataName;
     nameSpan.setAttribute('id','sale-name');
     const priceSpan = document.createElement('p');
     priceSpan.innerHTML = 'Τιμή: ' + dataPrice;
     priceSpan.setAttribute('id','sale-price'); 
     const span = document.createElement('span');
     span.setAttribute('id','likes-dislikes');
     const likesSpan = document.createElement('span');
     likesSpan.innerHTML = '&#128077; ' + dataLikes;
     likesSpan.setAttribute('id','popup-likes');
    // likesSpan.setAttribute('class','popup-likes')
     const dislikesSpan = document.createElement('span');
     dislikesSpan.innerHTML = '&#128078; ' + dataDislikes;
     dislikesSpan.setAttribute('id','popup-dislikes');
    // dislikesSpan.setAttribute('class','popup-dislikes');
     const space = document.createElement('span');
     space.innerHTML = '&nbsp;&nbsp;'
     span.appendChild(likesSpan);
     span.appendChild(space);
     span.appendChild(dislikesSpan);
     const stockSpan = document.createElement('span');
     stockSpan.innerHTML = "Stock";
     stockSpan.setAttribute('id','popup-stock-'+dataStock);
     stockSpan.setAttribute('class','popup-stock');
     const dlSpan = document.createElement('span');
     dlSpan.innerHTML = "Daily 20% Lower";
     dlSpan.setAttribute('id','popup-prop-'+ dataDLower);
     dlSpan.setAttribute('class','popup-prop1');
     const wlSpan = document.createElement('span');
     wlSpan.innerHTML = "Weekly 20% Lower";
     wlSpan.setAttribute('id','popup-prop-'+ dataWLower);
     wlSpan.setAttribute('class','popup-prop2');
     const divBorder = document.createElement('div');
     divBorder.id = 'borderedInfo';
     divBorder.appendChild(usernameSpan);
     divBorder.appendChild(nameSpan);
     divBorder.appendChild(priceSpan);
     divBorder.appendChild(dateP);
     divBorder.appendChild(span);
     const linkForMore = document.createElement('button');
     linkForMore.innerHTML = "Περισσότερα...";
     linkForMore.setAttribute('class','button-54');
     linkForMore.setAttribute('id','more');
     linkForMore.setAttribute('onclick','showMore('+ data[i].product_id +','+ data[i].sale_id + ')');
     const likeBtn = document.createElement('button');
     const dislikeBtn = document.createElement('button');
     likeBtn.setAttribute('id','likeBtn-'+data[i].sale_id);
     likeBtn.setAttribute('class','likeBtn');
     likeBtn.setAttribute('onclick', 'liked(' +data[i].sale_id+ ')');
     likeBtn.innerHTML = "&#128077;"
     dislikeBtn.setAttribute('id','dislikeBtn-' + data[i].sale_id);
     dislikeBtn.setAttribute('class','dislikeBtn');
     dislikeBtn.setAttribute('onclick', 'disliked(' +data[i].sale_id+ ')');
     dislikeBtn.innerHTML = "&#128078;"; 
     //hiddenDiv.appendChild(imageDiv);
     //hiddenDiv.appendChild(likeBtn);
     //hiddenDiv.appendChild(space);
     //hiddenDiv.appendChild(dislikeBtn); 
     //hiddenDiv.appendChild(stockSelect);
     sale.appendChild(divBorder);
     //sale.appendChild(usernameSpan);
     //sale.appendChild(nameSpan);
     //sale.appendChild(priceSpan);
     //sale.appendChild(dateP);
     //sale.appendChild(span);
     sale.appendChild(stockSpan);
     sale.appendChild(dlSpan);
     sale.appendChild(wlSpan);
     sale.appendChild(linkForMore);
     //sale.appendChild(hiddenDiv);
     sale.appendChild(imageDiv);
     sale.appendChild(likeBtn);
     sale.appendChild(dislikeBtn); 
     sale.appendChild(stockSelect);
     salesDiv.appendChild(sale);
     //salesDiv.appendChild(link);
 
    }
 
  }
 
  function showMore(prodId,saleId)
  {
   let img = document.getElementById("img-div-" + saleId);
   let like = document.getElementById("likeBtn-" + saleId);
   let dislike = document.getElementById("dislikeBtn-" + saleId);
   let stock = document.getElementById("stock-select-" + saleId);
   if (img.style.display === "block") {
     img.style.display = "none";
   } else {
     img.style.display = "block";
   }
   if (like.style.display === "block") {
     like.style.display = "none";
   } else {
     like.style.display = "block";
   }
   if (dislike.style.display === "block") {
     dislike.style.display = "none";
   } else {
     dislike.style.display = "block";
   }
   if (stock.style.display === "block") {
     stock.style.display = "none";
   } else {
     stock.style.display = "block";
   }
 
 };
    
 
 
  async function liked(saleId){
   let response = await fetch('/liked' + saleId,{method: 'POST'}); 
   let button = document.getElementById("likeBtn-"+saleId);
   button.disabled = true;
  };
 
  async function disliked(saleId){
   const response = await fetch('/disliked' + saleId,{method: 'POST'}); 
   let button = document.getElementById("dislikeBtn-"+saleId);
   button.disabled = true;
  };
 
  async function stockUpdate(saleId,value){
   if(value === 'yes')
   {
     const response = await fetch('/inStock' + saleId,{method: 'POST'}); 
    
   }
   else if(value === 'no')
   {
     const response = await fetch('/outOfStock' + saleId,{method: 'POST'});
    
   }
   else 
   {
     
   }
  };

  async function disableRating()
  {
    const response = await fetch('/getRatings'); //Fetching data from the server
    let data = await response.json();

    if(data.length > 0)
    {
     for(let i = 0; i < data.length; i++)
     {
      if(data[i].type === 'like')
      {
        let button = document.getElementById("likeBtn-"+ data[i].sale_id );
        button.disabled = true;
      }
      else
      {
        let button = document.getElementById("dislikeBtn-"+ data[i].sale_id );
        button.disabled = true;
      }
     }
    }
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const shopId = urlParams.get('key');
  console.log(shopId);
 

 salesList(shopId);