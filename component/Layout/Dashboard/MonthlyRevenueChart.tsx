import moment from "moment";
import React, { useEffect, useState, useRef } from "react";

import Chart from "chart.js/auto";

interface PaymentStatus {
  payment_status: string;
}

interface Order {
  status: string;
  order_date: string;
  total_amount: number;
  payment: PaymentStatus;
}

interface MonthlyRevenueChartProps {
  orders: Order[];
}

const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({
  orders,
}) => {
  const orderDates: string[] = [];
  const monthlyRevenues: number[] = [];
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  let myChart: Chart | null = null;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const thaiMonth = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  useEffect(() => {

    if (chartRef.current) {
      destroyChart();
      createChart();
    }

    return () => destroyChart();
  }, [orders]);

  const createChart = () => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      orders.forEach((item: any) => {
        const month = moment(item.order_date).format("MMMM");
        console.log(month);
      });

      const currentDate = new Date();
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      for (let i = 1; i <= lastDayOfMonth; i++) {
        const currentDateStr = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          i
        ).toDateString();

        const dailyRevenue = orders
          .filter(
            (order) =>
              order.status === "completed" &&
              order.payment.payment_status === "ชำระเงินแล้ว" &&
              new Date(order.order_date).toDateString() === currentDateStr
          )
          .reduce((total, order) => total + order.total_amount, 0);

        orderDates.push(i.toString());
        monthlyRevenues.push(dailyRevenue);
      }

      const chartData = {
        labels: orderDates,
        datasets: [
          {
            label: "รายได้รายวัน",
            data: monthlyRevenues,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      };

      const chartOptions = {
        scales: {
          x: {
            title: {
              display: true,
              text: `เดือน${thaiMonth[currentMonth]}`,
            },
          },
          y: {
            title: {
              display: true,
              text: "รายได้รายวัน",
            },
          },
        },
      };

      myChart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions,
      });
    }
  };

  const destroyChart = () => {
    // ทำลายกราฟเดิม (ถ้ามี)
    if (myChart) {
      myChart.destroy();
      myChart = null;
    }
  };

  return (
    <div>
      <canvas id="monthlyRevenueChart" ref={chartRef} height="400px" width="1000px"></canvas>
    </div>
  );
};

export default MonthlyRevenueChart;
