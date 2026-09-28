const TenureSelector = ({ options, value, onChange }) => {
  return (
    <div>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={option === value ? "selected" : ""}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default TenureSelector;

