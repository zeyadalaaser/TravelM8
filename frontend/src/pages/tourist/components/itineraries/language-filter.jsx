import useRouter from '@/hooks/useRouter';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Fragment } from 'react';

export function LanguageFilter() {
  const { searchParams, navigate, location } = useRouter();

  const handleChange = (value) => {
    value ? searchParams.set('language', value) : searchParams.delete('language');
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  return <div className="mt-4">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold mb-2">Categories</h3>
      {searchParams.get('language') &&
        <Label
          className="cursor-pointer underline font-normal h-[24px]"
          onClick={() => handleChange(null)}
        >
          Clear
        </Label>
      }
    </div>
    <RadioGroup value={searchParams.get('language')} onValueChange={handleChange}>
      <div className="space-y-2">
        {['Arabic', 'English', 'German'].map((value, index) => (
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