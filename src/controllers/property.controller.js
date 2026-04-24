const propertyModel = require("../models/property.model");
const {uploadFile} = require("../services/storage.service");

const createProperty = async (req,res)=>{
    const {title, description, location, price, amenities, availableRooms, status} = req.body;
    try{
        if(!req.files || req.files.length === 0){
            return res.status(400).json({ message: "At least one image is required" });
        }

        // Upload all files to ImageKit and construct the array of image objects
        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadFile(file);
                return {
                    title: title, 
                    uri: result.url,
                    ownerId: req.user._id
                };
            })
        );

        const property = await propertyModel.create({
            title,
            description,
            location,
            price,
            amenities,
            ownerId: req.user._id, 
            images: uploadedImages,
            availableRooms,
            status
        });

        return res.status(201).json({
            message: "Property created successfully",
            property
        });
        

    }catch(err){
        return res.status(500).json({
            message: "Error in property creation",
            error: err.message
        });
    }
}

const updatePropertyById = async (req,res)=>{
    const id = req.params.id;
    try{
        const property = await propertyModel.findById(id);
        
        if(!property){
            return res.status(404).json({
                message: "Property not found"
            })
        }
        if(property.ownerId.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message: "Forbidden: U are Not Allowed"
            })
        }

        if (req.body.ownerId) {
            delete req.body.ownerId;
        }
        let updateData = { ...req.body }; 

            if(req.file){
                const result = await uploadFile(req.file);
                const newImage = {
                    title: req.body.title || property.title,
                    uri: result.url,
                    ownerId: req.user._id
                };
                delete updateData.images;
                updateData.$push = { images: newImage };
            } else {
               delete updateData.images;
            }

        const updatedProperty = await propertyModel.findByIdAndUpdate(id, updateData, {new: true});
        return res.status(200).json({
            message: "Property updated successfully",
            updatedProperty
        })

    }catch(err){
        return res.status(500).json({
            message: "Error in property update",
            error: err.message
        })
    }
}

async function getAllProperties(req,res){
    try{
        const properties = await propertyModel.find();
        return res.status(200).json({
            message: "Properties fetched successfully",
            properties
        })
    }catch(err){
        return res.status(500).json({
            message: "Error in fetching properties",
            error: err.message
        })
    }
}

async function getAllPropertiesById(req,res){
    try{
        const id = req.params.id;
        const property = await propertyModel.findById(id);
        if(!property){
            return res.status(404).json({
                message: "Property not found"
            })
        }
        return res.status(200).json({
            message: "Property fetched successfully",
            property
        })
    }catch(err){
        return res.status(500).json({
            message: "Error in fetching property",
            error: err.message
        })
    }
}

async function deletePropertyById(req,res){
    try{
        const id = req.params.id;
        const property = await propertyModel.findById(id);

        if(!property){
            return res.status(404).json({
                message: "Property not found"
            })
        }

        // Ensure the logged-in owner is the one who created the property
        if(property.ownerId.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message: "Forbidden: You are not allowed to delete this property"
            })
        }

        await propertyModel.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Property deleted successfully",
            property
        })
    }catch(err){
        return res.status(500).json({
            message: "Error in deleting property",
            error: err.message
        })
    }
}

module.exports = {createProperty, getAllProperties, getAllPropertiesById, updatePropertyById , deletePropertyById};