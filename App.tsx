import React, { FunctionComponent } from 'react';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import AppNavigator from './src/navigators/AppNavigator';

LogBox.ignoreAllLogs();

const App: FunctionComponent = () => {
    return <AppNavigator />;
};

export default App;
