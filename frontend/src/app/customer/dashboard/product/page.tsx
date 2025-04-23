import React, { FC, useContext, useState } from 'react'
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'

import { Box, Button, Chip, Grid, Typography } from '@mui/material'

import { ShopLayout } from '../../../../components/dashboard/layout/shop-layout'
import { ProductSlideShow } from '../../../../components/dashboard/product/productSlideShow'
import { ItemCounter } from '../../../../components/ui/itemCounter'
import { CartItem } from '../../../../apis/cart.api'
import { Product } from '../../../../apis/product.api'
import { ProductControllers } from '../../../../../../backend/src/modules/product/product.controller'
import { useCart } from '../../../../contexts/cart-context'
import { useRouter } from 'next/router'

interface Props {
  product: Product
}
const ProductPage: FC<Props> = ({ product }) => {
  // const router = useRouter();
  // const {products: product, isLoading, isError} = useProducts<IProduct>(`/products/${ router.query.slug }`)
  const {addItem} = useCart()
  const router = useRouter()
  const [tempCart, setTempCart] = useState<CartItem>({
    productId: product.merchant,
    productName: product.name,
    quantity: 1,
    price: product.unitPrice,   
  })


  const seletedQuantity = ( quantity: number) =>{
    setTempCart( currentProduct => ({
      ...currentProduct,
      quantity
    }))
  }

  const AddProduct = () => {
    if ( !tempCart.productId ) return
    addItem(tempCart)

    router.push('/cart')
  }
  return (
    <ShopLayout title={ product.name } pageDescription={ product.description }>
       <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 7 }>
                <ProductSlideShow images={ product.photoUrls }  />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Box display='flex' flexDirection={'column'}>
                    <Typography variant='h1' component='h1'>{ product.name }</Typography>
                    <Typography variant='subtitle1' component='h2'>{ `$${product.unitPrice}` }</Typography>
                    <Box sx={{ my: 2 }}>
                        <Typography variant='subtitle2'>Cantidad</Typography>
                        <ItemCounter 
                          currentValue = {tempCart.quantity}
                          onChangeQuantity = {seletedQuantity}
                          maxQuantity = { product.stockAmount }
                        />
                    </Box>


                    {
                      ( product.stockAmount > 0 )
                        ? (
                          <Button 
                            color="secondary" 
                            className='circular-btn'
                            onClick={AddProduct}
                          >
                           { tempCart.quantity > 0 
                              ?'Add to Cart'
                              :'Select Quantity'
                           }
                          </Button>
                        )
                        :(
                          <Chip label="Not available" color="error"  variant="outlined" />
                        )
                    }
                    <Box sx={{ mt: 3 }}>
                        <Typography variant='subtitle2'>Descripcion</Typography>
                        <Typography variant='body2'>{ product.description }</Typography>
                    </Box>
                </Box>
            </Grid>
       </Grid>
    </ShopLayout>
  )
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

export const getStaticPaths: GetStaticPaths = async (ctx) =>{
  const slugs: { slug: string }[] = await ProductControllers.getAllProductSlugs()
  return{
    paths: slugs.map(({ slug }: { slug: string })=>({
      params: {slug}
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps:GetStaticProps = async({params}) =>{

  const {slug = ''  } = params as {slug: string}
  
  const product = await ProductControllers.getProductBySlug(slug)
  if ( !product ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props:{
      product
    },
    revalidate: 60*60*24
  }
}
export default ProductPage