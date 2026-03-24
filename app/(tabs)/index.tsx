import { GlobalStyles } from '@/components/Styles';
import { Text, View } from '@/components/Themed';
import { API_URL } from '@/constants/config';

// useEffect is another React hook
// It is included/built-in by default 
// It allows us to run side effects like fetch and timers
import React, { useEffect, useState } from 'react';

// ActivityIndicator is also built into React
// It literally just creates a spinning wheel
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

// This is how we set up a type-safe object
// Type safety makes our code safer and more efficient
// 1. Safer: if we expect a number, we get a number (or fail)
// 2. Efficient: ints use less RAM/memory than strings
// These objects and properties are based on the WP API
interface Post {
  id: number;
  name: string;
}

export default function IndexScreen() {
  // We are initializing our "posts" state
  // using a list of our Post interface
  const [posts, setPosts] = useState<Post[]>([]);

   // We are using state to determine if we 
  // show the indicator (true/yes by default)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // useEffect takes two parameters/arguments
  // 1. anonymous function to hold the code we're going to run
  // because we're inside a "function," we use the arrow syntax
  // 2. The dependancy which determines how/when it renders
  // The empty array means it runs on "document.ready"
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
        }
        else if (data && typeof data === 'object') {
          setPosts(
            Object.entries(data as Record<string, unknown>).map(([id, name]) => ({
              id: Number(id),
              name: String(name ?? ''),
            }))
          );
        }
        else {
          setPosts([]);
        }
      }
      catch (error) {
        // if we failed, log it
        console.log('Fetch error', error);
      }
      finally {
        // then update the loading state
        setLoading(false);
      }
    };

    // call our fetch functionality
    // the arrow function is in this variable
    // so to call it , throw () on the variable name
    fetchPost();
  }, []);

  // if our loading state variable is "true"
  // Return our loading indicator
  if (loading) {
    return <ActivityIndicator />;
    // if we return here, nothing below this point runs
  }

  return (
    // FlatList is how we do UL/OL
    // it will loop for us if we pass an array to "data"
    // keyExtractor is how we give LIs an "ID" attribute
    // This is required by React
    // renderItem is how we fill our LI
    // Note the rounded brackets after => in renderItem
    // as we are rendering JSX
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View
          style={[
            styles.container,
            // this aligns the text to opposite sides - the titles zig zag
            { alignItems: index % 2 === 0 ? 'flex-start' : 'flex-end' },
          ]}
        >
          <Text style={GlobalStyles.title}>{item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '22vh',
    cursor: 'pointer',
    overflow: 'hidden',
    // margin: '0 auto',
    margin: '2rem',
    borderRadius: '100%',
    width: 'min-content',
    
  },



});
