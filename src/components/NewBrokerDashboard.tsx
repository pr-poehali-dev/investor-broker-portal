import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvestorFunnel from './InvestorFunnel';
import ReferralSystem from './ReferralSystem';
import PropertyManager from './PropertyManager';

interface NewBrokerDashboardProps {
  userName: string;
  brokerId: string;
}

const NewBrokerDashboard = ({ userName, brokerId }: NewBrokerDashboardProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Кабинет брокера</h2>
        <p className="text-muted-foreground">Добро пожаловать, {userName}!</p>
      </div>

      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">Объекты</TabsTrigger>
          <TabsTrigger value="investors">Инвесторы</TabsTrigger>
          <TabsTrigger value="referral">Реферальная программа</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <PropertyManager brokerId={brokerId} brokerName={userName} />
        </TabsContent>

        <TabsContent value="investors">
          <InvestorFunnel brokerId={brokerId} />
        </TabsContent>

        <TabsContent value="referral">
          <ReferralSystem brokerId={brokerId} brokerName={userName} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewBrokerDashboard;
