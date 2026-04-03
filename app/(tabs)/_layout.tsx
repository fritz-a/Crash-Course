import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

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
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E8837A',
        tabBarInactiveTintColor: '#B0A99A',
        tabBarStyle: {
          backgroundColor: '#F5F0E8', 
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
          backgroundColor: '#F5F0E8', 
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
        options={({ route }) => ({
          tabBarLabel: 'Reviews',
          headerTitleAlign: 'center',

          // Assisted by copilot, builds the header title from current route params
          // current route params is whatever value was passed when the app navigated to this screen
          headerTitle: () => {
            // Reads params
            const params = route.params as Record<string, unknown> | undefined;

            // Only use program name if it's a string
            const programName = typeof params?.programName === 'string' ? params.programName : '';

            // This checks for Interaction Design and Development since it's the only title that is too long for the header
            const isLongProgramName = programName === 'Interaction Design and Development';
            // This block shortens the title so it fits in header
            const displayProgramName =
              isLongProgramName
                ? 'Interaction Design & Dev'
                : programName;
            // End
            return (
              <View style={{ alignItems: 'center' }}>
                {displayProgramName ? (
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Syne_Bold',
                      color: '#000000',
                      lineHeight: 24,
                    }}
                    // If it's the long title then we keep it on one line and add the ... onto it
                    // copiot assisted
                    numberOfLines={isLongProgramName ? 1 : undefined}
                    ellipsizeMode="tail"
                  >
                    {displayProgramName}
                  </Text>
                ) : null}
                <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color: '#565454', fontWeight: '200', lineHeight: 18 }}>
                  Reviews
                </Text>
              </View>
            );
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          // React Navigation headerleft
          // https://reactnavigation.org/docs/native-stack-navigator/#headerleft
          headerLeft: () => (
            <Pressable
            // Expo Router back navigation
            // https://docs.expo.dev/versions/latest/sdk/router/#router
             onPress={() => router.back()} style={{ marginLeft: 15,  marginRight: 10 }}>
              <FontAwesome name="chevron-left" size={22} color="#000000" />
            </Pressable>
          ),
        })}
      />
      
    </Tabs>
  );
}