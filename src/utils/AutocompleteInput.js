import React, { useState, useEffect, useRef } from 'react';
import './AutocompleteInput.css';

const AutocompleteInput = ({ options, label, errorMessage, onChange, value, name, required }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  const normalizeString = (str) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);
    filterOptions(input);
  };

  const filterOptions = (input) => {
    const normalizedInput = normalizeString(input);
    const filtered = options.filter(option => {
      const normalizedOption = normalizeString(option);
      return normalizedOption.split(' ').some(word => word.includes(normalizedInput));
    });
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    setShowModal(false);
    onChange({ target: { name, value: option } });
  };

  const handleInputFocus = () => {
    setShowModal(true);
    filterOptions(inputValue);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        handleModalClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const highlightMatch = (text, input) => {
    if (!input) return text;
    const regex = new RegExp(`(${input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  return (
    <div className="autocomplete-input">
      <label>{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        required={required}
      />
      {showModal && (
        <div className="modal-overlay">
          <div ref={modalRef} className="modal-content">
            <div className="modal-header">
              <h3>Seleccionar Referente</h3>
              <button onClick={handleModalClose}>×</button>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Buscar referente..."
              autoFocus
            />
            <ul className="options-list">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                >
                  {highlightMatch(option, inputValue)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <span className="error-message">{errorMessage}</span>
    </div>
  );
};

export default AutocompleteInput;