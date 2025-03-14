import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const data = [
    { name: 'Stress Fractures ', value: 400 },
    { name: 'others', value: 100 },
    { name: 'PathologicFractures', value: 300 },
  { name: 'Fragility Fractures', value: 200 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RechartsPieChart = () => (
  <PieChart width={480} height={400} >
    <Pie
      data={data}
      cx={230}
      cy={150}
      labelLine={true}
      label={({ name, percent }) =>
        `${name} ${(percent * 100).toFixed(0)}%`
      }
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
  </PieChart>
);

export default RechartsPieChart;
