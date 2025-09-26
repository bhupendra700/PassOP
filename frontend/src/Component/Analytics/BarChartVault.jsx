import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function BarChartVault({ dataObject, backgroundColor, borderColor }) {
    const data = {
        labels: dataObject.labels,
        datasets: [
            {
                label: dataObject.label,
                data: dataObject.data,
                backgroundColor: dataObject.data.map((_, idx) => {
                    return backgroundColor[idx];
                }),
                borderColor: dataObject.data.map((_, idx) => {
                    return borderColor[idx];
                }),
                borderWidth: 1.5,
                borderRadius: 2,
                maxBarThickness: 80
            },
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#299f29", // legend text ka color
                    font: {
                        size: 18,
                        weight: "bold"
                    },
                    boxWidth: 0
                },
            }
        },
        onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? "pointer" : "default";
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
                grid: {
                    color: "transparent",       // grid lines invisible
                }
            },
            x: {
                grid: {
                    color: "transparent"
                },
                ticks: {
                    color: "black",      // x-axis label ka color
                    font: {
                        size: 15,        // x-axis label ka size
                        weight: "100"   // bold text
                    }
                },
            }
        }
    }

    return <Bar data={data} options={options} />
}

export default BarChartVault