import * as React from 'react'
import { Text, View, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { AsyncStorage } from 'react-native';
import UserInfoPage from './Libraries/UserInfoPage'
import { getUserFromApi } from './Libraries/apis'

//button prop to display all users, when clicked, redirects to userInfo page
const User = props => (
  <TouchableOpacity key={props.user.id} onPress={props.inspectUser} style={styles.openUserButton}>
    <Text key={props.user.login} style={styles.openUserButtonText}>{props.user.login}</Text>
  </TouchableOpacity>
)

//carrys the current user that is being inspected
var inspectedUser = {}

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      showContact: false,
      newUserName: "",
      addUserModal: false,
      users: [],
    }
    this.importLocalData()
  }

  //toggles user inspector scene
  toggleInspectUser() {
    this.setState(prevState => ({ showContact: !prevState.showContact }))
  }

  //selects user and toggles user inspector scene
  inspectUser(user) {
    inspectedUser = user
    this.toggleInspectUser()
  }

  //just control newUserModal, turning it on/off
  toggleModal() {
    this.setState(prevState => ({ addUserModal: !prevState.addUserModal }))
    this.setState({ newUserName: "" })
  }

  //collects keyboard input and add to state (which will be saved in this.state.users later)
  handleNameChange = newUserName => {
    this.setState({ newUserName })
  }

  //delete user from the list
  deleteUser() {
    this.setState({
      users: this.state.users.filter(user => user.name !== inspectedUser.name)
    }, this.saveLocalData)
    this.toggleInspectUser()
  }

  //add user to this.state.users and invoke saveLocalData function, also toggle the newUserModal off
  addUser = async () => {
    let newUser = await getUserFromApi(this.state.newUserName)
    if (newUser) {
      this.setState({
        users: [
          ...this.state.users,
          newUser
        ]
      }, () => this.saveLocalData())
      this.toggleModal()
    }
    else {
      //if user not found, clean field
      this.setState({
        newUserName: "",
      })
    }
  }

  //export users from this.state to local phone memory
  saveLocalData = async () => {
    try {
      //AsyncStorage.clear()
      AsyncStorage.setItem("appUsers", JSON.stringify(this.state.users))
      //console.log(JSON.stringify(this.state.users))
    }
    catch (error) {
      alert(error)
    }
  }

  //import saved users from phone memory using async library
  importLocalData = async () => {
    try {
      const appUsers = await AsyncStorage.getItem('appUsers')
      if (appUsers !== null) {
        const savedUsers = JSON.parse(appUsers)
        //console.log(savedUsers)
        this.setState({
          users: savedUsers
        })
        //console.log(this.state.users)
      }
    }
    catch (error) {
      alert(error)
    }
  }

  render() {
    //User Info scene
    if (this.state.showContact) {
      return (
        <UserInfoPage
          user={inspectedUser}
          returnButton={() => this.toggleInspectUser()}
          deleteUser={() => this.deleteUser()}
        />
      )
    }

    //main scene
    return (
      <View style={styles.appContainer}>

        <Text style={styles.userHeader}>
          Usuários
        </Text>

        <ScrollView styles={styles.userScrollView}>
          {this.state.users.map(user => <User user={user}
            key={user.name}
            inspectUser={() => this.inspectUser(user)}
          />)}
        </ScrollView>

        <TouchableOpacity onPress={() => this.toggleModal()} style={styles.addButton}>
          <Text style={styles.textAddButton}>+</Text>
        </TouchableOpacity>

        <Modal isVisible={this.state.addUserModal} onBackdropPress={() => this.toggleModal()}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>Novo Usuário</Text>
            <TextInput style={styles.textInput} onChangeText={this.handleNameChange} value={this.state.newUserName} placeholder="Nome do Usuário" />
            <TouchableOpacity onPress={() => this.addUser()} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </Modal>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  //Modal window to add new users
  modal: {
    backgroundColor: 'white',
    height: 200,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 14,
    color: "black",
    fontWeight: 'bold',
    fontSize: 18,
  },
  textInput: {
    width: 300,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  saveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 34,
    height: 60,
    width: 300,
    borderRadius: 10,
    backgroundColor: "#042A2B",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
  },

  //Scroll view with all the users
  userScrollView: {
    flex: 1,
  },
  openUserButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 363,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#5EB1BF",
  },
  openUserButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  //View of the main scene
  appContainer: {
    flex: 1,
    alignItems: 'center',
  },

  //Add button, at the bottom of the main scene
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    height: 60,
    width: 60,
    borderRadius: 10,
    backgroundColor: "#042A2B",
  },
  textAddButton: {
    color: "white",
    fontSize: 40,
  },

  //App Header
  userHeader: {
    width: "100%",
    backgroundColor: "#042A2B",
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 60,
    fontSize: 18,
    color: "#FFFFFF",
  },
});