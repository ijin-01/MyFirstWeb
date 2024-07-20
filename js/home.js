// 차트 애니메이션 https://1drv.ms/v/s!Aj1vEAm1DVpfmvce_nqi_M9UGMgQ1w?e=TN43Cs

const countLimit = 21;

class DualLineChart {
  constructor(target, data1, data2, color1, color2) {
    this.target = target;
    this.data1 = data1;
    this.data2 = data2;
    this.color1 = color1;
    this._labels = [
      0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5, -4, -4.5, -5,
         -5.5, -6, -6.5, -7, -7.5, -8, -8.5, -9, -9.5, -10
    ];

    this._config = {
      type: 'line',
      data: {
        labels: this._labels,
        datasets: [{
          data: data1,
          borderColor: [color1],
          tension: 0.5,
          pointStyle: false,
        }, {
          data: data2,
          borderColor: [color2],
          tension: 0.5,
          pointStyle: false,
        }]
      },
      options: {
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            type: 'linear',
            max: 0,
            min: -10,
          }
        },
        animations: {

        }
      }
    }

    this.chart = new Chart(this.target, this._config);
  }

  updateChart() {
    this.chart.update();
  }
}

const inputVoltageColor = 'rgba(204, 157, 155, 1)';
const outputVoltageColor = 'rgba(222, 120, 148, 1)';

var inputVoltageList = new Array(countLimit).fill(0);
var outputVoltageList = new Array(countLimit).fill(0);

const voltageChart = new DualLineChart(document.getElementById('voltageChart'), inputVoltageList, outputVoltageList, inputVoltageColor, outputVoltageColor);

setInterval(() => {
  if (isConnected == true) {
    for (var i = (countLimit - 1); i > 0; i--) {
      inputVoltageList[i] = inputVoltageList[i - 1];
      outputVoltageList[i] = outputVoltageList[i - 1];
    }
    inputVoltageList[0] = localStorage.getItem("inputVoltage");
    outputVoltageList[0] = localStorage.getItem("outputVoltage");
    voltageChart.updateChart();
  }
}, 10500 / countLimit);