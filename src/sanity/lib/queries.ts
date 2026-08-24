import { groq } from 'next-sanity'

export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product" && inStock == true] | order(_createdAt desc) {
    _id,
    title,
    slug,
    mainImage,
    hoverImage,
    price,
    category,
    featured
  }
`

export const FEATURED_PRODUCTS_QUERY = groq`
  *[_type == "product" && featured == true && inStock == true] | order(_createdAt desc) {
    _id,
    title,
    slug,
    mainImage,
    hoverImage,
    price,
    category
  }
`

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    hoverImage,
    price,
    category,
    description,
    inStock,
    featured
  }
`
