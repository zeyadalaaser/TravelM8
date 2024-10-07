import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Stars } from "../stars";

export function Products({ products }) {
    return <div className="space-y-4">
        {products.map((product, index) => (
            <Card key={index}>
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full md:w-2/3 p-4">
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <div className="flex items-center mb-2">
                            <Stars rating={product.averageRating} />
                            <span className="ml-2 text-sm text-gray-600">{product.totalRatings} reviews</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center mb-2">
                            <span className="text-sm font-semibold mr-2">Seller:</span>
                            <Badge variant="outline">{product.seller?.name}</Badge>
                        </div>
                        <div className="text-xl font-bold">
                            ${product.price}
                        </div>
                    </div>
                </div>
            </Card>
        ))}
    </div>
}