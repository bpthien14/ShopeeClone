import React, { useMemo } from 'react'
import NextLink from 'next/link'
import useSWR from 'swr'
import { AddOutlined} from '@mui/icons-material'
import { Button, CardMedia, Chip, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Container, Typography, Box } from '@mui/material';
import Layout from '../layout'
import { FullScreenLoading } from '../../../../components/ui/fullScreenLoading'
import { IProduct } from '../../../../../../backend/src/modules/product/product.interface'

const columns: GridColDef[] = [
    {field: 'photoUrls', headerName: 'Image', width: 100, renderCell: (params) => (
        <CardMedia
            component='img'
            alt={params.row.name}
            image={params.row.photoUrls[0]}
            sx={{ borderRadius: 1, height: 50, width: 50 }}
        />
    )},
    {field: 'name', headerName: 'Name', width: 250, renderCell: (params) => (
        <Link component={NextLink} href={`/merchant/products/${params.row.merchant}`} underline='always'>
            {params.row.name}
        </Link>
    )},
    {field: 'description', headerName: 'Description', width: 250},
    {field: 'merchant', headerName: 'Merchant', width: 250},
    {field: 'status', headerName: 'Status'},
    {field: 'stockAmount', headerName: 'Stock Amount'},
    {field: 'unitPrice', headerName: 'Unit Price'},
    {field: 'comparePrice', headerName: 'Compare Price'},
    {field: 'ratings', headerName: 'Ratings'},
]


export default function ProductPage(): React.JSX.Element {

    const {data, error} = useSWR<IProduct[]>('/merchant/dashboard/products')

    const rows = useMemo(()=> { 
        if ( data ) {
            return (
                data.map((product: IProduct): IProduct => ({
                    photoUrls: [product.photoUrls[0]],
                    name: product.name,
                    description: product.description,
                    unitPrice: product.unitPrice,
                    comparePrice: product.comparePrice,
                    stockAmount: product.stockAmount,
                    status: product.status,
                    ratings: product.ratings,
                    merchant: product.merchant,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                })
            ))
        }
    }, [data])
  return ( 
    <Container maxWidth={false}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
            Products
            <Chip label={data?.length} color='secondary' variant='outlined' sx={{ ml: 2 }} />
            <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
                <Button
                    startIcon={<AddOutlined />}
                    color='secondary'
                    href='/merchant/products/create'
                >
                    Create Product
                </Button>
            </Box>
            {!data && !error 
                ? (<FullScreenLoading />) 
                : ( <Grid container className='fadeIn' item xs={12} sx={{ height:650, width: '100%' }}>
                        <DataGrid
                            rows={ rows }
                            columns={ columns }
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[10]}
                        />
                    </Grid>)}    
        </Typography>
      </Box>
    </Container>
  )
}

