import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvestmentObject {
  id: number;
  title: string;
  location: string;
  type: string;
  minInvestment: number;
  expectedReturn: number;
  term: number;
  risk: string;
  progress: number;
  image: string;
  status: 'active' | 'pending' | 'completed';
  description: string;
  totalRaised: number;
  investors: number;
  revenue: number;
  monthlyGrowth: number;
}

interface EditObjectDialogProps {
  object: InvestmentObject | null;
  onClose: () => void;
  onObjectChange: (object: InvestmentObject) => void;
  onSubmit: () => void;
}

const EditObjectDialog = ({ object, onClose, onObjectChange, onSubmit }: EditObjectDialogProps) => {
  if (!object) return null;

  const getRiskValue = (risk: string) => {
    switch (risk) {
      case 'Низкий': return 'low';
      case 'Средний': return 'medium';
      case 'Высокий': return 'high';
      default: return 'medium';
    }
  };

  const getRiskLabel = (value: string) => {
    switch (value) {
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
      default: return 'Средний';
    }
  };

  return (
    <Dialog open={!!object} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать объект</DialogTitle>
          <DialogDescription>
            Измените информацию об инвестиционном объекте
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Название объекта</Label>
            <Input
              id="edit-title"
              value={object.title}
              onChange={(e) => onObjectChange({ ...object, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-location">Локация</Label>
            <Input
              id="edit-location"
              value={object.location}
              onChange={(e) => onObjectChange({ ...object, location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Статус</Label>
              <Select value={object.status} onValueChange={(v: 'active' | 'pending' | 'completed') => onObjectChange({ ...object, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="pending">На модерации</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-risk">Уровень риска</Label>
              <Select 
                value={getRiskValue(object.risk)} 
                onValueChange={(v) => onObjectChange({ ...object, risk: getRiskLabel(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-minInvestment">Минимум (₽)</Label>
              <Input
                id="edit-minInvestment"
                type="number"
                value={object.minInvestment}
                onChange={(e) => onObjectChange({ ...object, minInvestment: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expectedReturn">Доходность (%)</Label>
              <Input
                id="edit-expectedReturn"
                type="number"
                value={object.expectedReturn}
                onChange={(e) => onObjectChange({ ...object, expectedReturn: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-term">Срок (мес)</Label>
              <Input
                id="edit-term"
                type="number"
                value={object.term}
                onChange={(e) => onObjectChange({ ...object, term: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-progress">Прогресс (%)</Label>
              <Input
                id="edit-progress"
                type="number"
                min="0"
                max="100"
                value={object.progress}
                onChange={(e) => onObjectChange({ ...object, progress: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-totalRaised">Собрано (₽)</Label>
              <Input
                id="edit-totalRaised"
                type="number"
                value={object.totalRaised}
                onChange={(e) => onObjectChange({ ...object, totalRaised: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Описание</Label>
            <Textarea
              id="edit-description"
              value={object.description}
              onChange={(e) => onObjectChange({ ...object, description: e.target.value })}
              rows={4}
            />
          </div>
          <Button onClick={onSubmit} className="w-full">
            Сохранить изменения
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditObjectDialog;
