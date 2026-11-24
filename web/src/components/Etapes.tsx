const ETAPES = ['Raconter', 'Explorer', 'Ressentir', 'Projet', 'Envoi'];

// Le fil des étapes : les étapes passées sont cochées, la courante mise en
// avant. claire : en blanc, posé sur une photo. etapes et label : par défaut,
// les 5 étapes du parcours ; la commande d'échantillons passe les siennes
export function Etapes({
  courante,
  claire,
  etapes = ETAPES,
  label = 'Étapes du parcours',
}: {
  courante: number;
  claire?: boolean;
  etapes?: string[];
  label?: string;
}) {
  return (
    <ol className={claire ? 'etapes claire' : 'etapes'} aria-label={label}>
      {etapes.map((etape, i) => {
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
