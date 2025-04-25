'use client'
import React, { FC, useContext, useState, useEffect } from 'react'
// import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'

import { Box, Button, Chip, Grid, Typography, Container } from '@mui/material'

import { ShopLayout } from '../../../../components/dashboard/layout/shop-layout'
import { ProductSlideShow } from '../../../../components/dashboard/product/productSlideShow'
import { ItemCounter } from '../../../../components/ui/itemCounter'
// import { CartItem } from '../../../../apis/cart.api'
import { Product } from '../../../../apis/product.api'
// import { ProductControllers } from '../../../../../../backend/src/modules/product/product.controller'
// import { useCart } from '../../../../contexts/cart-context'
// import { useRouter } from 'next/router'
// import { useProducts } from '@/hooks/use-product'
import { Stack } from '@mui/material';

interface Props {
  product: Product
}
export default function ProductPage({ product }: Props): React.JSX.Element {
  const [tempCart, setTempCart] = useState<{ quantity: number }>({ quantity: 0 });

  function seletedQuantity(quantity: number): void {
    setTempCart({ quantity });
  }

  function AddProduct(): void {
    // Logic to add the product to the cart
    console.log(`Adding ${tempCart.quantity} of ${product.name} to the cart`);
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Products Details</Typography>
      </div>

      <ShopLayout title={product.merchant} pageDescription={product.description}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <ProductSlideShow images={product.photoUrls} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h1" component="h1">
                {product.name}
              </Typography>
              <Typography variant="subtitle1" component="h2">
                {`$${product.unitPrice}`}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle2">Cantidad</Typography>
                <ItemCounter
                  currentValue={tempCart.quantity}
                  onChangeQuantity={seletedQuantity}
                  maxQuantity={product.stockAmount}
                />
              </Box>

              {product.stockAmount > 0 ? (
                <Button
                  color="secondary"
                  className="circular-btn"
                  onClick={AddProduct}
                >
                  {tempCart.quantity > 0 ? 'Add to Cart' : 'Select Quantity'}
                </Button>
              ) : (
                <Chip label="Not available" color="error" variant="outlined" />
              )}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2">Descripcion</Typography>
                <Typography variant="body2">{product.description}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ShopLayout>
    </Stack>
  );
}

// no usar server side rendering 
// export const getServerSideProps:GetServerSideProps = async({ params }) =>{

//   const {slug = '' } = params as { slug: string }
//   const product = await dbProducts.getProductBySlug( slug )
  
//   if ( !product ) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }
  
//   return {
//     props:{
//       product
//     }
//   }

// }

// export const getStaticPaths: GetStaticPaths = async (ctx) =>{
//   const slugs: { slug: string }[] = await ProductControllers.getAllProductSlugs()
//   return{
//     paths: slugs.map(({ slug }: { slug: string })=>({
//       params: {slug}
//     })),
//     fallback: 'blocking'
//   }
// }

// export const getStaticProps:GetStaticProps = async({params}) =>{

//   const {slug = ''  } = params as {slug: string}
  
//   const product = await ProductControllers.getProductBySlug(slug)
//   if ( !product ) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }
//   return {
//     props:{
//       product
//     },
//     revalidate: 60*60*24
//   }
// }

