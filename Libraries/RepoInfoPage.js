import * as React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Linking } from 'react-native';
import Icon1 from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getRepoDetailsApi } from './apis'

//Repo info page
export default class RepoInfoPage extends React.Component {
    constructor() {
        super()
        this.state = {
            repo: {
                name: "",
                description: "",
                html_url: "",
                language: "",
            }
        }
    }

    componentDidMount() {
        this.importRepoDetails()
    }

    //Calls the API to import repo details
    importRepoDetails = async () => {
        let repoDescription = await getRepoDetailsApi(this.props.user.login, this.props.repo.name)
        if (repoDescription) {
            this.setState({
                repo: repoDescription
            })
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", backgroundColor: "#042A2B" }}>
                    <TouchableOpacity onPress={() => this.props.returnButton()} style={styles.returnButton}>
                        <Icon name="chevron-left" size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerView}>
                        {this.props.repo.name}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <Image style={styles.profilePicture} source={{ uri: this.props.user.avatar_url }} />
                        <Text style={styles.userName}>{this.props.user.login}</Text>

                        <Text style={styles.highlightText}>Descrição</Text>
                        <Text style={styles.regularText}>{this.state.repo.description}</Text>

                        <Text style={styles.highlightText}>Linguagem</Text>
                        <Text style={styles.regularText}>{this.state.repo.language}</Text>
                    </ScrollView>

                    <TouchableOpacity style={styles.accessButton}
                        onPress={() => Linking.canOpenURL(this.state.repo.html_url).then(() => { Linking.openURL(this.state.repo.html_url) })}>
                        <Icon1 name="arrow-redo" size={30} color="white" />
                        <Text style={styles.accessButtonText}>Acessar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    //Middle text
    regularText: {
        textAlign: 'justify',
        fontSize: 20,
        marginLeft: 30,
        marginTop: 10,
        marginRight: 30,
    },
    highlightText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 30,
        marginTop: 30,
    },

    //Access button
    accessButton: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 34,
        height: 60,
        width: 350,
        borderRadius: 10,
        backgroundColor: "#042A2B",
        marginBottom: 20,
    },
    accessButtonText: {
        color: "white",
        fontSize: 18,
        marginLeft: 10,
    },

    //Return button icon
    returnButton: {
        marginTop: 15,
        marginLeft: 15,
        height: "100%",
        textAlignVertical: 'center',
    },

    //Header
    headerView: {
        paddingRight: "10%",
        width: "100%",
        backgroundColor: "#042A2B",
        textAlign: 'center',
        textAlignVertical: 'center',
        height: 60,
        fontSize: 18,
        color: "#FFFFFF",
    },
    userName: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 15,
    },

    //Profile picture styles
    profilePicture: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        borderRadius: 10,
        marginTop: 20,
    },
})