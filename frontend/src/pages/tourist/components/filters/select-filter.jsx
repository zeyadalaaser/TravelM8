import useRouter from '@/hooks/useRouter';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect, Fragment } from 'react';

export function SelectFilter({ name, paramName, getOptions }) {
    const [options, setOptions] = useState([]);
    const { searchParams, navigate, location } = useRouter();

    useEffect(() => {
        getOptions().then(setOptions);
    }, []);

    const handleChange = (value) => {
        value ? searchParams.set(paramName, value) : searchParams.delete(paramName);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    return <div className="mt-4">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold mb-2">{name}</h3>
            {searchParams.get(paramName) &&
                <Label
                    className="cursor-pointer underline font-normal h-[24px]"
                    onClick={() => handleChange(null)}
                >
                    Clear
                </Label>
            }
        </div>
        <RadioGroup value={searchParams.get(paramName)} onValueChange={handleChange}>
            <div className="space-y-2">
                {options.map((value, index) => (
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