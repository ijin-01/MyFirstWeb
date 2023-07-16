setInterval(function() {
  document.getElementById("inputVoltage").textContent = "Input Voltage = " + localStorage.getItem("inputVoltage");
  document.getElementById("outputVoltage").textContent = "Output Voltage = " + localStorage.getItem("outputVoltage");
  document.getElementById("inputCurrent").textContent = "Input Current = " + localStorage.getItem("inputCurrent");
  document.getElementById("outputCurrent").textContent = "Output Current = " + localStorage.getItem("outputCurrent");
  
}, 200);