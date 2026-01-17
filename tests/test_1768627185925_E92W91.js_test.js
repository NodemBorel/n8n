// TESTS POUR LE CONTENU DU DOCUMENT
// Fichier source: document_1768627185925.md
// Fichier de test: test_1768627185925_E92W91.js
// Date: 2026-01-17T05:19:45.925Z
// Analyse: 0 lignes, 0 sections
// Mots-clés détectés: aucun

// Importez les modules nécessaires si vous en aviez, ici nous allons simuler
// une lecture de fichier en passant le contenu directement.

// Contenu du document Markdown à tester (simule la lecture de fichier)
const markdownContent = `
{{$json["Code"].fileContent.substring(0, 2000)}}
`;

// Mots-clés détectés par l'analyse (pour les tests spécifiques)
const detectedKeywords = [
{{#each $json["Code"].detectedKeywords}}
   "{{this}}",
{{/each}}
];

// Fonction utilitaire pour extraire les titres
const getHeadings = (content) => {
  const headingRegex = /^(#+)\s(.+)$/gm;
  const matches = [...content.matchAll(headingRegex)];
  return matches.map(match => ({
    level: match[1].length,
    text: match[2].trim()
  }));
};

// Fonction utilitaire pour extraire les blocs de code
const getCodeBlocks = (content) => {
  const codeBlockRegex = /^```(?<lang>\w*)\n(?<code>[\s\S]*?)\n^```$/gm;
  const matches = [...content.matchAll(codeBlockRegex)];
  return matches.map(match => ({
    language: match.groups.lang || 'plaintext',
    code: match.groups.code.trim()
  }));
};

// Fonction utilitaire pour extraire les liens Markdown
const getLinks = (content) => {
  const linkRegex = /\[(?<text>[^\]]+)\]\((?<url>https?:\/\/[^\s)]+)\)/gm;
  const matches = [...content.matchAll(linkRegex)];
  return matches.map(match => ({
    text: match.groups.text,
    url: match.groups.url
  }));
};

// Fonction utilitaire pour extraire les paragraphes (lignes de texte non-titre, non-liste, non-code)
const getParagraphs = (content) => {
    const lines = content.split('\n');
    const paragraphs = [];
    let currentParagraph = [];
    let inCodeBlock = false;

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            if (!inCodeBlock && currentParagraph.length > 0) { // Fin du bloc de code, ajoute le paragraphe précédent s'il existe
                paragraphs.push(currentParagraph.join(' ').trim());
                currentParagraph = [];
            }
            continue; // Ignorer les marqueurs de bloc de code
        }

        if (inCodeBlock) {
            continue; // Ignorer les lignes à l'intérieur des blocs de code
        }

        // Ignorer les lignes vides, les titres, les éléments de liste
        if (trimmedLine === '' || trimmedLine.match(/^(#+\s|[-*+]\s)/)) {
            if (currentParagraph.length > 0) {
                paragraphs.push(currentParagraph.join(' ').trim());
                currentParagraph = [];
            }
        } else {
            currentParagraph.push(trimmedLine);
        }
    }
    if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(' ').trim());
    }
    return paragraphs.filter(p => p.length > 0);
};


