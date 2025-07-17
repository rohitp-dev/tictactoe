export default function Cell({ value, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100px',
        height: '100px',
        border: '2px solid black',
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      {value}
    </div>
  );
}
