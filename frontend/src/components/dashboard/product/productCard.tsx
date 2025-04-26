import React, { FC, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material';

import { IProduct } from '../../../../../backend/src/modules/product/product.interface';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return isHovered && product.photoUrls.length > 1 ? product.photoUrls[1] : product.photoUrls[0];
  }, [isHovered, product.photoUrls]);

  return (
    <Grid item xs={6} sm={4} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Card>
        <NextLink href={`/customer/dashboard/products/${product._id}`} passHref prefetch={false}>
          <Link>
            <CardActionArea>
              {product.stockAmount === 0 && (
                <Chip
                  color="primary"
                  label="Out of stock"
                  sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                />
              )}
              <Box sx={{ position: 'relative', paddingTop: '100%', width: '100%' }}>
                <CardMedia
                  component={'img'}
                  className="fadeIn"
                  image={productImage}
                  alt={product.name}
                  onLoad={() => setIsImageLoaded(true)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className="fadeIn">
        <Typography fontWeight={700}>{product.name}</Typography>
        <Typography fontWeight={400}>{`$${product.unitPrice}`}</Typography>
      </Box>
    </Grid>
  );
};
