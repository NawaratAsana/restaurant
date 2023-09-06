// import React from "react";
// import { Bar } from "react-chartjs-2";

// interface Order {
//   _id: string;
//   order_number: string;
//   total_amount: number;
//   order_date: string;
// }

// interface DailyRevenueChartProps {
//   orders: Record<string, Order>;
// }

// const DailyRevenueChart: React.FC<DailyRevenueChartProps> = ({ orders }) => {
//   // สร้างข้อมูลสำหรับ Chart.js
//   const chartData = {
//     labels: [], // รายชื่อของแต่ละวันที่
//     datasets: [
//       {
//         label: "Daily Revenue",
//         data: [], // ข้อมูลยอดรายได้รายวัน
//         backgroundColor: "rgba(75, 192, 192, 0.2)", // สีพื้นหลังของแท่งกราฟ
//         borderColor: "rgba(75, 192, 192, 1)", // สีขอบของแท่งกราฟ
//         borderWidth: 1, // ความหนาขอบของแท่งกราฟ
//       },
//     ],
//   };

//   // กำหนดค่าข้อมูลกราฟ Chart.js จากข้อมูลที่คุณมี
//   Object.values(orders).forEach((order) => {
//     const orderDate = new Date(order.order_date).toLocaleDateString("en-GB");
//     const orderAmount = order.total_amount;

//     chartData.labels.push(orderDate);
//     chartData.datasets[0].data.push(orderAmount);
//   });

//   // กำหนดตัวเลือกของกราฟ
//   const chartOptions = {
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Daily Revenue",
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <h2>Daily Revenue Chart</h2>
//       <Bar data={chartData} options={chartOptions} />
//     </div>
//   );
// };

// export default DailyRevenueChart;
