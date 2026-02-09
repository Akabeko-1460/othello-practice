interface ConceptCardProps {
  title: string;
  children: React.ReactNode;
  importance?: 'high' | 'medium' | 'low';
  number?: number;
}

export default function ConceptCard({ title, children, importance = 'medium', number }: ConceptCardProps) {
  const accentColors = {
    high: 'border-l-red-500 bg-red-500',
    medium: 'border-l-accent bg-accent',
    low: 'border-l-gray-400 bg-gray-400',
  }[importance];

  const [borderColor, badgeBg] = accentColors.split(' ');

  return (
    <div className={`bg-surface rounded-xl border border-border ${borderColor} border-l-[3px] p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        {number !== undefined && (
          <span className={`
            ${badgeBg} text-white w-6 h-6 rounded-md flex items-center justify-center
            text-xs font-bold flex-shrink-0 mt-0.5
          `}>
            {number}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold mb-2 leading-snug">{title}</h3>
          <div className="text-sm text-text-muted space-y-2 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
