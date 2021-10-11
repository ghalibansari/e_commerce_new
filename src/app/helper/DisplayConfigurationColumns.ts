// import {Request, Response, NextFunction} from 'express'
// //@ts-expect-error
// import {DisplayConfigurationController} from "../modules/display-configuration/display-configuration.controller";
// //@ts-expect-error
// import {DisplayConfigurationRepository} from "../modules/display-configuration/display-configuration.repository";


// // const DisplayConfigurationColumn = async (req: Request, res: Response, next: NextFunction, displayName: string): Promise<void> => {
// const DisplayConfigurationColumn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     console.log('..........////////////////......................................',req.originalUrl)
//     // if(!req?.query?.column){
//     if(req){
//         console.log('hellllloooooooooooooooooooooooooooooooooooooooooooooo')
//         const url: string = req.originalUrl
//         if(url.includes('/api/v1/sku/index')){
//             console.log('ttttttttttttttttttttttttttttttttttttttttt')
//             // req.query.filters = '[{"key":"screen","value":"InventoryInventories"}]'
//         }


//         let {query, query: {filters}, body: {loggedInUser: {companyId, roleId, _id}}} = req as any
//         let data: any[] = [], page = 0, tempFilters: any[] = []

//         if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
//             filters = JSON.parse(filters)
//             tempFilters = [...filters]
//             filters = [...filters, {key: 'userId', "value": _id}, {"key":"screen","value":"InventoryInventories"}]
//             query.filters = await JSON.stringify(filters)
//             await console.log(req.query.filters,';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
//         }
//         else{
//             req.query.filters = await JSON.stringify([{key: 'userId', "value": _id}, {key:"screen", value:"InventoryInventories"}])
//             await console.log(req.query.filters,';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
//         }

//         const data1: any = await new DisplayConfigurationRepository().index(query)
//         console.log(data1,'..........................................')
//         console.log(data,'..........................................')
//         if(data1?.data?.length) {
//             data = data1.data
//             page = data1.page
//         }

//         if(!data?.length) {
//             filters = []
//             filters = [...tempFilters, {key: 'companyId', "value": companyId}, {key: 'roleId', "value": roleId}]//userId is here also
//             query.filters = JSON.stringify(filters)
//             const data2: any = await new DisplayConfigurationRepository().index(query)
//             console.log(data2,'..........................................')
//             console.log(data,'..........................................')
//             if(data2?.data?.length) {
//                 data = data2?.data
//                 page = data2?.page
//             }
//             if(!data?.length) data.push({config: await new DisplayConfigurationRepository().defaultConfiguration(query)})
//         }
//         let datax = data[0].config.map((x: any) => x.valKey)
//         req.query.column = datax;
//         req.query.filters = JSON.stringify([...tempFilters])
//         console.log(datax, '/////////////////////////////////////////////////////////////////////.............................')
//         res.send(data);
//     }
//     next();
// }

// export default DisplayConfigurationColumn;