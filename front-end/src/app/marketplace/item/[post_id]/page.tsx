'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPostById, Post } from '../../../../gateway/marketplace';

export default function ItemDetailsPage() {
  const params = useParams();
  const { post_id } = params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (post_id) {
      fetchPostDetails(post_id as string);
    }
  }, [post_id]);

  const fetchPostDetails = async (id: string) => {
    try {
      setLoading(true);
      const postData = await getPostById(id);
      setPost(postData);
      if (postData.images && postData.images.length > 0) {
        setSelectedImage(postData.images[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cozy-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cozy-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-cozy-background text-red-500 text-center py-12">{error}</div>;
  }

  if (!post) {
    return <div className="min-h-screen bg-cozy-background text-center py-12">Anúncio não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-cozy-background text-cozy-text p-8 font-cozy">
      <div className="max-w-6xl mx-auto bg-cozy-card rounded-lg shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="bg-cozy-input rounded-lg mb-4 flex items-center justify-center h-96">
            <img src={selectedImage || 'https://via.placeholder.com/400x400?text=No+Image'} alt={post.title} className="max-h-full max-w-full object-contain rounded-lg" />
          </div>
          <div className="flex space-x-2">
            {post.images.map((img, index) => (
              <div key={index} 
                   className={`w-20 h-20 bg-cozy-input rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-cozy-primary' : 'border-transparent'}`}
                   onClick={() => setSelectedImage(img)}>
                <img src={img} alt={`${post.title} thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Item Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cozy-title mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className={`text-sm font-bold px-3 py-1 rounded-full bg-blue-200 text-blue-800`}>{post.category}</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full bg-green-200 text-green-800`}>{post.condition}</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full bg-purple-200 text-purple-800`}>{post.rarity}</span>
            </div>
            <p className="text-cozy-text-secondary text-lg mb-6">{post.description}</p>
          </div>

          <div>
            <div className="text-5xl font-bold text-cozy-primary mb-6">{formatPrice(post.price)}</div>
            <div className="flex flex-col space-y-4">
              <button className="w-full px-6 py-4 bg-cozy-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                Comprar Agora
              </button>
              {post.tradeable && (
                <button className="w-full px-6 py-4 bg-cozy-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                  Propor Troca
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
