import mysql from 'mysql';
import {db} from "./database.mjs"

//Gets shop's sales data from database 
async function getSalesData(shopid){
    const str = 'CALL getSaleData(?);'
    const query = mysql.format(str, shopid);

    let [output,_] = await db.query(query).catch(err => {
        console.log(err);
    });

    return output[0];

};

async function addSale(product_id,user_id,shop_id,price){
    const str = "CALL addSale(?, ?, ?, ?, ?)";
    const query = mysql.format(str,[product_id,user_id,shop_id,price,new Date()]);
    try{

        const [result,_] = await db.query(query);
        console.log(result[0]);
        return result[0];
    }
    catch(err){
        console.log(err);
        
        return {};
    }
};

async function deleteSale(id){
    const query = 'DELETE FROM sale WHERE sale_id = ' +id;
    try{
        db.query(query);
    } 
    catch(err){
        console.log(err);
    }
}

async function getSaleYears(){
    const query = 'SELECT EXTRACT(YEAR FROM upl_date) as year FROM sale GROUP BY EXTRACT(YEAR FROM upl_date)'
    try{
       const [reply,_] = await db.query(query);

        return reply;
    }
    catch(err){
        console.log(err);
        return {};
    }
}

async function getSalesCount(year, month){
    const str = 'CALL salesCount(?,?)'
    const query = mysql.format(str, [year, month]);

    try{
        const [reply,_] = await db.query(query);
        return reply[0];
    }
    catch(err){
        console.log(err);
        return {};
    }
}

async function getAvgDiscount(catID, subcatID, date){
    const str = 'CALL avgDiscount(?,?,?)';
    let query;

    if (subcatID === 'null'){
        query = mysql.format(str, [catID,null,date]);
    }     
    else{
        query = mysql.format(str, [catID,subcatID,date]);     
    }


    try{
        const [reply,_] = await db.query(query);
        console.log(reply[0]);
        return reply[0];
    }
    catch(err){
        console.log(err);
        return {};
    }

    
}

export {getAvgDiscount};
export {getSalesCount};
export {getSaleYears};
export {deleteSale};
export {addSale};
export {getSalesData};