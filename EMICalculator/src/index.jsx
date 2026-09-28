import React, { useState } from "react";
import "./styles.css";

import NumberInput from "./NumberInput";
import RangeInput from "./RangeInput";
import TenureSelector from "./TenureSelector";
import ResultRow from "./ResultRow";

const TENURE_OPTIONS = [12, 24, 36, 48, 60];

const Calculator = () => {
  const [tenure, setTenure] = useState(TENURE_OPTIONS[0]);

  const [inputs, setInputs] = useState({
    totalCost: 0,
    interestRate: 0,
    processingFees: 0,
    downPayment: 0,
  });

  const updateInput = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const { totalCost, interestRate, processingFees, downPayment } = inputs;

  const calculateEMI = (currentDownPayment = downPayment) => {
    const loanAmount = totalCost - currentDownPayment;
    const monthlyRate = interestRate / 1200;

    if (loanAmount <= 0) return 0;

    if (monthlyRate === 0) {
      return loanAmount / tenure;
    }

    return (
      loanAmount *
      monthlyRate *
      ((1 + monthlyRate) ** tenure /
        ((1 + monthlyRate) ** tenure - 1))
    );
  };

  const emi = calculateEMI();

  const totalLoanAmount = emi * tenure;

  const totalDownPayment =
    downPayment +
    ((totalCost - downPayment) * processingFees) / 100;

  const calculateDownPaymentFromEMI = (desiredEMI) => {
    const monthlyRate = interestRate / 1200;

    if (monthlyRate === 0) {
      return Math.max(0, totalCost - desiredEMI * tenure);
    }

    const factor =
      (monthlyRate * (1 + monthlyRate) ** tenure) /
      ((1 + monthlyRate) ** tenure - 1);

    const loanAmount = desiredEMI / factor;

    return Math.min(
      totalCost,
      Math.max(0, totalCost - loanAmount)
    );
  };

  return (
    <div>
      <h1>EMI Calculator</h1>

      <NumberInput
        label="Total Cost of Asset"
        value={totalCost}
        onChange={(value) => updateInput("totalCost", value)}
      />

      <NumberInput
        label="Interest Rate in PA%"
        value={interestRate}
        onChange={(value) => updateInput("interestRate", value)}
      />

      <NumberInput
        label="Processing Fee in %"
        value={processingFees}
        onChange={(value) =>
          updateInput("processingFees", value)
        }
      />

      <RangeInput
        label="Down Payment"
        min={0}
        max={totalCost}
        value={downPayment}
        onChange={(value) =>
          updateInput("downPayment", value)
        }
        leftLabel="0"
        rightLabel={totalCost}
        disabled={totalCost <= 0}
      />

      <ResultRow
        label="Total Down Payment (including fees)"
        value={totalDownPayment.toFixed(2)}
      />

      <h3>Tenure</h3>

      <TenureSelector
        options={TENURE_OPTIONS}
        value={tenure}
        onChange={setTenure}
      />

      <RangeInput
        label="EMI Amount"
        min={0}
        max={calculateEMI(0)}
        value={emi}
        onChange={(desiredEMI) => {
          const newDownPayment =
            calculateDownPaymentFromEMI(desiredEMI);

          updateInput("downPayment", newDownPayment);
        }}
        leftLabel="0"
        rightLabel={calculateEMI(0).toFixed(2)}
      />

      <ResultRow
        label="Total Loan Amount"
        value={totalLoanAmount.toFixed(2)}
      />
    </div>
  );
};

export default Calculator;