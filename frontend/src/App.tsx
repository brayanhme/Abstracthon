import React from 'react';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { CompaniesView } from './components/CompaniesView';
import { CompostView } from './components/CompostView';
import { ReservationsView } from './components/ReservationsView';

export function App() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col justify-between selection:bg-[#FFE1C6] selection:text-[#FF7A00]">
      <Header reservationsCount={0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 flex-1 w-full">
        <ExploreView />
        <CompaniesView />
        <CompostView />
        <ReservationsView />
      </main>

      <footer className="border-t border-[#1E3A8A]/10 bg-[#FFFFFF] py-8 text-center text-xs text-[#526384] mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-[#1E3A8A] text-sm">ReAprovecha</span>
            <span>— Rescate alimentario y economía circular en Cochabamba, Bolivia</span>
          </div>
          <p className="text-[11px] text-[#526384]">
            Paleta Oficial Fresh Citrus (60-30-10) • Frontend Oficial
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
