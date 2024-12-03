Number.prototype.formatCurrency = function (currencyCode) {
    try {
        return Intl.NumberFormat("en-US", {
            style: 'currency',
            currency: currencyCode,
        }).format(this);
    }
    catch {
        return `${currencyCode} ${this}`
    }
}