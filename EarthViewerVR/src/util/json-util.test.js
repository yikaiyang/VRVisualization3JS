import JSONUtil from './json-util'

test('Successful getProperty on valid json object with valid path', () => {
    const testJSON = {
        position: {
            latitude: 43,
            longitude: 32,
        }
    }

    let latitudeExists = JSONUtil.checkIfPropertyExists(testJSON, 'position.latitude');
    let longitudeExists = JSONUtil.checkIfPropertyExists(testJSON, 'position.longitude');

    expect(latitudeExists).toBe(true);
    expect(longitudeExists).toBe(true);
});

test('Successful getProperty on valid json object with valid path', () => {
    const testJSON = {
        position: {
            latitude: 43,
            longitude: 32,
        }
    }

    const expectedLatitude = testJSON.position.latitude;
    const expectedLongitude = testJSON.position.longitude;

    const resultLatitude = JSONUtil.getProperty(testJSON, 'position.latitude');
    const resultLongitude = JSONUtil.getProperty(testJSON, 'position.longitude');

    expect(resultLatitude).toBe(expectedLatitude);
    expect(resultLongitude).toBe(expectedLongitude);
});

test('Sucessful getProperty on valid hospital entry', () => {
    const testJSON =  {
        "\ufeffKA-Nr": "K319",
        "Bundesland": "Niederösterreich",
        "Bezirk": "Hollabrunn",
        "Versorgungszone": "Ost",
        "Versorgungsregion": "Weinviertel",
        "Bezeichnung": "Landesklinikum Hollabrunn",
        "Öffentlichkeitsrecht": "mit Öffentlichkeitsrecht",
        "Gemeinnützigkeit": "gemeinnützig",
        "Fondszugehörigkeit": "Landesfonds",
        "Adresse": "Robert Löffler-Straße 20, 2020 Hollabrunn",
        "Telefon, Fax": "02952/2275-0, 02952/2275-104",
        "Homepage": "http://www.hollabrunn.lknoe.at",
        "Ärztlicher Leiter": "Univ.-Doz. Prim. Dr. Rudolf Kuzmits",
        "Pflegedienstleiter": "DGKS Ingrid Czink",
        "Verwaltungsdirektor": "Dipl. KHBW Josef Schneider",
        "Bettenanzahl": "223",
        "Bettenführende Fachrichtungen": "AN, CH, GEM, GGH, IM, PSY",
        "Intensivbereiche": "AN, GEM, IM",
        "Großgeräte": "CT",
        "Träger-Nr.": "T301",
        "Träger Bezeichnung": "Amt der Niederösterreichischen Landesregierung, Abteilung Sanitäts- und Krankenanstaltenrecht",
        "Träger-Adresse": "Landhausplatz 1, 3109 St. Pölten",
        "Träger Telefon, Fax": "02742/9005, 02742/9005-12932",
        "Träger Homepage": "http://www.noel.gv.at",
        "departments": [
            {
                "HospitalID": "319",
                "categoryGER": "NaN",
                "categoryAUT": "",
                "Department": "All",
                "beds": "222",
                "doctorsgeneral": "NaN",
                "doctorsspecial": "NaN",
                "nurses": "NaN",
                "numberofstays": "NaN",
                "averagestayduration": "NaN",
                "address": "Robert Löffler-Straße 20, 2020 Hollabrunn"
            },
            {
                "HospitalID": "319",
                "categoryGER": "199",
                "categoryAUT": "GGH",
                "Department": "Abteilung für Frauenheilkunde und Geburtshilfe",
                "beds": "53",
                "doctorsgeneral": "NaN",
                "doctorsspecial": "NaN",
                "nurses": "NaN",
                "numberofstays": "1627",
                "averagestayduration": "2.62",
                "address": "Robert Löffler-Straße 20, 2020 Hollabrunn"
            },
            {
                "HospitalID": "319",
                "categoryGER": "169",
                "categoryAUT": "CH",
                "Department": "Chirurgische Abteilung",
                "beds": "60",
                "doctorsgeneral": "NaN",
                "doctorsspecial": "NaN",
                "nurses": "NaN",
                "numberofstays": "2594",
                "averagestayduration": "2.82",
                "address": "Robert Löffler-Straße 20, 2020 Hollabrunn"
            },
            {
                "HospitalID": "319",
                "categoryGER": "323",
                "categoryAUT": "IN CCU",
                "Department": "Herzüberwachung",
                "beds": "27",
                "doctorsgeneral": "NaN",
                "doctorsspecial": "NaN",
                "nurses": "NaN",
                "numberofstays": "328",
                "averagestayduration": "2.56",
                "address": "Robert Löffler-Straße 20, 2020 Hollabrunn"
            },
            {
                "HospitalID": "319",
                "categoryGER": "829",
                "categoryAUT": "PSY",
                "Department": "Abteilung für Sozialpsychiatrie",
                "beds": "62",
                "doctorsgeneral": "NaN",
                "doctorsspecial": "NaN",
                "nurses": "NaN",
                "numberofstays": "1185",
                "averagestayduration": "11.66",
                "address": "Robert Löffler-Straße 20, 2020 Hollabrunn"
            },
            {
                "HospitalID": "319",
                "categoryGER": "930",
                "categoryAUT": "IN AN",
                "Department": "Intensivbetreuung (Anästhesie)",
                "beds": "21",
                "doctorsgeneral": "NaN",
                "doctorsspecial": "NaN",
                "nurses": "NaN",
                "numberofstays": "94",
                "averagestayduration": "10.6",
                "address": "Robert Löffler-Straße 20, 2020 Hollabrunn"
            }
        ],
        "position": {
            "lat": 48.5629331,
            "lng": 16.09081100000003
        }
    };

    const expectedLatitude = testJSON.position.lat;
    const expectedLongitude = testJSON.position.lng;

    const resultLatitude = JSONUtil.getProperty(testJSON, 'position.latitude');
    const resultLongitude = JSONUtil.getProperty(testJSON, 'position.longitude');

    expect(resultLatitude).toBe(expectedLatitude);
    expect(resultLongitude).toBe(expectedLongitude);
})