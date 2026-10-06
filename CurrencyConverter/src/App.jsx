import React, { useState, useEffect } from 'react';
import CurrencySelect from './components/CurrencySelect';
import ConversionResult from './components/ConversionResult';

export default function App() {
  const [error, setError] = useState('');
  const [currencyList, setCurrencyList] = useState({});
  const [fromCurrencySelected, setFromCurrencySelected] = useState('');
  const [toCurrencySelected, setToCurrencySelected] = useState('');
  const [amount, setAmount] = useState(1);
  const [convertedValue, setConvertedValue] = useState('');

  const [favouriteList, setFavouriteList] = useState(() => {
    try {
      const saved = localStorage.getItem('fav_currencies');
      return saved ? JSON.parse(saved) : ['USD', 'EUR', 'INR'];
    } catch {
      return ['USD', 'EUR', 'INR'];
    }
  });

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('https://api.frankfurter.dev/v1/currencies');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setCurrencyList(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    localStorage.setItem('fav_currencies', JSON.stringify(favouriteList));
  }, [favouriteList]);

  const toggleFavorite = (code) => {
    if (!code) return;
    setFavouriteList((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code]
    );
  };

  const handleSwap = () => {
    setFromCurrencySelected(toCurrencySelected);
    setToCurrencySelected(fromCurrencySelected);
    setConvertedValue('');
  };

  const handleConversion = async () => {
    if (!fromCurrencySelected || !toCurrencySelected) {
      setError('Please select both currencies');
      return;
    }
    try {
      setError('');
      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${fromCurrencySelected}&to=${toCurrencySelected}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setConvertedValue(result.rates[toCurrencySelected]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border-2 border-gray-200 rounded-xl shadow-md bg-white">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        Currency Converter
      </h1>

      {error && <div className="text-red-500 text-xs mb-3">{error}</div>}

      <div className="flex flex-row items-center justify-between gap-3 py-2">
        <CurrencySelect
          label="From:"
          value={fromCurrencySelected}
          onChange={setFromCurrencySelected}
          currencyList={currencyList}
          favouriteList={favouriteList}
          onToggleFavorite={toggleFavorite}
          excludeCode={toCurrencySelected}
        />

        <button
          type="button"
          onClick={handleSwap}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-5 transition-colors"
          title="Swap currencies"
        >
          ⇌
        </button>

        <CurrencySelect
          label="To:"
          value={toCurrencySelected}
          onChange={setToCurrencySelected}
          currencyList={currencyList}
          favouriteList={favouriteList}
          onToggleFavorite={toggleFavorite}
          excludeCode={fromCurrencySelected}
        />
      </div>

      <div className="py-3 flex flex-col">
        <label className="text-gray-700 text-xs font-medium mb-1">
          Amount:
        </label>
        <input
          type="number"
          min="0"
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded px-4 py-1.5 text-sm transition-colors"
          onClick={handleConversion}
        >
          Convert
        </button>
      </div>

      <ConversionResult
        amount={amount}
        from={fromCurrencySelected}
        to={toCurrencySelected}
        value={convertedValue}
      />
    </div>
  );
}