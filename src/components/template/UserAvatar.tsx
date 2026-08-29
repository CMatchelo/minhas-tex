import Link from "next/link";
import Image from "next/image";
import useAuth from "../../data/hook/useAuth";
import userLogo from "../../../public/avatar.svg";

interface UserAvatarProps {
    className?: string
}

export default function UserAvatar(props: UserAvatarProps) {

    const { user } = useAuth()
    const src = user?.imageUrl ?? userLogo.src

    return (
        <Link href="/profile" aria-label="Ver perfil" className={props.className}>
            <Image
                src={src}
                alt={user?.name ?? "Avatar do usuário"}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover cursor-pointer ring-2 ring-transparent hover:ring-yellow-500 transition"
                unoptimized
            />
        </Link>
    )
}
