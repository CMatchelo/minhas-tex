import React, { useState } from "react";
import AuthInput from "../src/components/auth/AuthInput";
import collectionBg from '../public/collectionBg.jpg'
import { IconWarning } from "../src/components/icons";
import useAuth from "../src/data/hook/useAuth";

export default function Auth() {

    const { loginGoogle, login, register } = useAuth()

    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState()

    async function submit() {
        try {
            if (mode === 'login') {
                await login(email, password)
                showError('Ocorreu um erro no login')
            } else {
                await register(email, password)
                showError('Ocorreu um erro no cadastro')
            }
        } catch(e) {
            console.log(e)
            showError(e?.message.message ?? 'Ocorreu um erro inesperado')
        }
    }

    function showError(msg, time = 5) {
        setError(msg)
        setTimeout(() => setError(null), time*1000)
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="hidden md:block md:w-1/2 lg:w-2/3">
                <img src={collectionBg.src} alt="Capa Tex" className="h-screen w-full object-cover filter grayscale blur-[1px]" />
            </div>
            <div className={`
            m-10 w-full md:w-1/2 lg:w-1/3
        `}>
                <h1 className={`
                text-3xl font-bold mb-5
            `}>
                    {mode === 'login' ? 'Entre com a sua conta' : 'Cadastre-se na plataforma'}
                </h1>

                {error ? (
                    <div className={`
                    flex items-center
                    bg-red-400 text-white py-3 px-5 my-2
                    border-red-700 rounded-lg
                `}>
                        {IconWarning(6)}
                        <span className="ml-3 text-sm">{error}</span>
                    </div>
                ) : false}

                <AuthInput
                    label="Email"
                    value={email}
                    valueChanged={setEmail}
                    type="email"
                    required
                />
                <AuthInput
                    label="Senha"
                    value={password}
                    valueChanged={setPassword}
                    type="password"
                    required
                />

                <button onClick={submit} className={`
                w-full bg-yellow-500 hover:bg-yellow-400
                text-white rounded-lg px-4 py-3 mt-6
            `}>
                    {mode === 'login' ? 'Entrar' : 'Cadastrar'}
                </button>

                <hr className="my-6 border-gray-300 w-full" />

                <button onClick={loginGoogle} className={`
                w-full bg-red-500 hover:bg-red-400
                text-white rounded-lg px-4 py-3
            `}>
                    Entrar com sua conta Google
                </button>

                {mode === 'login' ? (
                    <p className="mt-8">
                        Novo por aqui?
                        <a onClick={() => setMode('register')} className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer"> Crie uma conta</a>
                    </p>
                ) : (
                    <p className="mt-8">
                        Já tem uma conta?
                        <a onClick={() => setMode('login')} className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer"> Entre com suas credenciais</a>
                    </p>
                )}
            </div>
        </div>
    )
}