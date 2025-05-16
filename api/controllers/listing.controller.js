import Listing from "../models/listing.model.js"


export const createListing = async (req, res, next) => {
    try {
        console.log(req.body)
        const listing = await Listing.create(req.body);
        console.log(listing)
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing) {
            return next(errorHandler(404, "Listing not found"))
        }

        if (listing.userRef !== req.user.id) {
            return next(errorHandler(403, "You can only delete your own listings"))
        }

        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json({success: true, message: 'Listing deleted successfully!'})
    } catch(error) {
        next(error)
    }
}