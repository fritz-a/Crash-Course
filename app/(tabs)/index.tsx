import { GlobalStyles } from '@/components/Styles';
import { Text } from '@/components/Themed';
import { API_URL } from '@/constants/config';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// screen responsiveness
const contentWidth = windowWidth;

export default function HomeScreen() {
  // We are using state to determine if we
  // show the indicator (true/yes by default)
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // useEffect takes two parameters/arguments
    // 1. anonymous function to hold the code we're going to run
    //    because we're inside a "function," we use the arrow syntax
    // 2. The dependency which determines how/when it renders
    //    The empty array means it runs on "document.ready"
    const fetchPost = async () => {
      // try/catch/finally is "Exception Handling"
      // it lets us fail gracefully (we can respond to errors)
      try {
        // Await here is essentially "then"
        const response = await fetch(API_URL);
        // After we have data from the fetch
        // "then" we format it as JSON
        const data = await response.json();

        if (Array.isArray(data)) {
          setPosts(
            data.map((item: any, index: number) => ({
              id: Number(item?.id ?? index + 1),
              name: String(item?.name ?? item ?? ''),
            }))
          );
        } else if (data && typeof data === 'object') {
          setPosts(
            Object.entries(data as Record<string, unknown>).map(([id, name]) => ({
              id: Number(id),
              name: String(name ?? ''),
            }))
          );
        } else {
          setPosts([]);
        }
      } catch (error) {
        // if we failed, log it
        console.log('Fetch error', error);
      } finally {
        // then update the loading state
        setLoading(false);
      }
    };

    // call our fetch functionality
    // the arrow function is in this variable
    // so to call it, throw () on the variable name
    fetchPost();
  }, []);

  // if our loading state variable is "true"
  // Return our loading indicator
  if (loading) {
    return <ActivityIndicator />;
    // if we return here, nothing below this point runs
  }

  return (
    // outer wrapper centers the content on large screens
    <View style={styles.fullScreen}>
      <View style={styles.contentWrapper}>

        {/* Header sits at the top of the screen above the blobs */}
        <View style={styles.header}>
          <Text style={styles.headerText}>RRC Polytech</Text>
          <Image
            source={require('@/assets/images/RRC-logo.png')}
            style={styles.headerLogo}
          />
        </View>

        {/* Blobs are absolutely positioned to form the diagonal chain */}
        <Image source={require('@/assets/images/Gradient-Blob.png')} style={styles.blob1} />
        <Image source={require('@/assets/images/Gradient-Blob-2.png')} style={styles.blob2} />
        <Image source={require('@/assets/images/Gradient-Blob-3.png')} style={styles.blob3} />
        <Image source={require('@/assets/images/Gradient-Blob-4.png')} style={styles.blob4} />

        {/* Text labels sit on top of the blobs, alternating left and right */}
        {/* Tapping an item navigates to Tab Two and passes the item id as a param */}
        <View style={styles.overlayContent}>
          {posts.slice(0, 4).map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push({ pathname: '/(tabs)/two', params: { id: item.id } })}
              style={[
                styles.container,
                index % 2 === 0 ? styles.alignStart : styles.alignEnd,
              ]}
            >
              <Text style={[
                GlobalStyles.title,
                styles.linkText,
                // right-aligned text gets less padding to sit closer to the edge
                index % 2 !== 0 ? styles.linkTextRight : styles.linkTextLeft,
              ]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // outer wrapper fills the screen and centers the content
  fullScreen: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    // remove alignItems: 'center'
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    position: 'relative',
    overflow: 'hidden',
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: '#F5F0E8',
  },
  headerLogo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  headerText: {
    fontFamily: 'Syne_Bold',
    fontSize: 28,
    color: '#CD1041',
  },

  blob1: {
    position: 'absolute',
    top: '-5%',
    left: '-30%',
    width: '120%',
    height: '60%',
    resizeMode: 'contain',
  },
  blob2: {
    position: 'absolute',
    top: '12%',
    right: '-23%',
    width: '120%',
    height: '60%',
    resizeMode: 'contain',
  },
  blob3: {
    position: 'absolute',
    top: '35%',
    left: '-35%',
    width: '130%',
    height: '60%',
    resizeMode: 'contain',
  },
  blob4: {
    position: 'absolute',
    top: '58%',
    right: '-28%',
    width: '140%',
    height: '60%',
    resizeMode: 'contain',
  },

  overlayContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    zIndex: 2,
    position: 'relative',
    paddingTop: 80,
  },
  container: {
    width: '100%',
    minHeight: 150,
    justifyContent: 'center',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  linkText: {
    color: 'white',
    textDecorationLine: 'none',
    fontSize: windowWidth * 0.05, // scales with screen width
    fontWeight: 'bold',
  },
  // left-side text has normal padding
  linkTextLeft: {
    paddingLeft: '8%',
  },
  // right-side text uses percentage padding so it scales with screen width
  linkTextRight: {
    paddingRight: '5%',
  },
});