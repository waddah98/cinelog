import "./Select.css";

// Atom: a dropdown with a label.
// - options: an array like [{ value: "rating", label: "Rating" }, ...]
// - onChange: receives the change event; read the new value with event.target.value
function Select({ id, label, value, options, onChange }) {
  return (
    <div className="select">
      <label htmlFor={id} className="select__label">
        {label}
      </label>
      <select id={id} className="select__field" value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
