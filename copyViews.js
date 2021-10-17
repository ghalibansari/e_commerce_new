var ncp = require('ncp').ncp;
 
ncp.limit = 16;

(async()=>{
    await ncp('./src/views', './dist/views');
    await ncp('./src/public', './dist/public');
})();
