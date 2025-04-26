'use client';
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/apis/product.api';
import styles from '@/app/customer/dashboard/products/[id]/product.module.css';
import { toast } from 'react-toastify';

import { useCart } from '@/contexts/cart-context';

// Simple Rating Stars Component
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`${styles.star} ${star <= Math.round(rating) ? styles.filled : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
}

// Simple Product Reviews Component
function ProductReviews({ ratings = [] }: { ratings: any[] }) {
  if (ratings.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div>
      {ratings.map((rating, index) => (
        <div key={index} style={{ marginBottom: '15px', padding: '10px', borderBottom: '1px solid #eee' }}>
          <RatingStars rating={rating.rate} />
          <p style={{ marginTop: '5px' }}>{rating.description}</p>
        </div>
      ))}
    </div>
  );
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();

  console.log('Product data:', product); // Debug log to confirm data structure

  // Calculate average rating
  const avgRating =
    product.ratings && product.ratings.length > 0
      ? product.ratings.reduce((sum, rating) => sum + rating.rate, 0) / product.ratings.length
      : 0;

  // Format prices
  const formatPrice = (price: number | undefined) => {
    if (price === undefined || isNaN(Number(price))) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Calculate discount percentage if comparePrice exists
  const discountPercentage =
    product.comparePrice && product.unitPrice
      ? Math.round(((product.comparePrice - product.unitPrice) / product.comparePrice) * 100)
      : 0;

  // Format date
  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product.stockAmount || 0)) {
      setQuantity(quantity + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Thêm sản phẩm vào giỏ hàng bằng context
      await addItem({
        productId: product._id.toString(),
        quantity,
        productName: product.name,
        price: product.unitPrice,
      });

      // Hiển thị thông báo thành công sử dụng toast
      toast.success(`Added ${quantity} ${product.name} to cart`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle buy now
  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Thêm sản phẩm vào giỏ hàng
      await addItem({
        productId: product._id.toString(),
        quantity,
        productName: product.name,
        price: product.unitPrice,
      });

      // Hiển thị thông báo và chuyển hướng
      toast.success(`Added ${quantity} ${product.name} to cart`, {
        position: 'top-right',
        autoClose: 1500,
        onClose: () => router.push('/customer/dashboard/cart'),
      });
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast.error('Failed to proceed to checkout', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.productDetail}>
        <div className={styles.leftColumn}>
          {/* Ảnh sản phẩm chính */}
          {product.photoUrls && product.photoUrls.length > 0 ? (
            <img
              src={product.photoUrls[selectedImage]}
              alt={product.name}
              style={{ width: '100%', borderRadius: '4px' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '300px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              No image available
            </div>
          )}

          {/* Ảnh thumbnail */}
          {product.photoUrls && product.photoUrls.length > 1 && (
            <div style={{ display: 'flex', marginTop: '10px', gap: '10px', overflow: 'auto' }}>
              {product.photoUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.name} - ${index + 1}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #ee4d2d' : '1px solid #ddd',
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.productName}>{product.name}</div>

          <div className={styles.ratingContainer}>
            <RatingStars rating={avgRating} />
            <span>{product.ratings ? product.ratings.length : 0} reviews</span>
          </div>

          <div className={styles.priceContainer}>
            <span className={styles.price}>{formatPrice(product.unitPrice)}</span>
            {product.comparePrice > product.unitPrice && (
              <>
                <span className={styles.originalPrice}>{formatPrice(product.comparePrice)}</span>
                <span className={styles.discountBadge}>{discountPercentage}% OFF</span>
              </>
            )}
          </div>

          <div className={styles.shippingInfo}>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Status:</div>
              <div className={styles.infoValue}>{(product.stockAmount || 0) > 0 ? 'In Stock' : 'Out of Stock'}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Available:</div>
              <div className={styles.infoValue}>{product.stockAmount || 0} items</div>
            </div>
          </div>

          <div className={styles.quantityContainer}>
            <div className={styles.quantityLabel}>Quantity:</div>
            <div className={styles.quantityControls}>
              <button
                className={styles.quantityButton}
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                type="button"
              >
                -
              </button>
              <input
                className={styles.quantityInput}
                type="text"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0 && value <= (product.stockAmount || 0)) {
                    setQuantity(value);
                  }
                }}
              />
              <button
                className={styles.quantityButton}
                onClick={increaseQuantity}
                disabled={quantity >= (product.stockAmount || 0)}
                type="button"
              >
                +
              </button>
              <span className={styles.stockInfo}>{product.stockAmount || 0} available</span>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.addToCartButton}
              onClick={handleAddToCart}
              disabled={(product.stockAmount || 0) <= 0}
              type="button"
            >
              <span className={styles.cartIcon}>🛒</span> Add to Cart
            </button>
            <button
              className={styles.buyNowButton}
              onClick={handleBuyNow}
              disabled={(product.stockAmount || 0) <= 0}
              type="button"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Phần mô tả sản phẩm */}
      <div className={styles.productDescription}>
        <h2 className={styles.sectionTitle}>Product Description</h2>
        <div className={styles.descriptionContent}>{product.description}</div>
      </div>

      {/* Phần đánh giá sản phẩm */}
      <div className={styles.productDescription}>
        <h2 className={styles.sectionTitle}>Customer Reviews</h2>
        <ProductReviews ratings={product.ratings || []} />
      </div>
    </div>
  );
}
