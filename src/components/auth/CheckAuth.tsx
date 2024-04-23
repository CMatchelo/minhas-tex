import Head from "next/head"
import Image from "next/image"
import LoadingGif from "../../../public/loading.gif"
import useAuth from "../../data/hook/useAuth"
import Router from "next/router"
export default function AuthCheck(props) {

    const { user, loading } = useAuth()

    function renderContent() {
        return (
            <>
                <Head>
                    <script dangerouslySetInnerHTML={{
                        __html:  `
                            if(!document.cookie?.includes("myTexAuth")) {
                                window.location.href = '/auth'
                            }
                        `
                    }}>
                    </script>
                </Head>
                {props.children}
            </>
        )
    }

    function renderLoading() {
        return (
            <div className={`
                flex justify-center items-center h-screen
            `}>
                <Image src={LoadingGif} alt="Loading" />
            </div>
        )
    }

    if (!loading && user?.email) {
        return renderContent()
    } else if (loading) {
        return renderLoading()
    } else {
        Router.push('/auth')
        return null
    }
}