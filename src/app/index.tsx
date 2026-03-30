import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BpWidget from '@/botpress/BpWidget';
import { botpressConfig } from '@/config/botpressConfig';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.main}>
        <BpWidget
          botConfig={botpressConfig}
          onMessage={(event: { nativeEvent: { data: string } }) => {
            console.log('event from widget', event);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
});
