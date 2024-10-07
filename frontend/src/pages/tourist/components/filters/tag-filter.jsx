import useRouter from '@/hooks/useRouter';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect, Fragment } from 'react';
import { getTags } from '../../api/apiService';

export function TagFilter() {
    const [tags, setTags] = useState([]);
    const { searchParams, navigate, location } = useRouter();

    useEffect(() => {
        getTags().then(tags => tags.map((t) => t.name)).then(setTags);
    }, []);

    const handleChange = (value) => {
        value ? searchParams.set('tag', value) : searchParams.delete('tag');
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    return <div className="mt-4">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold mb-2">Tags</h3>
            {searchParams.get('tag') &&
                <Label
                    className="cursor-pointer underline font-normal h-[24px]"
                    onClick={() => handleChange(null)}
                >
                    Clear
                </Label>
            }
        </div>
        <RadioGroup value={searchParams.get('tag')} onValueChange={handleChange}>
            <div className="space-y-2">
                {tags.map((value, index) => (
                    <Fragment key={index}>
                        <div className="flex items-center">
                            <RadioGroupItem value={value} id={index} />
                            <Label className="ml-2">{value}</Label>
                        </div>
                    </Fragment>)
                )}
            </div>
        </RadioGroup>
    </div>
}