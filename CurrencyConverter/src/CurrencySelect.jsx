import React from 'react';

export default function CurrencySelect({
  label,
  value,
  onChange,
  currencyList,
  favouriteList,
  onToggleFavorite,
  excludeCode,
}) {
  const allCodes = Object.keys(currencyList).filter((c) => c !== excludeCode);
  const favorites = allCodes.filter((c) => favouriteList.includes(c));
  const others = allCodes.filter((c) => !favouriteList.includes(c));
  const isFavorite = favouriteList.includes(value);

  return (
    <div className="flex-1 flex flex-col">
      <label className="text-gray-700 text-xs font-medium mb-1">{label}</label>
      <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-purple-400">
        <button
          type="button"
          disabled={!value}
          onClick={() => onToggleFavorite(value)}
          className={`mr-1 text-base transition-colors ${
            !value
              ? 'text-gray-300 cursor-not-allowed'
              : isFavorite
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-gray-400 hover:text-amber-400'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm cursor-pointer"
        >
          <option value="">Select currency</option>
          {favorites.length > 0 && (
            <optgroup label="★ Favorites">
              {favorites.map((c) => (
                <option key={c} value={c}>
                  {c} - {currencyList[c]}
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label="All Currencies">
            {others.map((c) => (
              <option key={c} value={c}>
                {c} - {currencyList[c]}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
    </div>
  );
}