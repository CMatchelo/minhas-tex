import Router from "next/router";
import Cookies from "js-cookie"
import { createContext, useEffect, useState } from "react";
import firebaseApp from "../../firebase/config";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, onIdTokenChanged, GoogleAuthProvider, User as FirebaseUser } from "firebase/auth";
import User from "../../model/User";
import { clearCache } from "../cache/localCache";

const auth = getAuth(firebaseApp);

interface AuthContextProps {
    user?: User
    loading?: boolean
    login?: (email: string, password: string) => Promise<void>
    register?: (email: string, password: string) => Promise<void>
    loginGoogle?: () => Promise<void>
    logout?: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({})

async function userNorm(userFirebase: FirebaseUser): Promise<User> {
    const token = await userFirebase.getIdToken()
    return {
        uid: userFirebase.uid,
        name: userFirebase.displayName,
        email: userFirebase.email,
        token,
        provider: userFirebase.providerData?.[0]?.providerId,
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

    async function managerSession(userFirebase: FirebaseUser | null) {
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

    async function login(email: string, password: string) {
        try {
            setLoading(true)
            const resp = await signInWithEmailAndPassword(auth, email, password)
            await managerSession(resp.user)
            Router.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function register(email: string, password: string) {
        try {
            setLoading(true)
            const resp = await createUserWithEmailAndPassword(auth, email, password)
            await managerSession(resp.user)
            Router.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function loginGoogle() {
        try {
            setLoading(true)
            const resp = await signInWithPopup(auth, new GoogleAuthProvider())
            await managerSession(resp.user)
            Router.push('/')
        } finally {
            setLoading(false)
        }
    }

    async function logout() {
        try {
            setLoading(true)
            const uid = user?.uid
            await signOut(auth)
            await managerSession(null)
            if (uid) clearCache(uid)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (Cookies.get('myTexAuth')) {
            const cancel = onIdTokenChanged(auth, managerSession)
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