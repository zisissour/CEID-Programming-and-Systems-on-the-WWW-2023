async function userInfo(){
    const response = await fetch('/getUserData'); //Fetching data from the server
    let data = await response.json(); 
    console.log(data);
    displayUserData(data);
   }

async function salesHistory(){
    const response = await fetch('/getSalesHistory'); //Fetching data from the server
    let data = await response.json(); 
    console.log(data);
    displaySalesHist(data);
   }

async function ratingHistory(){
    const response = await fetch('/getRatingHistory'); //Fetching data from the server
    let data = await response.json(); 
    console.log(data);
    displayRatingHist(data);
   }

function displayUserData(data)
{
    const userInfo = document.getElementById('user-info');
    userInfo.setAttribute('class','container');
    const username = data[0].username;
    const email = data[0].email;
    const totalScore = data[0].total_score;
    const currentScore = data[0].current_score;
    const tokens = data[0].tokens;
    const lmtokens = data[0].last_month_tokens;
    const link = document.createElement('a');
    const image =document.createElement('img');
    const imageDiv = document.createElement('div');
    image.id = 'profile-image';
    imageDiv.id = 'img-div';
    imageDiv.setAttribute('class','img-div');
    image.setAttribute('src', 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png');
    link.appendChild(image);
    imageDiv.appendChild(link);
    const usernameP = document.createElement('p');
    usernameP.id = 'username';
    usernameP.innerHTML = 'Όνομα Χρήστη: ' +username;
    const emailP = document.createElement('p');
    emailP.id= 'email';
    emailP.innerHTML = 'Email: ' +email;
    const userForm = document.createElement('form');
    userForm.id='usernameForm';
    userForm.setAttribute('action', '/changeUsername');
    userForm.setAttribute('method', 'POST');
    const input1 = document.createElement('input');
    input1.setAttribute('type','text');
    input1.setAttribute('placeHolder','Όνομα Χρήστη');
    input1.id = 'username-form';
    input1.setAttribute('name','username');
    const input2 = document.createElement('input');
    input2.setAttribute('type','submit');
    input2.id = 'change-username';
    input2.setAttribute('value','Αλλαγή');
    userForm.appendChild(input1);
    userForm.appendChild(input2);
    const passwrdForm = document.createElement('form');
    passwrdForm.id = 'passwrdForm';
    passwrdForm.setAttribute('action','/changePassword');
    passwrdForm.setAttribute('method', 'POST');
    const input3 = document.createElement('input');
    input3.setAttribute('type', 'text');
    input3.setAttribute('placeholder', 'Κωδικός');
    input3.id = 'password';
    input3.setAttribute('name', 'password');
    const input4 = document.createElement('input');
    input4.setAttribute('type','submit');
    input4.id = 'change-password';
    input4.setAttribute('value','Αλλαγή');
    const scoreP = document.createElement('p');
    scoreP.innerHTML = "Σκόρ: " +currentScore;
    const totScoreP = document.createElement('p');
    totScoreP.innerHTML = "Συνολικό σκόρ: " +totalScore;
    const tokensP = document.createElement('p');
    tokensP.innerHTML = "Tokens: " +tokens;
    const lmtokensP = document.createElement('p');
    lmtokensP.innerHTML = "Tokens προηγούμενου μήνα: " +lmtokens;
    const div = document.createElement('div');
    div.id = 'scores';
    const logBtn = document.createElement('button');
    logBtn.innerHTML = "Αποσύνδεση";
    logBtn.setAttribute('id', 'logout-Btn');
    logBtn.setAttribute('onclick','window.location.href="/logout"'); 
    
    div.appendChild(scoreP);
    div.appendChild(totScoreP);
    div.appendChild(tokensP);
    div.appendChild(lmtokensP);
    passwrdForm.appendChild(input3);
    passwrdForm.appendChild(input4);
    userInfo.appendChild(logBtn);
    userInfo.appendChild(imageDiv);
    userInfo.appendChild(usernameP);
    userInfo.appendChild(emailP);
    userInfo.appendChild(userForm);
    userInfo.appendChild(passwrdForm);
    userInfo.appendChild(div);
    
}

function displaySalesHist(data)
{
    const salesHistTable = document.getElementById('sales-table');
    for(let i = 0; i < data.length; i++)
    {
    const product = data[i].name;
    const price = data[i].price;
    const uplDate = data[i].upl_date;
    const expDate = data[i].exp_date;
    const shop = data[i].shop_name;
    const trow = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.innerHTML = product;
    const td2 = document.createElement('td');
    td2.innerHTML = price;
    const td3 = document.createElement('td');
    td3.innerHTML = uplDate;
    const td4 = document.createElement('td');
    td4.innerHTML = expDate;
    const td5 = document.createElement('td');
    td5.innerHTML = shop;
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    salesHistTable.appendChild(trow);
    }
}

function displayRatingHist(data)
{
    const salesRatingTable = document.getElementById('rating-table');
    for(let i = 0; i < data.length; i++)
    {
    const product = data[i].name;
    const type = data[i].type;
    const rateDate = data[i].rate_date;
    const shop = data[i].shop_name;
    const trow = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.innerHTML = product;
    const td2 = document.createElement('td');
    td2.innerHTML = type;
    const td3 = document.createElement('td');
    td3.innerHTML = rateDate;
    const td4 = document.createElement('td');
    td4.innerHTML = shop;
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    salesRatingTable.appendChild(trow);
    }
}

userInfo();
salesHistory();
ratingHistory();