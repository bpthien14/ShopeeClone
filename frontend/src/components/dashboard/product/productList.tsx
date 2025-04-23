import { Grid } from '@mui/material'
import React, { FC } from 'react'
import { IProduct } from '../../../../../backend/src/modules/product/product.interface'
import { ProductCard } from './productCard'

interface Props {
    products: IProduct[]
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container  spacing={4}>
        {
            products.map( (product: IProduct) => (
                <ProductCard 
                    product={ product }
                    key={ product.slug }
                />
            ))
        }
    </Grid>
  )
}