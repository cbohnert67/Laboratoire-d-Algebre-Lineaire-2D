/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import TheoryCourse from "./components/TheoryCourse";
import InteractiveMatrixLab from "./components/InteractiveMatrixLab";
import MathQuiz from "./components/MathQuiz";
import MathExercices from "./components/MathExercices";
import MathActivities from "./components/MathActivities";
import MathTutorial from "./components/MathTutorial";
import { Matrix2D } from "./types";
import { Sparkles, Library, FlaskConical, HelpCircle, GraduationCap, Compass, BookOpen, Home } from "lucide-react";

export default function App() {
  // Tabs: "home" | "course" | "activities" | "exercices" | "quiz" | "lab" | "tutorial"
  const [activeTab, setActiveTab ] = useState<"home" | "course" | "activities" | "exercices" | "quiz" | "lab" | "tutorial">("home");

  // Shared matrix state allowing TheoryCourse or exercises to "inject" a matrix and switch tab for instant verification
  const [activeMatrix, setActiveMatrix] = useState<Matrix2D>({
    a: 1.5,
    b: 0.5,
    c: -0.5,
    d: 1.0,
  });

  const [loadedPresetName, setLoadedPresetName] = useState<string | null>(null);

  const handleLoadMatrixFromCourse = (matrix: Matrix2D, name: string) => {
    setActiveMatrix(matrix);
    setLoadedPresetName(name);
    setActiveTab("lab"); // Redirect user to the interactive simulation
  };

  // Trigger MathJax on every tab change
  useEffect(() => {
    const triggerMathJax = () => {
      const mj = (window as any).MathJax;
      if (mj && mj.typesetPromise) {
        mj.typesetPromise().catch((err: any) => {
          console.warn("MathJax global typesetting error:", err);
        });
      }
    };

    triggerMathJax();
    const timer = setTimeout(triggerMathJax, 80);
    const timer2 = setTimeout(triggerMathJax, 250);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      
      {/* Premium Header bar */}
      <header className="bg-slate-50/40 border-b border-slate-200/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-light tracking-tight text-slate-900 flex items-center gap-2">
                Algèbre linéaire et géométrie du plan
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Explorez géométriquement l'effet des matrices réelles et des applications linéaires du plan.
              </p>
            </div>
          </div>

          {/* Navigation Tab controls: Premium Uniform Colored System */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 font-sans text-xs flex-wrap gap-1 shadow-sm">
            <button
              onClick={() => setActiveTab("home")}
              className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                activeTab === "home"
                  ? "bg-slate-800 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
              }`}
            >
              <Home className={`w-4 h-4 transition-colors duration-200 ${activeTab === "home" ? "text-white" : "text-slate-400"}`} />
              <span>Accueil</span>
            </button>
            <button
              onClick={() => setActiveTab("course")}
              className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                activeTab === "course"
                  ? "bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200/50 font-semibold"
                  : "text-slate-600 hover:bg-emerald-50/40 hover:text-emerald-600"
              }`}
            >
              <GraduationCap className={`w-4 h-4 transition-colors duration-200 ${activeTab === "course" ? "text-emerald-600" : "text-slate-400"}`} />
              <span>Théorie</span>
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                activeTab === "activities"
                  ? "bg-amber-50 text-amber-700 shadow-xs border border-amber-200/50 font-semibold"
                  : "text-slate-600 hover:bg-amber-50/40 hover:text-amber-600"
              }`}
            >
              <Compass className={`w-4 h-4 transition-colors duration-200 ${activeTab === "activities" ? "text-amber-600" : "text-slate-400"}`} />
              <span>Activités</span>
            </button>
            <button
              onClick={() => setActiveTab("exercices")}
              className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                activeTab === "exercices"
                  ? "bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200/50 font-semibold"
                  : "text-slate-600 hover:bg-indigo-50/40 hover:text-indigo-600"
              }`}
            >
              <Library className={`w-4 h-4 transition-colors duration-200 ${activeTab === "exercices" ? "text-indigo-600" : "text-slate-400"}`} />
              <span>Exercices</span>
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                activeTab === "quiz"
                  ? "bg-rose-50 text-rose-700 shadow-xs border border-rose-200/50 font-semibold"
                  : "text-slate-600 hover:bg-rose-50/40 hover:text-rose-600"
              }`}
            >
              <HelpCircle className={`w-4 h-4 transition-colors duration-200 ${activeTab === "quiz" ? "text-rose-600" : "text-slate-400"}`} />
              <span>Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab("lab")}
              className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                activeTab === "lab"
                  ? "bg-purple-50 text-purple-700 shadow-xs border border-purple-200/50 font-semibold"
                  : "text-slate-600 hover:bg-purple-50/40 hover:text-purple-600"
              }`}
            >
              <FlaskConical className={`w-4 h-4 transition-colors duration-200 ${activeTab === "lab" ? "text-purple-600" : "text-slate-400"}`} />
              <span>Simulateur</span>
            </button>
            <button
              onClick={() => setActiveTab("tutorial")}
              className={`cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                activeTab === "tutorial"
                  ? "bg-sky-50 text-sky-700 shadow-xs border border-sky-200/50 font-semibold"
                  : "text-slate-600 hover:bg-sky-50/40 hover:text-sky-600"
              }`}
            >
              <BookOpen className={`w-4 h-4 transition-colors duration-200 ${activeTab === "tutorial" ? "text-sky-600" : "text-slate-400"}`} />
              <span>Tutoriel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container viewport */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
        
        {/* Banner notification if a preset matrix was loaded from theory/exercise */}
        {loadedPresetName && activeTab === "lab" && (
          <div className="mb-6 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span>
                Matrice <strong className="font-semibold text-slate-900">"{loadedPresetName}"</strong> injectée avec succès dans le simulateur !
              </span>
            </div>
            <button 
              onClick={() => setLoadedPresetName(null)}
              className="font-mono text-[10px] text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              [FERMER]
            </button>
          </div>
        )}

        {/* Tab contents load */}
        {activeTab === "home" && (
          <HomePage onNavigate={(tab: any) => setActiveTab(tab)} />
        )}
        {activeTab === "course" && (
          <TheoryCourse onLoadMatrix={handleLoadMatrixFromCourse} />
        )}
        {activeTab === "activities" && (
          <MathActivities onInjectMatrix={handleLoadMatrixFromCourse} />
        )}
        {activeTab === "exercices" && (
          <MathExercices onInjectMatrix={handleLoadMatrixFromCourse} />
        )}
        {activeTab === "quiz" && (
          <MathQuiz />
        )}
        {activeTab === "lab" && (
          <InteractiveMatrixLab 
            initialMatrix={activeMatrix} 
            onMatrixChange={(m) => {
              setActiveMatrix(m);
              // reset loaded preset tag on manual updates
              if (loadedPresetName) setLoadedPresetName(null);
            }} 
          />
        )}
        {activeTab === "tutorial" && (
          <MathTutorial />
        )}

      </main>

      {/* Academic footer citation */}
      <footer className="bg-slate-50 border-t border-slate-200/80 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-[1536px] mx-auto px-4 flex flex-col items-center justify-center text-center">
          <p className="font-sans text-slate-500/80">
            © 2026 Laboratoire d'Algèbre Linéaire en dimension 2 — Conçu pour l'apprentissage visuel et géométrique par Cédric Bohnert.
          </p>
        </div>
      </footer>

    </div>
  );
}
