
const NumberInput = ({ label, value, onChange }) => {
  return (
    <div className="inputField">
      <h3>{label}</h3>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default NumberInput;
