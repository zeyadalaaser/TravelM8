import useRouter from '@/hooks/useRouter';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from 'react';
import { getCategories } from '../../api/apiService';

export function CategoryFilter() {
    const categories = getCategories();
    console.log(categories);

    const { searchParams, navigate, location } = useRouter();

    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        //setSelectedCategory(searchParams.get('minRating')); 
    }, [searchParams]);

    const handleChange = (value) => {
        setSelectedCategory(value);

        //value ? searchParams.set('minRating', value) : searchParams.delete('minRating');
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    return <div className="mt-4">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold mb-2">Categories</h3>
            {selectedCategory &&
                <Label
                    className="cursor-pointer underline font-normal h-[24px]"
                    onClick={() => handleChange(null)}
                >
                    Clear
                </Label>
            }
        </div>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="space-y-2">
                <div className="flex items-center">
                  <RadioGroupItem value="Passes" id="passes" />
                  <Label htmlFor="passes" className="ml-2">Passes</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="Observation Decks" id="observation-decks" />
                  <Label htmlFor="observation-decks" className="ml-2">Observation Decks</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="Zoos" id="zoos" />
                  <Label htmlFor="zoos" className="ml-2">Zoos</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="Combo" id="combo" />
                  <Label htmlFor="combo" className="ml-2">Combo</Label>
                </div>
              </div>
            </RadioGroup>
    </div>
}