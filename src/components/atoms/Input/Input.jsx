import "./Input.css";

// Atom: a text input with a label.
// - label: text of the <label>. Every input needs a label for accessibility.
// - hideLabel: hide the label visually (it stays available to screen readers)
// - error: optional error message shown under the input
// The parent owns the value (a "controlled input"): it passes `value`
// and gets every change back through `onChange`.
function Input({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  hideLabel = false,
  error = "",
}) {
  let labelClass = "input__label";
  if (hideLabel) {
    labelClass = "visually-hidden";
  }

  let fieldClass = "input__field";
  if (error) {
    fieldClass = fieldClass + " input__field--error";
  }

  return (
    <div className="input">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        className={fieldClass}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={error ? true : false}
      />
      {error && <p className="input__error">{error}</p>}
    </div>
  );
}

export default Input;
