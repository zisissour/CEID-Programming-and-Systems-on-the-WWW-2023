import {db} from './database.mjs'
import mysql from 'mysql'
import bcryptjs from 'bcryptjs';
import path from 'path';

async function registerUser(username, email, password) {
    let str = 'SELECT username, email FROM user WHERE username = ? OR email = ?';
    let query = mysql.format(str, [username, email]);
    let [user,_] = await db.query(query);

    if(Object.keys(user).length!==0) {
       return false;
    }
    else{
        str = 'INSERT INTO user VALUES (DEFAULT, ?,?,?,0,0,0,0,CURRENT_DATE)'
        query = mysql.format(str, [username, await bcryptjs.hash(password, 10), email]);
        await db.query(query);
        return true;
    }
};

async function userLogin(username, password){

        let str = 'SELECT password, admin_id FROM admin WHERE username = ?';
        let query = mysql.format(str, username);
        let [reply,_] = await db.query(query);

        if(Object.keys(reply).length!==0)
        {
            if(await bcryptjs.compare(password,reply[0].password))
            {
                console.log("Admin " +username + " logged in successfully");
                return {
                    success: true,
                    user_id: reply[0].admin_id,
                    type: "admin"
                };
            }            
            else
                return {
                    success: false,
                    user_id: "",
                    type: ""
                };
        }
    else
    {
        str = 'SELECT password, user_id FROM user WHERE username = ?';
        query = mysql.format(str, username);
        [reply,_] = await db.query(query);

        if(Object.keys(reply).length !==0)
        {
            if(await bcryptjs.compare(password,reply[0].password))
            {
                console.log("User " +username + " logged in successfully");
                return {
                    success: true,
                    user_id: reply[0].user_id,
                    type: "user"
                };
            }            
            else
                return {
                    success: false,
                    user_id: "",
                    type: ""
                };
        }
        else
        {
            return{
                success: false,
                user_id: "",
                type:""
            };
        }
    }

    

}

function checkAuth(req, res, next){

    if(req.session.username)
    {
        next();
    }
        
    else
        res.redirect('/');

}

async function registerAdmin(username, password){
    let str = 'SELECT username FROM admin WHERE username = ?';
    let query = mysql.format(str, username);
    let [user,_] = await db.query(query);

    if(Object.keys(user).length!==0) {
       return false;
    }
    else{
        str = 'INSERT INTO admin VALUES (DEFAULT, ?,?)'
        query = mysql.format(str, [username, await bcryptjs.hash(password, 10)]);
        await db.query(query);
        return true;
    }
}

async function getUsersData(){
    const query = 'SELECT username, total_score, tokens, last_month_tokens FROM user ORDER BY total_score DESC'

    try{
        const [result,_] = await db.query(query);
        return result;
    }
    catch(err){
        console.error(err);
        return {};
    }
}


export {getUsersData};
export {registerUser};
export {userLogin};
export {checkAuth};