// useLocalSearchParams reads URL params passed via router.push()
// When Tab One calls router.push({ params: { id: item.id } }), we catch it here
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Text } from '@/components/Themed';
// REVIEW_URL points to review.php
import { REVIEW_URL } from '@/constants/config';

// Type-safe interface matching the fields returned by review.php
interface Review {
  program: string;
  name: string;
  year: string;
  rating: number;
  overview: string;
  'favourite part': string;
  challenge: string;
  'wished you would have known': string;
  'career after graduating': string;
  advice: string;
}

// Map each post id to its corresponding image
const postImages: Record<number, any> = {
  1: require('@/assets/images/Gradient-Blob.png'),
  2: require('@/assets/images/Gradient-Blob-2.png'),
  3: require('@/assets/images/Gradient-Blob-3.png'),
  4: require('@/assets/images/Gradient-Blob-4.png'),
};

export default function TabTwoScreen() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
  });
  // id comes from the item tapped on Tab One
  // It will be undefined if the user navigates directly to this tab
  const { id } = useLocalSearchParams<{ id?: string; programName?: string }>();

  // review holds the structured object from review.php
  // null means we haven't fetched yet
  const [review, setReview] = useState<Review | null>(null);

  // loading starts false here because we only fetch when an id arrives
  const [loading, setLoading] = useState(false);

  {/* https://developer.mozilla.org/en-US/docs/Web/CSS/animation adapted with chatgpt */}
  const blobRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && blobRef.current) {
      const node = blobRef.current as unknown as HTMLElement;
      node.style.animation = 'blobDrift 25s linear infinite';
    }
  });

  // handles the home button on first app load if user clicks the review button
  const handleGoHome = () => {
    router.push('/');
  };

  // Convert the numeric rating to filled and empty stars
  // src: https://stackoverflow.com/questions/76305480/react-star-rating
  const renderStars = (rating: number) => {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return filled + empty;
  };

  // Map each post id to its corresponding blob color
  const postColors: Record<number, string> = {
    1: '#E8837A', // red/coral for blob 1
    2: '#7EB3E8', // blue for blob 2
    3: '#9B7AE8', // purple for blob 3
    4: '#E8B87A', // orange for blob 4
  };

  // This runs when ID changes which is what happens when a user taps a program on tab one
  // Copilot assisted
  useEffect(() => {
    // If there is no ID to grab, it stops. Safety guard.
    if (!id) return;

    setLoading(true);
    // make a function to get a review from API
    const fetchReview = async () => {
      try {
        // Turn the API content into JSON
        const response = await fetch(`${REVIEW_URL}?id=${id}`);
        const data: Review = await response.json();
        console.log('API data:', data);
        // Save the review so it shows up
        setReview(data);
        // Updates the header title with the program name from API
        // This is a backup step for header title and keeps it in sync
        // Copilot assisted
        if (typeof data.program === 'string' && data.program.trim()) {
          router.setParams({ programName: data.program.trim() });
        }
      } catch (error) {
        console.log('Fetch error', error);
      } finally {
        setLoading(false);
      }

    };

    fetchReview();
  }, [id]); // <-- selecting another item fetches the new review

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Blob sits at the top behind the text */}
        {/* https://developer.mozilla.org/en-US/docs/Web/CSS/animation adapted with chatgpt */}
        <View ref={blobRef} style={styles.postImage}>
          <Image
            source={postImages[Number(id)]}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </View>

        {review ? (
          <>
            <Text style={styles.program}>{review.program}</Text>
            <Text style={styles.reviewTitle}>{review.name}</Text>
            <Text style={styles.label}>Year: <Text>{review.year}</Text></Text>
            <Text style={styles.label}>Rating</Text>
            <Text style={[styles.stars, { color: postColors[Number(id)] }]}>
              {renderStars(review.rating)}
            </Text>
            <Text style={styles.label}>Overview</Text>
            <Text style={styles.body}>{review.overview}</Text>
            <Text style={styles.label}>Favourite Part</Text>
            <Text style={styles.body}>{review['favourite part']}</Text>
            <Text style={styles.label}>Biggest Challenge</Text>
            <Text style={styles.body}>{review.challenge}</Text>
            <Text style={styles.label}>Is there anything you wish you knew before entering this program?</Text>
            <Text style={styles.body}>{review['wished you would have known']}</Text>
            <Text style={styles.label}>What type of job are you hoping to pursue after graduation?</Text>
            <Text style={styles.body}>{review['career after graduating']}</Text>
            <Text style={styles.label}>Advice for Future Students</Text>
            <Text style={styles.body}>{review.advice}</Text>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Select a program to read reviews.</Text>
            <Pressable style={styles.ctaButton} onPress={handleGoHome}>
              <Text style={styles.ctaButtonText}>View Programs</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // outer wrapper holds the hero and scrollview stacked vertically
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  container: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: 'transparent',
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // blob is absolute so text flows on top of it
  postImage: {
    position: 'absolute',
    top: -170,
    left: -90,
    width: '140%',
    height: 400,
    resizeMode: 'contain',
    zIndex: 0,
  },

  stars: {
    fontSize: 28,
    color: '#FFB800', // golden yellow
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },

  program: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Syne_Bold', // or 'Syne-Bold' depending on how it was loaded
    color: '#333',
    marginBottom: 40, // increase this if 4 isn't showing any effect
    textAlign: 'center',
  },

  reviewTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 10,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
    marginBottom: 16,
  },
  ctaButton: {
    marginTop: 6,
    alignSelf: 'center',
    backgroundColor: '#E8837A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
});