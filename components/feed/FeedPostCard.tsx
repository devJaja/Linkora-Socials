import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Heart, MessageCircle, DollarSign, Coins, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';
import { useTranslation } from 'react-i18next';

interface FeedPostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onTip: (post: Post) => void;
  onBuyToken: (post: Post) => void;
  onNavigateToProfile: (username: string) => void;
}

export function FeedPostCard({
  post,
  onLike,
  onTip,
  onBuyToken,
  onNavigateToProfile,
}: FeedPostCardProps) {
  const { t } = useTranslation();

  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false }).replace('about ', '');
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/post/${post.id}`)}
      className="mx-4 mb-4 rounded-[24px] border border-border bg-card p-4 shadow-sm shadow-black/5"
    >
      <View className="flex-row gap-3">
        <TouchableOpacity onPress={() => onNavigateToProfile(post.author.username)}>
          {post.author.avatar ? (
            <Image source={{ uri: post.author.avatar }} className="h-11 w-11 rounded-full" />
          ) : (
            <View className="h-11 w-11 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-950">
              <Icon as={User} size={22} className="text-brand-600 dark:text-purple-300" />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => onNavigateToProfile(post.author.username)}>
              <Text className="font-semibold">{post.author.name || post.author.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigateToProfile(post.author.username)}>
              <Text className="text-[13px] text-muted-foreground">@{post.author.username}</Text>
            </TouchableOpacity>
            <Text className="text-[13px] text-muted-foreground">· {formatTime(post.createdAt)}</Text>
          </View>

          <Text className="mt-2 text-[15px] leading-relaxed">{post.content}</Text>

          {/* Token Badge */}
          {post.isTokenized && (
            <View className="mt-2.5 flex-row items-center gap-2 self-start rounded-full bg-brand-50 px-3 py-1 dark:bg-purple-950">
              <Icon as={Coins} size={14} className="text-brand-600 dark:text-purple-300" />
              <Text className="text-xs font-medium text-brand-600 dark:text-purple-300">
                {post.tokenSupply} tokens @ {post.tokenPrice} XLM
              </Text>
            </View>
          )}

          {/* Images Grid */}
          {post.images && post.images.length > 0 && (
            <View className={`mt-3 gap-2 ${post.images.length === 1 ? '' : 'flex-row flex-wrap'}`}>
              {post.images.slice(0, 4).map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  className={`rounded-2xl ${
                    post.images.length === 1 ? 'h-64 w-full' : 'h-32 w-[48%]'
                  }`}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View className="mt-3.5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-5">
              <TouchableOpacity
                onPress={() => onLike(post.id, post.isLiked)}
                className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5 ${
                  post.isLiked ? 'bg-red-50 dark:bg-red-950/60' : ''
                }`}
              >
                <Icon
                  as={Heart}
                  size={19}
                  className={post.isLiked ? 'text-red-500' : 'text-muted-foreground'}
                  fill={post.isLiked ? '#E5484D' : 'none'}
                />
                <Text className={`text-sm ${post.isLiked ? 'font-semibold text-red-500' : 'text-muted-foreground'}`}>
                  {post.likesCount}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center gap-1.5">
                <Icon as={MessageCircle} size={19} className="text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">{post.commentsCount}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => onTip(post)}
                className="flex-row items-center gap-1"
              >
                <Icon as={DollarSign} size={19} className="text-success" />
                <Text className="text-sm font-medium text-success">
                  {post.tipsCount || 0}
                </Text>
              </TouchableOpacity>

              {post.isTokenized && (
                <TouchableOpacity
                  onPress={() => onBuyToken(post)}
                  className="flex-row items-center gap-1 rounded-full bg-purple-100 px-3 py-1.5 dark:bg-purple-950"
                >
                  <Icon as={Coins} size={15} className="text-brand-600 dark:text-purple-300" />
                  <Text className="text-xs font-medium text-brand-600 dark:text-purple-300">{t('feed.buy')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Tips Display */}
          {post.totalTipsAmount > 0 && (
            <View className="mt-2.5 rounded-xl bg-success/10 p-2.5 bg-success/15">
              <Text className="text-xs text-success dark:text-success">
                💰 {t('feed.receivedTips', { amount: post.totalTipsAmount.toFixed(4) })}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}