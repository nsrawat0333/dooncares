import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FCF8F3] text-[#333333] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white p-8 rounded-3xl border-2 border-[#B88E2F]/40 shadow-xl max-w-md space-y-4">
            <h1 className="text-2xl font-extrabold text-[#B88E2F]">DoonCares</h1>
            <p className="text-sm font-bold text-slate-700">Something went wrong while loading the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl gold-gradient-btn text-xs font-black uppercase tracking-wider shadow-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
