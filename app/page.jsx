import { ModeToggle } from '@/components/ModeToggle'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
    return (
        <main className="m-2 p-2 pt-2 text-center ">
            <h1>My App</h1>
            <UserButton />
            <ModeToggle />
        </main>
    )
}
