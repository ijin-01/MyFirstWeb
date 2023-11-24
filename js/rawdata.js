setInterval(() => {
  document.getElementById("inputVoltage").textContent = "Input Voltage = " + localStorage.getItem("inputVoltage");
  document.getElementById("outputVoltage").textContent = "Output Voltage = " + localStorage.getItem("outputVoltage");
  document.getElementById("inputCurrent").textContent = "Input Current = " + localStorage.getItem("inputCurrent");
  document.getElementById("outputCurrent").textContent = "Output Current = " + localStorage.getItem("outputCurrent");
  document.getElementById("batteryUsage").textContent = "Battery Usage = " + localStorage.getItem("batteryUsage");
  document.getElementById("fetTemp1").textContent = "FET Temp1 = " + localStorage.getItem("fetTemp1");
  document.getElementById("fetTemp2").textContent = "FET Temp2 = " + localStorage.getItem("fetTemp2");
  document.getElementById("fetTemp3").textContent = "FET Temp3 = " + localStorage.getItem("fetTemp3");
  document.getElementById("fetTemp4").textContent = "FET Temp4 = " + localStorage.getItem("fetTemp4");
  document.getElementById("battTemp").textContent = "Battery Temp = " + localStorage.getItem("battTemp");
  document.getElementById("extTemp").textContent = "External Temp = " + localStorage.getItem("extTemp");
  document.getElementById("extHumi").textContent = "External Humi = " + localStorage.getItem("extHumi");
  document.getElementById("chargingRate").textContent = "Charging Rate = " + localStorage.getItem("chargingRate");
  document.getElementById("efficiency").textContent = "Efficiency = " + localStorage.getItem("efficiency");
  document.getElementById("warnigCode").textContent = "Warnig Code = " + localStorage.getItem("warnigCode");
  document.getElementById("relayState").textContent = "Relay State = " + localStorage.getItem("relayState");
});