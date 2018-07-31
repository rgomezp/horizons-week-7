import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import _ from 'underscore'
import { StackNavigator } from 'react-navigation'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

// --- OUR CODE ---

//Screens
class LoginScreen extends React.Component {
  static navigationOptions = (props) => ({
    title: 'Login',
    headerRight: <TouchableOpacity onPress={() => {props.navigation.navigate('Register')}}><Text>Register</Text></TouchableOpacity>
  });

  press() {
    this.props.navigation.navigate('LoginFr');
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to Bro!</Text>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  static navigationOptions = (props) => ({
    title: "Register",
    headerLeft: <TouchableOpacity onPress={() => {props.navigation.navigate('Login')}}><Text>Login</Text></TouchableOpacity>
  })

  login() {
    this.props.navigation.navigate('Login');
  }

  handleSubmit() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({
      username: this.state.username,
      password: this.state.password,
      })
      })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        console.log("Registration Success!", responseJson)
        this.login()
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      console.log("Registration Error!", err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ borderRadius: 4, borderWidth: 0.5, borderColor: 'black', width: 300, marginBottom: 20}}>
          <TextInput
            style={{height: 40}}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({username: text})}
            value={this.state.username}
          />
        </View>
        <View style={{ borderRadius: 4, borderWidth: 0.5, borderColor: 'black', width: 300, marginBottom: 20}}>
          <TextInput
            style={{height: 40}}
            placeholder="Enter a password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            value = {this.state.password}
          />
        </View>
        <View style={{backgroundColor: '#FFC0CB', borderRadius: 4, borderWidth: 0.5}}>
          <TouchableOpacity onPress={() => this.handleSubmit()}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', height: 40, width: 300, fontSize: 30, textAlign:'center'}}>Submit</Text>
            </View>
        </TouchableOpacity>
      </View>
      </View>
    )
  }
}

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      errMsg: ''
    }
  }

  redirect() {
    this.props.navigation.navigate('Users');
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.state.username && this.state.password) {
      fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        })
        })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log("Login Success!", responseJson)
          this.redirect()
        } else {
          alert(responseJson.error);
        }
      })
      .catch((err) => {
        console.log("Login Error!", err)
        this.setState({
          errMsg: <Text>{this.state.message}</Text>
        })
      });
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{ borderRadius: 4, borderWidth: 0.5, borderColor: 'black', width: 300, marginBottom: 20}}>
          <TextInput
            style={{height: 40}}
            placeholder="Username"
            onChangeText={(text) => this.setState({username: text})}
            value={this.state.username}
          />
        </View>
        <View style={{ borderRadius: 4, borderWidth: 0.5, borderColor: 'black', width: 300, marginBottom: 20}}>
          <TextInput
            style={{height: 40}}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            value = {this.state.password}
          />
        </View>
        <View style={{backgroundColor: '#FFC0CB', borderRadius: 4, borderWidth: 0.5}}>
          <TouchableOpacity onPress={(e) => this.handleSubmit(e)}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', height: 40, width: 300, fontSize: 30, textAlign:'center'}}>Login</Text>
            </View>
        </TouchableOpacity>
      </View>
      </View>
    )
  }
}


class UsersScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
      "Content-Type": "application/json"
      }
      })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("respJson", responseJson)
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      })
    })
    .catch((err) => {
        console.log("Error fetching users!", err)
      })
  }

  userHandler(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
      })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      if (responseJson.success) {
        alert("Your Bro to " + user.username + " has been sent!");
      } else {
        alert("Your Bro to " + user.username + " has NOT been sent!");
      }
    })
    .catch((err) => {
        console.log("Error not sent", err)
      })
  }

  static navigationOptions = (props) => ({
    title: "Users",
    headerRight: <TouchableOpacity onPress={() => {props.navigation.navigate('Messages')}}><Text>Messages</Text></TouchableOpacity>
  })

  render() {
    return(
      <ListView
        renderRow={(user) => (
          <View style={styles.usersContainer}>
            <TouchableOpacity onPress={this.userHandler.bind(this, user)}>
            <View>
              <Text style={{textAlign: 'center'}}>{user.username}</Text>
            </View>
            </TouchableOpacity>
          </View>
        )}
      dataSource={this.state.dataSource}
      />
    )
  }
}

class MessagesScreen extends React.Component {
  constructor() {
    super()
      const dss = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: dss.cloneWithRows([])
    }

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
      "Content-Type": "application/json"
      }
      })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("Messages Response: ", responseJson)
      if (!responseJson.success) {
        alert('Did not successfully set state with messages')
        console.log(responseJson)
      }
      this.setState({
        dataSource: dss.cloneWithRows(responseJson.messages)
      })
    })
    .catch((err) => {
        console.log("Error fetching messages!", err)
      })
  }

  render() {
    console.log("message array", this.state.dataSource)
    return(
      <ListView
        renderRow={(message) => {
          console.log('Render row:', message);
          return(
          <View style={styles.messageContainer}>
            <View>
              <Text>From: {message.from.username}</Text>
              <Text>To: {message.to.username}</Text>
              <Text>Message: Bro...</Text>
              <Text>When: {message.timestamp}</Text>
            </View>
          </View>
        )}}
      dataSource={this.state.dataSource}
      />
    )
  }

}


// --- OUR CODE ---

export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: Register,
  },
  LoginFr: {
    screen: Login,
  },
  Users: {
    screen: UsersScreen
  },
  Messages: {
    screen: MessagesScreen
  }
}, {initialRouteName: 'Login'});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  usersContainer: {
    backgroundColor: '#F5FCFF',
    borderWidth: 1,
    alignSelf: 'stretch',
    borderColor: 'black',
    height: 60,
    padding: 15
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  messageContainer:{
    backgroundColor: '#F5FCFF',
    borderWidth: 1,
    alignSelf: 'stretch',
    borderColor: 'black',
    padding: 5
  }
});
