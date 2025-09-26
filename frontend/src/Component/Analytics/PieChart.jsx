import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({dataObject , backgroundColor , borderColor}) {
    const data = {
        labels: dataObject.labels,
        datasets: [
            {
                label: dataObject.label,
                data: dataObject.data,
                backgroundColor: dataObject.data.map((_ , idx)=>{
                    return backgroundColor[idx];
                }),
                borderColor: dataObject.data.map((_ , idx)=>{
                    return borderColor[idx];
                }),
                borderWidth: 2,
                hoverOffset: 12,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: { size: 14, weight: "100" },
                    color: "black"
                }
            },
            title: {
                display: true,
                text: dataObject.label, 
                font: {
                    size: 18,
                    weight: "bold"
                },
                color: "#299f29",
                position: "top"
            }
        },
        onHover : (event , chartElement)=>{
            event.native.target.style.cursor = chartElement[0] ? "pointer" : "default"
        }
    };

    return <Pie data={data} options={options} />;
}
