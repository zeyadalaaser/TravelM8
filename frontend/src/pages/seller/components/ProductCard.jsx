import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ShoppingCart, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";


const ProductCard = ({ product, onEdit, onDelete, onToggleArchive, onViewDetails }) => {
  return (
    <Card className={`w-full overflow-hidden ${product.isArchived ? "opacity-60" : ""}`}>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-end items-center mb-2">
          <Button variant="ghost" size="icon" onClick={() => onViewDetails(product)}>
            <Eye className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Image Section */}
      <div className="relative w-[300px] h-[300px] mx-auto mt-4 mb-2">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-md"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>

      {/* Product Name Section */}
      <h2 className="text-left text-xl font-bold mb-2 pl-4">{product.name}</h2>

      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-4  ">{product.description}</p>

        {/* Sold and Stock Section */}
        <div className="flex flex-col text-sm text-gray-500 mb-4">
          <div className="flex items-center mb-3">
            <ShoppingCart className="w-4 h-4 mr-1" />
            <span>Sold: {product.sales}</span>
          </div>
          <div>
            <span>In stock: {product.quantity}</span>
          </div>
        </div>

        <div className="text-lg font-semibold mb-4">
          Price: ${product.price.toFixed(2)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col items-center">
        {/* Switch Section */}
        <div className="flex items-center space-x-2 mb-4">
        <Switch
  id={`archive-${product._id}`}
  checked={product.archived}
     onCheckedChange={(checked) => onToggleArchive(product._id, checked)} // Pass the correct arguments
/>
          <Label htmlFor={`archive-${product._id}`}>
            {product.archived ? "Archived" : "Unarchived"}
          </Label>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-between space-x-4">
          {/* Edit Button */}
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>

          {/* Delete Button */}
          <Button variant="destructive" size="sm" onClick={() => onDelete(product._id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
