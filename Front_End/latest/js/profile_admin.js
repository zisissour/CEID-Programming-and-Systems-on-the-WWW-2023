function removeChilds(parent) {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

function createProductsWindow() {
    const info =  document.getElementsByClassName('info');
    //Clear page
     info[0].innerHTML = '';
 
     //Create new elements
     const button1  = document.createElement('button');
     button1.innerHTML= 'Ανανέωση Πληροφοριών Προϊόντων 🔄';
     button1.setAttribute('id', 'refresh-stores-btn');
     button1.setAttribute('onclick', 'refreshProducts()');
     const button2 = document.createElement('button');
     button2.innerHTML = 'Διαγραφή Πληροφοριών Προϊόντων ❌';
     button2.setAttribute('onclick','deleteProducts()');
     button2.setAttribute('id', 'delete-stores-btn');
 
     //Append elements
     info[0].appendChild(button1);
     info[0].appendChild(button2);
     info[0].setAttribute('id', 'stores-btns');
 }

function createStoresWindow() {
   const info =  document.getElementsByClassName('info');
   //Clear page
    info[0].innerHTML = '';

    //Create new elements
    const button1  = document.createElement('button');
    button1.innerHTML= 'Ανανέωση Πληροφοριών Καταστημάτων 🔄';
    button1.setAttribute('id', 'refresh-stores-btn');
    button1.setAttribute('onclick', 'refreshStores()');
    const button2 = document.createElement('button');
    button2.innerHTML = 'Διαγραφή Πληροφοριών Καταστημάτων ❌';
    button2.setAttribute('onclick','deleteStores()');
    button2.setAttribute('id', 'delete-stores-btn');

    //Append elements
    info[0].appendChild(button1);
    info[0].appendChild(button2);
    info[0].setAttribute('id', 'stores-btns');
}

async function createLeaderboardWindow(page){
    //Fetch user data
   fetch('admin/usersData')
        .then(async (reply) =>{
            return reply.json()
                .then((data) =>{
                        makeLeaderboardPage(data,page);
                    })
            });
}

function makeLeaderboardPage(data, page){
    

    let pageNum = Math.floor(data.length/10) + 1;

    if (page === 0)
        page=1;
    else if (page > pageNum)
        page = pageNum;

    const prev_page = page-1;
    const next_page = page+1;

    const info =  document.getElementsByClassName('info');
    info[0].setAttribute('id', 'leaderboard-stats');
    //Clear page
    info[0].innerHTML = '';    

    //Create elements
    for(let i = (page-1)*10; i <page*10; i++){
        const userInfo = document.createElement('div');
        userInfo.id = 'user-info';
        const username = document.createElement('span');
        username.id = 'user-username';
        username.innerHTML = 'Username: ' + data[i].username;
        userInfo.appendChild(username);
        const score = document.createElement('span');
        score.id = 'user-score';
        score.innerHTML = 'Total Score: ' + data[i].total_score;
        userInfo.appendChild(score);
        const tokens = document.createElement('span');
        tokens.id = 'user-tokens';
        tokens.innerHTML = 'Total Tokens: ' + data[i].tokens;
        userInfo.appendChild(tokens);
        const currentTokens = document.createElement('span');
        currentTokens.id = 'user-current-tokens';
        currentTokens.innerHTML = "Last Month's Tokens: " + data[i].last_month_tokens;
        userInfo.appendChild(currentTokens);
        info[0].appendChild(userInfo);

        //If last element break
        if(i === data.length-1)
            break;
    }

    //Add prev and next buttons
    const next = document.createElement('button');
    next.id='next-btn';
    next.innerHTML = 'Next';
    next.setAttribute('onclick','createLeaderboardWindow('+ next_page + ')');
    info[0].appendChild(next);

    const prev = document.createElement('button');
    prev.id='prev-btn';
    prev.innerHTML = 'Previous';
    prev.setAttribute('onclick','createLeaderboardWindow('+ prev_page + ')');
    info[0].appendChild(prev);

}

async function createAvgDiscPage(){
    const info =  document.getElementsByClassName('info');
    info[0].setAttribute('id', 'discount-graphs-container');
    //Clear page
    info[0].innerHTML = '';    

    //Create chart canvas
    info[0].innerHTML = '<canvas id="myChart" style="width:100%;max-width:1000px"></canvas>';
    
    const chart = new Chart("myChart", {
        type: "bar",
        data: {
          labels: Array.from({length: 7}, (_, i) => moment().subtract(6-i,'days').format('YYYY-MM-DD')),  
          datasets: [{
            backgroundColor: 'blue',
            data: []
          }]
        },
        options: {
          legend: {display: false},
          title: {
            display: true,
            text: "Μέση Έκπτωση ανά ημέρα"
          }
        }
      });

    //Create category input
    fetch('/menu').then((res)=>{
        res.json().then((data)=>{
            const cat = document.createElement('select');
            cat.setAttribute('id', 'category-list');
            cat.innerHTML = '<option value="">Κατηγορία</option>';
            for(let i=0; i<data.length; i++){
                const item = document.createElement('option');
                item.innerHTML = data[i].cat_name;
                item.value = data[i].cat_id;
                cat.appendChild(item);
            }

            info[0].appendChild(cat);

            //Create subcategory menu
            cat.addEventListener("change", ()=>{

                //Remove old elements
                const subcatlist = document.getElementById('subcategory-list');
                removeChilds(subcatlist);
                const option = document.createElement('option');
                option.innerHTML = 'Υποκατηγορίες';
                option.value = null;
                subcatlist.appendChild(option);


                const catID = document.getElementById("category-list").value;
                fetch('/menu/subcat?id='+catID).then((res)=>{
                    res.json().then((data)=>{
                        for(let i=0; i<data.length; i++){
                            const item = document.createElement('option');
                            item.innerHTML = data[i].subcat_name;
                            item.value = data[i].subcat_id;
                            subcat.appendChild(item);
                        }
                    });

                });
            });
        });
    });

    const subcat = document.createElement('select');
    subcat.setAttribute('id', 'subcategory-list');
    subcat.innerHTML = '<option value=null>Υποκατηγορία</option>';
    info[0].appendChild(subcat);

    
    //Create search button
    const button= document.createElement('button');
    button.id = 'search-btn';
    button.innerHTML = 'Αναζήτηση';
    info[0].appendChild(button);

    button.addEventListener('click', async () => {
        const cat_id = document.getElementById('category-list').value;
        const subcat_id = document.getElementById('subcategory-list').value;
        let average = new Array();

        for(let i = 0; i < 7; i++) {
            const reply = await fetch('/admin/getAvgDiscount?cat_id='+cat_id+'&subcat_id='+subcat_id+'&date='+chart.data.labels[i]);
            const data = await reply.json();
            average.push(data[0].avg);
        }

        console.log(average);
        //Update chart
        chart.data.datasets.forEach((dataset) => {
            dataset.data = average;
        });
        chart.update();
    });

    //Create Previous and Next Buttons

    const prev_button = document.createElement('button');
    prev_button.id = 'previous-btn-2';
    prev_button.innerHTML = 'Προηγούμενη Εβδομάδα';
    info[0].appendChild(prev_button);

    prev_button.addEventListener('click', () => {

        let date = moment(chart.data.labels[0]);
        date.subtract(1, 'days');
        let newDates = Array.from({length: 7}, (_, i) => date.clone().subtract(6-i,'days').format('YYYY-MM-DD'));

        chart.data.labels = newDates;

        chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });

        chart.update();
    });

    const next_button = document.createElement('button');
    next_button.id = 'next-btn-2';
    next_button.innerHTML = 'Επόμενη Εβδομάδα';
    info[0].appendChild(next_button);

    next_button.addEventListener('click', () => {

        let date = moment(chart.data.labels[6]);
        date.add(1, 'days' );
        let newDates = Array.from({length: 7}, (_, i) => date.clone().add(i,'days').format('YYYY-MM-DD'));
        chart.data.labels = newDates;

        chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        chart.update();
    });
    
}

