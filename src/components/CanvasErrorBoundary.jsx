import React from 'react';

export default class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[WebGL/Canvas Error Handled]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: this.props.height || '450px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed var(--magenta)',
          borderRadius: '12px',
          background: 'rgba(255, 0, 255, 0.02)',
          padding: '2rem',
          textAlign: 'center',
          margin: '0 auto',
          boxSizing: 'border-box',
          ...(this.props.overlay && {
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            border: 'none',
            background: 'transparent',
          })
        }}>
          {!this.props.silent && (
            <>
              <p style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--magenta)',
                letterSpacing: '2px',
                marginBottom: '0.5rem',
              }}>
                [3D_RENDER_CORE_OFFLINE]
              </p>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                maxWidth: '280px',
                lineHeight: 1.5,
              }}>
                WEBGL CONTEXT REFUSED OR NETWORK LOST. ACTIVE FALLBACK LAYER ENGAGED.
              </p>
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
