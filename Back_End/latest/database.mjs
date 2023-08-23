import 'dotenv/config';
import mysql from 'mysql2';

const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password  : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  });

 pool.getConnection(function(err,connection){
    if(err){ 
      console.error(err);
        return;
    }
    else
      console.log("Connected to database ");

    connection.release();
 });

let db =pool.promise();

export {db};