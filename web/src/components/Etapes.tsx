const ETAPES = ['Raconter', 'Explorer', 'Ressentir', 'Projet', 'Envoi'];

// Le fil des 5 étapes : les étapes passées sont cochées, la courante mise en
// avant. claire : en blanc, posé sur une photo
export function Etapes({
  courante,
  claire,
}: {
  courante: number;
  claire?: boolean;
}) {
  return (
    <ol
      className={claire ? 'etapes claire' : 'etapes'}
      aria-label="Étapes du parcours"
    >
      {ETAPES.map((etape, i) => {
        const statut =
          i < courante ? 'fait' : i === courante ? 'actif' : undefined;
        return (
          <li
            key={etape}
            className={statut}
            aria-current={i === courante ? 'step' : undefined}
          >
            <span>{i < courante ? '✓' : i + 1}</span> {etape}
          </li>
        );
      })}
    </ol>
  );
}
