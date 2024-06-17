import Router from "next/router";
import Cookies from "js-cookie"
import { createContext, useEffect, useState } from "react";
import firebase from "../../firebase/config";
import User from "../../model/User";

interface AuthContextProps {
    user?: User
    loading?: boolean
    login?: (email: string, password: string) => Promise<void>
    register?: (email: string, password: string) => Promise<void>
    loginGoogle?: () => Promise<void>
    logout?: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({})

async function userNorm(userFirebase: firebase.User): Promise<User> {
    const token = await userFirebase.getIdToken()
    return {
        uid: userFirebase.uid,
        name: userFirebase.displayName,
        email: userFirebase.email,
        token,
        provider: userFirebase.providerData[0].providerId,
        imageUrl: userFirebase.photoURL
    }
}

function cookiesManager(logged: boolean) {
    if (logged) {
        Cookies.set('myTexAuth', logged, {
            expires: 7
        })
    } else {
        Cookies.remove('myTexAuth')
    }
}

export function AuthProvider(props) {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User>(null)

    async function managerSession(userFirebase) {
        if (userFirebase?.email) {
            const localUser = await userNorm(userFirebase)
            setUser(localUser)
            cookiesManager(true)
            setLoading(false)
            return localUser.email
        } else {
            setUser(null)
            cookiesManager(false)
            setLoading(false)
            return false
        }
    }

    async function login(email, password) {
        try {
            setLoading(true)
            const resp = await firebase.auth()
                .signInWithEmailAndPassword(email, password)
            await managerSession(resp.user)
            Router.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function register(email, password) {
        try {
            setLoading(true)
            const resp = await firebase.auth()
                .createUserWithEmailAndPassword(email, password)
            await managerSession(resp.user)
            Router.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function loginGoogle() {
        try {
            setLoading(true)
            const resp = await firebase.auth().signInWithPopup(
                new firebase.auth.GoogleAuthProvider()
            )
            await managerSession(resp.user)
            Router.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        try {
            setLoading(true)
            await firebase.auth().signOut()
            await managerSession(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (Cookies.get('myTexAuth')) {
            const cancel = firebase.auth().onIdTokenChanged(managerSession)
            return () => cancel()
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            register,
            login,
            loginGoogle,
            logout,
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext