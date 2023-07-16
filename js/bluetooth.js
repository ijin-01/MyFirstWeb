/*
 * 참조 
 * https://dawan0111.github.io/javascript/web-bluetooth-%ED%86%B5%EC%8B%A0/
 * https://github.com/loginov-rocks/Web-Bluetooth-Terminal
 */

const blue_btn = document.getElementById("blue_btn");

let driveService;

const SOH = 0x01;
const STX = 0x02;
const ETX = 0x03;

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

class StateMachine{
  constructor(State){
    this.State = State;
  }
}
const stateMachine = new StateMachine(enum_SM.enum_SM_STX);

class Bluetooth {
  constructor() {
    this.serviceUuid = 0xffe0;
    this.characteristicUuid = 0xffe1;
  }

  _PacketCheck(data) {
    console.log(data);

    let ErrorState = 0;
    
    switch (stateMachine.State) {
      case enum_SM.enum_SM_STX:
        stateMachine.State = (data === STX) ? enum_SM.enum_SM_CODE : enum_SM.enum_SM_STX;
        console.log("STX 수신");
        break;

      case enum_SM.enum_SM_CODE:
        console.log("CODE로 넘어감");
        break;

      case enum_SM.enum_SM_LENGTH:
        break;

      case enum_SM.enum_SM_DATA:
        break;

      case enum_SM.enum_SM_CHECKSUM:
        break;

      case enum_SM.enum_SM_ETX:
        break;

      default:
        stateMachine.State = enum_SM.enum_SM_STX;
        break;
    }

    return ErrorState;
  }

  connect() {
    navigator.bluetooth.requestDevice({
      filters: [{
        services: [this.serviceUuid]
      }]
    })
      .then(device => {
        return device.gatt.connect();
      })
      .then(server => {
        return server.getPrimaryService(this.serviceUuid);
      })
      .then(service => {
        driveService = service;
        return driveService.getCharacteristic(this.characteristicUuid);
      })
      .then(characteristic => {
        characteristic.startNotifications().
          then(() => {
            characteristic.addEventListener('characteristicvaluechanged', event => {
              const values = new Uint8Array(event.target.value.buffer);

              for (const c of values) {
                this._PacketCheck(c);
              }              
            });
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
}

const bluetooth = new Bluetooth();

blue_btn.addEventListener("click", () => {
  bluetooth.connect();

});

document.getElementById("send_btn").addEventListener("click", () => {

});

setInterval(function () {
  var Vi = Math.round(Math.random() * 20) / 10 + 10;
  localStorage.setItem("inputVoltage", Vi);

  var Vo = Math.round(Math.random() * 20) / 10 + 10;
  localStorage.setItem("outputVoltage", Vo);

  var Ii = Math.round(Math.random() * 10) / 10 + 6;
  localStorage.setItem("inputCurrent", Ii);

  var Io = Math.round(Math.random() * 10) / 10 + 5.5;
  localStorage.setItem("outputCurrent", Io);

}, 200);
