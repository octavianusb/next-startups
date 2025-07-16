import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY = defineQuery(
    `*[_type == 'startup' && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
        _createdAt,
        _id,
        author -> {
            _id,
            bio,
            image,
            name,
        },
        category,
        description,
        image,
        slug,
        title,
        views,
    }`
);

export const STARTUP_BY_ID_QUERY = defineQuery(
    `*[_type == 'startup' && _id == $id][0]{
        _createdAt,
        _id,
        author -> {
            _id,
            bio,
            image,
            name,
            username,
        },
        category,
        description,
        image,
        slug,
        title,
        views,
        pitch,
    }`
);

export const STARTUP_VIEWS_QUERY = defineQuery(
    `*[_type == 'startup' && _id == $id][0]{
        _id, views
    }`
);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(
    `*[_type == 'author' && id == $id][0]{
        _id,
        id,
        bio,
        email,
        image,
        name,
        username,
    }`
);

export const AUTHOR_BY_ID_QUERY = defineQuery(
    `*[_type == 'author' && _id == $id][0]{
        _id,
        id,
        bio,
        email,
        image,
        name,
        username,
    }`
);

export const STARTUPS_BY_AUTHOR_QUERY = defineQuery(
    `*[_type == 'startup' && defined(slug.current) && author._ref == $id] | order(_createdAt desc) {
        _createdAt,
        _id,
        author -> {
            _id,
            bio,
            image,
            name,
        },
        category,
        description,
        image,
        slug,
        title,
        views,
    }`
);

export const PLAYLIST_BY_SLUG_QUERY = defineQuery(
    `*[_type == "playlist" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        select[]->{
            _id,
            _createdAt,
            title,
            slug,
            author->{
                _id,
                name,
                slug,
                image,
                bio
            },
            views,
            description,
            category,
            image,
            pitch
        }
    }`
);
