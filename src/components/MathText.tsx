import { useEffect, useRef, ReactNode } from "react";

interface MathTextProps {
  children: ReactNode;
  className?: string;
  inline?: boolean;
}

export default function MathText({ children, className = "", inline = false }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // MathJax typesetting check
    const mj = (window as any).MathJax;
    if (mj && mj.typesetPromise && containerRef.current) {
      mj.typesetPromise([containerRef.current]).catch((err: any) => {
        console.warn("MathJax rendering error: ", err);
      });
    }
  }, [children]);

  // Generate a key from children to force a complete recreation of the DOM node
  // when content changes. This provides MathJax with a clean slate of raw LaTeX text.
  const contentKey = typeof children === "string" ? children : undefined;

  if (inline) {
    return (
      <span 
        key={contentKey}
        ref={containerRef as any} 
        className={`inline-block mathjax-container ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <div 
      key={contentKey}
      ref={containerRef} 
      className={`mathjax-container ${className}`}
    >
      {children}
    </div>
  );
}
