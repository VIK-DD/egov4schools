import { useState } from 'react';
import { useCustomEvent } from '../lib/useCustomEvent';

export default function Home() {
  const [query, setQuery] = useState('');

  // MUD dispatches `mudSearch` on Enter. React does not bind custom events,
  // so the hook wires addEventListener onto the host element.
  const searchRef = useCustomEvent<HTMLMudSearchInputRectangularElement, { value: string }>(
    'mudSearch',
    (detail) => setQuery(detail.value),
  );

  return (
    <>
      <header className="masthead">
        <h1>Cum au susținut liceele bacalaureatul</h1>
        <p>
          Rezultatele publicate de MEC și ANCE, adunate într-un singur loc, ca să poți compara
          instituțiile după note, rata de promovare și număr de candidați.
        </p>
      </header>

      <div className="search-row">
        <mud-search-input-rectangular
          ref={searchRef}
          size="lg"
          placeholder="Caută după denumire sau localitate"
        />
        <mud-button variant="primary" size="lg">
          <button type="button">Caută</button>
        </mud-button>
      </div>

      <p className="result-note">
        {query
          ? `Ai căutat „${query}". Conectează sursa de date în src/lib/ ca să afișezi rezultate.`
          : 'Încă nu este conectată nicio sursă de date. Următorul pas este importul setului MEC/ANCE.'}
      </p>
    </>
  );
}
