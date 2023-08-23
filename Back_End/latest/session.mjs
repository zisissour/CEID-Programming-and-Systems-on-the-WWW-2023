import session from "express-session";
import 'dotenv/config';
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

const appSession = session({
    secret: process.env.SECRET,
    store: new MemoryStore({checkPeriod: 86400*1000}),
    resave: false,
    saveUninitialized: true,
    name: "app-sid",
    cookie: {
        maxAge: 1000*60*20
    }
});

export {appSession};