describe('Analyse de la qualité et du contenu du document Markdown', () => {

  // Utilisation d'une variable pour le contenu du document pour tous les tests
  let documentContent;

  beforeAll(() => {
    // Simule la lecture du fichier en utilisant le contenu fourni
    documentContent = markdownContent;
  });

  // 1. STRUCTURE DU DOCUMENT
  describe('1. Structure du document', () => {
    it('devrait contenir un titre principal (H1)', () => {
      const headings = getHeadings(documentContent);
      expect(headings.some(h => h.level === 1)).toBe(true);
      expect(headings.filter(h => h.level === 1).length).toBe(1); // Généralement un seul H1 pour la clarté
    });

    it('devrait être organisé en sections avec des titres secondaires (H2 ou plus)', () => {
      const headings = getHeadings(documentContent);
      expect(headings.filter(h => h.level >= 2).length).toBeGreaterThanOrEqual(2); // Au moins deux sous-sections
    });

    it('devrait avoir une lisibilité générale avec des paragraphes de texte', () => {
      const paragraphs = getParagraphs(documentContent);
      expect(paragraphs.length).toBeGreaterThanOrEqual(3); // Au moins quelques paragraphes pour la lisibilité
      // Vérifie que la longueur totale des paragraphes est suffisante pour un document significatif
      expect(paragraphs.join(' ').length).toBeGreaterThan(100);
    });
  });

  // 2. QUALITÉ DU CONTENU
  describe('2. Qualité du contenu', () => {
    it('devrait contenir des explications claires (présence de texte significatif)', () => {
      const paragraphs = getParagraphs(documentContent);
      // Vérifie qu'il y a du contenu textuel substantiel en dehors des titres et listes
      expect(paragraphs.join(' ').length).toBeGreaterThan(200); // Au moins 200 caractères de texte explicatif
    });

    it('devrait inclure des exemples de code pour les sujets techniques', () => {
      const codeBlocks = getCodeBlocks(documentContent);
      // L'analyse indique un projet JS, Node.js, npm, Git, donc des exemples de code sont attendus.
      expect(codeBlocks.length).toBeGreaterThanOrEqual(1);
    });

    it('devrait avoir des blocs de code bien formatés (non vides)', () => {
      const codeBlocks = getCodeBlocks(documentContent);
      if (codeBlocks.length > 0) {
        // Vérifie que chaque bloc de code n'est pas vide et contient du contenu significatif
        expect(codeBlocks.every(block => block.code.length > 10)).toBe(true);
      } else {
        // Si aucun bloc de code n'est trouvé, ce test passe mais un avertissement est émis.
        // Cela permet de ne pas faire échouer le test si le document est très simple et n'en a pas besoin.
        console.warn("Aucun bloc de code trouvé. Ce test est moins pertinent sans exemples de code.");
        expect(true).toBe(true); // Pour s'assurer que le test ne "saute" pas
      }
    });

    it('devrait contenir des liens Markdown correctement formatés si des URLs sont présentes', () => {
      const links = getLinks(documentContent);
      // Vérifie la présence de liens et leur formatage de base
      if (links.length > 0) {
        expect(links.every(link => link.text.length > 0 && link.url.startsWith('http'))).toBe(true);
      } else {
        // Si aucun lien n'est trouvé, ce test passe mais un avertissement est émis.
        console.warn("Aucun lien Markdown trouvé. Ce test est moins pertinent sans liens.");
        expect(true).toBe(true); // Pour s'assurer que le test ne "saute" pas
      }
    });
  });

  // 3. COMPLÉTUDE
  describe('3. Complétude du contenu', () => {
    it('devrait couvrir les points importants mentionnés dans le résumé d\'analyse', () => {
      // Mots-clés extraits du résumé d'analyse du document
      const summaryKeywords = ["Node.js", "npm", "Git", "JavaScript", "development environment", "installation steps", "project initialization", "dependency management", "version control"];

      summaryKeywords.forEach(keyword => {
        // Vérifie la présence de chaque mot-clé (insensible à la casse)
        expect(documentContent).toMatch(new RegExp(keyword, 'i'));
      });
    });

    it('ne devrait pas avoir de sections vides (titre suivi immédiatement d\'un autre titre sans contenu)', () => {
      const lines = documentContent.split('\n').map(line => line.trim());
      let previousWasHeading = false;
      let emptySectionDetected = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isHeading = line.match(/^#+\s/);

        if (isHeading) {
          if (previousWasHeading) {
            // Deux titres consécutifs sans contenu entre eux
            emptySectionDetected = true;
            break;
          }
          previousWasHeading = true;
        } else if (line !== '') {
          // Contenu trouvé (non vide et non un titre), réinitialise le drapeau
          previousWasHeading = false;
        }
      }
      expect(emptySectionDetected).toBe(false);
    });

    it('devrait avoir un formatage cohérent pour les titres (ex: un espace après les dièses)', () => {
      const headingRegex = /^(#+)\s(.+)$/gm;
      const matches = [...documentContent.matchAll(headingRegex)];
      // Vérifie que chaque titre a au moins un espace après les dièses
      expect(matches.every(match => match[0].startsWith(match[1] + ' '))).toBe(true);
    });
  });

  // 4. TESTS SPÉCIFIQUES au contenu détecté
  describe('4. Tests spécifiques aux mots-clés détectés', () => {
    // Génère un test pour chaque mot-clé détecté dynamiquement
    detectedKeywords.forEach(keyword => {
      it(`devrait mentionner le sujet "${keyword}"`, () => {
        // Vérifie la présence du mot-clé (insensible à la casse) dans le document
        expect(documentContent).toMatch(new RegExp(keyword, 'i'));
      });
    });
  });
});