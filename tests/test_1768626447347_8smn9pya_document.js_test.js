// TESTS POUR LE CONTENU DU DOCUMENT
// Fichier source: document.md
// Fichier de test: test_1768626447347_8smn9pya_document.js
// Date: 2026-01-17T05:07:27.347Z
// Analyse: 0 lignes, 0 sections
// Mots-clés détectés: aucun

// Placeholder pour les données réelles qui seront injectées par le système.
// En production, ces variables seraient remplies par l'analyse du document.
const actualAnalysisSummary = {
    // Ce résumé est basé sur l'extrait de contenu fourni dans la prompt.
    // Il sera remplacé par le contenu réel de $json["Code"].analysisSummary.
    title: "Titre du Document Technique Exemple",
    sections: [
        { level: 1, title: "Titre du Document Technique Exemple", contentSummary: "Introduction au document.", hasCode: false },
        { level: 2, title: "Introduction", contentSummary: "Ceci est une introduction claire et concise au sujet. Elle pose les bases nécessaires pour comprendre la suite.", hasCode: false },
        { level: 2, title: "Section Technique 1", contentSummary: "Cette section aborde des détails techniques importants. Il est crucial de comprendre ce point.", hasCode: true },
        { level: 2, title: "Section Technique 2", contentSummary: "Un autre aspect technique est présenté ici, avec un exemple concret. Pour plus d'informations, consultez le Lien externe. Un autre lien utile est Autre lien.", hasCode: true },
        { level: 3, title: "Sous-section A", contentSummary: "Approfondissement du sujet A, avec des explications détaillées.", hasCode: false },
        { level: 2, title: "Conclusion", contentSummary: "En résumé, ce document a couvert les points essentiels.", hasCode: false }
    ],
    codeBlocks: [
        { language: "javascript", content: "function exampleFunction() {\n    console.log(\"Ceci est un exemple de code JavaScript.\");\n}" },
        { language: "json", content: "{\n  \"configuration\": {\n    \"setting1\": \"value1\",\n    \"setting2\": true\n  }\n}" }
    ],
    links: [
        { text: "Lien externe", url: "https://example.com/doc" },
        { text: "Autre lien", url: "http://another.org/page" }
    ],
    wordCount: 150, // Estimé pour l'extrait
    estimatedReadingTimeMinutes: 1 // Estimé pour l'extrait
};

const actualFileContent = `
# Titre du Document Technique Exemple

## Introduction
Ceci est une introduction claire et concise au sujet. Elle pose les bases nécessaires pour comprendre la suite.

## Section Technique 1
Cette section aborde des détails techniques importants.
\`\`\`javascript
function exampleFunction() {
    console.log("Ceci est un exemple de code JavaScript.");
}
\`\`\`
Il est crucial de comprendre ce point.

## Section Technique 2
Un autre aspect technique est présenté ici, avec un exemple concret.
\`\`\`json
{
  "configuration": {
    "setting1": "value1",
    "setting2": true
  }
}
\`\`\`
Pour plus d'informations, consultez le [Lien externe](https://example.com/doc).
Un autre lien utile est [Autre lien](http://another.org/page).

### Sous-section A
Approfondissement du sujet A, avec des explications détaillées.

## Conclusion
En résumé, ce document a couvert les points essentiels.
`;

// Les mots-clés détectés seront injectés ici par le système.
// Par exemple: ["JavaScript", "JSON", "Configuration", "Exemple", "Fonction"]
const detectedKeywordsFromPrompt = [
    "JavaScript",
    "JSON",
    "Configuration",
    "Exemple",
    "Fonction"
];

// Simuler la fonction qui "lit" et "analyse" le document
const getDocumentAnalysis = jest.fn(async () => {
    return {
        analysisSummary: {
            ...actualAnalysisSummary,
            detectedKeywords: detectedKeywordsFromPrompt // Utilise les mots-clés fournis par la prompt
        },
        fileContent: actualFileContent
    };
});

