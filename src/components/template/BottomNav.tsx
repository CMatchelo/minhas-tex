import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconCollection, IconHome, IconLogout, IconInfos } from "../icons";
import useAuth from "../../data/hook/useAuth";

const ITEMS = [
    { url: "/", text: "Início", icon: IconHome },
    { url: "/settings", text: "Infos", icon: IconInfos },
    { url: "/collectionsInfos", text: "Coleções", icon: IconCollection },
]

export default function BottomNav() {
    const { logout } = useAuth()
    const { pathname } = useRouter()

    return (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch justify-around bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
            {ITEMS.map(item => {
                const active = pathname === item.url
                return (
                    <Link
                        key={item.url}
                        href={item.url}
                        className={`
                            flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px]
                            transition-colors
                            ${active
                                ? "text-yellow-600 dark:text-yellow-400 border-t-2 border-yellow-500 -mt-px"
                                : "border-t-2 border-transparent"}
                        `}
                    >
                        {item.icon}
                        <span>{item.text}</span>
                    </Link>
                )
            })}
            <button
                onClick={logout}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] text-red-600 dark:text-red-400 border-t-2 border-transparent"
            >
                {IconLogout}
                <span>Sair</span>
            </button>
        </nav>
    )
}
