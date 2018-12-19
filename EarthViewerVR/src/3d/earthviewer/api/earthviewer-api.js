class EarthviewerAPI {
    changePosition(newPosition){
        if (!!newPosition){
            if (!!newPosition.latitude &&
                !!newPosition.altitude && 
                !!newPosition.longitude){
                EVENT_BUS.emit('earthviewer:positionChanged', newPosition);
            }
        }
    }

    enablePicking(mode = 'raycast'){
        EVENT_BUS.emit('earthviewer:pickingStatus', mode);
    }

    disablePicking(){
        EVENT_BUS.emit('earthviewer:pickingStatus', 'disabled');
    }
}

const API = new EarthviewerAPI();

function initGlobals(){
    window.changePosition = API.changePosition;
}
initGlobals();

export default API;
