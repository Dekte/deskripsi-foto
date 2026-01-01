
import React, { useState, useCallback } from 'react';
import { Button } from './components/Button';
import { MetadataField } from './components/MetadataField';
import { analyzeStockImage } from './services/geminiService';
import { StockMetadata, AnalysisResult } from './types';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult>({ loading: false });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult({ loading: false }); // Reset results when new image is picked
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMetadata = async () => {
    if (!image) return;

    setResult({ loading: true });
    try {
      const metadata = await analyzeStockImage(image);
      setResult({ metadata, loading: false });
    } catch (error) {
      console.error(error);
      setResult({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to generate metadata. Please try again." 
      });
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">ShutterGen <span className="text-blue-600">AI</span></h1>
          </div>
          <p className="text-sm text-slate-500 hidden md:block">Metadata Generator for Stock Contributors</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Image Upload & Preview */}
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-1">
                {image ? (
                  <div className="relative group aspect-[4/3] bg-slate-900 flex items-center justify-center">
                    <img src={image} alt="Preview" className="max-h-full max-w-full object-contain" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[4/3] cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors border-2 border-dashed border-slate-200 rounded-xl m-1">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">Upload your photo</h3>
                      <p className="text-slate-500 text-sm mt-1">PNG, JPG or JPEG (Max 10MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <Button 
                  className="w-full" 
                  disabled={!image} 
                  isLoading={result.loading}
                  onClick={generateMetadata}
                >
                  Generate Metadata
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h4 className="text-blue-800 font-bold text-sm mb-1">💡 Professional Tip</h4>
              <p className="text-blue-700 text-xs leading-relaxed">
                Gemini AI will analyze visual components like color palette, composition, lighting, and subject matter to create SEO-optimized fields specifically for marketplaces like Shutterstock and Adobe Stock.
              </p>
            </div>
          </section>

          {/* Right Column: Results */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Generated Metadata
            </h2>

            {!image && !result.metadata && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-12 h-12 text-slate-300 mb-3">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-slate-400 font-medium">Upload an image to get started</p>
              </div>
            )}

            {result.loading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-slate-600 font-medium animate-pulse">Analyzing photo structure...</p>
                  <p className="text-slate-400 text-sm mt-1">Generating SEO keywords & description</p>
                </div>
              </div>
            )}

            {result.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center my-8">
                <p className="text-red-600 font-medium mb-2">{result.error}</p>
                <Button variant="outline" onClick={generateMetadata}>Try Again</Button>
              </div>
            )}

            {result.metadata && !result.loading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <MetadataField 
                  label="Title / Caption" 
                  value={result.metadata.title} 
                />
                <MetadataField 
                  label="Description" 
                  value={result.metadata.description} 
                  isTextarea 
                />
                
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Keywords ({result.metadata.keywords.length})</label>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(result.metadata?.keywords.join(', ') || '');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      Copy All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.metadata.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-100">
                  <Button variant="secondary" className="w-full" onClick={() => window.location.reload()}>
                    Reset & Upload New
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 mt-12 text-center text-slate-400 text-sm">
        <p>© 2026 ShutterGen AI. Designed for Stock Photo Contributors.</p>
      </footer>
    </div>
  );
};

export default App;
