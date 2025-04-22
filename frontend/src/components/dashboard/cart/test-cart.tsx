'use client';

import * as React from 'react';
import { useState } from 'react';
import { getCart } from '@/apis/cart.api';
import { Button } from '@mui/material';

export function TestCart() {
    const [loading, setLoading] = useState(false);

    const handleTestGetCart = async () => {
        setLoading(true);
        try {
            const cart = await getCart();
        } catch (error) {
            console.error('Failed to get cart:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            onClick={handleTestGetCart}
            disabled={loading}
        >
            Test Get Cart
        </Button>
    );
}