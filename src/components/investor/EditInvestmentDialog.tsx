import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import type { UserInvestment } from '@/types/investment';

interface EditInvestmentDialogProps {
  investment: UserInvestment | null;
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: (investmentId: string, amount: number) => void;
  onWithdrawFunds: (investmentId: string, amount: number) => void;
}

const EditInvestmentDialog = ({ 
  investment, 
  isOpen, 
  onClose, 
  onAddFunds, 
  onWithdrawFunds 
}: EditInvestmentDialogProps) => {
  const [actionType, setActionType] = useState<'add' | 'withdraw' | null>(null);
  const [actionAmount, setActionAmount] = useState('');

  const handleSubmit = () => {
    if (!investment || !actionAmount) return;
    const amount = parseFloat(actionAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (actionType === 'add') {
      onAddFunds(investment.id, amount);
    } else if (actionType === 'withdraw') {
      onWithdrawFunds(investment.id, amount);
    }

    setActionAmount('');
    setActionType(null);
    onClose();
  };

  const resetAndClose = () => {
    setActionAmount('');
    setActionType(null);
    onClose();
  };

  if (!investment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Управление инвестицией</DialogTitle>
          <DialogDescription>
            Текущая сумма: ₽{investment.amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {!actionType ? (
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => setActionType('add')}
            >
              <Icon name="Plus" className="w-4 h-4 mr-2" />
              Увеличить инвестицию
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setActionType('withdraw')}
            >
              <Icon name="Minus" className="w-4 h-4 mr-2" />
              Вывести средства
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {actionType === 'add' ? 'Сумма для добавления' : 'Сумма для вывода'}
              </Label>
              <Input
                type="number"
                placeholder="Введите сумму"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleSubmit}
              >
                Подтвердить
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setActionType(null);
                  setActionAmount('');
                }}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditInvestmentDialog;
