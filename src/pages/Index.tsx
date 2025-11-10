import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { CommunityPools } from '@/components/community/CommunityPools';
import { Marketplace } from '@/components/marketplace/Marketplace';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'community':
        return <CommunityPools />;
      case 'marketplace':
        return <Marketplace />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default Index;