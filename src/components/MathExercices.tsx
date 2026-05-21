import { useState } from "react";
import { Matrix2D } from "../types";
import { Sliders, HelpCircle, CheckCircle2, XCircle, ChevronRight, Activity, ArrowUpRight, Library } from "lucide-react";
import MathText from "./MathText";

interface Exercise {
  id: number;
  title: string;
  description: string;
  question: string;
  solutionMatrix: Matrix2D;
  explanation: string;
  hint: string;
}

interface MathExercicesProps {
  onInjectMatrix: (matrix: Matrix2D, name: string) => void;
}

export default function MathExercices({ onInjectMatrix }: MathExercicesProps) {
  const exercises: Exercise[] = [
    {
      id: 1,
      title: "La Matrice Identité",
      description: "Quelle matrice laisse le plan invariant, sans aucune modification géométrique ?",
      question: "Déterminez les coefficients de la matrice identité $I$.",
      solutionMatrix: { a: 1, b: 0, c: 0, d: 1 },
      hint: "Quelles sont les images des vecteurs de base $\\vec{i}(1,0)$ et $\\vec{j}(0,1)$ ?",
      explanation: `La matrice identité laisse chaque vecteur inchangé. L'image de $\\vec{i}(1, 0)$ est $\\vec{i}(1, 0)$ et l'image de $\\vec{j}(0, 1)$ est $\\vec{j}(0, 1)$.\n\nSa forme matricielle est :\n$$I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$$`,
    },
    {
      id: 2,
      title: "Étirement Asymétrique",
      description: "Appliquez un étirement d'un facteur 3 selon l'axe des abscisses (X) et d'un facteur 2 selon l'axe des ordonnées (Y).",
      question: "Déterminez la matrice correspondante à cette transformation.",
      solutionMatrix: { a: 3, b: 0, c: 0, d: 2 },
      hint: "L'image du vecteur $\\vec{i}$ est $(3,0)$ et celle du vecteur $\\vec{j}$ est $(0,2)$.",
      explanation: `L'étirement s'opère selon les axes de coordonnées.\nL'image de $\\vec{i}(1, 0)$ est $(3, 0)$.\nL'image de $\\vec{j}(0, 1)$ est $(0, 2)$.\n\nLa matrice s'écrit donc :\n$$M = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$$`,
    },
    {
      id: 3,
      title: "Symétrie Axiale (Axe Y)",
      description: "Appliquez une symétrie orthogonale par rapport à l'axe des ordonnées (axe Y).",
      question: "Déterminez la matrice de cette transformation.",
      solutionMatrix: { a: -1, b: 0, c: 0, d: 1 },
      hint: "Le vecteur $\\vec{j}$ est invariant. Le vecteur $\\vec{i}$ est transformé en son opposé.",
      explanation: `L'axe des ordonnées étant l'axe de symétrie, le vecteur vertical $\\vec{j}(0,1)$ est invariant.\nLe vecteur horizontal $\\vec{i}(1,0)$ est transformé en $(-1,0)$.\n\nLa matrice de cette symétrie s'écrit :\n$$S_y = \\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$$`,
    },
    {
      id: 4,
      title: "Rotation de +90°",
      description: "Déterminez la matrice représentant une rotation de centre l'origine et d'angle $\\pi/2$ radians ($90^\\circ$) dans le sens trigonométrique direct.",
      question: "Exprimez la matrice $R$.",
      solutionMatrix: { a: 0, b: -1, c: 1, d: 0 },
      hint: "Déterminez l'image des vecteurs de base : $\\vec{i}(1,0)$ devient $(0,1)$ et $\\vec{j}(0,1)$ devient $(-1,0)$.",
      explanation: `La matrice d'une rotation d'angle $\\theta$ est donnée par la formule :\n$$R_{\\theta} = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$$\n\nPour $\\theta = 90^\\circ$ :\n- $\\cos(90^\\circ) = 0$\n- $\\sin(90^\\circ) = 1$\n\nEn remplaçant par ces valeurs, nous obtenons :\n$$R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$$`,
    },
    {
      id: 5,
      title: "Transvection Horizontale",
      description: "Déterminez la matrice d'une transvection horizontale qui laisse l'axe des abscisses invariant et définie par le système $x' = x + 2y$ et $y' = y$.",
      question: "Donnez les coefficients de cette matrice de transvection.",
      solutionMatrix: { a: 1, b: 2, c: 0, d: 1 },
      hint: "L'image du vecteur $\\vec{i}(1,0)$ est $(1,0)$. L'image du vecteur $\\vec{j}(0,1)$ subit une translation horizontale et devient $(2,1)$.",
      explanation: `Pour une transvection horizontale de facteur $k$, les coordonnées se transforment selon :\n- $x' = x + ky$\n- $y' = y$\n\nCela implique que :\n- l'image de $\\vec{i}(1, 0)$ est $\\vec{i}'(1, 0)$\n- l'image de $\\vec{j}(0, 1)$ est $\\vec{j}'(k, 1)$\n\nIci $k = 2$, ce qui donne la matrice :\n$$M = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$$`,
    },
    {
      id: 6,
      title: "Symétrie Axiale (Bissectrice y = x)",
      description: "Appliquez une symétrie orthogonale par rapport à la première bissectrice (droite d'équation $y = x$). Cette transformation échange les coordonnées : $(x, y)$ devient $(y, x)$.",
      question: "Déterminez la matrice de cette transformation.",
      solutionMatrix: { a: 0, b: 1, c: 1, d: 0 },
      hint: "L'image de $\\vec{i}(1,0)$ est $(0,1)$ et l'image de $\\vec{j}(0,1)$ est $(1,0)$.",
      explanation: `La symétrie par rapport à la droite $y = x$ intervertit les coordonnées :\n- $x' = y$\n- $y' = x$\n\nLes vecteurs de base sont transformés ainsi :\n- L'image de $\\vec{i}(1,0)$ donne la première colonne : $\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$\n- L'image de $\\vec{j}(0,1)$ donne la deuxième colonne : $\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ \n\nLa matrice s'écrit donc :\n$$S_{y=x} = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$`,
    },
    {
      id: 7,
      title: "Projection Orthogonale sur l'Axe X",
      description: "Déterminez la transformation qui projette orthogonalement tout point du plan sur l'axe des abscisses, en annulant sa coordonnée verticale.",
      question: "Déterminez la matrice de projection $P_x$.",
      solutionMatrix: { a: 1, b: 0, c: 0, d: 0 },
      hint: "L'image de $\\vec{i}(1,0)$ est lui-même. L'image de $\\vec{j}(0,1)$ est projetée sur l'origine $(0,0)$.",
      explanation: `La projection orthogonale sur l'axe X annule la coordonnée verticale :\n- $x' = x$\n- $y' = 0$\n\nLes vecteurs de base sont transformés ainsi :\n- $\\vec{i}' = P_x\\begin{pmatrix}1\\\\0\\end{pmatrix} = \\begin{pmatrix}1\\\\0\\end{pmatrix}$\n- $\\vec{j}' = P_x\\begin{pmatrix}0\\\\1\\end{pmatrix} = \\begin{pmatrix}0\\\\0\\end{pmatrix}$\n\nLa matrice de projection s'écrit :\n$$P_x = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$$\n*Note : Le déterminant de cette matrice est nul (transformation non inversible).*`,
    },
    {
      id: 8,
      title: "Transvection Verticale",
      description: "Déterminez la matrice d'une transvection verticale qui laisse l'axe des ordonnées invariant et définie par le système $x' = x$ et $y' = y + 1.5x$.",
      question: "Déterminez les coefficients de cette matrice.",
      solutionMatrix: { a: 1, b: 0, c: 1.5, d: 1 },
      hint: "L'image de $\\vec{j}(0,1)$ est invariante. L'image de $\\vec{i}(1,0)$ subit un décalage vertical et devient $(1, 1.5)$.",
      explanation: `Pour une transvection verticale de facteur $k = 1.5$, les coordonnées se transforment selon :\n- L'image de $\\vec{i}(1, 0)$ devient $(1, 1.5)$\n- L'image de $\\vec{j}(0, 1)$ reste $(0, 1)$ (car son abscisse est nulle)\n\nLa matrice s'écrit donc :\n$$M = \\begin{pmatrix} 1 & 0 \\\\ 1.5 & 1 \\end{pmatrix}$$`,
    },
    {
      id: 9,
      title: "Homothétie de Rapport Négatif",
      description: "Appliquez une homothétie de centre l'origine et de rapport $k = -1.5$, ce qui correspond à une dilatation d'un facteur 1.5 combinée à une symétrie centrale.",
      question: "Déterminez la matrice correspondante.",
      solutionMatrix: { a: -1.5, b: 0, c: 0, d: -1.5 },
      hint: "Une homothétie de rapport $k$ multiplie toutes les coordonnées par $k$. Que deviennent $\\vec{i}$ et $\\vec{j}$ ?",
      explanation: `La matrice d'une homothétie de rapport $k$ s'écrit sous la forme d'une matrice scalaire :\n$$H_k = \\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix}$$\n\nAvec $k = -1.5$ :\n- L'image de $\\vec{i}(1,0)$ est $(-1.5, 0)$\n- L'image de $\\vec{j}(0,1)$ est $(0, -1.5)$\n\nLa matrice s'écrit donc :\n$$H = \\begin{pmatrix} -1.5 & 0 \\\\ 0 & -1.5 \\end{pmatrix}$$`,
    },
    {
      id: 10,
      title: "Composition : Rotation et Homothétie",
      description: "Appliquez une rotation de centre l'origine et d'angle $90^\\circ$ dans le sens trigonométrique, suivie d'une homothétie de rapport $2$.",
      question: "Déterminez la matrice résultant de cette composition de transformations.",
      solutionMatrix: { a: 0, b: -2, c: 2, d: 0 },
      hint: "Multipliez la matrice de rotation de $90^\\circ$ par le rapport d'homothétie scalaire $2$.",
      explanation: `La composition de transformations linéaires correspond à la multiplication de leurs matrices ou, dans le cas d'une homothétie, à la multiplication d'une matrice par un scalaire.\nLa matrice d'une rotation de $90^\\circ$ est : $R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$.\nL'homothétie de rapport 2 correspond à la multiplication par le scalaire 2.\n\nLa matrice résultante est donc :\n$$M = 2 \\cdot \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & -2 \\\\ 2 & 0 \\end{pmatrix}$$`,
    }
  ];

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [inputs, setInputs] = useState({ a: "", b: "", c: "", d: "" });
  const [feedback, setFeedback] = useState<{ status: "idle" | "correct" | "incorrect"; msg: string }>({ status: "idle", msg: "" });
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const activeExercise = exercises[activeIdx];

  const handleInputChange = (field: "a" | "b" | "c" | "d", val: string) => {
    setInputs(prev => ({ ...prev, [field]: val }));
    if (feedback.status !== "idle") {
      setFeedback({ status: "idle", msg: "" });
    }
  };

  const handleVerify = () => {
    const numA = parseFloat(inputs.a);
    const numB = parseFloat(inputs.b);
    const numC = parseFloat(inputs.c);
    const numD = parseFloat(inputs.d);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC) || isNaN(numD)) {
      setFeedback({ status: "incorrect", msg: "🚨 Veuillez entrer des nombres décimaux valides dans les 4 champs de la matrice." });
      return;
    }

    const sol = activeExercise.solutionMatrix;
    const epsilon = 0.05; // allow minimal approximations for floats

    const isAOk = Math.abs(numA - sol.a) < epsilon;
    const isBOk = Math.abs(numB - sol.b) < epsilon;
    const isCOk = Math.abs(numC - sol.c) < epsilon;
    const isDOk = Math.abs(numD - sol.d) < epsilon;

    if (isAOk && isBOk && isCOk && isDOk) {
      setFeedback({
        status: "correct",
        msg: "🎉 Félicitations, votre matrice de transformation est parfaitement exacte !"
      });
      setShowExplanation(true);
    } else {
      setFeedback({
        status: "incorrect",
        msg: "❌ Les coefficients ne correspondent pas à l'action géométrique demandée. Essayez d'ajuster vos calculs."
      });
    }
  };

  const handleSelectExercise = (idx: number) => {
    setActiveIdx(idx);
    setInputs({ a: "", b: "", c: "", d: "" });
    setFeedback({ status: "idle", msg: "" });
    setShowExplanation(false);
  };

  const handleInject = () => {
    // Inject the solution into simulator for visually checking
    onInjectMatrix(activeExercise.solutionMatrix, activeExercise.title);
  };

  return (
    <div className="space-y-6">
      {/* Upper header - Unified Premium System */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
        <div className="bg-linear-to-r from-indigo-50 to-blue-50/20 p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <Library className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-800">Exercices d'Entraînement</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Résolvez des défis géométriques, calculez les coefficients de matrice et validez vos réponses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Exercises Sidebar directory */}
      <div className="col-span-1 lg:col-span-4 space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Liste des Travaux
          </h3>
          <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
            Configurez la matrice correspondante à chaque consigne géométrique de transformation linéaire.
          </p>

          <nav className="flex flex-col gap-1.5">
            {exercises.map((ex, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded text-xs transition duration-150 flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? "bg-slate-900 border-slate-900 text-white font-medium" 
                      : "bg-white border border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50/50"
                  }`}
                >
                  <span className="truncate pr-2">Ex {idx + 1} : {ex.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Work Bench container */}
      <div className="col-span-1 lg:col-span-8 space-y-6">
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          
          {/* Header details */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#5bc0be] font-mono font-bold bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-sm inline-block mb-2">
              Exercice Pratique {activeExercise.id}
            </span>
            <h2 className="text-2xl font-light tracking-tight text-slate-900">
              {activeExercise.title}
            </h2>
            <div className="text-sm text-slate-600 mt-3 leading-relaxed">
              <MathText>{activeExercise.description}</MathText>
            </div>
          </div>

          {/* Exercise query prompt */}
          <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Consigne de calcul :
            </span>
            <MathText>{activeExercise.question}</MathText>
          </div>

          {/* Matrix Input Panel */}
          <div className="space-y-4 max-w-sm mx-auto">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">
              Entrez les valeurs de la matrice M
            </label>

            <div className="flex items-center justify-center gap-6 py-4 bg-slate-50/30 rounded-lg border border-slate-100">
              <div className="text-slate-300 text-4xl font-extralight font-serif">[</div>
              
              <div className="grid grid-cols-2 gap-3 w-40">
                <div>
                  <span className="block text-[8px] text-slate-400 font-mono mb-1 text-center">a (m₁₁)</span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0"
                    value={inputs.a}
                    onChange={(e) => handleInputChange("a", e.target.value)}
                    className="w-full text-center py-2 bg-white rounded border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-bold"
                  />
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 font-mono mb-1 text-center">b (m₁₂)</span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0"
                    value={inputs.b}
                    onChange={(e) => handleInputChange("b", e.target.value)}
                    className="w-full text-center py-2 bg-white rounded border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-bold"
                  />
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 font-mono mb-1 text-center">c (m₂₁)</span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0"
                    value={inputs.c}
                    onChange={(e) => handleInputChange("c", e.target.value)}
                    className="w-full text-center py-2 bg-white rounded border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-bold"
                  />
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 font-mono mb-1 text-center">d (m₂₂)</span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0"
                    value={inputs.d}
                    onChange={(e) => handleInputChange("d", e.target.value)}
                    className="w-full text-center py-2 bg-white rounded border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="text-slate-300 text-4xl font-extralight font-serif">]</div>
            </div>
          </div>

          {/* Hint disclosure toggle toggle */}
          <div className="text-center">
            <details className="text-xs group cursor-pointer select-none">
              <summary className="text-slate-400 hover:text-slate-800 list-none font-mono text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                [Besoin d'aide ? Appuyer ici]
              </summary>
              <p className="mt-2 text-slate-500 bg-slate-50 px-4 py-3 rounded-md max-w-md mx-auto leading-relaxed border border-slate-100 text-[11px]">
                {activeExercise.hint}
              </p>
            </details>
          </div>

          {/* Verification validation bar status */}
          {feedback.status !== "idle" && (
            <div className={`p-4 rounded-lg flex items-center gap-3 text-xs border ${
              feedback.status === "correct" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              {feedback.status === "correct" ? <CheckCircle2 className="w-4.5 h-4.5 shrink-0" /> : <XCircle className="w-4.5 h-4.5 shrink-0" />}
              <span>{feedback.msg}</span>
            </div>
          )}

          {/* Action triggers */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <button
              onClick={handleInject}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-mono font-medium text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 cursor-pointer"
              title="Charge cette matrice dans le visualiseur d'algèbre"
            >
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              Tester dans le simulateur <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={handleVerify}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded text-xs font-bold font-mono uppercase tracking-wide cursor-pointer shadow-md"
            >
              Vérifier la réponse
            </button>
          </div>

        </div>

        {/* Detailed correctional explanation sheet */}
        {showExplanation && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 animate-fadeIn">
            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-500" /> Correction & Résolution d'Exercice
            </h4>
            <div className="text-xs text-slate-650 leading-relaxed">
              <MathText>{activeExercise.explanation}</MathText>
            </div>
          </div>
        )}

      </div>

      </div>
    </div>
  );
}
