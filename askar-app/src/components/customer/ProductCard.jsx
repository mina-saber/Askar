import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, showSalePercent = false }) {
  const categoryName = product.categories?.name || product.category || ''
  const mainImage = product.images?.[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `/gallary/${product.images[0]}`)
    : '/gallary/images.jpg'

  return (
    <div className="product-card group" id={`product-${product.id}`}>
      <Link to={`/shop`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
          <img
            src={mainImage}
            alt={product.name}
            className="product-image w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          {showSalePercent && product.is_sale && product.discount_percentage ? (
            <span className="badge-sale-red">
              SALE -{Math.round(product.discount_percentage)}%
            </span>
          ) : (
            <>
              {product.is_new && <span className="badge-new">NEW</span>}
              {product.is_sale && <span className="badge-sale">SALE</span>}
            </>
          )}

          {/* Out of Stock Overlay */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-bold tracking-wider uppercase">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          {categoryName && (
            <p className="text-xs text-gray-400 uppercase tracking-wider">{categoryName}</p>
          )}
          <h3 className="text-sm font-bold text-black uppercase tracking-wide">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {product.is_sale && product.sale_price ? (
              <>
                <span className={`text-sm font-bold ${showSalePercent ? 'text-accent' : 'text-orange'}`}>
                  ${Number(product.sale_price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-black">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
