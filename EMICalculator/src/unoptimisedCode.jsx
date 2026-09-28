import React, { useState } from "react";
import "./styles.css";
const TENURE_OPTIONS = [12, 24, 36, 48, 60];
const Calculator = () => {
  const [tenure, setTenure] = useState(TENURE_OPTIONS[0]);
  const [emiObject, setEmiObject] = useState({
    totalCost: "0",
    interestRate: "0",
    processingFees: "0",
    downPayment: "0",
    totalLoanAmount: "0",
    maxLoanAmount: "0",
  });
  const calculateDownPayment = () => {
    return Number(
      emiObject.downPayment +
        ((emiObject.totalCost - emiObject.downPayment) *
          emiObject.processingFees) /
          100,
    ).toFixed(2);
  };
  const calculateLoanAmount = (downPayment) => {
    return Number(
      (emiObject.totalCost - downPayment) *
        (emiObject.interestRate / 1200) *
        ((1 + emiObject.interestRate / 1200) ** tenure /
          ((1 + emiObject.interestRate / 1200) ** tenure - 1)),
    ).toFixed(2);
  };
  const totalLoanCalc = () => {
    return Number(calculateLoanAmount(emiObject.downPayment) * tenure).toFixed(
      2,
    );
  };
  const calculateDownPaymentFromEMI = (emi) => {
    const rate = Number(emiObject.interestRate) / 1200;

    if (rate === 0) {
      return Number(emiObject.totalCost) - emi * tenure;
    }

    const factor = (rate * (1 + rate) ** tenure) / ((1 + rate) ** tenure - 1);

    return Number(emiObject.totalCost) - emi / factor;
  };
  return (
    <div>
      <h1>EMI Calculator</h1>
      <div className="inputField">
        <h3>Total Cost of Asset</h3>
        <input
          type="number"
          value={emiObject.totalCost}
          onChange={(e) => {
            setEmiObject((prevValue) => ({
              ...prevValue,
              totalCost: e.target.value,
            }));
          }}
        ></input>
      </div>
      <div className="inputField">
        <h3>Interest Rate in PA%</h3>
        <input
          type="number"
          value={emiObject.interestRate}
          onChange={(e) => {
            setEmiObject((prevValue) => ({
              ...prevValue,
              interestRate: e.target.value,
            }));
          }}
        ></input>
      </div>
      <div className="inputField">
        <h3>Processing Fee in %</h3>
        <input
          type="number"
          value={emiObject.processingFees}
          onChange={(e) => {
            setEmiObject((prevValue) => ({
              ...prevValue,
              processingFees: e.target.value,
            }));
          }}
        ></input>
      </div>
      <h3>Down Payment</h3>
      <div className="inputField">
        <input
          type="range"
          min={0}
          max={Number(emiObject.totalCost) || 0}
          value={Number(emiObject.downPayment) || 0}
          disabled={!emiObject.totalCost || Number(emiObject.totalCost) <= 0}
          onChange={(e) => {
            const nextVal = Number(e.target.value);
            setEmiObject((prevValue) => ({
              ...prevValue,
              downPayment: nextVal,
            }));
          }}
        />
        <div className="inputSlider">
          <span>0</span>
          <span>{emiObject.downPayment}</span>
          <span>100%</span>
        </div>
      </div>
      <div className="inputFlexRow">
        <h3 className="under">Total Down Payment (including fees) </h3>
        <h3>{calculateDownPayment()}</h3>
      </div>
      <h3>Tenure</h3>
      <div>
        {TENURE_OPTIONS.map((t) => {
          return (
            <button
              key={t}
              onClick={() => setTenure(t)}
              className={t === tenure ? "selected" : ""}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div className="inputField">
        <h3>EMI Amount</h3>
        <input
          type="range"
          min={0}
          max={Number(calculateLoanAmount(0)) || 0}
          value={Number(calculateLoanAmount(emiObject.downPayment)) || 0}
          onChange={(e) => {
            const emi = Number(e.target.value);
            const newDownPayment = calculateDownPaymentFromEMI(emi);

            setEmiObject((prevValue) => ({
              ...prevValue,
              downPayment: newDownPayment,
            }));
          }}
        />
        <div className="inputSlider">
          <span>0</span>
          <span>{calculateLoanAmount(emiObject.downPayment)}</span>
          <span>100%</span>
        </div>
      </div>
      <div className="inputFlexRow">
        <h3 className="under">Total Loan amount</h3>
        <h3>{totalLoanCalc()}</h3>
      </div>
    </div>
  );
};

export default Calculator;
