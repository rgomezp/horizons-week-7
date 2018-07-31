import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      latitude      : 41.009691,
      longitude     : 28.976152,
      latitudeDelta : 0.05,
      longitudeDelta: 0.025,
      istanbulCoords: [41.009691,28.976152],
      sydneyCoords  : [-33.868907, 151.209059],
      hongKongCoords: [22.310606, 114.175504]
    }
  }

  changeMap(choice){
    switch(choice){
      case 0:
        this.setState({
          latitude  : this.state.istanbulCoords[0],
          longitude : this.state.istanbulCoords[1]
        });
        break;

      case 1:
        this.setState({
          latitude  : this.state.sydneyCoords[0],
          longitude : this.state.sydneyCoords[1]
        });
        break;

      case 2:
        this.setState({
          latitude  : this.state.hongKongCoords[0],
          longitude : this.state.hongKongCoords[1]
        });
        break;

      case 3:
        navigator.geolocation.getCurrentPosition(
          (success) => {
            this.setState({
              latitude      : success.coords.latitude,
              longitude     : success.coords.longitude,
              latitudeDelta : 0.01,
              longitudeDelta: 0.005
            });
          },
          (error) => {
            console.log("congratulations, you have an error!", error);
          }
        )
    }
  }

  componentDidMount(){
    var latitude, longitude;
    try{
      AsyncStorage.getItem('latitude').then((result) => {
          this.setState({latitude:JSON.parse(result)});
        });

      AsyncStorage.getItem('longitude').then((result) => {
          this.setState({longitude:JSON.parse(result)});
        });

      AsyncStorage.getItem('latitudeDelta').then((result) => {
          this.setState({latitudeDelta:JSON.parse(result)});
        });

      AsyncStorage.getItem('longitudeDelta').then((result) => {
          this.setState({longitudeDelta:JSON.parse(result)});
        });
      }catch(err){
        console.log("congratulations, you have an error!", err);
      }
  }

  onRegionChangeComplete(region){
    AsyncStorage.setItem('latitude', JSON.stringify(region.latitude));
    AsyncStorage.setItem('longitude', JSON.stringify(region.longitude));
    AsyncStorage.setItem('latitudeDelta', JSON.stringify(region.latitudeDelta));
    AsyncStorage.setItem('longitudeDelta', JSON.stringify(region.longitudeDelta));

  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={()=>this.changeMap(0)}
            style={{
              flex          : 1,
              borderWidth   : 1,
              alignItems    : 'center',
              justifyContent: 'center'
            }}>
            <Text>Istanbul</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.changeMap(1)}
            style={{
              flex          : 1,
              borderWidth   : 1,
              alignItems    : 'center',
              justifyContent: 'center'
            }}>
            <Text>Sydney</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.changeMap(2)}
            style={{
              flex          : 1,
              borderWidth   : 1,
              alignItems    : 'center',
              justifyContent: 'center'
            }}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.changeMap(3)}
            style={{
              flex          : 1,
              borderWidth   : 1,
              alignItems    : 'center',
              justifyContent: 'center'
            }}>
            <Text>Here</Text>
          </TouchableOpacity>

        </View>
        <MapView style={{flex: 7}} region={{
            latitude        :  this.state.latitude,
            longitude       :  this.state.longitude,
            latitudeDelta   : this.state.latitudeDelta,
            longitudeDelta  : this.state.longitudeDelta
          }}
          onRegionChangeComplete={
            (region) => this.onRegionChangeComplete(region)
          }
        />
      </View>
    );
  }
}

export default App;
