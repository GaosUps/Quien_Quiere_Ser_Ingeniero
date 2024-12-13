import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";
const RankingBarChart = ({ data }) => {
  const sortedData = [...data].sort(
    (a, b) => b.animatedScore - a.animatedScore 
  ).slice(0,3);
  // Aplicar estilos y tamaños personalizados a los Top 3
  const formattedData = sortedData.map((entry, index) => ({
    ...entry,
    fill:
      index === 0
        ? "#FFD700"
        : index === 1
        ? "#C0C0C0"
        : index === 2
        ? "#CD7F32"
        : "#8884d8",
    barSize: index === 0 ? 70 : 50, // El tamaño de la barra principal
  }));
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
        <XAxis dataKey="name" stroke="#fff" />

        <Tooltip
          contentStyle={{ backgroundColor: "#333", border: "none" }}
          labelStyle={{ color: "#fff" }}
        />
        <Bar
          dataKey="animatedScore"
          fill="#8884d8"
          label={{ position: "top", fill: "#fff" }}
          animationDuration={1000}
        >
          {formattedData.map((entry, index) => (
            <rect
              key={`bar-${index}`}
              fill={entry.fill}
              height={entry.barSize}
              className={index === 0 ? 'animate-pulse' : ''}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
export default RankingBarChart;
