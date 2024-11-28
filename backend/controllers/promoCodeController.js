import PromoCode from "../models/promoCodeModel";

// Create a new promo code
export const createPromoCode = async (req, res) => {
  const { promoCode, value } = req.body;
  try {
    const newPromoCode = new PromoCode({ promoCode, value });
    await newPromoCode.save();
    res.status(201).json({ message: 'Promo code created successfully!', promoCode: newPromoCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all promo codes
export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPromoCode = async (req, res) => {
    const {promoCode} = req.body;
  try {
    const promo = await PromoCode.find({promoCode : promoCode});
    if (!promo) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json(promo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a promo code value by ID
export const updatePromoCode = async (req, res) => {
  const { value } = req.body;
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { value },
      { new: true, runValidators: true }
    );
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json({ message: 'Promo code updated successfully!', promoCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a promo code by ID
export const deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json({ message: 'Promo code deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Promo code validity check
export const checkPromoCodeValidity = async (req, res) => {
  const { promoCode } = req.body;
  try {
    const foundPromo = await PromoCode.findOne({ promoCode });
    if (!foundPromo) return res.status(404).json({ message: 'Invalid promo code' });
    res.status(200).json({ message: 'Promo code is valid!', value: foundPromo.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
