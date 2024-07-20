/*
 * 참조 
 * https://dawan0111.github.io/javascript/web-bluetooth-%ED%86%B5%EC%8B%A0/
 * https://github.com/loginov-rocks/Web-Bluetooth-Terminal
 */

const blue_search_btn = document.getElementById("blue_search_btn");
const blue_dis_btn = document.getElementById("blue_dis_btn");

let isConnected = false;

const SOH = 0x01;
const STX = 0x02;
const ETX = 0x03;

const ERROR_STATE_CODE = 1;
const ERROR_STATE_LENGTH = 2;
const ERROR_STATE_DATA = 3;
const ERROR_STATE_CHECKSUM = 4;
const ERROR_STATE_TAIL = 5;

const DATA_REQ = 0x01;
const DATA_SET_REQ = 0x02;
const DATA_RESP = 0x11;
const DATA_SET_RESP = 0x12;

const enum_SM = { // 레거시 코드(java)의 enum 대체
    enum_SM_STX: 0,
    enum_SM_CODE: 1,
    enum_SM_LENGTH: 2,
    enum_SM_DATA: 3,
    enum_SM_CHECKSUM: 4,
    enum_SM_ETX: 5,
    enum_SM_PARSING: 6
};
Object.freeze(enum_SM); // 변하지 않도록 동결

class Header {
    constructor(Head, Code, Length) {
        this.Head = Head;
        this.Code = Code;
        this.Length = Length;
    }
}

class Tailer {
    constructor(Checksum, Tail) {
        this.Checksum = Checksum;
        this.Tail = Tail;
    }
}

class Message {
    constructor(Head, Body, Tail) {
        this.Head = Head;
        this.Body = Body;
        this.Tail = Tail;
    }
}
let message = new Message(new Header(0, 0, 0), [], new Tailer(0, 0));

/**
 * 상태, 길이, 계수, 버퍼, 체크섬
 */
class StateMachine {
    constructor(State, Length, PacketCount, Buffer, Checksum) {
        this.State = State;
        this.Length = Length;
        this.PacketCount = PacketCount;
        this.Buffer = Buffer;
        this.Checksum = Checksum;
    }
}
let stateMachine = new StateMachine(enum_SM.enum_SM_STX, 0, 0, [], 0);

function isCode(code) {
    let Result = Boolean(false);
    switch (code) {
        case DATA_REQ:
        case DATA_SET_REQ:
        case DATA_RESP:
        case DATA_SET_RESP:
            Result = true;
            break;
    }
    return Result;
}

class Bluetooth {
    constructor() {
        this._serviceUuid = 0xffe0;
        this._characteristicUuid = 0xffe1;

        this._maxCharacteristicValueLength = 20; // Max characteristic value length.
        this._device = null; // Device object cache.
        this._characteristic = null; // Characteristic object cache.

        this._boundHandleDisconnection = this._handleDisconnection.bind(this);
        this._boundHandleCharacteristicValueChanged = this._handleCharacteristicValueChanged.bind(this);
    }

    _PacketCheck(data) {
        let ErrorState = 0;

        switch (stateMachine.State) {
            case enum_SM.enum_SM_STX:
                stateMachine.State = (data === STX) ? enum_SM.enum_SM_CODE : enum_SM.enum_SM_STX;
                message = new Message(new Header(0, 0, 0), [], new Tailer(0, 0));
                stateMachine.PacketCount = 0;
                stateMachine.Checksum = 0;
                stateMachine.Buffer = [];
                stateMachine.Buffer[stateMachine.PacketCount++] = data;
                break;

            case enum_SM.enum_SM_CODE:
                if (isCode(data)) {
                    stateMachine.State = enum_SM.enum_SM_LENGTH;
                    stateMachine.Buffer[stateMachine.PacketCount++] = data;
                    stateMachine.Checksum += data;
                }
                else {
                    stateMachine.State = enum_SM.enum_SM_STX;
                    ErrorState = ERROR_STATE_CODE;
                }
                break;

            case enum_SM.enum_SM_LENGTH:
                stateMachine.Length = data;
                stateMachine.State = (data === 0) ? enum_SM.enum_SM_CHECKSUM : enum_SM.enum_SM_DATA;
                stateMachine.Buffer[stateMachine.PacketCount++] = data;
                stateMachine.Checksum += data;

                if (stateMachine.Length >= stateMachine.Buffer.Length) {
                    stateMachine.State = enum_SM.enum_SM_STX;
                    ErrorState = ERROR_STATE_LENGTH;
                }

                break;

            case enum_SM.enum_SM_DATA:
                stateMachine.Buffer[stateMachine.PacketCount++] = data;
                stateMachine.Checksum += data;

                /** 
                 * AVR에서 tSM->ucState = (tSM->iRxPacektCount - sizeof(T_HEADER)) < tSM->ucLength ? E_SM_DATA : E_SM_CHECKSUM;
                 * 으로 작성되어 있으며, "sizeof(T_HEADER))"를 "3"으로 대체함
                 * */
                stateMachine.State = (stateMachine.PacketCount - 3) < stateMachine.Length
                    ? enum_SM.enum_SM_DATA
                    : enum_SM.enum_SM_CHECKSUM;
                break;

            case enum_SM.enum_SM_CHECKSUM:
                if (((data + stateMachine.Checksum) & 0xff) === 0) {
                    stateMachine.State = enum_SM.enum_SM_ETX;
                    stateMachine.Buffer[stateMachine.PacketCount++] = data;
                } else {
                    stateMachine.State = enum_SM.enum_SM_STX;
                    ErrorState = ERROR_STATE_CHECKSUM;
                }
                break;

            case enum_SM.enum_SM_ETX:
                stateMachine.State = (data === ETX) ? enum_SM.enum_SM_PARSING : enum_SM.enum_SM_STX;
                stateMachine.Buffer[stateMachine.PacketCount++] = data;
                this._PacketProcess();
                break;

            default:
                stateMachine.State = enum_SM.enum_SM_STX;
                break;
        }

        return ErrorState;
    }

