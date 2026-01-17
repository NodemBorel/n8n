// TESTS GÉNÉRÉS PAR GEMINI AI
// Fichier source: document.md
// Fichier de test: test_1768640889468_document.js
// Date: 2026-01-17T09:08:09.468Z
// Méthode d'extraction: backticks
// ✅ Génération réussie

// Mock des données d'analyse et du contenu du fichier
// NOTE: Pour que les tests soient pertinents, mockFileContent doit être le contenu complet
// auquel se réfère mockAnalysisSummary. L'extrait fourni dans la consigne est utilisé ici
// pour la démo, mais le code utilise la variable complète `$json["Code"].fileContent`.
const mockFileContent = `{{$json["Code"].fileContent}}`;
const mockAnalysisSummary = {{$json["Code"].analysisSummary}};

describe('Analyse de la qualité du document Markdown', () => {
  // Préparation des données pour les tests
  const documentContent = mockFileContent;
  const analysisSummary = mockAnalysisSummary;

  describe('1. Structure du document', () => {
    it('devrait avoir un titre principal (H1)', () => {
      const h1Headings = analysisSummary.headings.filter(h => h.level === 1);
      expect(h1Headings.length).toBeGreaterThanOrEqual(1);
      expect(h1Headings[0].text).toBeDefined(); // S'assurer que le titre n'est pas vide
      expect(h1Headings[0].text.trim().length).toBeGreaterThan(0); // Le titre ne doit pas être juste des espaces
    });

    it('devrait être organisé en sections (H2 ou plus)', () => {
      const h2OrMoreHeadings = analysisSummary.headings.filter(h => h.level >= 2);
      // Un document bien structuré devrait avoir au moins quelques sous-sections.
      // Si le document est très court, il pourrait n'avoir qu'un H1, ce test pourrait être ajusté.
      expect(h2OrMoreHeadings.length).toBeGreaterThanOrEqual(1);
    });

    it('devrait avoir une longueur raisonnable pour la lisibilité (plus de 100 mots)', () => {
      // C'est une heuristique. Un document technique significatif devrait dépasser ce seuil.
      expect(analysisSummary.wordCount).toBeGreaterThan(100);
    });
  });

  describe('2. Qualité du contenu', () => {
    it('devrait inclure des explications claires (présence de paragraphes de texte significatifs)', () => {
      // Calculer la longueur du texte qui n'est ni un titre ni un bloc de code.
      // C'est une heuristique pour s'assurer qu'il y a du contenu explicatif.
      const totalLength = documentContent.length;
      const structuralLength = analysisSummary.headings.reduce((sum, h) => sum + h.text.length, 0) +
                               analysisSummary.codeBlocks.reduce((sum, cb) => sum + cb.content.length, 0);
      const explanatoryTextLength = totalLength - structuralLength;

      // On s'attend à ce qu'au moins 10% du document soit du texte explicatif.
      // Ce seuil peut être ajusté selon la nature du document.
      expect(explanatoryTextLength).toBeGreaterThan(totalLength * 0.1);
    });

    it('devrait inclure des exemples techniques si pertinent (blocs de code)', () => {
      // Pour un document technique, la présence de blocs de code est cruciale.
      expect(analysisSummary.codeBlocks.length).toBeGreaterThanOrEqual(1);
    });

    it('devrait avoir des liens fonctionnels (si détectés, vérification syntaxique)', () => {
      if (analysisSummary.links.length > 0) {
        analysisSummary.links.forEach((link, index) => {
          // Vérification basique que le lien a une URL et un texte non vide.
          // Une vérification HTTP réelle est hors de portée d'un test unitaire de document.
          expect(link.url).toMatch(/^https?:\/\/\S+/); // Doit commencer par http(s):// et contenir des caractères non-espaces
          expect(link.text).toBeDefined();
          expect(link.text.trim().length).toBeGreaterThan(0);
        });
      } else {
        // Si aucun lien n'est détecté, le test passe car il n'y a rien à vérifier.
        expect(analysisSummary.links.length).toBe(0);
      }
    });

    it('devrait avoir du code bien formaté (si présent, vérification de la langue spécifiée)', () => {
      if (analysisSummary.codeBlocks.length > 0) {
        analysisSummary.codeBlocks.forEach((block, index) => {
          // Chaque bloc de code devrait avoir une langue spécifiée pour un bon formatage/syntaxe.
          expect(block.language).toBeDefined();
          expect(block.language.trim().length).toBeGreaterThan(0);
          // Le contenu du bloc de code ne doit pas être vide
          expect(block.content.trim().length).toBeGreaterThan(0);
        });
      } else {
        expect(analysisSummary.codeBlocks.length).toBe(0);
      }
    });
  });

  describe('3. Complétude', () => {
    it('devrait couvrir les points importants (basé sur la présence des mots-clés détectés)', () => {
      // S'assurer qu'il y a des mots-clés à vérifier pour que ce test soit pertinent.
      expect(analysisSummary.detectedKeywords.length).toBeGreaterThan(0);

      analysisSummary.detectedKeywords.forEach(keyword => {
        // Vérifier que chaque mot-clé détecté apparaît au moins une fois dans le contenu.
        // Utilisation d'une regex pour une recherche insensible à la casse et aux mots entiers.
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        expect(documentContent).toMatch(regex);
      });
    });

    it('ne devrait pas contenir de sections vides (vérification heuristique de la densité de contenu)', () => {
      // Cette vérification est une heuristique. On s'assure qu'il y a suffisamment de contenu
      // en dehors des titres et des blocs de code pour éviter des sections "vides" ou très courtes.
      const totalLength = documentContent.length;
      const structuralLength = analysisSummary.headings.reduce((sum, h) => sum + h.text.length, 0) +
                               analysisSummary.codeBlocks.reduce((sum, cb) => sum + cb.content.length, 0);
      const nonStructuralContentLength = totalLength - structuralLength;

      // On s'attend à ce qu'au moins 10% du document soit du contenu "utile" (non-structurel),
      // ou un minimum absolu de caractères pour les documents plus courts.
      const minNonStructuralChars = 50;
      expect(nonStructuralContentLength).toBeGreaterThanOrEqual(Math.max(minNonStructuralChars, totalLength * 0.1));
    });

    it('devrait avoir une cohérence de formatage (hiérarchie des titres logique)', () => {
      if (analysisSummary.headings.length > 1) {
        let previousLevel = analysisSummary.headings[0].level;
        for (let i = 1; i < analysisSummary.headings.length; i++) {
          const currentLevel = analysisSummary.headings[i].level;
          // La règle est qu'un titre ne devrait pas sauter plus d'un niveau vers le bas (ex: H1 -> H3 sans H2).
          // Un titre de niveau N+1 doit suivre un titre de niveau N ou N+1.
          // Un titre de niveau N peut suivre un titre de niveau N+X (fermeture de sous-sections).
          // La vérification la plus simple est de s'assurer qu'on ne "saute" pas de niveau en descendant.
          expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
          previousLevel = currentLevel;
        }
      } else {
        // Si moins de 2 titres, la notion de hiérarchie est moins pertinente.
        expect(analysisSummary.headings.length).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('4. Tests spécifiques au contenu détecté', () => {
    {{#each $json["Code"].detectedKeywords}}
    it('devrait aborder le sujet: "{{this}}"', () => {
      // Vérifier la présence du mot-clé dans le contenu du document.
      // Ceci assure que les sujets identifiés par l'analyse sont bien traités dans le document.
      const keyword = "{{this}}";
      const regex = new RegExp(`\\b${keyword}\\b`, 'i'); // Recherche insensible à la casse et mot entier
      expect(documentContent).toMatch(regex);
    });
    {{/each}}
  });
});