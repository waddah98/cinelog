import "./Input.css";

// Atom: a text input with an optional label.
// The parent owns the value (a "controlled input"): it passes `value`
// and gets every change back through `onChange`.
function Input({ id, label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div className="input">
      {label && (
        <label htmlFor={id} className="input__label">
          {label}
        </label>
      )}
      <input
        id={id}
        className="input__field"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Input;
