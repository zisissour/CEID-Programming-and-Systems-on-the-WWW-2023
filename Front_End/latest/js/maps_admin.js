async function addMarkers(){
    const response = await fetch('/stores/getStoresData'); //Fetching data from the server
    let data = await response.json();
    for(let i = 0; i < data.length; i++){ //Parsing the data and adding markers to the map
        if(data[i].has_sale===0)
        {
            let marker = L.marker([data[i].latitude, data[i].longitude],{title: data[i].branch_name +" "+ data[i].branch_id, icon:myIcon, opacity:0.6, id:data[i].shop_id, branch_id:data[i].branch_id});
            marker.on("click", noSaleMarkerClickHandler);
            const popup = L.popup({maxHeight:280});
            marker.bindPopup(popup);
            marker.addTo(markersLayer);
        }
        else
        {
            let marker = L.marker([data[i].latitude, data[i].longitude],{title: data[i].branch_name +" "+ data[i].branch_id, icon:myIcon, id:data[i].shop_id, branch_id:data[i].branch_id});
            marker.on("click", hasSaleMarkerClickHandler);
            const popup = L.popup({maxHeight:280});
            marker.bindPopup(popup);
            marker.addTo(markersLayer);
        }
        
    }
};

async function hasSaleMarkerClickHandler(){

    const response = await fetch('/stores/getSalesData'+this.options.id); //Fetch sales data
    const data = await response.json();
    navigator.geolocation.getCurrentPosition((pos)=>{

        //Get user location
        coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };
        
        //Create html code for the popup
        string = '';
        for (let i=0; i<data.length; i++){
            string = string + '<div id="popup">'
            + '<span id="popup-title"> ' + data[i].name +'</span>' 
            + '<span id="popup-likes">&#128077 ' + data[i].likes +' </span>'
            + '<span id="popup-dislikes">&#128078 '+ data[i].dislikes + '</span>'
            + '<span class="popup-stock" id="popup-stock-' + data[i].in_stock + '">Stock</span>'
            + '<span class="popup-prop1" id="popup-prop-' + data[i].prop1 + '">Daily 20% Lower</span>'
            + '<span class="popup-prop2" id="popup-prop-' + data[i].prop2 + '"s>Weekly 20% Lower</span>'
            + '<span id="popup-price">'+ data[i].price + ' &#8364</span>'
            + '<button id="popup-delete" value="' + data[i].sale_id+'" onclick="deleteOffer(this, this.value)">Διαγραφή προσφοράς</button>'
            +'</div>';
        }
        string = string + '<div id="popup-btn-container">'
        + '<button class="ratingBtn" id="ratingBtn-'+ this.options.branch_id + '" disabled onclick="location.href=\'/rating?key=' +this.options.id+ '\'">Αξιολόγηση</button>'
        + '<button class="addsaleBtn" id="addsaleBtn-'+ this.options.branch_id + '" disabled onclick="location.href=\'/sales?shop_id=' +this.options.id+ '\'">Υποβολή προσφοράς</button>'
        + '</div>' ;

        
        
        //Append html code to popup
        this.getPopup().setContent(string);
        this.openPopup();

        //If user is close enable buttons
        if (mymap.distance(this.getLatLng(), coords)<50){
            
            document.getElementById('ratingBtn-'+this.options.branch_id).removeAttribute('disabled');
            document.getElementById('addsaleBtn-'+this.options.branch_id).removeAttribute('disabled');
        }
    });
    
}

async function noSaleMarkerClickHandler(){
    navigator.geolocation.getCurrentPosition((pos)=>{

        //Get user location
        coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };
        
        //Create html code for the popup
        string = '';
        string = string + '<div id="popup-btn-container">'
        + '<button class="ratingBtn" id="ratingBtn-'+ this.options.branch_id + '" disabled onclick="location.href=\'/rating?key=' +this.options.id+ '\'">Αξιολόγηση</button>'
        + '<button class="addsaleBtn" id="addsaleBtn-'+ this.options.branch_id + '" disabled onclick="location.href=\'/sales?shop_id=' +this.options.id+ '\'">Υποβολή προσφοράς</button>'
        + '</div>' ;

        //Append html code to popup
        this.getPopup().setContent(string);
        this.openPopup();
        

        //If user is close enable buttons
        if (mymap.distance(this.getLatLng(), coords)<50){
            document.getElementById('addsaleBtn-'+this.options.branch_id).removeAttribute('disabled');
        }
    });
}      

function getPosition(position) {

    let marker, circle, lat, long, accuracy;

    lat = position.coords.latitude;
    long = position.coords.longitude;
    accuracy = position.coords.accuracy;
  
    marker = L.marker([lat, long]);
    circle = L.circle([lat, long], { radius: 50 });

    featureGroup.remove();  
    featureGroup = L.featureGroup([marker, circle]).addTo(mymap);
  
  // mymap.fitBounds(featureGroup.getBounds());
}

async function deleteOffer(e, id){
    e.parentElement.remove();

    fetch('/deleteSale?sale_id='+id);
}

//Creating the map
let mymap = L.map('mapid');
osmUrl='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
let osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});

mymap.addLayer(osm);
mymap.setView([38.246242, 21.7350847], 16);

//Making a layer for the markers
let markersLayer = L.layerGroup();
mymap.addLayer(markersLayer);
markersLayer.addTo(mymap);

//Creating the icon for the markers
let myIcon = L.icon({
    iconUrl: 'market_icon.png',
    iconSize: [50, 60],
    iconAnchor: [10, 50],
    popupAnchor: [-3, -76],
    shadowUrl: '',
    shadowSize: [],
    shadowAnchor: []
});

//Adding a search bar for the stores
let controlSearch = new L.Control.Search({
    position: "topright",
    layer: markersLayer,
    propertyName: "title",
    initial: false,
    zoom: 20,
    marker: false
  });

mymap.addControl(controlSearch);

//Adding geocoder control
L.Control.geocoder().addTo(mymap);
let featureGroup = L.featureGroup();

//Check for geolocation support and call geolocation function 

if (!navigator.geolocation) {
    alert("Your browser doesn't support geolocation feature!");
  } else {
    setInterval(() => {
        navigator.geolocation.getCurrentPosition(getPosition);
      }, 2000);
  }


//Adding markers to the map
addMarkers();
