// TESTS POUR LE CONTENU DU DOCUMENT
// Fichier: document.md
// Date: 2026-01-17T04:28:26.969Z
// Analyse: undefined lignes, undefined sections
// Mots-clés détectés: aucun

// Mock du module 'fs' pour simuler la lecture du fichier
const mockFs = {
    readFileSync: jest.fn(),
};

// Importation simulée du module 'fs'
jest.mock('fs', () => mockFs);

// Classe ou fonctions d'analyse du document Markdown
// Cette classe simule un outil d'analyse qui serait testé.
// Elle extrait des informations clés du contenu Markdown.
class DocumentAnalyzer {
    constructor(markdownContent) {
        this.content = markdownContent;
        this.lines = markdownContent.split('\n');
    }

    // Vérifie la présence d'un titre principal (H1)
    hasMainTitle() {
        return /^#\s.+/.test(this.content);
    }

    // Compte le nombre de sections (H1, H2, H3, etc.)
    getSectionCount() {
        return (this.content.match(/^#+\s.+/gm) || []).length;
    }

    // Récupère tous les titres avec leur niveau
    getHeadings() {
        const headings = [];
        this.lines.forEach(line => {
            const match = line.match(/^(#+)\s(.+)/);
            if (match) {
                headings.push({
                    level: match[1].length,
                    title: match[2].trim()
                });
            }
        });
        return headings;
    }

    // Vérifie si le document a au moins un certain nombre de sections
    hasMinimumSections(min) {
        return this.getSectionCount() >= min;
    }

    // Vérifie la présence de blocs de code
    hasCodeBlocks() {
        return /```[\s\S]*?```/gm.test(this.content);
    }

    // Compte le nombre de blocs de code
    getCodeBlockCount() {
        // Compte les paires de '```'
        const matches = this.content.match(/```/g);
        return matches ? matches.length / 2 : 0;
    }

    // Vérifie la présence de liens Markdown
    hasLinks() {
        return /\[.+\]\(.+\)/.test(this.content);
    }

    // Compte le nombre de liens Markdown
    getLinkCount() {
        return (this.content.match(/\[.+\]\(.+\)/g) || []).length;
    }

    // Vérifie si une section est vide (un titre suivi directement d'un autre titre)
    hasEmptySections() {
        // Regex pour détecter un titre suivi immédiatement d'un autre titre,
        // avec ou sans lignes vides intermédiaires.
        // Ex: "## Titre1\n\n## Titre2" ou "## Titre1\n## Titre2"
        return /^#+\s.+(\n\s*)*^#+\s.+/gm.test(this.content);
    }

    // Vérifie la présence d'un mot-clé
    containsKeyword(keyword) {
        // Recherche insensible à la casse et mot entier
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        return regex.test(this.content);
    }

    // Vérifie la cohérence des niveaux de titre (pas de saut H1 -> H3 par exemple)
    hasConsistentHeadingLevels() {
        const headings = this.getHeadings();
        if (headings.length <= 1) return true;

        for (let i = 0; i < headings.length - 1; i++) {
            const currentLevel = headings[i].level;
            const nextLevel = headings[i + 1].level;

            // Un saut de niveau est acceptable si le niveau suivant est inférieur (nouvelle sous-section)
            // ou si le niveau est le même.
            // Un saut H1 -> H3 (nextLevel > currentLevel + 1) est considéré comme incohérent.
            if (nextLevel > currentLevel + 1) {
                return false;
            }
        }
        return true;
    }

    // Vérifie si les paragraphes ne sont pas excessivement longs (indicateur de lisibilité)
    hasReasonableParagraphLength(maxLength = 800) { // 800 caractères est une heuristique
        // Sépare le contenu par double saut de ligne pour obtenir des "blocs"
        const blocks = this.content.split('\n\n');
        
        for (const block of blocks) {
            const trimmedBlock = block.trim();
            // Ignore les titres, les blocs de code et les listes pour cette vérification
            if (trimmedBlock.startsWith('#') || trimmedBlock.startsWith('```') || trimmedBlock.startsWith('- ') || trimmedBlock.startsWith('* ') || trimmedBlock.match(/^\d+\./)) {
                continue;
            }
            // Si un bloc de texte pur est trop long
            if (trimmedBlock.length > maxLength) {
                return false;
            }
        }
        return true;
    }
}

// --- Début des tests Jest ---

// Données d'analyse simulées (remplacez par les vraies données du prompt)
// Ces données sont utilisées pour les assertions basées sur l'analyse préalable
const analysisSummary = {{$json["Code"].analysisSummary}};
const detectedKeywords = {{$json["Code"].detectedKeywords}};
const fileContent = `{{$json["Code"].fileContent.substring(0, 2000)}}`; // L'extrait du contenu

describe('Analyse de la qualité et du contenu du document Markdown', () => {
    let analyzer;
    const documentPath = 'path/to/your/document.md';

    beforeAll(() => {
        // Mock la lecture du fichier pour retourner le contenu fourni
        mockFs.readFileSync.mockReturnValue(fileContent);
        // Initialise l'analyseur avec le contenu mocké
        analyzer = new DocumentAnalyzer(mockFs.readFileSync(documentPath, 'utf8'));
    });

    // 1. STRUCTURE DU DOCUMENT
    describe('1. STRUCTURE DU DOCUMENT', () => {
        it('devrait avoir un titre principal (H1)', () => {
            expect(analyzer.hasMainTitle()).toBe(true);
        });

        it('devrait être organisé en sections (au moins 3 sections détectées)', () => {
            // Utilise les données de l'analyse si disponibles, sinon une heuristique
            const expectedSectionCount = analysisSummary.sections ? analysisSummary.sections.filter(s => s.level <= 2).length : 3;
            expect(analyzer.getSectionCount()).toBeGreaterThanOrEqual(expectedSectionCount);
        });

        it('devrait avoir une organisation des titres cohérente (pas de saut H1 -> H3)', () => {
            expect(analyzer.hasConsistentHeadingLevels()).toBe(true);
        });

        it('devrait avoir des paragraphes de longueur raisonnable pour la lisibilité', () => {
            // Une longueur maximale de 800 caractères par paragraphe est une heuristique
            expect(analyzer.hasReasonableParagraphLength(800)).toBe(true);
        });
    });

    // 2. QUALITÉ DU CONTENU
    describe('2. QUALITÉ DU CONTENU', () => {
        it('devrait contenir des explications claires (présence de contenu après les titres)', () => {
            // Ce test est une heuristique: vérifier qu'il n'y a pas de sections vides
            expect(analyzer.hasEmptySections()).toBe(false);
        });

        it('devrait inclure des exemples de code si le contenu est technique', () => {
            // Si l'analyse a détecté du contenu technique, on s'attend à des blocs de code
            if (analysisSummary.technicalContentDetected) {
                expect(analyzer.hasCodeBlocks()).toBe(true);
                // On peut aussi vérifier un nombre minimum de blocs de code
                expect(analyzer.getCodeBlockCount()).toBeGreaterThanOrEqual(analysisSummary.codeBlocksCount > 0 ? analysisSummary.codeBlocksCount : 1);
            } else {
                // Si non technique, ce test est moins critique, ou on pourrait s'attendre à l'absence de code
                expect(true).toBe(true); // Passe le test si non pertinent
            }
        });

        it('devrait avoir des liens fonctionnels si détectés dans l\'analyse', () => {
            // On vérifie la présence de la syntaxe Markdown des liens
            if (analysisSummary.linkCount > 0) {
                expect(analyzer.hasLinks()).toBe(true);
                expect(analyzer.getLinkCount()).toBeGreaterThanOrEqual(analysisSummary.linkCount);
            } else {
                expect(analyzer.hasLinks()).toBe(false); // S'il n'y a pas de liens attendus, il ne devrait pas y en avoir
            }
        });

        it('devrait avoir le code bien formaté (vérification basique de la présence de blocs)', () => {
            // Une vérification plus approfondie nécessiterait un linter Markdown ou un parseur AST.
            // Pour ce test, la simple présence de blocs de code est suffisante.
            if (analysisSummary.technicalContentDetected) {
                expect(analyzer.hasCodeBlocks()).toBe(true);
            } else {
                expect(true).toBe(true); // Passe le test si non pertinent
            }
        });
    });

    // 3. COMPLÉTUDE
    describe('3. COMPLÉTUDE', () => {
        it('devrait couvrir tous les points importants (vérification des sections clés)', () => {
            // Vérifie la présence des titres principaux détectés dans l'analyse
            const expectedMainSections = analysisSummary.sections
                .filter(s => s.level === 2)
                .map(s => s.title);

            expectedMainSections.forEach(sectionTitle => {
                expect(analyzer.content).toContain(sectionTitle);
            });
            // Vérifie aussi la présence d'une introduction et d'une conclusion si le document est structuré
            expect(analyzer.content).toMatch(/^(#+)\sIntroduction/m);
            expect(analyzer.content).toMatch(/^(#+)\sConclusion/m);
        });

        it('ne devrait pas contenir de sections vides', () => {
            expect(analyzer.hasEmptySections()).toBe(false);
        });

        it('devrait avoir un formatage cohérent des titres', () => {
            // Ce test est déjà couvert par 'organisation des titres cohérente'
            // On peut ajouter une vérification pour s'assurer qu'il n'y a pas de titres mal formés (ex: #Titre)
            const malformedHeading = /^(#+)[^#\s]/m; // Ex: ##Titre au lieu de ## Titre
            expect(malformedHeading.test(analyzer.content)).toBe(false);
        });
    });

    // 4. TESTS SPÉCIFIQUES au contenu détecté
    describe('4. TESTS SPÉCIFIQUES au contenu détecté', () => {
        // Génère un test pour chaque mot-clé détecté
        detectedKeywords.forEach(keyword => {
            it(`devrait mentionner le sujet spécifique: "${keyword}"`, () => {
                expect(analyzer.containsKeyword(keyword)).toBe(true);
            });
        });
    });
});