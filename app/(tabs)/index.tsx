import { Text } from '@/components/Themed';
import { API_URL } from '@/constants/config';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

export default function HomeScreen() {
  // We are using state to determine if we
  // show the indicator (true/yes by default)
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<{ id: number; name: string }[]>([]);

  // one animated value per blob, all starting at scale 1
  // spring source: https://reactnative.dev/docs/animated
  const blobScales = useState(() => [
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ])[0];

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
        // this block normalizes API to be consistent such as (id, name)
        // Copilot assisted
        if (Array.isArray(data)) {
          setPosts(
            data.map((item: any, index: number) => ({
              id: Number(item?.id ?? index + 1),
              name: String(item?.name ?? item ?? ''),
            }))
          );
        // API converts into id, name array
        // Copilot assisted
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

  // animate the pressed blob up, and spring it back on release
  // index matches the blob to the post item (0 = blob1, 1 = blob2, etc.)
  const animateBlob = (index: number, toValue: number) => {
    Animated.spring(blobScales[index], {
      toValue,
      useNativeDriver: true, 
      friction: 4,           
      tension: 40,         
    }).start();
  };

  // if our loading state variable is "true"
  // Return our loading indicator
  if (loading) {
    return <ActivityIndicator />;
    // if we return here, nothing below this point runs
  }

  // renderItem is the function FlatList calls for each item in the list
  // it receives the item and its index destructured from the info object
  const renderItem = ({ item, index }: { item: { id: number; name: string }; index: number }) => (
    <Pressable
      onPressIn={() => animateBlob(index, 1.2)}  
      onPressOut={() => animateBlob(index, 1)}  
      // TODO: Pass selected program name so Reviews header can render a subtitle.
      onPress={() => router.push({ pathname: '/(tabs)/two', params: { id: item.id, programName: item.name } })}
      style={[
        styles.container,
        index % 2 === 0 ? styles.alignStart : styles.alignEnd,
      ]}
    >
      <Text style={[
        styles.linkText,
        // right-aligned text gets less padding to sit closer to the edge
        index % 1 !== 0 ? styles.linkTextRight : styles.linkTextLeft,
      ]}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.fullScreen}>
      <View style={styles.contentWrapper}>

        {/* Header sits at the top of the screen above the blobs */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/cc-logo-word.png')}
            style={styles.headerLogo}
          />
  
        </View>

        {/* Blobs use Animated.Image so they can be scaled with spring animation */}
        {/* Each blob is tied to its blobScales value by index */}
        <Animated.Image
          source={require('@/assets/images/Gradient-Blob.png')}
          style={[styles.blob1, { transform: [{ scale: blobScales[0] }] }]}
        />
        <Animated.Image
          source={require('@/assets/images/Gradient-Blob-2.png')}
          style={[styles.blob2, { transform: [{ scale: blobScales[1] }] }]}
        />
        <Animated.Image
          source={require('@/assets/images/Gradient-Blob-3.png')}
          style={[styles.blob3, { transform: [{ scale: blobScales[2] }] }]}
        />
        <Animated.Image
          source={require('@/assets/images/Gradient-Blob-4.png')}
          style={[styles.blob4, { transform: [{ scale: blobScales[3] }] }]}
        />

        {/* FlatList renders each post as a tappable text label */}
        {/* It only renders visible items, making it more efficient than .map() */}
        <FlatList
          data={posts.slice(0, 4)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.overlayContent}
          scrollEnabled={false} 
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // outer wrapper fills the screen
  fullScreen: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    position: 'relative',
    overflow: 'hidden',
  },

  // header stacks logo and subtext vertically, centered
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#F5F0E8',
  },
  headerLogo: {
    width: 300,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  headerSubtext: {
    fontFamily: 'Syne_Bold',
    fontSize: 20,
    color: '#CD1041',
  },

  // Each blob uses percentage positioning so it scales with screen size
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
    justifyContent: 'space-evenly',
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
    fontSize: windowWidth * 0.06, 
    fontWeight: 'bold',
    fontFamily: 'Syne_Bold',
    width: 250,
  },
 
  linkTextLeft: {
    paddingLeft: '8%',
  },
  
  linkTextRight: {
    paddingRight: '5%',
  },
});