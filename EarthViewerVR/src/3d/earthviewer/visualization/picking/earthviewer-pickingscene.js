import PickingScene from './pickingscene'

export default class EarthviewerPickingScene extends PickingScene{
    constructor(){
        this._handleEvents();
        super();
    }

    _handleEvents(){
        if (!!EVENT_BUS){
            //Register events
            EVENT_BUS.on(
                'earthviewer:rotationChanged',
                (args) => {
                    this._handleRotationChanged(args)
                }, this);        
        } else {
            console.error('Event bus could not be accessed.');
        }
    }

    _handleRotationChanged(args){
        if (!!args){
            let quaternion = args.quaternion; //Rotation as quaternion matrix
            let rotation = args.rotation;     //Rotation in euler form
            if (!!quaternion){
                this._group.setRotationFromQuaternion(quaternion); 
            } else if (!!rotation){
                this._group.setRotationFromEuler(rotation);
            }
            this._group.updateMatrix();
        }
    }

}