export default class UnitConversion {
    //Converts a unit (meter) from real word to the scaled equivalent version in THREEJS 
    toReal(threeUnit){
        return threeUnit * UnitConversion.scale;
    }

    toTHREE(realUnit){
        return realUnit / UnitConversion.scale;
    }

}

UnitConversion.scale = 1; 
