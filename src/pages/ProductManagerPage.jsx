import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductEditor from './ProductEditor';

export default function ProductManagerPage() {
    const [editingProduct, setEditingProduct] = useState(null); // null 表示不在编辑

    return editingProduct ? (
        <ProductEditor product={editingProduct} onBack={() => setEditingProduct(null)} />
    ) : (
        <ProductList onEdit={setEditingProduct} />
    );
}
