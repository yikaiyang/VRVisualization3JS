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

    const resultLatitude = JSONUtil.getProperty(testJSON, 'position.lat');
    const resultLongitude = JSONUtil.getProperty(testJSON, 'position.lng');

    expect(resultLatitude).toBe(expectedLatitude);
    expect(resultLongitude).toBe(expectedLongitude);
})

test('Unsuccessful getProperty on valid json object with invalid path', () => {
    const testJSON = {
        position: {
            latitude: 43,
            longitude: 32,
        }
    }

    const resultLatitude = JSONUtil.getProperty(testJSON, 'position.longa.fasdf');
    const resultLongitude = JSONUtil.getProperty(testJSON, 'position.longitude.asdfs');

    expect(resultLatitude).toBe(undefined);
    expect(resultLongitude).toBe(undefined);
});

test('Sucessfully extract property from json Array', () => {
   const testJSON = {
        "data": [
            {
                "\ufeffKA-Nr": "K101",
                "Bundesland": "Burgenland",
                "Bezirk": "Oberwart",
                "Versorgungszone": "Süd",
                "Versorgungsregion": "Burgenland-Süd",
                "Bezeichnung": "Rehabilitationszentrum für Herz-Kreislauferkrankungen Bad Tatzmannsdorf",
                "Öffentlichkeitsrecht": "ohne Öffentlichkeitsrecht",
                "Gemeinnützigkeit": "nicht gemeinnützig",
                "Fondszugehörigkeit": "Sonstige",
                "Adresse": "Vogelsangweg 11, 7431 Bad Tatzmannsdorf",
                "Telefon, Fax": "03353/6000-0, 03353/6000-43510",
                "Homepage": "http://www.ska-badtatzmannsdorf.at",
                "Ärztlicher Leiter": "Prim. Prof. Dr. Herbert Laimer",
                "Pflegedienstleiter": "PDL Ingeborg Hutter",
                "Verwaltungsdirektor": "Dipl. KHBW Wolfgang Sandor",
                "Bettenanzahl": "166",
                "Bettenführende Fachrichtungen": "Rehabilitationszentrum (Interne)",
                "Intensivbereiche": "",
                "Großgeräte": "ECT",
                "Träger-Nr.": "T090",
                "Träger Bezeichnung": "Pensionsversicherungsanstalt Wien",
                "Träger-Adresse": "Friedrich-Hillegeist-Straße 1, 1021 Wien Postfach",
                "Träger Telefon, Fax": "01/050303, 01/050303-288 50",
                "Träger Homepage": "http://www.pensionsversicherung.at",
                "departments": []
            },
            {
                "\ufeffKA-Nr": "K102",
                "Bundesland": "Burgenland",
                "Bezirk": "Eisenstadt(Stadt)",
                "Versorgungszone": "Ost",
                "Versorgungsregion": "Burgenland-Nord",
                "Bezeichnung": "Krankenhaus der Barmherzigen Brüder Eisenstadt",
                "Öffentlichkeitsrecht": "mit Öffentlichkeitsrecht",
                "Gemeinnützigkeit": "gemeinnützig",
                "Fondszugehörigkeit": "Landesfonds",
                "Adresse": "Esterhazystraße 26, 7000 Eisenstadt",
                "Telefon, Fax": "02682/601-0, 02682/601-1099",
                "Homepage": "http://www.barmherzige-brueder.at",
                "Ärztlicher Leiter": "Prim. Dr. Mathias Resinger",
                "Pflegedienstleiter": "MAS Irene Zach",
                "Verwaltungsdirektor": "MBA MSc Robert Maurer",
                "Bettenanzahl": "384",
                "Bettenführende Fachrichtungen": "AN, CH, GGH, HNO, IM, KI, OR, PSY, UC",
                "Intensivbereiche": "AN, IM, KI",
                "Großgeräte": "COR, CT, ECT, MR",
                "Träger-Nr.": "T180",
                "Träger Bezeichnung": "Konvent der Barmherzigen Brüder Eisenstadt",
                "Träger-Adresse": "Esterhazystraße 26, 7000 Eisenstadt",
                "Träger Telefon, Fax": "02682/601-0, 02682/601-1099",
                "Träger Homepage": "http://www.barmherzige-brueder.at",
                "departments": [
                    {
                        "HospitalID": "102",
                        "categoryGER": "NaN",
                        "categoryAUT": "",
                        "Department": "All",
                        "beds": "420",
                        "doctorsgeneral": "NaN",
                        "doctorsspecial": "NaN",
                        "nurses": "NaN",
                        "numberofstays": "NaN",
                        "averagestayduration": "NaN",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "169",
                        "categoryAUT": "CH",
                        "Department": "Chirurgie - allgemein",
                        "beds": "46",
                        "doctorsgeneral": "16",
                        "doctorsspecial": "6",
                        "nurses": "35",
                        "numberofstays": "2248",
                        "averagestayduration": "5.32",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "199",
                        "categoryAUT": "GGH",
                        "Department": "Frauenheilkunde und Geburtshilfe",
                        "beds": "28",
                        "doctorsgeneral": "12",
                        "doctorsspecial": "4",
                        "nurses": "24",
                        "numberofstays": "2287",
                        "averagestayduration": "3.05",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "220",
                        "categoryAUT": "HNO",
                        "Department": "Hals-, Nasen- und Ohrenheilkunde - allgemein",
                        "beds": "21",
                        "doctorsgeneral": "10",
                        "doctorsspecial": "5",
                        "nurses": "20",
                        "numberofstays": "1607",
                        "averagestayduration": "3.05",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "323",
                        "categoryAUT": "IM",
                        "Department": "Innere Medizin I (Kardiologie und Nephrologie)",
                        "beds": "98",
                        "doctorsgeneral": "19",
                        "doctorsspecial": "8",
                        "nurses": "48",
                        "numberofstays": "10017",
                        "averagestayduration": "2",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "316",
                        "categoryAUT": "IM",
                        "Department": "Innere Medizin II (Gastroenterologie und Onkologie)",
                        "beds": "55",
                        "doctorsgeneral": "NaN",
                        "doctorsspecial": "NaN",
                        "nurses": "NaN",
                        "numberofstays": "NaN",
                        "averagestayduration": "NaN",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "930",
                        "categoryAUT": "IN AN",
                        "Department": "Intensivbetreuung (Anästhesiologie)",
                        "beds": "8",
                        "doctorsgeneral": "23",
                        "doctorsspecial": "16",
                        "nurses": "43",
                        "numberofstays": "354",
                        "averagestayduration": "7.34",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "369",
                        "categoryAUT": "KI",
                        "Department": "Kinder- und Jugendheilkunde - allgemein",
                        "beds": "25",
                        "doctorsgeneral": "12",
                        "doctorsspecial": "4",
                        "nurses": "20",
                        "numberofstays": "2118",
                        "averagestayduration": "1.66",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "366",
                        "categoryAUT": "KI",
                        "Department": "Neonatologie - allgemein",
                        "beds": "6",
                        "doctorsgeneral": "2",
                        "doctorsspecial": "2",
                        "nurses": "9",
                        "numberofstays": "344",
                        "averagestayduration": "4.91",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "699",
                        "categoryAUT": "OR",
                        "Department": "Orthopädie und orthopädische Chirurgie - allgemein",
                        "beds": "27",
                        "doctorsgeneral": "7",
                        "doctorsspecial": "6",
                        "nurses": "19",
                        "numberofstays": "1022",
                        "averagestayduration": "5.05",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "930",
                        "categoryAUT": "PAL",
                        "Department": "Palliativmedizinische Einrichtung",
                        "beds": "5",
                        "doctorsgeneral": "NaN",
                        "doctorsspecial": "NaN",
                        "nurses": "NaN",
                        "numberofstays": "NaN",
                        "averagestayduration": "NaN",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "829",
                        "categoryAUT": "PSY",
                        "Department": "Psychiatrie - allgemein",
                        "beds": "43",
                        "doctorsgeneral": "15",
                        "doctorsspecial": "5",
                        "nurses": "40",
                        "numberofstays": "NaN",
                        "averagestayduration": "NaN",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "930",
                        "categoryAUT": "TK GEM",
                        "Department": "Tagesklinik (Interdisziplinärer Bereich)",
                        "beds": "13",
                        "doctorsgeneral": "NaN",
                        "doctorsspecial": "NaN",
                        "nurses": "NaN",
                        "numberofstays": "NaN",
                        "averagestayduration": "NaN",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "166",
                        "categoryAUT": "UC",
                        "Department": "Unfallchirurgie - allgemein",
                        "beds": "38",
                        "doctorsgeneral": "10",
                        "doctorsspecial": "2",
                        "nurses": "21",
                        "numberofstays": "2548",
                        "averagestayduration": "4.2",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "339",
                        "categoryAUT": "IM",
                        "Department": "Innere Medizin I - allgemein",
                        "beds": "3",
                        "doctorsgeneral": "NaN",
                        "doctorsspecial": "NaN",
                        "nurses": "NaN",
                        "numberofstays": "NaN",
                        "averagestayduration": "NaN",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    },
                    {
                        "HospitalID": "102",
                        "categoryGER": "570",
                        "categoryAUT": "NEU",
                        "Department": "Akut-Nachbehandlung von neurologischen Patienten",
                        "beds": "2",
                        "doctorsgeneral": "NaN",
                        "doctorsspecial": "NaN",
                        "nurses": "NaN",
                        "numberofstays": "NaN",
                        "averagestayduration": "NaN",
                        "address": "Esterhazystraße 26, 7000 Eisenstadt"
                    }
                ],
                "position": {
                    "lat": 47.8460518,
                    "lng": 16.51482390000001
                }
            }
        ]
   };

   let properties = JSONUtil.extractPropertiesFromArrayAsList(testJSON.data, 'Bettenanzahl');
   expect(properties).toEqual([166,384]);
});