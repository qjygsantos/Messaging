import Constants from 'expo-constants';
import { Platform, StatusBar, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useRef, useEffect, Component } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: 'none',
      isConnected: false,
    };
  }

  connectionChange(state) {
    this.setState({ info: state.type, isConnected: state.isConnected });
  }

  componentDidMount() {
    NetInfo.fetch().then((state) => {
      this.connectionChange(state);
    });

    this.unsubscribe = NetInfo.addEventListener((state) => {
      this.connectionChange(state);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    const { info, isConnected } = this.state;
    const backgroundColor = isConnected ? 'green' : 'red';

    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? 'dark-content' : 'light-content'}
        animated={true}
      />
    );

    const FadeInView = props => {
      const fadeAnim = useRef(new Animated.Value(0)).current; 
    
      useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }).start();
      }, [fadeAnim]);
    
      return (
        <Animated.View 
          style={{
            ...props.style,
            opacity: fadeAnim, 
          }}>
          {props.children}
        </Animated.View>
      );
    };    

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents="none">
        {statusBar}
        {!isConnected && (
          <FadeInView style = {styles.bubble}>
            <Text style={styles.text}>No network connection</Text>
          </FadeInView>
        )}
      </View>
    );

    if (Platform.OS == 'ios') {
      return <View style={[styles.status, { backgroundColor }]}></View>;
    }
    return messageContainer;
  }
}

const statusHeight = Platform.OS == 'ios' ? Constants.statusBarHeight : 0;
const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',

  },
});
