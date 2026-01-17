// TESTS GÉNÉRÉS PAR GEMINI AI
// Fichier source: document.md
// Fichier de test: test_1768646883892_document.js
// Date: 2026-01-17T10:48:03.892Z
// Méthode d'extraction: backticks
// ✅ Génération réussie

// Mock du contenu du fichier Markdown
const mockFileContent = `
# Titre Principal du Projet

Ceci est une introduction générale au projet. Il s'agit d'un système de gestion de microservices distribués, conçu pour être hautement disponible et scalable. Il utilise une architecture basée sur des événements et une base de données NoSQL pour la persistance des données.

## 1. Introduction

Ce document décrit l'architecture, l'installation et l'utilisation du système \`MonSuperService\`. Il est destiné aux développeurs et aux administrateurs système.

### 1.1. Objectifs

Les objectifs principaux sont :

-   Fournir une API RESTful robuste.
-   Assurer une haute disponibilité.
-   Permettre un déploiement facile via Docker.

## 2. Installation

Pour installer le service, suivez les étapes ci-dessous.

### 2.1. Prérequis

Assurez-vous d'avoir installé :

-   Docker (version 20.10.0 ou supérieure)
-   Docker Compose (version 1.29.0 ou supérieure)
-   Node.js (version 16.x ou supérieure) pour les outils de développement.

### 2.2. Étapes d'installation

1.  Clonez le dépôt :
    \`\`\`bash
    git clone https://github.com/votre-org/mon-super-service.git
    cd mon-super-service
    \`\`\`
2.  Configurez les variables d'environnement (voir section 3. Configuration).
3.  Démarrez les services :
    \`\`\`bash
    docker-compose up -d
    \`\`\`

Le service devrait être accessible sur \`http://localhost:3000\`.

## 3. Configuration

La configuration se fait via un fichier \`.env\` à la racine du projet.

### 3.1. Variables d'environnement

Voici les variables essentielles :

-   \`PORT\`: Port d'écoute du service (par défaut : \`3000\`)\n-   \`DATABASE_URL\`: URL de connexion à la base de données (ex: \`mongodb://localhost:27017/myservice\`)\n-   \`JWT_SECRET\`: Clé secrète pour l'authentification JWT.

Exemple de fichier \`.env\` :

\`\`\`dotenv
PORT=8080
DATABASE_URL=mongodb://mongo:27017/prod_service
JWT_SECRET=super_secret_key_change_me
\`\`\`

## 4. Utilisation de l'API

L'API est accessible via \`http://localhost:PORT/api/v1\`.

### 4.1. Authentification

Toutes les requêtes nécessitent un token JWT valide dans l'en-tête \`Authorization: Bearer <token>\`.

### 4.2. Endpoints

-   \`GET /users\`: Récupère la liste des utilisateurs.
-   \`POST /users\`: Crée un nouvel utilisateur.
    \`\`\`json
    {
      "username": "john.doe",
      "email": "john.doe@example.com",
      "password": "securepassword123"
    }
    \`\`\`

## 5. Déploiement

Le déploiement en production est facilité par l'utilisation de Docker et Kubernetes.

### 5.1. Kubernetes

Des fichiers de configuration Kubernetes sont fournis dans le dossier \`k8s/\`.

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-service-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-service
  template:
    metadata:
      labels:
        app: my-service
    spec:
      containers:
      - name: my-service
        image: your-registry/my-service:latest
        ports:
        - containerPort: 8080
\`\`\`

## 6. Tests

Le projet inclut des tests unitaires et d'intégration.

### 6.1. Tests unitaires

Pour exécuter les tests unitaires :

\`\`\`bash
npm test
\`\`\`

### 6.2. Intégration Continue

Un pipeline CI/CD est configuré avec GitHub Actions pour automatiser les tests et le déploiement.

## 7. Contribuer

Voir le fichier [CONTRIBUTING.md](CONTRIBUTING.md) pour les directives de contribution.

## 8. Support

Pour toute question, ouvrez une issue sur [GitHub](https://github.com/votre-org/mon-super-service/issues).

## 9. Annexe

Ceci est une section annexe qui pourrait contenir des informations supplémentaires ou des glossaires.

### 9.1. Glossaire

-   **Microservice**: Un petit service indépendant qui communique via des APIs.
-   **JWT**: JSON Web Token, un standard ouvert pour la création de tokens d'accès.

`;

