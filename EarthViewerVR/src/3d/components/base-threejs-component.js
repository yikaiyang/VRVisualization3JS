/**
 * Base three js component class to bring render/lifecylce methods from aframe to threejs components
 * 
 * @see http://benfarrell.com/2017/07/14/a-bad-attitude-about-a-frame-i-was-wrong/
 */

class BaseThreeJSComponent {
    constructor (ascene){
        this.ascene = ascene;
        this.ascene.addBehavior(this);
        this.el = { isPlaying: true};
        this.init(ascene);
    }

    //Override these methods in the subclasses
    init(scene){

    }

    tick(time, delta){
        //console.log(time);
    }
    
}

export default BaseThreeJSComponent;