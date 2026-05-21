import { useState, useEffect } from "react";
import { HelpCircle, Sparkles, Sliders, Play, Move, RefreshCw, Layers, CheckCircle, BookOpen } from "lucide-react";
import MathText from "./MathText";

export default function MathTutorial() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: "1. Bienvenue dans l'Espace 2D !",
      description: "Ce laboratoire est une plateforme interactive conçue pour démystifier le monde de l'algèbre linéaire par la visualisation géométrique directe.",
      details: [
        "L'espace d'affichage représente le plan réel $\\mathbb{R}^2$.",
        "Toutes les transformations d'algèbre linéaire bidimensionnelles sont caractérisées par une matrice $2 \\times 2$.",
        "En modifiant cette matrice ou en interagissant avec le graphe, vous pouvez voir instantanément comment l'espace entier se déforme, s'étire, tourne ou s'aplatit."
      ],
      icon: <HelpCircle className="w-5 h-5 text-emerald-500" />
    },
    {
      title: "2. Contrôler le Simulateur",
      description: "Le simulateur géométrique dynamique est le cœur de cet outil. Voici comment le prendre en main :",
      details: [
        "**Changer les coefficients de la matrice :** Utilisez le panneau de gauche pour saisir des valeurs pour nos 4 coefficients $a, b, c, d$. Observez l'effet sur le déterminant.",
        "**Faire glisser les têtes de vecteurs :** Vous pouvez agir sur le canevas en agrippant directement les flèches rouges (axe $\\vec{i}'$) ou bleues (axe $\\vec{j}'$) pour concevoir votre transformation de manière manuelle !",
        "**Animation de transition ($t$) :** Le curseur d'interpolation $t$ permet d'animer l'action de la matrice du plan. Pour $t = 0$ (état initial non transformé), pour $t = 1$ (état final totalement transformé). Vous pouvez lancer l'animation automatique !",
        "**Modifier et tracer de nouveaux vecteurs :** Ajoutez des vecteurs personnalisés couleur citron vert, des droites ou des polygones, puis déplacez-les librement dans l'espace pour voir l'effet local."
      ],
      icon: <Sliders className="w-5 h-5 text-indigo-500" />
    },
    {
      title: "3. Théorie, Exercices et Quiz",
      description: "Pour progresser et valider vos compétences, parcourez les différents modules élaborés par nos soins :",
      details: [
        "**Théorie & Cours :** Un cours rigoureux et interactif composé d'illustrations, de définitions de déterminants et d'explications d'homothéties, rotations et cisaillements.",
        "**Exercices Pratiques :** Des défis d'écriture matricielle. Calculez les coefficients demandés pour concrétiser des actions géométriques et validez vos équations.",
        "**Quiz Aléatoire :** Des questions automatiques générées à la volée sur les calculs d'images, de déterminants, d'aires et de reconnaissance géométrique pour tester vos aptitudes."
      ],
      icon: <CheckCircle className="w-5 h-5 text-pink-500" />
    },
    {
      title: "4. Les Activités Pratiques",
      description: "C'est l'atout pédagogique principal : explorez le plan avec une démarche scientifique rigoureuse !",
      details: [
        "Chaque activité formule un objectif géométrique précis (ex: effet miroir, projection vers une dimension).",
        "Vous pouvez **injecter la matrice expérimentale en 1 clic** directement dans la grille du simulateur.",
        "Suivez les tâches dictées pas à pas et proposez vos réponses de démonstration pour confirmer vos compréhensions."
      ],
      icon: <Sparkles className="w-5 h-5 text-amber-500" />
    }
  ];

  // Run MathJax when step changes
  useEffect(() => {
    const mj = (window as any).MathJax;
    if (mj && mj.typesetPromise) {
      mj.typesetPromise();
    }
  }, [activeStep]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Upper header - Unified Premium System */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-sky-50 to-indigo-50/20 p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-800">Tutoriel d'Apprentissage</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Suivez le guide interactif pas-à-pas pour maîtriser l'ensemble des instruments de manipulation de l'algèbre en 2D.
          </p>
        </div>
      </div>

      {/* Main Steps Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Step list sidebar Navigation */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-xs">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block px-2.5 mb-2">Sommaire du guide</span>
          {steps.map((st, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left px-3.5 py-3 rounded-lg text-xs transition duration-150 flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? "bg-sky-50 text-sky-700 border border-sky-200/50 font-semibold shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${
                  isActive ? "bg-sky-500/20 text-sky-700" : "bg-slate-100 text-slate-550 border border-slate-150"
                }`}>
                  {idx + 1}
                </span>
                <span className="truncate">{st.title.replace(/^\d\.\s/, "")}</span>
              </button>
            );
          })}
        </div>

        {/* Step details contents panel */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
              {steps[activeStep].icon}
            </div>
            <div>
              <span className="text-[9px] text-[#5bc0be] uppercase tracking-widest font-mono font-bold">
                Étape interactive {activeStep + 1} sur {steps.length}
              </span>
              <h3 className="text-xl font-light text-slate-900 tracking-tight leading-tight mt-0.5">
                {steps[activeStep].title}
              </h3>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-700 leading-relaxed border-l-3 border-slate-200 pl-4 py-1 italic">
            <MathText>{steps[activeStep].description}</MathText>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400 block">Actions et explications</span>
            <ul className="space-y-3">
              {steps[activeStep].details.map((detail, index) => {
                // Formatting bullet points with bold text support
                const parts = detail.split("**");
                const formattedText = parts.map((part, i) => (
                  i % 2 === 1 ? <strong key={i} className="text-slate-900">{part}</strong> : part
                ));

                return (
                  <li key={index} className="flex gap-3 leading-relaxed text-xs text-slate-650">
                    <span className="text-emerald-500 shrink-0 font-mono mt-0.5">✔</span>
                    <span>
                      <MathText inline>{formattedText}</MathText>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Graphical controls cheat-sheet when Step 2 is active */}
          {activeStep === 1 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Aide visuelle des raccourcis du canevas</span>
              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div className="flex items-start gap-2">
                  <Move className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Glissement tactile/souris :</strong>
                    <p className="text-slate-550 text-[10px] mt-0.5">Amenez le curseur sur la pointe des vecteurs rouges ou bleus modifiés, puis déplacez pour changer les nombres de la matrice.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Play className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Interpolateur t :</strong>
                    <p className="text-slate-550 text-[10px] mt-0.5">Faites glisser de gauche à droite pour observer la transition linéaire continue étape par étape.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive navigation controls */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className={`px-4 py-2 rounded text-xs font-mono font-bold uppercase transition ${
                activeStep === 0
                  ? "text-slate-300 bg-transparent cursor-not-allowed"
                  : "text-slate-700 hover:text-slate-950 bg-slate-50 border border-slate-200 cursor-pointer"
              }`}
            >
              Précédent
            </button>

            <button
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              className={`px-4 py-2 rounded text-xs font-mono font-bold uppercase transition ${
                activeStep === steps.length - 1
                  ? "text-slate-300 bg-transparent cursor-not-allowed"
                  : "bg-sky-600 hover:bg-sky-700 text-white cursor-pointer shadow-sm"
              }`}
            >
              Suivant
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
