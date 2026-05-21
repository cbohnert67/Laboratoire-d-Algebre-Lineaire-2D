
  # 📐 Laboratoire d'Algèbre Linéaire & Géométrie du Plan
  
  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
  [![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat&logo=GitHub&logoColor=white)](https://pages.github.com/)

  *Une plateforme interactive, académique et visuelle pour explorer, expérimenter et maîtriser les transformations linéaires dans $\mathbb{R}^2$.*
  
  👉 **[Accéder au Laboratoire en ligne](https://cbohnert67.github.io/Laboratoire-d-Algebre-Lineaire-2D/)**
</div>

---

## 🌟 Fonctionnalités Clés

Ce laboratoire d'apprentissage géométrique est structuré autour de six espaces interactifs majeurs :

*   **📘 Cours Théorique Complet** : Définitions rigoureuses, théorèmes fondamentaux et concepts clés de l'algèbre linéaire en dimension 2 (Vecteurs, Matrices, Déterminants, Transformations linéaires et non-linéaires, Valeurs propres et Vecteurs propres). Contient des exemples pratiques du simple au complexe.
*   **🧪 Simulateur Interactif (Labo)** : Un plan cartésien dynamique en temps réel pour visualiser l'effet géométrique d'une matrice $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ sur un vecteur, une grille unitaire ou des formes prédéfinies. Les matrices peuvent être injectées directement depuis le cours ou les exercices pour une vérification instantanée.
*   **🧩 Activités Guidées** : 10 activités pratiques de complexité progressive conçues pour guider l'étudiant dans l'exploration autonome de concepts avancés (cisaillements, projections, symétries, homothéties).
*   **✏️ Exercices Pratiques** : 10 problèmes avec niveaux de difficulté croissants pour s'entraîner à la manipulation des objets géométriques et des opérations matricielles.
*   **🎓 Quiz Éducatif** : Un outil d'évaluation complet composé d'une sélection de **20 questions** couvrant l'ensemble du programme avec notation sur 20 en fin de parcours.
*   **📖 Tutoriel d'Utilisation** : Un guide utilisateur interactif pas-à-pas pour prendre en main rapidement le simulateur et exploiter tout le potentiel de la plateforme.

---

## 🛠️ Stack Technique

*   **Framework** : [React 19](https://react.dev/) & [Vite 6](https://vite.dev/) (Build extrêmement rapide et HMR).
*   **Langage** : [TypeScript](https://www.typescriptlang.org/) pour la robustesse et le typage strict des structures matricielles.
*   **Styles & Design** : [Tailwind CSS v4](https://tailwindcss.com/) pour une interface élégante, épurée et moderne, avec une palette harmonieuse et réactive (mode clair uniquement, conforme aux directives d'apprentissage visuel).
*   **Formules Mathématiques** : Intégration de [MathJax v3](https://www.mathjax.org/) pour un rendu parfait des formules $\LaTeX$ et des notations matricielles.
*   **Animations** : Transitions fluides via micro-animations pour une meilleure ergonomie.

---

## 🚀 Lancement Local

### Prérequis

*   [Node.js](https://nodejs.org/) (Version 18 ou supérieure recommandée)

### Instructions

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/cbohnert67/Laboratoire-d-Algebre-Lineaire-2D.git
    cd Laboratoire-d-Algebre-Lineaire-2D
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```
    *L'application sera accessible localement à l'adresse [http://localhost:3000](http://localhost:3000).*

4.  **Compiler pour la production** :
    ```bash
    npm run build
    ```

---

## 🌐 Déploiement sur GitHub Pages

Le déploiement est automatisé grâce au script configuré dans l'application :

```bash
npm run deploy
