import React from "react"
import SideMenu from "./SideMenu"
import BottomNav from "./BottomNav"
import TopBar from "./TopBar"
import Content from "./Content"
import useAppData from "../../data/hook/useAppData"
import AuthCheck from "../auth/CheckAuth"

interface LayoutProps {
    title: string
    subtitle: string
    children?: any
    sortedIssues?: any[]
}

export default function Layout(props: LayoutProps) {

    const { theme } = useAppData()

    return (
        <AuthCheck>
            <div className={`${theme} flex h-screen w-full overflow-hidden`}>
                <SideMenu />
                <div className="flex flex-col flex-1 min-w-0 bg-gray-300 dark:bg-gray-800">
                    <TopBar sortedIssues={props.sortedIssues} title={props.title} subtitle={props.subtitle} />
                    <Content>{props.children}</Content>
                </div>
                <BottomNav />
            </div>
        </AuthCheck>
    )
}
