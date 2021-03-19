import React, {useEffect} from 'react';
import './App.css';
import {CircularProgress, createMuiTheme, Paper, ThemeProvider} from "@material-ui/core";
import {grey, indigo} from "@material-ui/core/colors";
import {AppStateType} from "./redux/store";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, Route} from 'react-router-dom';
import {UsersTable} from './components/users/Users';
import {getUsers, initializeApp} from "./redux/reducer";
import {Header} from "./components/header/Header";


function App() {

    const {darkMode, preloader} = useSelector<AppStateType, any>(state => state.reducer)

    const theme = createMuiTheme({
        palette: {
            type: darkMode ? "dark" : "light",
            primary: {
                dark: grey[900],
                light: grey[700],
                main: darkMode ? grey[900] : grey[700],
            },
            secondary: {
                dark: indigo[300],
                light: grey[100],
                main: darkMode ? indigo[400] : grey[100],
            }
        }
    })

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeApp())


        dispatch(getUsers())

    }, [dispatch])

    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={0} square style={{minHeight: '100vh', boxSizing: 'border-box'}}>

                {
                    preloader
                        ? <CircularProgress style={{position: "absolute", top: 50, left: '50%'}} color="secondary"/>
                        : <div>
                            <Header/>
                            <Route exact path='/'><Redirect to={'/users'}/></Route>
                            <Route path={'/users'} render={() => <UsersTable/>}/>
                            <Route path={'/user/:id'} render={() => <UsersTable/>}/>
                        </div>
                }

            </Paper>
        </ThemeProvider>
    );
}

export default App;
