import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // active icon/text color matches your blob accent
        tabBarActiveTintColor: '#E8837A',
        // inactive is a muted version of your text color
        tabBarInactiveTintColor: '#B0A99A',
        tabBarStyle: {
          backgroundColor: '#F5F0E8', // matches your app background
          borderTopWidth: 0,          // removes the default border line
          elevation: 0,               // removes shadow on Android
          shadowOpacity: 0,           // removes shadow on iOS
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 11,
        },
        headerStyle: {
          backgroundColor: '#F5F0E8', // matches app background
          shadowOpacity: 0,           // removes header shadow on iOS
          elevation: 0,               // removes header shadow on Android
        },
        headerTitleStyle: {
          fontFamily: 'Syne_Bold',
          color: '#333',
        },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false, // hides the header on Tab One so blobs aren't pushed down
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color='#333'
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Program Review',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Ainsley Tab',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
    </Tabs>
  );
}