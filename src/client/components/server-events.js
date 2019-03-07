
class ServerEvents {
    constructor() {
        //this.ws = new WebSocket('ws://'+document.location.host+'/ws',['arduino']);
        //this.ws.binaryType = "arraybuffer";

        this.es = new EventSource(DEVELOPMENT ? `http://${REMOTE_EVENTS_URL}` : EVENTS_URL);
    }

    //onWsOpen = (callback) => {
    //    this.ws.onopen = (e) => {
    //        callback(e);
    //    }
    //}

    //onWsClose = (callback) => {
    //    this.ws.onclose = (e) => {
    //        callback(e);
    //    }
    //}

    //onWsError = (callback) => {
    //    this.ws.onerror = (err) => {
    //        console.error("ws error", err);
    //        callback(err);
    //    }
    //}

    //onWsMessage = (callback) => {
    //    this.ws.onmessage = (e) => {
    //        let msg = '';
    //        if (e.data instanceof ArrayBuffer){
    //            const buf = new Uint8Array(e.data);
    //            msg = String.fromCharCode(...buf);
    //        }else{
    //            msg = e.data;
    //        }
    //        callback(msg);
    //    }
    //}

    onOpen = (callback) => {
        this.es.onopen = (e) => {
            callback(e);
        }
    }

    onError = (callback) => {
        this.es.onerror = (e) => {
            callback(e);
        }
    }

    onMessage = callback => {
        this.es.onmessage = (e) => {
            callback(e.data);
        }
    }

    onOtaMessage = (callback) => {
        this.es.addEventListener('ota', e => {
            callback(e.data);
        })
    }
}

const serverEvents = new ServerEvents();

export {serverEvents}