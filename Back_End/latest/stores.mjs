
import mysql from 'mysql';
import {db} from "./database.mjs"

const apiUrl = 'https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Csupermarket%20in%20%CF%80%CE%AC%CF%84%CF%81%CE%B1%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%2F%2F%20fetch%20area%20%E2%80%9C%CF%80%CE%AC%CF%84%CF%81%CE%B1%E2%80%9D%20to%20search%20in%0Aarea%28id%3A3602182851%29-%3E.searchArea%3B%0A%2F%2F%20gather%20results%0A%28%0A%20%20%2F%2F%20query%20part%20for%3A%20%E2%80%9Csupermarket%E2%80%9D%0A%20%20node%5B%22shop%22~%22supermarket%7Cconvenience%22%5D%28area.searchArea%29%3B%0A%29%3B%0A%2F%2F%20print%20results%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B';


async function getStoresList() {
    let output =  await fetch(apiUrl)
        .then((reply) => {
            if(reply.status === 200)
                return reply.json();
            else
                console.error('Failed to fetch store data from api');
        })

        return output;
};

async function insertStoreData(){

    let storedata = await getStoresList(); //Getting the stores list

    //Store info from json to array
    let data = new Array();

    for (let i=0; i<storedata.elements.length; i++) {
        data.push([storedata.elements[i].tags.name, storedata.elements[i].tags.brand, storedata.elements[i].lon, storedata.elements[i].lat, storedata.elements[i].id]);
    }
    
   try{
     //Get api id info from database and store in array
     const [db_data,_] = await  db.query('SELECT api_id FROM branch');
     let db_ids = new Array();
     
     for (let i = 0; i < db_data.length; i++) {
         db_ids.push(db_data[i].api_id);
     }
 
     //Get only the data not present in the database
     let finalData = data.filter(function(obj) { return db_ids.indexOf(obj[4]) == -1; });
     
     if (finalData.length !== 0){
        
        //Actually insert the data into the database
        const insertQuery = 'INSERT INTO branch (branch_name,shop_name,longitude,latitude,api_id) VALUES ?';
        const query = mysql.format(insertQuery,[finalData]);
        
        db.query(query);
        
     }
     return true; 
   }
   catch (err) {
        console.log(err);
        return false;
   }
};

async function deleteStoreData(){
    try{
        await db.query('DELETE FROM shop');
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

 async function getStoresData(){

    const stringQuery = 'call branchData() ;';
    
    let [output, _] = await db.query(stringQuery).catch(err =>{
        console.error(err);
    }); 
    return output[0];

};


export {getStoresData};
export {insertStoreData};
export {deleteStoreData};