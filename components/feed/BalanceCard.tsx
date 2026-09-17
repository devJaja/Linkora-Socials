import { View, TouchableOpacity, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Eye, EyeOff, Copy, RefreshCw, Bell, ArrowUpRight, ArrowDownLeft, Circle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Badge } from '@/components/common/Badge';
import { useTranslation } from 'react-i18next';

interface BalanceCardProps {
  balance: number;
  walletAddress: string;
  isLoading: boolean;
  showBalance: boolean;
  unreadCount: number;
  onToggleBalance: () => void;
  onCopyAddress: () => void;
  onRefresh: () => void;
}

export function BalanceCard({
  balance,
  walletAddress,
  isLoading,
  showBalance,
  unreadCount,
  onToggleBalance,
  onCopyAddress,
  onRefresh,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isSmall = width < 375;

  return (
    <View className="overflow-hidden rounded-b-[28px] bg-[#3E1BDB]">
      {/* Decorative brand shapes */}
      <View className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#2B1292]/40" />
      <View className="absolute right-24 -top-6 h-24 w-24 rounded-full bg-purple-400/25" />
      <View className="absolute -bottom-14 -left-12 h-40 w-40 rounded-full bg-[#160A46]/40" />
      <View className="absolute bottom-8 right-8 h-3 w-3 rounded-full bg-gold" />

      <View className="px-5 pb-6 pt-5">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple-300">
                {t('wallet.totalBalance')}
              </Text>
              <TouchableOpacity onPress={onToggleBalance} className="rounded-full p-1">
                <Icon as={showBalance ? Eye : EyeOff} size={14} className="text-purple-300" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color="#ffffff" className="mt-3" />
            ) : (
              <View className="mt-2 flex-row items-baseline gap-2">
                <Text className={`${isSmall ? 'text-3xl' : 'text-[40px]'} font-bold leading-[48px] text-white`}>
                  {showBalance ? balance.toFixed(2) : '••••••'}
                </Text>
                <Text className="text-lg font-semibold text-purple-300">XLM</Text>
              </View>
            )}

            <Pressable onPress={onCopyAddress} className="mt-3 flex-row items-center gap-2 self-start rounded-lg bg-white/10 px-3 py-1.5">
              <Text className="font-mono text-xs text-purple-200">
                {walletAddress?.slice(0, 8)}…{walletAddress?.slice(-6)}
              </Text>
              <Icon as={Copy} size={13} className="text-purple-300" />
            </Pressable>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onRefresh}
              disabled={isLoading}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            >
              <Icon as={RefreshCw} size={17} className="text-white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/notifications')}
              className="relative h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            >
              <Icon as={Bell} size={17} className="text-white" />
              {unreadCount > 0 && (
                <View className="absolute -right-1 -top-1">
                  <Badge count={unreadCount} variant="danger" size="sm" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-6 flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push('/wallet/send')}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-white py-3.5 active:opacity-90"
          >
            <Icon as={ArrowUpRight} size={18} className="text-[#3E1BDB]" />
            <Text className="font-semibold text-[#3E1BDB]">{t('common.send')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/wallet/receive')}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 py-3.5 active:bg-white/20"
          >
            <Icon as={ArrowDownLeft} size={18} className="text-white" />
            <Text className="font-semibold text-white">{t('common.receive')}</Text>
          </TouchableOpacity>
        </View>

        {/* Network Badge */}
        <View className="mt-5 flex-row items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1.5">
          <Icon as={Circle} size={8} className="text-[#30A46C]" fill="#30A46C" />
          <Text className="text-xs font-medium text-white">{t('wallet.stellarTestnet')}</Text>
        </View>
      </View>
    </View>
  );
}