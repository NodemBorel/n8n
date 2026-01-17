// TESTS GÉNÉRÉS PAR GEMINI AI
// Fichier source: document.md
// Fichier de test: test_1768643766961_document.js
// Date: 2026-01-17T09:56:06.961Z
// Méthode d'extraction: backticks
// ✅ Génération réussie

// Mock the file reading utility
const mockReadFile = jest.fn();

// Le contenu Markdown à analyser, injecté directement depuis le template
const markdownContent = `{{$json["Code"].fileContent}}`;

// Helper function pour parser le contenu Markdown et extraire les informations pertinentes
const parseMarkdown = (content) => {
  const result = {
    title: '',
    headings: [], // Tous les titres H2, H3, H4
    codeBlocks: [],
    links: [],
    sections: [], // { title: 'Titre de Section', content: '...' }
    rawContent: content,
  };

  const lines = content.split('\n');
  let currentSectionContent = [];
  let currentSectionTitle = '';
  let inCodeBlock = false;

  // Première passe pour le titre principal (H1)
  const h1Match = content.match(/^#\s(.+)$/m);
  if (h1Match) {
    result.title = h1Match[1].trim();
  }

  // Extraire tous les blocs de code
  const codeBlockMatches = content.match(/```[\s\S]*?```/g);
  if (codeBlockMatches) {
    result.codeBlocks = codeBlockMatches.map(block =>
      // Supprimer les délimiteurs ``` pour obtenir le contenu pur du code
      block.replace(/```[a-zA-Z]*\n/, '').replace(/```$/, '').trim()
    );
  }

  // Extraire tous les liens
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    result.links.push({ text: linkMatch[1], url: linkMatch[2] });
  }

  // Deuxième passe pour les sections et autres titres
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Gérer l'état des blocs de code
    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue; // Ne pas ajouter les lignes ``` au contenu de la section
    }
    if (inCodeBlock) {
      // Le contenu à l'intérieur des blocs de code n'est pas considéré comme du contenu de section général pour les vérifications de sections vides
      continue;
    }

    // Détecter les titres H2, H3, H4
    const headingMatch = line.match(/^(##|###|####)\s(.+)$/);
    if (headingMatch) {
      // Si nous avons accumulé du contenu pour une section précédente, l'enregistrer
      if (currentSectionTitle || currentSectionContent.length > 0) {
        result.sections.push({
          title: currentSectionTitle,
          content: currentSectionContent.join('\n').trim()
        });
      }
      // Commencer une nouvelle section
      currentSectionTitle = headingMatch[2].trim();
      currentSectionContent = []; // Réinitialiser le contenu pour la nouvelle section
      result.headings.push(line.trim());
      continue; // Ne pas ajouter les lignes de titre au contenu de la section
    }

    // Si ce n'est pas un titre, un H1, ou un bloc de code, ajouter au contenu de la section actuelle
    if (trimmedLine.length > 0 && !line.startsWith('# ')) { // Exclure le H1 du contenu de la section
      currentSectionContent.push(line);
    }
  }

  // Ajouter la dernière section accumulée
  if (currentSectionTitle || currentSectionContent.length > 0) {
    result.sections.push({
      title: currentSectionTitle,
      content: currentSectionContent.join('\n').trim()
    });
  } else if (!result.title && content.trim().length > 0) { // Cas où le document a du contenu mais pas de sous-titres explicites
    result.sections.push({ title: 'Corps du Document', content: content.trim() });
  }

  return result;
};

// Utiliser le résumé d'analyse pour les tests spécifiques
const analysisSummary = {{$json["Code"].analysisSummary}};
const detectedKeywords = analysisSummary.detectedKeywords || [];

// Avant tous les tests, configurer le mock pour retourner notre contenu Markdown
beforeAll(() => {
  mockReadFile.mockResolvedValue(markdownContent);
});

