import React, {useEffect, useState} from 'react';
import './App.css';
import {CircularProgress, createMuiTheme, Paper, ThemeProvider} from "@material-ui/core";
import {grey, indigo} from "@material-ui/core/colors";
import {AppStateType} from "./redux/store";
import {useDispatch, useSelector} from "react-redux";
import {Redirect, Route, useHistory} from 'react-router-dom';
import {UsersTable} from './components/users/Users';
import {getUsers, initializeApp, setDarkMod, setLanguage, UserType} from "./redux/reducer";
import {Header} from "./components/header/Header";
import {UserPage} from "./components/user-page/UserPage";


function App() {


    const {lang, darkMode, preloader} = useSelector<AppStateType, any>(state => state.reducer)

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

    const [isFirstRendering, setFirstRendering] = useState(true)

    const history = useHistory()
    const dispatch = useDispatch()



    useEffect(() => {
        dispatch(initializeApp())
        dispatch(getUsers())
    }, [dispatch])

    useEffect(() => {
        if (isFirstRendering) {
            const urlData: { [key: string]: string } = {}

            new URLSearchParams(history.location.search).forEach((value, key) => {
                urlData[key] = value
            })

            if (urlData.lang) {
                dispatch(setLanguage({value: urlData.lang as 'en' | 'ru'}))
            }
            if (urlData.darkMode === 'true') {
                dispatch(setDarkMod({value: true}))
            }
            if (urlData.darkMode === 'false') {
                dispatch(setDarkMod({value: false}))
            }
            setFirstRendering(false)
        }


    }, [lang, dispatch, history.location.search, isFirstRendering, darkMode])

    useEffect(() => {

        if (!isFirstRendering) {

            const searchObj: { [key: string]: string } = {}

            if (lang) searchObj.lang = lang
            searchObj.darkMode = darkMode

            const queryObj = new URLSearchParams(searchObj)

            history.push({
                search: queryObj.toString(),
            })
        }
    }, [lang, dispatch, history, isFirstRendering, darkMode])

    const users = useSelector<AppStateType, UserType[]>(state => state.reducer.users)

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
                            <Route path={'/user/:id'} render={() => <UserPage users={users}/>}/>
                        </div>
                }

            </Paper>
        </ThemeProvider>
    );
}

export default App;
