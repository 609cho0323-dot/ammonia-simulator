const startTemp = document.getElementById("startTemp");
const endTemp = document.getElementById("endTemp");
const pressure = document.getElementById("pressure");
const catalyst = document.getElementById("catalyst");

const startValue = document.getElementById("startValue");
const endValue = document.getElementById("endValue");
const pressureValue = document.getElementById("pressureValue");
const catalystValue = document.getElementById("catalystValue");

let chart;

// 슬라이더 값 표시
[startTemp, endTemp, pressure, catalyst].forEach(slider => {
    slider.addEventListener("input", updateLabels);
});

function updateLabels() {

    startValue.innerText = startTemp.value;
    endValue.innerText = endTemp.value;
    pressureValue.innerText = pressure.value;
    catalystValue.innerText = catalyst.value;
}

// 최적 조건 버튼
function applyOptimal() {

    startTemp.value = 500;
    endTemp.value = 400;
    pressure.value = 250;
    catalyst.value = 90;

    updateLabels();

    runSimulation();
}

// 시뮬레이션
function runSimulation() {

    const T1 = Number(startTemp.value);
    const T2 = Number(endTemp.value);
    const P = Number(pressure.value);
    const C = Number(catalyst.value);

    const avgT = (T1 + T2) / 2;

    // 온도 효과
    const tempEffect =
        Math.exp(
            -(Math.abs(avgT - 450)) / 90
        );

    // 압력 효과
    const pressureEffect =
        P / 300;

    // 촉매 효과
    const catalystEffect =
        C / 100;

    // 수율 계산
    let yieldValue =
        tempEffect *
        pressureEffect *
        catalystEffect *
        130;

    yieldValue =
        Math.min(100, yieldValue);

    // 등급 계산
    let grade = "C";

    if (yieldValue >= 85)
        grade = "A+";

    else if (yieldValue >= 70)
        grade = "A";

    else if (yieldValue >= 55)
        grade = "B";

    // 화면 출력
    document.getElementById("yieldValue")
        .innerText =
        yieldValue.toFixed(1) + "%";

    const gradeElement =
        document.getElementById("grade");

    gradeElement.innerText = grade;

    gradeElement.className = "grade";

    if (grade === "A+")
        gradeElement.classList.add("aplus");

    else if (grade === "A")
        gradeElement.classList.add("a");

    else if (grade === "B")
        gradeElement.classList.add("b");

    else
        gradeElement.classList.add("c");

    // 배지
    const badge =
        document.getElementById("badge");

    if (yieldValue >= 85) {

        badge.innerHTML =
            "🏅 최적화 성공!";

    } else {

        badge.innerHTML = "";
    }

    // 분석 결과
    createAnalysis(
        yieldValue,
        grade,
        P,
        C,
        T1,
        T2
    );

    // 그래프
    drawCurve(yieldValue);
}

// 자동 해석
function createAnalysis(
    yieldValue,
    grade,
    pressure,
    catalyst,
    T1,
    T2
) {

    let result = "";

    if (yieldValue >= 85) {

        result =
            `현재 조건은 암모니아 생성에 매우 유리합니다.<br><br>
            높은 압력과 높은 촉매 효율 덕분에 반응이 빠르게 진행되며,
            온도 조건 또한 적절하여 높은 수율이 예상됩니다.`;

    }

    else if (yieldValue >= 70) {

        result =
            `암모니아 생성이 비교적 효율적으로 진행되고 있습니다.<br><br>
            압력 또는 촉매 효율을 조금 더 높이면
            더 좋은 결과를 얻을 수 있습니다.`;

    }

    else if (yieldValue >= 55) {

        result =
            `암모니아 생성은 가능하지만 효율이 다소 낮습니다.<br><br>
            압력과 온도 조건을 재조정해보세요.`;

    }

    else {

        result =
            `현재 조건은 암모니아 생성에 불리합니다.<br><br>
            압력을 높이고 촉매 효율을 개선해보세요.`;

    }

    document.getElementById("analysis")
        .innerHTML =
        `
        예상 암모니아 수율 :
        <b>${yieldValue.toFixed(1)}%</b><br><br>

        공정 효율 :
        <b>${grade}</b><br><br>

        운전 조건 :
        ${T1}℃ → ${T2}℃ /
        ${pressure} atm /
        촉매효율 ${catalyst}%<br><br>

        ${result}
        `;
}

// 포화곡선 그래프
function drawCurve(finalYield) {

    const time = [
        0,1,2,3,4,5,6,7,8,9,10
    ];

    const data = time.map(t => {

        return finalYield /
            (
                1 +
                Math.exp(
                    -0.8 * (t - 4)
                )
            );

    });

    if (chart)
        chart.destroy();

    chart =
        new Chart(
            document.getElementById(
                "yieldChart"
            ),
            {

                type: "line",

                data: {

                    labels: time,

                    datasets: [

                        {
                            label:
                                "암모니아 생성량 변화",

                            data: data,

                            borderColor:
                                "#0ea5e9",

                            backgroundColor:
                                "rgba(14,165,233,0.2)",

                            fill: true,

                            tension: 0.4,

                            borderWidth: 4
                        }

                    ]
                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            display: true
                        }
                    },

                    scales: {

                        y: {

                            min: 0,

                            max: 100,

                            title: {

                                display: true,

                                text:
                                    "암모니아 수율 (%)"
                            }
                        },

                        x: {

                            title: {

                                display: true,

                                text:
                                    "반응 진행 시간"
                            }
                        }
                    }
                }
            }
        );
}

// 초기 실행
updateLabels();
runSimulation();