
import React, { useState } from 'react';

interface MetadataFieldProps {
  label: string;
  value: string;
  isTextarea?: boolean;
}

export const MetadataField: React.FC<MetadataFieldProps> = ({ label, value, isTextarea }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 mb-6 last:mb-0">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <button 
          onClick={handleCopy}
          className={`text-sm flex items-center gap-1 transition-colors ${copied ? 'text-green-600' : 'text-blue-600 hover:text-blue-800'}`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="relative group">
        {isTextarea ? (
          <div className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
            {value}
          </div>
        ) : (
          <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
            {value}
          </div>
        )}
      </div>
      {label === "Description" && (
        <span className={`text-xs self-end ${value.length > 1000 ? 'text-red-500' : 'text-slate-400'}`}>
          {value.length} / 1000 characters
        </span>
      )}
    </div>
  );
};
