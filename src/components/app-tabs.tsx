import { Tabs } from 'expo-router';
import { CalendarDays, MessageCircle, Store, UserRound } from 'lucide-react-native';

const ACTIVE = '#1B66D0';
const INACTIVE = '#7A8493';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        tabBarIconStyle: { marginTop: 3 },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E7EAF0',
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#18243A',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarItemStyle: { paddingTop: 2 },
        tabBarHideOnKeyboard: true,
        animation: 'none',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '赶集',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '日历',
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '消息',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
