import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ArrowRight, Trophy, HelpCircle, RefreshCw, Award } from "lucide-react";
import MathText from "./MathText";

interface Question {
  type: string;
  title: string;
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function MathQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  
  const totalQuestions = 20;

  // Generate a random question
  const generateRandomQuestion = (): Question => {
    const types = ["det", "image", "geom", "area"];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    const randInt = (min: number, max: number, avoid: number[] = []) => {
      let val;
      do {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (avoid.includes(val));
      return val;
    };

    if (chosenType === "det") {
      const a = randInt(-3, 4, [0]);
      const b = randInt(-2, 3);
      const c = randInt(-2, 3);
      const d = randInt(-3, 4, [0]);
      const detVal = a * d - b * c;

      const statement = `Calculer le déterminant de la matrice suivante représentant une transformation linéaire :
      $$M = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$$`;

      // Distractors
      const d1 = a * d + b * c; // sign error
      const d2 = a * b - c * d; // formula mismatch
      const d3 = detVal + randInt(1, 4, [0]);

      const candidates = Array.from(new Set([detVal, d1, d2, d3])).filter(x => !isNaN(x));
      while (candidates.length < 4) {
        candidates.push((candidates[candidates.length - 1] || 0) + randInt(1, 3));
      }

      const options = candidates.sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(detVal);

      return {
        type: "det",
        title: "Calcul de Déterminant",
        statement,
        options: options.map(val => `$$det(M) = ${val}$$`),
        correctIndex,
        explanation: `Pour une matrice $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, le déterminant est donné par la formule $ad - bc$.\n\nIci :\n$$det(M) = (${a} \\times ${d}) - (${b} \\times ${c}) = ${a * d} - (${b * c}) = ${detVal}.$$`
      };
    } else if (chosenType === "image") {
      const a = randInt(-2, 3, [0]);
      const b = randInt(-2, 2);
      const c = randInt(-2, 2);
      const d = randInt(-2, 3, [0]);
      const px = randInt(1, 4);
      const py = randInt(-2, 3);

      const rx = a * px + b * py;
      const ry = c * px + d * py;

      const statement = `Soit la transformation linéaire définie par la matrice $M$. Déterminez les coordonnées de l'image du vecteur $\\vec{u}$ par cette application :
      $$M = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}, \\quad \\vec{u} = \\begin{pmatrix} ${px} \\\\ ${py} \\end{pmatrix}$$`;

      // Distractors
      const optionsArray = [
        { x: rx, y: ry }, // correct
        { x: a * px - b * py, y: c * px - d * py }, // subtraction
        { x: b * px + a * py, y: d * px + c * py }, // reversed columns
        { x: rx + randInt(1, 2), y: ry - randInt(1, 2) } // slightly perturbed
      ];

      // Remove duplicates
      const uniqueOptions = optionsArray.filter(
        (v, idx, self) => self.findIndex(t => t.x === v.x && t.y === v.y) === idx
      );
      while (uniqueOptions.length < 4) {
        uniqueOptions.push({ x: rx + randInt(-3, 3), y: ry + randInt(-3, 3) });
      }

      const options = uniqueOptions.sort(() => Math.random() - 0.5);
      const correctIndex = options.findIndex(o => o.x === rx && o.y === ry);

      return {
        type: "image",
        title: "Image d'un Vecteur",
        statement,
        options: options.map(o => `$$\\vec{u}' = \\begin{pmatrix} ${o.x} \\\\ ${o.y} \\end{pmatrix}$$`),
        correctIndex,
        explanation: `Pour multiplier une matrice par un vecteur de dimension 2, on applique :\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}$$\n\nCalculons l'abscisse et l'ordonnée :\n- $x' = (${a} \\times ${px}) + (${b} \\times ${py}) = ${a * px} + (${b * py}) = ${rx}$\n- $y' = (${c} \\times ${px}) + (${d} \\times ${py}) = ${c * px} + (${d * py}) = ${ry}$\n\nL'image est donc $\\vec{u}' = \\begin{pmatrix} ${rx} \\\\ ${ry} \\end{pmatrix}$.`
      };
    } else if (chosenType === "geom") {
      const presets = [
        { name: "Homothétie de rapport 2", matrix: { a: 2, b: 0, c: 0, d: 2 }, desc: "Dilate l'espace uniformément d'un facteur 2." },
        { name: "Symétrie par rapport à l'axe X", matrix: { a: 1, b: 0, c: 0, d: -1 }, desc: "Inverse l'ordonnée d'un vecteur (effet miroir vertical)." },
        { name: "Rotation de 180°", matrix: { a: -1, b: 0, c: 0, d: -1 }, desc: "Incline les axes pour inverser l'orientation des deux directions." },
        { name: "Projection sur l'axe Y", matrix: { a: 0, b: 0, c: 0, d: 1 }, desc: "Écrase le plan sur l'axe des ordonnées vertical." },
        { name: "Cisaillement horizontal de facteur 1.5", matrix: { a: 1, b: 1.5, c: 0, d: 1 }, desc: "Décale l'abscisse proportionnellement à l'ordonnée." },
      ];

      const rIndex = Math.floor(Math.random() * presets.length);
      const target = presets[rIndex];

      const statement = `Identifiez la transformation géométrique correspondant exactement à la matrice standard suivante :
      $$A = \\begin{pmatrix} ${target.matrix.a} & ${target.matrix.b} \\\\ ${target.matrix.c} & ${target.matrix.d} \\end{pmatrix}$$`;

      // Options
      const options = presets.map(p => p.name).sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(target.name);

      return {
        type: "geom",
        title: "Reconnaissance Géométrique",
        statement,
        options,
        correctIndex,
        explanation: `La matrice $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ possède pour colonnes les images respectives des vecteurs de base $\\vec{i}$ et $\\vec{j}$ :\n- l'image de $\\vec{i}$ est $\\vec{i}' = (${target.matrix.a}, ${target.matrix.c})^T$\n- l'image de $\\vec{j}$ est $\\vec{j}' = (${target.matrix.b}, ${target.matrix.d})^T$\n\nPour la matrice donnée, cet effet géométrique correspond à : **${target.name}**.\n*${target.desc}*`
      };
    } else {
      // Area factor
      const factor = randInt(2, 4);
      const statement = `Si une transformation linéaire de plan possède la matrice standard suivante, par quel facteur multiplicatif les aires de toutes les figures géométriques du plan s'ajusteront-elles ?
      $$M = \\begin{pmatrix} ${factor} & 1 \\\\ 0 & 3 \\end{pmatrix}$$`;

      const areaFactor = Math.abs(factor * 3); // det = factor * 3

      const options = [
        `Le facteur est ${areaFactor} (valeur absolue du déterminant)`,
        `Le facteur est ${factor} (premier coefficient diagonal)`,
        `Le facteur est 3 (second coefficient diagonal)`,
        `Le facteur est ${factor + 3} (somme de la diagonale)`
      ].sort(() => Math.random() - 0.5);

      const correctIndex = options.findIndex(o => o.includes(`Le facteur est ${areaFactor}`));

      return {
        type: "area",
        title: "Facteur de Modification d'Aire",
        statement,
        options,
        correctIndex,
        explanation: `Le facteur par lequel une transformation linéaire multiplie l'aire de n'importe quelle portion du plan correspond toujours à la **valeur absolue de son déterminant** : $|det(M)|$.\n\nPour la matrice $\\begin{pmatrix} ${factor} & 1 \\\\ 0 & 3 \\end{pmatrix}$ :\n$$det(M) = (${factor} \\times 3) - (1 \\times 0) = ${factor * 3}.$$ \n\nPar conséquent, l'aire de toute figure transformée sera multipliée exactement par un facteur **${areaFactor}**.`
      };
    }
  };

  const startNewQuiz = () => {
    const newQuestions = Array.from({ length: totalQuestions }, () => generateRandomQuestion());
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsFinished(false);
  };

  // Initialize first quiz
  useEffect(() => {
    startNewQuiz();
  }, []);

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    
    const currentQuestion = questions[currentIndex];
    const correct = selectedOption === currentQuestion.correctIndex;
    if (correct) {
      setScore(prev => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center py-10 font-sans text-slate-500">Chargement du quiz...</div>;
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8 sm:p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-light tracking-tight text-slate-900 mb-2">
            Quiz Terminé !
          </h2>
          <p className="text-slate-500 mb-8">
            Vous avez testé vos connaissances sur les concepts fondamentaux de l'algèbre linéaire en 2D.
          </p>
          
          <div className="bg-slate-50 w-full max-w-sm rounded-xl p-6 border border-slate-200 mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Votre Score Final</h3>
            <div className="text-5xl font-light text-slate-800">
              {score} <span className="text-2xl text-slate-400">/ {totalQuestions}</span>
            </div>
          </div>
          
          <button
            onClick={startNewQuiz}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg text-sm font-bold font-mono tracking-wide uppercase flex items-center gap-2 cursor-pointer shadow-md transition"
          >
            <RefreshCw className="w-4 h-4" />
            Recommencer un Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Upper header - Unified Premium System */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-rose-50 to-red-50/20 p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-semibold text-slate-800">Quiz d'Évaluation</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Testez vos connaissances en temps réel sur les déterminants, l'associativité et l'image d'un vecteur.
          </p>
        </div>
      </div>
      
      {/* Quiz Progress & Stats */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-mono text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Question : <strong className="text-slate-800">{currentIndex + 1} / {totalQuestions}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span>Score : <strong className="text-slate-900 font-bold">{score}/{currentIndex + (isSubmitted ? 1 : 0)}</strong></span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
            Question {currentIndex + 1} : {currentQuestion.title}
          </span>
          <h2 className="text-xl font-light tracking-tight text-slate-900">
            {currentQuestion.title}
          </h2>
        </div>

        <div className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-5 rounded-lg border border-slate-100">
          <MathText>{currentQuestion.statement}</MathText>
        </div>

        {/* Option selection layout */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = currentQuestion.correctIndex === idx;
            let btnClass = "border-slate-200 hover:border-slate-350 bg-white text-slate-800";
            
            if (isSubmitted) {
              if (isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-50/40 text-emerald-950 font-medium";
              } else if (isSelected) {
                btnClass = "border-red-500 bg-red-50/40 text-red-950";
              } else {
                btnClass = "border-slate-200 opacity-60 text-slate-400 bg-slate-50/20";
              }
            } else if (isSelected) {
              btnClass = "border-slate-900 bg-slate-950 text-white font-medium shadow-xs";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded border text-xs transition-all duration-150 flex items-center justify-between ${btnClass} ${!isSubmitted && "cursor-pointer active:scale-99"}`}
              >
                <div className="flex-1 pointer-events-none">
                  {option.startsWith("$$") ? (
                    <MathText>{option}</MathText>
                  ) : (
                    <span>{option}</span>
                  )}
                </div>
                {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-2 shrink-0" />}
                {isSubmitted && !isCorrect && isSelected && <XCircle className="w-4 h-4 text-red-600 ml-2 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={startNewQuiz}
            className="text-[10px] font-mono text-slate-400 hover:text-slate-900 uppercase tracking-wider flex items-center gap-1 cursor-pointer transition"
          >
            <RefreshCw className="w-3 h-3" /> Recommencer
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-5 py-2.5 rounded text-xs font-bold font-mono tracking-wide uppercase transition ${
                selectedOption === null
                  ? "bg-slate-100 text-slate-350 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-md"
              }`}
            >
              Soumettre
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded text-xs font-bold font-mono tracking-wide uppercase flex items-center gap-1.5 cursor-pointer shadow-md transition"
            >
              {currentIndex < totalQuestions - 1 ? "Suivant" : "Terminer"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Solutions / Explanation details box */}
      {isSubmitted && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-slate-500" />
            Explication détaillée
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            <MathText>{currentQuestion.explanation}</MathText>
          </div>
        </div>
      )}

    </div>
  );
}
