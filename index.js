'use strict';
let reportType,reportYmdate,outputFolder;
if (process.argv.length <= 4) {
    console.log("Usage: node index.js [dev/qas/prod] [invent-rep] [ymdate (yyyymm)]");
    console.log("Usage example: node index.js dev invent-rep 201806");
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
const jsonexport = require("jsonexport/dist");
(async function () {
    try {
        var args={},result,file,xlsFile,csvfile;
        if (reportType==='invent-rep'){
            args.ymdate=reportYmdate;
            result = await sapSvc.getInventoryReport(args);
            //save json file
            file=outputFolder+"/"+reportType+"-"+reportYmdate+".json";
            jsonfile.writeFileSync(file,result["INVENT_REPORT"]);
            //save excel file
            xlsFile=outputFolder+"/"+reportType+"-"+reportYmdate+".xlsx";
            let xls = json2xls(result["INVENT_REPORT"]);
            require('fs').writeFileSync(xlsFile,xls, 'binary');
            //sve csv file
            csvfile=outputFolder+"/"+reportType+"-"+reportYmdate+".csv";
            jsonexport(result["INVENT_REPORT"],function(err,csv){
                if (err){
                    return console.error(err);
                } else {
                    require('fs').writeFileSync(csvfile,csv)
                }
            })
            

        }
    } catch (error) {
        console.error(error);
    } finally{
        process.exit(0);
    }
})()