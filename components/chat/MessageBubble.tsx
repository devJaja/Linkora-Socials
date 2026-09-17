import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  type?: 'text' | 'tip';
  tipAmount?: number;
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  type = 'text',
  tipAmount,
}: MessageBubbleProps) {
  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false });
    } catch {
      return '';
    }
  };

  return (
    <View className={`mb-3 flex-row ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <View className={`max-w-[75%] rounded-2xl px-4 py-2 ${
        type === 'tip'
          ? 'bg-success/10'
          : isOwn
          ? 'bg-[#3E1BDB]'
          : 'bg-card'
      }`}>
        {type === 'tip' && tipAmount && (
          <Text className="mb-1 text-xs font-semibold text-success dark:text-success">
            💰 Tip: {tipAmount} XLM
          </Text>
        )}
        <Text className={isOwn ? 'text-white' : 'text-foreground'}>
          {content}
        </Text>
        <Text className={`mt-1 text-xs ${
          isOwn ? 'text-purple-200' : 'text-muted-foreground'
        }`}>
          {formatTime(timestamp)}
        </Text>
      </View>
    </View>
  );
}
