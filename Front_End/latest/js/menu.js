async function getMenu(){

    const response = await fetch('/menu');
    let data = await response.json();
    displayMenuData(data);
    
    }
    
    
    function displayMenuData(data)
    {
    const select = document.getElementById('categoriesSelect');
    for(let i = 0; i < data.length; i++){
    const categoryName = data[i].cat_name;
    const categoryId = data[i].cat_id;
    const option = document.createElement('option');
    option.setAttribute("value",categoryId);
    option.innerHTML = categoryName;
    select.appendChild(option);
    }
    
}
getMenu();

async function addMarkersByCategory(catid)
{
    if (catid== "")
    {
        window.location.reload();
    }
    const response = await fetch('/menu/getShopsByCategory'+ catid); 
    let data = await response.json();
    //console.log(data);
    markersLayer.remove();
    let markersLay = L.layerGroup();
    mymap.addLayer(markersLay);
    markersLay.addTo(mymap);
    for(let i = 0; i < data.length; i++)
    {
        let marker = L.marker([data[i].latitude, data[i].longitude],{title: data[i].branch_name +" "+ data[i].branch_id, icon:myIcon, id:data[i].shop_id, branch_id:data[i].branch_id});
        marker.on("click", hasSaleMarkerClickHandler);
        const popup = L.popup({maxHeight:280});
        marker.bindPopup(popup);
        marker.addTo(markersLay);
    }
}
