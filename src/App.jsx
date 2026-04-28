import { useState, useEffect } from 'react';

function App() {
  // --- STATE MANAGEMENT ---
  // useState hooks to manage data, loading state, error state, and a simple counter
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);

  // --- SIDE EFFECTS ---
  
  // 1. Fetching Data Effect
  // This useEffect runs when the component mounts AND whenever 'fetchCount' changes.
  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      setError(null);
      try {
        // Using a public API for random quotes
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) {
          throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        
        // Simulating a slight delay for better visual loading transition
        setTimeout(() => {
          setQuote({
            text: data.quote,
            author: data.author
          });
          setLoading(false);
        }, 600);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuote();
  }, [fetchCount]); // Dependency array: re-run effect when fetchCount changes

  // 2. Document Title Update Effect
  // This useEffect runs whenever the 'quote' state changes.
  useEffect(() => {
    if (quote.author) {
      document.title = `Quote by ${quote.author}`;
    } else {
      document.title = 'Inspirational Quotes';
    }
    
    // Optional cleanup function
    return () => {
      document.title = 'React App';
    };
  }, [quote]); // Dependency array: re-run effect when quote changes

  // Handler for button click
  const handleNewQuote = () => {
    // Updating this state triggers the first useEffect
    setFetchCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="app-container">
      <div className="dashboard-card">
        
        <div className="header">
          <h1 className="title">Daily Inspiration</h1>
          <p className="subtitle">Discover new perspectives with every click</p>
        </div>

        <div className="quote-container">
          {error ? (
            <div className="error-message">
              <p>Oops! {error}</p>
              <p>Please try again later.</p>
            </div>
          ) : loading ? (
            <div className="skeleton-container">
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
              <div className="skeleton skeleton-author"></div>
            </div>
          ) : (
            <>
              <h2 className="quote-text">{quote.text}</h2>
              <p className="quote-author">{quote.author}</p>
            </>
          )}
        </div>

        <div className="controls">
          <button 
            className="btn-primary" 
            onClick={handleNewQuote}
            disabled={loading}
          >
            {loading ? 'Discovering...' : 'Get New Quote'}
          </button>
          
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">Quotes Fetched</span>
              <span className="stat-value">{fetchCount + 1}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className="stat-value" style={{ color: loading ? '#fbbf24' : '#34d399' }}>
                {loading ? 'Fetching' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
