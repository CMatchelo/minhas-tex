import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import MenuItem from "./MenuItem";
import { IconCollection, IconHome, IconLogout, IconInfos } from "../icons";
import TexLogo from "../../../public/texLogo.png";
import useAuth from "../../data/hook/useAuth";

export default function SideMenu() {

    const { logout } = useAuth()
    const { pathname } = useRouter()

    return (
        <aside className="hidden md:flex flex-col items-center bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200 w-20 shrink-0">
            <div className="w-20 h-20 p-3 flex items-center justify-center">
                <Image src={TexLogo} alt="Tex logo" className="max-h-full w-auto object-contain" priority />
            </div>
            <ul className="flex-grow">
                <MenuItem url="/" text="Início" icon={IconHome} active={pathname === "/"} />
                <MenuItem url="/settings" text="Infos" icon={IconInfos} active={pathname === "/settings"} />
                <MenuItem url="/collectionsInfos" text="Coleções" icon={IconCollection} active={pathname === "/collectionsInfos"} />
            </ul>
            <ul>
                <MenuItem
                    className="text-red-600 dark:text-red-400 hover:bg-red-400 hover:text-white dark:hover:text-white"
                    text="Sair"
                    icon={IconLogout}
                    onClick={logout}
                />
            </ul>
        </aside>
    )
}
