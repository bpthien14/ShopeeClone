'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Container, Grid, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { getProductById, updateProduct } from '@/apis/product.api'

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        quantity: '',
        status: 'draft' as 'active' | 'draft',
        photoUrls: ['']
    })

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getProductById(params.id)
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.unitPrice.toString(),
                    comparePrice: product.comparePrice.toString(),
                    quantity: product.stockAmount.toString(),
                    status: product.status,
                    photoUrls: product.photoUrls.length ? product.photoUrls : ['']
                })
            } catch (error) {
                console.error('Error fetching product:', error)
            }
        }
        fetchProduct()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateProduct(params.id, {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                comparePrice: Number(formData.comparePrice),
                quantity: Number(formData.quantity),
                status: formData.status,
                photoUrls: formData.photoUrls.filter(url => url.trim() !== ''),
            })
            router.push('/merchant/dashboard/product')
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }

    const handlePhotoUrlChange = (index: number, value: string) => {
        const newPhotoUrls = [...formData.photoUrls]
        newPhotoUrls[index] = value
        if (index === formData.photoUrls.length - 1 && value !== '') {
            newPhotoUrls.push('')
        }
        setFormData(prev => ({ ...prev, photoUrls: newPhotoUrls }))
    }

    return (
        <Container maxWidth={false}>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Edit Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    {/* Same form fields as create page */}
                    <Grid container spacing={3}>
                        {/* ... copy all Grid items from create page ... */}
                        <Grid item xs={12}>
                            <Button
                                color="primary"
                                size="large"
                                type="submit"
                                variant="contained"
                                sx={{ mr: 2 }}
                            >
                                Update Product
                            </Button>
                            <Button
                                color="inherit"
                                size="large"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    )
}