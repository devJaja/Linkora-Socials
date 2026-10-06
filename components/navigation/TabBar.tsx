import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Appearance } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemeStore, resolveTheme } from '@/store/useThemeStore';

const GOLD = '#FDDA24';
const NAVY = '#002E5D';
const MUTED = '#8C8C98';

const TAB_CONTENT_HEIGHT = 52;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => subscription.remove();
  }, []);

  const isDark = resolveTheme(theme === 'system' ? systemTheme : theme) === 'dark';

  // `pay` and `notifications` are reachable from elsewhere in the app, so they are
  // hidden from the bar via `href: null`. Filter them out so they don't take a slot.
  const routes = useMemo(
    () =>
      state.routes.filter(
        (route) =>
          StyleSheet.flatten(descriptors[route.key]?.options.tabBarItemStyle)?.display !== 'none'
      ),
    [state.routes, descriptors]
  );

  // Never let the bottom padding collapse to 0 on devices with gesture navigation or a
  // 3-button system bar, otherwise the icons and labels slide underneath the system UI.
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 16);

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          backgroundColor: isDark ? '#151518' : '#FFFFFF',
          borderTopColor: isDark ? '#26262B' : '#EFEFF1',
          paddingBottom: bottomInset,
          paddingTop: 7,
        },
      ]}
    >
      {routes.map((route) => {
        const { options } = descriptors[route.key];
        const isFocused = state.routes[state.index]?.key === route.key;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (isFocused || !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={() =>
              navigation.emit({ type: 'tabLongPress', target: route.key })
            }
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          >
            <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? NAVY : MUTED,
                size: 22,
              })}
            </View>
            <Text
              numberOfLines={1}
              className={
                isFocused
                  ? 'mt-1 text-[11px] font-bold leading-4 text-brand-700 dark:text-white'
                  : 'mt-1 text-[11px] font-medium leading-4 text-gray-500'
              }
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    ...Platform.select({ android: { elevation: 16 } }),
  },
  item: {
    flex: 1,
    minHeight: TAB_CONTENT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  itemPressed: {
    opacity: 0.6,
  },
  iconPill: {
    minWidth: 46,
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: {
    backgroundColor: GOLD,
  },
});
