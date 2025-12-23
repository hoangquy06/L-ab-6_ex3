'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    data: unknown;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Correct API key for testing
  const correctKey = 'winter-christmas-2024-secret-key';

  const makeRequest = useCallback(async (includeKey: boolean, useCorrectKey: boolean = false) => {
    setLoading(true);
    setResponse(null);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (includeKey) {
        headers['x-api-key'] = useCorrectKey ? correctKey : apiKey.trim();
      }

      const res = await fetch('/api/secret', {
        method: 'GET',
        headers,
      });

      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (error) {
      setResponse({
        status: 500,
        statusText: 'Error',
        data: { error: 'Network error', message: String(error) },
      });
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  // Auto-fetch when apiKey changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (apiKey) {
        makeRequest(true);
      } else {
        setResponse(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [apiKey, makeRequest]);

  const getStatusClass = () => {
    if (!response) return 'status-pending';
    return response.status === 200 ? 'status-success' : 'status-error';
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="logo">🔐</div>
        <h1 className="title">API Security Tester</h1>
        <p className="subtitle">Exercise 3: API Route & Middleware</p>
      </header>

      {/* API Tester Card */}
      <div className="tester-card">
        <h2 className="card-title">🧪 Test API Endpoint</h2>

        <div className="form-group">
          <label className="form-label">API Endpoint</label>
          <input
            type="text"
            className="form-input"
            value="/api/secret"
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">x-api-key Header Value</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nhập API key của bạn..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="btn-group">
          <button
            className="btn btn-primary"
            onClick={() => makeRequest(true)}
            disabled={loading || !apiKey}
          >
            {loading ? (
              <span className="loading">
                <span></span><span></span><span></span>
              </span>
            ) : (
              <>🚀 Gửi Request với Key</>
            )}
          </button>

          <button
            className="btn btn-danger"
            onClick={() => makeRequest(false)}
            disabled={loading}
          >
            ❌ Gửi Request KHÔNG có Key
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => makeRequest(true, true)}
            disabled={loading}
          >
            ✅ Dùng Key Đúng
          </button>
        </div>
      </div>

      {/* Response Section */}
      <div className="response-section">
        <div className="response-header">
          <h2 className="card-title">📋 Response</h2>
          {response && (
            <span className={`status-badge ${getStatusClass()}`}>
              {response.status} {response.statusText}
            </span>
          )}
        </div>

        <div className="response-body">
          {loading ? (
            <span>Đang gửi request...</span>
          ) : response ? (
            JSON.stringify(response.data, null, 2)
          ) : (
            <span style={{ opacity: 0.5 }}>
              // Nhấn nút để test API...
            </span>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box">
        <h3 className="info-title">💡 Hướng dẫn</h3>
        <ul className="info-list">
          <li className="info-item">
            <span>1.</span>
            <span>API endpoint <code>/api/secret</code> được bảo vệ bởi middleware</span>
          </li>
          <li className="info-item">
            <span>2.</span>
            <span>Middleware kiểm tra header <code>x-api-key</code></span>
          </li>
          <li className="info-item">
            <span>3.</span>
            <span>Secret key được lưu trong <code>.env.local</code></span>
          </li>
          <li className="info-item">
            <span>4.</span>
            <span>Key đúng: <code>winter-christmas-2024-secret-key</code></span>
          </li>
          <li className="info-item">
            <span>5.</span>
            <span>Nếu key sai hoặc không có → trả về <code>401 Unauthorized</code></span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>🎄 Exercise 3 - API Route & Middleware | Võ Hoàng Quý 🎄</p>
      </footer>
    </div>
  );
}
