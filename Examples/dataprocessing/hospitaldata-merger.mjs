import fs from 'fs';
import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console({
        format: winston.format.simple()
    })]
})

//Load files
const hospitalDepartmentData = fs.readFileSync('./jsonData/BetterHosp.json');
const hospitalData = fs.readFileSync('./jsonData/HospitalData.json');
const addresses = fs.readFileSync('./jsonData/lookup_address.json');

//Convert to json object
let hospitalJsonData = JSON.parse(hospitalData.toString());
let hospitalDepartmentJsonData = JSON.parse(hospitalDepartmentData.toString());
let addressJsonData = JSON.parse(addresses.toString());

//console.log(jsonData);
const hospitalArray = hospitalJsonData.data;
const departmentArray = hospitalDepartmentJsonData.data;


hospitalArray.forEach(hospital => {
    const KANrKey = '\ufeffKA-Nr';
    console.log(hospital[KANrKey]);
    const KANr = hospital[KANrKey]; //KANr. incl. 'K' prefix e.g. 'K104'
    const address = hospital.Adresse;
    const onlyNumbersRegex = /[^\d*]+/g;
    const KANrWithoutPrefix = KANr.toString().replace(/[^\d*]+/g,'');

    //Filter out matching departments with correspondent ids.
    let matchingDepartments = departmentArray.filter(function (department){
        console.log(KANrWithoutPrefix);
        console.log(department.HospitalID + ' KNR:' + KANrWithoutPrefix);
        if (department.HospitalID === KANrWithoutPrefix){
            return true;
        }
    });

    if (matchingDepartments !== undefined){
        if (!hospital.departments){
            hospital.departments = [];
        }

        //console.log(matchingDepartments);
        hospital.departments = matchingDepartments;
    }

    //Filter out matching addresses and store latitude/longitude to hospital element
    const position = getAddressLookupInfo(address, addressJsonData);
    console.log('address: ' + position);
    hospital.position = position;
    console.log(hospital);
});

console.log(hospitalJsonData);

//write to file
fs.writeFileSync('./jsonData/result.json', JSON.stringify(hospitalJsonData));

/**
 * 
 * @param adress Return JSON object with geopositional data (latitude/longitude) if position is matching. otherwise empty
 */
function getAddressLookupInfo(address, lookupData){
    console.log(address);
    console.log(lookupData);
    if (!!address && !!lookupData && lookupData.hasOwnProperty(address)){
        logger.info('Found matching address:' + address);
        return lookupData[address];
    }
}

console.log(hospitalArray.length);
console.log(departmentArray.length);