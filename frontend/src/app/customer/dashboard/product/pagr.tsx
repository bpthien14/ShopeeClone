import React, { useMemo } from 'react'
import NextLink from 'next/link'
import useSWR from 'swr'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
import { Box, Button, CardMedia, Chip, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { AdminLayout } from '../../../components/layout'
import { FullScreenLoading } from '../../../components/ui'
import { IProduct } from '../../../interfaces'

const columns: GridColDef[] = [
    {
        field: 'img', 
        headerName: 'Foto',
        renderCell: ({ row }) => {
            return (
                <a href={`/products/${ row.slug }`} target='_blank' rel='noreferrer'>
                    <CardMedia 
                        component='img'
                        className='fadeIn'
                        alt={ row.title }
                        image={`${row.img}`}
                    />
                </a>
            )
        }
    },
    {
        field: 'title', 
        headerName: 'Title', 
        width: 250, 
        renderCell: ({ row }) => {
            return (
                <NextLink href={`/admin/products/${ row.slug }`} passHref>
                    <Link underline='always'>
                        {row.title}
                    </Link>
                </NextLink>
            )
        }
    },
    {field: 'gender', headerName: 'Genero'},
    {field: 'type', headerName: 'Tipo'},
    {field: 'inStock', headerName: 'Inventario'},
    {field: 'price', headerName: 'Precio'},
    {field: 'sizes', headerName: 'Tallas', width: 250},
]


const ProductPage = () => {

    const {data, error} = useSWR<IProduct[]>('/api/admin/products')

    const rows = useMemo(()=> { 
        if ( data ) {
            return (
                data.map( product => ({
                    id: product._id,
                    img: product.images[0],
                    title: product.title,
                    gender: product.gender,
                    type: product.type,
                    inStock: product.inStock,
                    price: product.price,
                    sizes: product.sizes.join(', '),
                    slug: product.slug
                })
            ))
        }
    }, [data])
  return ( 
    <AdminLayout
        title={`Productos (${ data ? data?.length : ''})`}
        subTitle='Mantenimiento de productos'
        icon={<CategoryOutlined/>}
    >
        <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
            <Button
                startIcon={<AddOutlined />}
                color='secondary'
                href='/admin/products/new'
            >
                Crear producto
            </Button>
        </Box>
        {!data && !error 
            ? (<FullScreenLoading />) 
            : ( <Grid container className='fadeIn' item xs={12} sx={{ height:650, width: '100%' }}>
                    <DataGrid
                        rows={ rows }
                        columns={ columns }
                        pageSize={10}
                        rowsPerPageOptions={ [10] }
                    />
                </Grid>)}
        
    </AdminLayout>
  )
}

export default ProductPage