function createDiscountPage(){
    const info =  document.getElementsByClassName('info');
    info[0].setAttribute('id', 'discount-graphs-container');
    //Clear page
    info[0].innerHTML = '';    

    //Create chart canvas
    info[0].innerHTML = '<canvas id="myChart" style="width:100%;max-width:1000px"></canvas>';
    const chart = new Chart("myChart", {
        type: "bar",
        data: {
          labels: Array.from({length: 31}, (_, i) => i + 1),  
          datasets: [{
            backgroundColor: 'blue',
            data: []
          }]
        },
        options: {
          legend: {display: false},
          title: {
            display: true,
            text: "Προσφορές ανά ημέρα"
          }
        }
      });
    
    //Create month input
    const month = document.createElement('select');
    month.setAttribute('id', 'months-list');
    month.innerHTML = '<option value="">Μήνας</option>';
    for(let i = 1; i<=12; i++){
        const m = document.createElement('option');
        m.innerHTML = i;
        m.value = i;
        month.appendChild(m);
    }

    //Fetch year data from db and make year input
    fetch('/admin/saleYears').then((res)=>{
        res.json().then((data)=>{
            const year = document.createElement('select');
            year.setAttribute('id', 'years-list');
            year.innerHTML = '<option value="">Χρονιά</option>';
            for(let i = 0; i<data.length; i++){
                const y = document.createElement('option');
                y.innerHTML = data[i].year;
                y.value = data[i].year;
                year.appendChild(y);
            }

            info[0].appendChild(year);
        })
    });

    //Create search button
    const button= document.createElement('button');
    button.id = 'search-btn';
    button.innerHTML = 'Αναζήτηση';

    button.addEventListener('click',()=>{

        fetch('/admin/getSaleCount?year='+document.getElementById('years-list').value+'&month='+document.getElementById('months-list').value).then((res)=>{
            res.json().then((data)=>{

                //Get data into array
                let count = new Array();
                for(let i=0; i<data.length; i++){
                    count.push(data[i].sale_count);
                }
                //Update chart
                chart.data.datasets.forEach((dataset) => {
                    dataset.data = count;
                });
                chart.update();
            })
        });

    })

    info[0].appendChild(button);
    info[0].appendChild(month);
}

