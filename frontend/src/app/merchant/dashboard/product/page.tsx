'use client'
import { useMemo } from 'react'
import * as React from 'react'
import NextLink from 'next/link'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { AddOutlined} from '@mui/icons-material'
import { Button, CardMedia, Chip, Grid, Link } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { Container, Typography, Box } from '@mui/material';
import { FullScreenLoading } from '../../../../components/ui/fullScreenLoading'
import { Product } from '@/apis/product.api'
import axiosInstance from '@/apis/axios'

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
        <Link component={NextLink} href={`/merchant/product/${params.row._id}`} underline='always'>
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

// SWR fetcher function
const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

export default function ProductPage(): React.JSX.Element {
    const router = useRouter()
    const {data, error} = useSWR<Product[]>('/products', fetcher)

    const rows = useMemo(()=> { 
        if (data) {
            return data.map((product: Product) => ({
                id: product._id,
                photoUrls: [product.photoUrls[0]],
                name: product.name,
                description: product.description,
                unitPrice: product.unitPrice,
                comparePrice: product.comparePrice,
                stockAmount: product.stockAmount,
                status: product.status,
                ratings: product.ratings?.length || 0,
                merchant: product.merchant,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            }))
        }
        return [];
    }, [data]);

    const handleCreateProduct = () => {
        router.push('/merchant/dashboard/product/create')
    }

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
                            onClick={handleCreateProduct}
                        >
                            Create Product
                        </Button>
                    </Box>
                    {!data && !error 
                        ? (<FullScreenLoading />) 
                        : ( 
                            <Grid container className='fadeIn' item xs={12} sx={{ height:650, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { pageSize: 10 },
                                        },
                                    }}
                                    pageSizeOptions={[10]}
                                />
                            </Grid>
                        )}    
                </Typography>
            </Box>
        </Container>
    )
}

