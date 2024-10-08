import React, { useState, useEffect } from 'react';
import '../css/styling.css'; // Adjust the path according to your project structure

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(filterHighestLifts(data)))
      .catch(err => console.error('Error fetching leaderboard:', err));
  }, []);

  const filterHighestLifts = (data) => {
    const highestLifts = {};
    data.forEach(row => {
      const exerciseName = row.Exercise.exercise_name;
      if (!highestLifts[exerciseName] || row.best_lift > highestLifts[exerciseName].best_lift) {
        highestLifts[exerciseName] = row;
      }
    });
    return Object.values(highestLifts);
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <table className="leaderboard">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>User</th>
            <th>Best Lift (kg)</th>
            <th>Reps</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((row, index) => (
            <tr key={index}>
              <td>{row.Exercise.exercise_name}</td>
              <td>{`${row.Workout.Customer.first_name} ${row.Workout.Customer.last_name}`}</td>
              <td>{row.best_lift}</td>
              <td>{row.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