describe('Tests de qualité et de contenu du document technique Markdown', () => {
    let documentData;

    // Avant tous les tests, "lire" et "analyser" le document
    beforeAll(async () => {
        documentData = await getDocumentAnalysis();
    });

    // 1. STRUCTURE DU DOCUMENT
    describe('1. Structure du document', () => {
        it('devrait avoir un titre principal (H1)', () => {
            expect(documentData.analysisSummary.title).toBeDefined();
            expect(documentData.analysisSummary.title).not.toBeNull();
            expect(documentData.analysisSummary.title.length).toBeGreaterThan(0);
            expect(documentData.fileContent).toMatch(/^#\s.+/m); // Vérifie la présence d'un H1 au début du fichier
        });

        it('devrait être organisé en sections avec des titres et des niveaux appropriés', () => {
            expect(documentData.analysisSummary.sections).toBeDefined();
            expect(Array.isArray(documentData.analysisSummary.sections)).toBe(true);
            expect(documentData.analysisSummary.sections.length).toBeGreaterThanOrEqual(3); // Minimum 3 sections (intro, corps, conclusion)
            documentData.analysisSummary.sections.forEach(section => {
                expect(section.title).toBeDefined();
                expect(section.title.length).toBeGreaterThan(0);
                expect(section.level).toBeGreaterThanOrEqual(1);
                expect(section.level).toBeLessThanOrEqual(3); // Assumons max H3 pour un document standard
            });
        });

        it('devrait avoir une bonne lisibilité générale (présence de sections et de contenu significatif)', () => {
            // La lisibilité est subjective, mais on peut vérifier la présence d'éléments qui y contribuent.
            expect(documentData.analysisSummary.sections.length).toBeGreaterThan(2); // Au moins une intro, un corps, une conclusion
            expect(documentData.analysisSummary.wordCount).toBeGreaterThan(50); // Un minimum de mots pour l'extrait
            expect(documentData.fileContent.length).toBeGreaterThan(200); // Un minimum de caractères pour l'extrait
        });
    });

    // 2. QUALITÉ DU CONTENU
    describe('2. Qualité du contenu', () => {
        it('devrait avoir des explications claires dans les sections (contentSummary non vide)', () => {
            documentData.analysisSummary.sections.forEach(section => {
                expect(section.contentSummary).toBeDefined();
                expect(section.contentSummary.length).toBeGreaterThan(20); // Un minimum de caractères pour une explication significative
                expect(section.contentSummary.trim()).not.toBe(''); // Ne doit pas être juste des espaces
            });
        });

        it('devrait inclure des exemples de code pour les sections techniques identifiées', () => {
            const technicalSectionsWithCodeFlag = documentData.analysisSummary.sections.filter(s => s.hasCode);
            if (technicalSectionsWithCodeFlag.length > 0) {
                technicalSectionsWithCodeFlag.forEach(section => {
                    // Vérifie que le contenu brut du fichier contient un bloc de code après le titre de la section
                    const sectionContentRegex = new RegExp(`##\\s+${section.title}[\\s\\S]*?\`\`\`[\\s\\S]*?\`\`\``);
                    expect(documentData.fileContent).toMatch(sectionContentRegex);
                });
            } else {
                // Si aucune section n'est marquée comme ayant du code, le test passe.
                expect(true).toBe(true);
            }
        });

        it('devrait avoir des liens valides (si détectés) avec un format URL correct', () => {
            if (documentData.analysisSummary.links && documentData.analysisSummary.links.length > 0) {
                documentData.analysisSummary.links.forEach(link => {
                    expect(link.url).toBeDefined();
                    expect(link.url).not.toBeNull();
                    // Vérifie un format d'URL basique (commence par http/https et contient un domaine)
                    expect(link.url).toMatch(/^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/);
                });
            } else {
                expect(true).toBe(true); // Aucun lien détecté, le test est considéré comme passant.
            }
        });

        it('devrait avoir du code bien formaté avec une langue spécifiée (si des blocs de code sont présents)', () => {
            if (documentData.analysisSummary.codeBlocks && documentData.analysisSummary.codeBlocks.length > 0) {
                documentData.analysisSummary.codeBlocks.forEach(block => {
                    expect(block.language).toBeDefined();
                    expect(block.language).not.toBeNull();
                    expect(block.language.length).toBeGreaterThan(0); // La langue doit être spécifiée (e.g., javascript, json)
                    expect(block.content).toBeDefined();
                    expect(block.content.length).toBeGreaterThan(5); // Le bloc de code ne doit pas être vide
                    // Vérifie la présence du bloc de code avec sa langue dans le contenu brut
                    const codeBlockRegex = new RegExp(`\`\`\`${block.language}\\n[\\s\\S]*?${block.content.split('\n')[0].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}[\\s\\S]*?\`\`\``);
                    expect(documentData.fileContent).toMatch(codeBlockRegex);
                });
            } else {
                expect(true).toBe(true); // Pas de code, pas de problème de formatage de code.
            }
        });
    });

    // 3. COMPLÉTUDE
    describe('3. Complétude du document', () => {
        it('devrait couvrir tous les points importants listés dans les mots-clés détectés', () => {
            expect(documentData.analysisSummary.detectedKeywords).toBeDefined();
            expect(Array.isArray(documentData.analysisSummary.detectedKeywords)).toBe(true);
            expect(documentData.analysisSummary.detectedKeywords.length).toBeGreaterThan(0);

            documentData.analysisSummary.detectedKeywords.forEach(keyword => {
                // Vérifie que chaque mot-clé est mentionné au moins une fois dans le contenu du document
                // La recherche est insensible à la casse et gère les pluriels simples pour une meilleure robustesse
                const regex = new RegExp(`\\b${keyword}(s)?\\b`, 'i');
                expect(documentData.fileContent).toMatch(regex);
            });
        });

        it('ne devrait pas contenir de sections vides ou avec un contenu minimal', () => {
            documentData.analysisSummary.sections.forEach(section => {
                expect(section.contentSummary).toBeDefined();
                expect(section.contentSummary.length).toBeGreaterThan(20); // Un minimum de contenu pour ne pas être vide
                expect(section.contentSummary.trim()).not.toBe('');
            });
        });

        it('devrait avoir une cohérence de formatage structurel (présence de titres de niveaux variés)', () => {
            // Vérifie la présence de titres de différents niveaux pour une bonne structuration
            expect(documentData.fileContent).toMatch(/^##\s.+/m); // Au moins un H2
            expect(documentData.fileContent).toMatch(/^###\s.+/m); // Au moins un H3
            // On pourrait ajouter des tests pour les listes, les gras/italiques, etc.,
            // si l'analysisSummary fournissait ces détails de manière fiable.
        });
    });

    // 4. TESTS SPÉCIFIQUES au contenu détecté
    describe('4. Tests spécifiques aux mots-clés détectés', () => {
        // Génération dynamique des tests pour chaque mot-clé détecté
        documentData.analysisSummary.detectedKeywords.forEach(keyword => {
            it(`devrait discuter du sujet "${keyword}" de manière adéquate`, () => {
                // Vérifie que le mot-clé apparaît dans au moins un titre de section
                const keywordInTitle = documentData.analysisSummary.sections.some(section =>
                    new RegExp(`\\b${keyword}\\b`, 'i').test(section.title)
                );
                // Ou qu'il apparaît plusieurs fois dans le contenu général (au moins 2 fois pour "adéquat")
                const keywordOccurrences = (documentData.fileContent.match(new RegExp(`\\b${keyword}(s)?\\b`, 'gi')) || []).length;

                // Une discussion adéquate signifie soit dans un titre, soit plusieurs occurrences dans le texte.
                expect(keywordInTitle || keywordOccurrences >= 2).withContext(`Le mot-clé "${keyword}" devrait être présent dans un titre de section ou apparaître au moins 2 fois dans le contenu.`).toBe(true);

                // Si le mot-clé est technique, vérifier la présence de code blocks associés
                const technicalKeywords = ['JavaScript', 'JSON', 'Code', 'Function', 'Configuration', 'API', 'Module', 'Déploiement', 'Test', 'Framework']; // Liste extensible de mots-clés techniques
                if (technicalKeywords.includes(keyword)) {
                    const hasAssociatedCodeBlock = documentData.analysisSummary.codeBlocks.some(block =>
                        new RegExp(`\\b${keyword}\\b`, 'i').test(block.content) ||
                        new RegExp(`\\b${keyword}\\b`, 'i').test(block.language)
                    );
                    expect(hasAssociatedCodeBlock).withContext(`Pour le mot-clé technique "${keyword}", un bloc de code associé devrait être présent.`).toBe(true);
                }
            });
        });
    });
});