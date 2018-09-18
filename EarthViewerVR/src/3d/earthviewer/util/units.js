/**
 * @author Yikai Yang
 * Converts between units in THREEJS and real world units.
 * Scaling is applied to remove z-buffer issues over large distances (in zoomed out state. the earth is 6700000 units away)
 */
export default class Units {
    //Converts a unit (meter) from real word to the scaled equivalent version in THREEJS 
    static toReal(threeUnit){
        return threeUnit * Units.scale;
    }

    static toTHREE(realUnit){
        return realUnit / Units.scale;
    }

}

Units.scale = 1; 
