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
        price: 0,
        comparePrice: 0,
        quantity: 0,
        status: 'draft' as 'draft' | 'active',
        photoUrls: ['']
    })

    useEffect(() => {
        const fetchProduct = async () => {
            const product = await getProductById(params.id)
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                comparePrice: product.comparePrice,
                quantity: product.quantity,
                status: product.status,
                photoUrls: product.photoUrls
            })
        }
        fetchProduct()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateProduct(params.id, formData)
        router.push('/products')
    }

    const handlePhotoUrlChange = (index: number, value: string) => {
        const newPhotoUrls = [...formData.photoUrls]
        newPhotoUrls[index] = value
        setFormData(prev => ({ ...prev, photoUrls: newPhotoUrls }))
    }

    return (
        <Container maxWidth={false}>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Edit Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                required
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Compare Price"
                                name="comparePrice"
                                type="number"
                                required
                                value={formData.comparePrice}
                                onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: parseFloat(e.target.value) }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Quantity"
                                name="quantity"
                                type="number"
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    label="Status"
                                    onChange={(e) => setFormData(prev => ({ 
                                        ...prev, 
                                        status: e.target.value as 'active' | 'draft' 
                                    }))}
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Photo URLs section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Product Images
                            </Typography>
                            {formData.photoUrls.map((url, index) => (
                                <TextField
                                    key={index}
                                    fullWidth
                                    label={`Image URL ${index + 1}`}
                                    value={url}
                                    onChange={(e) => handlePhotoUrlChange(index, e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            ))}
                        </Grid>
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