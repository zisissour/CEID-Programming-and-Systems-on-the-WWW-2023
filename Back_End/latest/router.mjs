import  express  from "express";
import path from 'path';
import { getStoresData, insertStoreData, deleteStoreData } from "./stores.mjs";
import { checkAuth, registerUser,  userLogin, getUsersData } from "./users.mjs";
import {getSalesData, addSale, deleteSale, getSaleYears, getSalesCount, getAvgDiscount} from "./sales.mjs";
import { getCategoriesMenu, getSubcategoriesMenu, getShopsByCategory, getProductsMenu, getProductSuggestions } from "./dynamicmenu.mjs";
import { liked, disliked, outOfStock, inStock, ratings } from "./rating-page.mjs";
import { getUserData, getRatingHistory, getSalesHistory,changeUsername, changePassword } from "./user-profile.mjs";
import { deleteProductsData, insertProducts } from "./products.mjs";

const router = express.Router();


router.get('/', (req, res) => {
    res.redirect('/login.html');
});

router.get('/stores/getStoresData', async function(req, res){
    res.setHeader('Cache-Control', 'no-cache');
    res.send(await getStoresData());

});

router.get('/stores/getSalesData:id', async function(req, res){
    const id = req.params.id;
    res.setHeader('Cache-Control', 'no-store');
    res.send(await getSalesData(id));

});

router.get('/main.html',checkAuth, (req, res) => {

    res.setHeader('Cache-Control', 'no-cache');
    if(req.session.username.type === 'admin')
        res.sendFile(path.join(path.resolve(path.dirname('')) + '../../../Front_End/latest/html/main_admin.html'));
    else
        res.sendFile(path.join(path.resolve(path.dirname('')) + '../../../Front_End/latest/html/main.html'));       
});

router.get('/profile', checkAuth, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    if(req.session.username.type === 'admin'){
        res.sendFile(path.join(path.resolve(path.dirname('')) + '../../../Front_End/latest/html/profile_admin.html'));}
    else{
        res.sendFile(path.join(path.resolve(path.dirname('')) + '../../../Front_End/latest/html/user-profile.html'));}

})

router.get('/menu', async function(req, res) {
    res.setHeader('Cache-Control', 'max-age=604800');
    res.send(await getCategoriesMenu());
 
});

router.get('/menu/subcat', async function(req, res) {
    const id = req.query.id;
    if(req.query.id){
        res.setHeader('Cache-Control', 'max-age=604800');
        res.send(await getSubcategoriesMenu(id));}
    else
        res.send({});
});

router.get('/menu/products', async function(req, res) {
    const id = req.query.id;
    if(req.query.id){
        res.setHeader('Cache-Control', 'max-age=604800');
        res.send(await getProductsMenu(id));}
    else
        res.send({});
});

router.get('/menu/product', async function(req, res) {

    if(req.query.starts_with){
        const text = req.query.starts_with;
        res.setHeader('Cache-Control', 'max-age=604800');
        res.send(await getProductSuggestions(text));
    }
    else
        res.send({});
});

router.get('/menu/getShopsByCategory:id', async function(req,res)
{
    res.setHeader('Cache-Control', 'max-age=604800');
    const id = req.params.id;
    res.send(await getShopsByCategory(id));

});

router.get('/rating',checkAuth, async function(req,res)
{
    res.setHeader('Cache-Control', 'max-age=2678400');
    res.sendFile(path.join(path.resolve(path.dirname(''))+ '../../../Front_End/latest/html/rating.html'));
    
});

router.get('/sales', checkAuth, async function(req, res){
    res.setHeader('Cache-Control', 'max-age=2678400');
    res.sendFile(path.join(path.resolve(path.dirname('')) + '../../../Front_End/latest/html/sales.html'));
});

router.get('/deleteSale', checkAuth, async function(req, res){
    if(req.session.username.type === "admin"){
        deleteSale(req.query.sale_id);
    }
});

router.get('/admin/insertShops', checkAuth, async function(req, res){
    if(req.session.username.type === "admin"){
        const success = await insertStoreData();
        res.setHeader('Cache-Control', 'no-store');
        res.send({
            success: success
        });
    }
});

router.get('/admin/deleteShops', checkAuth, async function(req,res){
    if(req.session.username.type === "admin"){
        const success = await deleteStoreData();
        res.setHeader('Cache-Control', 'no-store');
        res.send({
            success: success
        });
    }
});

router.get('/admin/insertProducts', checkAuth, async function(req, res) {
    if(req.session.username.type === "admin"){
        const success = await insertProducts();
        res.setHeader('Cache-Control', 'no-store');
        res.send({ 
            success: success
        });
    }
});

