
import React from 'react';
import './ActivityItem.scss';

export type ActivityItemProps = {
  color?: string;
  title: string;
  time: string;
};

export default function ActivityItem({ color = '#22c55e', title, time }: ActivityItemProps): JSX.Element {
  return (
    <div className="activity-item">
      <span className="dot" style={{ background: color }} />
      <div className="content">
        <div className="title">{title}</div>
        <div className="time">{time}</div>
      </div>
    </div>
  );
}
