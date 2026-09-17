import { Tabs } from 'expo-router';
import { Home, Wallet, Send, MessageCircle, User, Search } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export default function TabsLayout() {
  const { theme } = useThemeStore();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light';
  });

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => subscription.remove();
  }, []);

  // Determine effective theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const isDark = effectiveTheme === 'dark';
  
const tabBarBg = isDark ? '#151518' : '#FFFFFF';
  const tabBarBorderColor = isDark ? '#26262B' : '#EFEFF1';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3E1BDB',
        tabBarInactiveTintColor: isDark ? '#8C8C98' : '#AEAEB8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorderColor,
          borderTopWidth: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          height: 62,
          paddingTop: 6,
          paddingBottom: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.2 : 0.06,
          shadowRadius: 12,
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
          href: '/(tabs)/wallet'
        }}
      />
      <Tabs.Screen
        name="pay"
        options={{
          title: 'Pay',
          tabBarIcon: ({ color, size }) => <Send size={size} color={color} />, 
          href: null
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          href: '/(tabs)/chats',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          href: '/(tabs)/profile',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          href: null
        }}
      />
    </Tabs>
  );
}