// Mots-clés détectés par l'analyse (simulés à partir de l'input JSON)
const detectedKeywords = [
  'API',
  'configuration',
  'déploiement',
  'authentification',
  'base de données',
  'microservices',
  'tests unitaires',
  'intégration continue',
];

// Fonction utilitaire pour simuler la lecture du fichier
const readFileContent = async () => {
  return Promise.resolve(mockFileContent);
};

// Fonction utilitaire pour parser le Markdown et extraire des informations structurées
const parseMarkdown = (markdownContent) => {
  const lines = markdownContent.split('\n');
  const parsed = {
    title: null,
    sections: [],
    codeBlocks: [],
    links: [],
    paragraphs: [], // Paragraphes de niveau supérieur (avant la première section)
    rawContent: markdownContent,
  };

  let currentSection = null;
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeBlockLang = '';

  // Regex pour les liens Markdown
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; // Garde la ligne originale pour les blocs de code et l'indentation
    const trimmedLine = line.trim();

    // Titre principal (H1)
    if (trimmedLine.startsWith('# ') && !parsed.title) {
      parsed.title = trimmedLine.substring(2).trim();
      continue;
    }

    // Sections (H2, H3, etc.)
    const headerMatch = trimmedLine.match(/^(##+)\s(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      currentSection = { title, level, content: [], rawLines: [] }; // rawLines pour stocker toutes les lignes de la section
      parsed.sections.push(currentSection);
      continue;
    }

    // Blocs de code
    if (trimmedLine.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = trimmedLine.substring(3).trim();
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        parsed.codeBlocks.push({ lang: codeBlockLang, content: codeBlockContent.join('\n') });
        codeBlockContent = [];
        codeBlockLang = '';
      }
      if (currentSection) currentSection.rawLines.push(line); // Ajoute le marqueur de bloc de code aux lignes brutes de la section
      continue;
    }

    // Contenu des blocs de code
    if (inCodeBlock) {
      codeBlockContent.push(line);
      if (currentSection) currentSection.rawLines.push(line);
      continue;
    }

    // Liens (vérifie dans trimmedLine pour éviter les problèmes avec les espaces de début)
    let match;
    while ((match = linkRegex.exec(trimmedLine)) !== null) {
      parsed.links.push({ text: match[1], url: match[2] });
    }

    // Paragraphes et autre contenu
    if (trimmedLine && !trimmedLine.startsWith('- ') && !trimmedLine.startsWith('* ') && !trimmedLine.match(/^\d+\.\s/)) {
      if (currentSection) {
        currentSection.content.push(trimmedLine); // Stocke le contenu nettoyé pour les vérifications de clarté
        currentSection.rawLines.push(line); // Stocke la ligne brute pour les vérifications de complétude
      } else {
        parsed.paragraphs.push(trimmedLine);
      }
    }
  }

  // Gère un bloc de code en fin de fichier si le fichier se termine brusquement
  if (inCodeBlock) {
    parsed.codeBlocks.push({ lang: codeBlockLang, content: codeBlockContent.join('\n') });
  }

  return parsed;
};

