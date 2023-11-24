// 차트 애니메이션 https://1drv.ms/v/s!Aj1vEAm1DVpfmvce_nqi_M9UGMgQ1w?e=TN43Cs

/* chart functions **********************************/
class dualSpline {
  constructor(target, a_name, b_name, a_color, b_color) {
    this.target = target;

    const _limitCount = 50;

    var a = new Array(_limitCount).fill(0);
    var b = new Array(_limitCount).fill(0);
    this.a = a;
    this.b = b;

    var chart = bb.generate({
      bindto: this.target,
      data: {
        x: "x",
        columns: [
          ["x",
            -9.8, -9.6, -9.4, -9.2, -9, -8.8, -8.6, -8.4, -8.2, -8,
            -7.8, -7.6, -7.4, -7.2, -7, -6.8, -6.6, -6.4, -6.2, -6,
            -5.8, -5.6, -5.4, -5.2, -5, -4.8, -4.6, -4.4, -4.2, -4,
            -3.8, -3.6, -3.4, -3.2, -3, -2.8, -2.6, -2.4, -2.2, -2,
            -1.8, -1.6, -1.4, -1.2, -1, -0.8, -0.6, -0.4, -0.2, 0
          ],
          ["a",
            a[49], a[48], a[47], a[46], a[45], a[44], a[43], a[42], a[41], a[40],
            a[39], a[38], a[37], a[36], a[35], a[34], a[33], a[32], a[31], a[30],
            a[29], a[28], a[27], a[26], a[25], a[24], a[23], a[22], a[21], a[20],
            a[19], a[18], a[17], a[16], a[15], a[14], a[13], a[12], a[11], a[10],
            a[9], a[8], a[7], a[6], a[5], a[4], a[3], a[2], a[1], a[0]
          ],
          ["b",
            b[49], b[48], b[47], b[46], b[45], b[44], b[43], b[42], b[41], b[40],
            b[39], b[38], b[37], b[36], b[35], b[34], b[33], b[32], b[31], b[30],
            b[29], b[28], b[27], b[26], b[25], b[24], b[23], b[22], b[21], b[20],
            b[19], b[18], b[17], b[16], b[15], b[14], b[13], b[12], b[11], b[10],
            b[9], b[8], b[7], b[6], b[5], b[4], b[3], b[2], b[1], b[0]
          ]
        ],
        type: "spline",
        names: {
          a: a_name,
          b: b_name,
        },
        colors: {
          a: a_color,
          b: b_color,
        },
      },
      tooltip: {
        show: false
      },
      point: {
        focus: {
          only: true,
        }
      },
      transition: {
        duration: 0
      },
      axis: {
        x: {
          tick: {
            values: [
              -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0
            ]
          }
        },
        y: {
          tick: {
            // stepSize:0.5
          }
        }
      }
    });

    setInterval(function () {
      for (var i = (_limitCount - 1); i > 0; i--) {
        a[i] = a[i - 1];
        b[i] = b[i - 1];
      }
      chart.load({
        columns: [
          ["a",
            a[49], a[48], a[47], a[46], a[45], a[44], a[43], a[42], a[41], a[40],
            a[39], a[38], a[37], a[36], a[35], a[34], a[33], a[32], a[31], a[30],
            a[29], a[28], a[27], a[26], a[25], a[24], a[23], a[22], a[21], a[20],
            a[19], a[18], a[17], a[16], a[15], a[14], a[13], a[12], a[11], a[10],
            a[9], a[8], a[7], a[6], a[5], a[4], a[3], a[2], a[1], a[0]
          ],
          ["b",
            b[49], b[48], b[47], b[46], b[45], b[44], b[43], b[42], b[41], b[40],
            b[39], b[38], b[37], b[36], b[35], b[34], b[33], b[32], b[31], b[30],
            b[29], b[28], b[27], b[26], b[25], b[24], b[23], b[22], b[21], b[20],
            b[19], b[18], b[17], b[16], b[15], b[14], b[13], b[12], b[11], b[10],
            b[9], b[8], b[7], b[6], b[5], b[4], b[3], b[2], b[1], b[0]
          ],
        ]
      });
    }, (10000 / _limitCount));
  }

