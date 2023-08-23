import fs from 'fs';
import mysql from 'mysql';
import {db} from "./database.mjs"
import { execSync } from 'child_process';




 async function getObjList(){
    //Run python script to get json file
    const func = async ()=> { execSync('python scrapper.py', { encoding: 'utf-8' })};
    await func();
    
    //Return jsondata
    const jsonString= fs.readFileSync('products.json', 'utf8');
    let data = JSON.parse(jsonString);
    return data;
    
}


async function insertProducts(){
   
    //Get latest data in json format
    const jsonData = await getObjList();

    //Insert subcategories first
    await insertsubCategories(jsonData);

    //Insert new products ignoring duplicates
    let prodArray = new Array();

    for (let i = 0; i < jsonData.products.length; i++) {
        prodArray.push([jsonData.products[i].id, jsonData.products[i].name, jsonData.products[i].category, jsonData.products[i].subcategory, jsonData.products[i].image]);
    }
    const insertQuery = 'INSERT IGNORE INTO product (product_id,name,cat_id,subcat_id,image) VALUES ?';
    const query = mysql.format(insertQuery,[prodArray]);
    db.query(query); 
}

async function insertCategories(jsonData){

    let catArray = new Array();
    
    for (let i=0; i<jsonData.categories.length; i++) {
        catArray.push([jsonData.categories[i].id, jsonData.categories[i].name]);
    } 
   
    const insertQuery = 'INSERT IGNORE INTO category (cat_id,cat_name) VALUES ?';
    const query = mysql.format(insertQuery,[catArray]);

   db.query(query); 
}


async function insertsubCategories(jsonData){
    await insertCategories(jsonData);


    let subcatArray =new Array();

    for (let i=0; i<jsonData.categories.length; i++) {
        for(let j=0; j<jsonData.categories[i].subcategories.length; j++)
        {
        subcatArray.push([jsonData.categories[i].subcategories[j].uuid, jsonData.categories[i].subcategories[j].name, jsonData.categories[i].id]);
        }
    } 
    
    const insertQuery = 'INSERT IGNORE INTO subcategory (subcat_id,subcat_name,cat_id) VALUES ?';
    const query = mysql.format(insertQuery,[subcatArray]);
    db.query(query); 
       
}

async function deleteProductsData(){
    try{
        await db.query('DELETE FROM product');
        await db.query('DELETE FROM subcategory');
        await db.query('DELETE FROM category');
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}


export{deleteProductsData,insertProducts}





