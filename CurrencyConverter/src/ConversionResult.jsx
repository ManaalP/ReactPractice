import React from 'react';

export default function ConversionResult({ amount, from, to, value }) {
  if (!value) return null;

  return (
    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-right">
      <p className="text-sm font-semibold text-green-700">
        {amount} {from} = {value} {to}
      </p>
    </div>
  );
}