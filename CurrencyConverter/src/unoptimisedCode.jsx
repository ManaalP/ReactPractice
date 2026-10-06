import React, { useState, useEffect } from 'react';

function App() {
  const [error, setError] = useState('');
  const [currencyList, setCurrencyList] = useState({});
  const [toCurrencySelected, setToCurrencySelected] = useState('');
  const [fromCurrencySelected, setFromCurrencySelected] = useState('');
  const [amount, setAmount] = useState(1);
  const [convertedValue, setConvertedValue] = useState('');

  // Favorites stored as an array of currency codes
  const [favouriteList, setFavouriteList] = useState(() => {
    try {
      const saved = localStorage.getItem('fav_currencies');
      return saved ? JSON.parse(saved) : ['USD', 'EUR', 'INR'];
    } catch {
      return ['USD', 'EUR', 'INR'];
    }
  });

  useEffect(() => {
    currencies();
  }, []);

  useEffect(() => {
    localStorage.setItem('fav_currencies', JSON.stringify(favouriteList));
  }, [favouriteList]);

  const currencies = async () => {
    try {
      let response = await fetch('https://api.frankfurter.dev/v1/currencies');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      let result = await response.json();
      setCurrencyList(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFavorite = (code) => {
    if (!code) return;
    setFavouriteList((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code]
    );
  };

  const conversion = async () => {
    if (!fromCurrencySelected || !toCurrencySelected) {
      setError('Please select both currencies');
      return;
    }
    try {
      setError('');
      // Frankfurter v1 latest rates endpoint
      let response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${fromCurrencySelected}&to=${toCurrencySelected}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let result = await response.json();
      setConvertedValue(result.rates[toCurrencySelected]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper to split currencies into favorites & remaining
  const getRenderOptions = (excludeCode) => {
    const allCodes = Object.keys(currencyList).filter((c) => c !== excludeCode);
    const favorites = allCodes.filter((c) => favouriteList.includes(c));
    const others = allCodes.filter((c) => !favouriteList.includes(c));
    return { favorites, others };
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border-2 border-gray-200 rounded-xl shadow-md bg-white">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        Currency Converter
      </h1>

      {error && <div className="text-red-500 text-xs mb-3">{error}</div>}

      <div className="flex flex-row items-center justify-between gap-3 py-2">
        {/* FROM DROPDOWN */}
        <div className="flex-1 flex flex-col">
          <label className="text-gray-700 text-xs font-medium mb-1">
            From:
          </label>
          <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-purple-400">
            {/* Star button to the left of the dropdown */}
            <button
              type="button"
              disabled={!fromCurrencySelected}
              onClick={() => toggleFavorite(fromCurrencySelected)}
              className={`mr-1 text-base transition-colors ${
                !fromCurrencySelected
                  ? 'text-gray-300 cursor-not-allowed'
                  : favouriteList.includes(fromCurrencySelected)
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-gray-400 hover:text-amber-400'
              }`}
              title={
                favouriteList.includes(fromCurrencySelected)
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              {favouriteList.includes(fromCurrencySelected) ? '★' : '☆'}
            </button>

            <select
              value={fromCurrencySelected}
              onChange={(e) => setFromCurrencySelected(e.target.value)}
              className="w-full bg-transparent outline-none text-sm cursor-pointer"
            >
              <option value="">Select currency</option>
              {getRenderOptions(toCurrencySelected).favorites.length > 0 && (
                <optgroup label="★ Favorites">
                  {getRenderOptions(toCurrencySelected).favorites.map((c) => (
                    <option key={c} value={c}>
                     {c} - {currencyList[c]}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All Currencies">
                {getRenderOptions(toCurrencySelected).others.map((c) => (
                  <option key={c} value={c}>
                    {c} - {currencyList[c]}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* SWAP BUTTON */}
        <button
          onClick={() => {
            setFromCurrencySelected(toCurrencySelected);
            setToCurrencySelected(fromCurrencySelected);
            setConvertedValue('');
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-5 transition-colors"
          title="Swap currencies"
        >
          ⇌
        </button>

        {/* TO DROPDOWN */}
        <div className="flex-1 flex flex-col">
          <label className="text-gray-700 text-xs font-medium mb-1">To:</label>
          <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-purple-400">
            {/* Star button to the left of the dropdown */}
            <button
              type="button"
              disabled={!toCurrencySelected}
              onClick={() => toggleFavorite(toCurrencySelected)}
              className={`mr-1 text-base transition-colors ${
                !toCurrencySelected
                  ? 'text-gray-300 cursor-not-allowed'
                  : favouriteList.includes(toCurrencySelected)
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-gray-400 hover:text-amber-400'
              }`}
              title={
                favouriteList.includes(toCurrencySelected)
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              {favouriteList.includes(toCurrencySelected) ? '★' : '☆'}
            </button>

            <select
              value={toCurrencySelected}
              onChange={(e) => setToCurrencySelected(e.target.value)}
              className="w-full bg-transparent outline-none text-sm cursor-pointer"
            >
              <option value="">Select currency</option>
              {getRenderOptions(fromCurrencySelected).favorites.length > 0 && (
                <optgroup label="★ Favorites">
                  {getRenderOptions(fromCurrencySelected).favorites.map((c) => (
                    <option key={c} value={c}>
                       {c} - {currencyList[c]}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All Currencies">
                {getRenderOptions(fromCurrencySelected).others.map((c) => (
                  <option key={c} value={c}>
                    {c} - {currencyList[c]}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* AMOUNT INPUT */}
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded px-4 py-1.5 text-sm transition-colors"
          onClick={conversion}
        >
          Convert
        </button>
      </div>

      {convertedValue && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-right">
          <p className="text-sm font-semibold text-green-700">
            {amount} {fromCurrencySelected} = {convertedValue}{' '}
            {toCurrencySelected}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
