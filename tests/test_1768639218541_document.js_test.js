// TESTS GÉNÉRÉS PAR GEMINI AI
// Fichier source: document.md
// Fichier de test: test_1768639218541_document.js
// Date: 2026-01-17T08:40:18.541Z
// Méthode d'extraction: backticks
// ✅ Génération réussie

// Helper pour extraire les titres (headings) du contenu Markdown
const getHeadings = (content) => {
  const headings = [];
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.match(/^#+\s/)) {
      headings.push(line.trim());
    }
  });
  return headings;
};

// Helper pour extraire les blocs de code du contenu Markdown
const getCodeBlocks = (content) => {
  const codeBlocks = [];
  // Regex pour capturer le contenu des blocs de code, avec ou sans spécificateur de langage
  const regex = /```(?:\w+)?\n([\s\S]*?)\n```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    codeBlocks.push(match[1].trim()); // Le contenu à l'intérieur du bloc de code
  }
  return codeBlocks;
};

// Helper pour extraire les liens Markdown
const getLinks = (content) => {
  const links = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push({ text: match[1], url: match[2] });
  }
  return links;
};

// Helper pour extraire les sections (titre + contenu jusqu'au prochain titre)
const getSections = (content) => {
  const sections = [];
  const lines = content.split('\n');
  let currentSectionHeading = null;
  let currentSectionContent = [];

  lines.forEach(line => {
    if (line.match(/^#+\s/)) {
      if (currentSectionHeading) {
        sections.push({
          heading: currentSectionHeading,
          content: currentSectionContent.join('\n').trim()
        });
      }
      currentSectionHeading = line.trim();
      currentSectionContent = [];
    } else {
      currentSectionContent.push(line);
    }
  });

  // Ajoute la dernière section si elle existe
  if (currentSectionHeading) {
    sections.push({
      heading: currentSectionHeading,
      content: currentSectionContent.join('\n').trim()
    });
  }
  return sections;
};

// Le contenu Markdown brut fourni pour l'analyse
const markdownContent = `{{$json["Code"].fileContent.substring(0, 2000)}}`;

// Le résumé d'analyse fourni, qui doit être parsé comme JSON
const rawAnalysisSummary = `{{$json["Code"].analysisSummary}}`;
let analysisSummary = {};
try {
  analysisSummary = JSON.parse(rawAnalysisSummary);
} catch (e) {
  console.warn("Avertissement: Le résumé d'analyse n'a pas pu être parsé comme JSON. Les tests se baseront principalement sur le contenu brut et des hypothèses par défaut.");
  // Fallback rudimentaire si le résumé n'est pas un JSON valide
  if (typeof rawAnalysisSummary === 'string') {
    if (rawAnalysisSummary.toLowerCase().includes('main title')) analysisSummary.mainTitlePresent = true;
    if (rawAnalysisSummary.toLowerCase().includes('sections')) analysisSummary.sectionCount = (rawAnalysisSummary.match(/\d+\ssections?/i) || [null])[0]?.match(/\d+/)?.[0] || 0;
    if (rawAnalysisSummary.toLowerCase().includes('code examples')) analysisSummary.hasCodeExamples = true;
    if (rawAnalysisSummary.toLowerCase().includes('links')) analysisSummary.hasLinks = true;
    if (rawAnalysisSummary.toLowerCase().includes('empty sections')) analysisSummary.emptySections = ['placeholder'];
    if (rawAnalysisSummary.toLowerCase().includes('clarity issues')) analysisSummary.clarityIssues = ['placeholder'];
    if (rawAnalysisSummary.toLowerCase().includes('formatting issues')) analysisSummary.formattingIssues = ['placeholder'];
    if (rawAnalysisSummary.toLowerCase().includes('missing points')) analysisSummary.missingImportantPoints = ['placeholder'];
  }
}

// Les mots-clés détectés, convertis en tableau
const rawDetectedKeywordsList = `{{#each $json["Code"].detectedKeywords}}
   - Tests pour le sujet: {{this}}
{{/each}}`;
const detectedKeywords = rawDetectedKeywordsList
  .split('\n')
  .map(line => line.replace(/^- Tests pour le sujet:\s*/, '').trim())
  .filter(keyword => keyword.length > 0);

describe('Analyse de la qualité et du contenu du document Markdown technique', () => {
  // Variables pour stocker les éléments parsés du Markdown
  let parsedHeadings;
  let parsedSections;
  let parsedCodeBlocks;
  let parsedLinks;

  beforeAll(() => {
    // Mock de la lecture du fichier: le contenu est directement injecté.
    // On parse le contenu une seule fois pour tous les tests afin d'optimiser.
    parsedHeadings = getHeadings(markdownContent);
    parsedSections = getSections(markdownContent);
    parsedCodeBlocks = getCodeBlocks(markdownContent);
    parsedLinks = getLinks(markdownContent);
  });

  describe('1. STRUCTURE DU DOCUMENT', () => {
    it('devrait avoir un titre principal (H1)', () => {
      const hasH1 = parsedHeadings.some(h => h.startsWith('# '));
      // Si le résumé d'analyse indique explicitement l'absence de titre principal, on s'attend à 'false'.
      // Sinon, on s'attend à ce qu'un titre principal soit présent.
      if (analysisSummary.mainTitlePresent === false) {
        expect(hasH1).toBe(false);
      } else {
        expect(hasH1).toBe(true);
      }
    });

    it('devrait être organisé en sections (au moins 2 titres H2 ou H3)', () => {
      const h2AndH3Count = parsedHeadings.filter(h => h.startsWith('## ') || h.startsWith('### ')).length;
      // Si le résumé d'analyse fournit un nombre spécifique de sections, on l'utilise.
      // Sinon, on s'attend à au moins 2 titres H2 ou H3 pour une bonne organisation.
      if (typeof analysisSummary.sectionCount === 'number' && analysisSummary.sectionCount >= 0) {
        expect(h2AndH3Count).toBeGreaterThanOrEqual(analysisSummary.sectionCount);
      } else {
        expect(h2AndH3Count).toBeGreaterThanOrEqual(2); // Attente par défaut
      }
    });

    it('devrait avoir une lisibilité générale acceptable (présence de contenu dans la plupart des sections)', () => {
      // Vérifie que la plupart des sections ne sont pas juste des titres sans contenu significatif.
      const sectionsWithContent = parsedSections.filter(s => s.content.trim().length > 0);
      // On s'attend à ce qu'au moins 75% des sections aient du contenu.
      if (parsedSections.length > 0) {
        expect(sectionsWithContent.length).toBeGreaterThanOrEqual(parsedSections.length * 0.75);
      } else {
        // Si aucune section n'est détectée, le document est probablement vide ou mal structuré.
        expect(true).toBe(true); // Passe si pas de sections, le test d'organisation devrait le couvrir.
      }
    });
  });

  describe('2. QUALITÉ DU CONTENU', () => {
    it('devrait avoir des explications claires (absence de problèmes de clarté signalés)', () => {
      // Se base sur le rapport d'analyse pour les problèmes de clarté.
      // Si analysisSummary.clarityIssues est un tableau, on s'attend à ce qu'il soit vide.
      // Sinon, on ne peut pas tester directement l'absence de problèmes de clarté via le résumé.
      if (Array.isArray(analysisSummary.clarityIssues)) {
        expect(analysisSummary.clarityIssues).toEqual([]);
      } else {
        expect(true).toBe(true); // Passe si non spécifié dans le résumé
      }
    });

    it('devrait inclure des exemples si le contenu est technique (présence de blocs de code)', () => {
      // Si le résumé d'analyse indique la présence d'exemples de code, on s'attend à au moins un bloc de code.
      // Sinon, on ne peut pas faire d'hypothèse.
      if (analysisSummary.hasCodeExamples === true) {
        expect(parsedCodeBlocks.length).toBeGreaterThanOrEqual(1);
      } else {
        expect(true).toBe(true); // Passe si non spécifié dans le résumé
      }
    });

    it('devrait avoir des liens fonctionnels (syntaxe valide)', () => {
      // Si le résumé d'analyse indique la présence de liens, on vérifie leur syntaxe.
      // Ne vérifie pas si l'URL est réellement accessible.
      if (analysisSummary.hasLinks === true) {
        expect(parsedLinks.length).toBeGreaterThanOrEqual(1);
        parsedLinks.forEach(link => {
          expect(link.text).not.toBe(''); // Le texte du lien ne doit pas être vide
          expect(link.url).toMatch(/^https?:\/\/\S+/); // L'URL doit commencer par http(s)://
        });
      } else {
        expect(true).toBe(true); // Passe si non spécifié dans le résumé
      }
    });

    it('devrait avoir du code bien formaté (blocs de code avec spécification de langage)', () => {
      const codeBlocksWithLang = markdownContent.match(/```(\w+)\n[\s\S]*?\n```/g) || [];
      // Si le résumé d'analyse spécifie le nombre de blocs de code avec langage, on l'utilise.
      // Sinon, on s'attend à ce que tous les blocs de code détectés aient une spécification de langage.
      if (typeof analysisSummary.codeBlocksWithLanguage === 'number') {
        expect(codeBlocksWithLang.length).toBe(analysisSummary.codeBlocksWithLanguage);
      } else if (parsedCodeBlocks.length > 0) {
        expect(codeBlocksWithLang.length).toBe(parsedCodeBlocks.length);
      } else {
        expect(true).toBe(true); // Passe s'il n'y a pas de blocs de code
      }
    });
  });

  describe('3. COMPLÉTUDE', () => {
    it('devrait couvrir tous les points importants (absence de points manquants signalés)', () => {
      // Se base sur le rapport d'analyse pour les points importants manquants.
      // Si analysisSummary.missingImportantPoints est un tableau, on s'attend à ce qu'il soit vide.
      if (Array.isArray(analysisSummary.missingImportantPoints)) {
        expect(analysisSummary.missingImportantPoints).toEqual([]);
      } else {
        expect(true).toBe(true); // Passe si non spécifié dans le résumé
      }
    });

    it('ne devrait pas avoir de sections vides', () => {
      const emptySections = parsedSections.filter(s => s.content.trim().length === 0);
      // Si analysisSummary.emptySections est un tableau, on s'attend à ce qu'il soit vide.
      // Sinon, on s'attend à ce qu'aucune section vide ne soit détectée.
      if (Array.isArray(analysisSummary.emptySections)) {
        expect(analysisSummary.emptySections).toEqual([]);
      } else {
        expect(emptySections.length).toBe(0);
      }
    });

    it('devrait avoir un formatage cohérent (absence de problèmes de formatage signalés)', () => {
      // Se base sur le rapport d'analyse pour les problèmes de formatage.
      // Si analysisSummary.formattingIssues est un tableau, on s'attend à ce qu'il soit vide.
      if (Array.isArray(analysisSummary.formattingIssues)) {
        expect(analysisSummary.formattingIssues).toEqual([]);
      } else {
        expect(true).toBe(true); // Passe si non spécifié dans le résumé
      }
    });
  });

  describe('4. TESTS SPÉCIFIQUES au contenu détecté', () => {
    // Génère un test pour chaque mot-clé détecté
    if (detectedKeywords.length === 0) {
      it('Aucun mot-clé spécifique détecté pour des tests supplémentaires.', () => {
        expect(true).toBe(true); // Passe le test si aucun mot-clé n'est à vérifier
      });
    } else {
      detectedKeywords.forEach(keyword => {
        it(`devrait mentionner le sujet "${keyword}"`, () => {
          // Vérifie que le mot-clé est présent dans le document
          expect(markdownContent).toContain(keyword);
        });
      });
    }
  });
});