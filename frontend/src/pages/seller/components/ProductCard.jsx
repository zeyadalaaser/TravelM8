import React from "react";
import { ArchiveIcon, EditIcon, Tag, Trash2, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";



const ProductCard = ({ product, onEdit, onDelete, onToggleArchive }) => {
    return (
      <Card key={product._id} className="shadow-lg rounded-lg bg-white overflow-hidden hover:shadow-xl transition-shadow duration-200">
        <CardHeader>
        <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <CardTitle className="text-xl font-semibold text-gray-900">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {/* Product Image */}

          
          {/* Product Info */}
          <div className="text-sm text-gray-600">
            <p className="font-bold text-gray-900">Price: USD {parseFloat(product.price).toFixed(2)}</p>
            <p className="mb-2">{product.description}</p>
            <p className="text-gray-700">Sold: {product.sales}</p>
            <p className="text-gray-700">Remaining Stock: {product.quantity}</p>
          </div>
  
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button onClick={() => onEdit(product)} className="border border-gray-200 text-gray-600" variant="outline">
            <EditIcon className="mr-2 h-4 w-4" />  Edit
            </Button>
            <Button
              onClick={() => onToggleArchive(product._id, product.archived)}
              className={`size="sm" ${product.archived ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white `}
            >
                <ArchiveIcon className="mr-2 h-4 w-4"/>
              {product.archived ? 'Unarchive' : 'Archive'}
            </Button>
            <Button
              onClick={() => onDelete(product._id)}
              className="bg-red-600 hover:bg-red-800" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  export default ProductCard;
  