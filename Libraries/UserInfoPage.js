import * as React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modal'
import { getAllReposFromApi } from './apis'
import RepoInfoPage from './RepoInfoPage'

const Repo = props => (
    <TouchableOpacity style={styles.openRepButton} onPress={props.inspectRepo}>
        <Text style={styles.openRepButtonText}>{props.repo.name}</Text>
    </TouchableOpacity>
)

//carrys the current repo that is being inspected
var inspectedRepo = {}

export default class UserInfoPage extends React.Component {
    constructor() {
        super()
        this.state = {
            repos: [],
            deleteUserModal: false,
            inspectRepo: false
        }
    }

    componentDidMount() {
        this.importReposFromUser()
    }

    inspectRepo(repo) {
        inspectedRepo = repo
        this.toggleInspectRepo()
    }

    toggleInspectRepo() {
        this.setState(prevState => ({ inspectRepo: !prevState.inspectRepo }))
    }

    toggleModal() {
        this.setState(prevState => ({ deleteUserModal: !prevState.deleteUserModal }))
    }

    importReposFromUser = async () => {
        let userRepos = await getAllReposFromApi(this.props.user.login)
        if (userRepos) {
            this.setState({
                repos: userRepos
            })
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
                    <View style={{ alignItems: 'center' }}>
                        <Image style={styles.profilePicture} source={{ uri: this.props.user.avatar_url }} />
                        <Text style={styles.userName}>{this.props.user.login}</Text>

                        <ScrollView>
                            {this.state.repos.map(repo => (<Repo repo={repo}
                                inspectRepo={() => this.inspectRepo(repo)}
                            />))}
                        </ScrollView>

                        <TouchableOpacity style={styles.deleteButton} onPress={() => this.toggleModal()}>
                            <Icon name="trash-o" size={30} color="white" />
                            <Text style={styles.deleteButtonText}>Remover Usuário</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

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
    //Modal window to add new users
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
    //delete button styles
    deleteButtonText: {
        color: "white",
        fontSize: 20,
        marginLeft: 14,
    },
    deleteButton: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
        height: 60,
        width: 360,
        borderRadius: 10,
        backgroundColor: "#CA4141",
    },
    //user name style
    userName: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 15,
    },
    //profile picture styles
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

    //return button icon
    returnButton: {
        marginTop: 15,
        marginLeft: 15,
        height: "100%",
        textAlignVertical: 'center',
    },
})