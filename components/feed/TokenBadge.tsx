import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Coins } from 'lucide-react-native';

interface TokenBadgeProps {
  isTokenized?: boolean;
}

export function TokenBadge({ isTokenized }: TokenBadgeProps) {
  if (!isTokenized) return null;

  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-full bg-brand-50 px-2.5 py-1 dark:bg-purple-950">
      <Icon as={Coins} size={13} className="text-brand-600 dark:text-purple-300" />
      <Text className="text-xs font-medium text-brand-600 dark:text-purple-300">Tokenized</Text>
    </View>
  );
}
