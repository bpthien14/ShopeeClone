import React, { useMemo } from 'react'
import NextLink from 'next/link'
import useSWR from 'swr'
import { AddOutlined} from '@mui/icons-material'
import { Box, Button, CardMedia, Chip, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Layout from '../layout'
import { FullScreenLoading } from '../../../../components/ui/fullScreenLoading'
import { IProduct } from '../../../../../../backend/src/modules/product/product.interface'

const columns: GridColDef[] = [
    {
        field: 'photoUrls', 
        headerName: 'Photo',
        renderCell: ({ row }: { row: { slug: string; name: string; photoUrls: string } }) => {
            return (
                <a href={`/products/${ row.slug }`} target='_blank' rel='noreferrer'>
                    <CardMedia 
                        component='img'
                        className='fadeIn'
                        alt={ row.name }
                        image={`${row.photoUrls}`}
                    />
                </a>
            )
        }
    },
    {
        field: 'name', 
        headerName: 'Name', 
        width: 250, 
        renderCell: ({ row }: { row: { slug: string; name: string } }) => {
            return (
                <NextLink href={`/admin/products/${ row.slug }`} passHref>
                    <Link underline='always'>
                        {row.name}
                    </Link>
                </NextLink>
            )
        }
    },
    {field: 'description', headerName: 'Description', width: 250},
    {field: 'merchant', headerName: 'Merchant', width: 250},
    {field: 'status', headerName: 'Status'},
    {field: 'stockAmount', headerName: 'Stock Amount'},
    {field: 'unitPrice', headerName: 'Unit Price'},
    {field: 'comparePrice', headerName: 'Compare Price'},
    {field: 'ratings', headerName: 'Ratings'},
]


const ProductPage = () => {

    const {data, error} = useSWR<IProduct[]>('/api/admin/products')

    const rows = useMemo(()=> { 
        if ( data ) {
            return (
                data.map((product: IProduct): IProduct => ({
                    slug: product.slug,
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
    <Layout>
        <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
            <Button
                startIcon={<AddOutlined />}
                color='secondary'
                href='/admin/products/create'
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
        
    </Layout>
  )
}

export default ProductPage