import { useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
 
 function Article(props) {
   console.log(props.TheArticle);
 
   return (
     <View>
       {props.TheArticle && props.TheArticle.title && (
         <Text>{props.TheArticle.title.rendered}</Text>
       )}
 
       {props.TheArticle && 
       props.TheArticle.yoast_head_json &&
       props.TheArticle.yoast_head_json.og_image &&
       props.TheArticle.yoast_head_json.og_image[0] &&
       props.TheArticle.yoast_head_json.og_image[0].url && (
         <Image style={styles.articleImage} source={{ uri: props.TheArticle.yoast_head_json.og_image[0].url}} resizeMode="cover"></Image>
      )}
     </View>
   );
 }
 
 function ArticleData(props) {
   const [news, setNews] = useState([]);
 
   useEffect(() => {
     fetch('https://theprojector.ca/cors-api/post.php?id='+props.NewsData, {
       crossDomain: true,
       mode: 'cors',
       dataType: 'json'
     })
     .then(
       (response) => {
         return response.json()
       }
     )
     .then(
       (data) => {
         console.log(data);
         setNews(data);
       }
     )
     .catch(
       error => {
         console.log(error);
       }
     )
   }, [props.NewsData]);
 
   return (
     <View>
       <Article TheArticle={news} />
     </View>
   );
 }
 
 export default function ArticleScreen() {
   const { id } = useLocalSearchParams();
   //console.log(id);
 
   const navigation = useNavigation();
   navigation.setOptions({title: "In an Article" });
 
   return (
     <View style={styles.container}>
       <ArticleData NewsData={id} />
       {/* Use a light status bar on iOS to account for the black space above the modal */}
       <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} backgroundColor="red" />
     </View>
   )
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
   },
   title: {
     fontSize: 20,
     fontWeight: 'bold',
   },
   separator: {
     marginVertical: 30,
     height: 1,
     width: '80%',
   },
   articleImage: {
     width: '100%',
     height:200,
   }
 });
 
