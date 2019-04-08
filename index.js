import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Feed from './Feed';
import Login from './src/screens/Login';

Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('Feed', () => Feed);

Navigation.events().registerAppLaunchedListener(() =>
    AsyncStorage.getItem('token')
        .then(token => {
            if (token) {
                return {
                    name: 'Feed',
                    options: {},
                    passProps: {
                        text: 'Instalura'
                    }
                }
            }
            return {
                name: 'Login',
                options: {},
                passProps: {
                    text: 'Login'
                }
            };
        })
        .then(screen => Navigation.setRoot({
            root: {
                component: screen
            }
        }))
);