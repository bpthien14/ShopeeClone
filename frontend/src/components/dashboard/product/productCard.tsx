import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material'
import React, { FC, useMemo, useState } from 'react'
import { IProduct } from '../../../../../backend/src/modules/product/product.interface'
import NextLink from 'next/link'
interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const productImage = useMemo(()=>{
    return (isHovered
      ? product.photoUrls[1]
      : product.photoUrls[0])
  }, [isHovered, product.photoUrls])

  return(
    <Grid 
      item xs={6} 
      sm={4}
      onMouseEnter={()=> setIsHovered(true)}
      onMouseLeave={()=> setIsHovered(false)}
    >
        <Card>
        <NextLink href={`/products/${ product.slug }`} passHref prefetch={false}>
          <Link>
            <CardActionArea>
              {
                ( product.stockAmount === 0 ) && (
                  <Chip
                    color="primary"
                    label="No hay articulos dispinible"
                    sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px'}}
                  />
                )
              }
              <CardMedia
              component={'img'}
              className='fadeIn'
              image={ productImage }
              alt={ product.name }
              onLoad={()=>setIsImageLoaded(true)}
              >
              </CardMedia>
          </CardActionArea>
          </Link>
        </NextLink>
        </Card>
        <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
            <Typography fontWeight={700}>{ product.name }</Typography>
            <Typography fontWeight={400}>{ `$${ product.unitPrice }` }</Typography>
        </Box>
    </Grid>
  )
}