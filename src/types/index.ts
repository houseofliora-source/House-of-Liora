import { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  alt?: string
}

export interface Product {
  _id: string
  title: string
  slug: {
    current: string
  }
  mainImage: SanityImage
  hoverImage?: SanityImage
  price: number
  category: string
  description?: PortableTextBlock[]
  inStock: boolean
  featured: boolean
}

export type ScrollStep = 0 | 1 | 2 | 3

export interface PaymentMethod {
  id: 'cod' | 'bkash' | 'nagad'
  label: string
  icon: string
}
