// useLocalSearchParams reads URL params passed via router.push()
// When Tab One calls router.push({ params: { id: item.id } }), we catch it here
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
// REVIEW_URL points to review.php — our second endpoint
import { REVIEW_URL } from '@/constants/config';

// Type-safe interface matching the fields returned by review.php
interface Review {
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

export default function TabTwoScreen() {
  // id comes from the item tapped on Tab One
  // It will be undefined if the user navigates directly to this tab
  const { id } = useLocalSearchParams();

  // review holds the structured object from review.php
  // null means we haven't fetched yet
  const [review, setReview] = useState<Review | null>(null);

  // loading starts false here because we only fetch when an id arrives
  const [loading, setLoading] = useState(false);

  // useEffect runs whenever "id" changes
  // So every time a new item is tapped on Tab One, this re-runs
  useEffect(() => {
    // If there's no id (user opened tab directly), do nothing
    if (!id) return;

    setLoading(true);
    const fetchReview = async () => {
      try {
        // Append ?id=X to the URL so review.php knows which item to look up
        // This is the same as typing review.php?id=1 in a browser
        const response = await fetch(`${REVIEW_URL}?id=${id}`);
        const data: Review = await response.json();
        // Store the parsed object directly — no stringify needed
        setReview(data);
      } catch (error) {
        console.log('Fetch error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]); // <-- [id] is the dependency — re-run this effect when id changes

  if (loading) return <ActivityIndicator />;

  return (
    // ScrollView lets the content scroll if it's longer than the screen
    <ScrollView contentContainerStyle={styles.container}>
      {/* If we have an id, show the review data, otherwise show fallback */}
      {review ? (
        <>
          <Text style={styles.title}>{review.name}</Text>
          <Text style={styles.label}>Year: <Text>{review.year}</Text></Text>
          <Text style={styles.label}>Rating: <Text>{review.rating}/5</Text></Text>
          <Text style={styles.label}>Overview</Text>
          <Text>{review.overview}</Text>
          <Text style={styles.label}>Favourite Part</Text>
          <Text>{review['favourite part']}</Text>
          <Text style={styles.label}>Biggest Challenge</Text>
          <Text>{review.challenge}</Text>
          <Text style={styles.label}>Is there anything you wish you knew before entering this program?</Text>
          <Text>{review['wished you would have known']}</Text>
          <Text style={styles.label}>What type of job are you hoping to pursue after graduation?</Text>
          <Text>{review['career after graduating']}</Text>
          <Text style={styles.label}>Advice for Future Students</Text>
          <Text>{review.advice}</Text>
        </>
      ) : (
        <Text style={styles.title}>Select an item from Tab One</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  // Label styles go here 
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
});
