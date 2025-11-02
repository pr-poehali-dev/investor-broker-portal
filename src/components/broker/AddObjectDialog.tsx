import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface NewObjectForm {
  title: string;
  location: string;
  type: string;
  minInvestment: string;
  expectedReturn: string;
  term: string;
  risk: string;
  description: string;
}

interface AddObjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newObject: NewObjectForm;
  onNewObjectChange: (object: NewObjectForm) => void;
  onSubmit: () => void;
}

const AddObjectDialog = ({ open, onOpenChange, newObject, onNewObjectChange, onSubmit }: AddObjectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Icon name="Plus" size={18} />
          Добавить объект
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Новый объект недвижимости</DialogTitle>
          <DialogDescription>
            Заполните информацию об инвестиционном объекте
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название объекта</Label>
            <Input
              id="title"
              placeholder="ЖК «Пример»"
              value={newObject.title}
              onChange={(e) => onNewObjectChange({ ...newObject, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Локация</Label>
            <Input
              id="location"
              placeholder="Москва, ЦАО"
              value={newObject.location}
              onChange={(e) => onNewObjectChange({ ...newObject, location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Тип недвижимости</Label>
              <Select value={newObject.type} onValueChange={(v) => onNewObjectChange({ ...newObject, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Жилая</SelectItem>
                  <SelectItem value="commercial">Коммерческая</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="risk">Уровень риска</Label>
              <Select value={newObject.risk} onValueChange={(v) => onNewObjectChange({ ...newObject, risk: v })}>
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
              <Label htmlFor="minInvestment">Минимум (₽)</Label>
              <Input
                id="minInvestment"
                type="number"
                placeholder="500000"
                value={newObject.minInvestment}
                onChange={(e) => onNewObjectChange({ ...newObject, minInvestment: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedReturn">Доходность (%)</Label>
              <Input
                id="expectedReturn"
                type="number"
                placeholder="15"
                value={newObject.expectedReturn}
                onChange={(e) => onNewObjectChange({ ...newObject, expectedReturn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Срок (мес)</Label>
              <Input
                id="term"
                type="number"
                placeholder="24"
                value={newObject.term}
                onChange={(e) => onNewObjectChange({ ...newObject, term: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Опишите преимущества объекта..."
              value={newObject.description}
              onChange={(e) => onNewObjectChange({ ...newObject, description: e.target.value })}
              rows={4}
            />
          </div>
          <Button onClick={onSubmit} className="w-full">
            Добавить объект
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddObjectDialog;
