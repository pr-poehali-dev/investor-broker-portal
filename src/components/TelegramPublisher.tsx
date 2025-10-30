import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { PropertyObject } from '@/types/investment';
import { formatPropertyForTelegram, buildUtmUrl } from '@/utils/investmentStrategies';

interface TelegramPublisherProps {
  property: PropertyObject;
  brokerId: string;
  onClose: () => void;
}

const TelegramPublisher = ({ property, brokerId, onClose }: TelegramPublisherProps) => {
  const [message, setMessage] = useState(formatPropertyForTelegram(property));
  const [includeUtm, setIncludeUtm] = useState(true);
  const [customText, setCustomText] = useState('');
  const [channels] = useState([
    { id: '1', name: 'Недвижимость Москвы', subscribers: 15420, connected: true },
    { id: '2', name: 'Инвестиции в недвижимость', subscribers: 8900, connected: true },
    { id: '3', name: 'Моя группа', subscribers: 350, connected: false }
  ]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['1']);
  
  const propertyUrl = `${window.location.origin}/property/${property.id}`;
  const utmUrl = includeUtm 
    ? buildUtmUrl(propertyUrl, 'telegram', 'social', 'property_share', brokerId)
    : propertyUrl;

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handlePublish = () => {
    console.log('Publishing to channels:', selectedChannels);
    console.log('Message:', message);
    console.log('URL:', utmUrl);
    onClose();
  };

  const copyMessage = () => {
    const fullMessage = `${message}\n\n🔗 ${utmUrl}${customText ? `\n\n${customText}` : ''}`;
    navigator.clipboard.writeText(fullMessage);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Публикация в Telegram</h2>
        <p className="text-muted-foreground">Поделитесь объектом в своих каналах</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Предпросмотр сообщения</CardTitle>
          <CardDescription>Отредактируйте текст перед публикацией</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Текст объявления</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Дополнительный текст (опционально)</Label>
              <Textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Добавьте призыв к действию или дополнительную информацию..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-semibold text-sm">Добавить UTM-метки</p>
                <p className="text-xs text-muted-foreground">
                  Отслеживайте переходы из Telegram
                </p>
              </div>
              <Switch
                checked={includeUtm}
                onCheckedChange={setIncludeUtm}
              />
            </div>

            <div className="space-y-2">
              <Label>Ссылка на объект</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={utmUrl}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(utmUrl)}
                >
                  <Icon name="Copy" size={16} />
                </Button>
              </div>
            </div>

            <Button onClick={copyMessage} variant="outline" className="w-full gap-2">
              <Icon name="Copy" size={18} />
              Скопировать полное сообщение
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Выберите каналы</CardTitle>
          <CardDescription>Куда опубликовать объявление</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {channels.map(channel => (
              <div
                key={channel.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedChannels.includes(channel.id)
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-gray-400'
                } ${!channel.connected ? 'opacity-50' : ''}`}
                onClick={() => channel.connected && toggleChannel(channel.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedChannels.includes(channel.id)
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedChannels.includes(channel.id) && (
                        <Icon name="Check" size={14} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{channel.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {channel.subscribers.toLocaleString()} подписчиков
                      </p>
                    </div>
                  </div>
                  {!channel.connected && (
                    <Badge variant="secondary">Не подключен</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 gap-2">
            <Icon name="Plus" size={18} />
            Подключить новый канал
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={handlePublish}
          disabled={selectedChannels.length === 0}
          className="flex-1 gap-2"
        >
          <Icon name="Send" size={18} />
          Опубликовать в {selectedChannels.length} {selectedChannels.length === 1 ? 'канале' : 'каналах'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Как подключить Telegram канал?</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Добавьте бота @YourBrokerBot в админы канала</li>
                <li>Отправьте команду /connect в канале</li>
                <li>Канал появится в списке для публикаций</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramPublisher;
