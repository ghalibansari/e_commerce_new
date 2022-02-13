import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import expressLayouts from 'express-ejs-layouts';
import session from "express-session";
import path from 'path';
import { Constant } from "./constants";
import { queryParser } from "./helper/QueryParser";
import { registerRoutes } from "./routes";
import { registerViewRoutes } from "./viewRoutes";



class App {
    app: Application;
    constructor() {
        this.app = express()
        this.middleware();
        // this.app.use('/api', this.setupApiRoutes);
        this.setupApiRoutes();
        // this.setupWebRoute(); //TODO: remove old admin routes and files.
        setTimeout(() => this.setupCron(), 30000);
    }

    /**
     * Add all middleware
     */
    private middleware(): void {
        this.app.use(cors());
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
        this.app.use(queryParser());
        // const env: Environment = new Environment();
        // this.app.use(session({ secret: env.getConfiguration().jwt_secret }));
        this.app.use(session({ secret: Constant.secret_key, saveUninitialized: true, resave: true }));//Todo find saveUninitialized n resave on google
        // this.app.use(express.json());    //json parser.
        // this.app.use((req, res, next) => {
        //     //@ts-expect-error
        //     req = JSON.parse(req.query);
        //     next();
        // });    //json parser.
        // this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.static(path.join(__dirname, '../public')));
        // this.app.use(bodyParser.json({limit: "150mb"}));
        // this.app.use(bodyParser.urlencoded({limit: "150mb", extended: true, parameterLimit: 150000}));
        // this.app.use('/api/v1/public/excel', guard, express.static(path.join(__dirname + '/../public/excel')));
        // this.app.use(
        //     express.static(__dirname + '/../public/uploads/wishlist_logo'),
        //     express.static(__dirname + '/../public/uploads/im_master'),
        //     express.static(__dirname + '/../public/uploads/company'),
        //     // express.static(__dirname + '/../public/uploads/company/signature'),
        //     express.static(__dirname + '/../public/uploads/event_lead')
        // );
        // app.use((req, res, next)=>{console.log(req.originalUrl, "req.originalUrl", req.method, "req.method"); next()})
    }

    /**
     * Register all routes
     */
    private setupApiRoutes(): void {
        // @ts-ignore
        // this.app.router(registerRoutes(this.app))
        registerRoutes(this.app);
    }

    /**
     * Register all routes
     */
    private setupWebRoute(): void {
        this.app.set("views", path.join(__dirname, "../views"));
        this.app.set("view engine", "ejs");
        this.app.use(expressLayouts);
        registerViewRoutes(this.app);
        // this.app.all('/*', (req: Request, res: Response) => res.sendFile(path.join(__dirname, '../web/build', 'index.html')))   //website here.
        // this.app.all('*', (req: Request, res: Response) => res.redirect('/'))   //website here.
    }

    /**
     * Register all crons
     */
    private setupCron(): void {
        // fetchPriceJobs().then()
        // activityHistoryJobs().then()
        // diamondMatchJobs().then()
        // updateIavEffectiveDate().then() 
        // powerBiReportGenerate().then()
    }
}


export default new App().app;
