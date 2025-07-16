import React, { Suspense } from 'react';
import markdownit from "markdown-it";
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import StartupCard, { StartupCardType } from '@/components/StartupCard';

const md = markdownit({
    html: true,        // Enable HTML tags in source
    xhtmlOut: true,    // Use '/' to close single tags (<br />)
    breaks: true,      // Convert '\n' in paragraphs into <br>
    linkify: true,     // Autoconvert URL-like text to links
    typographer: true  // Enable some language-neutral replacement + quotes beautification
});
export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }>}) => {
    const { id } = await params;

    const [post, { select: editorPosts }] = await Promise.all([
        client.fetch(STARTUP_BY_ID_QUERY, { id }),
        client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'editor-picks' })
    ]);

    if (!post) return notFound();

    const parsedContent = md.render(post?.pitch || "");

    return (
        <>
            <section className='pink_container !min-h-[230px]'>
                <p className='tag'>{formatDate(post?._createdAt)}</p>
                <h1 className='heading'>{post.title}</h1>
                <p className='sub-heading !max-w-5xl'>{post.description}</p>
            </section>

            <section className='section_container'>

                <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
                    <div className='rounded-xl flex justify-center items-center overflow-hidden sm:h-96 h-60'>
                        <img src={post.image || ''} alt="thumbnail" className='w-full h-auto' />
                    </div>
                    <div className='flex-between gap-5'>
                        <Link href={`/user/${post.author?._id}`} className='flex items-center gap-2 mb-3'>
                            <Image
                                src={post.author?.image || ''}
                                alt="avatar"
                                className='rounded-full drop-shadow-lg'
                                width={64}
                                height={64}
                            />

                            <div>
                                <p className='text-20-medium'>{post.author?.name}</p>
                                <p className='text-16-medium !text-black-300'>@{post.author?.username}</p>
                            </div>
                        </Link>

                        <p className='category-tag'>{post.category}</p>
                    </div>

                    <h3 className='text-30-bold'>Pitch Details</h3>
                    {parsedContent ? (
                        <article
                            className="prose max-w-4xl font-work-sans"
                            dangerouslySetInnerHTML={{ __html: parsedContent }}
                        />
                    ) : (
                        <p className="no-result">No details provided</p>
                    )}
                </div>

                <hr className='divider' />

                {editorPosts?.length > 0 && (
                    <div className='max-w-4xl mx-auto'>
                        <p className='text-30-semibold'>Editor Picks</p>

                        <ul className='mt-7 card_grid-sm'>
                            {editorPosts.map((post: StartupCardType, i: number) => (
                                <StartupCard key={i} post={post} />
                            ))}
                        </ul>
                    </div>
                )}

                <Suspense fallback={<Skeleton className='view_skeleton' />}>
                    <View id={id} />
                </Suspense>
            </section>
        </>
    );
}

export default Page;