// Suite de tests principale pour la qualité et le contenu du document Markdown
describe('Qualité et Contenu du Document Markdown', () => {
  let documentData;

  // Charger et parser le document une seule fois pour tous les tests
  beforeAll(async () => {
    const content = await mockReadFile('path/to/document.md');
    documentData = parseMarkdown(content);
  });

  describe('1. STRUCTURE DU DOCUMENT', () => {
    it('devrait avoir un titre principal (H1)', () => {
      expect(documentData.title).toBeTruthy();
      expect(documentData.title.length).toBeGreaterThan(0);
    });

    it('devrait être organisé en sections avec des titres (H2, H3, etc.)', () => {
      // Attendre au moins un sous-titre pour une organisation en sections
      expect(documentData.headings.length).toBeGreaterThanOrEqual(1);
    });

    it('devrait avoir une lisibilité générale (présence de paragraphes ou listes)', () => {
      // Vérifier la présence de lignes de contenu significatives (ni titres, ni délimiteurs de code)
      const meaningfulContentLines = documentData.rawContent.split('\n').filter(line =>
        line.trim().length > 0 &&
        !line.startsWith('#') && // Pas un titre
        !line.startsWith('```') // Pas un délimiteur de bloc de code
      );
      // Un seuil arbitraire pour considérer le document comme ayant du contenu lisible
      expect(meaningfulContentLines.length).toBeGreaterThan(5);

      // Vérifier la présence d'éléments de liste pour une meilleure lisibilité
      const listItems = documentData.rawContent.match(/^(\s*[-*+]|\s*\d+\.)\s.+/gm);
      // S'il y a des listes, s'assurer qu'il y a au moins un élément
      if (listItems) {
        expect(listItems.length).toBeGreaterThan(0);
      }
    });
  });

  describe('2. QUALITÉ DU CONTENU', () => {
    it('devrait contenir des explications claires (présence de texte entre les titres)', () => {
      // Vérifier si les sections ont un contenu réel au-delà de leur titre
      const sectionsWithContent = documentData.sections.filter(s => s.content.trim().length > 0);
      // Attendre qu'au moins une section (si des titres existent) ait du contenu
      expect(sectionsWithContent.length).toBeGreaterThanOrEqual(Math.min(1, documentData.headings.length));
      // Vérifier que la longueur totale du contenu des sections est substantielle
      const totalContentLength = documentData.sections.reduce((acc, s) => acc + s.content.length, 0);
      expect(totalContentLength).toBeGreaterThan(50); // Seuil arbitraire pour un contenu substantiel
    });

    it('devrait inclure des exemples techniques si le contenu l\'exige (présence de blocs de code)', () => {
      // Ce test suppose que si des blocs de code sont présents, ils servent d'exemples.
      // Une vérification plus sophistiquée nécessiterait de déterminer si des sections techniques *doivent* avoir du code.
      expect(documentData.codeBlocks.length).toBeGreaterThanOrEqual(1); // Attendre au moins un exemple de code
      documentData.codeBlocks.forEach(block => {
        expect(block.trim().length).toBeGreaterThan(10); // Le bloc de code ne doit pas être vide ou trop court
      });
    });

    it('devrait avoir des liens fonctionnels (syntaxe correcte)', () => {
      // Nous vérifions uniquement la syntaxe Markdown correcte des liens, pas l'accessibilité réelle des URL.
      // Il est acceptable qu'il n'y ait pas de liens, mais s'il y en a, ils doivent être valides.
      if (documentData.links.length > 0) {
        documentData.links.forEach(link => {
          expect(link.text).toBeTruthy(); // Le texte du lien doit exister
          expect(link.url).toMatch(/^https?:\/\/\S+$/); // Vérification basique du format d'URL (http/https)
        });
      } else {
        // Si aucun lien n'est trouvé, le test passe, car ce n'est pas une exigence d'avoir des liens.
        expect(true).toBe(true);
      }
    });

    it('devrait avoir du code bien formaté (détection de blocs de code)', () => {
      // Ce test vérifie principalement la *présence* de blocs de code, impliquant une tentative de formatage.
      // Des vérifications de formatage plus approfondies (indentation, coloration syntaxique) sont hors de portée ici.
      expect(documentData.codeBlocks.length).toBeGreaterThanOrEqual(1); // Attendre au moins un bloc de code
      documentData.codeBlocks.forEach(block => {
        expect(block.trim().length).toBeGreaterThan(10); // Le bloc de code ne doit pas être vide ou trop court
      });
    });
  });

  describe('3. COMPLÉTUDE', () => {
    it('devrait couvrir tous les points importants (vérification des mots-clés détectés)', () => {
      if (detectedKeywords.length === 0) {
        // Si aucun mot-clé n'a été détecté par l'analyse, ce test passe.
        // Cela pourrait indiquer un problème avec la détection des mots-clés, mais pas avec le document lui-même.
        console.warn('Aucun mot-clé détecté par l\'analyse. Impossible de vérifier la couverture des points importants.');
        expect(true).toBe(true);
      } else {
        detectedKeywords.forEach(keyword => {
          const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi'); // Correspondance mot entier, insensible à la casse
          expect(documentData.rawContent).toMatch(keywordRegex);
        });
      }
    });

    it('ne devrait pas avoir de sections vides', () => {
      const emptySections = documentData.sections.filter(s => s.content.trim().length === 0);
      expect(emptySections.length).toBe(0);
    });

    it('devrait avoir une cohérence de formatage (présence de listes ou de texte en gras/italique)', () => {
      // Vérifier la présence d'éléments de formatage courants
      const boldItalicRegex = /(\*\*|__|\*|_)[^\s].*?\1/g; // Correspond au gras/italique
      const listRegex = /^\s*[-*+]\s.+/gm; // Correspond aux éléments de liste non ordonnée
      const numberedListRegex = /^\s*\d+\.\s.+/gm; // Correspond aux éléments de liste ordonnée

      const hasBoldItalic = documentData.rawContent.match(boldItalicRegex);
      const hasLists = documentData.rawContent.match(listRegex) || documentData.rawContent.match(numberedListRegex);

      expect(hasBoldItalic || hasLists).toBeTruthy(); // Attendre au moins un formatage courant
    });
  });

  describe('4. TESTS SPÉCIFIQUES au contenu détecté', () => {
    // Générer dynamiquement des tests basés sur les mots-clés détectés
    if (detectedKeywords.length === 0) {
      it('Aucun mot-clé spécifique détecté pour des tests supplémentaires.', () => {
        // Ce test passera si aucun mot-clé n'est trouvé, indiquant qu'aucun test spécifique n'est nécessaire.
        expect(true).toBe(true);
      });
    } else {
      detectedKeywords.forEach(keyword => {
        it(`devrait mentionner le sujet: "${keyword}"`, () => {
          const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi'); // Correspondance mot entier, insensible à la casse
          expect(documentData.rawContent).toMatch(keywordRegex);
        });
      });
    }
  });
});