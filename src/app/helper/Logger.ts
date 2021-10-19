// //@ts-expect-error
// import { createLogger, transports, format } from 'winston'
// import 'winston-mongodb'
// import { Constant } from "../constants";
// // const {MONGO_URI, MONGO_PORT, DB_NAME} = Constant

// export default createLogger({
//     transports: [
//         new transports.Console(),

//         new transports.MongoDB({
//             level: 'error',
//             handleExceptions: true,
//             db: `mongodb+srv://infinity2020:infinity2020@infinity.7kj2a.gcp.mongodb.net/infinity_dev_qc?retryWrites=true&w=majority`,
//             options: { useUnifiedTopology: true },
//             collection: 'loggers',
//             format: format.combine(format.timestamp(), format.json())
//         })
//     ],
//     exitOnError: false
// })


