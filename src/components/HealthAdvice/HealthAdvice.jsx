import React from 'react';
import './HealthAdvice.css';
import { healthAdviceData } from '../../data/healthAdviceData';

function HealthAdvice({ levelData }) {
  if (!levelData) return null;

  const advices = healthAdviceData[levelData.level] || [];

  if (advices.length === 0) return null;

  return (
    <div className="health-advice-container">
      <div className="health-advice-header">
        <h3><i className="fa-solid fa-stethoscope"></i> คำแนะนำสุขภาพ</h3>
      </div>
      
      <div className="health-advice-grid">
        {advices.map((item, index) => (
          <div key={index} className="health-advice-card">
            
            <div className={`health-icon-wrapper ${levelData.class}`}>
              <i className={item.icon}></i>
            </div>
            
            <div className="health-text-content">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthAdvice;