import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './SpinSection.css';

const SpinSection = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDataMinimized, setIsDataMinimized] = useState(false);
  const [results, setResults] = useState([]);
  const [rangeEnd, setRangeEnd] = useState('');

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('spinItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    const savedResults = localStorage.getItem('spinResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('spinItems', JSON.stringify(items));
    }
  }, [items]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem('spinResults', JSON.stringify(results));
    }
  }, [results]);

  const handleAdd = () => {
    if (inputValue.trim()) {
      const newItem = {
        id: Date.now(),
        text: inputValue.trim()
      };
      setItems([...items, newItem]);
      setInputValue('');
    }
  };

  const handleEdit = (id) => {
    const item = items.find(item => item.id === id);
    setInputValue(item.text);
    setEditId(id);
  };

  const handleUpdate = () => {
    if (inputValue.trim()) {
      setItems(items.map(item =>
        item.id === editId ? { ...item, text: inputValue.trim() } : item
      ));
      setInputValue('');
      setEditId(null);
    }
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSpin = () => {
    if (items.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setWinner('');

    const spins = 5 + Math.random() * 5;
    const degrees = spins * 360 + Math.random() * 360;
    const newRotation = rotation + degrees;

    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / items.length;
      const normalizedRotation = newRotation % 360;
      const winnerIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % items.length;

      const winnerText = items[winnerIndex].text;
      const winnerId = items[winnerIndex].id;
      setWinner(winnerText);
      setIsSpinning(false);

      // Add result to history
      const newResult = {
        id: Date.now(),
        winner: winnerText,
        timestamp: new Date().toLocaleString()
      };
      setResults([newResult, ...results]);

      Swal.fire({
        title: '🎉 Winner!',
        text: winnerText,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        cancelButtonText: 'Close',
        confirmButtonColor: '#f56565',
        cancelButtonColor: '#667eea',
        background: '#fff',
        customClass: {
          popup: 'winner-popup'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Remove the winner item from the spin wheel
          setItems(items.filter(item => item.id !== winnerId));
        }
      });
    }, 4000);
  };

  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#ff6b6b', '#feca57', '#ee5a6f', '#c471ed', '#12cbc4', '#fda7df'];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleDataMinimize = () => {
    setIsDataMinimized(!isDataMinimized);
  };

  const handleRemoveResult = (id) => {
    setResults(results.filter(result => result.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const handleAddRange = () => {
    const end = parseInt(rangeEnd);
    if (end > 0 && end <= 1000) {
      const newItems = [];
      for (let i = 1; i <= end; i++) {
        newItems.push({
          id: Date.now() + i,
          text: i.toString()
        });
      }
      setItems(newItems);
      setRangeEnd('');
    }
  };

  const handleRandomSort = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  return (
    <section className="spin-section" id="get-started">
      <div className="spin-container">
        <div className={`spin-left ${isFullscreen ? 'fullscreen' : ''}`}>
          <button className="fullscreen-button" onClick={toggleFullscreen}>
            {isFullscreen ? '✕' : '⛶'}
          </button>
          <h2 className="spin-title">Spin the Wheel</h2>

          <div className="wheel-wrapper">
            <div className="wheel-pointer">▼</div>
            <svg
              className="wheel"
              viewBox="0 0 200 200"
              style={{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }}
            >
              <circle cx="100" cy="100" r="95" fill="#fff"/>

              {items.length > 0 ? items.map((item, index) => {
                const angle = (360 / items.length) * index;
                const nextAngle = (360 / items.length) * (index + 1);
                const startRad = (angle - 90) * Math.PI / 180;
                const endRad = (nextAngle - 90) * Math.PI / 180;

                const x1 = 100 + 95 * Math.cos(startRad);
                const y1 = 100 + 95 * Math.sin(startRad);
                const x2 = 100 + 95 * Math.cos(endRad);
                const y2 = 100 + 95 * Math.sin(endRad);

                const largeArcFlag = (nextAngle - angle) > 180 ? 1 : 0;

                const textAngle = angle + (360 / items.length) / 2;
                const textRad = (textAngle - 90) * Math.PI / 180;
                const textX = 100 + 60 * Math.cos(textRad);
                const textY = 100 + 60 * Math.sin(textRad);

                return (
                  <g key={item.id}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={colors[index % colors.length]}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#fff"
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    >
                      {item.text}
                    </text>
                  </g>
                );
              }) : (
                <text x="100" y="100" fill="#a0aec0" fontSize="14" textAnchor="middle" dominantBaseline="middle">
                  Add items to spin
                </text>
              )}

              <circle cx="100" cy="100" r="20" fill="#fff"/>
              <image
                href="/center-logo.png"
                x="80"
                y="80"
                width="40"
                height="40"
                clipPath="circle(20px at 50% 50%)"
              />
            </svg>
          </div>

          <button
            className="spin-button"
            onClick={handleSpin}
            disabled={items.length === 0 || isSpinning}
          >
            {isSpinning ? 'Spinning...' : 'SPIN'}
          </button>
        </div>

        <div className={`spin-right ${isDataMinimized ? 'minimized' : ''}`}>
          {!isDataMinimized ? (
            <>
              <div className="crud-header">
                <h2 className="crud-title">Manage Items</h2>
                <button className="minimize-button" onClick={toggleDataMinimize}>
                  ▲
                </button>
              </div>
              <div className="crud-form">
            <input
              type="text"
              className="crud-input"
              placeholder="Enter item name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (editId ? handleUpdate() : handleAdd())}
            />
            <button
              className="crud-button add-button"
              onClick={editId ? handleUpdate : handleAdd}
            >
              {editId ? 'Update' : 'Add'}
            </button>
            {editId && (
              <button
                className="crud-button cancel-button"
                onClick={() => {
                  setInputValue('');
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div className="range-form">
            <input
              type="number"
              className="crud-input"
              placeholder="Add 1 to N (e.g., 100)"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRange()}
              min="1"
              max="1000"
            />
            <button
              className="crud-button add-button"
              onClick={handleAddRange}
            >
              Add Range
            </button>
            <button
              className="crud-button delete-all-button"
              onClick={handleClearAll}
            >
              Clear All
            </button>
            <button
              className="crud-button random-sort-button"
              onClick={handleRandomSort}
              disabled={items.length === 0}
            >
              🔀 Random Sort
            </button>
          </div>

          <div className="items-list">
            {items.length === 0 ? (
              <p className="empty-message">No items yet. Add some items to spin!</p>
            ) : (
              items.map(item => (
                <div key={item.id} className="item-card">
                  <span className="item-text">{item.text}</span>
                  <div className="item-actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEdit(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
            </>
          ) : (
            <button className="expand-button-inline" onClick={toggleDataMinimize}>
              ☰ Expand Manage Items
            </button>
          )}

          {results.length > 0 && (
            <div className="results-section">
              <h3 className="results-title">Results History</h3>
              <div className="results-list">
                {results.slice(0, 5).map(result => (
                  <div key={result.id} className="result-item">
                    <div className="result-info">
                      <span className="result-winner">{result.winner}</span>
                      <span className="result-time">{result.timestamp}</span>
                    </div>
                    <button
                      className="result-remove-button"
                      onClick={() => handleRemoveResult(result.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {results.length > 5 && (
                <button
                  className="clear-results-button"
                  onClick={() => setResults([])}
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SpinSection;