describe('Analyse de la qualité du document Markdown technique', () => {
  let documentContent;
  let parsedDocument;

  // Avant tous les tests, charge et parse le contenu du document
  beforeAll(async () => {
    documentContent = await readFileContent();
    parsedDocument = parseMarkdown(documentContent);
  });

  // 1. TESTS DE LA STRUCTURE DU DOCUMENT
  describe('1. Structure du document', () => {
    it('devrait avoir un titre principal (H1)', () => {
      expect(parsedDocument.title).toBeDefined();
      expect(parsedDocument.title).not.toBeNull();
      expect(parsedDocument.title.length).toBeGreaterThan(0, 'Le document doit avoir un titre principal (H1).');
    });

    it('devrait être organisé en sections (H2 ou H3)', () => {
      expect(parsedDocument.sections.length).toBeGreaterThan(0, 'Le document doit contenir au moins une section (H2 ou H3).');
      const hasH2 = parsedDocument.sections.some(s => s.level === 2);
      const hasH3 = parsedDocument.sections.some(s => s.level === 3);
      expect(hasH2 || hasH3).toBeTruthy('Le document doit contenir des sections de niveau H2 ou H3.');
    });

    it('devrait avoir une bonne lisibilité générale (longueur de ligne raisonnable, présence de paragraphes)', () => {
      // Vérifie la présence de paragraphes significatifs (hors titres, listes, code)
      const allParagraphs = parsedDocument.paragraphs.concat(...parsedDocument.sections.map(s => s.content)).filter(p => p.length > 0);
      expect(allParagraphs.length).toBeGreaterThan(5, 'Le document devrait contenir un nombre suffisant de paragraphes pour la lisibilité.');

      // Vérifie que la plupart des lignes ne sont pas excessivement longues (arbitraire : > 120 caractères)
      const lines = documentContent.split('\n');
      const longLines = lines.filter(line => line.length > 120 && !line.trim().startsWith('```')); // Exclut les lignes de code
      // Permet un certain nombre de lignes longues, mais pas la majorité (ex: moins de 20% des lignes totales)
      expect(longLines.length / lines.length).toBeLessThan(0.2, 'Trop de lignes sont excessivement longues, ce qui nuit à la lisibilité.');
    });
  });

  // 2. TESTS DE LA QUALITÉ DU CONTENU
  describe('2. Qualité du contenu', () => {
    it('devrait avoir des explications claires (présence de texte descriptif suffisant)', () => {
      // Compte la longueur du texte qui n'est ni un titre, ni du code, ni une liste, ni un lien.
      const descriptiveText = parsedDocument.rawContent
        .replace(/#+\s.*?\n/g, '') // Supprime les titres
        .replace(/```[\s\S]*?```/g, '') // Supprime les blocs de code
        .replace(/\[.*?\]\(.*?\)/g, '') // Supprime les liens
        .replace(/^(-|\*|\d+\.)\s.*?\n/gm, '') // Supprime les éléments de liste
        .replace(/\n\s*\n/g, '\n') // Normalise les sauts de ligne multiples
        .trim();

      expect(descriptiveText.length).toBeGreaterThan(500, 'Le document devrait contenir au moins 500 caractères de texte explicatif.');
    });

    it('devrait inclure des exemples techniques (blocs de code)', () => {
      expect(parsedDocument.codeBlocks.length).toBeGreaterThan(0, 'Le document devrait contenir des blocs de code pour illustrer les exemples techniques.');
      // Vérifie qu'au moins un bloc de code a une langue spécifiée
      const hasLangSpecifier = parsedDocument.codeBlocks.some(block => block.lang && block.lang.length > 0);
      expect(hasLangSpecifier).toBeTruthy('Au moins un bloc de code devrait spécifier sa langue pour une meilleure coloration syntaxique.');
    });

    it('devrait avoir des liens fonctionnels (syntaxe de lien Markdown valide)', () => {
      expect(parsedDocument.links.length).toBeGreaterThan(0, 'Le document devrait contenir des liens.');
      // Vérifie que les URLs des liens ne sont pas vides et ont une structure basique d'URL ou un chemin de fichier Markdown
      const hasValidUrls = parsedDocument.links.every(link =>
        link.url && link.url.length > 0 &&
        (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(link.url) || /^[a-zA-Z0-9_.-]+\.md$/i.test(link.url))
      );
      expect(hasValidUrls).toBeTruthy('Tous les liens devraient avoir une URL valide ou un chemin de fichier Markdown.');
    });

    it('devrait avoir du code bien formaté (présence de spécificateurs de langue dans la majorité des blocs de code)', () => {
      const codeBlocksWithLang = parsedDocument.codeBlocks.filter(block => block.lang && block.lang.length > 0);
      // Au moins 75% des blocs de code devraient spécifier leur langue pour une bonne coloration syntaxique
      expect(codeBlocksWithLang.length).toBeGreaterThanOrEqual(parsedDocument.codeBlocks.length * 0.75,
        `Au moins 75% des blocs de code (${parsedDocument.codeBlocks.length} au total) devraient spécifier leur langue. ${codeBlocksWithLang.length} en ont une.`
      );
    });
  });

  // 3. TESTS DE COMPLÉTUDE
  describe('3. Complétude du document', () => {
    it('devrait couvrir tous les points importants (vérification des mots-clés détectés)', () => {
      const contentLower = documentContent.toLowerCase();
      detectedKeywords.forEach(keyword => {
        // Vérifie la présence du mot-clé (insensible à la casse) en tant que mot entier
        const keywordRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
        expect(contentLower).toMatch(keywordRegex, `Le mot-clé "${keyword}" n'a pas été trouvé dans le document.`);
      });
    });

    it('ne devrait pas contenir de sections vides', () => {
      // Récupère tous les titres du document, y compris un "titre de fin" pour la dernière section
      const headers = Array.from(documentContent.matchAll(/^(#+)\s.*$/gm));
      headers.push({ index: documentContent.length, 0: '' }); // Ajoute un "header" de fin pour délimiter la dernière section

      for (let i = 0; i < headers.length - 1; i++) {
        const currentHeaderMatch = headers[i];
        const nextHeaderMatch = headers[i + 1];

        const sectionTitle = currentHeaderMatch[0].trim();
        // Extrait le contenu entre le titre actuel et le titre suivant (ou la fin du document)
        const sectionContentRaw = documentContent.substring(currentHeaderMatch.index + currentHeaderMatch[0].length, nextHeaderMatch.index).trim();

        // Une section est considérée comme vide si son contenu est uniquement des espaces, des sauts de ligne,
        // ou des marqueurs de liste sans texte significatif, ou des lignes vides.
        const isContentEmpty = sectionContentRaw.length === 0 ||
                               sectionContentRaw.replace(/^(-|\*|\d+\.)\s*$/gm, '').trim().length === 0;

        expect(isContentEmpty).toBeFalsy(`La section "${sectionTitle}" semble vide ou ne contient que des marqueurs de liste vides.`);
      }
    });

    it('devrait avoir une cohérence de formatage (headers, listes)', () => {
      // Vérifie que le titre principal est bien un H1
      expect(documentContent).toMatch(/^# [^\n]+/m, 'Le document devrait commencer par un titre H1.');

      // Vérifie la présence de listes (ordonnées ou non ordonnées)
      const hasLists = documentContent.match(/^(-|\*|\d+\.)\s/m);
      expect(hasLists).toBeTruthy('Le document devrait contenir des listes (ordonnées ou non) pour une meilleure organisation.');

      // Vérifie qu'il n'y a pas de saut de niveau de titre trop important (ex: H1 -> H4)
      const headerLevels = documentContent.split('\n')
        .map(line => {
          if (line.startsWith('# ')) return 1;
          if (line.startsWith('## ')) return 2;
          if (line.startsWith('### ')) return 3;
          if (line.startsWith('#### ')) return 4;
          return 0; // Pas un titre
        })
        .filter(level => level > 0); // Ne garde que les niveaux de titre détectés

      for (let i = 0; i < headerLevels.length - 1; i++) {
        // Permet un saut de 1 ou 2 niveaux (ex: H1 -> H2, H2 -> H3, H1 -> H3 si H2 est implicite)
        // Mais pas H1 -> H4, ce qui serait un saut trop grand.
        expect(headerLevels[i+1] - headerLevels[i]).toBeLessThanOrEqual(2,
          `Saut de niveau de titre incohérent détecté entre le niveau ${headerLevels[i]} et ${headerLevels[i+1]}.`
        );
      }
    });
  });

  // 4. TESTS SPÉCIFIQUES AU CONTENU DÉTECTÉ
  describe('4. Tests spécifiques au contenu détecté', () => {
    // Boucle sur les mots-clés détectés pour générer des tests dynamiques
    detectedKeywords.forEach(keyword => {
      it(`devrait mentionner le sujet "${keyword}"`, () => {
        // Vérifie la présence du mot-clé (insensible à la casse) en tant que mot entier
        const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');
        expect(documentContent).toMatch(keywordRegex, `Le mot-clé "${keyword}" n'a pas été trouvé dans le document.`);
      });
    });
  });
});