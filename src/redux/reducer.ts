import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import firebase from "firebase";
import {db} from "../firebase/firebase";

export type UserType = {
    email: string
    name: string
    sex: string
    id: string
}

let initialState = {
    auth: false as boolean,
    user: null as any,
    darkMode: true as boolean,
    preloader: false as boolean,
    lang: 'en' as string,
    languagePackage: {
        en: {
            darkMode: 'Dark Mode',
            login: 'login',
            logOut: 'Logout',
            notification: 'You have to login before make this action'
        },
        ru: {
            darkMode: 'Темная',
            login: 'логин',
            logOut: 'Выйти',
            notification: 'Авторизуйтесь для совершения данного действия'
        }
    },
    favorites: [] as any,
    users: [] as any
}


const slice = createSlice({
    initialState: initialState,
    name: 'reducer',
    reducers: {
        isAuth(state, action: PayloadAction<{ value: boolean }>) {
            state.auth = action.payload.value
        },
        setDarkMod(state, action: PayloadAction<{ value: boolean }>) {
            state.darkMode = action.payload.value
        },
        setUserData(state, action: PayloadAction<{ user: any }>) {
            state.user = action.payload.user
        },
        setPreloader(state, action: PayloadAction<{ value: boolean }>) {
            state.preloader = action.payload.value
        },
        setLanguage(state, action: PayloadAction<{ value: 'ru' | 'en' | string }>) {
            state.lang = action.payload.value
        },
        addUserAC(state, action: PayloadAction<{name: string, email: string, sex: string}>) {
            state.users.push(action.payload)
        },
        setUsers(state, action: PayloadAction<{users: Array<UserType>}>) {
           state.users = action.payload.users
        },
        setFavorites(state, action: PayloadAction<{users: Array<UserType>}>) {
            state.favorites = action.payload.users
        },

    },
    extraReducers: (builder) => {

    }
})

export const {isAuth, setDarkMod, setUserData, setPreloader, setLanguage, addUserAC, setUsers, setFavorites} = slice.actions

//Thunks----------------------------------------------------------------------------------------------------------------

export const login = createAsyncThunk('reducer/login', async (arg, thunkAPI) => {

    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')

    const result = await firebase.auth().signInWithPopup(provider)

    try {
        let userData = {
            email: result.user?.email,
            photoURL: result.user?.photoURL
        }
        thunkAPI.dispatch(setUserData({user: userData}));
        thunkAPI.dispatch(isAuth({value: true}))


        await thunkAPI.dispatch(getFavorites())

        //await dispatch(addMoviesListener())
    } catch (e) {
        console.log(e)
    } finally {

    }
})

export const authMe = createAsyncThunk('reducer/authMe', async (arg, thunkAPI) => {
    thunkAPI.dispatch(setPreloader({value: true}))

    try {
        await firebase
            .auth()
            .onAuthStateChanged(async (user) => {
                if (user !== null) {
                    let userData = {
                        email: user.email,
                        photoURL: user.photoURL
                    }

                    thunkAPI.dispatch(setUserData({user: userData}));
                    thunkAPI.dispatch(isAuth({value: true}))
                    thunkAPI.dispatch(addUserListener())
                    thunkAPI.dispatch(addFavoritesListener())

                } else {
                    thunkAPI.dispatch(setUserData({user: null}));
                }
                thunkAPI.dispatch(setPreloader({value: false}))
            })


    } catch (e) {
        console.log(e)
    }

})

export const logOut = createAsyncThunk('reducer/logOut', async (arg, thunkAPI) => {

    await firebase.auth().signOut()
    thunkAPI.dispatch(isAuth({value: false}))
    await thunkAPI.dispatch(authMe())

})

export const initializeApp = createAsyncThunk('reducer/initializeApp', (arg, thunkAPI) => {
    thunkAPI.dispatch(authMe())
    thunkAPI.dispatch(getUsers())
})

//----------------------------------------------------------------------------------------------------------------------

export const getUsers = createAsyncThunk('reducer/addUser', async (arg, thunkAPI) => {

    let data = await db.collection('users').get()
    let users: UserType[] = []
    data.forEach((doc) => {
        // @ts-ignore
        //users[doc.id] = doc.data()
        users.push(doc.data())
    })
    thunkAPI.dispatch(setUsers({users}))
})

export const addUserListener = createAsyncThunk('reducer/addUserListener', async (arg, thunkAPI) => {

    const usersCollection = db.collection('users')

    usersCollection.onSnapshot(async doc => {
        const data = await usersCollection.get()
        let users: UserType[] = []
        data.forEach((doc) => {
            // @ts-ignore
            users.push(doc.data())
        })
        thunkAPI.dispatch(setUsers({users}))

    })
})

export const addUser = createAsyncThunk('reducer/addUser', async (user: UserType, thunkAPI) => {
    await db.collection('users').doc(user.id).set(user)
})

export const deleteUser = createAsyncThunk('reducer/deleteUser', async (id: string, thunkAPI) => {

    await db.collection('users').doc(id).delete()
})

//----------------------------------------------------------------------------------------------------------------------

export const getFavorites = createAsyncThunk('reducer/getFavorites', async (arg, thunkAPI) => {

    const userId = firebase.auth().currentUser?.uid
    const moviesColl = db.collection('favorites').doc(`${userId}`).collection('favorites')

    const data = await moviesColl.get()



    let users: UserType[] = []
    data.forEach((e) => {
        // @ts-ignore
        //users[doc.id] = doc.data()
        users.push(e.data())
    })
    thunkAPI.dispatch(setFavorites({users}))
})

export const addFavoritesListener = createAsyncThunk('reducer/addFavoritesListener', async (arg, thunkAPI) => {

    const usersCollection = db.collection('users')

    usersCollection.onSnapshot(async doc => {
        const data = await usersCollection.get()
        let users: UserType[] = []
        data.forEach((doc) => {
            // @ts-ignore
            users.push(doc.data())
        })
        thunkAPI.dispatch(setUsers({users}))

    })
})

export const addToFavorites = createAsyncThunk('reducer/addToFavorites', async (user: UserType, thunkAPI) => {
    await db.collection('favorites').doc(user.id).collection('favorites').doc(`${user.id}`).set(user)
})

//----------------------------------------------------------------------------------------------------------------------

export const reducer = slice.reducer

