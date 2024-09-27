import Activity from "../models/activityModel.js";


const createNewActivity = async(req,res) => {
    try{
		const {
			title,
			description,
			location,
			price,
			date,
			category,
			tags = null,
			discount = 0,
			isBookingOpen = true,
			image = null
		} = req.body;

		const newActivity = await Activity.create({
			title,
			description,
			location,
			price,
			date,
			category,
			tags,
			discount,
			isBookingOpen,
			image,
			advertiserId: 1 // should be initialized according to the advertiser that created it
		});
		res.status(200).json( {success: true, message: "Activity Created!", data: newActivity} );
	}catch(error){
		console.log("error in creating activity", error.message);
		res.status(500).json( {success: false, message: "server error"} );
	}
};

const getAllActivities = async (req,res) => {
	try{
		const activities = await Activity.find({});
		res.status(200).json( {success: true, data: activities} );
	}catch(error){
		console.log("error in fetching activities", error.message);
		res.status(500).json( {success: false, message: "server error"} );
	}
};

const getActivityById = async(req, res) => {
    const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Activity Id" });
	}

};

const updateActivity = async(req, res) => {
    const { id } = req.params;
	const activity = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Activity Id" });
	}

};

const deleteActivity = async(req, res) => {
    const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Activity Id" });
	}

};

export {
    createNewActivity, 
    getAllActivities, 
    getActivityById,
    updateActivity,
    deleteActivity
};