    _SaveRecievedData(){
        let inputVoltage  = (stateMachine.Buffer[4] * 0x100 + stateMachine.Buffer[3]) / 10;
        let inputCurrent  = (stateMachine.Buffer[6] * 0x100 + stateMachine.Buffer[5]) / 10;
        let outputVoltage = (stateMachine.Buffer[8] * 0x100 + stateMachine.Buffer[7]) / 10;
        let outputCurrent = (stateMachine.Buffer[10] * 0x100 + stateMachine.Buffer[9]) / 10;
        let batteryUsage  = (stateMachine.Buffer[12] * 0x100 + stateMachine.Buffer[11]) + 
                            (stateMachine.Buffer[14] * 0x100 + stateMachine.Buffer[13]) / 1000;
        let fetTemp1      = (stateMachine.Buffer[16] * 0x100 + stateMachine.Buffer[15]) / 10;
        let fetTemp2      = (stateMachine.Buffer[18] * 0x100 + stateMachine.Buffer[17]) / 10;
        let fetTemp3      = (stateMachine.Buffer[20] * 0x100 + stateMachine.Buffer[19]) / 10;
        let fetTemp4      = (stateMachine.Buffer[22] * 0x100 + stateMachine.Buffer[21]) / 10;
        let battTemp      = (stateMachine.Buffer[24] * 0x100 + stateMachine.Buffer[23]) / 10;
        let extTemp       = (stateMachine.Buffer[26] * 0x100 + stateMachine.Buffer[25]) / 10;
        let extHumi       = (stateMachine.Buffer[28] * 0x100 + stateMachine.Buffer[27]) / 10;
        let chargingRate  = (stateMachine.Buffer[30] * 0x100 + stateMachine.Buffer[29]) / 10;
        let efficiency    = (stateMachine.Buffer[32] * 0x100 + stateMachine.Buffer[31]) / 10;
        let warnigCode    = stateMachine.Buffer[33];
        let relayState    = stateMachine.Buffer[34];
        
        localStorage.setItem("inputVoltage", inputVoltage);
        localStorage.setItem("inputCurrent", inputCurrent);
        localStorage.setItem("outputVoltage", outputVoltage);
        localStorage.setItem("outputCurrent", outputCurrent);
        localStorage.setItem("batteryUsage", batteryUsage);
        localStorage.setItem("fetTemp1", fetTemp1);
        localStorage.setItem("fetTemp2", fetTemp2);
        localStorage.setItem("fetTemp3", fetTemp3);
        localStorage.setItem("fetTemp4", fetTemp4);
        localStorage.setItem("battTemp", battTemp);
        localStorage.setItem("extTemp", extTemp);
        localStorage.setItem("extHumi", extHumi);
        localStorage.setItem("chargingRate", chargingRate);
        localStorage.setItem("efficiency", efficiency);
        localStorage.setItem("warnigCode", warnigCode);
        localStorage.setItem("relayState", relayState);
    }

    _PacketProcess(){
        if(stateMachine.State === enum_SM.enum_SM_PARSING){
            message.Head.Head = stateMachine.Buffer[0];
            message.Head.Code = stateMachine.Buffer[1];
            message.Head.Length = stateMachine.Buffer[2];

            switch(message.Head.Code){
                case DATA_RESP:
                    this._SaveRecievedData();
                    break;
                case DATA_SET_RESP:
                    break;
            }

            stateMachine.State = enum_SM.enum_SM_STX;
        }
    }

    connect() {
        return this._connectToDevice(this._device);
    }

    disconnect() {
        this._disconnectFromDevice(this._device);

        if (this._characteristic) {
            this._characteristic.removeEventListener('characteristicvaluechanged',
                this._boundHandleCharacteristicValueChanged);
            this._characteristic = null;
            isConnected = false;
        }

        this._device = null;
    }
  
