import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Investor {
  id: number;
  name: string;
  email: string;
  totalInvested: number;
  activeProjects: number;
  joinedDate: string;
}

interface InvestorCardProps {
  investor: Investor;
  onClick: (investor: Investor) => void;
}

const InvestorCard = ({ investor, onClick }: InvestorCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onClick(investor)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="User" size={24} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{investor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{investor.email}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Инвестировано</p>
            <p className="font-medium text-lg">₽{investor.totalInvested.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Проектов</p>
            <p className="font-medium text-lg">{investor.activeProjects}</p>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Присоединился: {new Date(investor.joinedDate).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={(e) => { e.stopPropagation(); onClick(investor); }}>
          <Icon name="Eye" size={16} />
          Подробнее
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvestorCard;
