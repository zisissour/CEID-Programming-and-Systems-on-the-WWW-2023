import express from "express";
import {router} from "./router.mjs";
import 'dotenv/config';
import { appSession } from "./session.mjs";
import bodyParser from "body-parser";
import { checkAuth } from "./users.mjs";

const app = express();

app.use(express.json());
app.use(appSession);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static('../../Front_End/latest/css'));
app.use(express.static('../../Front_End/latest/js'));
app.use(express.static('../../Front_End/latest/img'));
app.use(express.static('../../Front_End/latest/html/public'));



app.use("/", router);

app.listen(process.env.PORT, ()=> {
    console.log('listening on port '+ process.env.PORT);
});

