import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import type { Investor, InvestorStage, InvestmentStrategy, RiskLevel, PropertyType } from '@/types/investment';

interface InvestorFunnelProps {
  brokerId: string;
}

const InvestorFunnel = ({ brokerId }: InvestorFunnelProps) => {
  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: '1',
      brokerId,
      personalInfo: {
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67'
      },
      stage: 'active',
      investmentProfile: {
        budget: 2000000,
        strategies: ['rental', 'resale'],
        riskTolerance: 'medium',
        preferredPropertyTypes: ['apartment', 'commercial'],
        preferredLocations: ['Москва', 'Санкт-Петербург']
      },
      portfolio: {
        totalInvested: 1500000,
        activeInvestments: 3,
        totalReturn: 180000,
        properties: []
      },
      interaction: {
        source: 'telegram',
        utmParams: {
          source: 'telegram',
          medium: 'social',
          campaign: 'spring2024'
        },
        notes: 'Заинтересован в коммерческой недвижимости'
      },
      timeline: [
        {
          date: new Date('2024-01-15'),
          action: 'Регистрация',
          details: 'Пришёл через Telegram канал'
        },
        {
          date: new Date('2024-01-20'),
          action: 'Консультация',
          details: 'Обсудили инвестиционные цели'
        }
      ],
      metadata: {
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      }
    }
  ]);

  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInvestor, setNewInvestor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    budget: '',
    source: ''
  });

  const stageLabels: Record<InvestorStage, string> = {
    lead: 'Лид',
    consultation: 'Консультация',
    analysis: 'Анализ',
    offer_sent: 'Отправлено предложение',
    negotiation: 'Переговоры',
    deal_preparation: 'Подготовка сделки',
    active: 'Активный',
    inactive: 'Неактивный'
  };

  const stageColors: Record<InvestorStage, string> = {
    lead: 'bg-gray-500',
    consultation: 'bg-blue-500',
    analysis: 'bg-purple-500',
    offer_sent: 'bg-yellow-500',
    negotiation: 'bg-orange-500',
    deal_preparation: 'bg-green-400',
    active: 'bg-green-600',
    inactive: 'bg-gray-400'
  };

  const groupedByStage = investors.reduce((acc, inv) => {
    if (!acc[inv.stage]) acc[inv.stage] = [];
    acc[inv.stage].push(inv);
    return acc;
  }, {} as Record<InvestorStage, Investor[]>);

  const handleAddInvestor = () => {
    const investor: Investor = {
      id: Date.now().toString(),
      brokerId,
      personalInfo: {
        firstName: newInvestor.firstName,
        lastName: newInvestor.lastName,
        email: newInvestor.email,
        phone: newInvestor.phone
      },
      stage: 'lead',
      investmentProfile: {
        budget: parseInt(newInvestor.budget),
        strategies: [],
        riskTolerance: 'medium',
        preferredPropertyTypes: [],
        preferredLocations: []
      },
      portfolio: {
        totalInvested: 0,
        activeInvestments: 0,
        totalReturn: 0,
        properties: []
      },
      interaction: {
        source: newInvestor.source,
        notes: ''
      },
      timeline: [
        {
          date: new Date(),
          action: 'Регистрация',
          details: `Добавлен вручную, источник: ${newInvestor.source}`
        }
      ],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    setInvestors([...investors, investor]);
    setShowAddModal(false);
    setNewInvestor({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      budget: '',
      source: ''
    });
  };

  const moveToStage = (investorId: string, newStage: InvestorStage) => {
    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        return {
          ...inv,
          stage: newStage,
          timeline: [
            ...inv.timeline,
            {
              date: new Date(),
              action: 'Смена этапа',
              details: `Переведён на этап: ${stageLabels[newStage]}`
            }
          ],
          metadata: {
            ...inv.metadata,
            updatedAt: new Date()
          }
        };
      }
      return inv;
    }));
  };

  const addNote = (investorId: string, note: string) => {
    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        return {
          ...inv,
          interaction: {
            ...inv.interaction,
            notes: note
          },
          timeline: [
            ...inv.timeline,
            {
              date: new Date(),
              action: 'Добавлена заметка',
              details: note
            }
          ],
          metadata: {
            ...inv.metadata,
            updatedAt: new Date()
          }
        };
      }
      return inv;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Воронка инвесторов</h2>
          <p className="text-muted-foreground">Управление клиентами по этапам сделки</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="UserPlus" size={18} />
              Добавить инвестора
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый инвестор</DialogTitle>
              <DialogDescription>Добавьте информацию о потенциальном клиенте</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input
                    value={newInvestor.firstName}
                    onChange={(e) => setNewInvestor({ ...newInvestor, firstName: e.target.value })}
                    placeholder="Иван"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Фамилия</Label>
                  <Input
                    value={newInvestor.lastName}
                    onChange={(e) => setNewInvestor({ ...newInvestor, lastName: e.target.value })}
                    placeholder="Петров"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newInvestor.email}
                  onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })}
                  placeholder="ivan@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input
                  value={newInvestor.phone}
                  onChange={(e) => setNewInvestor({ ...newInvestor, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="space-y-2">
                <Label>Бюджет (₽)</Label>
                <Input
                  type="number"
                  value={newInvestor.budget}
                  onChange={(e) => setNewInvestor({ ...newInvestor, budget: e.target.value })}
                  placeholder="1000000"
                />
              </div>
              <div className="space-y-2">
                <Label>Источник</Label>
                <Input
                  value={newInvestor.source}
                  onChange={(e) => setNewInvestor({ ...newInvestor, source: e.target.value })}
                  placeholder="Telegram, Instagram, Сайт..."
                />
              </div>
              <Button onClick={handleAddInvestor} className="w-full">
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {(['lead', 'consultation', 'analysis', 'offer_sent', 'negotiation', 'deal_preparation', 'active', 'inactive'] as InvestorStage[]).map(stage => (
          <Card key={stage}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={stageColors[stage]}>{stageLabels[stage]}</Badge>
                <span className="text-sm font-semibold">{groupedByStage[stage]?.length || 0}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {groupedByStage[stage]?.map(investor => (
                <div
                  key={investor.id}
                  className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedInvestor(investor)}
                >
                  <p className="font-semibold text-sm">
                    {investor.personalInfo.firstName} {investor.personalInfo.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ₽{(investor.investmentProfile.budget / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {investor.interaction.source}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={selectedInvestor !== null} onOpenChange={() => setSelectedInvestor(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedInvestor?.personalInfo.firstName} {selectedInvestor?.personalInfo.lastName}
            </DialogTitle>
            <DialogDescription>Полная информация об инвесторе</DialogDescription>
          </DialogHeader>
          {selectedInvestor && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm">{selectedInvestor.personalInfo.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <p className="text-sm">{selectedInvestor.personalInfo.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Текущий этап</Label>
                <Select
                  value={selectedInvestor.stage}
                  onValueChange={(value) => moveToStage(selectedInvestor.id, value as InvestorStage)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(stageLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Инвестиционный профиль</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Бюджет</p>
                    <p className="font-semibold">₽{selectedInvestor.investmentProfile.budget.toLocaleString('ru-RU')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Толерантность к риску</p>
                    <p className="font-semibold">
                      {selectedInvestor.investmentProfile.riskTolerance === 'low' ? 'Низкая' :
                       selectedInvestor.investmentProfile.riskTolerance === 'medium' ? 'Средняя' : 'Высокая'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Активных инвестиций</p>
                    <p className="font-semibold">{selectedInvestor.portfolio.activeInvestments}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Всего инвестировано</p>
                    <p className="font-semibold">₽{selectedInvestor.portfolio.totalInvested.toLocaleString('ru-RU')}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Источник и UTM</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Источник</p>
                    <p className="font-semibold">{selectedInvestor.interaction.source}</p>
                  </div>
                  {selectedInvestor.interaction.utmParams && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground text-xs">UTM Source</p>
                        <p className="text-xs font-mono">{selectedInvestor.interaction.utmParams.source}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">UTM Campaign</p>
                        <p className="text-xs font-mono">{selectedInvestor.interaction.utmParams.campaign}</p>
                      </div>
                    </div>
                  )}
                  {selectedInvestor.interaction.referralCode && (
                    <div>
                      <p className="text-muted-foreground">Реферальный код</p>
                      <p className="font-mono text-xs">{selectedInvestor.interaction.referralCode}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Заметки</Label>
                <Textarea
                  value={selectedInvestor.interaction.notes}
                  onChange={(e) => addNote(selectedInvestor.id, e.target.value)}
                  placeholder="Добавьте заметки о клиенте..."
                  rows={4}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-3">История взаимодействий</h3>
                <div className="space-y-2">
                  {selectedInvestor.timeline.slice().reverse().map((event, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-3 py-2">
                      <p className="text-sm font-semibold">{event.action}</p>
                      <p className="text-xs text-muted-foreground">{event.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.date.toLocaleDateString('ru-RU')} {event.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Icon name="Mail" size={18} />
                  Написать письмо
                </Button>
                <Button className="flex-1 gap-2" variant="outline">
                  <Icon name="Phone" size={18} />
                  Позвонить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorFunnel;
