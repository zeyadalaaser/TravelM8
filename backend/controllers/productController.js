import mongoose from 'mongoose';  //to communicate with the db
import Product from '../models/productModel.js';
import { createRatingStage } from '../helpers/aggregationHelper.js';


export const createProduct = async (req, res) => {
  try {
    const { name, image, price, quantity, description } = req.body;

    const newProduct = new Product(
      {
        name,
        image,
        price,
        quantity,
        description,
        sellerId: req.user.userId
      }
    );


    const savedProduct = await newProduct.save();


    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const archiveProduct = async (req, res) => {
  try {
    const{id}= req.params;
    console.log(`Archiving product with ID: ${id}`);

    const ArchivedProduct = await Product.findByIdAndUpdate(
      id,
      {archived: true}, 
      {new: true}
    );

    if(!ArchivedProduct){
      return res.status(404).json({ message: 'Product not found'});
    }
    res.status(200).json({ message: 'Product archived successfully'});
  } catch(error){
    res.status(500).json({message: 'error occured ...'});
  }
  }

export const unarchiveProduct = async (req, res) =>{
  try{
    const {id} = req.params;
    const unArchivedProduct = await Product.findByIdAndUpdate(id, {archived: false}, {new: true});

    if(!unArchivedProduct){
      return res.status(404).json({messege: "Product not found"});
    }
    res.status(200).json({messege: 'Product unarchived successfully'});
  } catch (error){
    res.status(500).json({messege: 'Error occured'});
  }
}


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    // Find the product by ID and remove it
    const deletedProduct = await Product.findByIdAndDelete(id);

    // If no product found, return a 404 error
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPopulateStage = (minRating) => {
  const ratingStage = createRatingStage("Product", false, minRating)
  return [
    ...ratingStage,
    {
      $lookup: {
        from: "sellers",
        localField: "sellerId",
        foreignField: "_id",
        as: "seller"
      }
    },
    {
      $unset: "sellerId"
    },
    {
      $addFields: {
        seller: { $ifNull: [{ $arrayElemAt: ["$seller", 0] }, null] } // Set seller to null if no match
      }
    }
  ];
}

export const getAllProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, sortByRating, search, minRating, sortBy, order } = req.query;  //here ba-retrieve el query parameter (min,max) and sorting that the user will put in the request
    const populateStage = createPopulateStage(minRating);
    const userRole = req.user?.role; //user role available on req.user ? 

    //My Filter Logic
    let filter = {};   //this is empty filter object and if user did not provide min and max, will retrieve all products
    //if(userRole !== 'admin' && userRole !== 'seller'){ //kda admins and sellers see all products archived or not
      //filter.archived = false; // toursits only see unarchived products
   // }
    if (minPrice || maxPrice) {
      filter.price = {}; //ba-initialize empty price filter object
      if (minPrice) filter.price.$gte = parseFloat(minPrice);  // Price >= minPrice
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);  // Price <= maxPrice
    }

    //Search Logic 
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // 'i' makes it case-insensitive; ya3ny masln product and PRODUCT ; bei-treat the uppercase and lowercase the same 
    }

    //Sorting Logic
    let sortCondition = {};
    if (sortByRating === 'asc') {
      sortCondition.averageRating = 1;  // Ascending order; 1 means in mongodb ascending 
    } else if (sortByRating === 'desc') {
      sortCondition.averageRating = -1; // Descending order; -1 means in mongodb descending 
    }

    if (sortBy) {
      sortCondition[sortBy] = order === "desc" ? -1 : 1;
    }

    const aggregationPipeline = [
      { $match: filter },
      ...populateStage,
      ...(sortBy ? [{ $sort: sortCondition }] : []),
    ];

    // Execute the aggregation pipeline
    const products = await Product.aggregate(aggregationPipeline);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("error in ftching products:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Product not found; invalid" });
    }


    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document with updated data 
      runValidators: true // Validate the data against the schema
    });

    //law mafeesh product
    //if (!updatedProduct) {
    //return res.status(404).json({ message: 'Product not found' });
    //}

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  const userId = req.user?.userId;
  try {
    let Places;
    Places = await Product.find({ sellerId: userId });
    if (Places.length == 0)
      res.status(204);
    else
      res.status(200).json({ Places });
  } catch (error) {
    res.status(400).json({ message: "enter a valid id" });
  }
};

