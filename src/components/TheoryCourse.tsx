import { useState } from "react";
import MathText from "./MathText";
import { BookOpen, HelpCircle, Eye, ArrowRight, Zap, RefreshCw, Triangle, GraduationCap, Layers } from "lucide-react";
import { Matrix2D } from "../types";

interface TheoryCourseProps {
  onLoadMatrix: (matrix: Matrix2D, name: string) => void;
}

export default function TheoryCourse({ onLoadMatrix }: TheoryCourseProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const chapters = [
    {
      id: 0,
      title: "1. Vecteurs et Matrices dans $\\mathbb{R}^2$",
      icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed">
            {"Dans l'espace vectoriel à deux dimensions (noté $\\mathbb{R}^2$), chaque point ou direction est représenté par un "}
            <strong>vecteur colonne</strong> {"à deux coordonnées réelles. Un vecteur n'est pas seulement un point cartésien, c'est un objet mathématique sur lequel on peut effectuer des opérations algébriques : l'addition vectorielle et la multiplication par un scalaire."}
          </p>
          
          <div className="bg-slate-100 hover:bg-slate-200/85 transition duration-200 rounded-xl p-6 border-l-4 border-emerald-500 max-w-md mx-auto">
            <MathText className="text-center text-lg font-semibold">
              {"$$\\vec{u} = \\begin{pmatrix} x \\\\ y \\end{pmatrix} \\in \\mathbb{R}^2$$"}
            </MathText>
            <p className="text-xs text-center text-slate-500 mt-2">
              Le scalaire $x$ représente la coordonnée selon l'axe des abscisses, et $y$ la coordonnée selon l'axe des ordonnées.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
             <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <h4 className="font-semibold text-slate-800 text-sm">Addition Vectorielle</h4>
                <p className="text-xs text-slate-600 mt-1 mb-2">Les vecteurs s'additionnent coordonnée par coordonnée (règle du parallélogramme géométrique).</p>
                <MathText className="text-sm">{"$$\\begin{pmatrix} x_1 \\\\ y_1 \\end{pmatrix} + \\begin{pmatrix} x_2 \\\\ y_2 \\end{pmatrix} = \\begin{pmatrix} x_1 + x_2 \\\\ y_1 + y_2 \\end{pmatrix}$$"}</MathText>
             </div>
             <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <h4 className="font-semibold text-slate-800 text-sm">Multiplication Scalaire</h4>
                <p className="text-xs text-slate-600 mt-1 mb-2">Un nombre réel $k$ étire ou rétrécit le vecteur dans sa propre direction.</p>
                <MathText className="text-sm">{"$$k \\cdot \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} kx \\\\ ky \\end{pmatrix}$$"}</MathText>
             </div>
          </div>

          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mt-6">Définition : Matrice</h3>
          <p className="text-slate-600 leading-relaxed mt-2">
            Une <strong>matrice de taille {"$2 \\times 2$"}</strong> est un tableau ordonné de 4 nombres réels. En algèbre linéaire, elle est l'outil algébrique permettant de représenter de manière compacte une application (ou fonction) agissant sur l'espace. Elle agit comme une machine mathématique capable d'étirer, de faire tourner, de refléter ou de déformer {"$\\mathbb{R}^2$"} :
          </p>

          <div className="bg-slate-100 hover:bg-slate-200/85 transition duration-200 rounded-xl p-6 border-l-4 border-emerald-500 max-w-md mx-auto mt-4">
            <MathText className="text-center text-lg font-semibold">
              {"$$M \\in \\mathcal{M}_{2,2}(\\mathbb{R}) = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$"}
            </MathText>
            <p className="text-xs text-center text-slate-500 mt-2">
              La matrice $M$ est composée de deux vecteurs colonnes empilés l'un à côté de l'autre.
            </p>
          </div>

          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mt-6">Combinaison Linéaire et Produit Matrice-Vecteur</h3>
          <p className="text-slate-600 leading-relaxed mt-2">
            {"Pour appliquer une transformation encodée par une matrice $M$ à un vecteur $\\vec{u}$, on opère un produit matriciel. Géométriquement, ce calcul représente en réalité une combinaison linéaire des vecteurs colonnes de la matrice :"}
          </p>

          <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100 md:px-8 mt-4">
            <MathText className="text-slate-800 text-base md:text-lg">
              {"$$\\vec{u'} = M\\vec{u} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix} = x\\begin{pmatrix} a \\\\ c \\end{pmatrix} + y\\begin{pmatrix} b \\\\ d \\end{pmatrix}$$"}
            </MathText>
            <div className="mt-4 text-xs text-emerald-800 space-y-2">
              <p>💡 <strong>Explication algébrique :</strong> Le vecteur résultant est proportionnel aux colonnes de la matrice, pondéré par les coordonnées d'origine $x$ et $y$.</p>
              <MathText>
                {"Si $M = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ et $\\vec{u} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$, alors :"}
              </MathText>
              <MathText className="font-mono mt-1 text-slate-700">
                {"$$M\\vec{u} = 1\\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix} + 2\\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix} + \\begin{pmatrix} 2 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix}$$"}
              </MathText>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "2. Transformations Linéaires",
      icon: <HelpCircle className="w-4 h-4 text-indigo-500" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Définition : Transformation Linéaire</h3>
          <p className="text-slate-600 leading-relaxed mt-2">
            {"Une application (ou fonction) $f: \\mathbb{R}^2 \\to \\mathbb{R}^2$ est appelée une "}<strong>transformation linéaire</strong>{" (ou \"endomorphisme\") si elle préserve la structure mathématique de l'espace vectoriel. Géométriquement, cela implique l'absence de translation (l'origine est ancrée) et que l'image de toute droite reste une droite sans courbure. Algébriquement, elle doit respecter deux axiomes :"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                Additivité (Préservation de la somme)
              </span>
              <MathText className="text-slate-800 text-sm">
                {"$$\\forall \\vec{u}, \\vec{v} \\in \\mathbb{R}^2, \\ f(\\vec{u} + \\vec{v}) = f(\\vec{u}) + f(\\vec{v})$$"}
              </MathText>
              <p className="text-xs text-slate-500 mt-2 mt-auto">
                L'image mathématique de l'addition de deux vecteurs paralyse l'addition finale de leurs images.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 mb-2">
                Homogénéité (Multiplication par un scalaire)
              </span>
              <MathText className="text-slate-800 text-sm">
                {"$$\\forall \\vec{u} \\in \\mathbb{R}^2, \\forall k \\in \\mathbb{R}, \\ f(k\\vec{u}) = k \\cdot f(\\vec{u})$$"}
              </MathText>
              <p className="text-xs text-slate-500 mt-2 mt-auto">
                Si un vecteur est redimensionné avant la transformation, l'image subira un redimensionnement analogue d'exactement la même échelle.
              </p>
            </div>
          </div>

          <div className="mt-6 border-l-4 border-indigo-500 bg-indigo-50/50 p-4 rounded-r-lg">
            <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Théorème de Représentation Matricielle
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {"Toute transformation linéaire $f$ de $\\mathbb{R}^2$ vers $\\mathbb{R}^2$ peut être mathématiquement encodée dans son intégralité sous la forme d'un produit par une matrice $M$ unique, de telle façon que : $f(\\vec{u}) = M \\vec{u}$ pour tout vecteur $\\vec{u}$."}
            </p>
          </div>

          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mt-6">Propriétés Géométriques Fondamentales</h3>
          
          <div className="space-y-3 mt-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs">1</div>
              <p className="text-slate-600 text-sm">
                <strong>L'origine invariante :</strong> {"En utilisant la propriété d'homogénéité avec un scalaire $k=0$, il apparaît obligatoirement que l'origine $(0,0)$ est toujours fixe. Le vecteur stérile reste immuable : $f(\\vec{0}) = \\vec{0}$."}
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs">2</div>
              <p className="text-slate-600 text-sm">
                <strong>Lignes de l'espace (Préservation de l'alignement) :</strong> L'image de n'importe quelle droite est soit une droite, soit réduite à un seul point (déformation de forme). Jamais une droite ne peut être coudée ni courbee.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-xs">3</div>
              <p className="text-slate-600 text-sm">
                <strong>Conservation des intervalles :</strong> Une grille géométrique dont les lignes sont réparties à intervalles constants restera toujours un réseau régulier (bien qu'il puisse être incliné, pincé ou étiré de façon homogène).
              </p>
            </div>
          </div>

          <div className="bg-red-50/50 rounded-xl p-5 border border-red-100 mt-6">
            <h4 className="text-sm font-bold text-red-800 flex items-center gap-2 mb-2">Attention : Ce qui N'EST PAS linéaire</h4>
            <p className="text-xs text-slate-700 leading-relaxed mb-3">
              Une simple translation (décaler tous les points de 3 unités vers la droite) modifie l'origine : $f(0,0) = (3,0) \\neq (0,0)$. <strong>Une translation n'est donc pas une transformation linéaire au sens strict de l'algèbre vectorielle pure.</strong>
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              De même, la fonction $f(x,y) = (x^2, y)$ courbe les lignes droites en paraboles et détruit la proportionnalité (homogénéité).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "3. Le Rôle des Vecteurs de Base $\\vec{i}$ et $\\vec{j}$",
      icon: <Eye className="w-4 h-4 text-amber-500" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Théorème Fondamental de l'Image d'une Base</h3>
          <p className="text-slate-600 leading-relaxed mt-2">
            {"Considérons la base canonique (la fondation cartésienne classique) de $\\mathbb{R}^2$ constituée des vecteurs pointant avec une magnitude de un sur chaque axe respectif :"}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              <MathText className="font-semibold text-red-700">
                {"$$\\vec{i} = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$$"}
              </MathText>
              <span className="text-[11px] text-red-600">Base canonique abscisse ($x$)</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <MathText className="font-semibold text-blue-700">
                {"$$\\vec{j} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$$"}
              </MathText>
              <span className="text-[11px] text-blue-600">Base canonique ordonnée ($y$)</span>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed mt-4">
            {"Si on insère ces vecteurs particuliers de base dans la formule d'une matrice linéaire quelconque, la multiplication supprime les termes nullifiés :"}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 my-4 max-w-2xl mx-auto shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-around gap-4">
              <div className="text-center">
                <MathText className="font-semibold">
                  {"$$M\\vec{i} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} a \\\\ c \\end{pmatrix}$$"}
                </MathText>
                <p className="text-xs text-red-700 font-bold mt-2 uppercase tracking-tight">{"Image de $\\vec{i}$ = 1ère colonne"}</p>
              </div>
              
              <div className="text-slate-300 font-bold text-2xl hidden md:block">|</div>

              <div className="text-center">
                <MathText className="font-semibold">
                  {"$$M\\vec{j} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} b \\\\ d \\end{pmatrix}$$"}
                </MathText>
                <p className="text-xs text-blue-700 font-bold mt-2 uppercase tracking-tight">{"Image de $\\vec{j}$ = 2ème colonne"}</p>
              </div>
            </div>
          </div>

          <div className="border border-amber-200 bg-amber-50/45 rounded-xl p-5">
            <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 flex-shrink-0" /> Clé Algébrique : Le plan entier se superpose à sa base
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">
              {"Par linéarité, tout vecteur $\\vec{v} = \\begin{pmatrix}x \\\\ y\\end{pmatrix}$ du plan se définit en tant que combinaison $x\\vec{i} + y\\vec{j}$. Connaître exactement la destination transformée des axes fondamentaux — c'est-à-dire comment $\\vec{i}$ subit $f(\\vec{i})$ et $\\vec{j}$ subit $f(\\vec{j})$ — dévoile l'entièreté de l'espace :" }
            </p>
            <div className="bg-white/60 p-3 rounded-lg border border-amber-200 text-center">
               <MathText className="text-slate-800">
                  {"$$f(\\vec{v}) = x \\cdot f(\\vec{i}) + y \\cdot f(\\vec{j})$$"}
               </MathText>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed mt-3">
              {"En résumé, <strong>une matrice $2 \\times 2$ n'est ni plus ni moins qu'un dictionnaire indiquant l'adresse des axes fondamentaux après déformation</strong>. Suivez le rouge et le bleu !"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "4. Les Grandes Familles de Transformations",
      icon: <RefreshCw className="w-4 h-4 text-sky-500" />,
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed">
            Voici les transformations géométriques classiques les plus importantes. Vous pouvez cliquer sur 
            <strong> "Charger dans le Lab"</strong> pour charger instantanément les valeurs de la matrice correspondante et voir son effet en direct !
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Rotation */}
            <div className="bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-4 transition shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>Rotation d'angle $\theta$</span>
                  <span className="text-xs px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md">Orthogonale</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tourne le plan autour de l'origine. Conserve les longueurs et les angles.
                </p>
                <MathText className="my-3 text-sm font-semibold">
                  {"$$R_{\\theta} = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$$"}
                </MathText>
                <p className="text-xs text-slate-600">
                  Exemple d'une rotation de $90^\\circ$ dans le sens trigonométrique :
                </p>
                <MathText className="font-mono text-xs my-1 text-slate-700">
                  {"$$\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$$"}
                </MathText>
              </div>
              <button 
                onClick={() => onLoadMatrix({ a: 0, b: -1, c: 1, d: 0 }, "Rotation 90°")}
                className="mt-3 cursor-pointer w-full text-center text-xs py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3 h-3" /> Charger dans le Lab
              </button>
            </div>

            {/* Homothétie / Dilatation */}
            <div className="bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-4 transition shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>Homothétie / Échelle</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">Diagonale</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Étire ou compresse l'espace le long des axes $x$ et $y$ par des facteurs distincts.
                </p>
                <MathText className="my-3 text-sm font-semibold">
                  {"$$S = \\begin{pmatrix} k_x & 0 \\\\ 0 & k_y \\end{pmatrix}$$"}
                </MathText>
                <p className="text-xs text-slate-600">
                  Exemple d'étirement horizontal par 2 et vertical par 0.5 :
                </p>
                <MathText className="font-mono text-xs my-1 text-slate-700">
                  {"$$\\begin{pmatrix} 2 & 0 \\\\ 0 & 0.5 \\end{pmatrix}$$"}
                </MathText>
              </div>
              <button 
                onClick={() => onLoadMatrix({ a: 2, b: 0, c: 0, d: 0.5 }, "Dilatation")}
                className="mt-3 cursor-pointer w-full text-center text-xs py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3 h-3" /> Charger dans le Lab
              </button>
            </div>

            {/* Cisaillement */}
            <div className="bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-4 transition shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>Cisaillement Horizontal</span>
                  <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">Triangulaire</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Déplace les points horizontalement proportionnellement à leur hauteur $y$.
                </p>
                <MathText className="my-3 text-sm font-semibold">
                  {"$$H_x = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$$"}
                </MathText>
                <p className="text-xs text-slate-600">
                  Exemple d'un cisaillement horizontal de facteur $1.5$ :
                </p>
                <MathText className="font-mono text-xs my-1 text-slate-700">
                  {"$$\\begin{pmatrix} 1 & 1.5 \\\\ 0 & 1 \\end{pmatrix}$$"}
                </MathText>
              </div>
              <button 
                onClick={() => onLoadMatrix({ a: 1, b: 1.5, c: 0, d: 1 }, "Cisaillement H")}
                className="mt-3 cursor-pointer w-full text-center text-xs py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3 h-3" /> Charger dans le Lab
              </button>
            </div>

            {/* Projection */}
            <div className="bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-4 transition shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>Projection Orthogonale</span>
                  <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-md">Non inversible</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Projette l'espace sur un axe ou une droite. Écrase une dimension.
                </p>
                <MathText className="my-3 text-sm font-semibold">
                  {"$$P_x = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$$"}
                </MathText>
                <p className="text-xs text-slate-600">
                  Exemple de la projection orthogonale directe sur l'axe des abscisses :
                </p>
                <MathText className="font-mono text-xs my-1 text-slate-700">
                  {"$$\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$$"}
                </MathText>
              </div>
              <button 
                onClick={() => onLoadMatrix({ a: 1, b: 0, c: 0, d: 0 }, "Projection x")}
                className="mt-3 cursor-pointer w-full text-center text-xs py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3 h-3" /> Charger dans le Lab
              </button>
            </div>

            {/* Réflexion */}
            <div className="bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-4 transition shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>Symétrie par rapport à $x$</span>
                  <span className="text-xs px-2 py-0.5 bg-pink-50 text-pink-700 rounded-md">Miroir</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Inverse le signe d'un axe (effet miroir), changeant l'orientation de l'espace.
                </p>
                <MathText className="my-3 text-sm font-semibold">
                  {"$$M_x = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$"}
                </MathText>
                <p className="text-xs text-slate-600">
                  Exemple de symétrie miroir par rapport à l'axe des abscisses :
                </p>
                <MathText className="font-mono text-xs my-1 text-slate-700">
                  {"$$\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$"}
                </MathText>
              </div>
              <button 
                onClick={() => onLoadMatrix({ a: 1, b: 0, c: 0, d: -1 }, "Symétrie X")}
                className="mt-3 cursor-pointer w-full text-center text-xs py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3 h-3" /> Charger dans le Lab
              </button>
            </div>

            {/* Symétrie d'axe y = x */}
            <div className="bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-4 transition shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>Inversion d'axe $y=x$</span>
                  <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md">Permutation</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {"Échange les axes $x$ et $y$ : le vecteur $\\begin{pmatrix}x\\\\y\\end{pmatrix}$ devient $\\begin{pmatrix}y\\\\x\\end{pmatrix}$."}
                </p>
                <MathText className="my-3 text-sm font-semibold">
                  {"$$Ref = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$"}
                </MathText>
                <p className="text-xs text-slate-600">
                  Exemple géométrique d'inversion d'axes :
                </p>
                <MathText className="font-mono text-xs my-1 text-slate-700">
                  {"$$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$"}
                </MathText>
              </div>
              <button 
                onClick={() => onLoadMatrix({ a: 0, b: 1, c: 1, d: 0 }, "Inversion Y=X")}
                className="mt-3 cursor-pointer w-full text-center text-xs py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Zap className="w-3 h-3" /> Charger dans le Lab
              </button>
            </div>

          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "5. Déterminant et Aires",
      icon: <Triangle className="w-4 h-4 text-pink-500" />,
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed">
            Le <strong>déterminant</strong> d'une matrice $2 \times 2$ (noté $\det(M)$) est un scalaire magique qui caractérise l'effet géométrique global de la transformation sur les dimensions de l'espace.
          </p>

          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
             <BookOpen className="w-4 h-4 text-pink-500" /> Théorème de l'Aire des Parallélogrammes
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {"Le <strong>déterminant</strong> (souvent noté $\\det(M)$ ou $|M|$) capture quantitativement l'hégémonie sculpturale d'une transformation linéaire. Son concept primordial dérive directement de l'aire du parallélogramme construit autour des colonnes matricielles transformées."}
          </p>

          <div className="bg-slate-100 hover:bg-slate-200/85 transition duration-200 rounded-xl p-6 border-l-4 border-pink-500 max-w-md mx-auto mt-4">
            <MathText className="text-center text-lg font-semibold">
              {"$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$"}
            </MathText>
          </div>

          <p className="text-slate-600 leading-relaxed mt-5">
            Son influence régulatrice géométrique se divise en trois critères analytiques cardinaux :
          </p>

          <div className="space-y-4 mt-4">
            
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>1. Multiplicateur d'Aire Absolue (Dilatation / Contraction)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {"La valeur absolue du déterminant, numériquement encodé par $|\\det(M)|$, représente formellement le <strong>facteur d'échelle multiplicatif</strong> qui gouvernera l'impact matériel des aires. Concrètement, le calcul des surfaces polygonales suit scrupuleusement la loi de l'homothétie d'aire :"}
              </p>
              <MathText className="text-indigo-700 font-semibold my-2 py-2 text-center bg-indigo-50/50 rounded-lg text-sm">
                {"$$\\text{Aire finale} = |\\det(M)| \\times \\text{Aire initiale}$$"}
              </MathText>
              <p className="text-[11px] text-slate-500 mt-1">
                Le rectangle unitaire engendré par les vecteurs primaires {"$\\vec{i}$"} et {"$\\vec{j}$"} fait originellement aire $= 1$. L'aire de ce même carré projeté donnera fatalement $\det(M)$.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                <span>2. Analyse Polaire : Orientation Chirale (Signe)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Le signe injecté au déterminant indique de la survenue ou non d'un renversement topologique :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="p-3 bg-emerald-50 rounded-lg text-xs">
                  <span className="font-bold text-emerald-800">{"$\\det(M) > 0$ : Isométrie Spatiale."}</span> {"L'aire reste ancrée dans son sens originel de référence trigonométrique, tel que l'angle vectoriel tournant $\\vec{i} \\to \\vec{j}$ reste conventionnel."}
                </div>
                <div className="p-3 bg-pink-50 rounded-lg text-xs">
                  <span className="font-bold text-pink-800">{"$\\det(M) < 0$ : Asymétrie Chirale."}</span> Le volume spatial bascule en image spéculaire (miroir).
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>3. Théorème d'Inversibilité (L'Écrasement Planaire)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {"En Analyse Matricielle, le déterminant s'élève comme gardien du seuil d'inversion :"}</p>
                 <ul className="list-disc ml-5 text-xs text-slate-600 mt-1 space-y-1">
                   <li>{"<strong>Loi de Non-Inversibilité :</strong> Si $\\det(M) = 0$, la matrice d'application projette inévitablement un plan entier sur une entité filaire (ligne) ou infinitésimale (point originel). L'espace s'effondre de dimension."}</li>
                   <li>{"<strong>Loi d'Inversion Régulière :</strong> Le retournement mathématique de l'espace par application $M^{-1}$ n'existe structurellement que pour matrice de déterminant absolu non nul ($\\det(M) \\neq 0$)."}</li>
                 </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cisaillement (Aire préservée)</span>
                <MathText className="text-sm">{"$$M = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$$"}</MathText>
                <p className="text-xs text-slate-600 mt-2 font-mono bg-white p-1 rounded border border-slate-100 text-center">{"det = 1(1) - 2(0) = 1"}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Homothétie (Aire x4)</span>
                <MathText className="text-sm">{"$$M = \\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}$$"}</MathText>
                <p className="text-xs text-slate-600 mt-2 font-mono bg-white p-1 rounded border border-slate-100 text-center">{"det = 2(2) - 0(0) = 4"}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Projection (Aire annihilée)</span>
                <MathText className="text-sm">{"$$M = \\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$$"}</MathText>
                <p className="text-xs text-slate-600 mt-2 font-mono bg-white p-1 rounded border border-slate-100 text-center text-red-600 font-bold">{"det = 1(1) - 1(1) = 0"}</p>
              </div>
            </div>

          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "6. Composition et Matrice Inverse",
      icon: <Layers className="w-4 h-4 text-purple-500" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">La Composition Matricielle (Produit)</h3>
          <p className="text-slate-600 leading-relaxed mt-2">
            En algèbre linéaire, appliquer une transformation $A$ suivie d'une transformation $B$ ("$B$ rond $A$") revient exactement à multiplier leurs matrices : $B \\times A$.
          </p>
          <div className="bg-purple-50/50 rounded-xl p-6 border border-purple-100 mt-4 text-sm text-slate-700">
            <MathText className="font-semibold text-center mb-3">
              {"$$ (B \\circ A)(\\vec{u}) = B(A\\vec{u}) = (BA)\\vec{u} $$"}
            </MathText>
            <p><strong>Note cruciale :</strong> Le produit matriciel n'est pas commutatif. $AB \\neq BA$ en général. L'ordre des opérations (de droite à gauche) est fondamental : on applique $A$ d'abord, puis $B$.</p>
          </div>
          
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mt-6">La Matrice Inverse : Remonter le temps</h3>
          <p className="text-slate-600 leading-relaxed mt-2">
            Si une transformation $M$ ne détruit pas de dimension (c'est-à-dire si $\\det(M) \\neq 0$), il existe une transformation inverse, notée $M^{-1}$, qui "défait" exactement ce que $M$ a fait, ramenant l'espace à l'Identité.
          </p>

          <div className="bg-slate-100 hover:bg-slate-200/85 transition duration-200 rounded-xl p-6 border-l-4 border-purple-500 max-w-md mx-auto mt-4">
            <MathText className="text-center text-md font-semibold">
              {"$$M = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\implies M^{-1} = \\frac{1}{ad-bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$"}
            </MathText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
               <h4 className="font-semibold text-slate-800">Exemple Trivial (Orthogonal)</h4>
               <p className="text-xs text-slate-600 mt-1 mb-2">L'inverse d'une rotation de $+90^\\circ$ est une rotation de $-90^\\circ$.</p>
               <MathText className="text-sm">
                 {"$$R_{90} = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$$"}
               </MathText>
               <MathText className="text-sm mt-2">
                 {"$$R_{90}^{-1} = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$$"}
               </MathText>
               <p className="text-[10px] text-slate-400 mt-2">Remarquez que pour une rotation pure, la matrice inverse est égale à sa transposée (les $b$ et $c$ s'échangent).</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
               <h4 className="font-semibold text-slate-800">Exemple Moins Trivial</h4>
               <p className="text-xs text-slate-600 mt-1 mb-2">{"Inversons un cisaillement combiné : $M = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$."}</p>
               <MathText className="text-xs">
                 {"$\\det(M) = (2)(1) - (1)(1) = 1$"}
               </MathText>
               <MathText className="text-sm mt-2">
                 {"$$M^{-1} = \\frac{1}{1} \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$$"}
               </MathText>
               <p className="text-[10px] text-slate-400 mt-2">{"Vous pouvez vérifier mathématiquement que multiplier $M$ par $M^{-1}$ redonne toujours la Matrice Identité $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$."}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "7. Valeurs et Vecteurs Propres",
      icon: <Zap className="w-4 h-4 text-yellow-500" />,
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed">
            Dans le chaos d'une transformation linéaire quelconque, certains vecteurs exceptionnels ne sont jamais déviés de leur axe. Ils subissent uniquement un étirement (ou une contraction, voire un renversement) mais <strong>aucune rotation</strong>.
          </p>

          <div className="bg-yellow-50/50 rounded-xl p-6 border border-yellow-200 mt-4">
             <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-3">Définition Algébrique Fondamentale</h3>
             <MathText className="text-center text-lg font-semibold text-slate-800">
               {"$$ M \\vec{v} = \\lambda \\vec{v} $$"}
             </MathText>
             <p className="text-sm text-slate-700 mt-3 text-center">
               {"Où $\\vec{v}$ (non nul) est un <strong>vecteur propre</strong>, et $\\lambda$ est le scalaire associé appelé <strong>valeur propre</strong>."}
             </p>
          </div>

          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mt-6">Concepts Associés</h3>
          <ul className="list-none space-y-3 mt-4">
             <li className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-xs">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-slate-500">1</div>
               <div>
                 <strong className="text-slate-800 block text-sm">Le Polynôme Caractéristique</strong>
                 <span className="text-xs text-slate-600 block mt-1">{"Pour trouver les valeurs propres $\\lambda$, on résout l'équation de l'effondrement : $\\det(M - \\lambda I) = 0$. Cela donne un polynôme de degré 2."}</span>
                 <MathText className="text-xs text-slate-500 mt-2">{"$\\lambda^2 - \\text{Tr}(M)\\lambda + \\det(M) = 0$"}</MathText>
               </div>
             </li>
             <li className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-xs">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-slate-500">2</div>
               <div>
                 <strong className="text-slate-800 block text-sm">Espaces Propres (Sous-Espaces Isolés)</strong>
                 <span className="text-xs text-slate-600 block mt-1">{"L'ensemble de tous les vecteurs propres associés à un même $\\lambda$ forme une droite vectorielle. C'est un squelette invariant du plan de coordonnées."}</span>
               </div>
             </li>
             <li className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-xs">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-slate-500">3</div>
               <div>
                 <strong className="text-slate-800 block text-sm">Matrice Diagonale & Diagonalisation</strong>
                 <span className="text-xs text-slate-600 block mt-1">{"Si une matrice peut se résumer à deux axes propres indépendants, elle peut être ré-exprimée sous la forme spectaculaire $M = PDP^{-1}$ (où $D$ est diagonale)."}</span>
               </div>
             </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden h-full flex flex-col">
      {/* Upper header - Unified Premium System */}
      <div className="bg-linear-to-r from-emerald-50 to-teal-50/20 border-b border-slate-200/80 p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-800">Théorie de l'Algèbre Linéaire en 2D</h2>
        </div>
        <p className="text-slate-500 text-xs mt-1">
          Explorez les définitions fondamentales et visualisez l'impact des matrices réelles sur la géométrie du plan.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left selector menu */}
        <div className="w-full lg:w-64 border-r border-slate-200 bg-slate-50/50 p-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
            Sujets de cours
          </div>
          {chapters.map((chap) => (
            <button
              key={chap.id}
              onClick={() => setActiveTab(chap.id)}
              className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold font-sans transition-all ${
                activeTab === chap.id
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200/80 pl-4"
                  : "text-slate-600 hover:bg-slate-200/50 border border-transparent"
              }`}
            >
              {chap.icon}
              <span className="truncate">{chap.title}</span>
            </button>
          ))}
        </div>

        {/* Right content view */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[600px] lg:max-h-none">
          <MathText>
            {chapters[activeTab].content}
          </MathText>
        </div>
      </div>
    </div>
  );
}
