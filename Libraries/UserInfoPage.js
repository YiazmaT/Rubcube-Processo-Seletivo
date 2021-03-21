import * as React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modal'
import { getAllReposFromApi } from './apis'
import RepoInfoPage from './RepoInfoPage'
import LinearGradient from 'react-native-linear-gradient'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

//Button prop to display each repo, when clicked, redirects to repoInfo page
const Repo = props => (
    <TouchableOpacity key={uniqueKeyCount++} style={styles.openRepButton} onPress={props.inspectRepo}>
        <Text key={uniqueKeyCount++} style={styles.openRepButtonText}>{props.repo.name}</Text>
    </TouchableOpacity>
)

//Unique numeric key for Repo buttons
var uniqueKeyCount = 0

//Carrys the repo that will be inspected
var inspectedRepo = {}

//User info Page
export default class UserInfoPage extends React.Component {
    constructor() {
        super()
        this.state = {
            repos: [],
            deleteUserModal: false,
            inspectRepo: false,
            loader: false
        }
    }

    componentDidMount() {
        this.importReposFromUser()
    }

    //Toggles shimmerPlaceHolder on/off
    toggleLoader() {
        this.setState(prevState => ({ loader: !prevState.loader }))
    }

    //Selects repo and toggles repo inspector page
    inspectRepo(repo) {
        inspectedRepo = repo
        this.toggleInspectRepo()
    }

    //Toggles inspect page on and off
    toggleInspectRepo() {
        this.setState(prevState => ({ inspectRepo: !prevState.inspectRepo }))
    }

    //Toggles delete modal (confirms if you really want to delete an user)
    toggleModal() {
        this.setState(prevState => ({ deleteUserModal: !prevState.deleteUserModal }))
    }

    //Calls the API to import repos from an user
    importReposFromUser = async () => {
        let userRepos = await getAllReposFromApi(this.props.user.login)
        if (userRepos) {
            this.setState({
                repos: userRepos
            }, () => this.toggleLoader())
        }
    }

    render() {
        if (this.state.inspectRepo) {
            return (
                <RepoInfoPage
                    repo={inspectedRepo}
                    user={this.props.user}
                    returnButton={() => this.toggleInspectRepo()}
                />
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", backgroundColor: "#042A2B" }}>
                    <TouchableOpacity onPress={() => this.props.returnButton()} style={styles.returnButton}>
                        <Icon name="chevron-left" size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerView}>
                        Repositórios
                    </Text>
                </View>

                <ScrollView style={{ flex: 1 }}>
                    <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        style={styles.loaderPlaceHolder}
                        autoRun={true}
                        visible={this.state.loader}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Image style={styles.profilePicture} source={{ uri: this.props.user.avatar_url }} />
                            <Text style={styles.userName}>{this.props.user.login}</Text>

                            <ScrollView>
                                {this.state.repos.map(repo => (<Repo repo={repo}
                                    key={repo.name}
                                    inspectRepo={() => this.inspectRepo(repo)}
                                />))}
                            </ScrollView>
                        </View>
                    </ShimmerPlaceHolder>
                </ScrollView>

                <TouchableOpacity style={styles.deleteButton} onPress={() => this.toggleModal()}>
                    <Icon name="trash-o" size={30} color="white" />
                    <Text style={styles.deleteButtonText}>Remover Usuário</Text>
                </TouchableOpacity>

                <Modal isVisible={this.state.deleteUserModal} onBackdropPress={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitleText}>Tem Certeza?</Text>

                        <Text style={styles.modalMiddleText}>
                            Tem certeza que deseja remover o usuário
                            <Text style={{ fontWeight: 'bold', }}>{" " + this.props.user.login}</Text>
                            ?
                        </Text>

                        <TouchableOpacity onPress={() => this.props.deleteUser(this.props.user.name)} style={styles.deleteButtonModal}>
                            <Icon name="trash-o" size={30} color="white" />
                            <Text style={styles.deleteButtonModalText}>Remover</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    //Loader (ShimmerPlaceHolder)
    loaderPlaceHolder:{
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
    },

    //Modal window to delete an user
    modal: {
        backgroundColor: 'white',
        height: 200,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitleText: {
        marginTop: 14,
        color: "black",
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalMiddleText: {
        fontSize: 14,
        marginTop: 15,
        alignContent: 'center',
    },
    deleteButtonModal: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 34,
        height: 60,
        width: 300,
        borderRadius: 10,
        backgroundColor: "#042A2B",
    },
    deleteButtonModalText: {
        color: "white",
        fontSize: 18,
        marginLeft: 14,
    },

    //Inspect repo button
    openRepButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: 363,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: "#5EB1BF",
    },
    openRepButtonText: {
        color: "white",
        fontSize: 18,
        textAlign: 'center',
        textAlignVertical: 'center',
    },

    //Delete button styles
    deleteButtonText: {
        color: "white",
        fontSize: 20,
        marginLeft: 14,
    },
    deleteButton: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 24,
        height: 60,
        width: 360,
        borderRadius: 10,
        backgroundColor: "#CA4141",
    },

    //User name style
    userName: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 15,
    },

    //Profile picture styles
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginTop: 20,
    },

    //"Repositórios" header
    headerView: {
        paddingRight: "15%",
        width: "100%",
        backgroundColor: "#042A2B",
        textAlign: 'center',
        textAlignVertical: 'center',
        height: 60,
        fontSize: 18,
        color: "#FFFFFF",
    },

    //Return button icon
    returnButton: {
        marginTop: 15,
        marginLeft: 15,
        height: "100%",
        textAlignVertical: 'center',
    },
})