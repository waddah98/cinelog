import Input from "../../atoms/Input/Input";
import IconButton from "../../atoms/IconButton/IconButton";
import "./SearchBar.css";

// Molecule: Input + clear button.
// - value: the current search text (owned by the parent)
// - onChange: called with the NEW TEXT (a string), not with the event
function SearchBar({ id = "search", value, onChange, placeholder = "Search by title..." }) {
  function handleInputChange(event) {
    onChange(event.target.value);
  }

  function handleClear() {
    onChange("");
  }

  return (
    <div className="search-bar">
      <Input
        id={id}
        type="search"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {/* Only show the clear button when there is something to clear. */}
      {value !== "" && (
        <div className="search-bar__clear">
          <IconButton icon="✕" label="Clear search" onClick={handleClear} />
        </div>
      )}
    </div>
  );
}

export default SearchBar;
