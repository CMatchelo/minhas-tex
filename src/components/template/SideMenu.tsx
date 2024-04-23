import React from "react";
import MenuItem from "./MenuItem";
import { IconCollection, IconHome, IconLogout, IconSettings } from "../icons";
import TexLogo from '../../../public/texLogo.png';
import useAuth from "../../data/hook/useAuth";

export default function SideMenu() {

    const { logout } = useAuth()

    return (
        <aside className={`flex flex-col bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200`}>
            <div className="w-20 h-20 p-1 flex items-center justify-center bg-gradient-to-r from-black via-yellow-400 to-black">
                <img src={TexLogo.src} alt="Tex logo" />
            </div>
            <ul className={`flex-grow`}>
                <MenuItem url="/" text="Inicio" icon={IconHome} />
                <MenuItem url="/settings" text="Configurações" icon={IconSettings} />
                <MenuItem url="/collectionsInfos" text="Coleções" icon={IconCollection} />
            </ul>
            <ul>
                <MenuItem className={`text-red-600 dark:text-red-400 
                    hover:bg-red-400 dark:hover:text-white 
                    hover:text-white
                `} text="Sair" icon={IconLogout} onClick={logout} />
            </ul>
        </aside>
    )
}