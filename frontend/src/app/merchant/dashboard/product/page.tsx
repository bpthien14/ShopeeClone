'use client'
import React, { useMemo, useState } from 'react'
import NextLink from 'next/link'
import useSWR, { mutate } from 'swr'
import { AddOutlined, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { Button, CardMedia, Chip, Grid, Link, IconButton } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Container, Typography, Box } from '@mui/material';
import Layout from '../layout'
import { FullScreenLoading } from '../../../../components/ui/fullScreenLoading'
import { Product } from '@/apis/product.api'
import axiosInstance from '@/apis/axios'
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/apis/product.api'
import DeleteProductDialog from '../../../../components/dashboard/product/deleteDialog'
import { toast } from 'react-toastify'

// SWR fetcher function
const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

export default function ProductPage(): React.JSX.Element {
    const {data, error} = useSWR<Product[]>('/products', fetcher)
    const router = useRouter()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string} | null>(null)

    // Move columns definition inside component
    const columns: GridColDef[] = useMemo(() => [
        {field: 'photoUrls', headerName: 'Image', width: 100, renderCell: (params: { row: { name: string | undefined; photoUrls: (string | undefined)[] } }) => (
            <CardMedia
                component='img'
                alt={params.row.name}
                image={params.row.photoUrls[0]}
                sx={{ borderRadius: 1, height: 50, width: 50 }}
            />
        )},
        {field: 'name', headerName: 'Name', width: 250, renderCell: (params: { row: { _id: any; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined } }) => (
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
        {field: 'actions', headerName: 'Actions', width: 150, renderCell: (params: { row: { _id: string, name: string } }) => (
            <>
                <IconButton 
                    onClick={() => handleEdit(params.row._id)}
                    color="primary"
                >
                    <EditIcon />
                </IconButton>
                <IconButton 
                    onClick={() => handleDeleteClick({ 
                        id: params.row._id, 
                        name: params.row.name 
                    })}
                    color="error"
                >
                    <DeleteIcon />
                </IconButton>
            </>
        )},
    ], []) // Empty dependency array since these functions won't change

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
        router.push('/merchant/dashboard/product/create');
    }

    const handleEdit = async (productId: string) => {
        try {
            router.push(`/merchant/dashboard/product/edit/${productId}`)
        } catch (error) {
            toast.error('Error navigating to edit page')
            console.error('Error editing product:', error)
        }
    }

    const handleDeleteClick = (product: {id: string, name: string}) => {
        setSelectedProduct(product)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (selectedProduct) {
            try {
                await deleteProduct(selectedProduct.id)
                setDeleteDialogOpen(false)
                toast.success('Product deleted successfully')
                // Refresh data using SWR
                mutate('/products')
            } catch (error) {
                toast.error('Error deleting product')
                console.error('Error deleting product:', error)
            }
        }
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
            <DeleteProductDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                productName={selectedProduct?.name || ''}
            />
        </Container>
    )
}

