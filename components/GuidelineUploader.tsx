
import React, { useState } from 'react';
import { FileText, ClipboardList, X } from 'lucide-react';

interface Props {
  onUpdate: (guidelines: string) => void;
}

const GuidelineUploader: React.FC<Props> = ({ onUpdate }) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    onUpdate(val);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Safety Guidelines</h3>
        </div>
        {!isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            + Add Guidelines
          </button>
        ) : (
          <button 
            onClick={() => setIsExpanded(false)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <textarea
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600 resize-none"
              placeholder="Paste site-specific safety guidelines, compliance requirements, or special instructions here..."
              value={text}
              onChange={handleTextChange}
            />
            <div className="absolute right-3 bottom-3 opacity-20">
              <ClipboardList className="w-8 h-8" />
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-500 italic">
            Note: Gemini will incorporate these instructions into the visual safety analysis.
          </p>
        </div>
      )}
      
      {!isExpanded && !text && (
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center">
          <p className="text-xs text-slate-500">No custom guidelines provided. Using standard industry protocols.</p>
        </div>
      )}
    </div>
  );
};

export default GuidelineUploader;
