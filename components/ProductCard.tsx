import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const titleWords = product.title.split(' ').slice(0, 2).join(' ');

  return (
    <Link href={`/products/${product._id}`} className="product-card transition-transform transform hover:scale-105">
      <div className="product-card_img-container">
        <Image 
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>

      <h3 className="product-title">{titleWords}...</h3> {/* Title truncated */}

      <div className="flex flex-col mt-2"> {/* Stack price information */}
        <div className="bg-gray-200 p-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <p className={`text-lg font-medium ${product.currentPrice > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {product.currentPrice > 0 ? 'Available' : 'Out of Stock'}
          </p>
        </div>
        
        <div className="bg-gray-200 p-2 rounded-lg shadow-md transition-transform transform hover:scale-105 mt-1">
          <p className="text-black text-lg font-semibold">
            {product.currentPrice > 0 
              ? <><span>{product.currency}</span><span>{product.currentPrice}</span></> 
              : <span className="text-black-500">N/A</span>} {/* Price displayed or N/A */}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
