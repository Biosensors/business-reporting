'use strict';
let reportType,reportYmdate,outputFolder;
if (process.argv.length <= 4) {
    console.log("Usage: node index.js [dev/qas/prod] [invent-rep] [ymdate (yyyymm)]");
	process.exit(-1);
} else {
    let env = process.argv[2];
	require('./backend/services/appConfig').getInstance().setEnv(env);
    reportType = process.argv[3];
    reportYmdate = process.argv[4];
    outputFolder="./output"
}
const sapSvc =require('./backend/services/sapService');
const jsonfile =require('jsonfile');
const json2xls = require('json2xls');
(async function () {
    try {
        var args={},result,file,xlsFile;
        if (reportType==='invent-rep'){
            args.ymdate=reportYmdate;
            result = await sapSvc.getInventoryReport(args);
            file=outputFolder+"/"+reportType+"-"+reportYmdate+".json";
            jsonfile.writeFileSync(file,result["INVENT_REPORT"]);
            xlsFile=outputFolder+"/"+reportType+"-"+reportYmdate+".xlsx";
            let xls = json2xls(result["INVENT_REPORT"]);
            require('fs').writeFileSync(xlsFile,xls, 'binary');
        }
    } catch (error) {
        console.error(error);
    } finally{
        process.exit(0);
    }
})()