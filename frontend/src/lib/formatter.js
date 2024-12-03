Number.prototype.formatCurrency = function (currencyCode) {
    return Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: currencyCode,
    }).format(this);
}