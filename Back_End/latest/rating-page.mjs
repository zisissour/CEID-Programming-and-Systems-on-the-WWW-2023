import mysql from 'mysql';
import {db} from "./database.mjs"

async function liked(userId,saleId){
   try{ 

    const insertQuery1 = 'CALL ratingChange(?,?,"like")'; 
    const query1 = mysql.format(insertQuery1,[userId,saleId]);

db.query(query1);
   }catch
   {
       console.log(error);
   }


}

async function disliked(userId,saleId){

    try{ 

        const insertQuery1 = 'CALL ratingChange(?,?,"dislike")'; 
        const query1 = mysql.format(insertQuery1,[userId,saleId]);
    
    db.query(query1);
       }catch
       {
           console.log(error);
       }

    
    }


async function inStock(saleId){
    try{ 

        const updateQuery = 'UPDATE sale SET in_stock="yes" WHERE sale_id=?';
        const query = mysql.format(updateQuery,[saleId]);
    
    db.query(query);
       }catch
       {
           console.log(error);
       }

}

async function outOfStock(saleId){
    try{ 

        const updateQuery = 'UPDATE sale SET in_stock="no" WHERE sale_id=?';
        const query = mysql.format(updateQuery,[saleId]);
    
    db.query(query);
       }catch
       {
           console.log(error);
       }

}

async function ratings(userId)
{
   
    const selectQuery = 'SELECT sale_id, type FROM rating_history WHERE user_id=?';
    const query = mysql.format(selectQuery, [userId]);

    let data = await db.query(query);
    return data[0];

   
}
    


export{liked, disliked, inStock, outOfStock, ratings} 