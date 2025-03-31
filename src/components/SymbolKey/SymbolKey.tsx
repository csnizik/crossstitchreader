type MockSymbol = {
  symbol: string;
  dmc: string;
  color: string;
  strands: number;
  totalStitches: number;
};

const mockSymbols: MockSymbol[] = [
  { symbol: 'A', dmc: '310', color: '#000000', strands: 2, totalStitches: 142 },
  { symbol: 'B', dmc: '604', color: '#ff69b4', strands: 2, totalStitches: 117 },
  { symbol: 'C', dmc: '798', color: '#0000ff', strands: 1, totalStitches: 201 },
];

const SymbolKey = () => {
  return (
    <div className="select-none touch-none" style={{ padding: '1rem', width: '300px', background: '#f3f3f3' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Symbol Key</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {mockSymbols.map((s) => (
          <li
            key={s.symbol}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                background: s.color,
                color: '#fff',
                fontWeight: 'bold',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                marginRight: 8,
              }}
            >
              {s.symbol}
            </div>
            <div style={{ flex: 1 }}>
              <div>DMC {s.dmc}</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {s.strands} strand{s.strands > 1 ? 's' : ''}, {s.totalStitches}{' '}
                stitches
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SymbolKey;
