// TESTS POUR LE CONTENU DU DOCUMENT
// Fichier source: document_1768627661310.md
// Fichier de test: test_1768627661310_D50AKM
// Date: 2026-01-17T05:27:41.310Z
// Analyse: 0 lignes, 0 sections
// Mots-clés détectés: aucun

// Mock des lectures de fichiers n'est pas nécessaire car le contenu est directement fourni sous forme de chaîne.
// Si le contenu devait être lu depuis un fichier, on utiliserait quelque chose comme :
// jest.mock('fs', () => ({
//   readFileSync: jest.fn(() => 'Contenu du fichier Markdown simulé'),
// }));

// Le contenu du document Markdown à analyser
const markdownContent = `{{$json["Code"].fileContent}}`;

// Le résumé d'analyse généré par l'expert
const analysisSummary = {{$json["Code"].analysisSummary}};

describe('Analyse de la qualité et du contenu du document Markdown', () => {

  // --- Fonctions utilitaires pour l'analyse du Markdown ---

  /**
   * Extrait tous les titres d'un niveau spécifique (H1, H2, etc.).
   * @param {number} level Le niveau de titre (ex: 1 pour H1, 2 pour H2).
   * @returns {string[]} Un tableau des textes des titres trouvés.
   */
  const getHeadings = (level) => {
    const regex = new RegExp(`^${'#'.repeat(level)}\\s(.+)`, 'gm');
    return [...markdownContent.matchAll(regex)].map(match => match[1].trim());
  };

  /**
   * Extrait le contenu de tous les blocs de code.
   * @returns {string[]} Un tableau des contenus des blocs de code.
   */
  const getCodeBlocks = () => {
    const regex = /```(?:\w+)?\n([\s\S]*?)\n```/g;
    return [...markdownContent.matchAll(regex)].map(match => match[1].trim());
  };

  /**
   * Extrait tous les liens Markdown (texte et URL).
   * @returns {{text: string, url: string}[]} Un tableau d'objets représentant les liens.
   */
  const getLinks = () => {
    const regex = /\[([^\]]+?)\]\((https?:\/\/[^\s)]+?)\)/g;
    return [...markdownContent.matchAll(regex)].map(match => ({ text: match[1], url: match[2] }));
  };

  /**
   * Divise le document en sections basées sur les titres (H1-H6).
   * @returns {{title: string, content: string}[]} Un tableau d'objets représentant les sections.
   */
  const getSections = () => {
    const sections = markdownContent.split(/(^#{1,6}\s.*)/gm);
    const parsedSections = [];
    let currentTitle = 'Introduction'; // Pour le contenu avant le premier titre
    let currentContent = '';

    for (let i = 0; i < sections.length; i++) {
      const segment = sections[i];
      if (segment.match(/^#{1,6}\s.*$/)) { // C'est un titre Markdown
        if (currentContent.trim().length > 0 || currentTitle !== 'Introduction') {
          parsedSections.push({ title: currentTitle, content: currentContent.trim() });
        }
        currentTitle = segment.trim();
        currentContent = '';
      } else {
        currentContent += segment;
      }
    }
    // Ajoute la dernière section si elle existe
    if (currentContent.trim().length > 0 || currentTitle !== 'Introduction') {
      parsedSections.push({ title: currentTitle, content: currentContent.trim() });
    }
    return parsedSections;
  };

  // --- 1. TESTS DE LA STRUCTURE DU DOCUMENT ---
  describe('1. STRUCTURE DU DOCUMENT', () => {
    it('devrait avoir un titre principal (H1)', () => {
      const h1Headings = getHeadings(1);
      expect(h1Headings.length).toBeGreaterThanOrEqual(1);
      expect(h1Headings[0]).toBeDefined(); // Vérifie que le titre n'est pas vide
    });

    it('devrait être organisé en sections (au moins des titres H2)', () => {
      const h2Headings = getHeadings(2);
      // Un document bien organisé devrait avoir au moins deux sections principales (H2)
      expect(h2Headings.length).toBeGreaterThanOrEqual(2);
    });

    it('devrait avoir une bonne lisibilité générale (longueur de ligne raisonnable)', () => {
      const lines = markdownContent.split('\n');
      // Un seuil arbitraire pour les lignes excessivement longues (ex: plus de 120 caractères)
      const longLines = lines.filter(line => line.length > 120);
      // On tolère un petit pourcentage de lignes longues (ex: pour des URLs ou des exemples de code)
      expect(longLines.length).toBeLessThan(lines.length * 0.15); // Moins de 15% de lignes trop longues
    });
  });

  // --- 2. TESTS DE LA QUALITÉ DU CONTENU ---
  describe('2. QUALITÉ DU CONTENU', () => {
    it('devrait avoir des explications claires (absence de phrases excessivement longues)', () => {
      // Cette vérification est une heuristique pour la clarté, pas une mesure parfaite.
      // Des phrases très longues peuvent indiquer une complexité ou un manque de clarté.
      const sentences = markdownContent.split(/[.!?]\s+/);
      const veryLongSentences = sentences.filter(s => s.length > 250); // Seuil arbitraire pour des phrases très longues
      expect(veryLongSentences.length).toBeLessThan(sentences.length * 0.05); // Moins de 5% de phrases très longues
    });

    it('devrait inclure des exemples techniques si le contenu est technique (présence de blocs de code)', () => {
      // Détermine si le document est considéré comme technique basé sur les mots-clés détectés
      const isTechnical = analysisSummary.detectedKeywords.some(kw =>
        ['code', 'API', 'développement', 'technique', 'implémentation', 'fonctionnalité', 'logiciel'].includes(kw.toLowerCase())
      );

      if (isTechnical) {
        const codeBlocks = getCodeBlocks();
        expect(codeBlocks.length).toBeGreaterThanOrEqual(1); // Au moins un bloc de code est attendu
      } else {
        // Si le document n'est pas technique, la présence de code n'est pas une exigence.
        expect(true).toBe(true);
      }
    });

    it('devrait avoir des liens fonctionnels (syntaxe Markdown correcte pour les liens)', () => {
      const links = getLinks();
      // Vérifie qu'il y a des liens si l'analyse en a détecté, et que leur syntaxe est correcte.
      // On suppose que analysisSummary.links est un tableau d'URLs ou d'objets de liens.
      if (analysisSummary.links && analysisSummary.links.length > 0) {
        expect(links.length).toBeGreaterThanOrEqual(analysisSummary.links.length);
        links.forEach(link => {
          expect(link.text).not.toBe(''); // Le texte du lien ne doit pas être vide
          // L'URL doit correspondre à un format HTTP(S) valide
          expect(link.url).toMatch(/^https?:\/\/[^\s/$.?#].[^\s]*$/i);
        });
      } else {
        // Si aucun lien n'est détecté par l'analyse, on s'assure qu'il n'y en a pas de mal formés.
        // Si analysisSummary.links est vide ou non défini, on s'attend à ne trouver aucun lien par regex.
        expect(links.length).toBe(0);
      }
    });

    it('devrait avoir du code bien formaté (blocs de code avec langage spécifié)', () => {
      const codeBlocksWithLang = [...markdownContent.matchAll(/```(\w+)\n/g)];
      const totalCodeBlocks = [...markdownContent.matchAll(/```(?:\w+)?\n/g)];

      if (totalCodeBlocks.length > 0) {
        // Exige qu'au moins 80% des blocs de code aient un langage spécifié pour une meilleure lisibilité.
        expect(codeBlocksWithLang.length / totalCodeBlocks.length).toBeGreaterThanOrEqual(0.8);
      } else {
        // Pas de blocs de code, donc pas de problème de formatage de code.
        expect(true).toBe(true);
      }
    });
  });

  // --- 3. TESTS DE COMPLÉTUDE ---
  describe('3. COMPLÉTUDE', () => {
    it('devrait couvrir tous les points importants (basé sur les mots-clés détectés)', () => {
      analysisSummary.detectedKeywords.forEach(keyword => {
        // Vérifie que chaque mot-clé détecté par l'analyse est présent dans le document (insensible à la casse).
        // Utilisation de \b pour s'assurer que c'est un mot entier.
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        expect(markdownContent).toMatch(regex);
      });
    });

    it('ne devrait pas contenir de sections vides', () => {
      const sections = getSections();
      sections.forEach(section => {
        // Le contenu d'une section ne doit pas être vide après avoir retiré les titres éventuels.
        const contentWithoutHeadings = section.content.replace(/^#+\s.*$/gm, '').trim();
        expect(contentWithoutHeadings.length).toBeGreaterThan(0);
      });
    });

    it('devrait avoir une cohérence de formatage (pas de mélange de styles de listes pour un même type)', () => {
      // Vérifie l'utilisation cohérente des puces pour les listes non ordonnées.
      // Un mélange de `*`, `-`, `+` pour le même type de liste est considéré comme une incohérence.
      const hasAsteriskList = /\n\s*\*\s/.test(markdownContent);
      const hasDashList = /\n\s*-\s/.test(markdownContent);
      const hasPlusList = /\n\s*\+\s/.test(markdownContent);

      // Compte le nombre de styles de puces non ordonnées actifs.
      const activeBulletStyles = [hasAsteriskList, hasDashList, hasPlusList].filter(Boolean).length;
      // Un seul style de puce non ordonnée est autorisé pour la cohérence.
      expect(activeBulletStyles).toBeLessThanOrEqual(1);
    });
  });

  // --- 4. TESTS SPÉCIFIQUES AU CONTENU DÉTECTÉ ---
  describe('4. TESTS SPÉCIFIQUES au contenu détecté', () => {
    // Test générique pour la présence de chaque mot-clé détecté
    analysisSummary.detectedKeywords.forEach(keyword => {
      it(`devrait mentionner le sujet: "${keyword}"`, () => {
        const regex = new RegExp(keyword, 'i'); // Insensible à la casse
        expect(markdownContent).toMatch(regex);
      });
    });

    // Test spécifique si le document est identifié comme une documentation API
    if (analysisSummary.documentType === 'API Documentation' || analysisSummary.detectedKeywords.includes('API')) {
      it('devrait définir des endpoints API avec des méthodes HTTP (si applicable)', () => {
        // Recherche de motifs courants pour les endpoints API (ex: GET /api/v1/resource)
        const apiEndpointRegex = /(GET|POST|PUT|DELETE|PATCH)\s+\/[\w\d\-\/]+/g;
        const apiEndpoints = [...markdownContent.matchAll(apiEndpointRegex)];

        // Si 'API' est un mot-clé majeur, on s'attend à trouver au moins un endpoint.
        const hasApiKeyword = analysisSummary.detectedKeywords.some(kw => kw.toLowerCase() === 'api');
        if (hasApiKeyword) {
          expect(apiEndpoints.length).toBeGreaterThanOrEqual(1);
        } else {
          // Si 'API' n'est pas un mot-clé majeur, la présence d'endpoints n'est pas obligatoire.
          expect(true).toBe(true);
        }
      });
    }

    // Test spécifique si le document mentionne l'installation
    if (analysisSummary.detectedKeywords.includes('Installation')) {
      it('devrait fournir des étapes claires pour l\'installation (listes numérotées ou sous-sections)', () => {
        // Recherche d'une section "Installation" et de son contenu
        const installationSectionRegex = /(^##\sInstallation[\s\S]*?)(?=(^##\s|\Z))/im;
        const installationSectionMatch = markdownContent.match(installationSectionRegex);

        if (installationSectionMatch) {
          const sectionContent = installationSectionMatch[1];
          // Vérifie la présence de listes numérotées ou de sous-titres (H3) dans la section d'installation.
          const hasNumberedList = /\n\s*\d+\.\s/.test(sectionContent);
          const hasSubheadings = /(^###\s)/m.test(sectionContent);
          expect(hasNumberedList || hasSubheadings).toBe(true);
        } else {
          // Si aucune section "Installation" explicite n'est trouvée, le test passe.
          expect(true).toBe(true);
        }
      });
    }

    // Ajoutez d'autres tests spécifiques ici en fonction des mots-clés ou du type de document détectés.
    // Par exemple, si "Configuration" est détecté, vérifier la présence de blocs de code de configuration ou de tableaux de paramètres.
    if (analysisSummary.detectedKeywords.includes('Configuration')) {
      it('devrait détailler les options de configuration (ex: avec des listes ou des blocs de code)', () => {
        const configSectionRegex = /(^##\sConfiguration[\s\S]*?)(?=(^##\s|\Z))/im;
        const configSectionMatch = markdownContent.match(configSectionRegex);

        if (configSectionMatch) {
          const sectionContent = configSectionMatch[1];
          const hasList = /\n\s*[-*+]\s/.test(sectionContent) || /\n\s*\d+\.\s/.test(sectionContent);
          const hasCodeBlock = /```(?:\w+)?\n([\s\S]*?)\n```/.test(sectionContent);
          expect(hasList || hasCodeBlock).toBe(true);
        } else {
          expect(true).toBe(true);
        }
      });
    }
  });
});