    /**
     * Send data to the connected device.
     * @param {string} data - Data
     * @return {Promise} Promise which will be fulfilled when data will be sent or
     *                   rejected if something went wrong
     */
    send(data) {
        // Return rejected promise immediately if data is empty.
        if (!data) {
            return Promise.reject(new Error('Data must be not empty'));
        }

        // Return rejected promise immediately if there is no connected device.
        if (!this._characteristic) {
            return Promise.reject(new Error('There is no connected device'));
        }

        // Split data to chunks by max characteristic value length.
        const chunks = [];
        for(let i = 0; i < data.length; i += this._maxCharacteristicValueLength){   // https://stackoverflow.com/questions/8495687/split-array-into-chunks/8495740#8495740
            const chunk = data.slice(i, i + this._maxCharacteristicValueLength);
            chunks[i / this._maxCharacteristicValueLength] = chunk;
        }

        // Write first chunk to the characteristic immediately.
        let promise = this._characteristic.writeValue(new Uint8Array(chunks[0]));

        // Iterate over chunks if there are more than one of it.
        for(let j = 1; j < chunks.length; j++){
            // Chain new promise.
            promise = promise.then(() => new Promise((resolve, reject) => {
                // Reject promise if the device has been disconnected.
                if (!this._characteristic) {
                    reject(new Error('Device has been disconnected'));
                }

                // Write chunk to the characteristic and resolve the promise.
                this._characteristic.writeValue(new Uint8Array(chunks[j])).
                    then(resolve).
                    catch(reject);
            }));
        }

        return promise;
    }

    /**
     * Connect to device.
     * @param {Object} device
     * @return {Promise}
     * @private
     */
    _connectToDevice(device) {
        return (
            device ? Promise.resolve(device) : this._requestBluetoothDevice()).
            then((device) => this._connectDeviceAndCacheCharacteristic(device)).
            then((characteristic) => {
                this._startNotifications(characteristic);
                // blue_search_btn.innerHTML = '<span class="material-symbols-rounded"> bluetooth_disabled </span>';
            }).
            catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    }

    /**
     * Disconnect from device.
     * @param {Object} device
     * @private
     */
    _disconnectFromDevice(device) {
        if (!device) {
            return;
        }

        device.removeEventListener('gattserverdisconnected', this._boundHandleDisconnection);

        if (!device.gatt.connected) {
            return;
        }

        device.gatt.disconnect();

        blue_search_btn.style.visibility = 'visible';
        blue_search_btn.style.width = '3rem';

        blue_dis_btn.style.visibility = 'hidden';
        blue_dis_btn.style.width = '0';
    }

    /**
     * Request bluetooth device.
     * @return {Promise}
     * @private
     */
    _requestBluetoothDevice() {
        return navigator.bluetooth.requestDevice({
            filters: [{
                services: [this._serviceUuid]
            }]
        }).then(device => {
            this._device = device;
            this._device.addEventListener('gattserverdisconnected', this._boundHandleDisconnection);

            return this._device;
        });
    }

    /**
     * Connect device and cache characteristic.
     * @param {Object} device
     * @return {Promise}
     * @private
     */
    _connectDeviceAndCacheCharacteristic(device) {
        if (device.gatt.connected && this._characteristic) {
            return Promise.resolve(this._characteristic);
        }

        return device.gatt.connect().
            then((server) => {
                return server.getPrimaryService(this._serviceUuid);
            }).
            then((service) => {
                return service.getCharacteristic(this._characteristicUuid);
            }).
            then((characteristic) => {
                this._characteristic = characteristic;

                return this._characteristic;
            });
    }

    /**
     * Start notifications.
     * @param {Object} characteristic
     * @return {Promise}
     * @private
     */
    _startNotifications(characteristic) {
        return characteristic.startNotifications().
            then(() => {
                characteristic.addEventListener('characteristicvaluechanged',
                    this._boundHandleCharacteristicValueChanged);
                    
                isConnected = true;

                blue_search_btn.style.visibility = 'hidden';
                blue_search_btn.style.width = '0';

                blue_dis_btn.style.visibility = 'visible';
                blue_dis_btn.style.width = '3rem';
            });
    }
    
    /**
     * Handle disconnection.
     * @param {Object} event
     * @private
     */
    _handleDisconnection(event) {
        isConnected = false;
        const device = event.target;

        console.log('"' + device.name +
            '" bluetooth device disconnected, trying to reconnect...');

        this._connectDeviceAndCacheCharacteristic(device).
            then((characteristic) => {
                this._startNotifications(characteristic);
            }).
            catch((error) => {
                console.log(error);
                
                this._device = null;
                
                blue_search_btn.style.visibility = 'visible';
                blue_search_btn.style.width = '3rem';

                blue_dis_btn.style.visibility = 'hidden';
                blue_dis_btn.style.width = '0';
            });
    }

    /**
     * Handle characteristic value changed.
     * @param {Object} event
     * @private
     */
    _handleCharacteristicValueChanged(event) {
        const value = new Uint8Array(event.target.value.buffer);
        
        for (const c of value) {
            this._PacketCheck(c);
        }
    }
}
