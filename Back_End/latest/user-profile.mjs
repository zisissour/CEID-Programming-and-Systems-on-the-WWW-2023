import mysql from 'mysql';
import {db} from "./database.mjs"

async function getUserData(UserId){
    
       const selectQuery =  'SELECT * FROM user WHERE user_id = ?'
       const query = mysql.format(selectQuery,[UserId]);
       let data = await db.query(query);
       return data[0];

    
}



async function getSalesHistory(UserId){
   
       const selectQuery = 'SELECT product.name,price,upl_date,exp_date,shop.shop_name FROM sales_history INNER JOIN product ON sales_history.product_id = product.product_id INNER JOIN shop ON sales_history.shop_id=shop.shop_id   WHERE sales_history.user_id = ? ORDER BY sales_history.sales_his_id ASC'
       const query = mysql.format(selectQuery,[UserId]);
       let data = await db.query(query);
       return data[0];
    

}

async function getRatingHistory(userId){

        const selectQuery = 'SELECT product.name,shop.shop_name,type,rate_date FROM rating_history INNER JOIN sale ON rating_history.sale_id = sale.sale_id INNER JOIN product ON sale.product_id = product.product_id INNER JOIN shop ON sale.shop_id = shop.shop_id WHERE rating_history.user_id = ? '
        const query = mysql.format(selectQuery,[userId]);
        let data = await db.query(query);
        return data[0];
     
 
 }

 async function changeUsername(userId, newUsrn)
 {
    try {
        const updateQuery =  'UPDATE user SET username = ? WHERE user_id= ?'
        const query = mysql.format(updateQuery,[newUsrn,userId]);
        await db.query(query);

     }catch
     {
         console.log(error);
     }

 }

 async function changePassword(userId,newPasswrd){
    try {
        const updateQuery =  'UPDATE user SET password = ? WHERE user_id = ?'
        const query = mysql.format(updateQuery,[userId,newPasswrd]);
        await db.query(query);

     }catch
     {
         console.log(error);
     }

 }
    

export{ getUserData, getSalesHistory, getRatingHistory, changeUsername, changePassword}