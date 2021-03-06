import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import firebase from "firebase";
import {db} from "../firebase/firebase";

export type UserType = {
    email: string
    name: string
    sex: string
    id: string
}

export type UserBaseType = {
    email: string
    photoURL: string
}


let initialState = {
    auth: false,
    user: null as UserBaseType | null,
    darkMode: true ,
    maleOnly: false,
    preloader: false ,
    lang: 'en' as 'en' | 'ru',
    languagePackage: {
        en: {
            darkMode: 'Dark',
            login: 'login',
            logOut: 'Logout',
            notification: 'You have to login before make this action',
            deleteConfirm: 'Do you really want to delete this user?',
            email: 'Email',
            name: 'Name',
            go: 'Go',
            invalidEmail: 'Invalid email',
            sex: 'Sex',
            male: 'Male',
            female: 'Female',
            maleOnly: 'Male Only'
        },
        ru: {
            darkMode: 'Темная',
            login: 'логин',
            logOut: 'Выйти',
            notification: 'Авторизуйтесь для совершения данного действия',
            deleteConfirm: 'Вы действительно хотите удалить этого пользователя?',
            email: 'Почта',
            name: 'Имя',
            go: 'Поехали',
            invalidEmail: 'Некорректный формат',
            sex: 'Пол',
            male: 'Мужской',
            female: 'Женский',
            maleOnly: 'Только мужчины'
        }
    },
    users: [] as UserType[]
}


const slice = createSlice({
    initialState: initialState,
    name: 'reducer',
    reducers: {
        isAuth(state, action: PayloadAction<{ value: boolean }>) {
            state.auth = action.payload.value
        },
        setMaleOnly(state, action: PayloadAction<{ value: boolean }>) {
            state.maleOnly = action.payload.value
        },
        setDarkMod(state, action: PayloadAction<{ value: boolean }>) {
            state.darkMode = action.payload.value
        },
        setUserData(state, action: PayloadAction<{ user: UserBaseType | null }>) {
            state.user = action.payload.user
        },
        setPreloader(state, action: PayloadAction<{ value: boolean }>) {
            state.preloader = action.payload.value
        },
        setLanguage(state, action: PayloadAction<{ value: 'ru' | 'en'}>) {
            state.lang = action.payload.value
        },
        setUsers(state, action: PayloadAction<{ users: Array<UserType> }>) {
            state.users = action.payload.users
        },
    },
    extraReducers: (builder) => {

    }
})

export const {isAuth, setDarkMod, setUserData, setPreloader, setLanguage, setUsers, setMaleOnly} = slice.actions

//Thunks----------------------------------------------------------------------------------------------------------------

export const login = createAsyncThunk('reducer/login', async (arg, thunkAPI) => {

    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')

    const result = await firebase.auth().signInWithPopup(provider)

    try {
        let userData = {
            email:result.user ? result.user.email || '' : '',
            photoURL:result.user ? result.user.photoURL || '' : ''
        }
        thunkAPI.dispatch(setUserData({user: userData}));
        thunkAPI.dispatch(isAuth({value: true}))
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
                        email: user.email || '',
                        photoURL: user.photoURL || ''
                    }

                    thunkAPI.dispatch(setUserData({user: userData}));
                    thunkAPI.dispatch(isAuth({value: true}))
                    thunkAPI.dispatch(addUserListener())
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
    try {
        await firebase.auth().signOut()
        thunkAPI.dispatch(isAuth({value: false}))
        await thunkAPI.dispatch(authMe())
    } catch (e) {
        console.log(e)
    }


})

export const initializeApp = createAsyncThunk('reducer/initializeApp', (arg, thunkAPI) => {
    try {
        thunkAPI.dispatch(authMe())
        thunkAPI.dispatch(getUsers())
    } catch (e) {
        console.log(e)
    }

})

//----------------------------------------------------------------------------------------------------------------------

export const getUsers = createAsyncThunk('reducer/addUser', async (arg, thunkAPI) => {
    try {
        let data = await db.collection('users').get()
        let users: UserType[] = []
        data.forEach((doc) => {
            users.push(doc.data() as UserType)
        })
        thunkAPI.dispatch(setUsers({users}))
    } catch (e) {
        console.log(e)
    }
})

export const addUserListener = createAsyncThunk('reducer/addUserListener', async (arg, thunkAPI) => {
    try {
        const usersCollection = db.collection('users')

        usersCollection.onSnapshot(async doc => {
            const data = await usersCollection.get()
            let users: UserType[] = []
            data.forEach((doc) => {
                users.push(doc.data() as UserType)
            })
            thunkAPI.dispatch(setUsers({users}))

        })
    } catch (e) {
        console.log(e)
    }

})

export const addUser = createAsyncThunk('reducer/addUser', async (user: UserType, thunkAPI) => {
    try {
        await db.collection('users').doc(user.id).set(user)
    } catch (e) {
        console.log(e)
    }

})

export const deleteUser = createAsyncThunk('reducer/deleteUser', async (id: string, thunkAPI) => {
    try {
        await db.collection('users').doc(id).delete()
    } catch (e) {

    }

})

//----------------------------------------------------------------------------------------------------------------------


export const reducer = slice.reducer

