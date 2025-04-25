import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props {
  currentValue: number;
  maxQuantity: number;
  onChangeQuantity: (quantity: number) => void;
}
export const ItemCounter: FC<Props> = ({ currentValue, maxQuantity, onChangeQuantity }) => {
  
  return (
    <Box display={'flex'} alignItems='center'>
          { currentValue <= 1
            ? (
              <IconButton>
                <RemoveCircleOutline  />
              </IconButton>
            )
            : (
              <IconButton 
                onClick={() => onChangeQuantity( currentValue - 1 )}
              >
                <RemoveCircleOutline />
              </IconButton>
            )
        }
        <Typography sx={{ width: 40, textAlign: 'center' }}> {currentValue} </Typography>
         {
          currentValue >= maxQuantity
            ?(
              <IconButton>
                <AddCircleOutline />
              </IconButton>
            )
            :(
              <IconButton 
                onClick={() => onChangeQuantity( currentValue + 1 )}
              >
                <AddCircleOutline   />
              </IconButton>
            )
         }    
    </Box>
  )
}