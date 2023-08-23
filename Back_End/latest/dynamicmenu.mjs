import {db} from './database.mjs'
import mysql from 'mysql';

async function getCategoriesMenu(){
 try{

  let data = await db.query('SELECT cat_id,cat_name FROM category');
  return data[0];

 }catch
 {
        console.log('error');
 }
       
} 

async function getShopsByCategory(catid)
{
        const str ='CALL showShopsFromCategory(?)';
        const query = mysql.format(str, catid);
        let [data,_]= await db.query(query).catch(err => {
            console.log(err);
        });
    
        return data[0];


}

async function getSubcategoriesMenu(id){
    const str = "SELECT subcat_id, subcat_name FROM subcategory WHERE cat_id = ?";
    const query = mysql.format(str,id);
    try{
        const [data, _] = await db.query(query);
        return data;
    }
    catch(err){
        console.log(err);
    }
    
}

async function getProductsMenu(id){
    const str = 'SELECT product_id, name, image FROM product WHERE subcat_id = ?';
    const query = mysql.format(str,id);
    try{
        const [data, _] = await db.query(query);
        return data;
    }
    catch(err){
        console.log(err);
    }
}

async function getProductSuggestions(text){
    const str = 'SELECT product_id, name, image FROM product WHERE name LIKE ? ORDER BY name ASC LIMIT 5';
    const query = mysql.format(str,text+'%');
    
    try{
        const [data, _] = await db.query(query);
        return data;
    }
    catch(err){
        console.log(err);
    }
}


export {getProductSuggestions}
export {getProductsMenu} 
export {getSubcategoriesMenu}
export {getCategoriesMenu}
export {getShopsByCategory}