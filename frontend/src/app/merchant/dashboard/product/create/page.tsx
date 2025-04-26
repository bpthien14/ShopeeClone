'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import { createProduct } from '@/apis/product.api'

export default function CreateProductPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        photoUrls: ['https://example.com/placeholder.jpg'] // Default placeholder
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createProduct({
                name: formData.name,
                description: formData.description,
                unitPrice: Number(formData.price),
                comparePrice: Number(formData.price) * 1.1,
                stockAmount: Number(formData.quantity),
                status: 'active',
                photoUrls: formData.photoUrls,
                ratings: [],
                merchant: '', // Will be set by backend from auth token
                createdAt: new Date(),
                updatedAt: new Date(),
                _id: ''
            })
            router.push('/merchant/dashboard/product')
        } catch (error) {
            console.error('Error creating product:', error)
        }
    }

    return (
        <Container maxWidth={false}>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create New Product
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
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
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
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                color="primary"
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Create Product
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    )
}