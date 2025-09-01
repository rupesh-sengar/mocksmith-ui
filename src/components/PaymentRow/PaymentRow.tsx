import React from "react";
import "./PaymentRow.scss";

export type PaymentRowProps = {
  name: string;
  due: string;
  amount: number;
};

const fmtINR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function PaymentRow({ name, due, amount }: PaymentRowProps) {
  return (
    <div className="payment-row">
      <div className="left">
        <div className="name">{name}</div>
        <div className="due">Due: {due}</div>
      </div>
      <div className="amt">{fmtINR.format(amount)}</div>
    </div>
  );
}
