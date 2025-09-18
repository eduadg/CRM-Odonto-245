import React from 'react';
import './SimpleChart.css';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartData[];
  title?: string;
  type?: 'bar' | 'line' | 'donut';
  height?: number;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  title,
  type = 'bar',
  height = 200
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  const renderBarChart = () => (
    <div className="chart-container" style={{ height }}>
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="chart-bar-group">
            <div
              className="chart-bar"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#4f46e5'
              }}
            >
              <div className="chart-value">{item.value}</div>
            </div>
            <div className="chart-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="0.5"
            points={points}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="#4f46e5"
              />
            );
          })}
        </svg>
        <div className="chart-labels">
          {data.map((item, index) => (
            <div key={index} className="chart-label">{item.label}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="chart-container donut-container" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 42 42">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke={item.color || `hsl(${index * 60}, 70%, 50%)`}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="donut-segment"
              />
            );
          })}
        </svg>
        <div className="donut-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="simple-chart">
      {title && <h4 className="chart-title">{title}</h4>}
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
      {type === 'donut' && renderDonutChart()}
    </div>
  );
};

export default SimpleChart;
