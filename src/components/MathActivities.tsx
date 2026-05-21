import { useState, useEffect } from "react";
import { Matrix2D } from "../types";
import { Compass, Sparkles, AlertCircle, ArrowUpRight, HelpCircle, Check, BookOpen } from "lucide-react";
import MathText from "./MathText";

interface ActivityStep {
  id: string;
  title: string;
  badge: string;
  objective: string;
  matrix: Matrix2D;
  matrixLabel: string;
  theory: string;
  tasks: string[];
  observations: string;
  question: string;
  answer: string;
}

interface MathActivitiesProps {
  onInjectMatrix: (matrix: Matrix2D, name: string) => void;
}

export default function MathActivities({ onInjectMatrix }: MathActivitiesProps) {
  const activities: ActivityStep[] = [
    {
      id: "identity",
      title: "La Matrice Identité",
      badge: "Activité Pratique 1",
      objective: "Découvrir la matrice identité qui laisse l'espace vectoriel inchangé.",
      matrix: { a: 1, b: 0, c: 0, d: 1 },
      matrixLabel: "Matrice Identité",
      theory: "La matrice identité, notée $I$, est l'élément neutre de la multiplication matricielle. Elle associe chaque point à lui-même. Ses colonnes correspondent exactement aux vecteurs de la base canonique $\\vec{i}$ et $\\vec{j}$.",
      tasks: [
        "Appliquez la matrice identité dans le simulateur.",
        "Observez qu'aucun changement géométrique ne s'opère : $\\vec{i}'$ (rouge) couvre $\\vec{i}$, et $\\vec{j}'$ (bleu) couvre $\\vec{j}$.",
        "Calculez le déterminant et l'aire résultante."
      ],
      observations: "Le déterminant est $\\det(I) = 1 \\times 1 - 0 \\times 0 = 1$. L'aire de n'importe quel polygone est conservée, et l'orientation du plan reste intacte.",
      question: "Si l'on multiplie une matrice quelconque $M$ par la matrice identité $I$, quel est le résultat ?",
      answer: "Le résultat est $M$. Le produit matriciel donne $M \\times I = I \\times M = M$."
    },
    {
      id: "homothetie",
      title: "Homothétie Uniforme",
      badge: "Activité Pratique 2",
      objective: "Comprendre la dilatation uniforme de l'espace par une matrice scalaire.",
      matrix: { a: 2, b: 0, c: 0, d: 2 },
      matrixLabel: "Homothétie (k=2)",
      theory: "Une homothétie de rapport $k$ multiplie toutes les distances par $k$. La matrice correspondante possède la valeur $k$ sur sa diagonale principale et $0$ ailleurs.",
      tasks: [
        "Appliquez la matrice d'homothétie dans le simulateur.",
        "Vérifiez que toutes les longueurs ont été doublées.",
        "Observez la valeur de l'aire du triangle transformé."
      ],
      observations: "Bien que chaque longueur soit doublée, l'aire totale est multipliée par $4$. Le déterminant confirme ce phénomène : $\\det(M) = 2 \\times 2 - 0 \\times 0 = 4$.",
      question: "Quelle matrice diviserait toutes les aires par 4 ?",
      answer: "La matrice d'homothétie de rapport $0.5$ : $\\begin{pmatrix} 0.5 & 0 \\\\ 0 & 0.5 \\end{pmatrix}$. Son déterminant est de $0.5 \\times 0.5 = 0.25$, soit $1/4$."
    },
    {
      id: "anisotrope",
      title: "Étirement Anisotrope",
      badge: "Activité Pratique 3",
      objective: "Observer une déformation asymétrique selon les axes horizontal et vertical.",
      matrix: { a: 1.5, b: 0, c: 0, d: 0.5 },
      matrixLabel: "Étirement Asymétrique",
      theory: "Une matrice diagonale avec des valeurs distinctes étire l'espace de manière inégale selon les axes de la base. Les axes canoniques ne pivotent pas, ils sont mis à l'échelle avec des facteurs différents.",
      tasks: [
        "Appliquez la matrice d'étirement asymétrique.",
        "Observez la grille transformée : les carrés deviennent des rectangles.",
        "Mesurez le facteur d'échelle de $\\vec{i}'$ par rapport à $\\vec{j}'$."
      ],
      observations: "Le vecteur $\\vec{i}$ a été allongé d'un facteur $1.5$, alors que $\\vec{j}$ a été compressé par un facteur $0.5$. Le déterminant est $\\det(M) = 1.5 \\times 0.5 = 0.75$. L'aire de toute figure est donc multipliée par $0.75$.",
      question: "Un carré conservera-t-il sa forme originelle après cette transformation ?",
      answer: "Non. Puisque l'étirement est différent selon l'axe des abscisses et des ordonnées, un carré initialement aligné sur les axes se transformera en rectangle."
    },
    {
      id: "reflection",
      title: "Symétrie Axiale",
      badge: "Activité Pratique 4",
      objective: "Expérimenter une réflexion et le changement d'orientation de l'espace vectoriel.",
      matrix: { a: -1, b: 0, c: 0, d: 1 },
      matrixLabel: "Symétrie par rapport à Y",
      theory: "La matrice $\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ inverse le signe de la coordonnée $x$ de chaque point ($\\vec{i} \\to -\\vec{i}$). Cela correspond à une symétrie axiale par rapport à l'axe des ordonnées.",
      tasks: [
        "Chargez la matrice de symétrie axiale dans la simulation.",
        "Observez la position des sommets : ils subissent une symétrie par rapport à l'axe $Y$.",
        "Vérifiez le signe du déterminant calculé."
      ],
      observations: "Le déterminant vaut $-1$. Sa valeur absolue $|-1| = 1$ indique que les aires sont conservées. Le signe négatif indique que l'orientation du plan a été inversée.",
      question: "Laquelle des matrices suivantes donnerait une symétrie axiale par rapport à l'axe des abscisses $X$ ?",
      answer: "La matrice $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$. Elle préserve les abscisses mais inverse le signe des ordonnées."
    },
    {
      id: "shear-flow",
      title: "Transvection (Cisaillement)",
      badge: "Activité Pratique 5",
      objective: "Comprendre comment une transvection incline une figure sans modifier son aire.",
      matrix: { a: 1, b: 1.5, c: 0, d: 1 },
      matrixLabel: "Transvection Horizontale",
      theory: "Une transvection (ou cisaillement) déplace chaque point parallèlement à un axe, d'une distance proportionnelle à son éloignement de cet axe. Un rectangle est transformé en parallélogramme de même base et de même hauteur.",
      tasks: [
        "Appliquez la matrice de transvection horizontale dans le simulateur.",
        "Observez que les points situés sur l'axe $X$ restent invariants, tandis que les autres se décalent horizontalement.",
        "Vérifiez que l'aire affichée reste inchangée."
      ],
      observations: "Pour la matrice $S = \\begin{pmatrix} 1 & 1.5 \\\\ 0 & 1 \\end{pmatrix}$, le déterminant est $\\det(S) = 1 \\times 1 - 1.5 \\times 0 = 1$. L'aire de n'importe quelle figure transformée est strictement égale à son aire d'origine.",
      question: "Si l'on compose deux transvections horizontales paramétrées par $b_1$ et $b_2$, que se passe-t-il algébriquement ?",
      answer: "Les effets s'additionnent. Le produit des deux matrices donne une matrice de transvection paramétrée par $b_1 + b_2$."
    },
    {
      id: "rot-pure",
      title: "Rotation de 90°",
      badge: "Activité Pratique 6",
      objective: "Observer l'effet d'une rotation isométrique de 90° sur le plan cartésien.",
      matrix: { a: 0, b: -1, c: 1, d: 0 },
      matrixLabel: "Rotation 90°",
      theory: "Une rotation d'angle $\\theta = 90^\\circ$ transforme le vecteur de base $\\vec{i}$ en $\\vec{j}$, et $\\vec{j}$ en $-\\vec{i}$. La matrice de rotation correspondante a pour colonnes ces nouveaux vecteurs.",
      tasks: [
        "Appliquez la matrice de rotation dans le simulateur.",
        "Repérez les nouvelles coordonnées du vecteur $\\vec{i}'$ ($x=0, y=1$).",
        "Vérifiez que la forme et la taille du quadrillage sont conservées."
      ],
      observations: "La matrice s'écrit $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$. Le système d'axes a pivoté de $90^\\circ$ dans le sens trigonométrique, transformant $\\vec{i}(1,0)$ en $(0,1)$ et $\\vec{j}(0,1)$ en $(-1,0)$.",
      question: "Pourquoi le déterminant de cette matrice est-il strictement égal à 1 ?",
      answer: "Car une rotation est une isométrie directe. Elle conserve les aires (valeur absolue de $1$) et l'orientation du plan (signe positif)."
    },
    {
      id: "rot-rot",
      title: "Composition : Rotation de 180°",
      badge: "Activité Pratique 7",
      objective: "Découvrir la composition des transformations linéaires et la symétrie centrale.",
      matrix: { a: -1, b: 0, c: 0, d: -1 },
      matrixLabel: "Rotation 180°",
      theory: "Appliquer consécutivement deux rotations de $90^\\circ$ équivaut à une rotation de $180^\\circ$. Algébriquement, la composition de transformations linéaires correspond au produit de leurs matrices associées.",
      tasks: [
        "Appliquez cette matrice de rotation de $180^\\circ$.",
        "Observez que cette matrice est égale à $-I$.",
        "Constatez l'effet sur les figures, qui subissent une symétrie centrale."
      ],
      observations: "Le carré de la matrice de rotation de $90^\\circ$ donne $\\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}$. Géométriquement, c'est une symétrie centrale par rapport à l'origine $(0, 0)$.",
      question: "Que se passe-t-il si l'on multiplie une matrice de transformation par son inverse ?",
      answer: "On obtient la matrice identité $I$. Appliquer une transformation puis son inverse ramène le plan à son état initial."
    },
    {
      id: "projection-collapse",
      title: "Projection sur une Droite",
      badge: "Activité Pratique 8",
      objective: "Visualiser une transformation singulière où le plan est projeté sur un espace de dimension inférieure.",
      matrix: { a: 1, b: 2, c: 0.5, d: 1 },
      matrixLabel: "Matrice Singulière",
      theory: "Lorsqu'une matrice a un déterminant nul, elle est dite singulière. Son image n'est plus le plan entier mais une droite (ou un point), et l'aire de toute figure transformée devient nulle.",
      tasks: [
        "Appliquez cette matrice singulière dans le simulateur.",
        "Observez comment l'ensemble de la grille est projeté sur l'unique droite d'équation $y = 0.5x$.",
        "Remarquez que les vecteurs images $\\vec{i}'$ et $\\vec{j}'$ sont colinéaires."
      ],
      observations: "Le déterminant vaut $\\det(P) = 1 \\times 1 - 2 \\times 0.5 = 0$. Les vecteurs colonnes $(1, 0.5)$ et $(2, 1)$ sont proportionnels. Le plan 2D est écrasé sur une ligne droite 1D.",
      question: "Pourquoi est-il impossible d'inverser cette matrice ?",
      answer: "Parce que de multiples points distincts du plan initial sont projetés sur un même point de la droite. L'information permettant de distinguer leurs positions d'origine est perdue, rendant l'opération irréversible."
    },
    {
      id: "det-hunt",
      title: "Transformation Générale",
      badge: "Activité Pratique 9",
      objective: "Analyser une transformation combinant déformation asymétrique et changement d'orientation.",
      matrix: { a: 1, b: 2, c: 1, d: -1 },
      matrixLabel: "Transformation Mixte",
      theory: "Une matrice quelconque peut combiner simultanément des effets de transvection, de mise à l'échelle et de réflexion. Le déterminant permet de déduire le facteur d'échelle des aires et l'orientation résultante.",
      tasks: [
        "Appliquez cette matrice dans le simulateur.",
        "Observez la position des nouveaux vecteurs de base $\\vec{i}'$ et $\\vec{j}'$.",
        "Affichez l'aire de la figure transformée dans le panneau de contrôle."
      ],
      observations: "Pour la matrice $\\begin{pmatrix} 1 & 2 \\\\ 1 & -1 \\end{pmatrix}$, le déterminant vaut $-3$. L'aire est multipliée par $|-3| = 3$, et le signe négatif indique que l'orientation du plan est inversée.",
      question: "Quelle est l'image du vecteur $\\vec{u}(1,1)$ par cette transformation ?",
      answer: "Le produit matriciel donne $\\begin{pmatrix} 1 & 2 \\\\ 1 & -1 \\end{pmatrix} \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 0 \\end{pmatrix}$. Le vecteur se retrouve sur l'axe des abscisses."
    },
    {
      id: "chaos-combo",
      title: "Composition Complexe",
      badge: "Activité Pratique 10",
      objective: "Étudier une matrice complète combinant dilatation, transvection et rotation.",
      matrix: { a: 1.5, b: -1, c: 1, d: 2 },
      matrixLabel: "Matrice Complète",
      theory: "Toute matrice inversible représente une transformation linéaire du plan. Même si elle semble modifier la grille de façon complexe, elle préserve l'alignement des points, le parallélisme des droites et l'origine.",
      tasks: [
        "Appliquez cette transformation dans le simulateur.",
        "Affichez la grille pour observer comment le quadrillage initial est transformé en un réseau de parallélogrammes.",
        "Calculez le déterminant pour anticiper le changement d'aire."
      ],
      observations: "Le déterminant vaut $\\det(V) = 1.5 \\times 2 - (-1) \\times 1 = 3 + 1 = 4$. Toute figure voit son aire multipliée par 4. Le quadrillage oblique confirme qu'il s'agit d'une composition incluant une rotation et une transvection.",
      question: "Comment peut-on décomposer cette transformation complexe en transformations plus simples ?",
      answer: "En algèbre linéaire, la décomposition polaire (ou la SVD) permet d'exprimer toute matrice comme le produit d'une isométrie (rotation ou réflexion) et d'une matrice symétrique (mise à l'échelle sur des axes orthogonaux)."
    }
];

  const [selectedId, setSelectedId] = useState<string>(activities[0].id);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const activeActivity = activities.find(a => a.id === selectedId) || activities[0];

  const toggleReveal = (id: string) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Run MathJax when active activity card or revealed answer changes
  useEffect(() => {
    const mj = (window as any).MathJax;
    if (mj && mj.typesetPromise) {
      mj.typesetPromise();
    }
  }, [selectedId, revealedAnswers]);

  return (
    <div className="space-y-6">
      {/* Upper header - Unified Premium System */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
        <div className="bg-linear-to-r from-amber-50 to-yellow-50/20 p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-slate-800">Activités Pratiques</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Consultez ces travaux d'exploration guidés pour appliquer directement les concepts d'algèbre linéaire en interagissant avec le simulateur.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* Dynamic sidebar selectors */}
      <div className="col-span-1 xl:col-span-4 space-y-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-400 mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
            Activités Pratiques
          </h3>
          <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
            Consultez ces travaux d'exploration guidés pour appliquer directement les concepts d'algèbre linéaire en interagissant avec l'outil de simulation graphique.
          </p>

          <div className="space-y-2.5">
            {activities.map((act) => {
              const isActive = act.id === selectedId;
              return (
                <button
                  key={act.id}
                  onClick={() => setSelectedId(act.id)}
                  className={`w-full text-left p-3.5 rounded-lg text-xs transition duration-150 border flex flex-col gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-emerald-950 border-emerald-950 text-white"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className={`text-[9px] uppercase tracking-wider font-bold ${isActive ? "text-emerald-450" : "text-emerald-600"}`}>
                    {act.badge}
                  </span>
                  <span className="font-semibold line-clamp-1">{act.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative advice box */}
        <div className="p-4 bg-amber-50/50 border border-amber-150 rounded-lg text-xs text-amber-900 leading-relaxed space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 grow-0 shrink-0" />
            Démarche scientifique conseillée
          </div>
          <p className="text-[11px] text-amber-800">
            Essayez d'abord de deviner ou de calculer le résultat géométrique par vous-même avant d'injecter la matrice d'essai dans le simulateur 2D !
          </p>
        </div>
      </div>

      {/* Main panel displays */}
      <div className="col-span-1 xl:col-span-8 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[9px] font-mono tracking-widest font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded inline-block mb-3">
              {activeActivity.badge.toUpperCase()}
            </span>
            <h2 className="text-2xl font-light tracking-tight text-slate-900 flex items-center gap-2">
              {activeActivity.title}
            </h2>
            <p className="text-xs text-slate-500 italic mt-1.5 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Objectif d'apprentissage : {activeActivity.objective}
            </p>
          </div>

          {/* Theoretical Foundations */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400">
              Fondement Théorique
            </h4>
            <div className="text-sm text-slate-650 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-150">
              <MathText>{activeActivity.theory}</MathText>
            </div>
          </div>

          {/* Quick Sandbox Injection Action */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50/20 to-teal-50/10 border border-emerald-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold font-mono">Matrice Expérimentale :</span>
              <MathText className="font-semibold text-slate-800 text-sm">
                {`$$M = \\begin{pmatrix} ${activeActivity.matrix.a} & ${activeActivity.matrix.b} \\\\ ${activeActivity.matrix.c} & ${activeActivity.matrix.d} \\end{pmatrix}$$`}
              </MathText>
            </div>

            <button
              onClick={() => onInjectMatrix(activeActivity.matrix, `${activeActivity.badge} - ${activeActivity.matrixLabel}`)}
              className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-md text-xs font-bold font-mono uppercase tracking-wide cursor-pointer shadow-sm transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-350" />
              Injecter dans le simulateur <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Steps / Tasks to perform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400">
              Manipulations recommandées
            </h4>
            <ol className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs text-slate-600 bg-white">
              {activeActivity.tasks.map((task, index) => (
                <li key={index} className="p-3.5 flex items-start gap-3 hover:bg-slate-50/50">
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-150 flex items-center justify-center shrink-0 font-bold text-slate-700 text-[10px]">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed mt-0.5"><MathText inline>{task}</MathText></span>
                </li>
              ))}
            </ol>
          </div>

          {/* Scientific observation feedback block */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Explications de l'effet obtenu :</span>
            <div className="text-xs text-slate-650 leading-relaxed bg-amber-50/20 border border-amber-100 p-4 rounded-lg">
              <MathText>{activeActivity.observations}</MathText>
            </div>
          </div>

          {/* Scientific Challenge (Question for self) */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/30 space-y-4">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[8px] font-mono uppercase tracking-widest font-bold text-slate-400 block">Défi d'analyse</span>
                <div className="text-xs font-bold text-slate-800 leading-relaxed">
                  <MathText inline>{activeActivity.question}</MathText>
                </div>
              </div>
            </div>

            <div className="pt-2">
              {!revealedAnswers[activeActivity.id] ? (
                <button
                  onClick={() => toggleReveal(activeActivity.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Afficher la réponse géométrique
                </button>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <button
                    onClick={() => toggleReveal(activeActivity.id)}
                    className="text-[10px] text-slate-400 hover:text-slate-700 font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1"
                  >
                    Masquer la réponse [-]
                  </button>
                  <div className="bg-emerald-50/40 p-4 rounded-lg border border-emerald-100 text-xs text-slate-700 leading-relaxed">
                    <div className="font-bold text-emerald-950 flex items-center gap-1 mb-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Solution démontrée :
                    </div>
                    <MathText>{activeActivity.answer}</MathText>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      </div>
    </div>
  );
}
