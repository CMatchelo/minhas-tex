import Link from "next/link";
import useAuth from "../../data/hook/useAuth";
import userLogo from '../../../public/avatar.svg'

interface UserAvatarProps {
    className?: string
}

export default function UserAvatar(props: UserAvatarProps) {

    const { user } = useAuth()

    return (
        <div>
            <Link href='/profile'>
                <img src={user?.imageUrl ?? userLogo.src} alt="User avatar" className={`
                    h-9 w-9 rounded-full cursor-pointer ${props.className}
                `} />
            </Link>
        </div>
    )
}