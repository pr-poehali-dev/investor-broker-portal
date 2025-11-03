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
  const [channels, setChannels] = useState([
    { id: 'channel', name: 'Мой Telegram канал', type: 'channel' as const, url: '', connected: false },
    { id: 'group', name: 'Моя Telegram группа', type: 'group' as const, url: '', connected: false }
  ]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [isEditingChannel, setIsEditingChannel] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  
  const propertyUrl = `${window.location.origin}/property/${property.id}`;
  const utmUrl = includeUtm 
    ? buildUtmUrl(propertyUrl, 'telegram', 'social', 'property_share', brokerId)
    : propertyUrl;

  const toggleChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel?.connected) return;
    
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleEditChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setIsEditingChannel(channelId);
      setEditName(channel.name);
      setEditUrl(channel.url);
    }
  };

  const handleSaveChannel = () => {
    if (!isEditingChannel) return;
    
    setChannels(prev => prev.map(c => 
      c.id === isEditingChannel 
        ? { ...c, name: editName, url: editUrl, connected: editUrl.trim() !== '' }
        : c
    ));
    
    setIsEditingChannel(null);
    setEditName('');
    setEditUrl('');
  };

  const handlePublish = () => {
    const selectedChannelsData = channels.filter(c => selectedChannels.includes(c.id));
    const fullMessage = `${message}\n\n🔗 ${utmUrl}${customText ? `\n\n${customText}` : ''}`;
    
    selectedChannelsData.forEach(channel => {
      if (channel.url) {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(utmUrl)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
      }
    });
    
    console.log('Publishing to channels:', selectedChannels);
    console.log('Message:', fullMessage);
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
          <CardTitle>Мои социальные сети</CardTitle>
          <CardDescription>Настройте ваши Telegram канал и группу</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {channels.map(channel => (
              <div key={channel.id} className="border rounded-lg p-4">
                {isEditingChannel === channel.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Название {channel.type === 'channel' ? 'канала' : 'группы'}</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Название"
                      />
                    </div>
                    <div>
                      <Label>Ссылка на {channel.type === 'channel' ? 'канал' : 'группу'}</Label>
                      <Input
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="https://t.me/your_channel"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveChannel} size="sm" className="flex-1">
                        <Icon name="Check" size={14} className="mr-1" />
                        Сохранить
                      </Button>
                      <Button 
                        onClick={() => setIsEditingChannel(null)} 
                        variant="outline" 
                        size="sm"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                            selectedChannels.includes(channel.id)
                              ? 'border-primary bg-primary'
                              : 'border-gray-300'
                          } ${!channel.connected ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => toggleChannel(channel.id)}
                        >
                          {selectedChannels.includes(channel.id) && (
                            <Icon name="Check" size={14} className="text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{channel.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {channel.type === 'channel' ? 'Telegram канал' : 'Telegram группа'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {channel.connected ? (
                          <Badge className="bg-green-500">Подключен</Badge>
                        ) : (
                          <Badge variant="secondary">Не настроен</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditChannel(channel.id)}
                        >
                          <Icon name="Settings" size={14} />
                        </Button>
                      </div>
                    </div>
                    {channel.url && (
                      <p className="text-xs text-muted-foreground ml-8 truncate">{channel.url}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={handlePublish}
          disabled={selectedChannels.length === 0}
          className="flex-1 gap-2"
        >
          <Icon name="Send" size={18} />
          {selectedChannels.length === 0 
            ? 'Выберите канал или группу' 
            : `Поделиться в ${selectedChannels.length === 1 ? 'выбранной сети' : 'выбранных сетях'}`
          }
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
              <p className="font-semibold mb-1">Как это работает?</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Настройте ссылки на ваш Telegram канал и/или группу</li>
                <li>Выберите где хотите поделиться объявлением</li>
                <li>Нажмите "Поделиться" — откроется Telegram с готовым текстом</li>
                <li>Опубликуйте сообщение в выбранном канале/группе</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramPublisher;