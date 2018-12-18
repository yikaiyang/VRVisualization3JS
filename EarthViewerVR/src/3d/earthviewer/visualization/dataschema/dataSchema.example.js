/**
 * Example result of data after data processing.
 */

 const result = 
 {
    "data": [
        {
            // id contains an ideally unique identifier for the data entry.
            "id" : 'K101', 
            //title of the data entry. May be displayed in the visualization at a later point.
            "title" : 'Rehabilitationszentrum für Herz-Kreislauferkrankungen Bad Tatzmannsdorf', 
            // Properties field contains additional data about the data point.
            "properties": { 
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
                    }
                ]
            },
            //Position property contains geographical location of data entry.
            "position": {
                "lat": 47.8460518,
                "lon": 16.5148239
            },
            //Links describe the connection between this point and another point
            "links": [
                {
                    //Position of the other data point
                    "position": {
                        "lat": 47.8460518,
                        "lon": 16.5148239
                    },
                    "properties": { //Properties of links.
                        "color": '#DC143C'
                    }
                }
            ]
        }
    ]
 }