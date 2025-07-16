import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { auth, signOut, signIn } from '@/auth';
import { BadgePlus, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Navbar = async () => {
    const session = await auth();

    return (
        <header className='px-5 py-3 bg-white shadow-md font-work-sans'>
            <nav className='flex items-center justify-between'>
                <Link href='/' className='text-2xl font-bold text-gray-800'>
                    <Image src="/logo.png" alt="Logo" width={140} height={40} />
                </Link>

                <div className='flex items-center gap-5 text-black justify-center'>
                    {session && session?.user ? (
                        <>
                            <Link href="/startup/create">
                                <span className='max-sm:hidden'>Create</span>
                                <BadgePlus className='size-6 sm:hidden' />
                            </Link>

                            <form
                                action={async () => {
                                    'use server';
                                    await signOut();
                                }}
                                className='flex'
                            >
                                <button
                                    type="submit"
                                    className='text-gray-800 hover:text-gray-600 cursor-pointer'
                                >
                                    <span className='max-sm:hidden'>Log out</span>
                                    <LogOut className='size-6 sm:hidden text-red-500' />
                                </button>
                            </form>

                            <Link href={`/user/${session?.id}`}>
                                <Avatar className='size-10'>
                                    <AvatarImage
                                        src={session?.user?.image || ''}
                                        alt={session?.user?.name || ''}
                                    />
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            </Link>
                        </>
                    ) : (
                        <form
                            action={async () => {
                                'use server';
                                await signIn('github');
                            }}
                            className='text-gray-800 hover:text-gray-600'
                        >
                            <button
                                type='submit'
                                className='flex items-center gap-2'
                            >
                                Log in
                            </button>
                        </form>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar;