  updateData(a0, b0) {
    this.a[0] = a0;
    this.b[0] = b0;
  }
}

class singleSpline {
  constructor(target, name, color) {
    this.target = target;

    const _limitCount = 50;

    var a = new Array(_limitCount).fill(0);
    this.a = a;

    var chart = bb.generate({
      bindto: this.target,
      data: {
        x: "x",
        columns: [
          ["x",
            -9.8, -9.6, -9.4, -9.2, -9, -8.8, -8.6, -8.4, -8.2, -8,
            -7.8, -7.6, -7.4, -7.2, -7, -6.8, -6.6, -6.4, -6.2, -6,
            -5.8, -5.6, -5.4, -5.2, -5, -4.8, -4.6, -4.4, -4.2, -4,
            -3.8, -3.6, -3.4, -3.2, -3, -2.8, -2.6, -2.4, -2.2, -2,
            -1.8, -1.6, -1.4, -1.2, -1, -0.8, -0.6, -0.4, -0.2, 0
          ],
          ["a",
            a[49], a[48], a[47], a[46], a[45], a[44], a[43], a[42], a[41], a[40],
            a[39], a[38], a[37], a[36], a[35], a[34], a[33], a[32], a[31], a[30],
            a[29], a[28], a[27], a[26], a[25], a[24], a[23], a[22], a[21], a[20],
            a[19], a[18], a[17], a[16], a[15], a[14], a[13], a[12], a[11], a[10],
            a[9], a[8], a[7], a[6], a[5], a[4], a[3], a[2], a[1], a[0]
          ]
        ],
        type: "spline",
        names: {
          a: name,
        },
        colors: {
          a: color,
        },
      },
      tooltip: {
        show: false
      },
      point: {
        focus: {
          only: true,
        }
      },
      transition: {
        duration: 0
      },
      axis: {
        x: {
          tick: {
            values: [
              -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0
            ]
          }
        },
        y: {
          tick: {
            // stepSize:0.5
          }
        }
      }
    });

    setInterval(function () {
      for (var i = (_limitCount - 1); i > 0; i--) {
        a[i] = a[i - 1];
      }
      chart.load({
        columns: [
          ["a",
            a[49], a[48], a[47], a[46], a[45], a[44], a[43], a[42], a[41], a[40],
            a[39], a[38], a[37], a[36], a[35], a[34], a[33], a[32], a[31], a[30],
            a[29], a[28], a[27], a[26], a[25], a[24], a[23], a[22], a[21], a[20],
            a[19], a[18], a[17], a[16], a[15], a[14], a[13], a[12], a[11], a[10],
            a[9], a[8], a[7], a[6], a[5], a[4], a[3], a[2], a[1], a[0]
          ]
        ]
      });
    }, (10000 / _limitCount));
  }

  updateData(a0) {
    this.a[0] = a0;
  }
}

var fm = new FluidMeter();
fm.init({
  targetContainer: document.getElementById("fluid-meter"),
  fillPercentage: 15,
  options: {
    fontSize: "70px",
    fontFamily: "Arial",
    fontFillStyle: "white",
    drawShadow: true,
    drawText: true,
    drawPercentageSign: true,
    drawBubbles: true,
    size: 300,
    borderWidth: 10,
    backgroundColor: "#e2e2e2",
    foregroundColor: "#fafafa",
    foregroundFluidLayer: {
      fillStyle: "purple",
      angularSpeed: 100,
      maxAmplitude: 12,
      frequency: 30,
      horizontalSpeed: -150
    },
    backgroundFluidLayer: {
      fillStyle: "pink",
      angularSpeed: 100,
      maxAmplitude: 9,
      frequency: 30,
      horizontalSpeed: 150
    }
  }
});


let chart1 = new dualSpline("#chart1", "Vi", "Vo");
let chart2 = new dualSpline("#chart2", "Ii", "Io");

setInterval(() => {
  chart1.updateData(localStorage.getItem("inputVoltage"), localStorage.getItem("outputVoltage"));
  chart2.updateData(localStorage.getItem("inputCurrent"), localStorage.getItem("outputCurrent"));
  
}, 200);

setInterval(()=>{
  fm.setPercentage(localStorage.getItem("chargingRate"));
});
