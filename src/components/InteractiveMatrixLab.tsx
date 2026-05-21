import React, { useState, useEffect, useRef } from "react";
import { Matrix2D, Vector2D, Line2D, Triangle2D } from "../types";
import { 
  Play, Pause, RotateCcw, Sliders, Layers, Info, 
  ChevronRight, Sparkles, HelpCircle, Eye, EyeOff, Anchor, Trash2, Plus, FlaskConical
} from "lucide-react";
import MathText from "./MathText";

interface InteractiveMatrixLabProps {
  initialMatrix?: Matrix2D;
  onMatrixChange?: (m: Matrix2D) => void;
}

function Tooltip({ content }: { content: string }) {
  return (
    <span className="group relative inline-block cursor-help ml-1.5 align-middle select-none">
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-800 transition-colors" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 hidden group-hover:block bg-slate-900 border border-slate-850 text-slate-100 text-[10px] p-2.5 rounded-lg shadow-xl z-50 leading-relaxed font-sans font-normal normal-case tracking-normal">
        {content}
        <strong className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-slate-900 w-0 h-0 block pointer-events-none"></strong>
      </span>
    </span>
  );
}

export default function InteractiveMatrixLab({ initialMatrix, onMatrixChange }: InteractiveMatrixLabProps) {
  // Matrix coefficients [a b]
  //                     [c d]
  const [matrix, setMatrix] = useState<Matrix2D>(
    initialMatrix || { a: 1.5, b: 0.5, c: -0.5, d: 1.0 }
  );

  // Sync state if initialMatrix prop changes (from course triggers!)
  useEffect(() => {
    if (initialMatrix) {
      setMatrix(initialMatrix);
    }
  }, [initialMatrix]);

  // Animation Interpolation factor t (0: Original space, 1: Transform completed)
  const [t, setT] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  // Grid / UI controls
  const [showOriginalGrid, setShowOriginalGrid] = useState<boolean>(true);
  const [showTransformedGrid, setShowTransformedGrid] = useState<boolean>(true);
  const [showBasisVectors, setShowBasisVectors] = useState<boolean>(true);
  const [showTransformedBasis, setShowTransformedBasis] = useState<boolean>(true);
  const [showCoordinatesOnHover, setShowCoordinatesOnHover] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);

  // Interactive Custom Entities
  // Custom Vectors
  const [customVectors, setCustomVectors] = useState<Vector2D[]>([
    { id: "v1", name: "u", color: "#6366f1", x: 2, y: 1, visible: true },
    { id: "v2", name: "v", color: "#ec4899", x: -1, y: 3, visible: true },
  ]);

  // Triangle formed by 3 coordinate vectors
  const [customTriangle, setCustomTriangle] = useState<Triangle2D>({
    v1: { x: 1, y: 1 },
    v2: { x: 3, y: 1 },
    v3: { x: 2, y: 3 },
    color: "#eab308",
    visible: true,
  });

  // Arbitrary Straight Line: specified by two points
  const [customLine, setCustomLine] = useState<Line2D>({
    id: "line1",
    name: "Droite (D)",
    color: "#14b8a6",
    slope: 1,
    intercept: 1,
    point1: { x: -3, y: -2 },
    point2: { x: 3, y: 4 },
    visible: true,
  });

  // Screen settings
  const widthSvg = 550;
  const heightSvg = 550;
  const centerX = widthSvg / 2;
  const centerY = heightSvg / 2;
  const [gridScale, setGridScale] = useState<number>(35); // Pixels per unit (Zoom factor)

  // Tracking what is being dragged on screen
  // "i-trans" | "j-trans" | "vector-[id]" | "triangle-v1" | "triangle-v2" | "triangle-v3" | "line-p1" | "line-p2"
  const [draggingEntity, setDraggingEntity] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Animation Loop effect
  useEffect(() => {
    if (isPlaying) {
      let startTime = performance.now();
      const initialT = t >= 1 ? 0 : t; // loop back to 0 if we hit play at end

      const step = (now: number) => {
        const elapsed = (now - startTime) / 2000; // 2 seconds transition duration
        let nextT = initialT + elapsed;
        if (nextT >= 1.0) {
          nextT = 1.0;
          setIsPlaying(false);
        }
        setT(nextT);
        if (nextT < 1.0) {
          animationFrameId.current = requestAnimationFrame(step);
        }
      };

      animationFrameId.current = requestAnimationFrame(step);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (t >= 1.0) {
      setT(0.0);
    }
    setIsPlaying(!isPlaying);
  };

  // Helper computations
  // Determinant: ad - bc
  const det = matrix.a * matrix.d - matrix.b * matrix.c;

  // Transform coordinates vector Mv with current interpolation t
  // (1-t)*v + t*M*v
  const getTransformedCoordinates = (x: number, y: number) => {
    const rx = matrix.a * x + matrix.b * y;
    const ry = matrix.c * x + matrix.d * y;
    return {
      x: (1 - t) * x + t * rx,
      y: (1 - t) * y + t * ry
    };
  };

  // Helper to map math space to SVG view coordinates
  const mathToSvg = (x: number, y: number) => {
    return {
      cx: centerX + x * gridScale,
      cy: centerY - y * gridScale
    };
  };

  // Helper to map SVG client coords to math spaces
  const svgToMath = (svgX: number, svgY: number) => {
    let mx = (svgX - centerX) / gridScale;
    let my = (centerY - svgY) / gridScale;

    if (snapToGrid) {
      mx = Math.round(mx * 2) / 2; // Snap to nearest 0.5
      my = Math.round(my * 2) / 2;
    } else {
      mx = Math.round(mx * 100) / 100; // Limit decimals
      my = Math.round(my * 100) / 100;
    }
    return { x: mx, y: my };
  };

  // Preset Matrices definitions
  const presets = [
    { name: "Identité", desc: "Conserve l'état original.", matrix: { a: 1, b: 0, c: 0, d: 1 } },
    { name: "Rotation 45°", desc: "Sens inverse des aiguilles d'une montre.", matrix: { a: 0.71, b: -0.71, c: 0.71, d: 0.71 } },
    { name: "Rotation 180°", desc: "Symétrie centrale par rapport à l'origine.", matrix: { a: -1, b: 0, c: 0, d: -1 } },
    { name: "Homothétie Double", desc: "Élargit l'espace par deux.", matrix: { a: 2, b: 0, c: 0, d: 2 } },
    { name: "Compression", desc: "Facteur x=1.5, y=0.3.", matrix: { a: 1.5, b: 0, c: 0, d: 0.3 } },
    { name: "Cisaillement X", desc: "Glissement horizontal.", matrix: { a: 1, b: 1.5, c: 0, d: 1 } },
    { name: "Cisaillement Y", desc: "Glissement vertical.", matrix: { a: 1, b: 0, c: 1.2, d: 1 } },
    { name: "Symétrie Axe X", desc: "Effet miroir vertical.", matrix: { a: 1, b: 0, c: 0, d: -1 } },
    { name: "Projection Axe Y", desc: "Écrase tout horizontalement.", matrix: { a: 0, b: 0, c: 0, d: 1 } },
    { name: "Matrice Singulière", desc: "Écrase le plan sur une droite inclinée (déterminant nul).", matrix: { a: 1, b: 1.5, c: 1, d: 1.5 } },
  ];

  const handleApplyPreset = (m: Matrix2D) => {
    // Smooth reset or jump
    setMatrix(m);
    setT(1.0); // complete representation
    setIsPlaying(false);
    if (onMatrixChange) onMatrixChange(m);
  };

  const handleMatrixInputChange = (field: keyof Matrix2D, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const nextM = { ...matrix, [field]: num };
      setMatrix(nextM);
      if (onMatrixChange) onMatrixChange(nextM);
    }
  };

  // Mouse event handlers for dragging coordinate anchors in SVG
  const handleSvgMouseDown = (e: React.MouseEvent<SVGElement>, entityType: string) => {
    e.preventDefault();
    setDraggingEntity(entityType);
  };

  useEffect(() => {
    if (!draggingEntity) return;

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      
      // Map screen coords into internal coordinates with responsive scaling corrections
      const clientX = (e.clientX - rect.left) * (widthSvg / rect.width);
      const clientY = (e.clientY - rect.top) * (heightSvg / rect.height);
      const mCoord = svgToMath(clientX, clientY);

      if (draggingEntity === "i-trans") {
        if (t > 0.05) {
          const valA = (mCoord.x - (1 - t)) / t;
          const valC = mCoord.y / t;
          const updatedMatrix = { ...matrix, a: parseFloat(valA.toFixed(2)), c: parseFloat(valC.toFixed(2)) };
          setMatrix(updatedMatrix);
          if (onMatrixChange) onMatrixChange(updatedMatrix);
        }
      } else if (draggingEntity === "j-trans") {
        if (t > 0.05) {
          const valB = mCoord.x / t;
          const valD = (mCoord.y - (1 - t)) / t;
          const updatedMatrix = { ...matrix, b: parseFloat(valB.toFixed(2)), d: parseFloat(valD.toFixed(2)) };
          setMatrix(updatedMatrix);
          if (onMatrixChange) onMatrixChange(updatedMatrix);
        }
      } else if (draggingEntity.startsWith("vector-")) {
        const id = draggingEntity.replace("vector-", "");
        setCustomVectors(prev => prev.map(vec => 
          vec.id === id ? { ...vec, x: mCoord.x, y: mCoord.y } : vec
        ));
      } else if (draggingEntity === "triangle-v1") {
        setCustomTriangle(prev => ({ ...prev, v1: mCoord }));
      } else if (draggingEntity === "triangle-v2") {
        setCustomTriangle(prev => ({ ...prev, v2: mCoord }));
      } else if (draggingEntity === "triangle-v3") {
        setCustomTriangle(prev => ({ ...prev, v3: mCoord }));
      } else if (draggingEntity === "line-p1") {
        setCustomLine(prev => ({ ...prev, point1: mCoord }));
      } else if (draggingEntity === "line-p2") {
        setCustomLine(prev => ({ ...prev, point2: mCoord }));
      }
    };

    const handleMouseUpGlobal = () => {
      setDraggingEntity(null);
    };

    window.addEventListener("mousemove", handleMouseMoveGlobal);
    window.addEventListener("mouseup", handleMouseUpGlobal);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, [draggingEntity, matrix, t, onMatrixChange]);

  const handleSvgMouseUpOrLeave = () => {
    setDraggingEntity(null);
  };

  // Calculate triangle area: 0.5 * |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)|
  const getTriangleArea = (tCoords: { v1: { x: number, y: number }, v2: { x: number, y: number }, v3: { x: number, y: number } }) => {
    const { v1, v2, v3 } = tCoords;
    const val = 0.5 * Math.abs(v1.x * (v2.y - v3.y) + v2.x * (v3.y - v1.y) + v3.x * (v1.y - v2.y));
    return parseFloat(val.toFixed(2));
  };

  const currentTriangleTransformed = {
    v1: getTransformedCoordinates(customTriangle.v1.x, customTriangle.v1.y),
    v2: getTransformedCoordinates(customTriangle.v2.x, customTriangle.v2.y),
    v3: getTransformedCoordinates(customTriangle.v3.x, customTriangle.v3.y),
  };

  const originalTriangleArea = getTriangleArea(customTriangle);
  const transformedTriangleArea = getTriangleArea(currentTriangleTransformed);

  // Generate grid math lines from -15 to +15
  const gridLines = [];
  for (let i = -15; i <= 15; i++) {
    gridLines.push(i);
  }

  // Add custom vector helper
  const addCustomVector = () => {
    const freshId = "v" + (customVectors.length + 1);
    const colors = ["#22c55e", "#a855f7", "#f97316", "#eab308"];
    const col = colors[customVectors.length % colors.length];
    setCustomVectors(prev => [
      ...prev,
      {
        id: freshId,
        name: String.fromCharCode(117 + customVectors.length), // u, v, w, x, etc.
        color: col,
        x: Math.round((Math.random() * 4 - 2) * 2) / 2,
        y: Math.round((Math.random() * 4 - 2) * 2) / 2,
        visible: true
      }
    ]);
  };

  const removeVector = (id: string) => {
    setCustomVectors(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upper header - Unified Premium System */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
        <div className="bg-linear-to-r from-purple-50 to-fuchsia-50/20 p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-800">Simulateur Matriciel Interactif</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Manipulez les coefficients à la main ou faites glisser les axes géométriques pour observer l'effet linéaire en temps réel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full items-start">
      
      {/* 1. Control parameters panel */}
      <div className="col-span-1 xl:col-span-4 space-y-6">
        
        {/* Matrix Definition Form Block */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Matrice de Transformation M</span>
              <Tooltip content="La matrice M agit comme un tableau d'opérations sur les coordonnées. Ses colonnes décrivent où atterrissent les axes de base du plan." />
            </h3>
            <button 
              onClick={() => handleApplyPreset({ a: 1, b: 0, c: 0, d: 1 })}
              title="Réinitialiser"
              className="cursor-pointer p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Matrix Math brackets Layout */}
          <div className="flex items-center justify-center gap-6 py-4 bg-slate-50/50 rounded-lg border border-slate-100">
            <div className="text-slate-400 text-3xl font-light font-serif">[</div>
            
            <div className="grid grid-cols-2 gap-3 w-40">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">a₁₁ (a)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={matrix.a}
                  onChange={(e) => handleMatrixInputChange("a", e.target.value)}
                  className="w-full text-center py-2 bg-white rounded border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-400 font-medium text-slate-800" 
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">a₁₂ (b)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={matrix.b}
                  onChange={(e) => handleMatrixInputChange("b", e.target.value)}
                  className="w-full text-center py-2 bg-white rounded border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-400 font-medium text-slate-800" 
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">a₂₁ (c)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={matrix.c}
                  onChange={(e) => handleMatrixInputChange("c", e.target.value)}
                  className="w-full text-center py-2 bg-white rounded border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-400 font-medium text-slate-800" 
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">a₂₂ (d)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={matrix.d}
                  onChange={(e) => handleMatrixInputChange("d", e.target.value)}
                  className="w-full text-center py-2 bg-white rounded border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-slate-400 font-medium text-slate-800" 
                />
              </div>
            </div>

            <div className="text-slate-400 text-3xl font-light font-serif">]</div>

            <div className="flex flex-col text-[10px] text-slate-500 space-y-1.5 border-l border-slate-200 pl-4 font-mono">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span>Col 1 : ({matrix.a.toFixed(1)}, {matrix.c.toFixed(1)})</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>Col 2 : ({matrix.b.toFixed(1)}, {matrix.d.toFixed(1)})</span>
              </span>
            </div>
          </div>

          {/* Precision Slider inputs */}
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <span>Étirement de i (abscisse : a)</span>
                <span className="font-mono text-slate-800 font-bold">{matrix.a}</span>
              </div>
              <input 
                type="range" 
                min="-3" 
                max="3" 
                step="0.1" 
                value={matrix.a}
                onChange={(e) => setMatrix(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <span>Inclinaison de j (abscisse : b)</span>
                <span className="font-mono text-slate-800 font-bold">{matrix.b}</span>
              </div>
              <input 
                type="range" 
                min="-3" 
                max="3" 
                step="0.1" 
                value={matrix.b}
                onChange={(e) => setMatrix(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <span>Inclinaison de i (ordonnée : c)</span>
                <span className="font-mono text-slate-800 font-bold">{matrix.c}</span>
              </div>
              <input 
                type="range" 
                min="-3" 
                max="3" 
                step="0.1" 
                value={matrix.c}
                onChange={(e) => setMatrix(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <span>Étirement de j (vertical : d)</span>
                <span className="font-mono text-slate-800 font-bold">{matrix.d}</span>
              </div>
              <input 
                type="range" 
                min="-3" 
                max="3" 
                step="0.1" 
                value={matrix.d}
                onChange={(e) => setMatrix(prev => ({ ...prev, d: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Real-time Math analysis card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500" /> Analyse Géométrique & Calculs
          </h4>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Determinant */}
            <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-150">
              <span className="block text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-wider flex items-center">
                <span>Déterminant det(M)</span>
                <Tooltip content="Indique le facteur de multiplication des surfaces. S'il est négatif, l'orientation de l'espace est inversée. S'il est nul, le plan s'écrase sur une droite." />
              </span>
              <span className="text-xl font-mono font-light text-slate-900">
                {parseFloat(det.toFixed(3))}
              </span>
              <span className="block text-[9px] text-slate-500 mt-1">
                {det === 0 
                  ? "Plan écrasé (singulier)" 
                  : det < 0 
                    ? "Symétrie (miroir)" 
                    : "Conserve l'orientation direct"}
              </span>
            </div>

            {/* Area Expansion ratio */}
            <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-150">
              <span className="block text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-wider flex items-center">
                <span>Facteur d'Aire</span>
                <Tooltip content="La valeur absolue du déterminant. Elle mesure précisément l'évolution des surfaces (comme le triangle) après déformation." />
              </span>
              <span className="text-xl font-mono font-light text-slate-900">
                {parseFloat(Math.abs(det).toFixed(3))}
              </span>
              <span className="block text-[9px] text-slate-500 mt-1">
                Aires multipliées par {parseFloat(Math.abs(det).toFixed(2))}.
              </span>
            </div>

          </div>

          {customTriangle.visible && (
            <div className="p-3 bg-slate-50/30 rounded-lg border border-slate-100 text-xs flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Surface Triangle</span>
                <span className="text-slate-650">
                  Originale : <strong className="text-slate-900 font-mono font-medium">{originalTriangleArea} ua</strong>
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Transformée</span>
                <span className="text-slate-650">
                  Multipliée : <strong className="text-slate-900 font-mono font-medium">{transformedTriangleArea} ua</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Interactive Layer switches */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Éléments de la Grille</span>
            <Tooltip content="Affichez ou masquez différents calques du graphique 2D pour comparer l'état initial gris et l'état transformé bleu." />
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            
            <button 
              onClick={() => setShowOriginalGrid(!showOriginalGrid)}
              className={`cursor-pointer border px-3 py-2 rounded flex items-center justify-between text-left transition ${
                showOriginalGrid 
                  ? "bg-slate-50 border-slate-350 text-slate-950 font-medium"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <span>Grille originale (Grise)</span>
              {showOriginalGrid ? <Eye className="w-3.5 h-3.5 text-slate-800" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={() => setShowTransformedGrid(!showTransformedGrid)}
              className={`cursor-pointer border px-3 py-2 rounded flex items-center justify-between text-left transition ${
                showTransformedGrid 
                  ? "bg-slate-50 border-slate-350 text-slate-950 font-medium"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <span>Grille Déformée (Bleue)</span>
              {showTransformedGrid ? <Eye className="w-3.5 h-3.5 text-slate-800" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={() => setShowBasisVectors(!showBasisVectors)}
              className={`cursor-pointer border px-3 py-2 rounded flex items-center justify-between text-left transition ${
                showBasisVectors 
                  ? "bg-slate-50 border-slate-350 text-slate-950 font-medium"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <span>Vecteurs de base i, j</span>
              {showBasisVectors ? <Eye className="w-3.5 h-3.5 text-slate-800" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={() => setShowTransformedBasis(!showTransformedBasis)}
              className={`cursor-pointer border px-3 py-2 rounded flex items-center justify-between text-left transition ${
                showTransformedBasis 
                  ? "bg-slate-50 border-slate-350 text-slate-950 font-medium"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <span>Images transp. i', j'</span>
              {showTransformedBasis ? <Eye className="w-3.5 h-3.5 text-slate-800" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={() => setCustomTriangle(prev => ({ ...prev, visible: !prev.visible }))}
              className={`cursor-pointer border px-3 py-2 rounded flex items-center justify-between text-left transition ${
                customTriangle.visible 
                  ? "bg-slate-50 border-slate-350 text-slate-950 font-medium"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <span>Triangle interactif</span>
              {customTriangle.visible ? <Eye className="w-3.5 h-3.5 text-slate-800" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={() => setCustomLine(prev => ({ ...prev, visible: !prev.visible }))}
              className={`cursor-pointer border px-3 py-2 rounded flex items-center justify-between text-left transition ${
                customLine.visible 
                  ? "bg-slate-50 border-slate-350 text-slate-950 font-medium"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <span>Droite (D)</span>
              {customLine.visible ? <Eye className="w-3.5 h-3.5 text-slate-800" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

          </div>

          {/* Quick options */}
          <div className="flex gap-4 text-xs pt-3 border-t border-slate-100 flex-wrap justify-between">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 font-medium">
              <input 
                type="checkbox" 
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                className="rounded-xs text-slate-800 focus:ring-slate-550 border-slate-200" 
              />
              <span>Magnétisme (pas de 0.5)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 font-medium">
              <input 
                type="checkbox" 
                checked={showCoordinatesOnHover}
                onChange={(e) => setShowCoordinatesOnHover(e.target.checked)}
                className="rounded-xs text-slate-800 focus:ring-slate-550 border-slate-200" 
              />
              <span>Coordonnées interactives</span>
            </label>
          </div>
        </div>

        {/* Vector controllers management */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Anchor className="w-3.5 h-3.5 text-slate-500" />
              <span>Vecteurs Libres du Lab</span>
              <Tooltip content="Ajoutez ou supprimez des vecteurs personnalisés sur le graphique 2D, puis visualisez instantanément leur déplacement sous l'action de M." />
            </h3>
            <button 
              onClick={addCustomVector}
              className="cursor-pointer text-[11px] py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded flex items-center gap-1 transition"
            >
              <Plus className="w-3 h-3" /> Ajouter
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Faites glisser librement les pointes étiquetées sur le plan d'affichage. Vous verrez instantanément son image transformée s'ajuster.
          </p>

          <div className="space-y-2">
            {customVectors.map((v) => {
              const trans = getTransformedCoordinates(v.x, v.y);
              return (
                <div key={v.id} className="p-3 bg-slate-50/50 rounded border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }}></span>
                    <span className="font-semibold text-slate-700">Vecteur \(\vec{"{"}{v.name}{"}"}\) :</span>
                    <span className="font-mono bg-white border border-slate-150 px-1 py-0.5 rounded-sm">({v.x.toFixed(1)}, {v.y.toFixed(1)})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-slate-500 text-[11px]">
                      <span>Transf. : </span>
                      <strong className="font-mono text-slate-800">({trans.x.toFixed(1)}, {trans.y.toFixed(1)})</strong>
                    </div>
                    <button 
                      onClick={() => removeVector(v.id)}
                      className="cursor-pointer text-slate-350 hover:text-slate-900 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Interactive SVG visualizer */}
      <div className="col-span-1 xl:col-span-8 space-y-6">
        
        {/* SVG Viewport wrap card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center">
          
          {/* Header instructions */}
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>Démonstrateur Géométrique</span>
                <Tooltip content="Repère de coordonnées orthonormé en temps réel. Saisissez ou glissez directement à la souris pour tester vos équations." />
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Faites glisser directement les têtes des vecteurs et les sommets du triangle pour modifier la matrice.
              </p>
            </div>

            {/* Grid zooms */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setGridScale(Math.max(20, gridScale - 5))}
                className="cursor-pointer w-7 h-7 text-xs bg-slate-100 hover:bg-slate-200 font-bold rounded text-slate-600 flex items-center justify-center transition"
                title="Dézoomer"
              >
                -
              </button>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest px-2 font-mono">Zoom</span>
              <button 
                onClick={() => setGridScale(Math.min(60, gridScale + 5))}
                className="cursor-pointer w-7 h-7 text-xs bg-slate-100 hover:bg-slate-200 font-bold rounded text-slate-600 flex items-center justify-center transition"
                title="Zoomer"
              >
                +
              </button>
            </div>
          </div>

          {/* Morphing slider animation controls */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded p-3 flex items-center gap-3 mb-4 text-xs font-mono">
            <button 
              onClick={togglePlay}
              className={`cursor-pointer px-3 py-1 rounded font-semibold flex items-center gap-1 transition ${
                isPlaying 
                  ? "bg-slate-200 text-slate-800" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? "Pause" : "Animer"}</span>
            </button>
            <Tooltip content="Le paramètre d'interpolation temporelle t permet de visualiser l'espace glissant continûment de la grille initiale (t=0) vers l'espace transformé final (t=1)." />
            
            <div className="flex-1 flex items-center gap-2">
              <span className="text-slate-400 text-[10px] uppercase">R²</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={t}
                onChange={(e) => {
                  setT(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="flex-1 h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-800"
              />
              <span className="text-slate-700 font-bold text-[10px] uppercase">Morph : {Math.round(t*100)}%</span>
            </div>
          </div>

          {/* Actual SVG viewport coordinate system */}
          <div className="relative border border-slate-200 rounded-lg bg-white overflow-hidden w-full max-w-[950px] mx-auto">
            
            {/* Corner status info absolute overlays */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 rounded p-2 text-[10px] border border-slate-200 font-mono flex flex-col space-y-0.5 pointer-events-none select-none">
              <span className="text-slate-400 uppercase tracking-widest font-bold">État de l'Espace :</span>
              {t === 0.0 && <span className="text-slate-500">Base standard (t=0)</span>}
              {t > 0.0 && t < 1.0 && <span className="text-slate-600 font-medium">Transition continue...</span>}
              {t === 1.0 && (
                <span className="text-slate-900 font-bold">
                  {det === 0 ? "Projection (Déterminant nul)" : "Transformation M complète (t=1)"}
                </span>
              )}
            </div>

            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${widthSvg} ${heightSvg}`}
              className="select-none cursor-crosshair bg-transparent w-full h-auto aspect-square block"
              onMouseUp={handleSvgMouseUpOrLeave}
            >
              {/* Definitions for arrow heads etc */}
              <defs>
                {/* Arrow original i (red-gold) */}
                <marker id="arrow-org-i" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ef4444" opacity="0.6" />
                </marker>
                {/* Arrow original j (blue) */}
                <marker id="arrow-org-j" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#3b82f6" opacity="0.6" />
                </marker>
                {/* Arrow transformed i */}
                <marker id="arrow-trans-i" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#dc2626" />
                </marker>
                {/* Arrow transformed j */}
                <marker id="arrow-trans-j" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#2563eb" />
                </marker>
                
                {/* Dynamically colored arrows markers for custom vectors */}
                {customVectors.map(v => (
                  <marker 
                    key={`arrow-marker-${v.id}`}
                    id={`arrow-${v.id}`} 
                    viewBox="0 0 10 10" 
                    refX="6" 
                    refY="5" 
                    markerWidth="5" 
                    markerHeight="5" 
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill={v.color} />
                  </marker>
                ))}
              </defs>

              {/* SECTION I: ORIGINAL BASIS SYSTEM (GRID / AXIS) */}
              {showOriginalGrid && (
                <g opacity="0.8">
                  {/* Vertical lines */}
                  {gridLines.map(line => {
                    const p1 = mathToSvg(line, -15);
                    const p2 = mathToSvg(line, 15);
                    return (
                      <line 
                        key={`org-v-${line}`}
                        x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy} 
                        stroke="#64748b" strokeWidth={line === 0 ? "2.0" : "1.5"} strokeDasharray={line === 0 ? "none" : "4,6"}
                      />
                    );
                  })}
                  {/* Horizontal lines */}
                  {gridLines.map(line => {
                    const p1 = mathToSvg(-15, line);
                    const p2 = mathToSvg(15, line);
                    return (
                      <line 
                        key={`org-h-${line}`}
                        x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy} 
                        stroke="#64748b" strokeWidth={line === 0 ? "2.0" : "1.5"} strokeDasharray={line === 0 ? "none" : "4,6"}
                      />
                    );
                  })}
                </g>
              )}

              {/* Main Axes line references (abscisses and ordonnées) */}
              <line x1={0} y1={centerY} x2={widthSvg} y2={centerY} stroke="#64748b" strokeWidth="2" opacity="0.7" />
              <line x1={centerX} y1={0} x2={centerX} y2={heightSvg} stroke="#64748b" strokeWidth="2" opacity="0.7" />
              <text x={widthSvg - 16} y={centerY - 8} fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">x</text>
              <text x={centerX + 8} y={18} fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">y</text>

              {/* SECTION II: TRANSFORMED SYSTEM GRID (Continuous animation morph) */}
              {showTransformedGrid && (
                <g stroke="#3b82f6">
                  {/* Recompute lines passing from bounds */}
                  {/* Vertical coordinate distortion (Grid lines) */}
                  {gridLines.filter(lineVal => lineVal !== 0).map(lineVal => {
                    const startRaw = { x: lineVal, y: -15 };
                    const endRaw = { x: lineVal, y: 15 };
                    const startT = getTransformedCoordinates(startRaw.x, startRaw.y);
                    const endT = getTransformedCoordinates(endRaw.x, endRaw.y);
                    
                    const p1 = mathToSvg(startT.x, startT.y);
                    const p2 = mathToSvg(endT.x, endT.y);
                    
                    return (
                      <line 
                        key={`trans-v-${lineVal}`}
                        x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy} 
                        strokeWidth="1.5"
                        stroke="#2563eb"
                        opacity="0.25"
                      />
                    );
                  })}

                  {/* Horizontal coordinate distortion (Grid lines) */}
                  {gridLines.filter(lineVal => lineVal !== 0).map(lineVal => {
                    const startRaw = { x: -15, y: lineVal };
                    const endRaw = { x: 15, y: lineVal };
                    const startT = getTransformedCoordinates(startRaw.x, startRaw.y);
                    const endT = getTransformedCoordinates(endRaw.x, endRaw.y);
                    
                    const p1 = mathToSvg(startT.x, startT.y);
                    const p2 = mathToSvg(endT.x, endT.y);
                    
                    return (
                      <line 
                        key={`trans-h-${lineVal}`}
                        x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy} 
                        strokeWidth="1.5"
                        stroke="#2563eb"
                        opacity="0.25"
                      />
                    );
                  })}
                  
                  {/* Images of Main Axes (X' and Y') Drawn on top */}
                  {(() => {
                    // Image of Y axis (x=0) -> mapped to blue like vector j
                    const oyStartT = getTransformedCoordinates(0, -15);
                    const oyEndT = getTransformedCoordinates(0, 15);
                    // Image of X axis (y=0) -> mapped to red like vector i
                    const oxStartT = getTransformedCoordinates(-15, 0);
                    const oxEndT = getTransformedCoordinates(15, 0);
                    
                    const oyP1 = mathToSvg(oyStartT.x, oyStartT.y);
                    const oyP2 = mathToSvg(oyEndT.x, oyEndT.y);
                    const oxP1 = mathToSvg(oxStartT.x, oxStartT.y);
                    const oxP2 = mathToSvg(oxEndT.x, oxEndT.y);
                    
                    return (
                      <>
                        {/* Image of OY (Blue line for basis j) */}
                        <line x1={oyP1.cx} y1={oyP1.cy} x2={oyP2.cx} y2={oyP2.cy} stroke="#1d4ed8" strokeWidth="3" opacity="0.9" />
                        <text x={oyP2.cx + 6} y={oyP2.cy - 6} fill="#1e3a8a" fontSize="13" fontWeight="bold" fontFamily="monospace">y'</text>
                        {/* Image of OX (Red line for basis i) */}
                        <line x1={oxP1.cx} y1={oxP1.cy} x2={oxP2.cx} y2={oxP2.cy} stroke="#b91c1c" strokeWidth="3" opacity="0.9" />
                        <text x={oxP2.cx + 6} y={oxP2.cy - 6} fill="#991b1b" fontSize="13" fontWeight="bold" fontFamily="monospace">x'</text>
                      </>
                    );
                  })()}
                </g>
              )}

              {/* SECTION III: DOUBLE TRIANGLE DISCOVERY */}
              {customTriangle.visible && (
                <>
                  {/* ORIGINAL TRIANGLE */}
                  <polygon 
                    points={`
                      ${mathToSvg(customTriangle.v1.x, customTriangle.v1.y).cx},${mathToSvg(customTriangle.v1.x, customTriangle.v1.y).cy} 
                      ${mathToSvg(customTriangle.v2.x, customTriangle.v2.y).cx},${mathToSvg(customTriangle.v2.x, customTriangle.v2.y).cy} 
                      ${mathToSvg(customTriangle.v3.x, customTriangle.v3.y).cx},${mathToSvg(customTriangle.v3.x, customTriangle.v3.y).cy}
                    `}
                    fill={customTriangle.color}
                    fillOpacity="0.04"
                    stroke={customTriangle.color}
                    strokeWidth="1.5"
                    strokeDasharray="5,5"
                  />
                  
                  {/* TRANSFORMED TRIANGLE */}
                  <polygon 
                    points={`
                      ${mathToSvg(currentTriangleTransformed.v1.x, currentTriangleTransformed.v1.y).cx},${mathToSvg(currentTriangleTransformed.v1.x, currentTriangleTransformed.v1.y).cy} 
                      ${mathToSvg(currentTriangleTransformed.v2.x, currentTriangleTransformed.v2.y).cx},${mathToSvg(currentTriangleTransformed.v2.x, currentTriangleTransformed.v2.y).cy} 
                      ${mathToSvg(currentTriangleTransformed.v3.x, currentTriangleTransformed.v3.y).cx},${mathToSvg(currentTriangleTransformed.v3.x, currentTriangleTransformed.v3.y).cy}
                    `}
                    fill={customTriangle.color}
                    fillOpacity="0.12"
                    stroke={customTriangle.color}
                    strokeWidth="2.5"
                  />
                </>
              )}

              {/* SECTION IV: CUSTOM LINES */}
              {customLine.visible && (
                <>
                  {/* Original line */}
                  <line 
                    x1={mathToSvg(customLine.point1.x * 4, customLine.point1.y * 4).cx}
                    y1={mathToSvg(customLine.point1.x * 4, customLine.point1.y * 4).cy}
                    x2={mathToSvg(customLine.point2.x * 4, customLine.point2.y * 4).cx}
                    y2={mathToSvg(customLine.point2.x * 4, customLine.point2.y * 4).cy}
                    stroke={customLine.color}
                    strokeWidth="1.5"
                    strokeDasharray="5,5"
                    opacity="0.8"
                  />

                  {/* Transformed line endpoints */}
                  {(() => {
                    const tp1 = getTransformedCoordinates(customLine.point1.x * 4, customLine.point1.y * 4);
                    const tp2 = getTransformedCoordinates(customLine.point2.x * 4, customLine.point2.y * 4);
                    const s1 = mathToSvg(tp1.x, tp1.y);
                    const s2 = mathToSvg(tp2.x, tp2.y);
                    return (
                      <line 
                        x1={s1.cx} y1={s1.cy} x2={s2.cx} y2={s2.cy}
                        stroke={customLine.color}
                        strokeWidth="3"
                      />
                    );
                  })()}
                </>
              )}

              {/* SECTION V: ORIGINAL UNIT VECTORS i et j */}
              {showBasisVectors && (
                <>
                  <line 
                    x1={centerX} y1={centerY} 
                    x2={mathToSvg(1, 0).cx} y2={mathToSvg(1, 0).cy} 
                    stroke="#ef4444" strokeWidth="3" opacity="1" strokeDasharray="6,4"
                    markerEnd="url(#arrow-org-i)" 
                  />
                  <line 
                    x1={centerX} y1={centerY} 
                    x2={mathToSvg(0, 1).cx} y2={mathToSvg(0, 1).cy} 
                    stroke="#3b82f6" strokeWidth="3" opacity="1" strokeDasharray="6,4"
                    markerEnd="url(#arrow-org-j)" 
                  />
                </>
              )}

              {/* SECTION VI: TRANSFORMED UNIT BASIS OR COLUMNS OF THE MATRIX */}
              {showTransformedBasis && (
                <>
                  {/* Image i' = (a, c)^T */}
                  {(() => {
                    const headCoords = getTransformedCoordinates(1, 0);
                    const mapped = mathToSvg(headCoords.x, headCoords.y);
                    return (
                      <g>
                        <line 
                          x1={centerX} y1={centerY} 
                          x2={mapped.cx} y2={mapped.cy} 
                          stroke="#dc2626" strokeWidth="4" 
                          markerEnd="url(#arrow-trans-i)" 
                        />
                        {/* Draggable transparent hitbox on i' head */}
                        <circle 
                          cx={mapped.cx} cy={mapped.cy} r="22" 
                          fill="transparent" stroke="transparent"
                          className="cursor-pointer transition-all" 
                          onMouseDown={(e) => handleSvgMouseDown(e, "i-trans")}
                        />
                      </g>
                    );
                  })()}

                  {/* Image j' = (b, d)^T */}
                  {(() => {
                    const headCoords = getTransformedCoordinates(0, 1);
                    const mapped = mathToSvg(headCoords.x, headCoords.y);
                    return (
                      <g>
                        <line 
                          x1={centerX} y1={centerY} 
                          x2={mapped.cx} y2={mapped.cy} 
                          stroke="#2563eb" strokeWidth="4" 
                          markerEnd="url(#arrow-trans-j)" 
                        />
                        {/* Draggable transparent hitbox on j' head */}
                        <circle 
                          cx={mapped.cx} cy={mapped.cy} r="22" 
                          fill="transparent" stroke="transparent"
                          className="cursor-pointer transition-all" 
                          onMouseDown={(e) => handleSvgMouseDown(e, "j-trans")}
                        />
                      </g>
                    );
                  })()}
                </>
              )}

              {/* SECTION VII: CUSTOM FREE VECTORS AND THEIR IMAGES */}
              {customVectors.map(v => {
                if (!v.visible) return null;
                const trans = getTransformedCoordinates(v.x, v.y);
                const sOrig = mathToSvg(v.x, v.y);
                const sTrans = mathToSvg(trans.x, trans.y);
                return (
                  <g key={`group-${v.id}`}>
                    {/* Original interactive vector (dashed) if morph is running */}
                    {t > 0 && (
                      <line 
                        x1={centerX} y1={centerY}
                        x2={sOrig.cx} y2={sOrig.cy}
                        stroke={v.color} strokeWidth="3" strokeDasharray="6,4" opacity="1"
                      />
                    )}

                    {/* Transformed Vector */}
                    <line 
                      x1={centerX} y1={centerY}
                      x2={sTrans.cx} y2={sTrans.cy}
                      stroke={v.color} strokeWidth="3"
                      markerEnd={`url(#arrow-${v.id})`}
                    />

                    {/* Draggable target handles on the original head - completely transparent visual */}
                    <circle 
                      cx={sOrig.cx} cy={sOrig.cy} r="20" 
                      fill="transparent" stroke="transparent"
                      className="cursor-pointer transition duration-150"
                      onMouseDown={(e) => handleSvgMouseDown(e, `vector-${v.id}`)}
                    />
                  </g>
                );
              })}

              {/* SECTION VIII: INTERACTIVE ANCHORS DRAPED ON MATH ELEMENTS */}
              {/* Draggable Anchors for editable Triangle */}
              {customTriangle.visible && (
                <>
                  {["v1", "v2", "v3"].map((vert, index) => {
                    const coords = (customTriangle as any)[vert];
                    const pts = mathToSvg(coords.x, coords.y);
                    return (
                      <g key={`tri-vert-${index}`}>
                        <circle 
                          cx={pts.cx} cy={pts.cy} r="18" 
                          fill="transparent" stroke="transparent"
                          className="cursor-move transition"
                          onMouseDown={(e) => handleSvgMouseDown(e, `triangle-${vert}`)}
                        />
                      </g>
                    );
                  })}
                </>
              )}

              {/* Draggable Anchors for custom Line */}
              {customLine.visible && (
                <>
                  {[
                    { p: customLine.point1, key: "line-p1", label: "P1" },
                    { p: customLine.point2, key: "line-p2", label: "P2" }
                  ].map((elem, idx) => {
                    const pos = mathToSvg(elem.p.x, elem.p.y);
                    return (
                      <g key={`line-pt-${idx}`}>
                        <circle 
                          cx={pos.cx} cy={pos.cy} r="18"
                          fill="transparent" stroke="transparent"
                          className="cursor-move transition"
                          onMouseDown={(e) => handleSvgMouseDown(e, elem.key)}
                        />
                      </g>
                    );
                  })}
                </>
              )}

              {/* Origin Axis Crosshair removed per user requests */}
            </svg>
          </div>

          {/* Légende colorée des objets géométriques */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3.5 mt-4">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400 block mb-2 text-center sm:text-left">
              Légende des objets géométriques
            </span>
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs justify-center sm:justify-start">
              {showTransformedBasis && (
                <>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-3.5 h-1.5 bg-red-600 rounded-xs shrink-0 inline-block"></span>
                    <span className="text-slate-700 flex items-center gap-1">
                      <MathText inline>{"$\\vec{i}'$ :"}</MathText>
                      <span className="text-slate-500 font-mono text-[10px]/none bg-red-50 text-red-700 px-1 py-0.5 rounded border border-red-150">({matrix.a.toFixed(1)}, {matrix.c.toFixed(1)})</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-3.5 h-1.5 bg-blue-600 rounded-xs shrink-0 inline-block"></span>
                    <span className="text-slate-700 flex items-center gap-1">
                      <MathText inline>{"$\\vec{j}'$ :"}</MathText>
                      <span className="text-slate-500 font-mono text-[10px]/none bg-blue-50 text-blue-700 px-1 py-0.5 rounded border border-blue-150">({matrix.b.toFixed(1)}, {matrix.d.toFixed(1)})</span>
                    </span>
                  </div>
                </>
              )}
              {showBasisVectors && (
                <>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-3.5 h-1 border-t-2 border-dashed border-red-400 shrink-0 inline-block"></span>
                    <span className="text-slate-600 flex items-center gap-1">
                      <MathText inline>{"$\\vec{i}$ :"}</MathText>
                      <span className="text-slate-500 font-mono text-[10px]/none bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">(1, 0)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-3.5 h-1 border-t-2 border-dashed border-blue-400 shrink-0 inline-block"></span>
                    <span className="text-slate-600 flex items-center gap-1">
                      <MathText inline>{"$\\vec{j}$ :"}</MathText>
                      <span className="text-slate-500 font-mono text-[10px]/none bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">(0, 1)</span>
                    </span>
                  </div>
                </>
              )}
              {customTriangle.visible && (
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 bg-yellow-500/25 border border-yellow-500/80 rounded-xs shrink-0 inline-block"></span>
                  <span className="text-slate-700 flex items-center gap-1">
                    <MathText inline>{"Triangle $T$ :"}</MathText>
                    <span className="text-slate-500 font-mono text-[10px]/none bg-amber-50 text-amber-700 px-1 py-0.5 rounded border border-amber-150">sommets $T_1, T_2, T_3$</span>
                  </span>
                </div>
              )}
              {customLine.visible && (
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="w-3.5 h-1.5 bg-teal-500 rounded-xs shrink-0 inline-block"></span>
                  <span className="text-slate-700 flex items-center gap-1">
                    <MathText inline>{"Droite $(D)$ :"}</MathText>
                    <span className="text-slate-500 font-mono text-[10px]/none bg-teal-50 text-teal-700 px-1 py-0.5 rounded border border-teal-150">ancrages $P_1, P_2$</span>
                  </span>
                </div>
              )}
              {customVectors.map(v => {
                if (!v.visible) return null;
                const trans = getTransformedCoordinates(v.x, v.y);
                return (
                  <div key={`legend-vector-${v.id}`} className="flex items-center gap-1.5 font-medium">
                    <span className="w-3.5 h-1.5 rounded-xs shrink-0 inline-block" style={{ backgroundColor: v.color }}></span>
                    <span className="text-slate-700 flex items-center gap-1">
                      <MathText inline>{`Vecteur d'étude $${v.name}'$ :`}</MathText>
                      <span className="text-slate-500 font-mono text-[10px]/none px-1 py-0.5 rounded border" style={{ backgroundColor: `${v.color}15`, borderColor: `${v.color}30`, color: v.color }}>({trans.x.toFixed(1)}, {trans.y.toFixed(1)})</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SVG footer coordinate helper */}
          <div className="w-full text-slate-400 text-[10px] text-center mt-3 font-mono">
            Origine (0, 0) au centre de la grille. Zoom : 1 unité = {gridScale}px.
          </div>
        </div>

        {/* 3. Preset Matrices layout (Grid select) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            Bibliothèque de matrices & Transformations types
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sélectionnez une transformation prédéfinie pour observer sa signature géométrique sur tous nos vecteurs et grilles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presets.map((preset) => {
              const isSelected = 
                Math.abs(matrix.a - preset.matrix.a) < 0.05 && 
                Math.abs(matrix.b - preset.matrix.b) < 0.05 && 
                Math.abs(matrix.c - preset.matrix.c) < 0.05 && 
                Math.abs(matrix.d - preset.matrix.d) < 0.05;

              return (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset.matrix)}
                  className={`cursor-pointer text-left p-4 rounded border text-xs transition duration-150 ${
                    isSelected 
                      ? "bg-slate-900 border-slate-900 text-white" 
                      : "bg-slate-50/50 border-slate-200 hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-center font-bold mb-1">
                    <span>{preset.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-sm font-normal text-[10px] ${isSelected ? "bg-slate-800 text-slate-300" : "bg-white border border-slate-150 text-slate-500"}`}>
                      <MathText inline>{`$\\begin{pmatrix} ${preset.matrix.a} & ${preset.matrix.b} \\\\ ${preset.matrix.c} & ${preset.matrix.d} \\end{pmatrix}$`}</MathText>
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed mt-1 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    {preset.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      </div>
    </div>
  );
}
