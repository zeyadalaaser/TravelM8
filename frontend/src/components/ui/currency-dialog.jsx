
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useCurrency } from '../../hooks/currency-provider';

async function getExchangeRates() {
    try {
        const response = await axios.get(
            "https://api.exchangerate-api.com/v4/latest/USD"
        );
        return response.data.rates;
    } catch (error) {
        return {};
    }
}

async function getCurrencies(rates) {
    try {
        const response = await axios.get(
            "https://openexchangerates.org/api/currencies.json"
        );
        const filteredCurrencies = Object.keys(response.data).filter(currencyCode => rates[currencyCode]);
        return filteredCurrencies.map(currencyCode => ({
            code: currencyCode,
            name: response.data[currencyCode],
        }));
    } catch (error) {
        return {};
    }
}

export function CurrencyDialog({ isOpen, setIsOpen }) {
    const { changeCurrency } = useCurrency();
    const [exchangeRates, setExchangeRates] = useState({});
    const [currencies, setCurrencies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const rates = await getExchangeRates();
            setExchangeRates(rates);

            const currencies = await getCurrencies(rates);
            setCurrencies(currencies);
        }

        fetchData();
    }, []);

    const filteredCurrencies = currencies.filter(currency =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const setCurrency = (code) => {
        const rate = exchangeRates[code];
        changeCurrency(code, rate);
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="z-50 max-w-[90vw] w-full max-h-[90vh] h-full flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Currency</DialogTitle>
                </DialogHeader>
                <div className="relative mb-6 mx-auto w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search currencies..."
                        className="pl-10 py-6 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-y-auto pr-4 -mr-4">
                    <div className="grid grid-cols-5 gap-2">
                        {filteredCurrencies.map((currency) => (
                            <Button
                                key={currency.code}
                                variant="outline"
                                className="h-auto py-4 px-2 flex flex-col items-center justify-center text-center"
                                onClick={() => setCurrency(currency.code)}                        
                            >
                                <span className="font-medium text-sm">{currency.code}</span>
                                <span className="text-xs text-muted-foreground mt-1">{currency.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}