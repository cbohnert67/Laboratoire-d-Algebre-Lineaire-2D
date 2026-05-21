import { GraduationCap, BookOpen, Compass, Library, HelpCircle, FlaskConical, ArrowRight, Activity, Sparkles } from "lucide-react";

interface HomePageProps {
  onNavigate: (tab: "course" | "activities" | "exercices" | "quiz" | "lab" | "tutorial") => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const sections = [
    {
      id: "course",
      title: "Théorie",
      description: "Apprenez les bases de l'algèbre linéaire, des vecteurs aux valeurs propres.",
      icon: <GraduationCap className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-50 to-teal-50/50",
      borderColor: "border-emerald-200/50",
      hoverRing: "hover:ring-emerald-500/20",
    },
    {
      id: "lab",
      title: "Simulateur Interactif",
      description: "Visualisez en temps réel l'impact des matrices sur le plan euclidien.",
      icon: <FlaskConical className="w-8 h-8 text-purple-500" />,
      color: "from-purple-50 to-fuchsia-50/50",
      borderColor: "border-purple-200/50",
      hoverRing: "hover:ring-purple-500/20",
    },
    {
      id: "activities",
      title: "Activités Pratiques",
      description: "Suivez des explorations guidées pour appliquer directement les concepts.",
      icon: <Compass className="w-8 h-8 text-amber-500" />,
      color: "from-amber-50 to-yellow-50/50",
      borderColor: "border-amber-200/50",
      hoverRing: "hover:ring-amber-500/20",
    },
    {
      id: "exercices",
      title: "Exercices",
      description: "Résolvez des défis géométriques et calculez formellement les matrices associées.",
      icon: <Library className="w-8 h-8 text-indigo-500" />,
      color: "from-indigo-50 to-blue-50/50",
      borderColor: "border-indigo-200/50",
      hoverRing: "hover:ring-indigo-500/20",
    },
    {
      id: "quiz",
      title: "Quiz d'Évaluation",
      description: "Testez vos connaissances théoriques et pratiques avec une série de 20 questions.",
      icon: <HelpCircle className="w-8 h-8 text-rose-500" />,
      color: "from-rose-50 to-red-50/50",
      borderColor: "border-rose-200/50",
      hoverRing: "hover:ring-rose-500/20",
    },
    {
      id: "tutorial",
      title: "Tutoriel",
      description: "Prenez en main l'interface et comprenez le fonctionnement global du laboratoire.",
      icon: <BookOpen className="w-8 h-8 text-sky-500" />,
      color: "from-sky-50 to-indigo-50/50",
      borderColor: "border-sky-200/50",
      hoverRing: "hover:ring-sky-500/20",
    }
  ] as const;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-10 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mt-6">
        <div className="absolute inset-0 bg-slate-900/[0.02]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white" />
        
        <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 mb-6 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            Apprentissage Visuel
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 mb-6">
            Comprendre l'algèbre linéaire par <span className="font-semibold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-500">l'exploration</span>
          </h1>
          
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Ce laboratoire interactif transforme les concepts abstraits des mathématiques matricielles en visualisations géométriques tangibles. Manipulez l'espace, observez les déformations, et développez une intuition profonde des transformations du plan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("lab")}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center gap-2 cursor-pointer shadow-lg transition-transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <FlaskConical className="w-4 h-4" />
              Ouvrir le Simulateur
            </button>
            <button
              onClick={() => onNavigate("course")}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center gap-2 cursor-pointer shadow-sm transition-transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <GraduationCap className="w-4 h-4" />
              Lire la Théorie
            </button>
          </div>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="space-y-4 text-center pb-4">
        <h2 className="text-2xl font-light tracking-tight text-slate-900">Parcours Pédagogique</h2>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">Choisissez votre point d'entrée selon votre niveau de familiarité avec l'algèbre linéaire.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className={`group bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ring-2 ring-transparent ${section.hoverRing}`}
          >
            <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-linear-to-br ${section.color} border ${section.borderColor}`}>
              {section.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
              {section.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {section.description}
            </p>
            <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
              <span>Ouvrir</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