router.get('/admin/deleteProducts', checkAuth, async function(req, res) {
    if(req.session.username.type === "admin"){
        const success = await deleteProductsData();
        res.setHeader('Cache-Control', 'no-store');
        res.send({ 
            success: success
        });
    }
});

router.get('/admin/usersData', checkAuth, async function (req, res){
    if(req.session.username.type === "admin"){
        res.setHeader('Cache-Control', 'no-cache');
        const data = await getUsersData();
        res.send(data);
    }
});

router.get('/admin/saleYears', checkAuth, async function (req, res){
        res.setHeader('Cache-Control', 'no-cache');
        res.send(await getSaleYears());
});

router.get('/admin/getSaleCount', checkAuth, async function (req, res) {
    if(req.session.username.type === 'admin') {
        res.setHeader('Cache-Control', 'no-store');
        res.send( await getSalesCount(req.query.year, req.query.month));
        
    }
});

router.get('/admin/getAvgDiscount', checkAuth, async function(req, res){
    if(req.session.username.type === 'admin') {
        res.setHeader('Cache-Control', 'no-store');
        res.send(await getAvgDiscount(req.query.cat_id, req.query.subcat_id, req.query.date));
    }
});

router.post('/register',async (req, res) => {
    const { username, email, password } = req.body;
    const success = await registerUser(username, email, password);
    if(success)
    {
        res.write(`<script>
            alert('Successfully registered');
            window.location.assign("/");
        </script>`);
    }
        
    else
    {
        res.write(`<script>
            alert('This username or email is already registered');
            window.location.assign("/signup.html");
        </script>`);  
    }      

});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const loginreply = await userLogin(username, password);
    if(loginreply.success)
    {
        req.session.username = loginreply;
        res.redirect('/main.html');
    }
        
    else{
        res.write(`<script>
            alert('Wrong Username or password')
            window.location.assign("/")
        </script>`);
    }  
    res.end();
        
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

router.post('/addSale', checkAuth, async function (req, res) {
    const {product_id, price, shop_id} = req.body;
    const result = await addSale(product_id, req.session.username.user_id, shop_id, price);
    res.setHeader('Cache-Control', 'no-store');
    res.send(result);
});

router.post('/liked:id', async function(req, res)
{
    const saleid = req.params.id;
    res.send(await liked(req.session.username.user_id,saleid));
    
}); 

router.post('/disliked:id', async function(req, res)
{
    const saleid = req.params.id;
    res.send(await disliked(req.session.username.user_id,saleid));

}); 

router.post('/instock:id', async function(req, res)
{
    const saleid = req.params.id;
    res.send(await inStock(saleid));
    
});

router.post('/outOfStock:id', async function(req, res)
{
    const saleid = req.params.id;
    res.send(await outOfStock(saleid));
    
});

router.get('/getRatings', async function(req, res)
{
    res.setHeader('Cache-Control', 'no-store');
    res.send(await ratings(req.session.username.user_id)) 
    console.log(req.session.username.user_id);
});

router.get('/userProfile', async function(req, res)
{
    res.setHeader('Cache-Control', 'max-age=2678400');
   // res.sendFile(path.join(process.env.DIRNAME + '../../../Front_End/latest/html/user-profile.html'));
    res.sendFile(path.join(path.resolve(path.dirname(''))+ '../../../Front_End/latest/html/user-profile.html'));
    
}
);

router.get('/getUserData', async function(req, res)
{

    res.setHeader('Cache-Control', 'no-cache');
    res.send(await getUserData(req.session.username.user_id));
    
}
);

router.post('/changeUsername', async (req, res) =>{
    const newUsrn = req.body.username;
    console.log(newUsrn);
    const success =await changeUsername(req.session.username.user_id,newUsrn);
    res.write(`<script>
            alert('Successfull username change');
            window.location.assign("/profile");
        </script>`);
    
})

router.post('/changePassword', async (req, res) =>{
    const newPassword = req.body.password;
    const success =await changePassword(req.session.username.user_id,newPassword);
    res.write(`<script>
            alert('Successfull password change');
            window.location.assign("/profile");
        </script>`);
    
})

router.get('/getSalesHistory', async function(req, res)
{
    res.setHeader('Cache-Control', 'no-cache');
    res.send(await getSalesHistory(req.session.username.user_id));
}
);

router.get('/getRatingHistory', async function(req, res)
{
    res.setHeader('Cache-Control', 'no-store');
    res.send(await getRatingHistory(req.session.username.user_id));
}
);


export {router};