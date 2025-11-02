import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface FinanceEntry {
  id: string;
  type: 'income' | 'expense' | 'asset' | 'liability';
  title: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
}

interface PersonalFinancesTabProps {
  userId: string;
}

const PersonalFinancesTab = ({ userId }: PersonalFinancesTabProps) => {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const [newEntry, setNewEntry] = useState<Partial<FinanceEntry>>({
    type: 'income',
    title: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
  });

  useEffect(() => {
    loadEntries();
  }, [userId]);

  const loadEntries = () => {
    try {
      const saved = localStorage.getItem(`finance-${userId}`);
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading finances:', error);
    }
  };

  const saveEntries = (newEntries: FinanceEntry[]) => {
    try {
      localStorage.setItem(`finance-${userId}`, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Error saving finances:', error);
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.amount || !newEntry.category) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const entry: FinanceEntry = {
      id: `entry-${Date.now()}`,
      type: newEntry.type as 'income' | 'expense' | 'asset' | 'liability',
      title: newEntry.title!,
      amount: Number(newEntry.amount),
      date: newEntry.date!,
      category: newEntry.category!,
      description: newEntry.description,
    };

    saveEntries([...entries, entry]);
    setIsAdding(false);
    setNewEntry({
      type: 'income',
      title: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
    });

    toast({
      title: 'Успешно',
      description: 'Запись добавлена',
    });
  };

  const handleDeleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
    toast({
      title: 'Удалено',
      description: 'Запись удалена',
    });
  };

  const calculateTotals = () => {
    const income = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const expenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const assets = entries.filter(e => e.type === 'asset').reduce((sum, e) => sum + e.amount, 0);
    const liabilities = entries.filter(e => e.type === 'liability').reduce((sum, e) => sum + e.amount, 0);
    
    return {
      income,
      expenses,
      assets,
      liabilities,
      netIncome: income - expenses,
      netWorth: assets - liabilities,
    };
  };

  const totals = calculateTotals();

  const typeLabels = {
    income: 'Доход',
    expense: 'Расход',
    asset: 'Актив',
    liability: 'Обязательство',
  };

  const typeIcons = {
    income: 'TrendingUp',
    expense: 'TrendingDown',
    asset: 'Wallet',
    liability: 'CreditCard',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Личные финансы</h3>
          <p className="text-muted-foreground">Управляйте своими доходами и расходами</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить запись
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="TrendingUp" className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Доходы</p>
                <p className="text-2xl font-bold text-green-600">₽{totals.income.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Icon name="TrendingDown" className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Расходы</p>
                <p className="text-2xl font-bold text-red-600">₽{totals.expenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="Wallet" className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Чистый доход</p>
                <p className={`text-2xl font-bold ${totals.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₽{totals.netIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Новая запись</CardTitle>
            <CardDescription>Добавьте информацию о доходе, расходе или активе</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Тип</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })}
                >
                  <option value="income">Доход</option>
                  <option value="expense">Расход</option>
                  <option value="asset">Актив</option>
                  <option value="liability">Обязательство</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Категория</Label>
                <Input
                  placeholder="Зарплата, Продукты, Недвижимость..."
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  placeholder="Описание"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Сумма (₽)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Дата</Label>
                <Input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Комментарий (необязательно)</Label>
                <Input
                  placeholder="Дополнительная информация"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddEntry}>
                Добавить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>История записей</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет записей</p>
              <p className="text-sm">Добавьте первую запись о ваших финансах</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${
                      entry.type === 'income' ? 'bg-green-100' :
                      entry.type === 'expense' ? 'bg-red-100' :
                      entry.type === 'asset' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      <Icon 
                        name={typeIcons[entry.type] as any} 
                        size={20}
                        className={
                          entry.type === 'income' ? 'text-green-600' :
                          entry.type === 'expense' ? 'text-red-600' :
                          entry.type === 'asset' ? 'text-blue-600' : 'text-orange-600'
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{entry.title}</h4>
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                          {typeLabels[entry.type]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground">{entry.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        entry.type === 'income' || entry.type === 'asset' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === 'expense' || entry.type === 'liability' ? '-' : '+'}₽{entry.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="ml-2"
                  >
                    <Icon name="Trash2" size={16} className="text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalFinancesTab;
