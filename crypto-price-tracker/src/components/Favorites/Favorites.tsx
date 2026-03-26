interface FavoritesProps {
  symbols: string[];
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
}

export default function Favorites({ symbols, onSelect, onRemove }: FavoritesProps) {
  if (symbols.length === 0) return <p>No favorites yet...</p>;
  return (
    <ul>
      {symbols.map((s) => (
        <li key={s}>
          <button onClick={() => onSelect(s)}>{s}</button>
          <button onClick={() => onRemove(s)}>✕</button>
        </li>
      ))}
    </ul>
  );
}