async function refreshStores(){
    if(confirm('Θέλετε να ανανεώσετε τη λίστα καταστήματων'))
    {
        const success =  await fetch('admin/insertShops');
        
        if(success)
            alert('Επιτυχημένη εισαγωγή δεδομένων');
        else
            alert('Ανεπιτυχής εισαγωγή δεδομένων');
    }
}

async function deleteStores(){
    if(confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε τη λίστα καταστήματων; ΠΡΟΣΟΧΗ! Θα χαθούν δεδομένα που αφορούν προσφορές!'))
    {
        const success =  await fetch('admin/deleteShops');
        
        if(success)
            alert('Επιτυχημένη διαγραφή δεδομένων');
        else
            alert('Ανεπιτυχής διαγραφή δεδομένων');
    }
}

async function refreshProducts(){
    if(confirm('Θέλετε να ανανεώσετε τη λίστα προϊόντων;'))
    {
        const success =  await fetch('admin/insertProducts');
        
        if(success)
            alert('Επιτυχημένη εισαγωγή δεδομένων');
        else
            alert('Ανεπιτυχής εισαγωγή δεδομένων');
    }
}

async function deleteProducts(){
    if(confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε τη λίστα προϊόντων; ΠΡΟΣΟΧΗ! Θα χαθούν δεδομένα που αφορούν προσφορές!'))
    {
        const success =  await fetch('admin/deleteProducts');
        
        if(success)
            alert('Επιτυχημένη διαγραφή δεδομένων');
        else
            alert('Ανεπιτυχής διαγραφή δεδομένων');
    }
}
