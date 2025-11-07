import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';

export default function App() {
  const [htmlUri, setHtmlUri] = useState(null);

  useEffect(() => {
    async function loadHtml() {
      try {
        // Load and download the HTML asset
        const htmlAsset = Asset.fromModule(require('./assets/html/index-v2.html'));
        await htmlAsset.downloadAsync();
        setHtmlUri(htmlAsset.localUri || htmlAsset.uri);
      } catch (error) {
        console.error('Error loading HTML:', error);
      }
    }
    loadHtml();
  }, []);

  if (!htmlUri) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* WebView - Displays the Eisenhower Task Manager */}
      <WebView
        source={{ uri: htmlUri }}
        style={styles.webview}
        // Allow JavaScript (needed for the task manager)
        javaScriptEnabled={true}
        // Allow DOM storage (for saving tasks)
        domStorageEnabled={true}
        // Start loading
        startInLoadingState={true}
        // Allow local storage
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Safe area for status bar
  },
  webview: {
    flex: 1,
  },
});
