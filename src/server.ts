// import {Constant, Errors, FoldersAndFiles} from "./app/constants"
// import socketIo from "socket.io"

import { DB } from './configs/DB'
// @ts-ignore
import server from './app/app'

server.listen(4000, async () => {

    //  mongoose.connect(DB_URI, DB_CONFIG)
    //  .then(() => {;
    // console.log('========= SPACECODE INDIA PRIVATE LIMITED ============')
    // console.log(`CONNECTED DATABASE ${DB_NAME}`)
    // console.log(`INFINITY SERVER STARTED ON PORT ${APP_PORT} temp port check ${process?.env?.APP_PORT}`)
    // console.log(`${DB_HOST} HOST ${process?.env?.DB_HOST}`)
    // console.log('========= SPACECODE INDIA PRIVATE LIMITED ============')
    // console.log("=== Version :", package_info.version, "========", "Description :", package_info.description, "===")
    // })
    //  .then(async() => {
    //     await (async function() {    //Automatically generate public upload folder.
    // const createdir = async (name: string): Promise<void> => { if(!fs.existsSync(name)) {await fs.mkdirSync(name); console.log(`=======${name} folder Created=======`)} }
    // await createdir(FoldersAndFiles.PUBLIC_DIR)
    // await createdir(FoldersAndFiles.UPLOADS_DIR)
    // await createdir(FoldersAndFiles.EXCELS_DIR)
    // await createdir(FoldersAndFiles.SKU_DIR)
    // await createdir(FoldersAndFiles.SKU_IMPORT_DIR)
    // await createdir(FoldersAndFiles.SKU_IMPORT_EXCEL_DIR)
    // }())
    // const indexes = await companyClientSettingModel.listIndexes()  //Todo remove this line
    // indexes.forEach(async({key, name}) => {
    //     const column = Object.keys(key)[0]
    //     if(column === 'companyId') await companyClientSettingModel.collection.dropIndex(name)
    // })
    // })
    //Todo move this whole section to initDB file...

    /*.then(async () => {
        await Promise.all([
            await aclModel.createCollection(), await aclModuleModel.createCollection(),
        ])
    })*/
    //  .then(async() => {
    ////@ts-expect-error
    // let count = await new RapPriceBusiness().findCountBB()    //Todo uncomment this in production. and check data from present monday then only not fetch or fetch new data.
    // if(count)){
    //     await new RapPriceBusiness().fetch('Round', 'init').then(() => console.log("Fetched Price of Round"))
    //     await new RapPriceBusiness().fetch('Pear', 'init').then(() => console.log("Fetched Price of Pear"))
    // }
    //  })
    //  .then(() => {
    console.log('*************                           *************')
    console.log('*************       App started...      *************')
    console.log('*************                           *************')

    //  console.clear()
    //  })
    //  .catch(err => {
    //     console.log(Errors.SERVER_RUNTIME_ERROR);
    //     console.log(err);
    //     console.log(Errors.TERMINATE_SERVER_PROCESS);
    //     process.exit(1);
    // });
    process.on('SIGINT', () => {
        console.log("terminating")
        DB.close();
        // console.log("................");
        process.exit(0)
        // process.kill(process.pid, 'SIGINT');
    })

    // process.on('exit', ()=>{
    //     console.log("shutdown");
    //     DB.close();
    //     process.abort()
    // })

    process.on('close', () => {
        console.log('Unexpected server shutdown');
    });
})
