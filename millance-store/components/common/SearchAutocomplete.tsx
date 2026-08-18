import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ALL_PRODUCTS } from '@/constants/mockData';
import type { Product } from '@/types';
import './SearchAutocomplete.css';

interface SearchAutocompleteProps {
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ className = '', onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products with partial matching (case-insensitive)
  const searchProducts = (searchQuery: string): Product[] => {
    if (!searchQuery.trim()) return [];

    const lowerQuery = searchQuery.toLowerCase().trim();
    
    return ALL_PRODUCTS.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerQuery);
      const descMatch = product.description.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
      
      return nameMatch || descMatch || categoryMatch;
    }).slice(0, 8); // Limit to 8 suggestions
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      const results = searchProducts(value);
      setSuggestions(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      if (onSearch) onSearch(query);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product: Product) => {
    setQuery('');
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className={`search-autocomplete ${className}`}>
      <form onSubmit={handleSubmit} className="search-autocomplete__form">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder="Search for products..."
          className="search-autocomplete__input"
          autoComplete="off"
        />
        <button type="submit" className="search-autocomplete__button">
          <Search size={24} />
        </button>
      </form>

      {showSuggestions && (
        <div className="search-autocomplete__dropdown">
          {suggestions.length > 0 ? (
            <>
              <div className="search-autocomplete__header">
                <Search size={16} />
                <span>Search results for "{query}"</span>
              </div>
              <ul className="search-autocomplete__list">
                {suggestions.map((product, index) => (
                  <li
                    key={product.id}
                    className={`search-autocomplete__item ${
                      index === selectedIndex ? 'search-autocomplete__item--active' : ''
                    }`}
                    onClick={() => handleSuggestionClick(product)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="search-autocomplete__image"
                    />
                    <div className="search-autocomplete__info">
                      <span className="search-autocomplete__name">{product.name}</span>
                      <span className="search-autocomplete__category">{product.category}</span>
                    </div>
                    <span className="search-autocomplete__price">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="search-autocomplete__footer">
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="search-autocomplete__view-all"
                >
                  View all results for "{query}"
                </button>
              </div>
            </>
          ) : (
            <div className="search-autocomplete__no-results">
              <Search size={32} />
              <p>No products found for "{query}"</p>
              <span>Try different keywords</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
