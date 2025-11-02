// components/AttendanceSummary.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceSummary = ({ data, detailed = false }) => {
  const { summary, recentRecords } = data;
  
  // Determine color based on attendance percentage
  let attendanceColor = '#007bff'; // Blue for >= 80%
  if (summary.attendancePercentage < 80) {
    attendanceColor = '#ffc107'; // Yellow for 75-80%
  }
  if (summary.attendancePercentage < 75) {
    attendanceColor = '#dc3545'; // Red for < 75%
  }

  const chartData = {
    labels: ['Present', 'Absent', 'Leave'],
    datasets: [
      {
        data: [summary.presentDays, summary.absentDays, summary.leaveDays],
        backgroundColor: [
          '#28a745',
          '#dc3545',
          '#ffc107'
        ],
        borderColor: [
          '#28a745',
          '#dc3545',
          '#ffc107'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '70%',
  };

  return (
    <div className="container-fluid py-4">
      <h4 className="mb-4 text-white bg-dark p-3 rounded" style={{ textAlign: "center" }}>Attendance Summary (Last 30 Days)</h4>
      
      <div className="d-flex flex-wrap justify-content-around align-items-center gap-4">
        
        {/* Chart Box */}
        <div className="position-relative" style={{ width: "250px", height: "250px" }}>
          <Doughnut data={chartData} options={options} />
          <div 
            className="position-absolute top-50 start-50 translate-middle fw-bold"
            style={{ fontSize: "32px", color: attendanceColor }}
          >
            {summary.attendancePercentage}%
          </div>
        </div>
        
        {/* Stats Box */}
        <div className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded">
            <span className="fw-bold">Total Days:</span>
            <span className="fw-bold">{summary.totalDays}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded">
            <span className="fw-bold text-success">Present:</span>
            <span className="fw-bold">{summary.presentDays}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded">
            <span className="fw-bold text-danger">Absent:</span>
            <span className="fw-bold">{summary.absentDays}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded">
            <span className="fw-bold text-warning">Leave:</span>
            <span className="fw-bold">{summary.leaveDays}</span>
          </div>
        </div>
      </div>

      {/* Detailed Records */}
      {detailed && recentRecords && recentRecords.length > 0 && (
        <div className="mt-4">
          <h5>Recent Attendance Records</h5>
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map(record => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span 
                        className={`badge fw-bold ${
                          record.status === "present"
                            ? "bg-success"
                            : record.status === "absent"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceSummary;
