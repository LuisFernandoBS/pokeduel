const raridadesOrdem = [
    "None",
    "Comum",
    "Incomum",
    "Rara",
    "Rara Holo",
    "Rara Holo V",
    "Rara Holo VMAX",
    "Rara Holo VSTAR",
    "Rara Dupla",
    "Rara Radiante",
    "Raras Incríveis",
    "Shiny rara",
    "Ilustração Rara",
    "Ilustração Rara Especial",
    "Ultra Rara",
    "Rare Secreta",
    "Hiper rara",
    "Brilhante Ultra Rara",
];

export function compararRaridade(raridade1: string, raridade2: string): number {
    const indice1 = raridadesOrdem.indexOf(raridade1);
    const indice2 = raridadesOrdem.indexOf(raridade2);

    const pos1 = indice1 === -1 ? raridadesOrdem.indexOf("None") : indice1;
    const pos2 = indice2 === -1 ? raridadesOrdem.indexOf("None") : indice2;

    if (pos1 > pos2) return 1;
    if (pos2 > pos1) return 2;
    return 3;
}
